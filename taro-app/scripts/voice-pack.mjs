#!/usr/bin/env node
/* =====================================================================
 * 语音音色包生成器（讯飞在线语音合成 WebSocket v2）
 *
 * 用法：
 *   node scripts/voice-pack.mjs list
 *   node scripts/voice-pack.mjs sample [--voice xiaoyan]
 *   node scripts/voice-pack.mjs build  [--voice xiaoyan] [--speed 45] [--force] [--limit N]
 *
 * 密钥从仓库外读取（默认 ~/.hanzikid-tts.env）：
 *   XFYUN_APPID=...  XFYUN_APIKEY=...  XFYUN_APISECRET=...
 *
 * 产物：
 *   public/audio/vp/<hash>.mp3             音频（随 dist 分发到三壳）
 *   src/services/voiceManifest.generated.ts 文本 key → 音频路径
 *
 * 说明见 docs/voice-pack.md。
 * ===================================================================== */
import { createHash, createHmac } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SRC = path.join(appRoot, 'src')
const CACHE = path.join(appRoot, '.cache', 'voice-pack')
const AUDIO_DIR = path.join(appRoot, 'public', 'audio', 'vp')
const MANIFEST_TS = path.join(SRC, 'services', 'voiceManifest.generated.ts')
const SAMPLE_DIR = path.join(os.homedir(), 'Desktop', 'hanzikid-tts-samples')

const DEFAULT_VOICE = 'xiaoyan'
const DEFAULT_SPEED = 45
/** 温柔女声候选（账号未授权某个 vcn 时该候选会报错跳过） */
const SAMPLE_VOICES = ['xiaoyan', 'aisxping', 'aisjinger']
const SAMPLE_TEXTS = ['小朋友，我们一起来认字吧！', '这是猫，小猫的猫。', '答对啦！你真棒！']

/* ===== 密钥 ===== */

function loadEnv() {
  const envPath = process.env.HANZIKID_TTS_ENV || path.join(os.homedir(), '.hanzikid-tts.env')
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*(?:export\s+)?([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/)
      if (!m) continue
      let v = m[2]
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
      if (!process.env[m[1]]) process.env[m[1]] = v
    }
  }
  return {
    appId: process.env.XFYUN_APPID || '',
    apiKey: process.env.XFYUN_APIKEY || '',
    apiSecret: process.env.XFYUN_APISECRET || '',
    envPath,
  }
}

function requireCreds() {
  const creds = loadEnv()
  if (!creds.appId || !creds.apiKey || !creds.apiSecret) {
    console.error(`缺少讯飞密钥：请在 ${creds.envPath} 写入

  XFYUN_APPID=你的APPID
  XFYUN_APIKEY=你的APIKey
  XFYUN_APISECRET=你的APISecret

（密钥只在本机读取，不会进仓库。也可用 HANZIKID_TTS_ENV 指定其他文件。）`)
    process.exit(2)
  }
  return creds
}

/* ===== 文本归一化 =====
 * key：去掉标点/emoji/空格，只保留汉字、字母、数字——Web 与脚本必须完全一致
 * tts：保留中文标点（给合成引擎做停顿），去掉 emoji 与引号
 */
const EMOJI_RE = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu
const keyOf = (s) => s.replace(/[^\u4e00-\u9fffa-zA-Z0-9]/g, '')
const ttsOf = (s) => s.replace(EMOJI_RE, '').replace(/[「」『』“”"]/g, '').replace(/\s+/g, ' ').trim()

/* ===== 语料抽取 ===== */

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(name)) out.push(p)
  }
  return out
}

/** 去掉注释，避免把中文注释当台词 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:\\])\/\/[^\n]*/g, '$1')
}

function unescape(s) {
  return s.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, ' ')
}

/** 抽取源码里所有含汉字/中文标点的字符串字面量 */
function extractStrings(src) {
  const out = []
  const re = /'([^'\\\n]*(?:\\.[^'\\\n]*)*)'|"([^"\\\n]*(?:\\.[^"\\\n]*)*)"/g
  let m
  while ((m = re.exec(stripComments(src)))) {
    const s = unescape(m[1] !== undefined ? m[1] : m[2])
    if (!/[\u4e00-\u9fff]/.test(s)) continue
    out.push(s)
  }
  return out
}

function readDataEntries() {
  const src = readFileSync(path.join(SRC, 'game', 'data.ts'), 'utf8')
  const pairs = []
  const re = /\{\s*c:\s*'([^']+)',\s*p:\s*'[^']*',\s*e:\s*'[^']*'(?:,\s*w:\s*'([^']+)')?\s*\}/g
  let m
  while ((m = re.exec(src))) pairs.push({ c: m[1], w: m[2] })
  const names = [...src.matchAll(/\bname:\s*'([^']+)'/g)].map(x => x[1])
  return { pairs, names }
}

function buildCorpus() {
  /** key -> { text, score, prio }；prio 越小越先合成（额度有限时优先核心内容） */
  const map = new Map()
  const add = (raw, prio = 4) => {
    const s = (raw || '').trim()
    if (!s || s.length > 50) return
    // 「」片段（代码里拼接用的左/右半截）跳过，完整短语由派生模板补齐
    if (/[「『」』]/.test(s)) return
    const key = keyOf(s)
    if (!key) return
    const text = ttsOf(s)
    if (!text) return
    // 同一 key 优先保留带中文标点的版本（停顿更自然）
    const score = (text.match(/[，。！？、；：,.!?;:]/g) || []).length
    const prev = map.get(key)
    const p = Math.min(prev ? prev.prio : 99, prio)
    if (!prev || score > prev.score) map.set(key, { text, score, prio: p })
    else prev.prio = p
  }

  const { pairs, names } = readDataEntries()
  for (const { c, w } of pairs) {
    add(c, 1)                                  // 单字：最高频
    add(`这是${c}`, 2)                          // 答对反馈 / 认字卡
    add(`这个字念${c}`, 3)                      // 答错解释
    add(`我们要找的是${c}哦`, 3)
    if (w) {
      add(w, 1)                                // 词语：最高频
      add(`${w}的${c}`, 2)                      // 「小马的马」
      add(`我们要找的是${w}的${c}哦`, 3)
    }
  }
  for (const n of names) add(n, 1)

  // copy.ts 是高频台词（夸奖/引导语/结算），排在 UI 文案之前
  const copyPath = path.join(SRC, 'game', 'copy.ts')
  for (const s of extractStrings(readFileSync(copyPath, 'utf8'))) add(s, 2)

  for (const file of walk(SRC)) {
    if (file === copyPath) continue
    for (const s of extractStrings(readFileSync(file, 'utf8'))) add(s, 4)
  }

  // 固定短句（拼接用的部分不在完整字符串里）
  for (const s of ['这是', '跟我读：', '别急，它在这里', '这个字念', '我们要找的是']) add(s, 2)

  // 学一学的过场提示是模板字符串（有 N 个字，我们再学一遍），按题量上限补齐
  for (let n = 1; n <= 20; n++) add(`有${n}个字，我们再学一遍`, 2)

  return map
}

/* ===== 讯飞合成 ===== */

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function synthOnce(text, { appId, apiKey, apiSecret }, { voice, speed, pitch = 50, volume = 60 }) {
  if (typeof WebSocket === 'undefined') {
    throw new Error('当前 Node 没有全局 WebSocket，请使用 Node 22+')
  }
  const host = 'tts-api.xfyun.cn'
  const date = new Date().toUTCString()
  const signOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
  const signature = createHmac('sha256', apiSecret).update(signOrigin).digest('base64')
  const authOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  const authorization = Buffer.from(authOrigin).toString('base64')
  const url = `wss://${host}/v2/tts?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${host}`

  const payload = {
    common: { app_id: appId },
    business: {
      aue: 'lame',      // mp3
      sfl: 1,
      vcn: voice,
      speed,            // 0-100，默认 50；儿童略慢
      volume,
      pitch,            // 0-100，默认 50；调高更年轻/可爱
      tte: 'UTF8',
    },
    data: {
      status: 2,
      text: Buffer.from(text, 'utf8').toString('base64'),
    },
  }

  return new Promise((resolve, reject) => {
    const chunks = []
    let settled = false
    const finish = (err, buf) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      try { ws.close() } catch (e) { /* 忽略 */ }
      err ? reject(err) : resolve(buf)
    }
    const ws = new WebSocket(url)
    const timer = setTimeout(() => finish(new Error('合成超时（30s）')), 30000)

    ws.addEventListener('open', () => ws.send(JSON.stringify(payload)))
    ws.addEventListener('message', (ev) => {
      let msg
      try { msg = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString('utf8')) } catch (e) { return }
      if (msg.code !== 0) {
        finish(new Error(`讯飞错误 code=${msg.code} ${msg.message || ''}`))
        return
      }
      if (msg.data && msg.data.audio) chunks.push(Buffer.from(msg.data.audio, 'base64'))
      if (msg.data && msg.data.status === 2) finish(null, Buffer.concat(chunks))
    })
    ws.addEventListener('error', () => finish(new Error('WebSocket 连接失败')))
    ws.addEventListener('close', () => {
      if (!settled) finish(new Error('连接提前关闭（未收到完整音频）'))
    })
  })
}

async function synthWithRetry(text, creds, opts, tries = 3) {
  let last
  for (let i = 0; i < tries; i++) {
    try {
      const buf = await synthOnce(text, creds, opts)
      if (!buf || !buf.length) throw new Error('返回音频为空')
      return buf
    } catch (e) {
      last = e
      const msg = String(e.message || e)
      // 鉴权/授权类错误重试无意义
      if (/401|403|10043|10105|11200|11201/.test(msg)) break
      if (i < tries - 1) await sleep(600 * (i + 1))
    }
  }
  throw last
}

async function runPool(items, limit, worker) {
  let next = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = next++
      if (i >= items.length) return
      await worker(items[i], i)
    }
  })
  await Promise.all(runners)
}

/* ===== 命令 ===== */

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) { args._.push(a); continue }
    const name = a.slice(2)
    if (name === 'force') { args.force = true; continue }
    const val = argv[++i]
    args[name] = val
  }
  return args
}

function cmdList() {
  const corpus = buildCorpus()
  mkdirSync(CACHE, { recursive: true })
  const list = [...corpus.entries()]
    .map(([k, v]) => ({ key: k, text: v.text, prio: v.prio }))
    .sort((a, b) => (a.prio - b.prio) || a.key.localeCompare(b.key, 'zh'))
  writeFileSync(path.join(CACHE, 'corpus.json'), JSON.stringify(list, null, 2))
  const byPrio = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const v of corpus.values()) byPrio[v.prio]++
  console.log(`语料 ${list.length} 条（优先级：单字/词 ${byPrio[1]}，核心短语 ${byPrio[2]}，解释句 ${byPrio[3]}，其他 ${byPrio[4]}）`)
  console.log('示例：')
  for (const x of list.slice(0, 15)) console.log(`  [${x.prio}] ${x.text}`)
}

async function cmdSample(args) {
  const creds = requireCreds()
  const speed = Number(args.speed || DEFAULT_SPEED)
  const pitch = Number(args.pitch || 50)
  const volume = Number(args.volume || 60)
  mkdirSync(SAMPLE_DIR, { recursive: true })
  const voices = args.voice ? [args.voice] : SAMPLE_VOICES
  let ok = 0
  for (const voice of voices) {
    for (let i = 0; i < SAMPLE_TEXTS.length; i++) {
      const text = SAMPLE_TEXTS[i]
      const out = path.join(SAMPLE_DIR, `${voice}-s${speed}-p${pitch}-${i + 1}.mp3`)
      try {
        const buf = await synthWithRetry(text, creds, { voice, speed, pitch, volume })
        writeFileSync(out, buf)
        ok++
        console.log(`✓ ${voice} s=${speed} p=${pitch} ${i + 1}: ${text} → ${out}`)
      } catch (e) {
        console.warn(`✗ ${voice} ${i + 1} 失败：${e.message}`)
        break
      }
    }
  }
  if (!ok) {
    console.error('没有生成任何样音，请检查 APPID/APIKey/APISecret 与发音人（vcn）授权。')
    process.exit(1)
  }
  console.log(`\n样音目录：${SAMPLE_DIR}`)
}

async function cmdBuild(args) {
  const creds = requireCreds()
  const voice = args.voice || DEFAULT_VOICE
  const speed = Number(args.speed || DEFAULT_SPEED)
  const pitch = Number(args.pitch || 50)
  const volume = Number(args.volume || 60)
  const limit = args.limit ? Number(args.limit) : 0
  const max = args.max ? Number(args.max) : 0
  const force = !!args.force

  let corpus = buildCorpus()
  // 额度有限时优先合成核心内容：单字/词语 → 高频短语 → 解释句 → UI 文案
  let entries = [...corpus.entries()].sort((a, b) => (a[1].prio - b[1].prio) || a[0].localeCompare(b[0], 'zh'))
  if (limit > 0) entries = entries.slice(0, limit)

  mkdirSync(AUDIO_DIR, { recursive: true })
  // 音色/语速/音高都参与 hash：调参后不会误用旧音频
  const fileOf = (key) => createHash('sha1').update(`${voice}|${speed}|${pitch}|${volume}\n${key}`).digest('hex').slice(0, 20) + '.mp3'

  let todo = entries.filter(([key]) => force || !existsSync(path.join(AUDIO_DIR, fileOf(key))))
  // 每日额度有限时只跑前 N 条（按优先级排序），避免把剩余请求全部撞到 11201
  if (max > 0) todo = todo.slice(0, max)
  console.log(`音色包：${voice}，语速 ${speed}，音高 ${pitch}；语料 ${entries.length} 条，本次待生成 ${todo.length} 条`)

  let done = 0
  const failures = []
  await runPool(todo, 4, async ([key, { text }]) => {
    const file = fileOf(key)
    try {
      const buf = await synthWithRetry(text, creds, { voice, speed, pitch, volume })
      writeFileSync(path.join(AUDIO_DIR, file), buf)
    } catch (e) {
      failures.push({ text, error: e.message })
    }
    done++
    if (done % 25 === 0 || done === todo.length) {
      console.log(`  进度 ${done}/${todo.length}${failures.length ? `，失败 ${failures.length}` : ''}`)
    }
  })

  // manifest 只收录实际存在的文件；核心内容（prio<=3）全部就绪才算可用，
  // 避免半套音包导致同一局里音色忽真忽机械
  const manifest = entries
    .map(([key]) => [key, fileOf(key)])
    .filter(([, file]) => existsSync(path.join(AUDIO_DIR, file)))
    .sort((a, b) => a[0].localeCompare(b[0], 'zh'))
  const core = entries.filter(([, v]) => v.prio <= 3)
  const missingCore = core.filter(([key]) => !existsSync(path.join(AUDIO_DIR, fileOf(key))))
  const ready = missingCore.length === 0

  const lines = manifest.map(([key, file]) => `  ${JSON.stringify(key)}: ${JSON.stringify(`audio/vp/${file}`)},`)
  const ts = `// AUTO-GENERATED by scripts/voice-pack.mjs — 请勿手改
// 生成命令：npm run voice:build -- --voice ${voice} --speed ${speed} --pitch ${pitch}
export const VOICE_PACK_VOICE = ${JSON.stringify(voice)}
export const VOICE_PACK_READY = ${ready}
export const VOICE_PACK_GENERATED_AT = ${JSON.stringify(new Date().toISOString())}
export const VOICE_PACK: Record<string, string> = {
${lines.join('\n')}
}
`
  writeFileSync(MANIFEST_TS, ts)
  const totalBytes = manifest.reduce((n, [, file]) => n + statSync(path.join(AUDIO_DIR, file)).size, 0)
  console.log(`\nmanifest: ${manifest.length} 条 → ${path.relative(appRoot, MANIFEST_TS)}`)
  console.log(`音频: ${(totalBytes / 1024 / 1024).toFixed(2)} MB → ${path.relative(appRoot, AUDIO_DIR)}`)
  if (!ready) {
    console.warn(`\n核心语料还缺 ${missingCore.length} 条，VOICE_PACK_READY=false（App 暂继续用系统 TTS）。重跑可续传。`)
  } else {
    console.log('核心语料已齐，VOICE_PACK_READY=true。')
  }
  if (failures.length) {
    console.warn(`\n失败 ${failures.length} 条（可重跑续传）：`)
    for (const f of failures.slice(0, 10)) console.warn(`  ${f.text}: ${f.error}`)
    process.exit(1)
  }
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)
  switch (cmd) {
    case 'list': cmdList(); break
    case 'sample': await cmdSample(args); break
    case 'build': await cmdBuild(args); break
    default:
      console.log('用法: node scripts/voice-pack.mjs <list|sample|build> [--voice xiaoyan] [--speed 45] [--force] [--limit N]')
      process.exit(cmd ? 1 : 0)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
