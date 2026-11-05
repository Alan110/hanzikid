import { BridgeCore } from './BridgeCore';

/**
 * 注入到 window 的原生对象（经 .javaScriptProxy() 注入，name 由 BridgeOptions.proxyName 决定）。
 * 单一入口 postMessage：同步方法直接返回 result envelope 字符串，其余返回 ''。
 */
export class BridgeProxyObject {
  private core: BridgeCore;

  constructor(core: BridgeCore) {
    this.core = core;
  }

  postMessage(json: string): string {
    return this.core.handleProxyMessage(json);
  }
}
