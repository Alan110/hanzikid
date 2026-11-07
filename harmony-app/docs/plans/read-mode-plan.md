# 「读一读」玩法方案（跟读 + 录音回放 + 端侧语音评测）

> 2026-11-01 方案稿，待确认后实施。核心诉求：给出一个字 → 小朋友跟读并录音 → 回放 → 自动判定读对/读错 →
> 读错了则展示正确读音（TTS 标准音 + 图标 + 拼音）→ 下一题。目的在于"跟着读、认住这个字"。

## 一、能力调研结论（决定架构）

- 系统自带**端侧中文语音识别** `speechRecognizer`（`@kit.CoreSpeechKit`，离线、免网络、API 11+），可将
  PCM 音频转文字——这就是"判定读音对错"的评测来源。真机（平板/手机）可用，**模拟器大概率没有**。
- 录音用 `AudioCapturer`（`@kit.AudioKit`，16kHz/单声道/S16LE PCM），回放用 `AudioRenderer`（同一份 PCM）。
- ASR 关键约束：`writeAudio` 仅接受 **640/1280 字节分块、间隔 20/40ms**（640B = 20ms@16k）；支持**会话热词**
  （`sessionGeneralLexicon`，每条 2~20 字、最多 200 条）——正好把词语（如「妈妈」）设为热词，显著提升
  幼儿含糊发音的识别命中。
- 麦克风权限 `ohos.permission.MICROPHONE`（user_grant）：module.json5 声明 + 运行时弹窗申请。

## 二、玩法流程

首页新增第三张模式卡：**🎤 读一读**（跟着读 · 录音评分）。选字组后进入：

```
出题（大字卡：汉字 + 拼音，图片默认隐藏）
  → 引导语（TTS，不示范读音）："这个字怎么读？大声读出来吧"
  → 小朋友点 🎤 开始录音（再点停止；最长 6 秒自动停；录音中按钮脉冲动画）
  → 停止后自动回放小朋友的录音，同时后台把同一份 PCM 送 ASR 识别
  → 判定：
      ✅ 读对了 → 随机夸奖 + 撒花 + 音效 + TTS 表扬（复用现有 CHEERS/CHEER_SFX/confetti 体系）
                 → 约 2 秒后自动下一题
      ❌ 读错了 / 没听到 → 弹出"正确读音卡"：大图标 emoji + 拼音 + TTS 示范标准音
                 （"这是妈，mā，妈妈的妈"）→ 按钮【🔁 再试一次】【⏭️ 下一题】
  → 做满题数后进结算页（复用 screen-end）
```

**已确认决策（2026-11-01）**：出题后**先让孩子自己读**（不出示范音，更像"考认读"），
读错了才示范标准读音；同音判定算对（声调宽容）；每轮题数复用家长中心「每轮题数」设置。

- 题目来源与优先级复用找一找逻辑：优先没掌握的字，掺随机防雷同。
- 读对/读错计入现有 stats（f/w），与找一找共享"连对 3 次算掌握"。
- 遵循既有偏好：🖼️ 图标显隐开关放在读一读界面顶栏（默认隐藏，认字优先）；反馈多样化随机。

## 三、读音判定逻辑（放 game.js，原生只回传识别文本）

1. 归一化 ASR 文本（去标点/空格）。
2. 以下任一命中即判「读对了」：
   - 文本包含目标字（如「妈」）；
   - 文本包含目标词语（如「妈妈」）；
   - 文本中任一字与目标字**同音**（拼音去声调比对；用 data.js 全字库建 `拼音(无声调) → [字]` 映射）。
3. 会话热词 = 目标词语（`w`），单词组（如数字）用「数字 + X」类常见词兜底（热词要求 ≥2 字）。
4. **声调宽容（已确认）**：目标「妈」，孩子说成 mǎ 被 ASR 写成「马」→ 也算对。

## 四点五、题量（已确认）

复用家长中心「每轮题数」（`settings.len`，默认 10）；出题优先级复用找一找逻辑（优先没掌握的字）。

## 四、降级策略（任何情况下不卡流程）

| 场景 | 表现 |
|---|---|
| 设备无端侧 ASR（模拟器、老系统） | 自动降级「跟读模式」：出题→TTS 示范→录音→回放→TTS 再示范，界面提示"这台设备暂不支持自动评分"，按钮【再试一次/下一题】，不判定对错 |
| 麦克风权限被拒 | 气泡提示"需要麦克风才能录你的声音哦"，提供去系统设置引导 |
| 录音无声（ASR 判定无语音输入） | "没听到你的声音哦，大点声再试一次 💪" |
| ASR 超时/出错（>6s 无结果） | 按跟读模式兜底，不阻塞 |

## 五、原生侧改动（ArkTS）

新增 `entry/src/main/ets/common/NativeVoice.ets`（与 NativeStore 平级，静态类，风格一致）：

- `ensureMic()`：abilityAccessCtrl 检查/请求 MICROPHONE 权限。
- 录音：AudioCapturer（16k/mono/S16LE，`SourceType.SOURCE_TYPE_VOICE_RECOGNITION`），
  `on('readData')` 收集分块（回调内 `slice(0)` 拷贝），上限 6s 自动停。
- 回放：AudioRenderer（同参数，`on('writeData')` 拉模式，API 12 回调返回 VALID/INVALID）。
- 识别：`speechRecognizer.createEngine` 懒加载缓存；`startListening`（`recognitionMode: 1` 写音频流模式 +
  会话热词）；`setInterval` 20ms/640B 分块 `writeAudio`（尾块补零对齐）→ `finish` → `onResult` 取最终文本。
- 用完即 `stop/release`，避免占用音频流。

**桥协议扩展**（Index.ets `javaScriptProxy`，与现有 speak/getProgress 同风格）：

- JS→原生（methodList 新增，同步触发）：`voiceEnsureMic / voiceStartRecord / voiceStopRecord /
  voicePlayRecording / voiceRecognize(word) / voiceCancel`。
- 原生→JS（异步事件回推）：`webviewController.runJavaScript("window.__onVoiceEvent('type', {...})")`：
  `mic{granted}` / `recStarted` / `recStopped{ms}` / `playbackDone` / `asrResult{text}` / `asrError{code}`。
- 状态机与判定编排全在 JS 侧，原生只提供"录音/放音/识别"原语——与现有桥职责划分一致
  （也便于浏览器直接打开 game.js 时整体走降级路径）。

**module.json5**：新增 `ohos.permission.MICROPHONE`（user_grant：`reason` + `usedScene` + 对应 `$string`）。

## 六、Web 侧改动

- `index.html`：模式卡 ×3；新增 `screen-read`（顶栏：🏠 / 标题 / 🖼️ 图标开关 / 进度计数；
  字卡区：emoji + 大字 + 拼音 + 词语；🎤 录音大按钮；状态气泡；正确读音反馈卡）。
- `game.js`：`startRead()` 出题编排、同音映射表、`__onVoiceEvent` 处理、对/错反馈、降级逻辑、事件绑定。
- `style.css`：录音中脉冲/波纹动画、反馈卡、麦克风按钮态样式。

## 七、已知风险与对策

1. **识别耗时 ≈ 录音时长**（writeAudio 强制实时节奏）→ 与"回放自己的录音"**并行**执行，体感零等待。
2. **幼儿咬字不清导致 ASR 误判** → 热词 + 同音宽容 + 「再试一次」无惩罚；误判成本只是一次重读。
3. **模拟器无 ASR/麦克风** → 降级跟读模式保底；完整体验需真机验证。
4. **AudioCapturer 回调阻塞** → 回调内只做拷贝，拼接/识别全部异步化。
5. **Web 层 getUserMedia 不采用**：ArkWeb 内权限链路不稳，且无法拿到 PCM 给端侧 ASR；统一走原生。

## 八、已确认决策（2026-11-01）

1. **声调宽容**：同音（拼音去声调）即算读对。✅
2. **示范时机**：出题后**先让孩子自己读**（引导语只说"这个字怎么读？大声读出来吧"，不出示范音），
   读错了才在纠正卡里示范标准读音。✅
3. **每轮题数**：复用家长中心「每轮题数」设置。✅
