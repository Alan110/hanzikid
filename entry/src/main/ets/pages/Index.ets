import { webview } from '@kit.ArkWeb';
import { textToSpeech } from '@kit.CoreSpeechKit';
import { BusinessError } from '@kit.BasicServicesKit';

/**
 * 原生朗读引擎（CoreSpeechKit）。
 * 游戏 index.html 里的 say() 只要检测到 window.HanziNative 就会走这里的 speak()。
 */
class NativeTTS {
  private static engine: textToSpeech.TextToSpeechEngine | null = null;
  private static pendingText: string = '';
  private static pendingRate: number = 1;
  private static seq: number = 0;

  static init(): void {
    if (NativeTTS.engine !== null) {
      return;
    }
    const extraParam: Record<string, Object> = {
      'style': 'interaction-broadcast',
      'locate': 'CN',
      'name': 'CoreSpeech'
    };
    const paramsInfo: textToSpeech.CreateEngineParams = {
      language: 'zh-CN',
      person: 13,   // 聆小珊女声，官方推荐音色
      online: 1,    // 离线模式，当前唯一支持的模式
      extraParams: extraParam
    };
    textToSpeech.createEngine(paramsInfo).then((data: textToSpeech.TextToSpeechEngine) => {
      NativeTTS.engine = data;
      const listener: textToSpeech.SpeakListener = {
        onStart(requestId: string, response: textToSpeech.StartResponse): void {
          console.info(`TTS onStart, requestId=${requestId}`);
        },
        onComplete(requestId: string, response: textToSpeech.CompleteResponse): void {
          console.info(`TTS onComplete, requestId=${requestId}`);
        },
        onStop(requestId: string, response: textToSpeech.StopResponse): void {
          console.info(`TTS onStop, requestId=${requestId}`);
        },
        onData(requestId: string, audio: ArrayBuffer, response: textToSpeech.SynthesisResponse): void {
        },
        onError(requestId: string, errorCode: number, errorMessage: string): void {
          console.error(`TTS onError, requestId=${requestId}, code=${errorCode}, msg=${errorMessage}`);
        }
      };
      data.setListener(listener);
      console.info('TTS engine ready');
      if (NativeTTS.pendingText !== '') {
        const text = NativeTTS.pendingText;
        const speakRate = NativeTTS.pendingRate;
        NativeTTS.pendingText = '';
        NativeTTS.speak(text, speakRate);
      }
    }).catch((err: BusinessError) => {
      // 引擎初始化失败不影响游戏运行，只是没有朗读（模拟器通常无 TTS 能力）
      console.error(`TTS init failed, code=${err.code}, msg=${err.message}`);
    });
  }

  static speak(text: string, rate: number): void {
    if (NativeTTS.engine === null) {
      // 引擎尚未就绪：暂存内容，init 成功后自动补播
      NativeTTS.pendingText = text;
      NativeTTS.pendingRate = rate;
      NativeTTS.init();
      return;
    }
    NativeTTS.stop();
    // 网页侧 rate：1.0 约为常速，游戏单字约 0.65（更慢）；
    // speed 参数的实测效果请在真机上微调（不同引擎版本量纲略有差异）
    const speed = Math.min(2.0, Math.max(0.5, rate));
    const extraParam: Record<string, Object> = {
      'queueMode': 0,
      'speed': speed,
      'volume': 2,
      'pitch': 1
    };
    const speakParams: textToSpeech.SpeakParams = {
      requestId: `${Date.now()}-${NativeTTS.seq++}`,
      extraParams: extraParam
    };
    try {
      NativeTTS.engine.speak(text, speakParams);
    } catch (err) {
      const e = err as BusinessError;
      console.error(`TTS speak failed, code=${e.code}, msg=${e.message}`);
    }
  }

  static stop(): void {
    if (NativeTTS.engine !== null) {
      NativeTTS.engine.stop();
    }
  }
}

/** 注入到网页里的 window.HanziNative 对象 */
class HanziNativeBridge {
  speak(text: string, rate: number): void {
    NativeTTS.speak(text, rate);
  }

  stop(): void {
    NativeTTS.stop();
  }
}

@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();

  aboutToAppear(): void {
    NativeTTS.init();
  }

  build() {
    Column() {
      Web({
        src: $rawfile('index.html'),
        controller: this.controller
      })
        .javaScriptProxy({
          object: new HanziNativeBridge(),
          name: 'HanziNative',
          methodList: ['speak', 'stop'],
          controller: this.controller
        })
        .domStorageAccess(true)   // 游戏进度存在 localStorage，必须开
        .javaScriptAccess(true)
        .fileAccess(true)
        .zoomAccess(false)
        .multiWindowAccess(false)
        .width('100%')
        .height('100%')
    }
    .width('100%')
    .height('100%')
  }
}
