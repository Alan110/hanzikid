package com.alan.hanzikid

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * 识字小乐园 Android 壳：全屏 WebView 加载本地 Taro H5 产物。
 *
 * 页面来源：taro-app 执行 `npm run build:h5 && npm run sync:android`
 * 同步到 app/src/main/assets/www/（相对路径产物，file:// 直接可加载）。
 *
 * 原生能力经 window.HanziNative 桥注入（见 NativeBridge），协议与
 * taro-app/src/services/native/types.ts 完全一致。
 */
class MainActivity : Activity() {

    lateinit var webView: WebView
        private set

    private var bridge: NativeBridge? = null
    private var micCallback: ((Boolean) -> Unit)? = null

    companion object {
        private const val REQ_MIC = 101
        private const val START_URL = "file:///android_asset/www/index.html"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        bridge = NativeBridge(this)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true                    // 轻微 UI 状态（hzk_last）仍存 localStorage
            allowFileAccess = true
            loadsImagesAutomatically = true
            mediaPlaybackRequiresUserGesture = false    // TTS 回调后自动出题朗读，不受手势限制
            layoutAlgorithm = WebSettings.LayoutAlgorithm.TEXT_AUTOSIZING
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        }
        webView.setBackgroundColor(0xFFFFF6E5.toInt())
        webView.webViewClient = WebViewClient()         // 站内跳转留在 WebView 内
        webView.addJavascriptInterface(bridge, "HanziNative")

        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        setContentView(webView)
        webView.loadUrl(START_URL)
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) hideSystemBars()
    }

    /** 沉浸式全屏（孩子误触状态栏/导航条会退出全屏，重获焦点时再隐藏） */
    @Suppress("DEPRECATION")
    private fun hideSystemBars() {
        webView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION)
    }

    /** 录音权限申请（voiceEnsureMic 触发），结果经桥回推 mic{granted} 事件 */
    fun requestMic(callback: (Boolean) -> Unit) {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
            callback(true)
            return
        }
        micCallback = callback
        requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), REQ_MIC)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode != REQ_MIC) return
        val granted = grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED
        micCallback?.invoke(granted)
        micCallback = null
    }

    override fun onDestroy() {
        bridge?.shutdown()
        webView.destroy()
        super.onDestroy()
    }
}
