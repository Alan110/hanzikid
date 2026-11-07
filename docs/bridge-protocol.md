# 跨端原生桥协议规范（HanziNative Bridge）

> 唯一契约代码：`taro-app/src/services/native/types.ts`
> 本文档是三端壳实现的规范说明。协议变更 = 三壳 + types.ts + 本文档同步修改。

## 1. 设计原则：哑壳（Dumb Shell）

**壳只做哑能力，业务逻辑全部在 Web 端。**

| 层 | 职责 | 禁止 |
|---|---|---|
| 原生壳 | 引擎调用（TTS/录音/ASR）、原始事件透传、哑 K-V 存储 | 写任何业务判断/匹配/过滤/状态机 |
| Web 端 | 游戏规则、数据路由与迁移、播报 id 匹配、状态语义、兜底 | 直接调用平台专有 API |

理由：一套 Web 内核 × 三壳，壳越薄，三端行为越一致，新能力一次实现三端受益（壳实现 kvGet/kvSet 后，新数据类型零原生改动）。

## 2. 三壳注入方式

| 端 | 注入方式 | 同步调用 | 事件回推 |
|---|---|---|---|
| 鸿蒙 | ArkWeb `javaScriptProxy`（`Index.ets` HanziNativeBridge） | ✅ 天然同步 | `runJavaScript` |
| Android | `addJavascriptInterface`（`NativeBridge.kt`） | ✅ 天然同步 | `runOnUiThread + evaluateJavascript` |
| iOS | WKUserScript 注入 JS 包装（`HanziNativeBridge.swift`） | ⚠️ 注入时快照（见 §6） | `evaluateJavaScript` |

三端注入的对象都叫 `window.HanziNative`；浏览器直接打开（H5）时不存在，走降级路径。

## 3. 能力矩阵

| 方法/事件 | 签名 | 鸿蒙 | Android | iOS | 说明 |
|---|---|---|---|---|---|
| `speak` | `(text, rate, id)` | ✅ | ✅ | ✅ | TTS 朗读；id 由 Web 生成，回调原样带回 |
| `stop` | `()` | ✅ | ✅ | ✅ | 停止当前播报 |
| `__onSpeakDone` | `(id, status)` | ✅ | ✅ | ✅ | status ∈ `complete`/`error`/`stop`，原样转发 |
| `kvGet` | `(key): string` | ✅ | ✅ | ⚠️ 快照 | 通用 K-V 读，空串=无数据 |
| `kvSet` | `(key, value)` | ✅ | ✅ | ✅ | 通用 K-V 写 |
| `getProgress` 等 legacy ×4 | 见 types.ts | ✅ | ✅ | ✅ | **仅老数据迁移用**，新代码禁止调用 |
| `voiceEnsureMic` ~ `voiceCancel` ×6 | 见 types.ts | ✅ | ✅ | ✅ | 读一读语音原语 |
| `__onVoiceEvent` | `(type, json)` | ✅ | ✅ | ✅ | mic/recStarted/recStopped/playbackDone/asrResult/asrError |
| `pinyinOf` | `(text): string` | ✅ | ❌ 空串 | ❌ 空串 | 汉字转拼音；Android/iOS 返回空串走 Web 兜底 |

## 4. 事件回推规范

- 命名：`window.__onXxx`，由 Web 侧赋值，原生侧 `evaluateJavascript` 调用
- **参数原样透传**：原生不做过滤、不丢字段。过期/被打断的事件也照发——由 Web 按 id/状态自行取舍
- TTS：Web 为每次 `speak` 生成唯一 id（`spk-${Date.now()}-${seq}`）随调用传入；原生把它当引擎 requestId/utteranceId（鸿蒙 `SpeakParams.requestId`、Android `utteranceId`、iOS 挂在 `AVSpeechUtterance` 子类上），回调原样带回。**匹配逻辑（id 比对、status 语义、兜底超时）全在 `speech.ts`**
- Web 侧必须给每个「等事件再推进」的流程配兜底超时（防事件丢失卡死，也兼容不回推事件的旧壳）

## 5. 持久化规范（kv 协议）

- `kvGet(key): string` / `kvSet(key, value)`，key/value 均为字符串，空串表示无数据
- **存储 key 一律 `hzk_*` 前缀**（`hzk_stats`/`hzk_settings`/`hzk_awards`/`hzk_last`），key 即原生存储键，原生不做任何映射
- Web 侧路由链（`store.ts`，按能力探测）：
  - 读：`kvGet(key)` → legacy 专用键（老壳数据迁移）→ `localStorage`
  - 写：`kvSet(key, value)` → legacy → `localStorage`
- legacy 四方法（`getProgress/setProgress/getSettings/setSettings`）对应老版本的专用键（鸿蒙 Preferences `progress`/`settings`），**只用于读老数据迁移，新功能禁止使用**
- 新数据类型（如未来的奖励道具、学习报告）直接用新 `hzk_*` key 走 kv，零原生改动

## 6. iOS 快照限制

WKWebView 无法提供同步原生调用，`kvGet` 返回**注入时快照**：

- 快照覆盖的 key 列表在 `HanziNativeBridge.swift` 的 `kvKeys` 中维护，新增启动时需同步读取的 key 要追加进去
- 运行期写经 `kvSet` 同步更新 JS 侧映射并异步落 UserDefaults
- 因为 Web 侧每个 key 只在启动时读一次（store.ts 读链），快照语义与需求匹配；改动 store.ts 启动后重读 kv 的行为前先评估此限制

## 7. 新增原生能力 4 步清单

1. **types.ts**：在 `NativeBridge` 加方法签名 + 注释（契约即文档），必要时加 `__onXxx` 事件声明
2. **三壳**：各自实现（鸿蒙 `Index.ets` HanziNativeBridge + methodList；Android `NativeBridge.kt` + `@JavascriptInterface`；iOS `HanziNativeBridge.swift` userScript + handler）。保持哑：只转发，不判断
3. **Web 服务层**：在 `taro-app/src/services` 封装，**必须**做能力探测 + 降级路径（无桥可用时 H5 仍可玩）
4. **验证**：完整验证链跑通（见根 AGENTS.md），真机验证引擎能力（模拟器无 TTS）

## 8. jsbridge HAR SDK 演进说明（并行方向，勿混淆）

当前生产链路是上文描述的**直连桥**（`javaScriptProxy`/`addJavascriptInterface`/WKUserScript 三端各自手写）。

`harmony-app/jsbridge`（`@hanzi/jsbridge` HAR）是**独立演进方向**：把「直连桥 + 原生能力插件」沉淀为可复用的鸿蒙 HAR SDK（已有 StoragePlugin 等插件雏形与 BridgeDemoPanel 演示页）。它与直连桥**并存**：

- 直连桥 = 生产在用，协议以本文档为准
- jsbridge SDK = 鸿蒙侧的桥框架化重构，目标是插件化注册（speakDone 事件、KV 协议点登记进去），成型后 Index.ets 直连实现逐步收敛到 SDK，**Web 侧协议不变**
- 改协议时两处都要看：types.ts（契约）+ jsbridge 插件（鸿蒙 SDK 侧同步登记）

## 9. 版本兼容原则

- 协议只加不删；方法加参数时 Web 侧兼容旧壳（能力探测/兜底），壳侧兼容旧 Web（多传参数不崩：Android 按 Java 方法签名严格匹配，**加参数必须同步改壳**，这是 2026-11 通用化改造的教训）
- 老设备数据迁移靠 Web 读链回退完成，原生不做迁移代码
