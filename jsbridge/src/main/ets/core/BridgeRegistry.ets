import { BridgeContext } from './BridgeContext';

/** 异步 handler：应答经 ctx.resolve/reject（支持延迟应答）。 */
export type BridgeHandler = (ctx: BridgeContext, paramsJson: string) => void;

/** 同步 handler：立即返回 data JSON 字符串（经 javaScriptProxy 同步返回值回传）。 */
export type BridgeSyncHandler = (paramsJson: string) => string;

/** H5→原生反向事件回调。 */
export type BridgeEventSink = (event: string, dataJson: string) => void;

/** 原生←H5 二进制回调（H5 sendBinary 上行重组完成后触发）。 */
export type BridgeBinarySink = (event: string, buffer: ArrayBuffer) => void;

/** registerModule 的单条注册项：method 为去掉命名空间后的短名。 */
export interface BridgeModuleEntry {
  method: string;
  handler?: BridgeHandler;
  syncHandler?: BridgeSyncHandler;
}

/**
 * 方法注册表：async/sync 双表 + 命名空间批量注册。
 * 同名重复注册以后者覆盖（便于热替换/测试）。
 */
export class BridgeRegistry {
  private handlers: Map<string, BridgeHandler> = new Map<string, BridgeHandler>();
  private syncHandlers: Map<string, BridgeSyncHandler> = new Map<string, BridgeSyncHandler>();

  register(method: string, handler: BridgeHandler): void {
    this.handlers.set(method, handler);
  }

  registerSync(method: string, handler: BridgeSyncHandler): void {
    this.syncHandlers.set(method, handler);
  }

  /** 按命名空间批量注册：namespace + '.' + entry.method 为完整方法名。 */
  registerModule(namespace: string, entries: Array<BridgeModuleEntry>): void {
    const prefix: string = namespace.length > 0 ? `${namespace}.` : '';
    for (const entry of entries) {
      const full: string = `${prefix}${entry.method}`;
      if (entry.syncHandler !== undefined) {
        this.syncHandlers.set(full, entry.syncHandler);
      } else if (entry.handler !== undefined) {
        this.handlers.set(full, entry.handler);
      }
    }
  }

  unregister(method: string): void {
    this.handlers.delete(method);
    this.syncHandlers.delete(method);
  }

  getHandler(method: string): BridgeHandler | null {
    const h: BridgeHandler | undefined = this.handlers.get(method);
    return h ?? null;
  }

  getSyncHandler(method: string): BridgeSyncHandler | null {
    const h: BridgeSyncHandler | undefined = this.syncHandlers.get(method);
    return h ?? null;
  }

  /** 全量方法名（hello 协商回传用）。 */
  allMethods(): Array<string> {
    const list: Array<string> = [];
    this.handlers.forEach((handler: BridgeHandler, method: string): void => {
      list.push(method);
    });
    this.syncHandlers.forEach((handler: BridgeSyncHandler, method: string): void => {
      list.push(method);
    });
    return list;
  }

  clear(): void {
    this.handlers.clear();
    this.syncHandlers.clear();
  }
}
