import { webview } from '@kit.ArkWeb';
import { BusinessError } from '@kit.BasicServicesKit';
import { BridgeContext } from './BridgeContext';
import { BridgeLogger } from './BridgeLogger';
import { BridgeRegistry, BridgeEventSink, BridgeBinarySink } from './BridgeRegistry';
import { PortChannel } from './PortChannel';
import {
  BridgeAction,
  BridgeBinAck,
  BridgeCaps,
  BridgeCode,
  BridgeEnvelope,
  BridgeHelloData,
  BridgeOptions,
  BRIDGE_BIN_ACK_EVENT,
  BRIDGE_PROTOCOL_VERSION,
  BRIDGE_RECEIVE_FN,
  BRIDGE_SERVER_VERSION
} from './BridgeTypes';

const TAG: string = 'BridgeCore';

/** BridgeContext 实现：resolve/reject 恰好一次。 */
class BridgeContextImpl implements BridgeContext {
  readonly method: string;
  readonly id: number;
  private core: BridgeCore;
  private done: boolean = false;

  constructor(core: BridgeCore, method: string, id: number) {
    this.core = core;
    this.method = method;
    this.id = id;
  }

  resolve(dataJson: string): void {
    if (this.done) {
      this.core.logger.warn(TAG, `duplicate resolve ignored, method=${this.method} id=${this.id}`);
      return;
    }
    this.done = true;
    this.core.finishInvoke(this.id, BridgeCode.OK, '', dataJson);
  }

  reject(code: number, message: string): void {
    if (this.done) {
      this.core.logger.warn(TAG, `duplicate reject ignored, method=${this.method} id=${this.id}`);
      return;
    }
    this.done = true;
    this.core.finishInvoke(this.id, code, message, '');
  }
}

/**
 * BridgeCore：协议分发中枢。
 * - proxy 通道入口 handleProxyMessage（hello / invoke sync+async / event）
 * - port 通道文本入口 handlePortMessage（invoke async / event）
 * - 结果与事件回推：port 就绪走 port，否则 runJavaScript 兜底（页面未就绪时丢弃告警）
 * - 异步 invoke 超时保护（invokeTimeoutMs，默认 30s）
 */
export class BridgeCore {
  readonly logger: BridgeLogger;
  readonly options: BridgeOptions;
  private registry: BridgeRegistry;
  private controller: webview.WebviewController;
  private portChannel: PortChannel;
  private eventSink: BridgeEventSink | null = null;
  private binarySink: BridgeBinarySink | null = null;
  private pendingTimers: Map<number, number> = new Map<number, number>();
  private binarySeq: number = 1;

  constructor(controller: webview.WebviewController, registry: BridgeRegistry, options: BridgeOptions) {
    this.controller = controller;
    this.registry = registry;
    this.options = options;
    this.logger = options.logger;
    this.portChannel = new PortChannel(controller, options.logger);
    this.portChannel.setListeners(
      (json: string): void => {
        this.handlePortText(json);
      },
      (event: string, id: number, buffer: ArrayBuffer): void => {
        this.handleBinaryUp(event, id, buffer);
      },
      (): void => {
        this.logger.info(TAG, 'port channel ready, async push via port');
      }
    );
  }

  portReady(): boolean {
    return this.portChannel.isReady();
  }

  setEventSink(sink: BridgeEventSink): void {
    this.eventSink = sink;
  }

  setBinarySink(sink: BridgeBinarySink): void {
    this.binarySink = sink;
  }

  /** proxy 通道入口（javaScriptProxy 调用）：返回同步 result envelope，异步/事件返回 ''。 */
  handleProxyMessage(json: string): string {
    let env: BridgeEnvelope;
    try {
      env = JSON.parse(json) as BridgeEnvelope;
    } catch (err) {
      return BridgeCore.stringifyResult(0, BridgeCode.BAD_ENVELOPE, 'malformed envelope json', '');
    }
    if (typeof env.id !== 'number' || typeof env.action !== 'string') {
      return BridgeCore.stringifyResult(0, BridgeCode.BAD_ENVELOPE, 'envelope missing id/action', '');
    }
    switch (env.action) {
      case BridgeAction.HELLO:
        return this.handleHello(env);
      case BridgeAction.INVOKE:
        if (env.sync === true) {
          return this.handleSyncInvoke(env);
        }
        this.startInvoke(env);
        return '';
      case BridgeAction.EVENT:
        this.dispatchEvent(env.event ?? '', env.data ?? '');
        return '';
      default:
        this.logger.warn(TAG, `unknown proxy action: ${env.action}`);
        return '';
    }
  }

  /** 原生→H5 事件。 */
  emit(event: string, dataJson: string): void {
    const env: BridgeEnvelope = { id: 0, action: BridgeAction.EVENT, event: event, data: dataJson };
    this.pushJson(JSON.stringify(env));
  }

  /** 原生→H5 二进制（仅 port 通道）。 */
  emitBinary(event: string, buffer: ArrayBuffer): void {
    if (!this.portChannel.isReady()) {
      this.logger.warn(TAG, 'emitBinary ignored: port channel not ready');
      return;
    }
    const id: number = this.binarySeq++;
    this.portChannel.sendBinary(event, id, buffer);
  }

  /** 异步 invoke 的 resolve/reject 落点：清定时器并回推结果（port 优先）。 */
  finishInvoke(id: number, code: number, message: string, dataJson: string): void {
    const timerId: number | undefined = this.pendingTimers.get(id);
    if (timerId !== undefined) {
      clearTimeout(timerId);
      this.pendingTimers.delete(id);
    }
    this.pushJson(BridgeCore.stringifyResult(id, code, message, dataJson));
  }

  shutdown(): void {
    this.pendingTimers.forEach((timerId: number, id: number): void => {
      clearTimeout(timerId);
    });
    this.pendingTimers.clear();
    this.portChannel.close();
    this.eventSink = null;
    this.binarySink = null;
  }

  private handleHello(env: BridgeEnvelope): string {
    const caps: BridgeCaps = { port: this.options.enablePort, binary: this.options.enablePort };
    const data: BridgeHelloData = {
      pv: BRIDGE_PROTOCOL_VERSION,
      server: BRIDGE_SERVER_VERSION,
      methods: this.registry.allMethods(),
      caps: caps
    };
    // 端口协商：双方都支持且 H5 声明 want:["port"]
    if (this.options.enablePort && env.want !== undefined && env.want.indexOf('port') >= 0) {
      const ok: boolean = this.portChannel.setup();
      if (!ok) {
        this.logger.warn(TAG, 'port negotiation failed, fallback to runJavaScript push');
      }
    }
    return BridgeCore.stringifyResult(env.id, BridgeCode.OK, '', JSON.stringify(data));
  }

  private handleSyncInvoke(env: BridgeEnvelope): string {
    const method: string = env.method ?? '';
    const handler = this.registry.getSyncHandler(method);
    if (handler === null) {
      const asyncHandler = this.registry.getHandler(method);
      if (asyncHandler !== null) {
        return BridgeCore.stringifyResult(env.id, BridgeCode.NOT_SYNC, `method is async-only: ${method}`, '');
      }
      return BridgeCore.stringifyResult(env.id, BridgeCode.NOT_FOUND, `method not found: ${method}`, '');
    }
    try {
      const data: string = handler(env.params ?? '');
      return BridgeCore.stringifyResult(env.id, BridgeCode.OK, '', data);
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      this.logger.error(TAG, `sync handler threw, method=${method}: ${e.message}`);
      return BridgeCore.stringifyResult(env.id, BridgeCode.HANDLER_ERROR, `sync handler threw: ${e.message}`, '');
    }
  }

  private startInvoke(env: BridgeEnvelope): void {
    const method: string = env.method ?? '';
    const id: number = env.id;
    const handler = this.registry.getHandler(method);
    if (handler === null) {
      // 同步方法被异步调用也视为 NOT_FOUND（应走 sync:true）
      this.pushJson(BridgeCore.stringifyResult(id, BridgeCode.NOT_FOUND, `method not found: ${method}`, ''));
      return;
    }
    const ctx: BridgeContextImpl = new BridgeContextImpl(this, method, id);
    const timeoutMs: number = this.options.invokeTimeoutMs;
    if (timeoutMs > 0) {
      const timerId: number = setTimeout((): void => {
        this.pendingTimers.delete(id);
        this.pushJson(BridgeCore.stringifyResult(id, BridgeCode.TIMEOUT,
          `invoke timeout after ${timeoutMs}ms: ${method}`, ''));
      }, timeoutMs);
      this.pendingTimers.set(id, timerId);
    }
    try {
      handler(ctx, env.params ?? '');
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      this.logger.error(TAG, `handler threw, method=${method}: ${e.message}`);
      ctx.reject(BridgeCode.HANDLER_ERROR, `handler threw: ${e.message}`);
    }
  }

  /** port 通道文本消息（PortChannel 已消化二进制控制帧）。 */
  private handlePortText(json: string): void {
    let env: BridgeEnvelope;
    try {
      env = JSON.parse(json) as BridgeEnvelope;
    } catch (err) {
      this.logger.warn(TAG, 'malformed port envelope ignored');
      return;
    }
    if (env.action === BridgeAction.INVOKE && env.sync !== true) {
      this.startInvoke(env);
      return;
    }
    if (env.action === BridgeAction.EVENT) {
      this.dispatchEvent(env.event ?? '', env.data ?? '');
      return;
    }
    this.logger.warn(TAG, `unknown port action: ${env.action}`);
  }

  private dispatchEvent(event: string, dataJson: string): void {
    if (this.eventSink === null) {
      return;
    }
    this.eventSink(event, dataJson);
  }

  /** H5 上行二进制重组完成：转 sink 并回执。 */
  private handleBinaryUp(event: string, id: number, buffer: ArrayBuffer): void {
    if (this.binarySink !== null) {
      this.binarySink(event, buffer);
    }
    const ack: BridgeBinAck = new BridgeBinAck(id, buffer.byteLength);
    this.emit(BRIDGE_BIN_ACK_EVENT, JSON.stringify(ack));
  }

  /** 回推：port 就绪走 port，否则 runJavaScript 兜底。 */
  private pushJson(json: string): void {
    if (this.portChannel.isReady()) {
      this.portChannel.send(json);
      return;
    }
    try {
      this.controller.runJavaScript(`window.${BRIDGE_RECEIVE_FN}(${JSON.stringify(json)})`);
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      this.logger.warn(TAG, `push failed (page not ready?), code=${e.code} msg=${e.message}`);
    }
  }

  private static stringifyResult(id: number, code: number, message: string, dataJson: string): string {
    const env: BridgeEnvelope = {
      id: id,
      action: BridgeAction.RESULT,
      code: code,
      message: message,
      data: dataJson
    };
    return JSON.stringify(env);
  }
}
