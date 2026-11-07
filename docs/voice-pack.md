# 语音音色包（Voice Pack）方案

目标：让孩子听到接近真人的中文朗读，**三端声音一致、离线可用、零运行时网络依赖**；
未覆盖的文本自动回退系统 TTS，旧壳/纯浏览器仍可玩。

## 1. 为什么不用系统 TTS

- iOS 默认 `AVSpeechSynthesisVoice(language: "zh-CN")` 返回紧凑音（Tingting，`quality=1`），最机械；
- Android / 鸿蒙 系统 TTS 音色因设备而异，无法保证一致；
- 家长中心无法要求每个家庭去系统设置下载「增强音色」。

## 2. 架构

```
taro-app/src/services/voiceManifest.generated.ts   ← 生成：文本 key → 音频相对路径
taro-app/public/audio/vp/<hash>.mp3               ← 生成：固定语料音频
taro-app/src/services/voicePack.ts                ← 播放器（Web Audio/HTMLAudio）
taro-app/src/services/speech.ts                   ← 音色包优先，未命中回退 TTS
```

- 音频随 `dist` 经 `npm run sync:all` 分发到三壳，Web 侧统一切换，**不改桥协议**。
- 只有 `taro-app/public/audio` 入库（无密钥环境也能构建）；三壳内嵌的 `www` / `rawfile/web` 是生成物，不入库。
- 文本 key 归一化：去掉标点、emoji、空格，只保留汉字/字母/数字（`packKey()`）。
- 语速：音包按「略慢」生成，家长速度档位用 `playbackRate` 微调（0.9 / 1.0 / 1.08），不做变调重合成。

## 3. 语料范围

自动从源码抽取 + 派生模板：

| 来源 | 内容 |
| --- | --- |
| `src/game/data.ts` | 201 个汉字、190 个词语、组名 |
| `src/game/copy.ts` | 引导语、夸奖、鼓励、结算等全部文案 |
| `src/**/*.ts(x)` | 其余中文字符串（UI 提示、家长中心试听句等，多生成无害） |
| 派生模板 | `词语的汉字`、`这是X`、`这个字念X`、`我们要找的是X哦`、`我们要找的是词语的汉字哦` |

约 1,000–1,500 条短音频，32–64kbps MP3，合计约 5–10MB。

## 4. 播放与回退

`say(parts, settings, onDone)`：

1. 所有分段都能在 manifest 命中 → 顺序播放音频（段间默认 220ms，接近原 TTS 逗号停顿；
   「小猫 → 猫」这类刻意重复的单字自动拉长到 450ms，避免听成回声），最后一段结束触发 `onDone`；
2. 任一 miss / 播放失败（自动播放策略、文件缺失） → 整句回退原生 TTS（原有逻辑，含兜底超时）；
3. `stopSpeak()` 同时停止音包播放；
4. 浏览器 H5 同样优先音包，没有音包时回退 `speechSynthesis`。

iOS 壳额外放开自动播放限制：`WKWebViewConfiguration.mediaTypesRequiringUserActionForPlayback = []`。
Android / 鸿蒙若遇到自动播放拦截，在各自 WebView 设置里放开 `mediaPlaybackRequiresUserGesture` 即可（壳能力，不改协议）。

## 5. 生成（讯飞在线合成）

密钥放在仓库外，**不要写进代码/提交**：

```bash
cat > ~/.hanzikid-tts.env <<'EOF'
XFYUN_APPID=你的APPID
XFYUN_APIKEY=你的APIKey
XFYUN_APISECRET=你的APISecret
EOF
chmod 600 ~/.hanzikid-tts.env
```

脚本会读取 `~/.hanzikid-tts.env`（可用 `HANZIKID_TTS_ENV` 指定其他路径）。

```bash
cd taro-app
npm run voice:list                 # 抽语料，打印数量与优先级分布
npm run voice:sample               # 生成候选音色样音到 ~/Desktop/hanzikid-tts-samples/
npm run voice:build -- --voice xiaoyan --speed 50 --pitch 58 --max 500
npm run build:h5 && npm run sync:all
```

- 默认音色 `xiaoyan`（小燕，温柔女声）；可用 `--speed` / `--pitch`（0–100）微调可爱度与活力。
- 候选：`aisxping`（小萍）、`aisjinger`（小婧）、`aisbabyxu`（童声许小宝）。
- `voice:build` 可断点续跑：已存在的音频跳过，`--force` 全量重生成。
- 生成后 `voiceManifest.generated.ts` 与 `public/audio/vp/*` 一并提交（保证无密钥环境也能构建）。

### 额度与续跑

- 讯飞在线 TTS 免费额度约 **500 次/天**，超限返回 `11201 licc failed`（license 校验失败，不是配置错误）。
- `--max 500` 只跑当日额度，次日重跑自动续传；也可在讯飞控制台领取免费次数包或购买量包后一次跑完。
- 生成按优先级排序：单字/词语 → 高频短语 → 答错解释句 → UI 文案，额度紧张时先保证最常听的内容。
- 核心语料（优先级 ≤3）未齐时 manifest 写 `VOICE_PACK_READY = false`，App 继续用系统 TTS，
  避免半套音包导致同一局里音色忽真忽机械；齐全后自动启用。

## 6. 验收

1. `npx tsc --noEmit` → `npm run build:h5` → `npm run sync:all` → `npm run check:sync`
2. iOS 模拟器/真机跑游戏，认字卡、找一找、读一读的播报均为音包音色；
3. 断网复测：音包仍可播（证明离线）；
4. 临时删除某条 manifest 记录，确认该句回退系统 TTS 且流程不卡。

## 7. 版权与合规

讯飞合成的音频用于 App 内分发，需遵守讯飞账号的商用授权条款；若后续换真人配音，需保留配音授权凭证。
