# 识字小乐园 · iOS 壳

全屏 WKWebView 壳工程：加载 bundle 内 Taro H5 产物（`HanziKid/www/`），
注入 `window.HanziNative` 桥提供 AVSpeechSynthesizer 朗读、录音回放、
SFSpeechRecognizer 识别与 UserDefaults 持久化。
协议定义见 `taro-app/src/services/native/types.ts`。

Windows 开发机无法生成/验证 Xcode 工程，本目录交付**全部源码 + 组装步骤**，
在 Mac 上约 5 分钟即可组装出可运行工程。

## 页面产物更新

```bash
cd ../taro-app
npm run build:h5 && npm run sync:ios
```

## Xcode 组装步骤（一次性）

1. Xcode → File → New → Project → **iOS App**
   - Product Name: `HanziKid`；Interface: Storyboard；Language: Swift
   - 保存到任意位置（不要覆盖本目录）
2. 删除 Xcode 生成的 `AppDelegate.swift` / `SceneDelegate.swift` / `ViewController.swift`
   和 `Main.storyboard` / `LaunchScreen.storyboard`
3. 把本目录 `HanziKid/` 下的 4 个 `.swift` 文件拖进工程（勾选 Copy items if needed、加入 App target）
4. 把本目录 `HanziKid/www` 以 **Folder Reference（蓝色文件夹）** 拖进工程
   （必须蓝色：这样 `npm run sync:ios` 更新后无需重新添加）
5. 用本目录 `HanziKid/Info.plist` 的内容**整体替换** Xcode 生成的 `Info.plist`
   （保留其中 `$(...)` 变量写法；同时确认 target → General → Deployment Target ≥ iOS 15）
6. Signing & Capabilities 选择自己的 Team，Run 即可

## 权限（Info.plist 已含）

- `NSMicrophoneUsageDescription`：读一读跟读录音
- `NSSpeechRecognitionUsageDescription`：跟读发音识别

## 原生能力对应

| 桥方法 | iOS 实现 |
| --- | --- |
| `speak/stop` | `AVSpeechSynthesizer`（zh-CN；游戏 rate 0.65~1.1 线性压到 0.1~0.62） |
| `get/setProgress`、`get/setSettings` | `UserDefaults`（key: `progress` / `settings`） |
| `voiceStartRecord/Stop` | `AVAudioRecorder`（m4a/AAC 16k 单声道）；回推 `recStopped{ms,peak}` |
| `voicePlayRecording` | `AVAudioPlayer`，播完回推 `playbackDone` |
| `voiceRecognize(word)` | `SFSpeechURLRecognizer`（录音文件识别，系统自动选端侧/云）；回推 `asrResult/asrError` |
| `pinyinOf` | 返回空串，游戏侧兜底 |

## 已知限制

- `SFSpeechRecognizer` 首次识别需网络与 Apple 授权；被拒绝或不可用时走 `asrError` → 游戏兜底。
- 同步读（`getProgress/getSettings`）经 DOCUMENT_START UserScript 注入快照实现：
  页面加载后原生侧更新不会热同步，下次加载生效（游戏本身也是启动时读一次，行为一致）。
- 源码未经 Mac 编译验证，若 Swift 版本告警按 Xcode 提示修正即可。
