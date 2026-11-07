import Foundation
import WebKit

/**
 * 注入 WebView 的 window.HanziNative 桥。
 *
 * WKWebView 无法像 Android addJavascriptInterface 那样提供同步原生对象，采用：
 *  - DOCUMENT_START UserScript 注入 JS 包装：同步读（kvGet/legacy 读/pinyinOf）
 *    直接返回注入时快照；写与动作类调用经 webkit.messageHandlers.hanziNative 异步转发
 *  - 原生事件回推：webView.evaluateJavaScript（__onVoiceEvent / __onSpeakDone）
 *
 * kvGet 为注入时快照的限制：网页侧每个 key 只在启动时读一次（store.ts 读链），
 * 运行期写经 kvSet 同步更新 JS 侧映射并异步落 UserDefaults，语义与需求匹配。
 *
 * 协议与 taro-app/src/services/native/types.ts、鸿蒙 HanziNativeBridge 完全一致。
 */
final class HanziNativeBridge: NSObject, WKScriptMessageHandler {

    static let messageName = "hanziNative"

    /// kvGet 快照覆盖的网页侧存储 key（hzk_*），新增数据类型时在此追加
    private static let kvKeys = ["hzk_stats", "hzk_settings", "hzk_awards", "hzk_last"]

    private weak var webView: WKWebView?
    private let store = UserDefaults.standard
    private let voice = VoiceEngine()

    /* ===== 注入脚本 ===== */

    /// 汉字转无音标拼音：iOS 无公开汉字注音 API，返回空串走游戏侧兜底
    func userScript() -> WKUserScript {
        // kv 快照：所有已知 hzk_* key 的注入时值（同步 kvGet 的数据源）；
        // 老版本 iOS 壳存于专用键（progress/settings），无 hzk_* 数据时回退读取完成迁移
        var kvInit = "{"
        for (i, k) in Self.kvKeys.enumerated() {
            var v = store.string(forKey: k) ?? ""
            if v.isEmpty && k == "hzk_stats" { v = store.string(forKey: "progress") ?? "" }
            if v.isEmpty && k == "hzk_settings" { v = store.string(forKey: "settings") ?? "" }
            let escaped = Self.jsEscape(v)
            kvInit += i > 0 ? "," : ""
            kvInit += "'\(k)':'\(escaped)'"
        }
        kvInit += "}"
        let js = """
        (function(){
          var kv = \(kvInit);
          function post(m, a){ try {
            webkit.messageHandlers.\(Self.messageName).postMessage({method: m, args: a});
          } catch(e){} }
          window.HanziNative = {
            speak: function(t, r, id){ post('speak', [t, r, id || '']); },
            stop: function(){ post('stop', []); },
            kvGet: function(k){ return kv[k] || ''; },
            kvSet: function(k, v){ kv[k] = v; post('kvSet', [k, v]); },
            getProgress: function(){ return kv['hzk_stats'] || ''; },
            setProgress: function(v){ kv['hzk_stats'] = v; post('kvSet', ['hzk_stats', v]); },
            getSettings: function(){ return kv['hzk_settings'] || ''; },
            setSettings: function(v){ kv['hzk_settings'] = v; post('kvSet', ['hzk_settings', v]); },
            voiceEnsureMic: function(){ post('voiceEnsureMic', []); },
            voiceStartRecord: function(){ post('voiceStartRecord', []); },
            voiceStopRecord: function(){ post('voiceStopRecord', []); },
            voicePlayRecording: function(){ post('voicePlayRecording', []); },
            voiceRecognize: function(w){ post('voiceRecognize', [w]); },
            voiceCancel: function(){ post('voiceCancel', []); },
            pinyinOf: function(t){ return ''; }
          };
        })();
        """
        return WKUserScript(source: js, injectionTime: .atDocumentStart, forMainFrameOnly: true)
    }

    func attach(webView: WKWebView) {
        self.webView = webView
        voice.eventSink = { [weak self] type, json in
            self?.emit(type, json)
        }
        voice.speakEventSink = { [weak self] id, status in
            self?.emitSpeakDone(id, status)
        }
    }

    /* ===== H5 → 原生 ===== */

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let method = body["method"] as? String,
              let args = body["args"] as? [Any] else { return }
        switch method {
        case "speak":
            let text = args.count > 0 ? (args[0] as? String ?? "") : ""
            let rate = args.count > 1 ? (args[1] as? Double ?? 0.95) : 0.95
            let id = args.count > 2 ? (args[2] as? String ?? "") : ""
            voice.speak(text: text, rate: rate, id: id)
        case "stop":
            voice.stopSpeak()
        case "kvSet":
            if args.count > 1, let k = args[0] as? String, let v = args[1] as? String {
                store.set(v, forKey: k)
            }
        case "voiceEnsureMic":
            voice.ensureMic()
        case "voiceStartRecord":
            voice.startRecord()
        case "voiceStopRecord":
            voice.stopRecord()
        case "voicePlayRecording":
            voice.playRecording()
        case "voiceRecognize":
            voice.recognize()
        case "voiceCancel":
            voice.cancelAll()
        default:
            break
        }
    }

    /* ===== 事件回推 ===== */

    private func emit(_ type: String, _ json: String) {
        DispatchQueue.main.async { [weak self] in
            self?.webView?.evaluateJavaScript("window.__onVoiceEvent('\(type)', \(json))", completionHandler: nil)
        }
    }

    /// TTS 播报状态回推：id + status 原样透传，匹配/过滤全在网页侧
    private func emitSpeakDone(_ id: String, _ status: String) {
        DispatchQueue.main.async { [weak self] in
            self?.webView?.evaluateJavaScript("window.__onSpeakDone && window.__onSpeakDone('\(id)', '\(status)')", completionHandler: nil)
        }
    }

    /// 把 JSON 字符串安全嵌入单引号 JS 字面量（换行/引号/反斜杠转义）
    private static func jsEscape(_ s: String) -> String {
        var out = ""
        for ch in s {
            switch ch {
            case "\\": out += "\\\\"
            case "'": out += "\\'"
            case "\"": out += "\\\""
            case "\n": out += "\\n"
            case "\r": out += "\\r"
            case "\t": out += "\\t"
            default: out.append(ch)
            }
        }
        return out
    }
}
