# 壳工程无混淆需求；@JavascriptInterface 方法由框架反射调用，
# 若未来开启混淆需保留：
# -keepclassmembers class com.alan.hanzikid.NativeBridge { @android.webkit.JavascriptInterface <methods>; }
