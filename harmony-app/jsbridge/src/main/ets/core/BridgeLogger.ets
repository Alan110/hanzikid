import { hilog } from '@kit.PerformanceAnalysisKit';

/** 日志门面：可通过 BridgeOptions.logger 注入自定义实现。 */
export interface BridgeLogger {
  debug(tag: string, msg: string): void;
  info(tag: string, msg: string): void;
  warn(tag: string, msg: string): void;
  error(tag: string, msg: string): void;
}

/** 默认 hilog 实现。 */
export class BridgeHilogLogger implements BridgeLogger {
  debug(tag: string, msg: string): void {
    hilog.debug(0x0200, tag, '%{public}s', msg);
  }

  info(tag: string, msg: string): void {
    hilog.info(0x0200, tag, '%{public}s', msg);
  }

  warn(tag: string, msg: string): void {
    hilog.warn(0x0200, tag, '%{public}s', msg);
  }

  error(tag: string, msg: string): void {
    hilog.error(0x0200, tag, '%{public}s', msg);
  }
}

/** 静默实现（关闭日志用）。 */
export class BridgeSilentLogger implements BridgeLogger {
  debug(tag: string, msg: string): void {
  }

  info(tag: string, msg: string): void {
  }

  warn(tag: string, msg: string): void {
  }

  error(tag: string, msg: string): void {
  }
}
