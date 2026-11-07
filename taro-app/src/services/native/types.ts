/* =====================================================================
 * 跨端原生桥协议（与 harmony-app 的 window.HanziNative 完全一致）
 *
 * 三个平台的壳工程都注入同名对象 window.HanziNative：
 *   - 鸿蒙：harmony-shell 里 Web 组件的 javaScriptProxy（ArkTS 实现，
 *     TTS/录音/识别走 CoreSpeechKit + AudioKit，见 harmony-shell/entry）
 *   - iOS：ios-shell 里 WKUserScript 注入的代理（AVSpeechSynthesizer /
 *     AVAudioRecorder / SFSpeechRecognizer）
 *   - Android：android-shell 里 addJavascriptInterface 注入（TextToSpeech /
 *     AudioRecord + AudioTrack / SpeechRecognizer）
 *
 * 浏览器直接打开（H5）时桥不存在，游戏自动走降级路径：
 *   朗读 → Web speechSynthesis；读一读 → 纯跟读模式（不录音不评分）
 *
 * 事件回推：原生侧通过 evaluateJavaScript 调 window.__onVoiceEvent(type, json)
 *   mic{granted} / recStarted{} / recStopped{ms,peak} / playbackDone{}
 *   asrResult{text} / asrError{code}
 * ===================================================================== */

export interface VoiceEventData {
  granted?: boolean
  ms?: number
  peak?: number
  text?: string
  code?: number
  [key: string]: any
}

export type VoiceEventType = 'mic' | 'recStarted' | 'recStopped' | 'playbackDone' | 'asrResult' | 'asrError'
export type VoiceEventHandler = (type: VoiceEventType, data: VoiceEventData) => void

export interface NativeBridge {
  /* ===== 朗读（原生 TTS） ===== */
  speak(text: string, rate: number): void
  stop(): void

  /* ===== 持久化（原生 Preferences / UserDefaults / SharedPreferences） ===== */
  getProgress(): string
  setProgress(json: string): void
  getSettings(): string
  setSettings(json: string): void

  /* ===== 读一读：语音原语（状态机在游戏侧，事件经 __onVoiceEvent 回推） ===== */
  voiceEnsureMic(): void
  voiceStartRecord(): void
  voiceStopRecord(): void
  voicePlayRecording(): void
  voiceRecognize(word: string): void
  voiceCancel(): void

  /** 汉字转无音标拼音（读一读同音字容错判定用），无原生实现时返回空串走兜底 */
  pinyinOf(text: string): string
}

declare global {
  interface Window {
    /** 原生壳注入的桥（H5 浏览器下为 undefined） */
    HanziNative?: NativeBridge
    /** 原生事件回推入口（由游戏侧赋值，原生侧 evaluateJavaScript 调用） */
    __onVoiceEvent?: (type: VoiceEventType, data: VoiceEventData) => void
  }
}
