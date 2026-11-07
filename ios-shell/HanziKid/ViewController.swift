import UIKit
import WebKit

/**
 * 识字小乐园 iOS 壳：全屏 WKWebView 加载 bundle 内的 Taro H5 产物。
 *
 * 页面来源：taro-app 执行 `npm run build:h5 && npm run sync:ios`
 * 同步到 HanziKid/www/（以 Folder Reference 蓝色文件夹加入 Xcode 工程）。
 *
 * 原生能力经 window.HanziNative 桥注入（HanziNativeBridge，
 * DOCUMENT_START UserScript + scriptMessageHandler），协议与
 * taro-app/src/services/native/types.ts 完全一致。
 */
final class ViewController: UIViewController {

    private var webView: WKWebView!
    private var bridge: HanziNativeBridge!

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }

    override func viewDidLoad() {
        super.viewDidLoad()
        // 游戏背景色打底，避免启动白屏刺眼（#FFF6E5）
        view.backgroundColor = UIColor(red: 1.0, green: 0.965, blue: 0.898, alpha: 1.0)

        let content = WKUserContentController()
        bridge = HanziNativeBridge()
        // content 强持有 bridge；与 WebView 同生命周期，随页面一起释放
        content.add(bridge, name: HanziNativeBridge.messageName)
        content.addUserScript(bridge.userScript())

        let config = WKWebViewConfiguration()
        config.userContentController = content

        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.scrollView.bounces = false          // 游戏自己管理滚动，去掉橡皮筋
        webView.backgroundColor = view.backgroundColor
        webView.isOpaque = false
        view.addSubview(webView)
        bridge.attach(webView: webView)

        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
            // 允许读取 www 目录：页面内相对引用的 js/css 同目录可见
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        } else {
            print("[HanziKid] www/index.html 不存在：请先在 taro-app 执行 npm run sync:ios")
        }
    }
}
