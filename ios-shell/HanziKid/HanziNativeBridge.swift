import Foundation
import WebKit

/**
 * 注入 WebView 的 window.HanziNative 桥。
 *
 * WKWebView 无法像 Android addJavascriptInterface 那样提供同步原生对象，采用：
 *  - DOCUMENT_START UserScript 注入 JS 包装：同步读（getProgress/getSettings/pinyinOf）
 *    直接返回注入时快照；写与动作类调用经 webkit.messageHandlers.hanziNative 异步转发
 *  - 原生事件回推：webView.evaluateJavaScript("window.__onVoiceEvent(type, json)")
 *
 * 协议与 taro-app/src/services/native/types.ts、鸿蒙 HanziNativeBridge 完全一致。
 */
final class HanziNativeBridge: NSObject, WKScriptMessageHandler {

    static let messageName = "hanziNative"

    private weak var webView: WKWebView?
    private let store = UserDefaults.standard
    private let voice = VoiceEngine()

    /* ===== 注入脚本 ===== */

    /// 汉字转无音标拼音：iOS 无公开汉字注音 API，返回空串走游戏侧兜底
    func userScript() -> WKUserScript {
        let progress = Self.jsEscape(store.string(forKey: Self.progressKey) ?? "")
        let settings = Self.jsEscape(store.string(forKey: Self.settingsKey) ?? "")
        let js = """
        (function(){
          var p = '\(progress)', s = '\(settings)';
          function post(m, a){ try {
            webkit.messageHandlers.\(Self.messageName).postMessage({method: m, args: a});
          } catch(e){} }
          window.HanziNative = {
            speak: function(t, r){ post('speak', [t, r]); },
            stop: function(){ post('stop', []); },
            getProgress: function(){ return p; },
            setProgress: function(v){ p = v; post('setProgress', [v]); },
            getSettings: function(){ return s; },
            setSettings: function(v){ s = v; post('setSettings', [v]); },
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
            voice.speak(text: text, rate: rate)
        case "stop":
            voice.stopSpeak()
        case "setProgress":
            if let v = args.first as? String { store.set(v, forKey: Self.progressKey) }
        case "setSettings":
            if let v = args.first as? String { store.set(v, forKey: Self.settingsKey) }
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

    private static let progressKey = "progress"
    private static let settingsKey = "settings"
}
