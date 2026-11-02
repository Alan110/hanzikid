import { audio } from '@kit.AudioKit';
import { speechRecognizer } from '@kit.CoreSpeechKit';
import { abilityAccessCtrl, common, Permissions, PermissionRequestResult } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG: string = 'NativeVoice';
const BYTES_PER_MS: number = 32;      // 16000Hz × 2字节 × 1声道 ÷ 1000
const MAX_RECORD_MS: number = 6000;   // 录音上限 6 秒自动停
const ASR_CHUNK: number = 1280;       // writeAudio 仅接受 640/1280 字节分块
const ASR_CHUNK_INTERVAL: number = 40; // 1280B @16k 恰好 40ms
// 补静音必须大于 vadEnd：引擎要收到足够尾部静音才能把最后一句判为结束
const ASR_PAD_CHUNKS: number = 30;       // 1200ms（已裁剪首尾静音，够用）
const ASR_PAD_CHUNKS_RETRY: number = 40; // 1600ms（重试更保守）
const ASR_VAD_BEGIN: number = 3000;      // 前端点：等孩子开口
const ASR_VAD_END: number = 1000;        // 后端点：兼顾句中停顿
const ASR_VAD_BEGIN_RETRY: number = 2000;
const ASR_VAD_END_RETRY: number = 800;

/**
 * 原生语音原语：录音 / 回放 / 端侧识别（读一读玩法）。
 * 状态机与对错判定全在网页 game.js，本类只提供原语并通过 eventSink 回推事件：
 * mic{granted} / recStarted / recStopped{ms} / playbackDone / asrResult{text} / asrError{code}
 */
export class NativeVoice {
  private static context: common.UIAbilityContext | null = null;
  private static eventSink: ((type: string, json: string) => void) | null = null;
  private static micGranted: boolean = false;

  // 录音
  private static capturer: audio.AudioCapturer | null = null;
  private static recChunks: Array<Uint8Array> = [];
  private static recBytes: number = 0;
  private static recTimer: number = -1;
  private static recorded: Uint8Array = new Uint8Array(0);
  // 送识别用：裁掉首尾静音后的音频（回放仍用原始 recorded）
  private static asrPcm: Uint8Array = new Uint8Array(0);
  // 采集增益：设备麦克风偏小声，回放与送识别前统一做软件放大（按峰值自适应，避免爆音）
  private static pcmGain: number = 1;
  private static lastPeak: number = 0;

  // 回放
  private static renderer: audio.AudioRenderer | null = null;
  private static playPos: number = 0;
  private static playDrained: boolean = false;
  private static playStopTimer: number = -1;
  private static playFallbackTimer: number = -1;

  // 识别
  private static asrEngine: speechRecognizer.SpeechRecognitionEngine | null = null;
  private static asrCreating: boolean = false;
  private static asrSessionId: string = '';
  private static asrText: string = '';
  private static asrFeedPos: number = 0;
  private static asrPadSent: number = 0;
  private static asrPadTotal: number = ASR_PAD_CHUNKS;
  private static asrFeedTimer: number = -1;
  private static asrWatchTimer: number = -1;
  private static asrSeq: number = 0;
  private static asrWord: string = '';
  private static asrRetried: boolean = false;
  private static asrSessionDone: boolean = false;
  private static asrCancelled: boolean = false;
  // 喂流节奏诊断：目标发送时间戳 / 相邻两块的实测最大间隔
  private static asrNextAt: number = 0;
  private static asrLastFeedAt: number = 0;
  private static asrMaxGap: number = 0;
  private static asrFedChunks: number = 0;
  // writeAudio 的原生实现会异步引用传入缓冲：必须复制成独立 640B 块，
  // 且环形保留最近几块引用防止 GC 回收后原生侧悬垂（模拟器实测 SEGV）
  private static asrChunkRing: Array<Uint8Array | null> = [null, null, null, null, null, null, null, null];
  private static asrChunkRingIdx: number = 0;

  static init(context: common.UIAbilityContext): void {
    NativeVoice.context = context;
  }

  static setEventSink(sink: (type: string, json: string) => void): void {
    NativeVoice.eventSink = sink;
  }

  private static emit(type: string, json: string): void {
    if (NativeVoice.eventSink !== null) {
      NativeVoice.eventSink(type, json);
    }
  }

  /* ================= 麦克风权限 ================= */

  static ensureMic(): void {
    if (NativeVoice.micGranted) {
      NativeVoice.emit('mic', '{"granted":true}');
      return;
    }
    NativeVoice.requestMic();
  }

  private static requestMic(): void {
    if (NativeVoice.context === null) {
      NativeVoice.emit('mic', '{"granted":false}');
      return;
    }
    const atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    const perms: Array<Permissions> = ['ohos.permission.MICROPHONE'];
    atManager.requestPermissionsFromUser(NativeVoice.context, perms).then((res: PermissionRequestResult) => {
      let granted: boolean = false;
      if (res.authResults.length > 0 && res.authResults[0] === 0) {
        granted = true;
      }
      NativeVoice.micGranted = granted;
      NativeVoice.emit('mic', granted ? '{"granted":true}' : '{"granted":false}');
    }).catch((err: BusinessError) => {
      hilog.error(0x0000, TAG, 'requestMic failed, code=%{public}d msg=%{public}s', err.code, err.message);
      NativeVoice.emit('mic', '{"granted":false}');
    });
  }

  /* ================= 录音 ================= */

  static startRecord(): void {
    if (NativeVoice.capturer !== null) {
      return; // 已在录音
    }
    // 开始新录音前先停掉上一段回放，避免把扬声器声音录进去
    if (NativeVoice.renderer !== null) {
      NativeVoice.finishPlayback();
    }
    if (NativeVoice.micGranted) {
      NativeVoice.beginRecord();
      return;
    }
    // 未授权：先申请，通过后再录；被拒则回推 mic 事件
    if (NativeVoice.context === null) {
      NativeVoice.emit('mic', '{"granted":false}');
      return;
    }
    const atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    const perms: Array<Permissions> = ['ohos.permission.MICROPHONE'];
    atManager.requestPermissionsFromUser(NativeVoice.context, perms).then((res: PermissionRequestResult) => {
      if (res.authResults.length > 0 && res.authResults[0] === 0) {
        NativeVoice.micGranted = true;
        NativeVoice.beginRecord();
      } else {
        NativeVoice.emit('mic', '{"granted":false}');
      }
    }).catch((err: BusinessError) => {
      hilog.error(0x0000, TAG, 'startRecord requestMic failed, code=%{public}d msg=%{public}s', err.code, err.message);
      NativeVoice.emit('mic', '{"granted":false}');
    });
  }

  private static beginRecord(): void {
    const streamInfo: audio.AudioStreamInfo = {
      samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_16000,
      channels: audio.AudioChannel.CHANNEL_1,
      sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
      encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW
    };
    const capturerInfo: audio.AudioCapturerInfo = {
      source: audio.SourceType.SOURCE_TYPE_MIC, // 普通麦克风源：VOICE_RECOGNITION 在此机型上增益过低，ASR 听不清
      capturerFlags: 0
    };
    const options: audio.AudioCapturerOptions = {
      streamInfo: streamInfo,
      capturerInfo: capturerInfo
    };
    audio.createAudioCapturer(options).then((cap: audio.AudioCapturer) => {
      NativeVoice.recChunks = [];
      NativeVoice.recBytes = 0;
      cap.on('readData', (buffer: ArrayBuffer) => {
        // 回调内只做拷贝（返回后缓冲区会被系统复用），拼接/识别全部异步化
        NativeVoice.recChunks.push(new Uint8Array(buffer.slice(0)));
        NativeVoice.recBytes += buffer.byteLength;
      });
      cap.start().then(() => {
        NativeVoice.capturer = cap;
        NativeVoice.recTimer = setTimeout(() => NativeVoice.stopRecord(), MAX_RECORD_MS);
        hilog.info(0x0000, TAG, 'recorder started (auto stop in %{public}dms)', MAX_RECORD_MS);
        NativeVoice.emit('recStarted', '{}');
      }).catch((err: BusinessError) => {
        hilog.error(0x0000, TAG, 'capturer start failed, code=%{public}d msg=%{public}s', err.code, err.message);
        cap.release().catch((e: BusinessError) => {
          hilog.error(0x0000, TAG, 'capturer release failed, %{public}s', e.message);
        });
        NativeVoice.emit('recStopped', '{"ms":0}');
      });
    }).catch((err: BusinessError) => {
      hilog.error(0x0000, TAG, 'createAudioCapturer failed, code=%{public}d msg=%{public}s', err.code, err.message);
      NativeVoice.emit('recStopped', '{"ms":0}');
    });
  }

  static stopRecord(): void {
    if (NativeVoice.recTimer >= 0) {
      clearTimeout(NativeVoice.recTimer);
      NativeVoice.recTimer = -1;
    }
    const cap: audio.AudioCapturer | null = NativeVoice.capturer;
    if (cap === null) {
      NativeVoice.emit('recStopped', '{"ms":0}');
      return;
    }
    NativeVoice.capturer = null;
    cap.stop().then(() => {
      cap.off('readData');
      cap.release().catch((e: BusinessError) => {
        hilog.error(0x0000, TAG, 'capturer release failed, %{public}s', e.message);
      });
    }).catch((err: BusinessError) => {
      hilog.error(0x0000, TAG, 'capturer stop failed, code=%{public}d msg=%{public}s', err.code, err.message);
      cap.release().catch((e: BusinessError) => {
        hilog.error(0x0000, TAG, 'capturer release failed, %{public}s', e.message);
      });
    });
    // 拼接录音数据（≤6s 约 192KB，量不大）
    const merged: Uint8Array = new Uint8Array(NativeVoice.recBytes);
    let pos: number = 0;
    NativeVoice.recChunks.forEach((chunk: Uint8Array) => {
      merged.set(chunk, pos);
      pos += chunk.length;
    });
    NativeVoice.recorded = merged;
    const chunkCount: number = NativeVoice.recChunks.length;
    NativeVoice.recChunks = [];
    const ms: number = Math.floor(NativeVoice.recBytes / BYTES_PER_MS);
    // 采集电平诊断：峰值过低说明麦克风增益/音量有问题，ASR 会听不清
    let peak: number = 0;
    const view: DataView = new DataView(merged.buffer, merged.byteOffset, merged.byteLength);
    for (let i: number = 0; i + 1 < merged.length; i += 2) {
      const s: number = view.getInt16(i, true);
      const a: number = s < 0 ? -s : s;
      if (a > peak) {
        peak = a;
      }
    }
    hilog.info(0x0000, TAG, 'record stopped, %{public}d bytes (~%{public}dms), %{public}d chunks, peak=%{public}d',
      NativeVoice.recBytes, ms, chunkCount, peak);
    // 峰值过低时自适应放大（目标峰值 12000，最多 6 倍）；回放和识别共用
    let gain: number = 1;
    if (peak > 0 && peak < 12000) {
      gain = Math.round(Math.min(6, 12000 / peak) * 10) / 10;
    }
    NativeVoice.pcmGain = gain;
    NativeVoice.lastPeak = peak;
    // 裁掉首尾静音再送识别：缩短喂流时长（少等待），也减少环境噪声干扰
    NativeVoice.asrPcm = NativeVoice.trimSilence(merged, peak);
    hilog.info(0x0000, TAG, 'pcm gain=%{public}s, asr audio %{public}d/~%{public}dms',
      gain.toString(), Math.floor(NativeVoice.asrPcm.length / BYTES_PER_MS), ms);
    NativeVoice.emit('recStopped', `{"ms":${ms},"peak":${peak},"gain":${gain}}`);
  }

  // 按能量阈值裁剪首尾静音，两端各留 200ms 余量
  private static trimSilence(pcm: Uint8Array, peak: number): Uint8Array {
    const len: number = pcm.length;
    if (len < 3200) {
      return pcm;
    }
    const th: number = Math.max(300, Math.floor(peak * 0.12));
    const view: DataView = new DataView(pcm.buffer, pcm.byteOffset, len);
    let first: number = -1;
    let last: number = -1;
    for (let i: number = 0; i + 1 < len; i += 2) {
      const s: number = view.getInt16(i, true);
      const a: number = s < 0 ? -s : s;
      if (a >= th) {
        if (first < 0) {
          first = i;
        }
        last = i;
      }
    }
    if (first < 0 || last < first) {
      return pcm;
    }
    const margin: number = 6400; // 200ms
    let start: number = first - margin;
    if (start < 0) {
      start = 0;
    }
    start -= start % 2;
    let end: number = last + margin;
    if (end > len) {
      end = len;
    }
    end -= end % 2;
    if (end - start < 3200) {
      return pcm;
    }
    const out: Uint8Array = new Uint8Array(end - start);
    out.set(pcm.subarray(start, end));
    return out;
  }

  /* ================= 回放 ================= */

  static playRecording(): void {
    if (NativeVoice.renderer !== null) {
      return; // 已在播放
    }
    if (NativeVoice.recorded.length === 0) {
      NativeVoice.emit('playbackDone', '{}');
      return;
    }
    const streamInfo: audio.AudioStreamInfo = {
      samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_16000,
      channels: audio.AudioChannel.CHANNEL_1,
      sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
      encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW
    };
    const rendererInfo: audio.AudioRendererInfo = {
      usage: audio.StreamUsage.STREAM_USAGE_MUSIC,
      rendererFlags: 0
    };
    const options: audio.AudioRendererOptions = {
      streamInfo: streamInfo,
      rendererInfo: rendererInfo
    };
    audio.createAudioRenderer(options).then((ren: audio.AudioRenderer) => {
      NativeVoice.renderer = ren;
      NativeVoice.playPos = 0;
      NativeVoice.playDrained = false;
      ren.on('writeData', (buffer: ArrayBuffer): audio.AudioDataCallbackResult => NativeVoice.fillPlayback(buffer));
      ren.start().then(() => {
        hilog.info(0x0000, TAG, 'playback started, %{public}d bytes', NativeVoice.recorded.length);
      }).catch((err: BusinessError) => {
        hilog.error(0x0000, TAG, 'renderer start failed, code=%{public}d msg=%{public}s', err.code, err.message);
        NativeVoice.finishPlayback();
      });
      // 兜底：数据耗尽后若 writeData 不再被调（渲染缓冲过深），按时长兜底结束
      const ms: number = NativeVoice.recorded.length / BYTES_PER_MS;
      NativeVoice.playFallbackTimer = setTimeout(() => NativeVoice.finishPlayback(), ms + 1500);
    }).catch((err: BusinessError) => {
      hilog.error(0x0000, TAG, 'createAudioRenderer failed, code=%{public}d msg=%{public}s', err.code, err.message);
      NativeVoice.emit('playbackDone', '{}');
    });
  }

  // 按 pcmGain 复制一段 PCM 到目标缓冲（S16LE，越界削顶，不改变采样率）
  private static applyGain(src: Uint8Array, srcOff: number, dst: Uint8Array, dstOff: number, len: number): void {
    const samples: number = Math.floor(len / 2) * 2;
    const gain: number = NativeVoice.pcmGain;
    for (let i: number = 0; i < samples; i += 2) {
      const lo: number = src[srcOff + i];
      const hi: number = src[srcOff + i + 1];
      let s: number = (hi << 8) | lo;
      if (s >= 32768) {
        s -= 65536;
      }
      if (gain !== 1) {
        s = Math.round(s * gain);
        if (s > 32767) {
          s = 32767;
        } else if (s < -32768) {
          s = -32768;
        }
      }
      const out: number = s & 0xffff;
      dst[dstOff + i] = out & 0xff;
      dst[dstOff + i + 1] = (out >> 8) & 0xff;
    }
  }

  private static fillPlayback(buffer: ArrayBuffer): audio.AudioDataCallbackResult {
    if (NativeVoice.renderer === null) {
      return audio.AudioDataCallbackResult.INVALID;
    }
    const view: Uint8Array = new Uint8Array(buffer);
    const pcm: Uint8Array = NativeVoice.recorded;
    const pos: number = NativeVoice.playPos;
    const remain: number = pcm.length - pos;
    if (remain <= 0) {
      // 数据耗尽：稍等缓冲播完再停
      if (!NativeVoice.playDrained) {
        NativeVoice.playDrained = true;
        NativeVoice.schedulePlayStop();
      }
      return audio.AudioDataCallbackResult.INVALID;
    }
    const len: number = Math.min(remain, view.length);
    NativeVoice.applyGain(pcm, pos, view, 0, len);
    // 不足一帧的部分补静音，避免尾部杂音
    for (let i: number = len; i < view.length; i++) {
      view[i] = 0;
    }
    NativeVoice.playPos = pos + len;
    if (remain <= view.length && !NativeVoice.playDrained) {
      NativeVoice.playDrained = true;
      NativeVoice.schedulePlayStop();
    }
    return audio.AudioDataCallbackResult.VALID;
  }

  private static schedulePlayStop(): void {
    if (NativeVoice.playStopTimer >= 0) {
      return;
    }
    NativeVoice.playStopTimer = setTimeout(() => NativeVoice.finishPlayback(), 400);
  }

  private static finishPlayback(): void {
    if (NativeVoice.playStopTimer >= 0) {
      clearTimeout(NativeVoice.playStopTimer);
      NativeVoice.playStopTimer = -1;
    }
    if (NativeVoice.playFallbackTimer >= 0) {
      clearTimeout(NativeVoice.playFallbackTimer);
      NativeVoice.playFallbackTimer = -1;
    }
    const ren: audio.AudioRenderer | null = NativeVoice.renderer;
    NativeVoice.renderer = null;
    if (ren === null) {
      NativeVoice.emit('playbackDone', '{}');
      return;
    }
    ren.off('writeData');
    ren.stop().then(() => {
      ren.release().catch((e: BusinessError) => {
        hilog.error(0x0000, TAG, 'renderer release failed, %{public}s', e.message);
      });
    }).catch((err: BusinessError) => {
      hilog.error(0x0000, TAG, 'renderer stop failed, code=%{public}d msg=%{public}s', err.code, err.message);
      ren.release().catch((e: BusinessError) => {
        hilog.error(0x0000, TAG, 'renderer release failed, %{public}s', e.message);
      });
    });
    NativeVoice.emit('playbackDone', '{}');
  }

  /* ================= 端侧识别 ================= */

  static recognize(word: string): void {
    if (NativeVoice.recorded.length === 0) {
      NativeVoice.emit('asrResult', '{"text":""}');
      return;
    }
    hilog.info(0x0000, TAG, 'recognize start, %{public}d bytes, hotword=%{public}s',
      NativeVoice.recorded.length, word);
    NativeVoice.asrRetried = false;
    NativeVoice.asrCancelled = false;
    NativeVoice.asrWord = word;
    if (NativeVoice.asrEngine !== null) {
      NativeVoice.beginRecognize(word, false);
      return;
    }
    NativeVoice.createAsrEngine(word, false);
  }

  // 创建识别引擎；fallback=true 为重试路径（参数更保守）
  private static createAsrEngine(word: string, fallback: boolean): void {
    if (NativeVoice.asrCreating) {
      return;
    }
    NativeVoice.asrCreating = true;
    const extra: Record<string, Object> = { 'locate': 'CN', 'recognizerMode': 'short' };
    const params: speechRecognizer.CreateEngineParams = {
      language: 'zh-CN',
      online: 1, // 离线模式
      extraParams: extra
    };
    speechRecognizer.createEngine(params).then((engine: speechRecognizer.SpeechRecognitionEngine) => {
      NativeVoice.asrCreating = false;
      if (NativeVoice.asrCancelled) {
        try {
          engine.shutdown();
        } catch (err) {
          const e: BusinessError = err as BusinessError;
          hilog.error(0x0000, TAG, 'ASR shutdown failed, code=%{public}d msg=%{public}s', e.code, e.message);
        }
        return;
      }
      NativeVoice.asrEngine = engine;
      engine.setListener(NativeVoice.createAsrListener());
      NativeVoice.beginRecognize(word, fallback);
    }).catch((err: BusinessError) => {
      NativeVoice.asrCreating = false;
      hilog.error(0x0000, TAG, 'ASR createEngine failed, code=%{public}d msg=%{public}s', err.code, err.message);
      NativeVoice.emit('asrError', `{"code":${err.code}}`);
    });
  }

  // 识别结果为空时重建引擎重试一次，仍失败才回推空结果
  private static retryRecognize(): void {
    const engine: speechRecognizer.SpeechRecognitionEngine | null = NativeVoice.asrEngine;
    NativeVoice.asrEngine = null;
    NativeVoice.asrSessionId = '';
    if (engine !== null) {
      try {
        engine.shutdown();
      } catch (err) {
        const e: BusinessError = err as BusinessError;
        hilog.error(0x0000, TAG, 'ASR shutdown failed, code=%{public}d msg=%{public}s', e.code, e.message);
      }
    }
    hilog.info(0x0000, TAG, 'ASR empty result, retry once with fallback params');
    NativeVoice.createAsrEngine(NativeVoice.asrWord, true);
  }

  private static asrFeedBytes(): number {
    return NativeVoice.asrPcm.length > 0 ? NativeVoice.asrPcm.length : NativeVoice.recorded.length;
  }

  private static hasChinese(text: string): boolean {    for (let i: number = 0; i < text.length; i++) {
      const c: number = text.charCodeAt(i);
      if (c >= 0x4e00 && c <= 0x9fa5) {
        return true;
      }
    }
    return false;
  }

  private static createAsrListener(): speechRecognizer.RecognitionListener {
    const listener: speechRecognizer.RecognitionListener = {
      onStart: (sessionId: string, eventMessage: string): void => {
        if (sessionId === NativeVoice.asrSessionId) {
          hilog.info(0x0000, TAG, 'ASR session started, session=%{public}s', sessionId);
        }
      },
      onEvent: (sessionId: string, eventCode: number, eventMessage: string): void => {
        if (sessionId === NativeVoice.asrSessionId) {
          hilog.info(0x0000, TAG, 'ASR onEvent, code=%{public}d msg=%{public}s', eventCode, eventMessage);
        }
      },
      onResult: (sessionId: string, result: speechRecognizer.SpeechRecognitionResult): void => {
        if (sessionId === NativeVoice.asrSessionId) {
          hilog.info(0x0000, TAG, 'ASR onResult, final=%{public}s last=%{public}s text=%{public}s',
            result.isFinal ? 'true' : 'false', result.isLast ? 'true' : 'false', result.result);
          if (result.result !== '') {
            NativeVoice.asrText += result.result;
          }
        }
      },
      onComplete: (sessionId: string, eventMessage: string): void => {
        if (sessionId === NativeVoice.asrSessionId) {
          NativeVoice.asrSessionDone = true;
          NativeVoice.clearAsrTimers();
          const text: string = NativeVoice.asrText;
          hilog.info(0x0000, TAG, 'ASR complete, text=%{public}s', text);
          // 无汉字视为失败：峰值太低时重试也无意义，正常音量下重试一次（重建引擎 + 更保守参数）
          if (!NativeVoice.hasChinese(text) && !NativeVoice.asrRetried && NativeVoice.lastPeak >= 1200) {
            NativeVoice.asrRetried = true;
            NativeVoice.retryRecognize();
            return;
          }
          NativeVoice.emit('asrResult', `{"text":${JSON.stringify(text)}}`);
        }
      },
      onError: (sessionId: string, errorCode: number, errorMessage: string): void => {
        if (sessionId === NativeVoice.asrSessionId) {
          NativeVoice.asrSessionDone = true;
          NativeVoice.clearAsrTimers();
          hilog.error(0x0000, TAG, 'ASR onError, code=%{public}d msg=%{public}s', errorCode, errorMessage);
          NativeVoice.emit('asrError', `{"code":${errorCode}}`);
        }
      }
    };
    return listener;
  }

  private static beginRecognize(word: string, fallback: boolean): void {
    const engine: speechRecognizer.SpeechRecognitionEngine | null = NativeVoice.asrEngine;
    if (engine === null) {
      NativeVoice.emit('asrError', '{"code":-1}');
      return;
    }
    NativeVoice.cancelAsrSession();
    NativeVoice.asrSeq++;
    const sessionId: string = `hzk-asr-${Date.now()}-${NativeVoice.asrSeq}`;
    NativeVoice.asrSessionId = sessionId;
    NativeVoice.asrText = '';
    NativeVoice.asrSessionDone = false;
    NativeVoice.asrPadTotal = fallback ? ASR_PAD_CHUNKS_RETRY : ASR_PAD_CHUNKS;
    NativeVoice.asrPadSent = 0;
    NativeVoice.asrFedChunks = 0;
    NativeVoice.asrMaxGap = 0;
    NativeVoice.asrLastFeedAt = 0;
    // 会话热词 = 目标词语（每条 2~20 字，单词无效则不设）
    const lexicon: Array<string> = [];
    if (word.length >= 2 && word.length <= 20) {
      lexicon.push(word);
    }
    const vadBegin: number = fallback ? ASR_VAD_BEGIN_RETRY : ASR_VAD_BEGIN;
    const vadEnd: number = fallback ? ASR_VAD_END_RETRY : ASR_VAD_END;
    const recognizerOption: Record<string, Object> = { 'enablePartialResult': false };
    const extraParams: Record<string, Object> = {
      'recognitionMode': 1, // 写音频流模式
      'vadBegin': vadBegin,
      'vadEnd': vadEnd,
      'maxAudioDuration': 60000,
      'recognizerOption': recognizerOption,
      'sessionGeneralLexicon': lexicon
    };
    hilog.info(0x0000, TAG,
      'ASR sess=%{public}s fallback=%{public}s bytes=%{public}d ms=%{public}d peak=%{public}d gain=%{public}s vad=%{public}d/%{public}d pad=%{public}dms',
      sessionId, fallback ? 'true' : 'false', NativeVoice.asrFeedBytes(),
      Math.floor(NativeVoice.asrFeedBytes() / BYTES_PER_MS), NativeVoice.lastPeak,
      NativeVoice.pcmGain.toString(), vadBegin, vadEnd, NativeVoice.asrPadTotal * ASR_CHUNK_INTERVAL);
    const params: speechRecognizer.StartParams = {
      sessionId: sessionId,
      audioInfo: { audioType: 'pcm', sampleRate: 16000, soundChannel: 1, sampleBit: 16 },
      extraParams: extraParams
    };
    try {
      engine.startListening(params);
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      hilog.error(0x0000, TAG, 'startListening failed, code=%{public}d msg=%{public}s', e.code, e.message);
      NativeVoice.emit('asrError', `{"code":${e.code}}`);
      return;
    }
    // writeAudio 强制实时节奏：1280B / 40ms，按目标时间戳调度（慢于实时会累积欠喂）
    NativeVoice.asrFeedPos = 0;
    NativeVoice.asrNextAt = Date.now() + ASR_CHUNK_INTERVAL;
    NativeVoice.scheduleFeed(sessionId);
    const feedMs: number = NativeVoice.asrFeedBytes() / BYTES_PER_MS;
    const padMs: number = NativeVoice.asrPadTotal * ASR_CHUNK_INTERVAL;
    NativeVoice.asrWatchTimer = setTimeout(() => {
      hilog.warn(0x0000, TAG, 'ASR watchdog fired, session=%{public}s', sessionId);
      NativeVoice.cancelAsrSession();
      NativeVoice.emit('asrError', '{"code":-2}');
    }, feedMs + padMs + 10000);
  }

  private static scheduleFeed(sessionId: string): void {
    let delay: number = NativeVoice.asrNextAt - Date.now();
    if (delay < 0) {
      delay = 0; // 已落后：立即补发，尽快追平 40ms 节奏
    }
    NativeVoice.asrFeedTimer = setTimeout(() => NativeVoice.feedAsrChunk(sessionId), delay);
  }

  private static feedAsrChunk(sessionId: string): void {
    const engine: speechRecognizer.SpeechRecognitionEngine | null = NativeVoice.asrEngine;
    const pcm: Uint8Array = NativeVoice.asrPcm.length > 0 ? NativeVoice.asrPcm : NativeVoice.recorded;
    if (engine === null || sessionId !== NativeVoice.asrSessionId) {
      NativeVoice.clearAsrTimers();
      return;
    }
    if (NativeVoice.asrSessionDone) {
      NativeVoice.clearAsrTimers();
      return;
    }
    const now: number = Date.now();
    if (NativeVoice.asrLastFeedAt > 0) {
      const gap: number = now - NativeVoice.asrLastFeedAt;
      if (gap > NativeVoice.asrMaxGap) {
        NativeVoice.asrMaxGap = gap;
      }
    }
    const pos: number = NativeVoice.asrFeedPos;
    if (pos >= pcm.length) {
      // 补静音再 finish：引擎需要尾部静音（> vadEnd）才能把最后一句判为结束
      if (NativeVoice.asrPadSent < NativeVoice.asrPadTotal) {
        const silence: Uint8Array = new Uint8Array(ASR_CHUNK);
        NativeVoice.asrChunkRing[NativeVoice.asrChunkRingIdx] = silence;
        NativeVoice.asrChunkRingIdx = (NativeVoice.asrChunkRingIdx + 1) % NativeVoice.asrChunkRing.length;
        try {
          engine.writeAudio(sessionId, silence);
        } catch (err) {
          const e: BusinessError = err as BusinessError;
          hilog.error(0x0000, TAG, 'writeAudio pad failed, code=%{public}d msg=%{public}s', e.code, e.message);
          return;
        }
        NativeVoice.asrPadSent++;
        NativeVoice.asrLastFeedAt = now;
        NativeVoice.asrNextAt += ASR_CHUNK_INTERVAL;
        NativeVoice.scheduleFeed(sessionId);
        return;
      }
      if (NativeVoice.asrFeedTimer >= 0) {
        clearTimeout(NativeVoice.asrFeedTimer);
        NativeVoice.asrFeedTimer = -1;
      }
      hilog.info(0x0000, TAG, 'ASR feed done, fed=%{public}d pad=%{public}d maxGap=%{public}dms, finish session=%{public}s',
        NativeVoice.asrFedChunks, NativeVoice.asrPadSent, NativeVoice.asrMaxGap, sessionId);
      try {
        engine.finish(sessionId);
      } catch (err) {
        const e: BusinessError = err as BusinessError;
        hilog.error(0x0000, TAG, 'ASR finish failed, code=%{public}d msg=%{public}s', e.code, e.message);
        NativeVoice.cancelAsrSession();
        NativeVoice.emit('asrError', `{"code":${e.code}}`);
      }
      return;
    }
    const end: number = Math.min(pos + ASR_CHUNK, pcm.length);
    // 复制到独立 1280B 缓冲（byteOffset=0，尾块补零）：不用 subarray 视图，
    // 并入环形引用表防 GC —— writeAudio 原生侧异步引用传入缓冲，视图被回收会 SEGV
    const chunk: Uint8Array = new Uint8Array(ASR_CHUNK);
    NativeVoice.applyGain(pcm, pos, chunk, 0, end - pos);
    NativeVoice.asrChunkRing[NativeVoice.asrChunkRingIdx] = chunk;
    NativeVoice.asrChunkRingIdx = (NativeVoice.asrChunkRingIdx + 1) % NativeVoice.asrChunkRing.length;
    try {
      engine.writeAudio(sessionId, chunk);
    } catch (err) {
      const e: BusinessError = err as BusinessError;
      hilog.error(0x0000, TAG, 'writeAudio failed, code=%{public}d msg=%{public}s', e.code, e.message);
      NativeVoice.cancelAsrSession();
      NativeVoice.emit('asrError', `{"code":${e.code}}`);
      return;
    }
    NativeVoice.asrFeedPos = end;
    NativeVoice.asrFedChunks++;
    NativeVoice.asrLastFeedAt = now;
    NativeVoice.asrNextAt += ASR_CHUNK_INTERVAL;
    if (NativeVoice.asrFedChunks % 25 === 0) {
      hilog.info(0x0000, TAG, 'ASR feeding %{public}d/%{public}d bytes, session=%{public}s',
        end, pcm.length, sessionId);
    }
    NativeVoice.scheduleFeed(sessionId);
  }

  private static cancelAsrSession(): void {
    NativeVoice.clearAsrTimers();
    NativeVoice.asrSessionDone = true;
    const engine: speechRecognizer.SpeechRecognitionEngine | null = NativeVoice.asrEngine;
    if (engine !== null && NativeVoice.asrSessionId !== '') {
      try {
        engine.cancel(NativeVoice.asrSessionId);
      } catch (err) {
        const e: BusinessError = err as BusinessError;
        hilog.error(0x0000, TAG, 'ASR cancel failed, code=%{public}d msg=%{public}s', e.code, e.message);
      }
    }
    NativeVoice.asrSessionId = '';
    NativeVoice.asrText = '';
  }

  private static clearAsrTimers(): void {
    if (NativeVoice.asrFeedTimer >= 0) {
      clearTimeout(NativeVoice.asrFeedTimer);
      NativeVoice.asrFeedTimer = -1;
    }
    if (NativeVoice.asrWatchTimer >= 0) {
      clearTimeout(NativeVoice.asrWatchTimer);
      NativeVoice.asrWatchTimer = -1;
    }
  }

  /* ================= 全部取消（换题 / 回家） ================= */

  static cancelAll(): void {
    NativeVoice.asrCancelled = true;
    if (NativeVoice.capturer !== null) {
      NativeVoice.stopRecord();
    }
    if (NativeVoice.renderer !== null) {
      NativeVoice.finishPlayback();
    }
    NativeVoice.cancelAsrSession();
  }
}
