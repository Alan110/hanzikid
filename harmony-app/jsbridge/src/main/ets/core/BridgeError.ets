import { BridgeCode } from './BridgeTypes';

/** 桥错误：code 见 BridgeCode 分段。 */
export class BridgeError {
  readonly code: BridgeCode;
  readonly message: string;

  constructor(code: BridgeCode, message: string) {
    this.code = code;
    this.message = message;
  }

  toString(): string {
    return `BridgeError(${this.code}): ${this.message}`;
  }
}
