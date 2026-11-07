# 识字小乐园 · Web 内核

游戏主体的 **React + Vite** 实现：构建 H5 产物（`dist/`），由三个原生壳
WebView 本地加载，实现鸿蒙 / iOS / Android 三端复用。
跨端方案详见 `../harmony-app/docs/developer/cross-platform.md`。

```
web-app/                      ← 本工程（游戏逻辑，跨端共享）
  src/
    components/screens/       Home / Learn 认一认 / Quiz 找一找 / Read 读一读 / Flow 学一学 / End
    game/                     字库 data、文案 copy、上下文 ctx、工具 util
    services/                 speech(TTS) / sfx(音效) / store(进度) / native(桥探测)
  scripts/sync-web.mjs        dist → 三端壳资源目录
  vite.config.ts              iife 单文件构建 + 经典脚本标签改写
harmony-app/                  鸿蒙壳（ArkWeb + CoreSpeechKit，rawfile/web/）
android-shell/                Android 壳（WebView + TextToSpeech/SpeechRecognizer，assets/www/）
ios-shell/                    iOS 壳（WKWebView + AVFoundation/Speech，bundle www/）
```

## 开发

```bash
npm install
npm run dev            # 本地开发（浏览器直接调试，无桥走降级路径）
npm run build:h5       # 生产构建 → dist/（iife 经典脚本，null origin 可加载）
npm run sync:all       # dist 同步到三个壳（harmony|android|ios|all）
```

发版三端 = `npm run build:h5 && npm run sync:all`，然后各壳正常构建：
鸿蒙 DevEco / hvigor，Android Studio，Xcode（首次组装见 `ios-shell/README.md`）。

## 跨端桥（window.HanziNative）

协议见 `src/services/native/types.ts`，三端实现一致：

| 能力 | 鸿蒙 | Android | iOS |
| --- | --- | --- | --- |
| 朗读 | CoreSpeechKit | TextToSpeech | AVSpeechSynthesizer |
| 进度/设置 | Preferences | SharedPreferences | UserDefaults |
| 录音/回放 | AudioKit | AudioRecord/AudioTrack | AVAudioRecorder/AVAudioPlayer |
| 跟读识别 | 端侧 Speech Kit | SpeechRecognizer（在线听写） | SFSpeechURLRecognizer |
| 拼音注音 | 原生 i18n | 返回空串走兜底 | 返回空串走兜底 |

浏览器打开（无桥）：朗读走 `speechSynthesis`，读一读自动降级纯跟读模式。

## 产物硬约束（改 vite.config.ts 前必读）

三端壳都以本地方案加载 dist（`resource://rawfile` / `file:///android_asset`
/ `file://`），页面 **origin 为 null**：

- **必须经典脚本**：`<script type="module">` 属 CORS 请求，在 null origin
  下被 ArkWeb/WebKit 拦截 → 白屏（2026-11-05 踩过）。因此 rollupOptions
  固定 `format: 'iife'`，且 `classicScriptTags()` 插件把 Vite 写死的
  `type="module" crossorigin` 标签改写为 `<script defer>`
- **相对路径**：`base: './'`，不能改回 '/'
- 产物仅相对引用 `./js ./css`，任意子目录（rawfile/web、assets/www、bundle www）可加载
