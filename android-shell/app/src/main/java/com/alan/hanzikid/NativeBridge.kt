package com.alan.hanzikid

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.webkit.JavascriptInterface
import org.json.JSONObject
import java.util.Locale

/**
 * 注入 WebView 的 window.HanziNative 桥（addJavascriptInterface 注入）。
 * 协议与 taro-app/src/services/native/types.ts、鸿蒙 Index.ets 的 HanziNativeBridge 完全一致：
 *  - 朗读：TextToSpeech（zh-CN），speak 带 id，播报状态经 __onSpeakDone(id, status) 原样回推
 *  - 持久化：通用 kvGet/kvSet（SharedPreferences 哑 K-V）+ legacy 专用键（老数据迁移）
 *  - 读一读：VoiceEngine（AudioRecord 录音 + AudioTrack 回放 + SpeechRecognizer 听写）
 * 事件回推：activity.runOnUiThread { webView.evaluateJavascript(...) }
 */
class NativeBridge(private val activity: MainActivity) {

    private val prefs = activity.getSharedPreferences("hanzi_native", Context.MODE_PRIVATE)

    private var tts: TextToSpeech? = null
    @Volatile private var ttsReady = false
    @Volatile private var pendingSpeak: Triple<String, Float, String>? = null

    private val voice = VoiceEngine(activity, ::emit)

    init {
        // TTS 引擎异步初始化；未就绪时的 speak 先暂存，初始化成功后自动补播
        tts = TextToSpeech(activity.applicationContext) { status ->
            ttsReady = status == TextToSpeech.SUCCESS
            if (ttsReady) {
                tts?.language = Locale.SIMPLIFIED_CHINESE
                // 播报状态原样回推：id 即网页 speak 传入的播报 id（utteranceId 原样带回）
                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) { /* 网页侧不需要开始事件 */ }

                    override fun onDone(utteranceId: String?) {
                        emitSpeakDone(utteranceId, "complete")
                    }

                    @Deprecated("Deprecated in Java")
                    override fun onError(utteranceId: String?) {
                        emitSpeakDone(utteranceId, "error")
                    }

                    override fun onStop(utteranceId: String?, interrupted: Boolean) {
                        emitSpeakDone(utteranceId, "stop")
                    }
                })
                pendingSpeak?.let { (text, rate, id) -> speakImpl(text, rate, id) }
                pendingSpeak = null
            }
        }
    }

    /* ===== 朗读 ===== */

    @JavascriptInterface
    fun speak(text: String, rate: Double, id: String) {
        val r = rate.toFloat()
        if (!ttsReady) {
            pendingSpeak = Triple(text, r, id)
            return
        }
        speakImpl(text, r, id)
    }

    private fun speakImpl(text: String, rate: Float, id: String) {
        val engine = tts ?: return
        // 网页侧 rate：1.0 约为常速，游戏单字约 0.65（更慢）；TextToSpeech 同量纲
        engine.setSpeechRate(rate.coerceIn(0.5f, 2.0f))
        engine.setPitch(1.0f)
        // utteranceId 直接用网页传入的播报 id：回调原样带回，原生不做任何匹配/过滤
        engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, id.ifEmpty { "hanzi-${System.nanoTime()}" })
    }

    @JavascriptInterface
    fun stop() {
        tts?.stop()
    }

    /* ===== 通用 K-V 持久化（网页侧数据统一走 kvGet/kvSet，key/value 均为字符串） ===== */

    @JavascriptInterface
    fun kvGet(key: String): String = prefs.getString(key, "") ?: ""

    @JavascriptInterface
    fun kvSet(key: String, value: String) {
        prefs.edit().putString(key, value).apply()
    }

    /* ===== legacy 专用键（老版本兼容/数据迁移用） ===== */

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

    /** TTS 播报状态回推（UtteranceProgressListener 在 binder 线程回调，需切 UI 线程） */
    private fun emitSpeakDone(id: String?, status: String) {
        val speakId = id ?: return
        activity.runOnUiThread {
            activity.webView.evaluateJavascript("window.__onSpeakDone && window.__onSpeakDone('$speakId', '$status')", null)
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
