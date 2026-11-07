/* 认一认（字卡）：原样迁移 game.js 的 startLearn/renderLearn/speakCard
 *  翻完一整组字卡奖励 2 颗小星星（全局账本），鼓励完整浏览 */
import { useEffect, useState } from 'react'
import { useGame } from '../../game/ctx'
import { groupName, poolOf } from '../../game/util'
import type { HanziChar } from '../../game/data'
import type { Settings } from '../../services/store'
import { WRAP_CHEERS } from '../../game/copy'
import { SFX } from '../../services/sfx'
import { rateOf, say } from '../../services/speech'
import { confetti } from '../ConfettiLayer'
import { useBump } from '../hooks'

interface Props {
  groupId: string
  onHome: () => void
  /** 限定字卡列表（学一学流程用）；缺省用整个字组 */
  chars?: HanziChar[]
  /** 顶栏标题；缺省「📖 组名」 */
  title?: string
  /** 传入即线性模式：最后一张点 ✨ 回调（不循环）；缺省循环浏览 */
  onDone?: () => void
}

function speakCard(it: HanziChar, again: boolean, settings: Settings): void {
  const rate = rateOf(settings)
  const parts: ({ t: string; r?: number })[] = again ? [{ t: '这是', r: rate }] : []
  parts.push({ t: it.c, r: rate * 0.85 })
  if (it.w) parts.push({ t: it.w, r: rate * 0.95 })
  if (!again) parts.push({ t: it.c, r: rate * 0.85 })
  say(parts, settings)
}

export default function LearnScreen({ groupId, onHome, chars, title, onDone }: Props) {
  const { settings, patchSettings, addStars } = useGame()
  const [i, setI] = useState(0)
  const list = chars && chars.length ? chars : poolOf(groupId)
  const it = list[Math.min(i, list.length - 1)]
  const linear = !!onDone
  const last = i >= list.length - 1
  const { cls, bump } = useBump()
  // 认一认默认只看汉字认字，图片提示按需点开，避免「看图猜字」
  const showIcon = !!settings.learnIcon

  /** 翻完一整组（循环模式从末尾翻回首张）奖励 2 颗小星星 */
  const awardWrap = () => {
    const unlocked = addStars(2, 'learn')
    SFX.win()
    confetti(unlocked.length ? 30 : 15)
    bump()
    const cheer = WRAP_CHEERS[Math.floor(Math.random() * WRAP_CHEERS.length)]
    say(cheer, settings)
  }

  // 进入字卡自动朗读（对应原 renderLearn 里的 speakCard(it, false)）
  useEffect(() => {
    const t = setTimeout(() => speakCard(list[0], false, settings), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 切换字卡时自动朗读
  useEffect(() => {
    if (i === 0) return   // 首卡由挂载 effect 播放
    speakCard(it, false, settings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  return (
    <section className="screen active" id="screen-learn">
      <header className="topbar">
        <button className="icon-btn" aria-label="回家" onClick={() => { SFX.tap(); onHome() }}>🏠</button>
        <div className="top-title">{title || '📖 ' + groupName(groupId)}</div>
        <button
          className="icon-btn"
          aria-label={showIcon ? '隐藏图片提示' : '显示图片提示'}
          title="看图/藏图"
          onClick={() => { patchSettings({ learnIcon: !showIcon }); SFX.tap(); bump() }}
        >{showIcon ? '🙈' : '🖼️'}</button>
        <div className="counter">{i + 1} / {list.length}</div>
      </header>
      <div className="learn-stage">
        <button
          className="nav-btn"
          aria-label="上一个"
          style={linear && i === 0 ? { visibility: 'hidden' } : undefined}
          onClick={() => {
            SFX.tap()
            if (linear) { if (i > 0) setI(i - 1) } else setI((i - 1 + list.length) % list.length)
          }}
        >‹</button>
        <button
          className={'flash-card kai ' + cls + (showIcon ? '' : ' no-icon')}
          id="flashCard"
          onClick={() => { SFX.tap(); bump(); speakCard(it, true, settings) }}
        >
          <div className={'fc-emoji' + (it.e.length > 2 ? ' small' : '')}>{it.e}</div>
          <div className="fc-char kai">{it.c}</div>
          <div className="fc-pinyin">{it.p}</div>
          <div className="fc-word">{it.w ? '词语 · ' + it.w : ''}</div>
          <div className="fc-tap-hint">👆 点一点，再听一次</div>
        </button>
        <button
          className="nav-btn"
          aria-label={linear && last ? '去闯关' : '下一个'}
          style={linear && last ? { color: '#7ED957' } : undefined}
          onClick={() => {
            SFX.tap()
            if (linear) {
              if (last) onDone!()
              else setI(i + 1)
            } else if (last) {
              awardWrap()
              setI(0)
            } else {
              setI(i + 1)
            }
          }}
        >{linear && last ? '✨' : '›'}</button>
      </div>
    </section>
  )
}
