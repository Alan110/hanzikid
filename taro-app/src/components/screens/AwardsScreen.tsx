/* 我的小星星：累计星星 + 各模式统计 + 成就奖牌墙（从首页顶栏星星进入） */
import { useGame } from '../../game/ctx'
import { ACHIEVEMENTS } from '../../game/awards'
import { SFX } from '../../services/sfx'

interface Props {
  onHome: () => void
}

const MODE_STATS: { mode: string; icon: string; name: string }[] = [
  { mode: 'learn', icon: '📖', name: '认一认' },
  { mode: 'quiz', icon: '🎯', name: '找一找' },
  { mode: 'read', icon: '🎤', name: '读一读' },
  { mode: 'flow', icon: '🌱', name: '学一学' },
]

export default function AwardsScreen({ onHome }: Props) {
  const { awards } = useGame()

  return (
    <section className="screen active" id="screen-awards">
      <header className="topbar">
        <button className="icon-btn" aria-label="回家" onClick={() => { SFX.tap(); onHome() }}>🏠</button>
        <div className="top-title">🏅 我的小星星</div>
        <div className="counter">🥇 {awards.medals.length}</div>
      </header>
      <div className="awards-scroll">
        <div className="awards-total">
          <div className="at-star">⭐</div>
          <div className="at-num">{awards.stars}</div>
          <div className="at-label">颗小星星</div>
        </div>
        <div className="awards-modes">
          {MODE_STATS.map(m => (
            <div key={m.mode} className="am-item">
              <span className="am-icon">{m.icon}</span>
              <span className="am-name">{m.name}</span>
              <span className="am-stars">⭐ {awards.byMode[m.mode] || 0}</span>
            </div>
          ))}
        </div>
        <div className="awards-records">
          <span>🔥 最高连击 x{awards.bestStreak}</span>
          <span>🏆 全对 {awards.perfectRuns} 次</span>
        </div>
        <div className="medal-grid">
          {ACHIEVEMENTS.map(m => {
            const got = awards.medals.indexOf(m.id) >= 0
            return (
              <div key={m.id} className={'medal-card' + (got ? ' got' : '')}>
                <span className="m-icon">{got ? m.icon : '🔒'}</span>
                <b>{m.name}</b>
                <small>{m.desc}</small>
              </div>
            )
          })}
        </div>
        <p className="pg-tip" style={{ textAlign: 'center', padding: '4px 0 12px' }}>
          一次答对 +1⭐，连击和全对还有额外奖励，攒满小星星就能解锁奖牌哦！
        </p>
      </div>
    </section>
  )
}
