import { BridgeClient } from '../core/BridgeClient';
import { BridgeContext } from '../core/BridgeContext';
import { BridgeModuleEntry } from '../core/BridgeRegistry';
import { BRIDGE_SERVER_VERSION } from '../core/BridgeTypes';

/** system.info 应答结构。 */
export class BridgeSystemInfo {
  readonly version: string;
  readonly pv: number;
  readonly portReady: boolean;
  readonly methodCount: number;
  readonly serverTime: number;

  constructor(version: string, pv: number, portReady: boolean, methodCount: number, serverTime: number) {
    this.version = version;
    this.pv = pv;
    this.portReady = portReady;
    this.methodCount = methodCount;
    this.serverTime = serverTime;
  }
}

/** system.ping 应答结构。 */
export class BridgePong {
  readonly t: number;
  readonly echo: string;

  constructor(t: number, echo: string) {
    this.t = t;
    this.echo = echo;
  }
}

/**
 * system 插件（通用诊断能力）：
 * - system.info：SDK 版本 / 协议版本 / port 状态 / 方法数
 * - system.ping：往返延迟测量（原生时间戳 + echo）
 * - system.delayedEcho：延迟 2s 应答（验证延迟 resolve 与超时机制）
 * - system.neverResolve：永不应答（验证 40801 超时）
 */
export function registerSystemPlugin(client: BridgeClient): void {
  const entries: Array<BridgeModuleEntry> = [
    {
      method: 'info',
      handler: (ctx: BridgeContext, paramsJson: string): void => {
        const info: BridgeSystemInfo = new BridgeSystemInfo(
          BRIDGE_SERVER_VERSION,
          1,
          client.portReady(),
          client.methodList().length,
          Date.now()
        );
        ctx.resolve(JSON.stringify(info));
      }
    },
    {
      method: 'ping',
      handler: (ctx: BridgeContext, paramsJson: string): void => {
        const pong: BridgePong = new BridgePong(Date.now(), paramsJson);
        ctx.resolve(JSON.stringify(pong));
      }
    },
    {
      method: 'delayedEcho',
      handler: (ctx: BridgeContext, paramsJson: string): void => {
        setTimeout((): void => {
          ctx.resolve(paramsJson);
        }, 2000);
      }
    },
    {
      method: 'neverResolve',
      handler: (ctx: BridgeContext, paramsJson: string): void => {
        // 故意不 resolve：用于验证 40801 超时（demo 用短 timeoutMs 调用）
      }
    }
  ];
  client.registerModule('system', entries);
}
