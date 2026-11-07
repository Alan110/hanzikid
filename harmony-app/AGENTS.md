# harmony-app — 鸿蒙壳（哑能力）+ jsbridge HAR SDK

ArkTS + ArkWeb 壳工程。只做引擎调用、事件透传、哑 K-V，业务逻辑一律在 `taro-app`（见根 AGENTS.md 铁律）。

## 结构

```
entry/src/main/ets/pages/Index.ets        桥注册（javaScriptProxy）+ TTS 事件接线 + 页面入口
entry/src/main/ets/common/NativeTTS.ets   CoreSpeechKit TTS（requestId=Web 播报 id 原样透传）
entry/src/main/ets/common/NativeStore.ets Preferences 哑 K-V（getSync/putSync + 异步 flush）
entry/src/main/ets/common/NativeVoice.ets 录音/回放/ASR（writeAudio 禁传 subarray 视图，会崩）
entry/src/main/resources/rawfile/web/     ★ 构建产物，由 sync:harmony 生成，勿手改
jsbridge/                                 @hanzi/jsbridge HAR SDK（独立演进方向，见协议文档 §8）
```

## 命令

- 构建：`devecocli build`；改 .ets 后先跑 `arkts_check`（工具自动修复高置信错误）
- 部署：`devecocli run --skip-build --device <serial>`；查设备 `devecocli device list`
- 真机 MatePad serial `3GLUN24613G05978`（TTS 验证必须真机）；模拟器 Tablet_611 `127.0.0.1:5555`

## 规则

- ArkTS 严格模式：禁 any/as 断言/对象字面量无类型；V1/V2 状态装饰器不得混用
- 改桥方法 = 同步改 `methodList` + `taro-app/src/services/native/types.ts` + 协议文档
- TTS 事件只透传 `(id, status)` 不做过滤；存储只做 K-V 不做迁移逻辑
- module.json5 权限（麦克风）改动需同步评估 AppGallery 儿童隐私合规
