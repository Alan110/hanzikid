# 把「识字小乐园」装进原生鸿蒙平板

这是一个 DevEco Studio 工程：用 ArkTS 的 Web 容器加载游戏 `index.html`（打包在
`entry/src/main/resources/rawfile/` 里），装到平板后**完全离线**、有独立桌面图标，
朗读优先用系统 `speechSynthesis`，若 ArkWeb 内核不支持则**自动切换到鸿蒙原生
朗读引擎（CoreSpeechKit）**——游戏网页里已内置检测逻辑，无需配置。

## 打包安装步骤（Windows 电脑 + 鸿蒙平板）

1. **装 DevEco Studio 5.0 及以上**（自带 HarmonyOS NEXT / API 12+ SDK）：
   https://developer.huawei.com/consumer/cn/deveco-studio/
2. 用 DevEco Studio 打开本目录（`harmony-app/`），等 Sync / 索引完成。
   如果提示 SDK 版本不一致，点 **Sync** 或在设置里选已装的 API 12+ SDK 即可。
3. **平板开开发者模式**：设置 → 关于平板 → 连点「版本号」7 次；然后
   设置 → 系统和更新 → 开发者选项 → 打开「USB 调试」。
4. USB 连接平板，平板上弹窗选「允许调试」（文件传输模式）。
5. **自动签名**（一次性）：DevEco Studio → File → Project Structure →
   Signing Configs → 勾选 **Automatically generate signature** → 登录华为账号
   （个人开发者账号即可，免费注册）→ OK。
6. 顶部设备栏选中你的平板 → 点 **Run ▶**。构建完成后 App 自动安装并打开，
   桌面出现橙色「识字小乐园」图标。

> 自用安装 debug 签名的 HAP 就够了；如果想给别人装，用 Build → Build App(s)/Hap(s)
> 生成 signed HAP，对端在开发者选项里"安装外部来源应用"允许后即可安装。

## 更新游戏内容

游戏本体只有根目录的 `../index.html`。改完后：

```bash
./sync-game.sh     # 把最新 index.html 拷进 rawfile
```

再在 DevEco Studio 里 Run 一次即可。

## 工程结构

```
AppScope/                     应用级配置（包名 com.alan.hanzikid、图标、名称）
entry/
  src/main/ets/pages/Index.ets        Web 容器 + HanziNative 朗读桥
  src/main/ets/entryability/          标准 EntryAbility
  src/main/resources/rawfile/index.html   ← 游戏本体（sync-game.sh 同步）
  src/main/module.json5               模块清单（phone/tablet/2in1）
```

## 已知注意事项

- 我（AI）在本机无法编译 ArkTS，工程按 API 12 官方模板编写；若个别 API 签名
  有出入（最可能是 TTS 的 speed 参数量纲），DevEco 会有红线提示，按提示微调即可。
- 若装上后没有声音：先确认平板 设置 → 辅助功能/系统 里 TTS 引擎可用；
  游戏内 ⚙️ 家长中心会显示「正在使用鸿蒙系统原生朗读」。
