# Changelog

## 0.1.1 (2026-11-04)

首次通过 hvigor 全量编译（此前 SDK 模块挂在工程里从未编译过，阻塞整个 HAP 构建）。

### 修复

- `BridgeTypes` 补上漏定义的 `BridgeOptions` 接口（BridgeClient/BridgeCore/Index 三处 import 编译失败）
- `PortChannel` / `BridgeDemoPanel` 二进制下行处 `Uint8Array.buffer` 显式 `as ArrayBuffer`（arkts-no-structural-typing）
- `StoragePlugin.keys()` 改用 `Preferences.getAll()` + `Object.keys`（当前 SDK 无 `getAllKeys()`）

## 0.1.0 (2026-11-03)

初始版本。

### 新增

- **核心**：双通道自动协商（javaScriptProxy 同步 + WebMessagePort 异步，runJavaScript 兜底回推）
- **协议**：v1 envelope（hello / invoke / result / event / bin-start / bin-end），恰好一次 resolve/reject，超时控制（默认 30s）
- **RPC**：异步 `call`（Promise）、同步 `callSync`（proxy 返回值直取）
- **事件总线**：原生↔H5 双向事件，H5 侧 `ns.*` 前缀通配订阅（on/once/off）
- **二进制传输**：双向 ArrayBuffer，64KB 分帧 + 重组 + ack 回执
- **插件**：`system`（info/ping/delayedEcho/neverResolve）、`storage`（Preferences get/set/remove/keys/getSync/setSync）
- **H5 SDK**：单文件 `jsbridge.js`（随 HAR rawfile 分发），`Bridge.ready/call/callSync/on/off/once/emit/sendBinary/onBinary`
- **Demo**：`BridgeDemoPanel` 组件 + `bridge_demo.html` 9 项验证矩阵 + `BridgeSelfTest` 纯逻辑自测
- **文档**：README、协议文档（docs/developer/jsbridge-protocol.md）
