# 🐼 识字小乐园

给 3～5 岁小朋友的汉字启蒙游戏。**一份游戏代码（Taro + React），
三个原生端（鸿蒙 / iOS / Android）+ 浏览器 H5**，全部离线可玩，不需要账号和网络接口。

```
taro-app/        游戏本体（Taro 4 + React，构建出 H5 产物 dist/）
harmony-app/     鸿蒙壳：ArkWeb + CoreSpeechKit + 端侧识别（HarmonyOS NEXT）
android-shell/   Android 壳：WebView + TextToSpeech + SpeechRecognizer
ios-shell/       iOS 壳：WKWebView + AVSpeechSynthesizer + SFSpeechRecognizer（源码+组装步骤）
docs/develop/    构建部署实战经验
```

## 怎么运行

**改游戏 / H5 调试**（浏览器直接玩，无原生桥时自动降级）：

```bash
cd taro-app
npm install
npm run dev:h5      # 或 build:h5 后用任意静态服务器打开 dist/
```

**发到三端**：

```bash
cd taro-app
npm run build:h5 && npm run sync:all    # 产物同步进三个壳工程
```

- **鸿蒙**：DevEco Studio 打开 `harmony-app/` 直接 Run（或命令行 hvigor 构建，见其 README）
- **Android**：Android Studio 打开 `android-shell/` Run（见其 README）
- **iOS**：Mac 上按 `ios-shell/README.md` 约 5 分钟组装后 Run

平板/手机不想装 App 时，也可以静态服务器伺服 `taro-app/dist/`，
浏览器「添加到主屏幕」全屏玩。

## 三种玩法

| 玩法 | 怎么玩 |
|------|--------|
| 📖 认一认 | 大字卡 + 图片 + 拼音，点一下就朗读（字音×2 + 词语），左右箭头翻卡 |
| 🎯 找一找 | 语音说"找出 大"，孩子从 2～4 张字卡里点出正确的 |
| 🎤 读一读 | 大字 + 拼音，孩子跟读，原生端侧录音识别打星（⭐⭐⭐）；系统不支持时自动降级纯跟读 |

内置 11 组共 103 个字：我的家人、可爱动物、好吃食物、彩色世界、我的身体、
动起来（走跑吃睡笑哭）、穿衣服、车车世界、大自然、大小多少、数字宝宝，
也可以"全部混玩"。

## 专为 3 岁半设计的点

- **全语音驱动**：孩子不识字也能独立玩，每题自动朗读，听不清有 🔊 重听键
- **只鼓励不惩罚**：答错没有红叉和扣分，卡片摇一摇，语音说"没关系，再试一次"
- **不会卡死**：连错 3 次自动高亮正确答案，点了就过（算"帮助后答对"🌟）
- **难度自动爬坡**：一局内 2 选 → 3 选 → 4 选，先赢后难，建立信心
- **超大按钮**：所有可点区域非常大，适配小手；禁止了双击缩放和长按菜单
- **智能复习**：连对 3 次的字标记为"已掌握"⭐，之后出题优先安排没掌握的字

## 家长中心（首页右上角 ⚙️）

- 朗读人声：列出设备上所有中文人声，逐个试听、选最清晰的一个（推荐带"Online/Natural"的微软自然音；Edge 通常人声最好）
- 朗读速度：慢 / 标准 / 快
- 图片提示：入门显示 emoji 帮助联想，熟悉后关掉就是纯认字
- 每轮题数：5 / 10 / 15（3 岁半建议 5～10 题）
- 学习进度：每个字的掌握情况（金色 = 已掌握）
- 重置进度（需点两次确认）

浏览器里进度存 localStorage（换设备不同步）；原生壳内自动迁移到
原生存储（鸿蒙 Preferences / Android SharedPreferences / iOS UserDefaults），
卸载重装不丢。

## 自定义字表

打开 `taro-app/src/game/data.ts`，找到 `GROUPS` 数组，按现有格式增删即可：

```ts
{ c: '猫', p: 'māo', e: '🐱', w: '小猫' },   // c 汉字 / p 拼音 / e 图片emoji / w 词语(可省略)
```

也可以加整组：复制一组对象，改 `id`（英文唯一）、`name`、`icon`、`color` 即可。
改完 `npm run build:h5 && npm run sync:all` 再到各端 Run。

## 常见问题

- **发音不清楚？** 原生壳内走系统 TTS（鸿蒙聆小珊 / 系统 TTS 引擎），可在系统设置里
  更换或升级语音包；浏览器内先进 ⚙️ 家长中心 →「朗读人声」逐个试听选最清晰的
  （Windows 上微软"晓晓/Online"自然音最清楚）。出题朗读已按"小猫的猫……猫"的方式慢读。
- **没有声音？** 首次打开需要点一下屏幕（浏览器要求）；如果显示"未检测到中文语音包"，
  换 Chrome/Edge 试试，或在系统设置里安装中文语音（iOS：设置→辅助功能→朗读内容→声音；
  Android：设置→Google 文字转语音）。
- **汉字字体不是楷体？** 汉字优先用系统楷体（教学标准字形），没有楷体的设备
  会回退到默认字体，不影响使用。
- **开发调试**：`taro-app` 下 `npm run dev:h5`；URL hash（`#quiz` / `#learn`）可直接进入指定玩法。
