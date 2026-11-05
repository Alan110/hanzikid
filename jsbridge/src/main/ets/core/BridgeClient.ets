import { webview } from '@kit.ArkWeb';
import { BridgeCore } from './BridgeCore';
import { BridgeProxyObject } from './ProxyChannel';
import {
  BridgeRegistry,
  BridgeEventSink,
  BridgeBinarySink,
  BridgeHandler,
  BridgeSyncHandler,
  BridgeModuleEntry
} from './BridgeRegistry';
import { BridgeOptions } from './BridgeTypes';
import { BridgeHilogLogger } from './BridgeLogger';

/**
 * BridgeClient：面向应用的门面。
 *
 * 用法：
 *   private controller: webview.WebviewController = new webview.WebviewController();
 *   private client: BridgeClient = BridgeClient.attach(this.controller);
 *   // 注册业务方法（可选拆 registerSystemPlugin / registerStoragePlugin）
 *   build() 中：
 *     Web({ src: ..., controller: this.controller })
 *       .javaScriptProxy({
 *         object: this.client.injectedObject(),
 *         name: this.client.proxyName(),
 *         methodList: this.client.injectedMethodList(),
 *         controller: this.controller
 *       })
 */
export class BridgeClient {
  private readonly core: BridgeCore;
  private readonly registry: BridgeRegistry;
  private readonly proxy: BridgeProxyObject;
  private readonly opts: BridgeOptions;

  /** 挂接到指定 WebviewController，返回门面实例（每个 Web 组件一个实例）。 */
  static attach(controller: webview.WebviewController, options?: BridgeOptions): BridgeClient {
    const opts: BridgeOptions = options ?? BridgeClient.defaultOptions();
    return new BridgeClient(controller, opts);
  }

  /** 默认配置（可整体传入 BridgeOptions 覆盖）。 */
  static defaultOptions(): BridgeOptions {
    return {
      proxyName: 'HbNative',
      protocolVersion: 1,
      enablePort: true,
      invokeTimeoutMs: 30000,
      logger: new BridgeHilogLogger()
    };
  }

  private constructor(controller: webview.WebviewController, options: BridgeOptions) {
    this.opts = options;
    this.registry = new BridgeRegistry();
    this.core = new BridgeCore(controller, this.registry, options);
    this.proxy = new BridgeProxyObject(this.core);
  }

  /** 注入对象名（javaScriptProxy.name），默认 'HbNative'。 */
  proxyName(): string {
    return this.opts.proxyName;
  }

  /** 注入对象实例（javaScriptProxy.object）。 */
  injectedObject(): BridgeProxyObject {
    return this.proxy;
  }

  /** 注入方法清单（javaScriptProxy.methodList）。 */
  injectedMethodList(): Array<string> {
    return ['postMessage'];
  }

  /** 注册异步方法（'ns.name' 形式）。 */
  register(method: string, handler: BridgeHandler): void {
    this.registry.register(method, handler);
  }

  /** 注册同步方法（经 postMessage 返回值同步回传）。 */
  registerSync(method: string, handler: BridgeSyncHandler): void {
    this.registry.registerSync(method, handler);
  }

  /** 按命名空间批量注册。 */
  registerModule(namespace: string, entries: Array<BridgeModuleEntry>): void {
    this.registry.registerModule(namespace, entries);
  }

  /** 注销方法。 */
  unregister(method: string): void {
    this.registry.unregister(method);
  }

  /** 原生→H5 事件。 */
  emit(event: string, dataJson: string): void {
    this.core.emit(event, dataJson);
  }

  /** 原生→H5 二进制（仅 port 通道就绪后可用）。 */
  emitBinary(event: string, buffer: ArrayBuffer): void {
    this.core.emitBinary(event, buffer);
  }

  /** 订阅 H5→原生事件。 */
  onEvent(sink: BridgeEventSink): void {
    this.core.setEventSink(sink);
  }

  /** 订阅 H5→原生二进制（sendBinary 上行）。 */
  onBinary(sink: BridgeBinarySink): void {
    this.core.setBinarySink(sink);
  }

  /** port 通道是否就绪（诊断/展示用）。 */
  portReady(): boolean {
    return this.core.portReady();
  }

  /** 已注册方法名清单。 */
  methodList(): Array<string> {
    return this.registry.allMethods();
  }

  /** 卸载：清理定时器、端口与回调（Web 组件销毁时调用）。 */
  detach(): void {
    this.core.shutdown();
    this.registry.clear();
  }
}
