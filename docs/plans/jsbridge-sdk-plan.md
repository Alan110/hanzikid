# 独立 JSBridge SDK（@hanzi/jsbridge HAR 模块）设计方案

> 状态：已批准（2026-11-03）
> 定位：独立、通用、业务无关的 HarmonyOS JSBridge SDK 包，按可发布标准完整交付
> 约束：现有 entry/游戏代码零改动，SDK 与现有 HanziNativeBridge 并存互不影响

## 一、目标

设计并交付一个独立的 JSBridge SDK（工程内新 HAR 模块 `@hanzi/jsbridge`），覆盖：

- **双通道自动协商**：`javaScriptProxy`（同步调用 + RPC 入口）与 `WebMessagePort`（异步结果/事件/二进制）自动协商，失败自动降级 `runJavaScript` 回推
- **协议化 RPC**：JSON envelope（全原始类型字段）、8 段错误码、`module.method` 命名空间、params 不透明传递
- **统一 handler 模型**：`ctx.resolve/reject` 恰好一次 + 超时自动 40801，同时覆盖即时应答与延迟应答（如语音识别结果数秒后返回）
- **事件总线**：双向事件（原生↔H5）、前缀通配订阅、二进制分帧传输（64KB 分片）
- **完整交付物**：H5 侧 JS SDK、通用插件（system/storage）、demo 测试页（9 项矩阵）、本地单元测试、README/协议文档

## 二、总体架构

```
┌─ H5 页面（任意 hybrid 页面）─────────────────────────────┐
│  jsbridge.js：Bridge.call/callSync/on/off/emit/          │
│               onBinary/sendBinary + ready 握手 + 排队     │
└──────┬───────────────────────────────▲───────────────────┘
       │ window.HbNative.postMessage    │ __hbReceive / port.onmessage
       │ (proxy 通道: 同步+RPC)         │ (回推: port 优先, runJavaScript 兜底)
┌──────▼───────────────────────────────┴───────────────────┐
│ BridgeClient (门面: attach/register/emit/on/detach)       │
│ BridgeCore   (握手/协商/分发/超时/事件总线)                 │
│ ├─ ProxyChannel  (javaScriptProxy, 同步返回值)             │
│ └─ PortChannel   (WebMessagePort, 异步/二进制分帧)          │
│ BridgeRegistry (sync/async 方法表, namespace)              │
│ plugins/      (system.info/ping, storage K/V — 可选注入)   │
└──────────────────────────────────────────────────────────┘
```

## 三、协议 v1

### 3.1 envelope（JSON，全原始类型字段）

**H5 → Native**（统一经 `window.HbNative.postMessage(json): string`）：

```json
{ "id": 1, "action": "hello",   "pv": 1, "want": "[\"port\"]" }
{ "id": 2, "action": "invoke",  "method": "system.ping", "params": "{\"n\":1}", "sync": false }
```

**Native → H5**：

- 同步方法：`postMessage` 直接 return result envelope（`sync: true` 时）
- 异步结果/事件：port 通道优先（`port.onmessage`），未建 port 时 `runJavaScript('window.__hbReceive(<json>)')`：

```json
{ "id": 2, "action": "result", "code": 0, "data": "..." }
{ "action": "event", "event": "demo.tick", "data": "{...}" }
```

- hello 应答（复用 result）：`data = {"pv":1,"server":"jsbridge@0.1.0","methods":[...],"caps":{"port":true,"binary":true}}`

### 3.2 关键设计决策

- `params`/`data`/`want` 为**不透明 JSON 字符串**——core 永不解析业务负载，规避 ArkTS 严格模式类型坑
- envelope 解析：`const env: BridgeEnvelope = JSON.parse(json) as BridgeEnvelope;`（ArkTS 惯用法，字段全原始类型；畸形 JSON 捕获后回 40001）
- **错误码分段**：`0` 成功；`40001` 畸形 envelope；`40401` method not found；`40501` 方法不支持同步调用；`40801` 调用超时；`50001` handler 异常；`50002` 通道未就绪；`50003` port 协商失败
- **命名空间约定**：`module.method`（如 `system.ping`、`storage.get`），注册表支持按 namespace 批量注册

## 四、双通道自动协商

1. H5 SDK 启动：检测到 `window.HbNative` → 经 proxy 通道发 `hello`（此时页面 JS 已执行、controller 已可用，时序天然安全）
2. BridgeCore 应答 methods + caps（port 是否开放取决于 `attach` 时 `enablePort` 配置）
3. 双方均支持且 H5 声明 `want:["port"]`：native `createWebMessagePorts()` 建端口对，经 `controller.postMessage('__hb_port__', [port0], '*')` 邮寄给 H5；H5 在 `window.addEventListener('message')` 捕获 `event.ports[0]`；双方互发 `{action:'ping'}` 确认 portReady
4. **portReady 后**：异步 invoke 结果与事件全部走 port（支持 string + ArrayBuffer），同步 invoke 恒走 proxy；port 协商失败自动降级 runJavaScript 回推，功能不缺失
5. 原生主动 emit 在页面/controller 未就绪时丢弃并 hilog warn（不抛错）

**二进制传输（仅 port 通道）**：分帧协议 `{action:'bin-start',event,id,size}` → 64KB ArrayBuffer 分片 → `{action:'bin-end',id}`；双向对称（`client.emitBinary` 下行 / `Bridge.sendBinary` 上行）；分片序号校验 + 超时回收。

## 五、原生侧 API（门面 BridgeClient）

```ts
const client = BridgeClient.attach(controller, {
  proxyName: 'HbNative',      // 注入对象名，可配置
  protocolVersion: 1,
  enablePort: true,           // port 通道协商开关
  invokeTimeoutMs: 30000,
  logger: undefined           // 可注入自定义 BridgeLogger
});

client.register(method: string, handler: BridgeHandler): void;
client.registerSync(method: string, handler: BridgeSyncHandler): void;
client.registerModule(namespace: string, handlers: BridgeModuleHandlers): void;
client.unregister(method: string): void;
client.emit(event: string, dataJson: string): void;
client.emitBinary(event: string, buffer: ArrayBuffer): void;
client.onEvent(handler: BridgeEventSink): void;   // H5→原生反向事件
client.detach(): void;
client.proxyConfig(): JavaScriptProxyOptions;     // 直接喂 .javaScriptProxy()
```

**handler 模型**：

```ts
export interface BridgeContext {
  method: string;
  id: number;
  resolve(dataJson: string): void;      // 恰好一次，重复调 warn 并忽略
  reject(code: number, message: string): void;
}
export type BridgeHandler = (ctx: BridgeContext, paramsJson: string) => void;
export type BridgeSyncHandler = (paramsJson: string) => string;  // 立即返回 data JSON
```

- 即时应答 handler 直接 `ctx.resolve(...)`；延迟场景在回调里再 resolve——core 对未 resolve 的 invoke 按 `invokeTimeoutMs` 自动 40801 超时拒绝
- 事件通配：H5 侧 `on('voice.*')` 前缀通配由 JS SDK 实现（原生全量推送，H5 本地过滤）

## 六、H5 侧 JS SDK（`h5/jsbridge.js`）

```js
window.Bridge = {
  available: !!window.HbNative,
  ready: Promise<{pv, methods, caps}>,        // hello 完成 resolve；无原生时立即 resolve（浏览器降级）
  call(method, params?, opts?): Promise<any>, // ready 前自动排队；超时 reject(40801)
  callSync(method, params?): any,             // 同步；code!==0 时 throw BridgeError
  on(event, fn) / once / off(event, fn),      // 支持 'voice.*' 前缀通配
  emit(event, data): void,                    // H5→原生反向事件
  sendBinary(event, buffer, metaJson?): Promise,
  onBinary(event, handler): void,
  methods: []
};
window.BridgeError = class { code, message };
```

## 七、目录结构

```
jsbridge/                                  # 新 HAR 模块
├── build-profile.json5                    # { apiType: 'stageMode', targets: [default] }
├── oh-package.json5                       # @hanzi/jsbridge 0.1.0, Apache-2.0
├── hvigorfile.ts                          # harTasks
├── Index.ets                              # 包出口（re-export barrel）
├── src/main/module.json5                  # type: 'har'
├── src/main/ets/core/
│   ├── BridgeTypes.ets                    # 协议常量、BridgeEnvelope/配置 interfaces
│   ├── BridgeError.ets                    # 错误码 + BridgeError
│   ├── BridgeLogger.ets                   # 日志接口 + hilog 默认实现
│   ├── BridgeRegistry.ets                 # sync/async 注册表 + namespace
│   ├── BridgeContext.ets                  # ctx 接口与核心实现
│   ├── BridgeCore.ets                     # 握手/协商/分发/超时/事件总线
│   ├── ProxyChannel.ets                   # javaScriptProxy 通道 + 注入对象类
│   ├── PortChannel.ets                    # WebMessagePort 通道 + 二进制分帧
│   └── BridgeClient.ets                   # 门面
├── src/main/ets/plugins/
│   ├── SystemPlugin.ets                   # system.info / system.ping
│   └── StoragePlugin.ets                  # storage.get/set/remove/keys（Preferences）
├── src/main/ets/components/
│   └── BridgeDemoPanel.ets                # demo 组件（@Component）
├── src/main/resources/rawfile/
│   └── jsbridge.js                        # H5 SDK 副本（随 HAR 合并进 HAP rawfile）
├── src/test/                              # 本地单元测试（hypium）
├── h5/jsbridge.js                         # H5 SDK 可读源码（与 rawfile 副本同步）
├── README.md
├── CHANGELOG.md
└── docs/protocol.md                       # 协议 v1 规范
```

工程接线（增量，不碰现有代码）：

- 根 `build-profile.json5`：modules 增加 `{ name: 'jsbridge', srcPath: './jsbridge', targets: [{ name: 'default' }] }`
- `entry/oh-package.json5`：`"@hanzi/jsbridge": "file:../jsbridge"`
- `entry/src/main/module.json5`：pages 增加 `"pages/BridgeDemo"`（mainElement 不动）
- entry 新增 `pages/BridgeDemo.ets`（薄页面，挂 BridgeDemoPanel）+ `rawfile/bridge_demo.html`（测试页）

## 八、实施步骤（分批提交，中文 conventional）

1. `feat(jsbridge): 初始化 HAR 模块骨架与工程接线`
2. `feat(jsbridge): 协议层——envelope/错误码/日志/注册表`
3. `feat(jsbridge): 核心分发与 proxy 通道`
4. `feat(jsbridge): port 通道、二进制分帧与自动协商`
5. `feat(jsbridge): system/storage 通用插件`
6. `feat(jsbridge): H5 侧 JS SDK`
7. `feat(jsbridge): demo 页面与测试页`
8. `test(jsbridge): 补齐单元测试`
9. `docs(jsbridge): README/CHANGELOG/协议文档`
10. 验证轮 + 修复

## 九、验证矩阵

| 项 | 方式 |
|---|---|
| 静态检查 | `arkts_check` 覆盖 jsbridge 模块 + entry 新增 .ets |
| 编译 | `devecocli build`（debug）通过 |
| 单元测试 | 协议编解码、注册表、核心分发（mock 通道）、超时、错误码 |
| Demo 矩阵（模拟器，临时切 mainElement） | ① hello/ready：methods 数、port 协商结果 ② `callSync('system.info')` 同步往返 ③ `call('system.ping')` 延迟测量 ④ 延迟应答 `demo.delayedEcho`（2s resolve）⑤ 事件双向 ⑥ 错误路径：40401/40001/40801 ⑦ 二进制 1MB 双向往返（分帧+hash 校验）⑧ storage 插件 set/get/remove/keys ⑨ `enablePort=false` 下 ①-⑥ 重跑（降级路径） |
| entry 回归 | mainElement 还原后 app 正常启动 Index，游戏行为不受影响 |

## 十、风险与对策

| 风险 | 对策 |
|---|---|
| HAR rawfile 不合并进 HAP | fallback：jsbridge.js 副本放 entry rawfile（机制已含副本同步） |
| WebMessagePort 建立时机 | 协商由 H5 hello 触发（必然晚于页面 JS 执行），时序天然安全；失败走 50003 + 降级 |
| runJavaScript 兜底仅页面加载后可用 | 未就绪时 emit 丢弃告警（与官方 FAQ 行为一致） |
| ArkTS 严格模式 | 类型统一 Bridge 前缀防声明合并；成员名避开保留字；泛型/箭头函数显式标注；envelope 全原始类型 |
| 二进制分帧复杂度 | 64KB 分片、序号校验、超时回收；实现顺序排在 proxy 通道跑通之后，失败不影响主链路 |
| 与现有桥并存 | 注入名默认 `HbNative` 与 `HanziNative` 不同名，零冲突 |

## 十一、回滚

纯新增变更 + 3 处增量接线：`git revert` 提交序列即可；无权限变更、无现有文件修改，回滚后工程与改造前完全一致。
