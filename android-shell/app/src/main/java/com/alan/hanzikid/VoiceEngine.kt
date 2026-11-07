package com.alan.hanzikid

import android.annotation.SuppressLint
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioRecord
import android.media.AudioTrack
import android.media.MediaRecorder
import android.os.Bundle
import android.os.SystemClock
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder

/**
 * 读一读语音原语（与鸿蒙 NativeVoice 对齐）。
 *
 * Android 无公开的"文件离线识别"API，识别采用随录音同步进行的在线听写
 * （SpeechRecognizer，依赖系统语音服务；无服务设备自动 asrError 走游戏兜底）：
 *   startRecord 时同时启动 AudioRecord（16k/mono/16bit，内存缓存供回放）与听写；
 *   stopRecord 回推 recStopped{ms,peak}；
 *   recognize 时取听写最终结果（最多等 2.5s）回推 asrResult{text} / asrError{code}。
 */
class VoiceEngine(private val activity: MainActivity, private val emit: (String, String) -> Unit) {

    private val lock = Object()

    private var record: AudioRecord? = null
    private var recordThread: Thread? = null
    private var pcm = ByteArrayOutputStream()
    private var peak = 0.0
    private var startAt = 0L

    private var recognizer: SpeechRecognizer? = null
    @Volatile private var asrText: String? = null
    @Volatile private var asrDone = false

    private var track: AudioTrack? = null
    private var playThread: Thread? = null

    companion object {
        private const val SAMPLE = 16000
        private const val CHUNK = 1280            // 40ms @16k/16bit 采样数，与鸿蒙喂流节奏一致
        private const val WAIT_ASR_MS = 2500L
        private const val ASR_NO_SERVICE = 1
        private const val ASR_TIMEOUT = 2
        private const val ASR_EMPTY = 3
    }

    fun ensureMic() {
        activity.requestMic { granted ->
            emit("mic", JSONObject().put("granted", granted).toString())
        }
    }

    @SuppressLint("MissingPermission") // 游戏流程先 voiceEnsureMic；未授权时 AudioRecord 初始化失败走静默兜底
    fun startRecord() {
        synchronized(lock) {
            cancelRecordLocked()
            pcm.reset()
            peak = 0.0
            asrText = null
            asrDone = false

            val minBuf = AudioRecord.getMinBufferSize(SAMPLE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
            val r = AudioRecord(
                MediaRecorder.AudioSource.MIC, SAMPLE,
                AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT,
                maxOf(minBuf, CHUNK * 2 * 16)
            )
            if (r.state != AudioRecord.STATE_INITIALIZED) {
                r.release()
                return
            }
            record = r
            startAt = SystemClock.elapsedRealtime()
            r.startRecording()
            startRecognizer()

            recordThread = Thread {
                val buf = ShortArray(CHUNK)
                val bytes = ByteArray(CHUNK * 2)
                while (!Thread.currentThread().isInterrupted) {
                    val cur = record ?: break
                    val n = cur.read(buf, 0, buf.size)
                    if (n <= 0) break
                    synchronized(lock) {
                        for (i in 0 until n) {
                            val a = kotlin.math.abs(buf[i]).toInt()
                            if (a > peak) peak = a.toDouble()
                        }
                        ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().put(buf, 0, n)
                        pcm.write(bytes, 0, n * 2)
                    }
                    if (cur.recordingState != AudioRecord.RECORDSTATE_RECORDING) break
                }
            }.also { it.start() }

            emit("recStarted", "{}")
        }
    }

    /** SpeechRecognizer 只能在主线程创建/启动 */
    private fun startRecognizer() {
        if (!SpeechRecognizer.isRecognitionAvailable(activity)) {
            asrDone = true
            return
        }
        activity.runOnUiThread {
            try {
                val sr = SpeechRecognizer.createSpeechRecognizer(activity)
                recognizer = sr
                sr.setRecognitionListener(object : RecognitionListener {
                    override fun onResults(results: Bundle) {
                        val list = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        asrText = list?.firstOrNull { it.isNotBlank() } ?: ""
                        asrDone = true
                    }

                    override fun onError(error: Int) {
                        asrDone = true
                    }

                    override fun onReadyForSpeech(params: Bundle?) {}
                    override fun onBeginningOfSpeech() {}
                    override fun onRmsChanged(rmsdB: Float) {}
                    override fun onBufferReceived(buffer: ByteArray?) {}
                    override fun onEndOfSpeech() {}
                    override fun onPartialResults(partialResults: Bundle?) {}
                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, "zh-CN")
                    putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false)
                    putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
                }
                sr.startListening(intent)
            } catch (_: Exception) {
                asrDone = true
            }
        }
    }

    fun stopRecord() {
        synchronized(lock) {
            val r = record ?: return
            val ms = SystemClock.elapsedRealtime() - startAt
            record = null
            try {
                r.stop()
            } catch (_: Exception) {
            }
            r.release()
            recordThread?.interrupt()
            recordThread = null
            activity.runOnUiThread {
                try {
                    recognizer?.stopListening()
                } catch (_: Exception) {
                }
            }
            emit("recStopped", JSONObject()
                .put("ms", ms)
                .put("peak", (peak / 32768.0).coerceIn(0.0, 1.0))
                .toString())
        }
    }

    fun playRecording() {
        val data: ByteArray = synchronized(lock) { pcm.toByteArray() }
        if (data.isEmpty()) {
            emit("playbackDone", "{}")
            return
        }
        stopPlayback()
        playThread = Thread {
            val t = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setSampleRate(SAMPLE)
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build()
                )
                .setBufferSizeInBytes(maxOf(data.size, AudioTrack.getMinBufferSize(
                    SAMPLE, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT)))
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build()
            track = t
            t.write(data, 0, data.size)
            t.play()
            val frames = data.size / 2
            // 播放头到达总帧数即播完（静态模式一次性写入）
            while (t.playbackHeadPosition < frames && t.playState == AudioTrack.PLAYSTATE_PLAYING) {
                Thread.sleep(40)
            }
            try {
                t.stop()
            } catch (_: IllegalStateException) {
            }
            t.release()
            if (track === t) track = null
            emit("playbackDone", "{}")
        }.also { it.start() }
    }

    fun recognize(word: String) {
        if (!SpeechRecognizer.isRecognitionAvailable(activity)) {
            emit("asrError", JSONObject().put("code", ASR_NO_SERVICE).toString())
            return
        }
        // 录音期间在线听写；游戏在 stopRecord 后立刻问结果，最多再等一小会儿
        Thread {
            val deadline = System.currentTimeMillis() + WAIT_ASR_MS
            while (!asrDone && System.currentTimeMillis() < deadline) {
                Thread.sleep(60)
            }
            val text = asrText
            when {
                !asrDone || text == null ->
                    emit("asrError", JSONObject().put("code", ASR_TIMEOUT).toString())
                text.isBlank() ->
                    emit("asrError", JSONObject().put("code", ASR_EMPTY).toString())
                else ->
                    emit("asrResult", JSONObject().put("text", text).toString())
            }
            // 本轮识别结束，销毁 recognizer 避免多轮积累泄漏
            val sr = recognizer
            if (sr != null) {
                recognizer = null
                activity.runOnUiThread {
                    try {
                        sr.destroy()
                    } catch (_: Exception) {
                    }
                }
            }
        }.start()
    }

    fun cancelAll() {
        synchronized(lock) {
            cancelRecordLocked()
        }
        stopPlayback()
    }

    /** 须在 lock 内调用：停录音与识别，不动回放 */
    private fun cancelRecordLocked() {
        record?.let { r ->
            record = null
            try {
                r.stop()
            } catch (_: Exception) {
            }
            r.release()
        }
        recordThread?.interrupt()
        recordThread = null
        val sr = recognizer
        recognizer = null
        if (sr != null) {
            activity.runOnUiThread {
                try {
                    sr.destroy()
                } catch (_: Exception) {
                }
            }
        }
    }

    private fun stopPlayback() {
        playThread?.interrupt()
        playThread = null
        track?.let { t ->
            try {
                t.stop()
            } catch (_: IllegalStateException) {
            }
            t.release()
        }
        track = null
    }
}
