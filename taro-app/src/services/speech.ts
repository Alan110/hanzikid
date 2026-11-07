/* 语音合成（TTS）：音色包优先 → 原生桥 → 浏览器 speechSynthesis（原样迁移 game.js） */
import { native } from './native'
import { RATES } from '../game/copy'
import type { Settings } from './store'
import { clipFor, isVoicePackReady, packRate, playPack, stopPackAudio } from './voicePack'

export const rateOf = (settings: Settings): number => RATES[settings.rate] || 0.95

interface SayPart { t: string; r?: number }

/** 浏览器中文人声打分：神经网络音(Natural/Online)最清晰，本地微软女声次之 */
const Speech = {
  voice: null as SpeechSynthesisVoice | null,
  zhFound: false,
  score(v: SpeechSynthesisVoice): number {
    let s = 0
    const name = v.name || ''
    if (/zh[-_]CN/i.test(v.lang)) s += 4
    else if (/^zh/i.test(v.lang)) s += 2
    if (/natural|online/i.test(name)) s += 3
    if (/xiaoxiao|xiaoyi|yunxi|yunyang|tingting|ting-ting|mei-jia|yaoyao|huihui|female|女/i.test(name)) s += 2
    if (/kangkang|male|男/i.test(name)) s -= 2
    if (/google/i.test(name) && !/natural/i.test(name)) s -= 1
    return s
  },
  zhVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return []
    return speechSynthesis.getVoices()
      .filter(v => /^zh/i.test(v.lang))
      .sort((a, b) => this.score(b) - this.score(a))
  },
  pick(settings: Settings): void {
    const zh = this.zhVoices()
    if (zh.length) this.zhFound = true
    this.voice = (settings.voiceURI && zh.find(v => v.voiceURI === settings.voiceURI)) || zh[0] || null
  },
  init(settings: Settings, onVoicesChanged: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    this.pick(settings)
    speechSynthesis.onvoiceschanged = () => { this.pick(settings); onVoicesChanged() }
  },
  /** 在用户手势里空读一句，解锁 iOS 的朗读权限 */
  warm(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    try {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      speechSynthesis.speak(u)
    } catch (e) { /* 忽略 */ }
  },
}

let sayTimer: ReturnType<typeof setTimeout> | null = null

/* ===== 播完回调：原生壳回推 __onSpeakDone(id, status)，浏览器降级用 utterance.onend，均带兜底超时 ===== */

let speakDoneCb: (() => void) | null = null
let speakDoneTimer: ReturnType<typeof setTimeout> | null = null
let lastUtterance: SpeechSynthesisUtterance | null = null
/** 当前原生播报 id（网页生成，speak 时传给原生，事件按 id 匹配，过期/打断事件直接丢弃） */
let lastSpeakId = ''
let speakSeq = 0

function fireSpeakDone(): void {
  const cb = speakDoneCb
  speakDoneCb = null
  if (speakDoneTimer) { clearTimeout(speakDoneTimer); speakDoneTimer = null }
  if (cb) cb()
}

/** 丢弃未触发的播完回调（新一轮播报 / 主动停止前调用） */
function cancelSpeakDone(): void {
  speakDoneCb = null
  lastUtterance = null
  if (speakDoneTimer) { clearTimeout(speakDoneTimer); speakDoneTimer = null }
}

function armSpeakDone(cb: () => void, fallbackMs: number): void {
  speakDoneCb = cb
  if (speakDoneTimer) clearTimeout(speakDoneTimer)
  speakDoneTimer = setTimeout(fireSpeakDone, fallbackMs)
}

if (typeof window !== 'undefined') {
  // 原生壳回推 TTS 原始状态：按播报 id 匹配当前这轮，只认自然播完/出错；
  // stop（被打断）与过期 id 的事件一律丢弃，由新一轮 say() 的 cancel 覆盖
  window.__onSpeakDone = (id: string, status: string) => {
    if (id !== lastSpeakId) return
    if (status === 'complete' || status === 'error') fireSpeakDone()
  }
}

/** 粗估播报时长（兜底超时用，宁长勿短，防事件丢失卡住流程） */
function estimateMs(text: string, rate: number): number {
  const chars = text.replace(/\s/g, '').length
  const pauses = (text.match(/[！？。，、.!?]/g) || []).length
  const body = (chars * 340 + pauses * 200) / Math.max(0.6, rate) + 900
  return Math.min(10000, Math.max(3500, body))
}

/** 多段文本拼成整句（原生 TTS 用，段间补逗号产生自然停顿） */
function joinText(list: SayPart[]): string {
  let text = ''
  list.forEach(o => {
    if (text && !/[！？。，,、.!?]$/.test(text)) text += '，'
    text += o.t
  })
  return text
}

/** 语速取文本最长一段：整句更连贯自然，避免被最慢的单字段拖得机械拖沓 */
function longestRate(list: SayPart[], baseRate: number): number {
  let rate = baseRate
  let longest = 0
  list.forEach(o => {
    if (o.t.length > longest) {
      longest = o.t.length
      rate = o.r || baseRate
    }
  })
  return rate
}

/** 走系统 TTS（原生桥优先，浏览器 speechSynthesis 兜底） */
function speakViaEngine(list: SayPart[], baseRate: number, onDone: (() => void) | undefined, arm: boolean): void {
  stopPackAudio()
  if (native) {
    native.stop()
    const text = joinText(list)
    const rate = longestRate(list, baseRate)
    if (arm && onDone) armSpeakDone(onDone, estimateMs(text, rate))
    // 播报 id 由网页生成并随 speak 传给原生：原生回调原样带回，__onSpeakDone 按 id 匹配这轮播报
    lastSpeakId = `spk-${Date.now()}-${++speakSeq}`
    native.speak(text, Math.round(rate * 100) / 100, lastSpeakId)
    return
  }
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onDone) setTimeout(onDone, 400)
    return
  }
  speechSynthesis.cancel()
  if (sayTimer) clearTimeout(sayTimer)
  sayTimer = setTimeout(() => {
    list.forEach((o, idx) => {
      const u = new SpeechSynthesisUtterance(o.t)
      u.lang = 'zh-CN'
      if (Speech.voice) u.voice = Speech.voice
      u.rate = o.r || baseRate
      u.pitch = 1.06               // 略抬高一点点，更活泼、不刻板；咬字仍清楚
      if (onDone && idx === list.length - 1) {
        lastUtterance = u
        u.onend = () => { if (lastUtterance === u) fireSpeakDone() }
      }
      speechSynthesis.speak(u)
    })
    if (arm && onDone) {
      let all = ''
      list.forEach(o => { all += o.t })
      armSpeakDone(onDone, estimateMs(all, baseRate))
    }
  }, 60)
}

/** 朗读一段/多段文本。
 *  优先级：预生成音色包（三端统一、离线）→ 原生 TTS → 浏览器 speechSynthesis。
 *  onDone：整段自然播完后回调（打断不回调），用于"夸奖说完再出下一题"。 */
export function say(parts: string | (string | SayPart)[], settings: Settings, onDone?: () => void): void {
  const list = (Array.isArray(parts) ? parts : [parts]).map(p => (typeof p === 'string' ? { t: p } : p))
  const baseRate = rateOf(settings)
  cancelSpeakDone()
  stopPackAudio()

  // 音色包：所有分段都命中才整句走音频（避免同一句里混两种音色）
  const clips = list.map(o => clipFor(o.t))
  if (isVoicePackReady() && clips.every(Boolean)) {
    const rate = longestRate(list, baseRate)
    if (native) native.stop()
    else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { speechSynthesis.cancel() } catch (e) { /* 忽略 */ }
    }
    // 兜底超时放宽：音频段间有间隔，且失败回退 TTS 时也靠它保底
    if (onDone) armSpeakDone(onDone, estimateMs(joinText(list), rate) + 1200)
    playPack(clips as string[], packRate(rate), fireSpeakDone, () => {
      // 自动播放被拦截 / 文件缺失 / 解码失败 → 整句回退系统 TTS
      speakViaEngine(list, baseRate, onDone, false)
    })
    return
  }

  speakViaEngine(list, baseRate, onDone, true)
}

export function stopSpeak(): void {
  cancelSpeakDone()
  stopPackAudio()
  if (native) { try { native.stop() } catch (e) { /* 忽略 */ } }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { speechSynthesis.cancel() } catch (e) { /* 忽略 */ }
  }
}

export default Speech
