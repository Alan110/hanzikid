/**
 * 语音音色包播放器。
 *
 * 音包由 scripts/voice-pack.mjs 预生成（讯飞 TTS），随 dist 分发到三壳：
 * 固定语料离线播放、三端音色一致；未命中/播放失败由 speech.ts 回退系统 TTS。
 *
 * 文本 key 归一化规则必须与生成脚本 keyOf() 完全一致：
 * 去掉标点、emoji、空格，只保留汉字/字母/数字。
 */
import { VOICE_PACK } from './voiceManifest.generated'

/** 归一化文本 → manifest key（与 scripts/voice-pack.mjs 的 keyOf 保持一致） */
export const packKey = (s: string): string => s.replace(/[^一-鿿a-zA-Z0-9]/g, '')

/** 命中音包则返回相对路径（相对于 index.html），否则 undefined */
export function clipFor(text: string): string | undefined {
  return VOICE_PACK[packKey(text)]
}

export function hasVoicePack(): boolean {
  return Object.keys(VOICE_PACK).length > 0
}

/** 家长速度档位 → 音包播放倍率（音包录制时已是「略慢」，只做小幅调整避免变调） */
export function packRate(rate: number): number {
  if (rate <= 0.8) return 0.9
  if (rate >= 1.05) return 1.08
  return 1.0
}

let token = 0
let current: HTMLAudioElement | null = null

/** 停止音包播放（打断/切题时调用） */
export function stopPackAudio(): void {
  token++
  if (!current) return
  const a = current
  current = null
  a.onended = null
  a.onerror = null
  try { a.pause() } catch (e) { /* 忽略 */ }
  try { a.currentTime = 0 } catch (e) { /* 忽略 */ }
}

/**
 * 顺序播放多段音频（段间 110ms）。
 * onDone：最后一段自然播完；onError：任一段加载/播放失败（含自动播放被拦截）。
 * 已播出的段落不重放，由调用方决定回退策略。
 */
export function playPack(
  clips: string[],
  rate: number,
  onDone: () => void,
  onError: () => void,
): void {
  const my = ++token
  let i = 0

  const next = () => {
    if (my !== token) return
    if (i >= clips.length) {
      current = null
      onDone()
      return
    }
    const a = new Audio(clips[i++])
    current = a
    a.playbackRate = Math.min(1.15, Math.max(0.85, rate))
    a.onended = () => {
      if (my !== token) return
      current = null
      setTimeout(() => { if (my === token) next() }, 110)
    }
    a.onerror = () => {
      if (my !== token) return
      current = null
      onError()
    }
    a.play().catch(() => {
      if (my !== token) return
      current = null
      onError()
    })
    // 预加载下一段，缩短段间空档
    if (i < clips.length) {
      const p = new Audio(clips[i])
      p.preload = 'auto'
      try { p.load() } catch (e) { /* 忽略 */ }
    }
  }

  next()
}
