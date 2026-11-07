/**
 * JSBridge 协议 v1：常量、envelope 结构、配置。
 * envelope 字段全为原始类型，JSON.parse(text) as BridgeEnvelope 可安全反序列化。
 */
import { BridgeLogger } from './BridgeLogger';

export enum BridgeAction {
  HELLO = 'hello',
  INVOKE = 'invoke',
  RESULT = 'result',
  EVENT = 'event',
  BIN_START = 'bin-start',
  BIN_END = 'bin-end',
}

export enum BridgeCode {
  OK = 0,
  /** 畸形 envelope（JSON 解析失败 / 缺字段） */
  BAD_ENVELOPE = 40001,
  /** 方法未注册 */
  NOT_FOUND = 40401,
  /** 方法不支持同步调用 */
  NOT_SYNC = 40501,
  /** 调用超时（handler 未在 invokeTimeoutMs 内 resolve） */
  TIMEOUT = 40801,
  /** handler 执行抛异常 */
  HANDLER_ERROR = 50001,
  /** 通道未就绪 */
  CHANNEL_NOT_READY = 50002,
  /** port 通道协商失败 */
  PORT_FAILED = 50003,
}

/** 协议信封：H5↔Native 双向共用，字段全原始类型。 */
export interface BridgeEnvelope {
  id: number;
  action: string;
  /** 协议版本（hello 携带） */
  pv?: number;
  /** 方法名（invoke） */
  method?: string;
  /** 业务参数（不透明 JSON 字符串） */
  params?: string;
  /** 是否同步调用（invoke） */
  sync?: boolean;
  /** hello 时请求的能力，JSON 数组字符串，如 '["port"]' */
  want?: string;
  code?: number;
  message?: string;
  data?: string;
  event?: string;
  /** 二进制总字节数（bin-start） */
  size?: number;
}

/** hello 应答 data 结构（JSON 字符串形式回传）。 */
export interface BridgeHelloData {
  pv: number;
  server: string;
  methods: Array<string>;
  caps: BridgeCaps;
}

export interface BridgeCaps {
  port: boolean;
  binary: boolean;
}

/** BridgeClient.attach 配置项。 */
export interface BridgeOptions {
  /** 注入到 window 的对象名（javaScriptProxy.name） */
  proxyName: string;
  /** 协议版本（hello 应答里回传） */
  protocolVersion: number;
  /** 是否协商 port 通道（WebMessagePort 异步/二进制通路） */
  enablePort: boolean;
  /** 异步 invoke 超时毫秒数（超时自动 40801 拒绝） */
  invokeTimeoutMs: number;
  /** 日志实现（默认 BridgeHilogLogger） */
  logger: BridgeLogger;
}

export const BRIDGE_PROTOCOL_VERSION: number = 1;
export const BRIDGE_SERVER_VERSION: string = 'jsbridge@0.1.0';
/** 端口邮寄给 H5 时的 message 内容（H5 以此识别端口通道） */
export const BRIDGE_PORT_INIT_MESSAGE: string = '__hb_port__';
/** runJavaScript 兜底回推调用的 H5 全局函数名 */
export const BRIDGE_RECEIVE_FN: string = '__hbReceive';
/** 二进制分片大小（64KB） */
export const BRIDGE_BINARY_CHUNK: number = 65536;
/** H5 上行二进制完成回执事件名 */
export const BRIDGE_BIN_ACK_EVENT: string = '__binAck';

/** 上行二进制回执 data 结构。 */
export class BridgeBinAck {
  readonly id: number;
  readonly size: number;

  constructor(id: number, size: number) {
    this.id = id;
    this.size = size;
  }
}
