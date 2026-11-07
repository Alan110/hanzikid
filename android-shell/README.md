# 识字小乐园 · Android 壳

全屏 WebView 壳工程：加载 Taro H5 产物（`app/src/main/assets/www/`），
注入 `window.HanziNative` 桥提供原生 TTS / 录音回放 / 语音识别 / 持久化。
协议定义见 `taro-app/src/services/native/types.ts`。

## 页面产物更新

```bash
cd ../taro-app
npm run build:h5 && npm run sync:android
```

## 用 Android Studio 打开

工程未附带 Gradle Wrapper（`gradlew` 二进制无法进 git），首次打开：

1. Android Studio（Ladybug+ / AGP 8.5 需 JDK 17，AS 自带）→ Open → 选择本目录
2. AS 提示缺少 wrapper 时，选择使用本地 Gradle 发行版（8.7+）或让 AS 自动生成
3. Sync 完成后直接 Run `app` 到设备/模拟器

## 权限

- `RECORD_AUDIO`：读一读跟读录音，运行时在游戏内触发申请（`voiceEnsureMic`）
- `INTERNET`：系统 TTS / 语音识别服务可能联网

## 原生能力对应

| 桥方法 | Android 实现 |
| --- | --- |
| `speak/stop` | `TextToSpeech`（zh-CN，语速同游戏量纲） |
| `get/setProgress`、`get/setSettings` | `SharedPreferences("hanzi_native")` |
| `voiceStartRecord/Stop` | `AudioRecord` 16k/mono/16bit，内存缓存；回推 `recStopped{ms,peak}` |
| `voicePlayRecording` | `AudioTrack`（静态模式），播完回推 `playbackDone` |
| `voiceRecognize(word)` | 录音期间 `SpeechRecognizer` 在线听写（系统无文件识别 API），回推 `asrResult/asrError` |
| `pinyinOf` | 返回空串，游戏侧兜底（同音容错降级） |

## 已知限制

- 语音识别依赖系统 `SpeechRecognizer` 服务（Google 移动服务或厂商等价服务）。
  无服务的设备（如部分无 GMS 的国产 ROM）读一读自动走 `asrError` → 游戏兜底，其余玩法不受影响。
- 工程未在本仓库的开发机上编译验证（本机无 Android SDK/Gradle），
  首次 Sync 如遇小版本问题，按 AS 提示调整即可（代码只用 framework API）。
