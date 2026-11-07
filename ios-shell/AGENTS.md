# ios-shell — iOS 壳（哑能力）

Swift + WKWebView 壳。只做引擎调用、事件透传、哑 K-V，业务逻辑一律在 `taro-app`（见根 AGENTS.md）。

## 结构

```
HanziKid/
  AppDelegate.swift        入口
  SceneDelegate.swift      Scene 生命周期：创建 window + 挂 ViewController
  ViewController.swift     WKWebView 装载 + UserScript 注入
  HanziNativeBridge.swift  桥实现（messageHandlers 异步通道 + kv 注入时快照）
  VoiceEngine.swift        AVSpeechSynthesizer TTS + AVAudioRecorder 录音 + SFSpeechRecognizer
  Info.plist               含 UIApplicationSceneManifest（iOS 27 SDK 起强制 Scene 生命周期）
  www/                     ★ 构建产物，由 sync:ios 生成，勿手改（工程内为蓝色文件夹引用）
HanziKid.xcodeproj/        可直接打开的工程（共享 Scheme），Mac 上 open 即可 Run
```

## 运行

- `open HanziKid.xcodeproj` 直接 Run；命令行：`xcodebuild -project HanziKid.xcodeproj -scheme HanziKid -destination 'platform=iOS Simulator,name=iPad (A16)' build`
- 真机需在 target → Signing 选择 Team；Bundle ID `com.alan.hanzikid`（三端一致）

## 规则

- 桥协议契约：`taro-app/src/services/native/types.ts`；规范：`docs/bridge-protocol.md`
- **kvGet 是注入时快照**（WKWebView 无同步原生调用）：需要启动时同步读取的新 `hzk_*` key 要加进 `HanziNativeBridge.swift` 的 `kvKeys`；运行期写经 kvSet 更新 JS 映射并异步落 UserDefaults（详见协议文档 §6）
- TTS 播报 id 挂在 `SpeakUtterance` 子类上经 delegate 原样回推；状态只有 complete/stop（AVSpeechSynthesizer 无 error 回调），Web 侧兜底超时已覆盖
- 新持久化数据走 `kvGet/kvSet`（UserDefaults），禁止加专用键方法
