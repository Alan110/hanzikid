# taro-app — Web 内核（唯一业务逻辑所在地）

纯 Vite + React + TS，无 Taro 运行时依赖。三端壳内嵌的本目录构建产物运行游戏全部逻辑。

## 结构

```
src/services/native/types.ts  ★ 跨端桥协议唯一契约（三壳对齐它实现）
src/services/native/index.ts  桥探测（window.HanziNative 存在性）
src/services/speech.ts        TTS 封装：原生优先→浏览器 speechSynthesis，播报 id 匹配+兜底超时
src/services/store.ts         持久化路由链：kvGet→legacy→localStorage（按能力探测）
src/game/                     游戏规则：data.ts 字库 / awards.ts 发星奖牌 / ctx.ts 全局上下文 / copy.ts 文案
src/components/screens/       各游戏屏（Learn/Quiz/Read/Flow/Awards/End…）
src/pages/index/              入口页 + 路由编排
```

## 规则

- **改桥协议**：先改 `types.ts`，再同步三壳（见 `docs/bridge-protocol.md` 4 步清单），Web 侧必须能力探测 + 降级（H5 无桥可玩）
- **新持久化数据**：key 用 `hzk_*`，走 store.ts 路由链，零原生改动
- vite build 不做类型检查，验证链：`npx tsc --noEmit` → `npm run build:h5` → `npm run sync:all`
- 产物 `dist/` 不入库；三壳内嵌产物由 sync 脚本生成，必须三端一起同步提交
- 样式：`.bump` 全局动画定义在 app.scss，组件内勿覆盖
