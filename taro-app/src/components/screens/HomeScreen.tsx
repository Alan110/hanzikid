/* 首页：玩法选择 + 字组选择（原样迁移 game.js renderHome / 事件绑定） */
import { useGame, type ModeKey } from '../../game/ctx'
import { ALL_CHARS, GROUPS } from '../../game/util'
import { isMastered, saveLast } from '../../services/store'
import { SFX } from '../../services/sfx'
import { say } from '../../services/speech'
import type { HanziChar } from '../../game/data'

interface Props {
  mode: ModeKey
  onModeChange: (mode: ModeKey) => void
  onStart: (mode: ModeKey, group: string) => void
  onParent: () => void
}

const MODES: { mode: ModeKey; icon: string; name: string; sub: string }[] = [
  { mode: 'learn', icon: '📖', name: '认一认', sub: '看字卡 · 听发音' },
  { mode: 'quiz', icon: '🎯', name: '找一找', sub: '听声音 · 找汉字' },
  { mode: 'read', icon: '🎤', name: '读一读', sub: '跟着读 · 录音评分' },
  { mode: 'flow', icon: '🌱', name: '学一学', sub: '先认字 · 再闯关' },
]

export default function HomeScreen({ mode, onModeChange, onStart, onParent }: Props) {
  const { settings, stats, awards, goto } = useGame()

  const renderGroup = (id: string, icon: string, name: string, color: string, pool: HanziChar[]) => {
    const mastered = pool.filter(ch => isMastered(stats, ch.c)).length
    return (
      <button
        key={id}
        className="group-card"
        style={{ borderColor: color, background: color + '22' }}
        onClick={() => {
          SFX.tap()
          saveLast({ mode, group: id })
          onStart(mode, id)
        }}
      >
        <span className="g-icon">{icon}</span>
        <b>{name}</b>
        <small>⭐ {mastered}/{pool.length}</small>
      </button>
    )
  }

  return (
    <section className="screen active" id="screen-home">
      <header className="topbar">
        <div className="logo">🐼 识字小乐园</div>
        <button className="star-chip" aria-label="我的小星星" title="我的小星星"
          onClick={() => { SFX.tap(); goto('awards') }}>⭐ {awards.stars}</button>
        <button className="icon-btn" aria-label="家长中心" onClick={() => { SFX.tap(); onParent() }}>⚙️</button>
      </header>
      <p className="subtitle">先选一个玩法，再挑一组汉字吧</p>
      <div className="modes">
        {MODES.map(m => (
          <button
            key={m.mode}
            className={'mode-card' + (mode === m.mode ? ' selected' : '')}
            onClick={() => {
              onModeChange(m.mode)
              SFX.tap()
              say(m.name, settings)
            }}
          >
            <span className="big">{m.icon}</span>{m.name}<small>{m.sub}</small>
          </button>
        ))}
      </div>
      <div className="group-scroll">
        <div className="group-grid">
          {renderGroup('all', '🌈', '全部混玩', '#8E7CC3', ALL_CHARS)}
          {GROUPS.map(g => renderGroup(g.id, g.icon, g.name, g.color, g.chars))}
        </div>
      </div>
    </section>
  )
}
