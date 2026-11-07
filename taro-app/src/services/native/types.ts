/* =====================================================================
 * 跨端原生桥协议（与 harmony-app 的 window.HanziNative 完全一致）
 *
 * 三个平台的壳工程都注入同名对象 window.HanziNative：
 *   - 鸿蒙：harmony-app 里 Web 组件的 javaScriptProxy（ArkTS 实现，
 *     TTS/录音/识别走 CoreSpeechKit + AudioKit，见 entry/src/main/ets）
 *   - iOS：ios-shell 里 WKUserScript 注入的代理（AVSpeechSynthesizer /
 *     AVAudioRecorder / SFSpeechRecognizer）
 *   - Android：android-shell 里 addJavascriptInterface 注入（TextToSpeech /
 *     AudioRecord + AudioTrack / SpeechRecognizer）
 *
 * 浏览器直接打开（H5）时桥不存在，游戏自动走降级路径：
 *   朗读 → Web speechSynthesis；读一读 → 纯跟读模式（不录音不评分）
 *
 * 设计原则：壳只做「哑能力」（引擎调用 + 原始事件透传 + 哑 K-V 存储），
 * 业务逻辑（播报 id 匹配、状态语义、数据路由/迁移、发星规则）全部在网页侧，
 * 三端壳实现越薄越好。
 *
 * 事件回推（原生 evaluateJavaScript 调网页全局函数，参数原样透传）：
 *   - window.__onVoiceEvent(type, json)
 *     mic{granted} / recStarted{} / recStopped{ms,peak} / playbackDone{}
 *     asrResult{text} / asrError{code}
 *   - window.__onSpeakDone(id, status)
 *     id = speak(text, rate, id) 传入的播报 id 原样带回；
 *     status ∈ 'complete'（自然播完）| 'error'（失败）| 'stop'（被打断）。
 *     网页侧按 id 匹配当前播报并决定取舍，原生不做任何过滤。
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

export type SpeakStatus = 'complete' | 'error' | 'stop'

export interface NativeBridge {
  /* ===== 朗读（原生 TTS）：id 由网页生成，回调原样带回 ===== */
  speak(text: string, rate: number, id: string): void
  stop(): void

  /* ===== 通用 K-V 持久化（原生 Preferences / UserDefaults / SharedPreferences） =====
   * 网页侧所有数据（stats/settings/awards/未来新类型）统一走这两个方法，
   * key/value 均为字符串，空串表示无数据。壳实现后新数据类型零原生改动。 */
  kvGet?(key: string): string
  kvSet?(key: string, value: string): void

  /* ===== legacy 专用键（老版本兼容/数据迁移用，新壳可不实现） ===== */
  getProgress?(): string
  setProgress?(json: string): void
  getSettings?(): string
  setSettings?(json: string): void

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
    /** TTS 播报状态回推（由游戏侧赋值）：id 原样透传 + status ∈ complete/error/stop */
    __onSpeakDone?: (id: string, status: SpeakStatus | string) => void
  }
}
