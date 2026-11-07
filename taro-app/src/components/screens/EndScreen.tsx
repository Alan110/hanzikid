/* 结算页：奖牌 + 本局星星 + 累计星星 + 新解锁成就庆祝 */
import { useEffect, useRef, useState } from 'react'
import { useGame, type RunResult } from '../../game/ctx'
import { END_GOOD, END_PERFECT } from '../../game/copy'
import { medalOf, RUN_MEDAL_ICON } from '../../game/awards'
import { SFX } from '../../services/sfx'
import { say } from '../../services/speech'
import { confetti } from '../ConfettiLayer'

interface Props {
  result: RunResult
  onAgain: () => void
  onHome: () => void
}

export default function EndScreen({ result, onAgain, onHome }: Props) {
  const { settings, awards } = useGame()
  const spoken = useRef(false)
  /** 星星数字滚动：从 0 滚到本局获得数 */
  const [shown, setShown] = useState(0)
  const end = (result.gold === result.total && result.total > 0
    ? END_PERFECT : END_GOOD)[Math.floor(Math.random() * 3)]
  const verb = result.mode === 'read' ? '读' : '答'

  useEffect(() => {
    if (spoken.current) return
    spoken.current = true
    confetti(result.medal === 'gold' ? 40 : 24)
    SFX.win()
    if (result.unlocked.length) {
      // 新成就奖牌解锁：加码庆祝
      setTimeout(() => { SFX.win(); confetti(30) }, 600)
    }
    const tail = result.mode === 'read'
      ? `你读对了${result.gold}个字！`
      : `你拿到了${result.gold}颗星星！`
    const parts: { t: string }[] = [{ t: end.s }, { t: tail }, { t: `本局加了${result.stars}颗小星星，一共有${awards.stars}颗啦！` }]
    if (result.unlocked.length) {
      const names = result.unlocked.map(id => (medalOf(id)?.name) || '').filter(Boolean).join('，')
      if (names) parts.push({ t: `恭喜解锁新奖牌：${names}！` })
    }
    say(parts, settings)
    // 星星滚动动画
    let n = 0
    const step = Math.max(1, Math.ceil(result.stars / 8))
    const timer = setInterval(() => {
      n += step
      if (n >= result.stars) {
        n = result.stars
        clearInterval(timer)
        bumpStarEnd()
      }
      setShown(n)
    }, 140)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** 滚动结束的收尾弹跳 */
  const bumpStarEnd = () => {
    const el = document.getElementById('endStarGain')
    if (el) {
      el.classList.remove('bump')
      setTimeout(() => el.classList.add('bump'), 20)
    }
  }

  return (
    <section className="screen active" id="screen-end">
      <div className="end-card">
        <div className="end-emoji">{end.e}</div>
        <h2 id="endTitle">{end.t}</h2>
        <div className="end-medal-row">
          <span className="end-medal" title="本局奖牌">{RUN_MEDAL_ICON[result.medal]}</span>
          <span className="end-star-gain" id="endStarGain">+{shown}⭐</span>
        </div>
        <div className="end-total">累计 {awards.stars} ⭐</div>
        <p id="endMsg">{'第一次就' + verb + '对 ' + result.gold + ' 个'}{result.silver ? `，帮助后${verb}对 ${result.silver} 个` : ''}</p>
        {result.unlocked.length > 0 && (
          <div className="end-new-medals">
            {result.unlocked.map(id => {
              const m = medalOf(id)
              return m ? <span key={id} className="new-medal">🎉 {m.icon} {m.name}</span> : null
            })}
          </div>
        )}
        <button className="big-btn primary" onClick={onAgain}>🔁 再来一次</button>
        <button className="big-btn" onClick={onHome}>🏠 回家</button>
      </div>
    </section>
  )
}
