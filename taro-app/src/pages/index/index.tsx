/* 识字小乐园主页面：屏幕路由 + 游戏上下文 + 全局事件（对应原 index.html/game.js 骨架） */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GameCtx, type ModeKey, type RunResult, type ScreenKey } from '../../game/ctx'
import { applyRunResult, applyStars } from '../../game/awards'
import HomeScreen from '../../components/screens/HomeScreen'
import LearnScreen from '../../components/screens/LearnScreen'
import QuizScreen from '../../components/screens/QuizScreen'
import ReadScreen from '../../components/screens/ReadScreen'
import EndScreen from '../../components/screens/EndScreen'
import FlowScreen from '../../components/screens/FlowScreen'
import AwardsScreen from '../../components/screens/AwardsScreen'
import ParentModal from '../../components/ParentModal'
import ConfettiLayer from '../../components/ConfettiLayer'
import { EMPTY_AWARDS, loadAwards, loadLast, loadSettings, loadStats, saveAwards, saveSettings, saveStats, type Awards, type Settings, type Stats } from '../../services/store'
import Speech, { stopSpeak } from '../../services/speech'
import { unlockAudio } from '../../services/sfx'
import { native } from '../../services/native'
import './index.scss'

export default function Index() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [awards, setAwards] = useState<Awards>(() => loadAwards())
  const [screen, setScreen] = useState<ScreenKey>('home')
  const [mode, setMode] = useState<ModeKey>(() => (loadLast().mode as ModeKey) || 'learn')
  const [parentOpen, setParentOpen] = useState(false)
  const [runGroup, setRunGroup] = useState<string>('animals')
  const [result, setResult] = useState<RunResult | null>(null)
  /** 结算页「再来一次」回到刚才的玩法 */
  const lastRun = useRef<{ mode: ModeKey; id: string } | null>(null)

  const ctxValue = useMemo(() => ({
    settings,
    stats,
    awards,
    patchSettings: (patch: Partial<Settings>) => {
      setSettings(prev => {
        const next = Object.assign({}, prev, patch)
        saveSettings(next)
        return next
      })
    },
    bumpStat: (c: string, first: boolean) => {
      setStats(prev => {
        const st = prev[c] = prev[c] || { s: 0, f: 0, w: 0 }
        st.s++
        first ? st.f++ : st.w++
        saveStats(prev)
        return { ...prev }
      })
    },
    resetStats: () => {
      setStats({})
      saveStats({})
    },
    addStars: (n: number, m: string) => {
      const r = applyStars(awards, n, m)
      setAwards(r.next)
      saveAwards(r.next)
      return r.unlocked
    },
    resetAwards: () => {
      setAwards(EMPTY_AWARDS)
      saveAwards(EMPTY_AWARDS)
    },
    goto: (s: ScreenKey) => setScreen(s),
  }), [settings, stats, awards])

  const goHome = useCallback(() => {
    stopSpeak()
    if (native && native.voiceCancel) { try { native.voiceCancel() } catch (e) { /* 忽略 */ } }
    setScreen('home')
  }, [])

  const startRun = useCallback((m: ModeKey, group: string) => {
    setRunGroup(group)
    if (m === 'learn') {
      setScreen('learn')
    } else if (m === 'flow') {
      lastRun.current = { mode: m, id: group }
      setScreen('flow')
    } else if (m === 'read') {
      lastRun.current = { mode: m, id: group }
      setScreen('read')
    } else {
      lastRun.current = { mode: m, id: group }
      setScreen('quiz')
    }
  }, [])

  const onFinish = useCallback((m: 'quiz' | 'read' | 'flow') =>
    (gold: number, silver: number, total: number, _wrong?: unknown, bestStreak?: number) => {
      // 一局结束统一结算星星与奖牌（规则见 game/awards.ts）
      const r = applyRunResult(awards, m, gold, silver, total, bestStreak || 0)
      setAwards(r.next)
      saveAwards(r.next)
      setResult({ mode: m, total, gold, silver, stars: r.stars, medal: r.medal, unlocked: r.unlocked })
      setScreen('end')
    }, [awards])

  /* 首次触摸：解锁音频 & 语音（iOS 要求在用户手势内）；长按菜单屏蔽 */
  useEffect(() => {
    let unlocked = false
    const onDown = () => {
      if (unlocked) return
      unlocked = true
      unlockAudio()
      Speech.warm()
    }
    document.addEventListener('pointerdown', onDown, true)
    const onCtx = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', onCtx)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('contextmenu', onCtx)
    }
  }, [])

  /* Speech 初始化（浏览器人声列表） */
  useEffect(() => {
    Speech.init(settings, () => { /* 人声列表变化时由组件自行重渲染读取 */ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* 开发/测试入口：#learn / #quiz / #read 直接进入动物组 */
  useEffect(() => {
    const h = typeof location !== 'undefined' ? location.hash : ''
    if (h === '#learn') startRun('learn', 'animals')
    else if (h === '#quiz') startRun('quiz', 'animals')
    else if (h === '#read') startRun('read', 'animals')
    else if (h === '#flow') startRun('flow', 'animals')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GameCtx.Provider value={ctxValue}>
      <div className="page-root">
        {screen === 'home' && (
          <HomeScreen
            mode={mode}
            onModeChange={setMode}
            onStart={startRun}
            onParent={() => setParentOpen(true)}
          />
        )}
        {screen === 'learn' && (
          <LearnScreen groupId={runGroup} onHome={goHome} />
        )}
        {screen === 'flow' && (
          <FlowScreen groupId={runGroup} onHome={goHome} onFinish={onFinish('flow')} />
        )}
        {screen === 'quiz' && (
          <QuizScreen groupId={runGroup} onHome={goHome} onFinish={onFinish('quiz')} />
        )}
        {screen === 'read' && (
          <ReadScreen groupId={runGroup} onHome={goHome} onFinish={onFinish('read')} />
        )}
        {screen === 'end' && result && (
          <EndScreen
            result={result}
            onAgain={() => {
              const lr = lastRun.current
              if (!lr) { goHome(); return }
              startRun(lr.mode, lr.id)
            }}
            onHome={goHome}
          />
        )}
        {screen === 'awards' && (
          <AwardsScreen onHome={goHome} />
        )}
        <ParentModal open={parentOpen} onClose={() => setParentOpen(false)} />
        <ConfettiLayer />
      </div>
    </GameCtx.Provider>
  )
}
