# @hanzi/jsbridge

通用、业务无关的 HarmonyOS JSBridge SDK。原生侧为 ArkTS HAR 模块，H5 侧为单文件 JS SDK（`rawfile/jsbridge.js`），通过 **javaScriptProxy 同步通道 + WebMessagePort 异步通道** 双通道自动协商，提供协议化 RPC、事件总线、二进制传输与插件化扩展能力。

## 特性

- **双通道自动协商**：同步调用恒走 `javaScriptProxy`；异步调用在 port 通道就绪后自动切换到 `WebMessagePort`，未就绪时自动降级 proxy / `runJavaScript` 回推
- **协议化 RPC**：统一 envelope（JSON），带 id 关联、超时控制（默认 30s，错误码 40801）、恰好一次 resolve/reject 保护
- **事件总线**：原生↔H5 双向事件，H5 侧支持 `ns.*` 前缀通配订阅
- **二进制传输**：双向 ArrayBuffer，64KB 分帧 + 重组 + 回执（ack），避开 JSON 编解码大负载
- **插件化**：核心只含通道/协议/RPC/事件；`system`（诊断）、`storage`（Preferences）为可选插件，业务能力按同样模式扩展
- **零依赖、零业务耦合**：不依赖任何业务代码，现有桥可与本 SDK 共存（默认注入名 `HbNative`，可配置）

## 快速开始

### 原生侧（ArkTS）

```ts
import { webview } from '@kit.ArkWeb';
import { BridgeClient, registerSystemPlugin, registerStoragePlugin } from '@hanzi/jsbridge';

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  private client: BridgeClient = BridgeClient.attach(this.controller);

  aboutToAppear(): void {
    registerSystemPlugin(this.client);                    // 可选：诊断方法
    registerStoragePlugin(this.client, getContext(this)); // 可选：Preferences K-V
    this.client.register('hello.add', (ctx, paramsJson) => {
      // 业务方法：命名空间.方法名
      ctx.resolve(paramsJson); // 恰好一次 resolve / reject(code, message)
    });
    this.client.onEvent((event, dataJson) => { /* H5→原生事件 */ });
  }

  build() {
    Web({ src: $rawfile('index.html'), controller: this.controller })
      .javaScriptProxy({
        object: this.client.injectedObject(),
        name: this.client.proxyName(),        // 默认 'HbNative'
        methodList: this.client.injectedMethodList(),
        controller: this.controller
      })
  }

  aboutToDisappear(): void {
    this.client.detach();
  }
}
```

### H5 侧

```html
<script src="jsbridge.js"></script>
<script>
  Bridge.ready.then(info => console.log(info.methods, info.caps));
  const pong = await Bridge.call('system.ping', { n: 1 });   // 异步 RPC（Promise）
  const v = Bridge.callSync('storage.getSync', { key: 'k' });// 同步 RPC（返回值直取）
  Bridge.on('voice.*', (data, event) => {});                 // 前缀通配订阅
  Bridge.emit('h5.ready', { any: 'payload' });               // H5→原生事件
  await Bridge.sendBinary('up.blob', arrayBuffer);           // 二进制上行
  Bridge.onBinary('down.blob', (buffer, event) => {});       // 二进制下行
</script>
```

## 原生侧 API 摘要（BridgeClient）

| 方法 | 说明 |
| --- | --- |
| `BridgeClient.attach(controller, options?)` | 挂接 WebviewController，返回门面实例 |
| `register(method, handler)` / `registerSync(method, handler)` | 注册异步/同步方法（`ns.name` 形式） |
| `registerModule(namespace, entries)` | 按命名空间批量注册 |
| `unregister(method)` | 注销方法 |
| `emit(event, dataJson)` | 原生→H5 事件 |
| `emitBinary(event, buffer)` | 原生→H5 二进制（port 就绪后可用） |
| `onEvent(sink)` / `onBinary(sink)` | 订阅 H5→原生事件/二进制 |
| `injectedObject()` / `proxyName()` / `injectedMethodList()` | `javaScriptProxy` 三件套 |
| `portReady()` / `methodList()` | 诊断 |
| `detach()` | 卸载清理（Web 销毁时调用） |

默认配置（`BridgeOptions`）：`proxyName: 'HbNative'`、`enablePort: true`、`invokeTimeoutMs: 30000`、`protocolVersion: 1`。

## 内置插件

| 方法 | 类型 | 说明 |
| --- | --- | --- |
| `system.info` | 异步 | SDK 版本 / 协议版本 / port 状态 / 方法数 |
| `system.ping` | 异步 | 往返延迟测量 |
| `system.delayedEcho` | 异步 | 延迟 2s 应答（验证延迟 resolve） |
| `system.neverResolve` | 异步 | 永不应答（验证 40801 超时） |
| `storage.get/set/remove/keys` | 异步 | Preferences K-V |
| `storage.getSync/setSync` | 同步 | Preferences K-V（同步） |

自定义插件模式参考 `src/main/ets/plugins/SystemPlugin.ets`：组装 `BridgeModuleEntry[]` 后 `client.registerModule(namespace, entries)`。

## Demo

- HAR 内置组件 `BridgeDemoPanel` + 宿主页 `entry/pages/BridgeDemo.ets`
- 测试页 `entry/rawfile/bridge_demo.html`：9 项矩阵（hello / 同步 / 异步 / 延迟 / 超时 / storage 往返 / 事件双向 / 二进制双向 / 自测）
- 纯逻辑自测 `BridgeSelfTest`（经 `test.run` 方法触发，结果文本回传）

## 目录结构

```
jsbridge/
├── Index.ets                        # 包出口
├── h5/jsbridge.js                   # H5 侧 JS SDK（源码）
├── src/main/
│   ├── ets/
│   │   ├── core/                    # 协议与通道（业务无关）
│   │   │   ├── BridgeTypes.ets      # envelope/常量/错误码枚举
│   │   │   ├── BridgeCore.ets       # 分发中枢：hello/invoke/event/binary
│   │   │   ├── BridgeClient.ets     # 门面
│   │   │   ├── BridgeRegistry.ets   # 方法注册表
│   │   │   ├── ProxyChannel.ets     # javaScriptProxy 通道
│   │   │   ├── PortChannel.ets      # WebMessagePort 通道 + 分帧
│   │   │   └── BridgeLogger.ets     # 日志抽象
│   │   ├── plugins/                 # 可选插件
│   │   ├── components/BridgeDemoPanel.ets
│   │   └── test/BridgeSelfTest.ets
│   └── resources/rawfile/jsbridge.js  # H5 SDK 分发副本
└── docs → 见仓库 docs/developer/jsbridge-protocol.md
```

协议格式、通道时序与错误码详见 [docs/developer/jsbridge-protocol.md](../docs/developer/jsbridge-protocol.md)。

## License

Apache-2.0
