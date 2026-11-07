/* 音效（Web Audio 合成，无素材文件；原样迁移 game.js）
 * 三端运行环境都是 WebView（ArkWeb / WKWebView / Android WebView），Web Audio 全部可用。 */

let actx: AudioContext | null = null

function audio(): AudioContext | null {
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext
  if (!AC) return null
  if (!actx) actx = new AC()
  if (actx.state === 'suspended') actx.resume()
  return actx
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, delay = 0, slideTo: number | null = null): void {
  const ctx = audio()
  if (!ctx) return
  const t = ctx.currentTime + delay
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(ctx.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
}

const CHEER_SFX = [
  () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .14, 'triangle', .2, i * .08)),
  () => [587, 740, 880, 1175].forEach((f, i) => tone(f, .13, 'triangle', .18, i * .07)),
  () => [659, 784, 988, 1319].forEach((f, i) => tone(f, .15, 'sine', .18, i * .09)),
  () => { [523, 784].forEach((f, i) => tone(f, .18, 'triangle', .2, i * .1)); tone(1047, .25, 'sine', .15, .22) },
]

export const SFX = {
  tap: () => tone(600, .07, 'sine', .09, 0, 900),
  wrong: () => { tone(300, .12, 'sine', .09, 0, 240); tone(240, .16, 'sine', .09, .1, 200) },
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .16, 'triangle', .22, i * .12)),
  cheer: () => CHEER_SFX[Math.floor(Math.random() * CHEER_SFX.length)](),
}

/** 首次触摸时解锁音频（iOS 要求在用户手势内） */
export function unlockAudio(): void {
  audio()
}
