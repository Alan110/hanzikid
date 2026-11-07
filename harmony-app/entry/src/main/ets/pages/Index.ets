import { webview } from '@kit.ArkWeb';
import { textToSpeech } from '@kit.CoreSpeechKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { NativeStore } from '../common/NativeStore';
import { NativeVoice } from '../common/NativeVoice';
import { NativePinyin } from '../common/NativePinyin';

/**
 * 原生朗读引擎（CoreSpeechKit）。
 * 游戏 game.js 里的 say() 只要检测到 window.HanziNative 就会走这里的 speak()。
 */
class NativeTTS {
  private static engine: textToSpeech.TextToSpeechEngine | null = null;
  private static pendingText: string = '';
  private static pendingRate: number = 1;
  private static pendingId: string = '';
  private static seq: number = 0;
  /** 原始事件回推（id + status 原样转发，匹配/语义判断全在网页侧） */
  private static eventSink: ((id: string, status: string) => void) | null = null;

  /** 网页侧注册 TTS 原始状态回推：status ∈ complete/error/stop，id 为网页 speak 时传入的播报 id */
  static setEventSink(sink: (id: string, status: string) => void): void {
    NativeTTS.eventSink = sink;
  }

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
          // 原样转发：过期/打断请求也带上 id，由网页侧按 id 判断取舍
          if (NativeTTS.eventSink) {
            NativeTTS.eventSink(requestId, 'complete');
          }
        },
        onStop(requestId: string, response: textToSpeech.StopResponse): void {
          console.info(`TTS onStop, requestId=${requestId}`);
          if (NativeTTS.eventSink) {
            NativeTTS.eventSink(requestId, 'stop');
          }
        },
        onData(requestId: string, audio: ArrayBuffer, response: textToSpeech.SynthesisResponse): void {
        },
        onError(requestId: string, errorCode: number, errorMessage: string): void {
          console.error(`TTS onError, requestId=${requestId}, code=${errorCode}, msg=${errorMessage}`);
          if (NativeTTS.eventSink) {
            NativeTTS.eventSink(requestId, 'error');
          }
        }
      };
      data.setListener(listener);
      console.info('TTS engine ready');
      if (NativeTTS.pendingText !== '') {
        const text = NativeTTS.pendingText;
        const speakRate = NativeTTS.pendingRate;
        const speakId = NativeTTS.pendingId;
        NativeTTS.pendingText = '';
        NativeTTS.speak(text, speakRate, speakId);
      }
    }).catch((err: BusinessError) => {
      // 引擎初始化失败不影响游戏运行，只是没有朗读（模拟器通常无 TTS 能力）
      console.error(`TTS init failed, code=${err.code}, msg=${err.message}`);
    });
  }

  static speak(text: string, rate: number, id: string): void {
    if (NativeTTS.engine === null) {
      // 引擎尚未就绪：暂存内容，init 成功后自动补播
      NativeTTS.pendingText = text;
      NativeTTS.pendingRate = rate;
      NativeTTS.pendingId = id;
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
      'pitch': 1.05   // 略微上扬，减少"念稿"的机械感（聆小珊为离线唯一中文音色）
    };
    // 播报 id 直接用网页传入的 id 当 requestId：引擎回调原样带回，原生不做任何匹配
    const requestId = id !== '' ? id : `${Date.now()}-${NativeTTS.seq++}`;
    const speakParams: textToSpeech.SpeakParams = {
      requestId: requestId,
      extraParams: extraParam
    };
    try {
      NativeTTS.engine.speak(text, speakParams);
    } catch (err) {
      const e = err as BusinessError;
      console.error(`TTS speak failed, code=${e.code}, msg=${e.message}`);
      if (NativeTTS.eventSink) {
        NativeTTS.eventSink(requestId, 'error');
      }
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
  /** 朗读：id 由网页生成（引擎回调原样带回，供网页按 id 匹配播报完成） */
  speak(text: string, rate: number, id: string): void {
    NativeTTS.speak(text, rate, id);
  }

  stop(): void {
    NativeTTS.stop();
  }

  /* ===== 通用 K-V 持久化：网页侧数据路由（stats/settings/awards/未来新类型） ===== */

  kvGet(key: string): string {
    return NativeStore.get(key);
  }

  kvSet(key: string, value: string): void {
    NativeStore.set(key, value);
  }

  /* ===== legacy 专用键（老版本数据迁移用：网页侧回退链 kvGet -> 以下方法 -> localStorage） ===== */

  getProgress(): string {
    return NativeStore.get('progress');
  }

  setProgress(json: string): void {
    NativeStore.set('progress', json);
  }

  getSettings(): string {
    return NativeStore.get('settings');
  }

  setSettings(json: string): void {
    NativeStore.set('settings', json);
  }

  /* ===== 读一读：语音原语（状态机在 game.js，结果经 __onVoiceEvent 回推） ===== */

  voiceEnsureMic(): void {
    NativeVoice.ensureMic();
  }

  voiceStartRecord(): void {
    NativeVoice.startRecord();
  }

  voiceStopRecord(): void {
    NativeVoice.stopRecord();
  }

  voicePlayRecording(): void {
    NativeVoice.playRecording();
  }

  voiceRecognize(word: string): void {
    NativeVoice.recognize(word);
  }

  voiceCancel(): void {
    NativeVoice.cancelAll();
  }

  /** 汉字转无音标拼音（读一读同音字容错判定用） */
  pinyinOf(text: string): string {
    return NativePinyin.toPinyin(text);
  }
}

@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();
  // 等 NativeStore 就绪后再加载网页：页面启动时的同步读取才能拿到缓存数据
  @State webReady: boolean = false;

  aboutToAppear(): void {
    NativeTTS.init();
    // TTS 播报状态回推到网页 window.__onSpeakDone(id, status)，id 原样透传
    NativeTTS.setEventSink((id: string, status: string) => {
      try {
        this.controller.runJavaScript(`window.__onSpeakDone && window.__onSpeakDone('${id}', '${status}')`);
      } catch (err) {
        const e = err as BusinessError;
        console.error(`tts event push failed, code=${e.code}, msg=${e.message}`);
      }
    });
    // 读一读：原生语音事件回推到网页 window.__onVoiceEvent(type, json)
    NativeVoice.setEventSink((type: string, json: string) => {
      try {
        this.controller.runJavaScript(`window.__onVoiceEvent('${type}', ${json})`);
      } catch (err) {
        const e: BusinessError = err as BusinessError;
        console.error(`voice event push failed, code=${e.code}, msg=${e.message}`);
      }
    });
    NativeStore.onReady(() => {
      this.webReady = true;
    });
  }

  build() {
    Column() {
      if (this.webReady) {
        Web({
          // Taro 跨端版产物（taro-app 执行 npm run build:h5 && npm run sync:harmony 同步到 web/）
          src: $rawfile('web/index.html'),
          controller: this.controller
        })
          .javaScriptProxy({
            object: new HanziNativeBridge(),
            name: 'HanziNative',
            methodList: ['speak', 'stop', 'kvGet', 'kvSet',
              'getProgress', 'setProgress', 'getSettings', 'setSettings',
              'voiceEnsureMic', 'voiceStartRecord', 'voiceStopRecord', 'voicePlayRecording', 'voiceRecognize', 'voiceCancel',
              'pinyinOf'],
            controller: this.controller
          })
          .domStorageAccess(true)   // 轻微 UI 状态（hzk_last）仍存 localStorage
          .javaScriptAccess(true)
          .fileAccess(true)
          .zoomAccess(false)
          .multiWindowAccess(false)
          .width('100%')
          .height('100%')
      }
    }
    .width('100%')
    .height('100%')
  }
}
