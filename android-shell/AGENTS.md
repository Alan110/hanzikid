# android-shell — Android 壳（哑能力）

Kotlin + WebView 壳。只做引擎调用、事件透传、哑 K-V，业务逻辑一律在 `taro-app`（见根 AGENTS.md）。

## 结构

```
app/src/main/java/com/alan/hanzikid/
  MainActivity.kt      WebView 装载 + addJavascriptInterface(bridge, "HanziNative")
  NativeBridge.kt      桥实现（speak 带 id 透传 + UtteranceProgressListener 回推 + kv/legacy）
  VoiceEngine.kt       AudioRecord 录音 + AudioTrack 回放 + SpeechRecognizer 听写
app/src/main/assets/www/   ★ 构建产物，由 sync:android 生成，勿手改
```

## 规则

- 桥协议契约：`taro-app/src/services/native/types.ts`；规范：`docs/bridge-protocol.md`
- **`@JavascriptInterface` 方法按名称+参数个数严格匹配**：Web 侧给 speak 加 id 参数时壳必须同步加参数，否则调用被静默丢弃（2026-11 教训）
- TTS 回调在 binder 线程，回推必须 `runOnUiThread`；id/状态原样透传不做过滤
- 新持久化数据走 `kvGet/kvSet`（SharedPreferences），禁止加专用键方法
