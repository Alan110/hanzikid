/* 结算页：原样迁移 game.js endQuiz/endRead */
import { useEffect, useRef } from 'react'
import { useGame, type RunResult } from '../../game/ctx'
import { END_GOOD, END_PERFECT } from '../../game/copy'
import { SFX } from '../../services/sfx'
import { say } from '../../services/speech'
import { confetti } from '../ConfettiLayer'

interface Props {
  result: RunResult
  onAgain: () => void
  onHome: () => void
}

export default function EndScreen({ result, onAgain, onHome }: Props) {
  const { settings } = useGame()
  const spoken = useRef(false)
  const end = (result.gold === result.total && result.total > 0
    ? END_PERFECT : END_GOOD)[Math.floor(Math.random() * 3)]
  const verb = result.mode === 'read' ? '读' : '答'

  useEffect(() => {
    if (spoken.current) return
    spoken.current = true
    confetti()
    SFX.win()
    const tail = result.mode === 'read' ? `你读对了${result.gold}个字！` : `你拿到了${result.gold}颗星星！`
    say([{ t: end.s }, { t: tail }], settings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="screen active" id="screen-end">
      <div className="end-card">
        <div className="end-emoji">{end.e}</div>
        <h2 id="endTitle">{end.t}</h2>
        <div className="end-stars">{'⭐'.repeat(result.gold)}{result.silver ? ' 🌟×' + result.silver : ''}</div>
        <p id="endMsg">{'第一次就' + verb + '对 ' + result.gold + ' 个'}{result.silver ? `，帮助后${verb}对 ${result.silver} 个` : ''}</p>
        <button className="big-btn primary" onClick={onAgain}>🔁 再来一次</button>
        <button className="big-btn" onClick={onHome}>🏠 回家</button>
      </div>
    </section>
  )
}
