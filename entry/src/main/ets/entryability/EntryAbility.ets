import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { NativeStore } from '../common/NativeStore';
import { NativeVoice } from '../common/NativeVoice';

const TAG: string = 'EntryAbility';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, TAG, '%{public}s', 'Ability onCreate');
    // 提前初始化原生存储：网页加载前就绪，进度/设置读写才能同步返回
    NativeStore.init(this.context);
    // 读一读玩法：语音原语（录音/回放/识别）需要的 UIAbility 上下文（权限申请用）
    NativeVoice.init(this.context);
  }

  onDestroy(): void {
    hilog.info(0x0000, TAG, '%{public}s', 'Ability onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    hilog.info(0x0000, TAG, '%{public}s', 'Ability onWindowStageCreate');
    // 沉浸式：隐藏系统栏，页面铺满整屏（先设全屏布局，系统栏开关才生效）
    windowStage.getMainWindow().then((win: window.Window) => {
      win.setWindowLayoutFullScreen(true).catch((err: BusinessError) => {
        hilog.error(0x0000, TAG, 'setWindowLayoutFullScreen failed: %{public}s', JSON.stringify(err));
      });
      win.setWindowSystemBarEnable([]).catch((err: BusinessError) => {
        hilog.error(0x0000, TAG, 'setWindowSystemBarEnable failed: %{public}s', JSON.stringify(err));
      });
      win.setWindowSystemBarProperties({
        statusBarColor: '#FFF6E5',
        statusBarContentColor: '#5b4632',
        navigationBarColor: '#FDE7F2',
        navigationBarContentColor: '#5b4632'
      }).catch((err: BusinessError) => {
        hilog.error(0x0000, TAG, 'setWindowSystemBarProperties failed: %{public}s', JSON.stringify(err));
      });
    }).catch((err: BusinessError) => {
      hilog.error(0x0000, TAG, 'getMainWindow failed: %{public}s', JSON.stringify(err));
    });
    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        hilog.error(0x0000, TAG, 'Failed to load content. Cause: %{public}s', JSON.stringify(err));
        return;
      }
      hilog.info(0x0000, TAG, 'Succeeded in loading content.');
    });
  }

  onWindowStageDestroy(): void {
    hilog.info(0x0000, TAG, '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground(): void {
    hilog.info(0x0000, TAG, '%{public}s', 'Ability onForeground');
  }

  onBackground(): void {
    hilog.info(0x0000, TAG, '%{public}s', 'Ability onBackground');
  }
}
