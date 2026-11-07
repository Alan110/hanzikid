import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BridgeClient } from '../core/BridgeClient';
import { BridgeContext } from '../core/BridgeContext';
import { BridgeCode } from '../core/BridgeTypes';
import { BridgeModuleEntry } from '../core/BridgeRegistry';

const TAG: string = 'StoragePlugin';

/** storage 参数结构。 */
export interface BridgeStorageParams {
  key: string;
  value?: string;
}

/** storage.get/getSync 应答结构。 */
export class BridgeStorageValue {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }
}

/**
 * Preferences 存储封装：读写走内存缓存（getSync/putSync），flush 异步落盘。
 * 初始化未完成时读返回 ''、写被忽略（不阻塞业务）。
 */
export class BridgeStore {
  private prefs: preferences.Preferences | null = null;

  init(context: common.Context): void {
    if (this.prefs !== null) {
      return;
    }
    const options: preferences.Options = { name: 'jsbridge_store' };
    preferences.getPreferences(context, options).then((p: preferences.Preferences): void => {
      this.prefs = p;
      hilog.info(0x0200, TAG, 'Preferences ready');
    }).catch((err: BusinessError): void => {
      hilog.error(0x0200, TAG, 'Preferences init failed, code=%{public}d msg=%{public}s', err.code, err.message);
    });
  }

  get(key: string): string {
    if (this.prefs === null) {
      return '';
    }
    try {
      const v: preferences.ValueType = this.prefs.getSync(key, '');
      if (typeof v === 'string') {
        return v;
      }
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      hilog.error(0x0200, TAG, 'get failed, key=%{public}s code=%{public}d msg=%{public}s', key, e.code, e.message);
    }
    return '';
  }

  set(key: string, value: string): void {
    if (this.prefs === null) {
      return;
    }
    try {
      this.prefs.putSync(key, value);
      this.prefs.flush().catch((err: BusinessError): void => {
        hilog.error(0x0200, TAG, 'flush failed, code=%{public}d msg=%{public}s', err.code, err.message);
      });
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      hilog.error(0x0200, TAG, 'set failed, key=%{public}s code=%{public}d msg=%{public}s', key, e.code, e.message);
    }
  }

  remove(key: string): void {
    if (this.prefs === null) {
      return;
    }
    try {
      this.prefs.deleteSync(key);
      this.prefs.flush().catch((err: BusinessError): void => {
        hilog.error(0x0200, TAG, 'flush failed, code=%{public}d msg=%{public}s', err.code, err.message);
      });
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      hilog.error(0x0200, TAG, 'remove failed, key=%{public}s code=%{public}d msg=%{public}s', key, e.code, e.message);
    }
  }

  keys(): Promise<Array<string>> {
    if (this.prefs === null) {
      return new Promise<Array<string>>((resolve: (keys: Array<string>) => void): void => {
        resolve([]);
      });
    }
    // 当前 SDK 的 Preferences 无 getAllKeys()，用 getAll() 取键集合
    return this.prefs.getAll().then((all: Object): Array<string> => {
      return Object.keys(all as Record<string, Object>);
    });
  }
}

function parseParams(paramsJson: string): BridgeStorageParams {
  return JSON.parse(paramsJson) as BridgeStorageParams;
}

function storageEntries(store: BridgeStore): Array<BridgeModuleEntry> {
  return [
    {
      method: 'get',
      handler: (ctx: BridgeContext, paramsJson: string): void => {
        const p: BridgeStorageParams = parseParams(paramsJson);
        const v: BridgeStorageValue = new BridgeStorageValue(store.get(p.key ?? ''));
        ctx.resolve(JSON.stringify(v));
      }
    },
    {
      method: 'set',
      handler: (ctx: BridgeContext, paramsJson: string): void => {
        const p: BridgeStorageParams = parseParams(paramsJson);
        store.set(p.key ?? '', p.value ?? '');
        ctx.resolve('true');
      }
    },
    {
      method: 'remove',
      handler: (ctx: BridgeContext, paramsJson: string): void => {
        const p: BridgeStorageParams = parseParams(paramsJson);
        store.remove(p.key ?? '');
        ctx.resolve('true');
      }
    },
    {
      method: 'keys',
      handler: (ctx: BridgeContext, paramsJson: string): void => {
        store.keys().then((allKeys: Array<string>): void => {
          ctx.resolve(JSON.stringify(allKeys));
        }).catch((err: BusinessError): void => {
          ctx.reject(BridgeCode.HANDLER_ERROR, `keys failed: ${err.message}`);
        });
      }
    },
    {
      method: 'getSync',
      syncHandler: (paramsJson: string): string => {
        const p: BridgeStorageParams = parseParams(paramsJson);
        const v: BridgeStorageValue = new BridgeStorageValue(store.get(p.key ?? ''));
        return JSON.stringify(v);
      }
    },
    {
      method: 'setSync',
      syncHandler: (paramsJson: string): string => {
        const p: BridgeStorageParams = parseParams(paramsJson);
        store.set(p.key ?? '', p.value ?? '');
        return 'true';
      }
    }
  ];
}

/**
 * storage 插件：Preferences K-V 持久化。
 * 方法：storage.get/set/remove/keys（异步）+ storage.getSync/setSync（同步）。
 */
export function registerStoragePlugin(client: BridgeClient, context: common.Context): void {
  const store: BridgeStore = new BridgeStore();
  store.init(context);
  client.registerModule('storage', storageEntries(store));
}

/** 带既有 store 实例注册（测试/复用场景）。 */
export function registerStoragePluginWithStore(client: BridgeClient, store: BridgeStore): void {
  client.registerModule('storage', storageEntries(store));
}
