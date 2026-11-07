/* 原生桥探测与事件订阅：游戏侧唯一入口 */
import type { NativeBridge, VoiceEventHandler } from './types'

/** 原生壳注入的桥；浏览器 H5 下为 null（走降级路径） */
export const native: NativeBridge | null =
  typeof window !== 'undefined' && window.HanziNative ? window.HanziNative : null

/** 是否具备原生语音原语（读一读录音评分） */
export const VOICE: boolean = !!(native && typeof native.voiceStartRecord === 'function'
  && typeof native.voiceRecognize === 'function')

/** 订阅原生语音事件（原生侧 evaluateJavaScript 调 window.__onVoiceEvent） */
export function onVoiceEvent(handler: VoiceEventHandler): void {
  if (typeof window === 'undefined') return
  window.__onVoiceEvent = (type, data) => {
    try {
      handler(type, data || {})
    } catch (e) {
      console.error('[voice event]', type, e)
    }
  }
}
