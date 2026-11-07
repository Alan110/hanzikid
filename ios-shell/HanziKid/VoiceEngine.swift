import Foundation
import AVFoundation
import Speech

/**
 * 读一读语音原语（与鸿蒙 NativeVoice / android VoiceEngine 对齐）。
 *
 *  - 朗读：AVSpeechSynthesizer（zh-CN），speak 带 id，播报状态经 speakEventSink (id, status) 回推
 *  - 录音：AVAudioRecorder（m4a/AAC 16k 单声道，存临时文件）
 *  - 回放：AVAudioPlayer → playbackDone
 *  - 识别：SFSpeechURLRecognizer（录音文件离线/在线识别，系统自动选择）→ asrResult/asrError
 *
 * 事件经 eventSink 回推：mic{granted} / recStarted{} / recStopped{ms,peak} /
 * playbackDone{} / asrResult{text} / asrError{code}
 */
final class VoiceEngine: NSObject, AVAudioRecorderDelegate, AVAudioPlayerDelegate, AVSpeechSynthesizerDelegate {

    /// (type, jsonText)
    var eventSink: ((String, String) -> Void)?

    /// TTS 播报状态回推 (id, status)：id 为网页 speak 传入的播报 id 原样带回，
    /// status ∈ 'complete'（自然播完）| 'stop'（被打断/取消），原样转发不做过滤
    var speakEventSink: ((String, String) -> Void)?

    /// 播报 id 挂在 utterance 子类上：delegate 回调原样带回，原生零匹配逻辑
    private final class SpeakUtterance: AVSpeechUtterance {
        var speakId = ""
    }

    private let synth = AVSpeechSynthesizer()
    private var recorder: AVAudioRecorder?
    private var meterTimer: Timer?
    private var peakLinear: Double = 0
    private var recordStart = Date()

    private var player: AVAudioPlayer?
    private var recognizeTask: SFSpeechRecognitionTask?
    private var recognizer: SFSpeechRecognizer?

    private var recordFileURL: URL {
        FileManager.default.temporaryDirectory.appendingPathComponent("hanzi_read.m4a")
    }

    /* ===== 朗读 ===== */

    func speak(text: String, rate: Double, id: String) {
        // 游戏侧 rate：1.0 约为常速，单字约 0.65（更慢）；
        // AVSpeechUtteranceRate 范围 0～1（默认 0.5），线性压到自然区间
        let u = SpeakUtterance(string: text)
        u.speakId = id
        u.voice = AVSpeechSynthesisVoice(language: "zh-CN")
        u.rate = Float(min(0.62, max(0.1, 0.12 + 0.42 * rate)))
        u.pitchMultiplier = 1.0
        synth.delegate = self
        synth.stopSpeaking(at: .immediate)
        synth.speak(u)
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        if let u = utterance as? SpeakUtterance { speakEventSink?(u.speakId, "complete") }
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        if let u = utterance as? SpeakUtterance { speakEventSink?(u.speakId, "stop") }
    }

    func stopSpeak() {
        synth.stopSpeaking(at: .immediate)
    }

    /* ===== 权限 ===== */

    func ensureMic() {
        AVAudioSession.sharedInstance().requestRecordPermission { [weak self] granted in
            // 识别还需要语音识别授权，一并申请后再回推结果
            guard granted else {
                self?.eventSink?("mic", #"{"granted":false}"#)
                return
            }
            SFSpeechRecognizer.requestAuthorization { [weak self] status in
                let ok = status == .authorized
                self?.eventSink?("mic", ok ? #"{"granted":true}"# : #"{"granted":false}"#)
            }
        }
    }

    /* ===== 录音 ===== */

    func startRecord() {
        stopRecordCleanup()

        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker])
            try session.setActive(true)
        } catch {
            emitLater("recStopped", #"{"ms":0,"peak":0}"#)
            return
        }

        let settings: [String: Any] = [
            AVFormatIDKey: kAudioFormatMPEG4AAC,
            AVSampleRateKey: 16000,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]
        do {
            let url = recordFileURL
            try? FileManager.default.removeItem(at: url)
            let r = try AVAudioRecorder(url: url, settings: settings)
            r.delegate = self
            r.isMeteringEnabled = true
            r.record()
            recorder = r
            recordStart = Date()
            peakLinear = 0
            // 50ms 轮询峰值（dBFS → 线性），recStopped 里回推
            meterTimer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { [weak self] _ in
                guard let self = self, let rec = self.recorder else { return }
                rec.updateMeters()
                let db = Double(rec.peakPower(for: 0))
                let linear = pow(10.0, db / 20.0)
                if linear > self.peakLinear { self.peakLinear = linear }
            }
            emitLater("recStarted", "{}")
        } catch {
            emitLater("recStopped", #"{"ms":0,"peak":0}"#)
        }
    }

    func stopRecord() {
        guard let r = recorder else { return }
        let ms = Date().timeIntervalSince(recordStart) * 1000
        meterTimer?.invalidate()
        meterTimer = nil
        r.stop()
        recorder = nil
        emitLater("recStopped", "{\"ms\":\(Int(ms)),\"peak\":\(String(format: "%.3f", min(1.0, peakLinear)))}")
    }

    func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
        // 文件落盘完成（识别/回放在收到 recStopped 后由游戏侧驱动）
    }

    private func stopRecordCleanup() {
        meterTimer?.invalidate()
        meterTimer = nil
        recorder?.stop()
        recorder = nil
    }

    /* ===== 回放 ===== */

    func playRecording() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default)
            try session.setActive(true)
            let p = try AVAudioPlayer(contentsOf: recordFileURL)
            p.delegate = self
            p.play()
            player = p
        } catch {
            // 无可回放内容也回推完成，游戏状态机不卡死
            emitLater("playbackDone", "{}")
        }
    }

    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        emitLater("playbackDone", "{}")
    }

    /* ===== 识别（录音文件） ===== */

    func recognize() {
        let locale = Locale(identifier: "zh-CN")
        let rec = recognizer ?? SFSpeechRecognizer(locale: locale)
        recognizer = rec
        guard let rec = rec, rec.isAvailable else {
            emitLater("asrError", #"{"code":1}"#)
            return
        }
        guard FileManager.default.fileExists(atPath: recordFileURL.path) else {
            emitLater("asrError", #"{"code":3}"#)
            return
        }
        let request = SFSpeechURLRecognitionRequest(url: recordFileURL)
        request.shouldReportPartialResults = false
        if #available(iOS 13.0, *) {
            request.addsPunctuation = true
        }
        recognizeTask?.cancel()
        recognizeTask = rec.recognitionTask(with: request) { [weak self] result, error in
            guard let self = self else { return }
            if let error = error as NSError? {
                self.emitLater("asrError", "{\"code\":\(error.code)}")
                self.recognizeTask = nil
                return
            }
            guard let result = result, result.isFinal else { return }
            let text = result.bestTranscription.formattedString
            self.recognizeTask = nil
            if text.isEmpty {
                self.emitLater("asrError", #"{"code":3}"#)
            } else {
                self.emitLater("asrResult", Self.jsonText(text))
            }
        }
    }

    /* ===== 全部取消 ===== */

    func cancelAll() {
        stopSpeak()
        stopRecordCleanup()
        player?.stop()
        player = nil
        recognizeTask?.cancel()
        recognizeTask = nil
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }

    /* ===== 工具 ===== */

    private func emitLater(_ type: String, _ json: String) {
        eventSink?(type, json)
    }

    /// asrResult 事件 data（含中文/引号安全转义），形如 {"text":"猫"}
    private static func jsonText(_ s: String) -> String {
        if let data = try? JSONSerialization.data(withJSONObject: ["text": s]),
           let str = String(data: data, encoding: .utf8) {
            return str
        }
        return #"{"text":""}"#
    }
}
