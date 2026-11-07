import { webview } from '@kit.ArkWeb';
import { BusinessError } from '@kit.BasicServicesKit';
import { BridgeLogger } from './BridgeLogger';
import {
  BridgeAction,
  BridgeEnvelope,
  BRIDGE_PORT_INIT_MESSAGE,
  BRIDGE_BINARY_CHUNK
} from './BridgeTypes';

const TAG: string = 'PortChannel';

/** H5 上行二进制会话（单流：同一时刻一个会话）。 */
interface BridgeUpSession {
  id: number;
  event: string;
  size: number;
  chunks: Array<ArrayBuffer>;
  received: number;
}

/**
 * WebMessagePort 通道：
 * - setup() 创建端口对，一端经 controller.postMessage 邮寄给 H5，一端留在原生侧
 * - 文本消息（envelope JSON）与二进制分片（ArrayBuffer）混传
 * - 下行二进制按 64KB 分帧：bin-start → ArrayBuffer 分片 → bin-end
 * - 上行二进制：H5 发 bin-start → 分片 → bin-end，原生侧按 size 重组
 */
export class PortChannel {
  private controller: webview.WebviewController;
  private logger: BridgeLogger;
  private nativePort: webview.WebMessagePort | null = null;
  private portReady: boolean = false;
  private onMessage: ((json: string) => void) | null = null;
  private onBinary: ((event: string, id: number, buffer: ArrayBuffer) => void) | null = null;
  private onReady: (() => void) | null = null;
  private upSession: BridgeUpSession | null = null;

  constructor(controller: webview.WebviewController, logger: BridgeLogger) {
    this.controller = controller;
    this.logger = logger;
  }

  setListeners(onMessage: (json: string) => void,
    onBinary: (event: string, id: number, buffer: ArrayBuffer) => void,
    onReady: () => void): void {
    this.onMessage = onMessage;
    this.onBinary = onBinary;
    this.onReady = onReady;
  }

  /** 建立端口对并邮寄一端给 H5；返回是否成功。 */
  setup(): boolean {
    if (this.nativePort !== null) {
      return this.portReady;
    }
    try {
      const ports: Array<webview.WebMessagePort> = this.controller.createWebMessagePorts();
      if (ports.length < 2) {
        this.logger.warn(TAG, `createWebMessagePorts returned ${ports.length} ports`);
        return false;
      }
      // 原生侧端口：先注册接收回调（postMessageEvent 要求先 onMessageEvent）
      ports[1].onMessageEvent((msg: webview.WebMessage): void => {
        this.handlePortMessage(msg);
      });
      this.nativePort = ports[1];
      // 另一端邮寄给 H5
      this.controller.postMessage(BRIDGE_PORT_INIT_MESSAGE, [ports[0]], '*');
      this.logger.info(TAG, 'port pair created, one end posted to H5');
      return true;
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      this.logger.error(TAG, `port setup failed, code=${e.code} msg=${e.message}`);
      this.nativePort = null;
      return false;
    }
  }

  isReady(): boolean {
    return this.portReady;
  }

  /** 发送文本 envelope。 */
  send(json: string): void {
    if (this.nativePort === null) {
      return;
    }
    try {
      this.nativePort.postMessageEvent(json);
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      this.logger.warn(TAG, `port send failed, code=${e.code} msg=${e.message}`);
    }
  }

  /** 下行二进制：bin-start → 64KB 分片 → bin-end。 */
  sendBinary(event: string, id: number, buffer: ArrayBuffer): void {
    if (this.nativePort === null || !this.portReady) {
      this.logger.warn(TAG, 'sendBinary ignored: port not ready');
      return;
    }
    const start: BridgeEnvelope = {
      id: id,
      action: BridgeAction.BIN_START,
      event: event,
      size: buffer.byteLength
    };
    this.send(JSON.stringify(start));
    const total: number = buffer.byteLength;
    let offset: number = 0;
    while (offset < total) {
      const end: number = Math.min(offset + BRIDGE_BINARY_CHUNK, total);
      try {
        this.nativePort.postMessageEvent(buffer.slice(offset, end));
      } catch (err) {
        const e: BusinessError = err as BusinessError;
        this.logger.warn(TAG, `port send chunk failed at ${offset}, code=${e.code} msg=${e.message}`);
        break;
      }
      offset = end;
    }
    const endEnv: BridgeEnvelope = { id: id, action: BridgeAction.BIN_END, event: event };
    this.send(JSON.stringify(endEnv));
  }

  close(): void {
    if (this.nativePort !== null) {
      try {
        this.nativePort.close();
      } catch (err) {
        this.logger.warn(TAG, 'port close failed');
      }
      this.nativePort = null;
    }
    this.portReady = false;
    this.upSession = null;
  }

  private handlePortMessage(msg: webview.WebMessage): void {
    if (!this.portReady) {
      this.portReady = true;
      if (this.onReady !== null) {
        this.onReady();
      }
    }
    if (typeof msg === 'string') {
      this.handlePortText(msg);
      return;
    }
    if (msg instanceof ArrayBuffer) {
      this.handleUpChunk(msg);
      return;
    }
    this.logger.warn(TAG, 'unsupported port message type');
  }

  /** 二进制会话控制帧（bin-start/bin-end）在通道内消化，其余转 core。 */
  private handlePortText(json: string): void {
    let env: BridgeEnvelope | null = null;
    try {
      env = JSON.parse(json) as BridgeEnvelope;
    } catch (err) {
      env = null;
    }
    if (env !== null && env.action === BridgeAction.BIN_START) {
      this.beginUpSession(env.id, env.event ?? '', env.size ?? 0);
      return;
    }
    if (env !== null && env.action === BridgeAction.BIN_END) {
      this.finishUpSession(env.id);
      return;
    }
    if (this.onMessage !== null) {
      this.onMessage(json);
    }
  }

  private beginUpSession(id: number, event: string, size: number): void {
    if (this.upSession !== null) {
      this.logger.warn(TAG, `up session ${this.upSession.id} overridden by ${id}`);
    }
    const session: BridgeUpSession = {
      id: id,
      event: event,
      size: size,
      chunks: [],
      received: 0
    };
    this.upSession = session;
  }

  private handleUpChunk(buf: ArrayBuffer): void {
    const session: BridgeUpSession | null = this.upSession;
    if (session === null) {
      this.logger.warn(TAG, `orphan up chunk ignored, len=${buf.byteLength}`);
      return;
    }
    session.chunks.push(buf);
    session.received += buf.byteLength;
    if (session.received >= session.size) {
      this.finishUpSession(session.id);
    }
  }

  private finishUpSession(id: number): void {
    const session: BridgeUpSession | null = this.upSession;
    if (session === null || session.id !== id) {
      return;
    }
    this.upSession = null;
    if (this.onBinary === null) {
      return;
    }
    // 重组为整块
    const whole: Uint8Array = new Uint8Array(session.received);
    let offset: number = 0;
    for (const chunk of session.chunks) {
      whole.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }
    this.onBinary(session.event, id, whole.buffer as ArrayBuffer);
  }
}
