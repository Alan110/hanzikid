import UIKit

/**
 * Scene 生命周期入口（iOS 27 SDK 起纯 AppDelegate window 生命周期会被拒绝启动）。
 * 单窗口全屏游戏：场景连接时创建 window，挂上 ViewController。
 */
final class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene,
               willConnectTo session: UISceneSession,
               options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = ViewController()
        window.makeKeyAndVisible()
        self.window = window
    }
}
