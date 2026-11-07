# AGENTS.md — 儿童识字游戏 monorepo

一套 Web 内核 + 三端原生壳的跨平台识字游戏（面向 ~3.5 岁儿童）。**任何 AI 助手/新协作者先读完本文件再动手。**

## 目录地图

```
taro-app/        ★ Web 内核（Vite + React，纯 TS）——全部业务逻辑都在这里
harmony-app/     鸿蒙壳（ArkTS + ArkWeb），entry 模块 + jsbridge HAR SDK（建设中）
android-shell/   Android 壳（Kotlin + WebView）
ios-shell/       iOS 壳（Swift + WKWebView）
docs/            桥协议规范、构建部署经验等文档
```

## 跨端铁律（改代码前必读）

1. **逻辑写 Web，壳做哑能力。** 业务逻辑（游戏规则、发星/奖牌、数据路由与迁移、播报 id 匹配、状态机）一律写在 `taro-app/src`。原生壳只做三件事：引擎调用（TTS/录音/ASR）、原始事件透传（`__onXxx`，参数原样转发不做过滤）、哑 K-V 存储（`kvGet/kvSet`）。发现自己在壳里写 if/else 业务判断 = 方向错了。
2. **桥协议唯一契约：`taro-app/src/services/native/types.ts`**（含三壳需实现的完整注释）。规范细节见 `docs/bridge-protocol.md`。改协议 = 同步改三壳 + types.ts + 协议文档，缺一不可提交。
3. **Web 产物不入库，三端靠 sync 保持一致。** 三壳内嵌的 `ios-shell/HanziKid/www`、`android-shell/app/src/main/assets/www`、`harmony-app/entry/src/main/resources/rawfile/web` 都是 `npm run build:h5 && npm run sync:all` 的生成物，已加入 `.gitignore`。**构建任一端前必须先 sync**；源码、文案、音色包源文件（`taro-app/public/audio`）入库。改 Web 源码后：`tsc --noEmit` → `build:h5` → `sync:all` → `check:sync` 校验三端一致 → 再构建壳。
4. **新能力必须优雅降级。** Web 侧按能力探测（`typeof native.xxx === 'function'`）走回退链：kvGet → legacy 方法 → localStorage；TTS 事件丢失有兜底超时。旧壳/纯浏览器打开（H5）必须能玩。
5. **发星/奖牌/字库等游戏数据模型只在 `taro-app/src/game` 与 `services/store.ts` 定义**，持久化 key 一律 `hzk_*` 前缀。

## 常用命令

| 命令 | 位置 | 用途 |
|---|---|---|
| `npm run dev` | taro-app | 本地开发（浏览器直接打开，桥走降级路径） |
| `npx tsc --noEmit` | taro-app | 类型检查（vite build 不查类型，**必须单独跑**） |
| `npm run build:h5` | taro-app | 构建 Web 产物 |
| `npm run sync:all` | taro-app | 产物分发到三壳（harmony/android/ios） |
| `npm run check:sync` | taro-app | 校验三壳内嵌产物与 `dist` 完全一致 |
| `open HanziKid.xcodeproj` | ios-shell | Xcode 打开 iOS 壳并 Run |
| `xcodebuild -project HanziKid.xcodeproj -scheme HanziKid -destination 'platform=iOS Simulator,name=iPad (A16)' build` | ios-shell | 命令行编译 iOS 壳（验证用） |
| `devecocli build` | harmony-app | 构建鸿蒙 HAP |
| `devecocli run --skip-build --device <serial>` | harmony-app | 部署到设备 |

**完整验证链（改 Web 源码后）**：`tsc --noEmit` → `build:h5` → `sync:all` → `check:sync` →（改了 .ets 则 `arkts_check`）→ `devecocli build`。构建失败先修再继续，验证链没跑完不算完成。

## 设备

- 真机：HUAWEI MatePad 11.5''S（serial `3GLUN24613G05978`）——TTS/录音验证必须真机（模拟器无 TTS 引擎）
- 模拟器：Tablet_611（`127.0.0.1:5555`）——UI 走查用
- 用户说「我的平板」默认指真机，部署前确认

## 提交规范

- 分批提交：按功能/主题拆批（功能源码、壳适配、规范文档、产物同步各自独立或按主题合并），一一批提交，消息用 `feat:`/`fix:`/`docs:`/`chore:` 前缀 + 中文描述
- 源码与对应产物同批提交；禁止提交半套（如只提 harmony 产物不提 android/ios）
- 不提交密钥/签名配置；`taro-app/dist` 不入库（产物在壳内）

## 设计偏好（产品向）

- 儿童向：反馈多样化、有情绪价值；奖牌人人有（保底 🥉）；字组 ≥10 字；候选优先 4 选
- 大功能先出方案文档确认后再实现；用户明确要求才做 UI 自动验证（verify_ui 类工具）
