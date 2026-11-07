/* 学一学（闯关流水线）：认字 → 找字 → 错字回炉，直到全部一次答对毕业。
 * 复用 LearnScreen / QuizScreen，本组件只做阶段编排与过场提示。 */
import { useEffect, useRef, useState } from 'react'
import { useGame } from '../../game/ctx'
import { groupName, poolOf, shuffle } from '../../game/util'
import type { HanziChar } from '../../game/data'
import { SFX } from '../../services/sfx'
import { say } from '../../services/speech'
import LearnScreen from './LearnScreen'
import QuizScreen from './QuizScreen'

interface Props {
  groupId: string
  onHome: () => void
  onFinish: (gold: number, silver: number, total: number, wrong?: HanziChar[], bestStreak?: number) => void
}

interface Notice {
  icon: string
  text: string
}

/** 过场提示停留时长：够念完一句短语 */
const NOTICE_MS = 1900

export default function FlowScreen({ groupId, onHome, onFinish }: Props) {
  const { settings } = useGame()
  /** 本批要学的字：字组太大时按题量上限随机抽一批，保证一轮认+考不会太长 */
  const [batch, setBatch] = useState<HanziChar[]>(() => {
    const pool = poolOf(groupId)
    return pool.length > settings.len ? shuffle(pool).slice(0, settings.len) : pool.slice()
  })
  const [phase, setPhase] = useState<'learn' | 'quiz'>('learn')
  /** 轮次：1 首轮，>1 回炉（标题与文案用） */
  const [round, setRound] = useState(1)
  const [notice, setNotice] = useState<Notice | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** 首轮闯关成绩：毕业结算只报第一轮，回炉不重复计分 */
  const firstRound = useRef<{ gold: number; silver: number } | null>(null)
  const totalRef = useRef(batch.length)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const showNotice = (icon: string, text: string, then: () => void) => {
    setNotice({ icon, text })
    say(text, settings)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => { setNotice(null); then() }, NOTICE_MS)
  }

  const handleQuizFinish = (gold: number, silver: number, _total: number, wrong?: HanziChar[], bestStreak?: number) => {
    if (!firstRound.current) firstRound.current = { gold, silver }
    if (wrong && wrong.length) {
      setBatch(wrong)
      showNotice('📖', `有 ${wrong.length} 个字，我们再学一遍`, () => {
        setRound(r => r + 1)
        setPhase('learn')
      })
    } else {
      const fr = firstRound.current!
      onFinish(fr.gold, fr.silver, totalRef.current, undefined, bestStreak)
    }
  }

  /* 阶段过场：大图标 + 一句话，告诉小孩接下来做什么（流程连贯的关键） */
  if (notice) {
    return (
      <section className="screen active" id="screen-flow-notice">
        <header className="topbar">
          <button className="icon-btn" aria-label="回家" onClick={() => { SFX.tap(); onHome() }}>🏠</button>
          <div className="top-title">🌱 学一学 · {groupName(groupId)}</div>
        </header>
        <div className="flow-notice">
          <div className="fn-icon">{notice.icon}</div>
          <div className="fn-text">{notice.text}</div>
        </div>
      </section>
    )
  }

  const batchKey = batch.map(c => c.c).join('')

  return phase === 'learn' ? (
    <LearnScreen
      key={'learn-' + round + '-' + batchKey}
      groupId={groupId}
      chars={batch}
      title={round === 1 ? `🌱 学一学 · ${groupName(groupId)}` : `📖 再认一认 · 剩 ${batch.length} 个字`}
      onHome={onHome}
      onDone={() => showNotice('🎯', '认完啦，来考考你！', () => setPhase('quiz'))}
    />
  ) : (
    <QuizScreen
      key={'quiz-' + round + '-' + batchKey}
      groupId={groupId}
      targets={batch}
      onHome={onHome}
      onFinish={handleQuizFinish}
    />
  )
}
