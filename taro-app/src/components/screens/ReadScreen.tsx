/* 读一读（出题 → 跟读录音 → 回放 → 端侧评测）：原样迁移 game.js 状态机。
 * 原生语音桥：录音/回放/识别原语都走 HanziNative，状态机与判定在这里。
 * 浏览器直接打开时桥不存在，整体走降级路径（纯听读跟读，不录音不评分）。 */
import { useEffect, useRef } from 'react'
import { useGame } from '../../game/ctx'
import type { HanziChar } from '../../game/data'
import { groupName, judgeRead, pickQuestions, poolOf } from '../../game/util'
import { CHEERS, READ_LEADS } from '../../game/copy'
import { native, onVoiceEvent, VOICE } from '../../services/native'
import { SFX } from '../../services/sfx'
import { rateOf, say, stopSpeak } from '../../services/speech'
import { confetti } from '../ConfettiLayer'
import { useBump, useForceUpdate, useLatest } from '../hooks'

interface Props {
  groupId: string
  onHome: () => void
  onFinish: (gold: number, silver: number, total: number) => void
}

type ReadPhase = 'idle' | 'waitRec' | 'recording' | 'processing' | 'feedback' | 'done'
type MicState = 'idle' | 'rec' | 'busy' | 'off'

interface ReadState {
  qs: { target: HanziChar }[]
  i: number
  gold: number
  silver: number
  tries: number
  advancing: boolean
  state: ReadPhase
  degraded: boolean
  playbackDone: boolean
  asrDone: boolean
  asrText: string | null
  asrFailed: boolean
  peak: number
  /* UI */
  bubble: { text: string; cls: string }
  mic: MicState
  feedback: boolean
}

export default function ReadScreen({ groupId, onHome, onFinish }: Props) {
  const { settings, patchSettings, bumpStat } = useGame()
  const upd = useForceUpdate()
  const sRef = useLatest(settings)
  const { cls: cardBump, bump: bumpCard } = useBump()
  const { cls: micBump, bump: bumpMic } = useBump()
  const guard = useRef<ReturnType<typeof setTimeout> | null>(null)

  const read = useRef<ReadState>(null as any)
  if (!read.current) {
    // 出题优先级复用找一找逻辑：优先没掌握的字，掺随机防雷同
    const pool = poolOf(groupId)
    const n = Math.min(settings.len, pool.length)
    read.current = {
      qs: pickQuestions(pool, n, {}).map(ch => ({ target: ch })),
      i: 0, gold: 0, silver: 0, tries: 0, advancing: false,
      state: 'idle', degraded: !VOICE,
      playbackDone: false, asrDone: false, asrText: null, asrFailed: false, peak: 0,
      bubble: { text: '', cls: '' }, mic: 'idle', feedback: false,
    }
  }

  const setReadGuard = (ms: number, fn: () => void) => {
    clearGuard()
    guard.current = setTimeout(fn, ms)
  }
  const clearGuard = () => {
    if (guard.current) { clearTimeout(guard.current); guard.current = null }
  }
  const voiceCancelAll = () => {
    if (VOICE && native!.voiceCancel) { try { native!.voiceCancel() } catch (e) { /* 忽略 */ } }
  }

  const setBubble = (text: string, cls = '') => {
    read.current.bubble = { text, cls }
  }

  const setMic = (state: MicState) => {
    read.current.mic = state
  }

  const askRead = () => {
    const r = read.current
    const q = r.qs[r.i]
    r.tries = 0
    r.advancing = false
    r.state = 'idle'
    r.playbackDone = false
    r.asrDone = false
    r.asrText = null
    r.asrFailed = false
    r.peak = 0
    r.feedback = false
    clearGuard()
    setMic(VOICE ? 'idle' : 'off')
    if (r.degraded) {
      // 降级跟读模式：出题就示范读音（无法评分，纯跟读练习）
      setBubble(VOICE ? '跟读模式：先听一听，再跟着读 👇' : '这台设备暂不支持录音，跟着读一遍吧 👆', 'hint')
      upd()
      sayReadDemo(q.target, true)
    } else {
      // 已确认决策：先让孩子自己读，引导语不含示范音
      const lead = READ_LEADS[Math.floor(Math.random() * READ_LEADS.length)]
      setBubble(lead, '')
      upd()
      say([{ t: lead, r: rateOf(sRef.current) }], sRef.current)
    }
  }

  const sayReadDemo = (it: HanziChar, withLead: boolean) => {
    const rate = rateOf(sRef.current)
    const parts: { t: string; r?: number }[] = withLead ? [{ t: '跟我读：', r: rate }] : []
    parts.push({ t: it.c, r: rate * 0.85 })
    if (it.w) parts.push({ t: it.w, r: rate * 0.95 })
    parts.push({ t: it.c, r: rate * 0.85 })
    say(parts, sRef.current)
  }

  const resetReadIdle = (msg?: string) => {
    read.current.state = 'idle'
    setMic(VOICE ? 'idle' : 'off')
    if (msg) { setBubble(msg, 'hint'); bumpMic() }
  }

  const onRecStopped = (ms: number) => {
    const r = read.current
    if (r.state !== 'recording' && r.state !== 'waitRec') return
    clearGuard()
    if (ms < 500) {
      // 太短多半是误触
      resetReadIdle('按一下就开始录啦，多读一会儿哦 👆')
      upd()
      return
    }
    r.state = 'processing'
    setMic('busy')
    setBubble('来听听你刚才读的 🔊', '')
    r.playbackDone = false
    r.asrDone = false
    r.asrText = null
    r.asrFailed = false
    native!.voicePlayRecording()
    if (!r.degraded) {
      // 回放与识别并行（writeAudio 是实时节奏，≈ 录音时长），体感零等待
      native!.voiceRecognize(r.qs[r.i].target.w || '')
      // 原生侧空结果会自动重试一次，兜底等待要覆盖两次识别
      setReadGuard(25000, () => {
        if (read.current.state === 'processing' && !read.current.asrDone) {
          read.current.asrFailed = true
          tryResolveRead()
        }
      })
    } else {
      // 跟读模式不评分：回放完就示范，兜底防 playbackDone 丢失
      setReadGuard(ms + 5000, () => {
        if (read.current.state === 'processing' && !read.current.playbackDone) {
          read.current.playbackDone = true
          tryResolveRead()
        }
      })
    }
    upd()
  }

  const tryResolveRead = () => {
    const r = read.current
    if (r.state !== 'processing') return
    if (!r.playbackDone) return   // 等回放播完再反馈，避免声音打架
    if (r.degraded || r.asrFailed) {
      if (!r.degraded) {
        // 首次发现设备无端侧 ASR（模拟器/老系统）：本局转跟读模式，不卡流程
        r.degraded = true
        setBubble('这台设备暂不支持自动评分，跟读一遍吧 💪', 'hint')
      }
      finishDegradedRead()
      return
    }
    if (!r.asrDone) return
    const verdict = judgeRead(r.asrText || '', r.qs[r.i].target)
    console.info('[read] asr=' + r.asrText + ' target=' + r.qs[r.i].target.c + ' verdict=' + verdict)
    upd()
    if (verdict === 'ok') readCorrect()
    else if (verdict === 'empty') {
      // 空结果多为收音太小或引擎没收尾，按采集峰值给不同提示，别让孩子以为设备坏了
      const low = !r.peak || r.peak < 1500
      const tip = low ? '声音有点小哦，靠近一点大声读 💪' : '没听清，再大声说一次 💪'
      resetReadIdle(tip)
      upd()
      say([{ t: tip, r: rateOf(sRef.current) }], sRef.current)
    } else readWrong()
  }

  const readCorrect = () => {
    const r = read.current
    const q = r.qs[r.i]
    r.state = 'done'
    clearGuard()
    setMic('busy')
    const first = r.tries === 0
    bumpStat(q.target.c, first)
    first ? r.gold++ : r.silver++
    const cheer = CHEERS[Math.floor(Math.random() * CHEERS.length)]
    setBubble(cheer.b, 'good')
    SFX.cheer()
    if (first) confetti(10)
    const rate = rateOf(sRef.current)
    // 夸奖说完再进下一题（播完回调 + 兜底超时双保险，nextReadQ 有 advancing 防重入）
    say([{ t: cheer.s }, { t: '这是「' + q.target.c + '」', r: rate * 0.95 }, { t: q.target.c, r: rate * 0.85 }], sRef.current, () => nextReadQ())
    upd()
    setReadGuard(4500, nextReadQ)
  }

  const showReadFeedback = (target: HanziChar) => {
    const r = read.current
    r.feedback = true
    upd()
    // TTS 示范标准音：“这是妈，妈妈的妈”
    const rate = rateOf(sRef.current)
    const parts: { t: string; r?: number }[] = [{ t: '这是', r: rate }, { t: target.c, r: rate * 0.8 }]
    if (target.w) parts.push({ t: target.w + '的' + target.c, r: rate * 0.9 })
    else parts.push({ t: target.c, r: rate * 0.75 })
    say(parts, sRef.current)
  }

  const readWrong = () => {
    const r = read.current
    r.state = 'feedback'
    setMic('off')
    SFX.wrong()
    setBubble('读得不太像哦，听一听标准读音吧 👇', 'bad')
    upd()
    showReadFeedback(r.qs[r.i].target)
  }

  /** 跟读模式收尾：不判对错，示范读音 + 再读/下一题 */
  const finishDegradedRead = () => {
    const r = read.current
    r.state = 'feedback'
    setMic('off')
    upd()
    showReadFeedback(r.qs[r.i].target)
  }

  const nextReadQ = () => {
    const r = read.current
    if (r.advancing) return
    r.advancing = true
    clearGuard()
    voiceCancelAll()
    r.i++
    if (r.i >= r.qs.length) {
      onFinish(r.gold, r.silver, r.qs.length)
    } else {
      askRead()
    }
  }

  const onMic = () => {
    const r = read.current
    if (!VOICE) return
    SFX.tap()
    if (r.state === 'idle') {
      // 开录前先停掉正在播的语音提示/示范，避免把平板扬声器的声音录进来
      try { native!.stop() } catch (e) { /* 忽略 */ }
      r.state = 'waitRec'
      native!.voiceStartRecord()
      // 保险：3 秒还没 recStarted 就复位（原生侧失败也会回推 recStopped{ms:0}）
      setReadGuard(3000, () => {
        if (read.current.state === 'waitRec') {
          resetReadIdle('没启动成功，再点一次试试 🎤')
          upd()
        }
      })
      upd()
    } else if (r.state === 'recording') {
      native!.voiceStopRecord()
    }
  }

  const onRetry = () => {
    const r = read.current
    SFX.tap()
    voiceCancelAll()
    clearGuard()
    r.tries++
    r.state = 'idle'
    r.feedback = false
    setMic(VOICE ? 'idle' : 'off')
    if (r.degraded) {
      setBubble(VOICE ? '再跟着读一遍吧 👇' : '这台设备暂不支持录音，跟着读一遍吧 👆', 'hint')
      upd()
      sayReadDemo(r.qs[r.i].target, true)
    } else {
      const lead = '再试一次，大声读出来吧'
      setBubble(lead, '')
      upd()
      say([{ t: lead, r: rateOf(sRef.current) }], sRef.current)
    }
  }

  /* ===== 原生语音事件入口（壳工程经 evaluateJavaScript 回推） ===== */
  useEffect(() => {
    onVoiceEvent((type, d) => {
      const r = read.current
      if (type === 'mic') {
        if (!d.granted) {
          r.state = 'idle'
          setMic('idle')
          setBubble('需要麦克风才能录你的声音哦 😢', 'bad')
          upd()
          setTimeout(() => { setBubble('请到「设置 → 隐私 → 权限 → 麦克风」打开它，再回来读吧', 'hint'); upd() }, 1800)
        }
      } else if (type === 'recStarted') {
        if (r.state === 'waitRec') {
          clearGuard()
          r.state = 'recording'
          setMic('rec')
          setBubble('正在听你读…… 🎤', '')
          upd()
          // 兜底：原生 6 秒自动停，9 秒还没收到 recStopped 必定异常，强制复位防按钮一直闪
          setReadGuard(9000, () => {
            if (read.current.state === 'recording') {
              native!.voiceStopRecord()
              resetReadIdle('好像卡住了，再点一次试试 🎤')
              upd()
            }
          })
        }
      } else if (type === 'recStopped') {
        r.peak = d.peak || 0
        onRecStopped(d.ms || 0)
      } else if (type === 'playbackDone') {
        r.playbackDone = true
        upd()
        tryResolveRead()
      } else if (type === 'asrResult') {
        r.asrDone = true
        r.asrText = d.text || ''
        upd()
        tryResolveRead()
      } else if (type === 'asrError') {
        r.asrDone = true
        r.asrFailed = true
        upd()
        tryResolveRead()
      }
    })

    // 首题出题
    askRead()

    // 切后台立即停录音/回放/识别，释放音频流；离开读一读同样全部取消
    const onVis = () => {
      if (document.hidden) {
        stopSpeak()
        voiceCancelAll()
        clearGuard()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      stopSpeak()
      voiceCancelAll()
      clearGuard()
      if (typeof window !== 'undefined') window.__onVoiceEvent = undefined
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const r = read.current
  const q = r.qs[r.i]
  const micLabel = r.mic === 'rec' ? '⏹️<small>停止</small>'
    : r.mic === 'busy' ? '⏳<small>评分中</small>'
    : r.mic === 'off' ? '🎤<small>暂不可用</small>'
    : '🎤<small>点我录音</small>'
  const showIcon = !!settings.readIcon

  return (
    <section className="screen active" id="screen-read">
      <header className="topbar">
        <button className="icon-btn" aria-label="回家" onClick={() => { SFX.tap(); onHome() }}>🏠</button>
        <div className="top-title">🎤 {groupName(groupId)}</div>
        <button
          className="icon-btn"
          aria-label={showIcon ? '隐藏图片提示' : '显示图片提示'}
          title="看图/藏图"
          onClick={() => { patchSettings({ readIcon: !showIcon }); SFX.tap(); bumpCard() }}
        >{showIcon ? '🙈' : '🖼️'}</button>
        <button className="icon-btn" aria-label="下一题" title="下一题" onClick={() => { SFX.tap(); nextReadQ() }}>⏭️</button>
        <div className="counter">{r.i + 1} / {r.qs.length}</div>
      </header>
      <div className="read-stage">
        {/* 出题后点字卡：只有跟读模式 / 纠正阶段才重播示范（正常流程先让孩子自己读，不剧透读音） */}
        <button
          className={'read-card kai ' + cardBump + (showIcon ? '' : ' no-icon')}
          id="readCard"
          onClick={() => {
            if (r.degraded || r.state === 'feedback') {
              SFX.tap()
              bumpCard()
              sayReadDemo(q.target, false)
            }
          }}
        >
          <div className={'fc-emoji' + (q.target.e.length > 2 ? ' small' : '')}>{q.target.e}</div>
          <div className="fc-char kai">{q.target.c}</div>
          <div className="fc-pinyin">{q.target.p}</div>
          <div className="fc-word">{q.target.w ? '词语 · ' + q.target.w : ''}</div>
          <div className="fc-tap-hint">🎤 大声读出这个字吧</div>
        </button>
      </div>
      <div className="bubble-row">
        <div className={'bubble ' + r.bubble.cls} id="readBubble">{r.bubble.text}</div>
      </div>
      <div className="read-actions">
        <button
          className={'mic-btn ' + micBump + (r.mic !== 'idle' ? ' ' + r.mic : '')}
          id="btnMic"
          disabled={r.mic === 'busy' || r.mic === 'off'}
          onClick={onMic}
          dangerouslySetInnerHTML={{ __html: micLabel }}
        />
      </div>
      <div className={'read-feedback' + (r.feedback ? '' : ' hidden')} id="readFeedback">
        <div className="rf-card">
          <div className="rf-head">这是它的读音 🔈</div>
          <div className={'rf-emoji' + (q.target.e.length > 2 ? ' small' : '')}>{q.target.e}</div>
          <div className="rf-char kai">{q.target.c}</div>
          <div className="rf-pinyin">{q.target.p}</div>
          <div className="rf-word kai">{q.target.w ? q.target.w : ''}</div>
          <div className="rf-btns">
            <button className="big-btn primary" onClick={onRetry}>🔁 再读一次</button>
            <button className="big-btn" onClick={() => { SFX.tap(); nextReadQ() }}>⏭️ 下一题</button>
          </div>
        </div>
      </div>
    </section>
  )
}
