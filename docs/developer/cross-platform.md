# 跨端方案：一套 Web 内核 + 三端原生壳

> 2026-11-07 定稿。此前评估并否决了 Taro 方案（见文末决策记录）。

## 总体架构

```
┌─ web-app/（Web 内核 = 游戏本体）────────────────────┐
│  React + Vite + TypeScript + SCSS                  │
│  构建产物 dist/：index.html + js/app.js + css/     │
│  npm run sync:all → 同步进三端壳的本地资源目录       │
└──────────┬─────────────────┬─────────────────┬─────┘
           ▼                 ▼                 ▼
   harmony-app/       android-shell/     ios-shell/
   ArkWeb 壳           WebView 壳         WKWebView 壳
   $rawfile 加载       android_asset      Bundle.main
   HanziNative 桥      桥(待实现)         桥(待实现)
```

- **共享层**：游戏 UI/玩法/逻辑 100% 在 `web-app`，只写一份
- **每端独有**：WebView 容器 + 桥的原生实现（约 10 个方法，协议见
  [jsbridge-protocol.md](jsbridge-protocol.md)，SDK 化进行中：`jsbridge/` HAR）

## 为什么不用 Taro / uni-app

1. **跨端目标不经过它们**：三端壳都是 WebView 加载本地网页，UI 层天生跨端，
   不需要"编译期跨端"（Taro 的价值是编译到小程序/RN 等非 WebView 目标）
2. **桥必须自研**：Taro 的桥只有标准 API（存储/系统信息等），没有本项目
   核心的 TTS/ASR/录音/评分；换协议不省任何原生工作量
3. **产物可控性**：Taro h5 产物是 ES module，在 `resource://rawfile`
   （origin null）下被 ArkWeb CORS 拦截导致白屏（2026-11-05 踩坑），
   还需额外拍平处理；纯 Vite 一份配置直接输出经典脚本（iife），从根上规避
4. 历史包袱：曾用 Taro 4.3.2（2026-11 迁入），2026-11-07 迁回纯 Vite，
   业务代码零改动（本就未用 Taro 组件/API）

## Web 内核的硬约束（所有壳共同要求）

三端都以**本地方案**加载 dist，页面 origin 为 `null`：

| 壳 | 加载方式 |
|---|---|
| 鸿蒙 | ArkWeb `$rawfile('web/index.html')` → `resource://rawfile` |
| Android | WebView `file:///android_asset/www/index.html` |
| iOS | WKWebView `Bundle.main/www/index.html` |

由此产生：

1. **必须输出经典脚本**：`<script type="module">` 属 CORS 请求，在 null
   origin 下被 ArkWeb/WebKit 拦截 → 白屏。Vite 配置
   `rollupOptions.output.format: 'iife' + inlineDynamicImports` 产出单文件
   `js/app.js`，并用内联插件把 Vite 写死的 `type="module" crossorigin`
   标签改写为 `<script defer>`（见 `web-app/vite.config.ts`）
2. **相对路径**：`base: './'`（绝对路径在这些协议下解析不到资源）
3. **hash 路由**（如有路由）：不依赖服务端重写
4. **CSS 静态引入**：不做运行时动态注入

## 构建链（改游戏内容后的完整流程）

```bash
cd web-app
npm run build:h5        # vite build → dist/
npm run sync:harmony    # → harmony-app rawfile/web/（装鸿蒙必跑）
# sync:android / sync:ios / sync:all
cd ../harmony-app
devecocli build         # 出 HAP
devecocli run --skip-build
```

## 各端桥实现要点

协议（方法签名、事件回推 `window.__onVoiceEvent(type, json)`）三端一致，
Web 侧 `web-app/src/services/native/` 是唯一调用方：

| 能力 | 鸿蒙（已实现） | Android（待） | iOS（待） |
|---|---|---|---|
| TTS 朗读 | CoreSpeechKit（聆小珊，离线） | TextToSpeech | AVSpeechSynthesizer |
| 录音/回放 | AudioKit 采集 + 播放 | AudioRecord/MediaPlayer | AVAudioEngine |
| ASR 识别 | Speech Kit（HiAI 端侧） | SpeechRecognizer | SFSpeechRecognizer |
| 拼音转写 | i18n.Transliterator | ICU Transliterator | CFStringTransform |
| 存储 | Preferences | SharedPreferences | UserDefaults |

音频参数细节（VAD 配对、裁静音、增益、writeAudio 禁用 subarray 视图等）
以鸿蒙实现为参考基准，见 `harmony-app/entry/src/main/ets/common/NativeVoice.ets`。

## 决策记录

- 2026-11-05：定位 ArkWeb rawfile 白屏根因（module 脚本 CORS 拦截），
  当时以 esbuild 拍平脚本作为 Taro 产物的补救
- 2026-11-07：确认 Taro 对本项目无实质价值（跨端走 WebView 壳、桥自研），
  迁移至纯 Vite + React，拍平逻辑内建进 `vite.config.ts`；目录更名
  `taro-app/ → web-app/`，包体从 ~330KB（4 chunk）降至 ~177KB（单文件）
