# 逆向 Bun 编译二进制：deveco.exe 记忆插件分析实录

> 目标读者：想掌握"对 JS 打包类二进制做静态逆向"方法的开发者。
> 案例：DevEco Code 0.3.0 的 Auto-Memory 插件归属与实现分析（2026-11-01/02 完成）。

## 0. 结论先行

| 问题 | 答案 |
| --- | --- |
| deveco.exe 是什么 | Bun `--compile` 产物：把整个 TS/JS 代码库内嵌进一个 ~181MB 原生 exe |
| 记忆功能归属 | DevEco Code 自研（上游 sst/opencode 无、公开 develop 分支无、仅 0.3.0 二进制有） |
| 逆向用了什么工具 | PowerShell + Node + js-beautify + git。**全程没用反汇编器** |
| 最大障碍 | Bun 对部分内嵌模块做了 zstd 字典压缩（3861 帧，仅 60 帧可无字典解压） |

---

## 1. 原理：先搞懂目标是什么，再选武器

逆向的第一步不是打开工具，而是**分类目标**。二进制大致分三类：

1. **真原生编译**（C/C++/Rust/Zig → 机器码）：需要 Ghidra/IDA 反汇编 + 反编译。
2. **解释器 + 字节码/源码打包**（Electron、pkg、Nexe、Bun `--compile`）：exe 里塞的是 JS 源码或字节码，**明文可搜**。
3. **加壳/混淆**：先脱壳再回到 1 或 2。

Bun `--compile` 属于第 2 类，其结构特征：

```
┌─────────────────────────────────────┐
│ Bun 运行时（真机器码）                │  ← 只有这部分才需要反汇编
├─────────────────────────────────────┤
│ 入口 chunk（明文 JS）                 │  ← .exe 里可直接搜到 "// @bun"
├─────────────────────────────────────┤
│ 内嵌模块 chunk-*.js（多数明文，        │  ← 模块路径形如
│ 部分 zstd 压缩）                      │     "B:/~BUN/root/chunk-xxxx.js"
├─────────────────────────────────────┤
│ 资源（wasm、ripgrep 等附带二进制）     │
└─────────────────────────────────────┘
```

**关键推论**：既然 99% 的业务逻辑是明文 JS，正确打法是"字符串挖掘 + 定点提取"，反汇编器反而是负资产（181MB 的机器码分析会把人淹死）。

---

## 2. 流程总览（可复用 SOP）

```
定位真身 → 锚点字符串扫描(拿偏移) → 偏移切块提取 → 美化后阅读
    ↓ 撞墙（字符串找不到）
压缩格式探测(zstd魔数) → 逐帧解压扫描
    ↓ 再撞墙（字典压缩）
运行时旁证（磁盘产物/日志） + 上游对照（克隆源仓库 diff 归属）
```

每一步撞墙都有出口，这是整个方法论的精髓：**不要死磕一条路**。

---

## 3. 分步详解

### Step 0：定位真身

npm 安装的 CLI 经常只是个"壳"，先找到真正干活的文件：

```powershell
where.exe deveco                     # → C:\nvm4w\nodejs\deveco（cmd 启动器）
Get-Content "C:\nvm4w\nodejs\node_modules\@deveco\deveco-code\bin\deveco"
# 读启动器源码：发现它 spawn 的是
# node_modules\@deveco\deveco-code-windows-x64\bin\deveco.exe（181MB）
```

判定特征：
- 存在 `*-windows-x64` / `*-darwin-arm64` 等平台子包 → 二进制发行；
- exe 体积上百 MB → 大概率是打包型（Electron/Bun/Nexe），不是纯原生。

### Step 1：锚点字符串扫描

**思路**：不用理解整个文件，先想你已知的目标特征词，直接全文搜字节。

```powershell
$exe = "...\deveco.exe"
# ISO-8859-1 单字节编码读入，保证字节↔字符一一对应（不被 UTF-8 合字干扰）
$bytes = [System.IO.File]::ReadAllText($exe,
    [System.Text.Encoding]::GetEncoding("ISO-8859-1"))

# 单串定位
$bytes.IndexOf('MEMORY.md')          # → 89626728（字节偏移）

# 多串批量 + 正则
foreach ($p in @('MEMORY\.md','pending-expiry','dream')) {
  [regex]::Matches($bytes, $p) | Select-Object -First 12 | ForEach-Object { $_.Index }
}
```

锚点怎么选？从**你已经能观察到的东西**反推：
- 想找记忆插件 → 搜磁盘上见过的文件名：`MEMORY.md`、`.pending-expiry`、`.auto-dream-state`；
- 想找工具注册 → 搜工具名：`memory-write`（本案例这里是空，见 Step 4）；
- 通用骨架词：`"B:/~BUN/root/`（模块边界）、`// @bun`（chunk 起点）。

> 技巧：PowerShell 里 `ReadAllText` 比 `Get-Content -Raw` 快且稳；181MB 文件读取约需 10-30 秒，可接受。

### Step 2：偏移切块提取

拿到偏移后，Seek 到附近读一段，清洗成可读文本：

```powershell
$sr = New-Object System.IO.StreamReader($exe,
    [System.Text.Encoding]::GetEncoding("ISO-8859-1"))
$sr.BaseStream.Seek(89605000, 'Begin') | Out-Null
$chunk = $sr.ReadToEnd().Substring(0, 260000)
$clean = ($chunk -replace '[^\x20-\x7E\r\n]', '.')   # 非可打印字符 → '.'
[System.IO.File]::WriteAllText("$env:TEMP\extract.js", $clean,
    [System.Text.Encoding]::ASCII)
```

提取量给足：一次 200-400KB。压缩代码一个模块可能几十 KB，宁可多提。

### Step 3：美化 + 阅读

```powershell
npx --yes js-beautify -f extract.js -o pretty.js
```

然后正常读代码。Bun 内嵌代码是 esbuild 风格压缩（单字母变量），配合 `rg` 定位关键函数再精读。本案例此步还原出：

- 记忆文件格式：Markdown + 伪 YAML frontmatter（`name/description/type/created/updated/pin/ttl`），解析器只读前 30 行（常量 `NL=30`）；
- 存储目录决策 `Jo()`：`customMemoryDir` → `storageMode==="project"`（`.deveco/memory`）→ 默认 `数据目录/memory/<路径转义+sha256前12位>`；
- 配置文件 `memory-config.json` 的全部键：`autoMemory.enabled`、`autoDream.enabled`、`extraction.enabled`、`memoryRecall.*`、`skills.enabled`；
- TUI `/memory` 管理对话框、隐藏命令集 `["dream","dream-force","dream-approve",...]`。

### Step 4：撞墙——压缩格式探测

`memory-write` 等工具名全文搜不到，但运行时日志明明有 `permission=memory-write`。推断：**部分模块被压缩**。探测：

```powershell
# zstd 魔数 28 B5 2F FD
[regex]::Matches($bytes, "\x28\xB5\x2F\xFD").Count   # → 3861 帧！
```

写 Node 脚本逐帧解压扫描（Node ≥23 自带 `zlib.createZstdDecompress`）：

```js
const zlib = require("zlib");
process.on("uncaughtException", () => {});   // 字典帧会抛错，必须吞掉
for (const pos of frameOffsets) {
  try {
    const out = await decompress(buf.subarray(pos));
    if (out.includes("memory-write")) saveHit(out, pos);
  } catch { /* 字典不匹配，跳过 */ }
}
```

结果：3861 帧只解开 60 帧（无字典帧），**零命中**——目标模块用了 zstd 字典压缩，字典本身也在 exe 某处。到此为止止损，转旁证路线。

> 止损原则：字典提取是独立的大工程（需先逆向 Bun 的打包格式拿到 dict 内容），预期收益 < 成本时立即换路。

### Step 5：运行时旁证

不碰二进制，看程序在磁盘上留下的痕迹：

| 产物 | 位置 | 证明了什么 |
| --- | --- | --- |
| `MEMORY.md` + 记忆 md 文件 | `~\.local\share\deveco\memory\<项目指纹>\` | 存储格式、目录规则（与 Step 3 代码互证） |
| `.auto-dream-state.json` | 同上 | 整理触发状态机（sessionCount/lastPid...） |
| `.pending-expiry.json` | 同上 | 过期审批机制（pendingDeletions 列表） |
| `deveco.log` | `~\.local\share\deveco\log\` | `permission=memory-write` → 工具确实存在且在运行 |

### Step 6：上游对照（归属判定）

fork 类软件要回答"功能是谁的"，克隆对照是最硬的证据：

```powershell
git clone --depth 1 https://github.com/sst/opencode.git   # 上游：无任何 memory 代码
git clone --depth 1 https://gitcode.com/openharmony-sig/deveco-code.git  # 公开 fork：也无
```

- 上游 opencode（HEAD 2026-11-02）：`memory-write`/`auto-dream`/`MEMORY.md` 零命中；
- deveco-code 公开 develop（HEAD 2026-10-30，v0.2.5 时代）：同样零命中；
- 已安装 0.3.0 二进制：有完整实现 + DevEco 品牌字符串（`DEVECO_DISABLE_MEMORY`、`share/deveco/memory`）。

三角互证 → 功能属于 DevEco 0.2.5→0.3.0 期间自研，尚未开源。

---

## 4. 工具箱速查

| 环节 | 工具 | 备注 |
| --- | --- | --- |
| 定位 | `where`、`npm ls`、读启动器脚本 | 平台子包名是最强信号 |
| 字符串扫描 | PowerShell `ReadAllText` + `IndexOf`/`[regex]::Matches` | ISO-8859-1 读入 |
| 切块 | `StreamReader.Seek` | 一次 200-400KB |
| 美化 | `npx js-beautify` | 配合 `rg` 精读 |
| 解压 | Node `zlib.createZstdDecompress` | 注意吞字典异常 |
| 对照 | `git clone --depth 1` + `rg` | fork 归属判定 |
| 反汇编 | （本案例不需要） | 只有分析 Bun 运行时本身才用 |

---

## 5. 关于 AI 辅助逆向工具（REA 类）

调研说明：没有找到星数很高、名字就叫 "REA" 的项目；GitHub 上同名多为小型项目（如 bryankwandou/rea、Ghidra 辅助类 MCP 工具）。如果你指的是 **LLM + Ghidra 的"逆向助手"**（REA/Reverse Engineering Assistant、GhidraMCP 这一族），结论分两面：

**对本案例帮助有限，甚至多余：**
- 这类工具的核心能力是"反汇编/反编译结果 → LLM 语义理解"，喂的是机器码；
- 而本案例 99% 的目标是明文 JS，瓶颈在**提取**而不是**理解**——真正干"理解"活的 LLM 就是我自己（本分析全程即 AI 执行）；
- 让 Ghidra 去分析 181MB 含海量字符串的 exe，反而慢且贵。

**什么时候它真有用：**
- 要啃真机器码时：比如本案例的遗留问题——从 Bun 运行时里定位 zstd 字典的打包格式、提取字典解开剩余 3801 帧，这需要读汇编，LLM+Ghidra 助手价值很大；
- 目标是传统原生程序（C++ 框架、闭源 SDK）时，整条流水线都适用。

**方法论层面真正的"AI 加持"**是：把锚点选择、撞墙止损、多路互证这些决策交给具备代码理解力的 agent 执行——本次分析就是这个模式的实例。

---

## 6. 遗留问题（未解）

1. zstd 字典压缩区（含 7 个记忆工具的注册代码、Auto Dream 触发阈值）未解开——需先逆向 Bun standalone 打包格式提取字典；
2. `extraction`（自动沉淀）的提示词模板在压缩区内，当前只有运行时行为观察；
3. 0.3.0 源码尚未进入公开仓库，等开源后可直接对照补全。

## 7. 一页备忘（贴墙版）

```
1. 先分类：打包型(JS明文) or 原生(机器码)？
2. 打包型 → 全文字符串扫描拿偏移，反汇编器收起来
3. 偏移切块 → 清洗 → beautify → 读
4. 搜不到 → 找压缩魔数(zstd/gzip/lz4) → 逐帧解压
5. 解压失败(字典) → 止损，转运行时产物 + 日志
6. fork 软件 → 克隆上游做归属三角互证
7. 每步都留中间文件，撞墙换路不死磕
```
