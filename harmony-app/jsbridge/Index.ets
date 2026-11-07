/**
 * @hanzi/jsbridge —— 通用 HarmonyOS JSBridge SDK 出口。
 *
 * 原生侧（ArkTS）：
 *   import { BridgeClient, registerSystemPlugin, registerStoragePlugin } from '@hanzi/jsbridge';
 *
 * H5 侧 JS SDK 见模块内 src/main/resources/rawfile/jsbridge.js（随 HAR 合并进宿主 rawfile）。
 */
export { BridgeClient } from './src/main/ets/core/BridgeClient';
export { BridgeCore } from './src/main/ets/core/BridgeCore';
export {
  BridgeRegistry,
  BridgeHandler,
  BridgeSyncHandler,
  BridgeEventSink,
  BridgeBinarySink,
  BridgeModuleEntry
} from './src/main/ets/core/BridgeRegistry';
export { BridgeContext } from './src/main/ets/core/BridgeContext';
export { BridgeProxyObject } from './src/main/ets/core/ProxyChannel';
export { PortChannel } from './src/main/ets/core/PortChannel';
export {
  BridgeLogger,
  BridgeHilogLogger,
  BridgeSilentLogger
} from './src/main/ets/core/BridgeLogger';
export { BridgeError } from './src/main/ets/core/BridgeError';
export {
  BridgeAction,
  BridgeCode,
  BridgeEnvelope,
  BridgeOptions,
  BridgeHelloData,
  BridgeCaps,
  BridgeBinAck,
  BRIDGE_PROTOCOL_VERSION,
  BRIDGE_SERVER_VERSION,
  BRIDGE_PORT_INIT_MESSAGE,
  BRIDGE_RECEIVE_FN,
  BRIDGE_BINARY_CHUNK,
  BRIDGE_BIN_ACK_EVENT
} from './src/main/ets/core/BridgeTypes';
export { registerSystemPlugin, BridgeSystemInfo, BridgePong } from './src/main/ets/plugins/SystemPlugin';
export {
  registerStoragePlugin,
  registerStoragePluginWithStore,
  BridgeStore,
  BridgeStorageParams,
  BridgeStorageValue
} from './src/main/ets/plugins/StoragePlugin';
export { BridgeSelfTest } from './src/main/ets/test/BridgeSelfTest';
export { BridgeDemoPanel } from './src/main/ets/components/BridgeDemoPanel';
