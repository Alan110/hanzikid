import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG: string = 'NativeStore';

/**
 * 原生侧持久化存储：网页进度/设置经 HanziNative 桥存入 Preferences（卸载重装不丢）。
 * 读写走内存缓存（getSync/putSync），桥调用可同步返回；flush 异步落盘。
 */
export class NativeStore {
  private static prefs: preferences.Preferences | null = null;
  private static ready: boolean = false;
  private static pending: Array<() => void> = [];

  static init(context: common.UIAbilityContext): void {
    if (NativeStore.ready) {
      return;
    }
    const options: preferences.Options = { name: 'hanzikid_store' };
    preferences.getPreferences(context, options).then((p: preferences.Preferences) => {
      NativeStore.prefs = p;
      hilog.info(0x0000, TAG, 'Preferences ready');
      NativeStore.finishInit();
    }).catch((err: BusinessError) => {
      // 存储初始化失败不阻塞游戏：读写变为空操作，只是进度不持久化
      hilog.error(0x0000, TAG, 'Preferences init failed, code=%{public}d msg=%{public}s', err.code, err.message);
      NativeStore.finishInit();
    });
  }

  private static finishInit(): void {
    NativeStore.ready = true;
    const waiters = NativeStore.pending;
    NativeStore.pending = [];
    waiters.forEach((cb: () => void) => cb());
  }

  static onReady(cb: () => void): void {
    if (NativeStore.ready) {
      cb();
      return;
    }
    NativeStore.pending.push(cb);
  }

  static get(key: string): string {
    if (NativeStore.prefs === null) {
      return '';
    }
    try {
      const v: preferences.ValueType = NativeStore.prefs.getSync(key, '');
      if (typeof v === 'string') {
        return v;
      }
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(0x0000, TAG, 'Preferences get failed, key=%{public}s code=%{public}d msg=%{public}s', key, e.code, e.message);
    }
    return '';
  }

  static set(key: string, value: string): void {
    if (NativeStore.prefs === null) {
      return;
    }
    try {
      NativeStore.prefs.putSync(key, value);
      NativeStore.prefs.flush().catch((err: BusinessError) => {
        hilog.error(0x0000, TAG, 'Preferences flush failed, code=%{public}d msg=%{public}s', err.code, err.message);
      });
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(0x0000, TAG, 'Preferences set failed, key=%{public}s code=%{public}d msg=%{public}s', key, e.code, e.message);
    }
  }
}
