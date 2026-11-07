# 识字小乐园重构方案

> 位置：harmony-app（鸿蒙工程）
> 前提：不引入前端构建工具链、不重写为纯原生页面。

## 目标

在不引入前端构建工具链、不重写为纯原生的前提下，解决单文件 `index.html`（981 行）中数据、样式、逻辑耦合的问题，为后续内容扩充和进度管理铺路。

## 改动清单（按顺序执行，每步可独立验证）

### 第 1 步：字库数据外置（优先）

- 从 `entry/src/main/resources/rawfile/index.html` 中抽出 `GROUPS` 数组（约 340-463 行），生成 `rawfile/data.json`，结构保持 `{ groups: [...] }`。
- HTML 中改为启动时 `fetch('./data.json')` 加载，加载失败时渲染错误提示界面。
- 验收：所有字组、模式选择、答题流程不回归。

### 第 2 步：拆分 CSS / JS 文件

- 样式拆为 `rawfile/style.css`；游戏逻辑拆为 `rawfile/game.js`；HTML 只留骨架与 `<link>/<script>` 引用。
- Web 组件已开 `fileAccess`（`entry/src/main/ets/pages/Index.ets:133`），rawfile 内相对路径可直接加载，无需改原生侧。
- 验收：构建部署后视觉与交互完全一致。

### 第 3 步：进度存储迁移到原生侧

- 扩展 `entry/src/main/ets/pages/Index.ets` 中 `HanziNativeBridge`（约 100-108 行），新增 `getProgress()` / `setProgress(json)` / `getSettings()` / `setSettings(json)` 方法，底层用 `@ohos.data.preferences`（或 RelationalStore）持久化。
- 网页侧 `store` 改为：检测 `window.HanziNative` 存在则走原生读写，否则回退 localStorage（保留浏览器直开调试能力）。
- 迁移逻辑：首次启动检测到 localStorage 有旧数据且原生侧为空，则上抛一次。
- 验收：卸载重装后进度仍在；答题后重启应用统计不丢。

### 第 4 步：字体本地化，去掉网络依赖

- 移除 `index.html` 中的 Google Fonts 引用；下载 ZCOOL KuaiLe 字体文件放入 `rawfile/fonts/`，`@font-face` 本地引用；或确认系统字体栈效果可接受后直接删除远程引用。
- 评估 `entry/src/main/module.json5` 中 `ohos.permission.INTERNET` 是否可移除（若第 3 步后无任何网络请求即可移除）。
- 验收：断网冷启动，字体渲染正常，无控制台网络错误。

## 明确不做

- 不引入 vite/webpack/TypeScript 构建链（当前规模收益为负）。
- 不重写为纯 ArkUI 原生页面。
- 不拆分 `Index.ets` 原生壳层（现状职责已清晰）。

## 风险与回退

- 每步独立提交，任一步回归可单独回退。
- 第 3 步涉及原生桥签名变更，需同步检查网页侧所有 `HanziNative` 调用点；TTS 的 `speak/stop` 接口保持不变。

## 实施记录（2026-11-01）

| 步骤 | 状态 | 说明 |
|---|---|---|
| 第 1 步 字库数据外置 | ✅ 完成 | 实现为 `rawfile/data.js`（`window.HANZI_DATA`），未用 `data.json + fetch`：ArkWeb `resource://rawfile` 协议下 fetch 兼容性无把握，`<script>` 加载最稳妥，且浏览器直接打开 file:// 也能用，数据内容不变 |
| 第 2 步 拆分 CSS / JS | ✅ 完成 | `rawfile/style.css` + `rawfile/game.js`，`index.html` 只剩骨架（约 130 行），Web 组件 `fileAccess` 下相对路径直接加载，原生侧无需改动 |
| 第 3 步 进度存储迁原生 | ✅ 完成 | 新增 `ets/common/NativeStore.ets`（Preferences 封装，getSync/putSync 同步读写内存缓存）；`EntryAbility.onCreate` 提前 init；桥扩展 `getProgress/setProgress/getSettings/setSettings` 四方法；网页侧 `store` 按键路由（`hzk_stats`/`hzk_settings` 走原生，`hzk_last` 留 localStorage），首次启动自动把 localStorage 旧数据迁移到原生侧；`Index.ets` 增加 `webReady` 门控，存储就绪后才加载网页 |
| 第 4 步 字体本地化 | ⏸️ 延后 | 用户决定不急：保留 Google Fonts 引用与 `ohos.permission.INTERNET`，后续单独处理（届时可一并评估移除 INTERNET 权限） |
