/**
 * BridgeContext：异步 handler 的应答上下文。
 * resolve/reject 必须恰好调用一次；重复调用被忽略并告警；
 * 超时未应答由 BridgeCore 按 invokeTimeoutMs 自动拒绝（40801）。
 */
export interface BridgeContext {
  readonly method: string;
  readonly id: number;
  /** 成功应答（dataJson 为业务 JSON 字符串，可为 ''） */
  resolve(dataJson: string): void;
  /** 失败应答（code 见 BridgeCode 分段） */
  reject(code: number, message: string): void;
}
