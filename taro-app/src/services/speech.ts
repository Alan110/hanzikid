/* 语音合成（TTS）：原生桥优先，浏览器回退 speechSynthesis（原样迁移 game.js） */
import { native } from './native'
import { RATES } from '../game/copy'
import type { Settings } from './store'

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

/** 朗读一段/多段文本。原生壳内只要桥存在就优先走原生 TTS：
 *  ArkWeb 里 window.speechSynthesis 对象可能存在但底层没有 TTS 引擎（出不了声），
 *  所以不能拿 'speechSynthesis' in window 做判断依据。 */
export function say(parts: string | (string | SayPart)[], settings: Settings): void {
  const list = (Array.isArray(parts) ? parts : [parts]).map(p => (typeof p === 'string' ? { t: p } : p))
  const baseRate = rateOf(settings)
  if (native) {
    native.stop()
    // 智能拼接：上一段已带句读就不再补逗号，减少生硬停顿，朗读更连贯
    let text = ''
    list.forEach(o => {
      if (text && !/[！？。，,、.!?]$/.test(text)) text += '，'
      text += o.t
    })
    // 语速取文本最长一段的语速：整句更连贯自然，避免整句被最慢的单字段拖得机械拖沓
    let rate = baseRate
    let longest = 0
    list.forEach(o => {
      if (o.t.length > longest) {
        longest = o.t.length
        rate = o.r || baseRate
      }
    })
    native.speak(text, Math.round(rate * 100) / 100)
    return
  }
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  if (sayTimer) clearTimeout(sayTimer)
  sayTimer = setTimeout(() => {
    list.forEach(o => {
      const u = new SpeechSynthesisUtterance(o.t)
      u.lang = 'zh-CN'
      if (Speech.voice) u.voice = Speech.voice
      u.rate = o.r || baseRate
      u.pitch = 1.06               // 略抬高一点点，更活泼、不刻板；咬字仍清楚
      speechSynthesis.speak(u)
    })
  }, 60)
}

export function stopSpeak(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { speechSynthesis.cancel() } catch (e) { /* 忽略 */ }
  }
}

export default Speech
