# ArkWeb JSBridge 技术调研：生态现状、官方 API 与演进方向

> 调研日期：2026-11-02
> 背景：本项目 H5↔原生通信采用自研桥（`HanziNativeBridge`，基于 ArkWeb 官方 API 薄封装）。
> 调研问题：鸿蒙市面上是否有成熟的 JSBridge 框架可以直接拿来用？当前自研方案是否落后？

## 一、结论（TL;DR）

1. **鸿蒙没有事实标准的第三方 JSBridge 框架**。不像 Android 有 JsBridge（lzyzsd）、iOS 有 WebViewJavascriptBridge 这样的社区标配；Gitee / OpenHarmony TPC 上有一些社区封装，但采用度低、成熟度不足，引入反而增加维护风险。
2. **"官方内置桥接 + 自研薄封装"就是市场主流做法**，本项目当前方案不落后，维持自研桥，不引入第三方框架。
3. ArkWeb 官方提供的桥接 API 本身成熟稳定，功能上等价于其他平台的"官方 JSBridge"，自研桥只需做薄封装。
4. **演进方向已明确**：若后续 H5↔原生消息交互变频繁或数据量变大，从 `javaScriptProxy` 注入方式升级到 `WebMessagePort` 端口通信——这是官方推荐的演进路径，届时同样无需引入任何第三方库。

## 二、生态现状分层分析

| 层级 | 代表 | 状态 | 对本项目的适用性 |
|---|---|---|---|
| 官方机制 | ArkWeb 内置桥接（见第三节） | 成熟稳定，官方推荐 | ✅ 现有方案的基础 |
| 独立第三方 JSBridge 库 | Gitee / OpenHarmony TPC 社区封装 | 无事实标准，采用度低 | ❌ 不引入 |
| 自带 bridge 的跨端框架 | uni-app、Taro、RN OpenHarmony | 成熟但为整体框架 | ❌ 已有自研 H5，重量级改动，明确排除 |

### 2.1 包管理生态实测检索（2026-11-02 补充）

对 ohpm / npm 包管理生态做了实际检索验证，结论：**ohpm 仓内没有可用的 JSBridge 三方库**。

**检索方式与结果：**

1. **ohpm 官方仓（ohpm.openharmony.cn，ohpm CLI v26.0.0.630）**：
   - `ohpm info` 逐一查询候选包名 `jsbridge`、`hybrid-jsbridge`、`@dead_fish/jsbridge`、`@lcy453/miniapp-runtime-harmony-web-sdk` 等 → **全部 404，均未发布在 ohpm 仓**
   - ohpm CLI 无 search 子命令；官网搜索 API 有防重放签名校验（错误码 204020），无法批量模糊检索
2. **npm / npmmirror 镜像**：检索 `jsbridge harmonyos`、`harmonyos webview bridge` 共命中 6 个相关包，全部为**个人开发者项目、下载量极低**：

| 包名 | 说明 | 下载量 | 是否在 ohpm |
|---|---|---|---|
| `@dead_fish/jsbridge` | Android/iOS/HarmonyOS 三端 jsbridge，npm 分发 | 221 | ❌（仅 npm） |
| `ota-native-bridge` / `open_native_bridge` | OTA 壳应用跨平台 Bridge TS SDK | 112 / 21 | ❌（仅 npm） |
| `@alvin917/jsbridge-plugin` 等 | jsbridge 编译器插件 | 15 | ❌ |
| `@lcy453/miniapp-runtime-harmony-web-sdk` | 自研小程序运行时的 H5 侧 SDK | 0 | ❌ |
| `@xnhz-atomic/atomic-harmony-web-sdk` | WebView bridge + AI 翻译 SDK（UNLICENSED） | 0 | ❌ |

3. **Gitee / 搜索引擎**：Gitee API 搜 "jsbridge harmonyos" 仓库为空；搜索引擎未发现任何有采用度的 ohpm JSBridge 三方库。

**解读：** npm 上零星的鸿蒙 JSBridge SDK 有两个致命问题——一是均为个人项目、无社区采用（下载量最高仅 221）、无维护保障；二是**只发 npm 不发 ohpm**，意味着原生侧（HarmonyOS 工程）根本无法通过 `ohpm install` 引入，这类包最多只能作为 H5 侧 JS SDK 使用。包管理生态的实测结果进一步印证了"官方 API + 自研薄封装"的选型。

## 三、官方 ArkWeb 桥接 API 清单

以下 API 即"官方 JSBridge"，按通信模型分为三类：

### 3.1 注入对象（JSBridge 模型）——本项目当前所用

- `javaScriptProxy`：Web 组件的属性方法，**初始化时**注入原生对象到 `window`；每个 Web 组件仅支持注册一个对象（本项目所用）。
- `registerJavaScriptProxy`：`WebviewController` 的方法，**初始化完成后**调用；支持注册多个对象，需配合 `deleteJavaScriptRegister` 防内存泄漏。
- 注意：网页发生**重定向后注入的 JS 对象会丢失**（见 FAQ `faqs-arkweb-139`），重载/跳转场景需重新注册。
- 两者区别详见 FAQ `faqs-arkweb-20`。

### 3.2 原生调用 H5

- `runJavaScript` / `runJavaScriptExt`：在当前页面上下文执行 JS 代码片段。本项目用于回推语音事件（`window.__onVoiceEvent(...)`）。

### 3.3 端口通信（消息通道模型）——演进方向

- `WebMessagePort` + `createWebMessagePorts` + `postMessage`：详见第五节。

### 3.4 NDK C/C++ 通道（备选）

- 文档 `arkweb-ndk-page-data-channel`：Native 侧建立与前端页面的数据通道，支持 string / buffer，消息收发和回调可在非 UI 线程运行。
- 适用场景：ArkTS + C++ 混合开发、小程序式架构。本项目纯 ArkTS，暂不适用。

## 四、JSBridge 模型 vs 端口通信模型对比

| | JSBridge（注入对象） | WebMessagePort（端口通信） |
|---|---|---|
| 通信模型 | 注入原生对象，H5 调用其方法 | 双向消息通道，两端互发消息 |
| 适合场景 | "调用-返回"式请求（TTS 播放、存取进度） | 高频推送、大块/二进制数据传输 |
| 数据规格 | 方法参数，以字符串/基础类型为主 | 支持 string / number / boolean / **ArrayBuffer** / 数组 / 错误对象（`WebMessageExt`） |
| H5 侧写法 | 依赖平台特有的注入对象 | 与浏览器标准 `MessageChannel` + `postMessage` 一致，web 代码零改动可跑 |
| 生命周期 | 重定向后对象丢失，需重新注册 | 端口持久存在，需手动 `close()` |

两者区别的官方说明见 FAQ `faqs-arkweb-11`：主要差异在数据量传递规格和适用场景，按需选择。

## 五、WebMessagePort 详解

### 5.1 是什么

ArkWeb 提供的"消息端口"接口，用于应用侧（ArkTS）与 H5 侧（JavaScript）之间建立**持久的双向通信通道**。机制上对标浏览器标准的 `MessageChannel` + `postMessage`，而非 JSBridge 的"注入对象、调方法"模型。

### 5.2 工作机制（四步）

1. 应用侧 `controller.createWebMessagePorts()` 创建**一对**关联端口；
2. 应用侧保留一个端口，用 `onMessageEvent` 注册接收回调；
3. 用 `controller.postMessage('__init_port__', [另一个端口], '*')` 把第二个端口"邮寄"给 H5；H5 在 `window.addEventListener('message')` 里从 `event.ports[0]` 拿到并保存；
4. 之后两端各自用 `port.postMessageEvent()` 发、`onmessage` 收，随时互发消息；用完调 `close()` 关闭端口。

### 5.3 代码骨架（摘自官方指南 `web-app-page-data-channel`）

应用侧（ArkTS）：

```ts
// 1. 创建一对端口
this.ports = this.controller.createWebMessagePorts();
// 2. 应用侧端口注册接收回调
this.ports[1].onMessageEvent((result: webview.WebMessage) => {
  // string / ArrayBuffer 等分类型处理
});
// 3. 另一个端口发送给 H5
this.controller.postMessage('__init_port__', [this.ports[0]], '*');
// 4. 之后互发消息
this.ports[1].postMessageEvent('hello');
// 用完关闭
this.ports[0].close();
```

H5 侧（JavaScript）：

```js
var h5Port;
window.addEventListener('message', function (event) {
  if (event.data === '__init_port__') {
    h5Port = event.ports[0];          // 保存应用侧发来的端口
    h5Port.onmessage = function (e) { // 接收应用侧消息
      // ...
    };
  }
});
// 之后发送：h5Port.postMessage('hello');
```

## 六、本项目现状与演进建议

### 6.1 现状

- 桥实现：`entry/src/main/ets/pages/Index.ets` 中 `HanziNativeBridge` 类，经 `javaScriptProxy` 注入为 `window.HanziNative`（单对象注入，Index.ets:186）。
- 已暴露接口：`speak` / `stop`（TTS）、`getProgress` / `setProgress` / `getSettings` / `setSettings`（Preferences 持久化）、`voice*` 系列 6 个语音原语（录音/识别，状态机在 game.js）。
- 反向通道：原生→H5 事件经 `runJavaScript` 调用 `window.__onVoiceEvent(type, json)` 回推（Index.ets:168）。
- 特点：全部为"调用式"或低频事件回推，无大数据量、无二进制传输需求。

### 6.2 建议

- **维持现有 `javaScriptProxy` 注入方案**，当前所有接口都是"调用-返回"模型，与 JSBridge 模式天然匹配，够用且最简。
- **触发升级到 WebMessagePort 的信号**（满足其一再考虑）：
  - 原生→H5 出现**主动高频通知**（当前 `__onVoiceEvent` 回推频率尚低）；
  - 需要**二进制/大块数据**传输（如音频流、批量数据同步）；
  - 需要与浏览器 web 版共享同一套通信代码（端口通信 H5 侧写法与标准一致）。
- 升级时无需引入第三方库，仅在现有桥封装层内替换传输通道，`HanziNativeBridge` 对外接口可保持不变。

## 七、参考文档索引

| 文档 ID | 内容 |
|---|---|
| `faqs-arkweb-11` | JSBridge 技术与端口通信技术的区别 |
| `faqs-arkweb-20` | `javaScriptProxy` 与 `registerJavaScriptProxy` 的区别 |
| `faqs-arkweb-139` | 网页重定向后 JS 对象丢失问题 |
| `web-app-page-data-channel` | 建立应用侧与前端页面数据通道（端口通信完整示例） |
| `arkts-apis-webview-webmessageport` | WebMessagePort 接口参考 |
| `arkts-apis-webview-webmessageext` | WebMessageExt 扩展数据对象（支持的数据类型） |
| `arkweb-ndk-page-data-channel` | NDK C/C++ 侧数据通道 |
| `faqs-arkweb-179` | H5 适配 HarmonyOS 开发指导 |
