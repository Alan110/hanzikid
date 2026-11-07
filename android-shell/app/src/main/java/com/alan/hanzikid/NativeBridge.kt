package com.alan.hanzikid

import android.content.Context
import android.speech.tts.TextToSpeech
import android.webkit.JavascriptInterface
import org.json.JSONObject
import java.util.Locale

/**
 * 注入 WebView 的 window.HanziNative 桥（addJavascriptInterface 注入）。
 * 协议与 taro-app/src/services/native/types.ts、鸿蒙 Index.ets 的 HanziNativeBridge 完全一致：
 *  - 朗读：TextToSpeech（zh-CN）
 *  - 持久化：SharedPreferences（卸载重装前不丢）
 *  - 读一读：VoiceEngine（AudioRecord 录音 + AudioTrack 回放 + SpeechRecognizer 听写）
 * 事件回推：activity.webView.evaluateJavascript("window.__onVoiceEvent(type, json)")
 */
class NativeBridge(private val activity: MainActivity) {

    private val prefs = activity.getSharedPreferences("hanzi_native", Context.MODE_PRIVATE)

    private var tts: TextToSpeech? = null
    @Volatile private var ttsReady = false
    @Volatile private var pendingSpeak: Pair<String, Float>? = null

    private val voice = VoiceEngine(activity, ::emit)

    init {
        // TTS 引擎异步初始化；未就绪时的 speak 先暂存，初始化成功后自动补播
        tts = TextToSpeech(activity.applicationContext) { status ->
            ttsReady = status == TextToSpeech.SUCCESS
            if (ttsReady) {
                tts?.language = Locale.SIMPLIFIED_CHINESE
                pendingSpeak?.let { (text, rate) -> speakImpl(text, rate) }
                pendingSpeak = null
            }
        }
    }

    /* ===== 朗读 ===== */

    @JavascriptInterface
    fun speak(text: String, rate: Double) {
        val r = rate.toFloat()
        if (!ttsReady) {
            pendingSpeak = text to r
            return
        }
        speakImpl(text, r)
    }

    private fun speakImpl(text: String, rate: Float) {
        val engine = tts ?: return
        // 网页侧 rate：1.0 约为常速，游戏单字约 0.65（更慢）；TextToSpeech 同量纲
        engine.setSpeechRate(rate.coerceIn(0.5f, 2.0f))
        engine.setPitch(1.0f)
        engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "hanzi-${System.nanoTime()}")
    }

    @JavascriptInterface
    fun stop() {
        tts?.stop()
    }

    /* ===== 持久化 ===== */

    @JavascriptInterface
    fun getProgress(): String = prefs.getString(KEY_PROGRESS, "") ?: ""

    @JavascriptInterface
    fun setProgress(json: String) {
        prefs.edit().putString(KEY_PROGRESS, json).apply()
    }

    @JavascriptInterface
    fun getSettings(): String = prefs.getString(KEY_SETTINGS, "") ?: ""

    @JavascriptInterface
    fun setSettings(json: String) {
        prefs.edit().putString(KEY_SETTINGS, json).apply()
    }

    /* ===== 读一读：语音原语（状态机在游戏侧，事件经 __onVoiceEvent 回推） ===== */

    @JavascriptInterface
    fun voiceEnsureMic() = voice.ensureMic()

    @JavascriptInterface
    fun voiceStartRecord() = voice.startRecord()

    @JavascriptInterface
    fun voiceStopRecord() = voice.stopRecord()

    @JavascriptInterface
    fun voicePlayRecording() = voice.playRecording()

    @JavascriptInterface
    fun voiceRecognize(word: String) = voice.recognize(word)

    @JavascriptInterface
    fun voiceCancel() = voice.cancelAll()

    /** 汉字转无音标拼音：Android 无系统级拼音 API，返回空串走游戏侧兜底 */
    @JavascriptInterface
    fun pinyinOf(text: String): String = ""

    /* ===== 事件回推（UI 线程执行 evaluateJavascript） ===== */

    fun emit(type: String, json: String) {
        activity.runOnUiThread {
            activity.webView.evaluateJavascript("window.__onVoiceEvent('$type', $json)", null)
        }
    }

    fun shutdown() {
        voice.cancelAll()
        tts?.shutdown()
        tts = null
        ttsReady = false
    }

    companion object {
        private const val KEY_PROGRESS = "progress"
        private const val KEY_SETTINGS = "settings"
    }
}
