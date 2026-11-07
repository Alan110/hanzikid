/* 找一找（答题）：原样迁移 game.js 的 startQuiz/ask/renderOptions/answer/nextQ。
 * 状态机带链式定时器，采用 ref + 强制刷新的写法保持与原版一致的时序语义。 */
import { useEffect, useRef, type CSSProperties } from 'react'
import { useGame } from '../../game/ctx'
import type { HanziChar } from '../../game/data'
import { ALL_CHARS, poolOf, shuffle, pickQuestions } from '../../game/util'
import { CHEERS, ENCOURAGE, LEADS, OPT_COLORS, PROMPT_TAILS, WRONG_OPENERS, AGAIN_PROMPTS, STREAK_CHEERS } from '../../game/copy'
import { SFX } from '../../services/sfx'
import { rateOf, say } from '../../services/speech'
import { confetti } from '../ConfettiLayer'
import { useBump, useForceUpdate, useLatest } from '../hooks'

interface Props {
  groupId: string
  onHome: () => void
  onFinish: (gold: number, silver: number, total: number, wrong?: HanziChar[]) => void
  /** 限定出题字池（学一学流程用）：只考这些字；缺省按进度从字组抽题 */
  targets?: HanziChar[]
}

interface Opt {
  char: HanziChar
  color: string
  status: '' | 'correct' | 'wrong' | 'hint-glow'
  disabled: boolean
}

interface QuizState {
  qs: { target: HanziChar; opts: number }[]
  i: number
  gold: number
  silver: number
  attempts: number
  locked: boolean
  options: Opt[]
  bubble: { text: string; cls: string }
  mascot: string
  stars: number
  /** 连击：连续一次答对的次数，答错即清零 */
  streak: number
  /** 选项入场动画进行中：任意点按后置 false，入场 stagger 不影响答题反馈动画 */
  pop: boolean
  /** 每题结果：'' 未答 / gold 一次答对 / silver 帮助后答对 */
  dots: ('' | 'gold' | 'silver')[]
}

function buildOptions(groupId: string, target: HanziChar, optCount: number): Opt[] {
  let cand = shuffle(poolOf(groupId).filter(ch => ch.c !== target.c))
  if (cand.length < optCount - 1) {
    // 字组太小时从全部汉字里补足干扰项
    cand = cand.concat(shuffle(ALL_CHARS.filter(ch => ch.c !== target.c && !cand.some(d => d.c === ch.c))))
  }
  const opts = shuffle([target, ...cand.slice(0, optCount - 1)])
  return opts.map((o, idx) => ({ char: o, color: OPT_COLORS[idx % OPT_COLORS.length], status: '', disabled: false }))
}

function sayPrompt(target: HanziChar, settings: any): void {
  const rate = rateOf(settings)
  const lead = LEADS[Math.floor(Math.random() * LEADS.length)]
  const tail = PROMPT_TAILS[Math.floor(Math.random() * PROMPT_TAILS.length)]
  const parts: { t: string; r?: number }[] = [{ t: lead + '，', r: rate * 0.95 }]
  if (target.w) {
    // 词语点题 + 单字慢读：如「小猫的猫……猫」，比孤零零一个音节清楚得多
    parts.push({ t: target.w + '的' + target.c, r: rate * 0.85 })
    parts.push({ t: target.c, r: rate * 0.75 })
  } else {
    parts.push({ t: target.c, r: rate * 0.85 })
    parts.push({ t: target.c, r: rate * 0.75 })
  }
  // 口语化收尾问句：像聊天一样问"在哪里呀"，减少念稿感
  parts.push({ t: tail, r: rate * 0.95 })
  say(parts, settings)
}

export default function QuizScreen({ groupId, onHome, onFinish, targets }: Props) {
  const { settings, patchSettings, bumpStat } = useGame()
  const upd = useForceUpdate()
  const sRef = useLatest(settings)
  const { cls: starBump, bump: bumpStar } = useBump()
  const { cls: mascotBump, bump: bumpMascot } = useBump()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const quiz = useRef<QuizState>(null as any)
  if (!quiz.current) {
    // 对应原 startQuiz：前 2 题二选热身，其余四选；学一学流程只考刚认过的字
    let qs: { target: HanziChar; opts: number }[]
    if (targets && targets.length) {
      // 单字回炉时直接四选，二选太容易蒙对
      qs = shuffle(targets).map((ch, idx) => ({ target: ch, opts: targets.length === 1 ? 4 : (idx < 2 ? 2 : 4) }))
    } else {
      const pool = poolOf(groupId)
      const n = Math.min(settings.len, pool.length)
      qs = pickQuestions(pool, n, {}).map((ch, idx) => ({ target: ch, opts: idx < 2 ? 2 : 4 }))
    }
    quiz.current = {
      qs, i: 0, gold: 0, silver: 0, attempts: 0, locked: false,
      options: [], bubble: { text: '听一听，找出来 👇', cls: '' }, mascot: '🐼', stars: 0, streak: 0, pop: true,
      dots: qs.map(() => '' as const),
    }
  }

  /** 误触保护：上一次有效点按后的一小段时间内忽略新的点按（小孩容易连点） */
  const cooldownRef = useRef(0)
  const COOLDOWN_MS = 400
  /** 答错反馈播报期间的锁定时长：读"答错了+误选字读音"时忽略点按 */
  const WRONG_FEEDBACK_MS = 1200

  const ask = () => {
    const q = quiz.current
    q.attempts = 0
    q.locked = false
    q.pop = true
    q.bubble = { text: '听一听，找出来 👇', cls: '' }
    q.mascot = '🐼'
    q.options = buildOptions(groupId, q.qs[q.i].target, q.qs[q.i].opts)
    upd()
    timerRef.current = setTimeout(() => sayPrompt(q.qs[q.i].target, sRef.current), 250)
  }

  // 挂载即出第一题
  useEffect(() => {
    ask()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nextQ = () => {
    const q = quiz.current
    q.i++
    if (q.i >= q.qs.length) {
      // 没能一次答对的字（帮助后对/跳过）回传给学一学流程回炉
      const wrong = q.qs.filter((qq, idx) => q.dots[idx] !== 'gold').map(qq => qq.target)
      onFinish(q.gold, q.silver, q.qs.length, wrong.length ? wrong : undefined)
    } else {
      ask()
    }
  }

  const answer = (opt: Opt) => {
    const q = quiz.current
    const now = Date.now()
    if (q.locked || opt.disabled || now < cooldownRef.current) return
    q.pop = false
    cooldownRef.current = now + COOLDOWN_MS
    const target = q.qs[q.i].target
    const rate = rateOf(sRef.current)
    if (opt.char.c === target.c) {
      q.locked = true
      opt.status = 'correct'
      const first = q.attempts === 0
      bumpStat(target.c, first)
      first ? q.gold++ : q.silver++
      q.dots[q.i] = first ? 'gold' : 'silver'
      q.stars = q.gold
      const streakCheer = first ? STREAK_CHEERS[q.streak + 1] : undefined
      if (first) q.streak++
      else q.streak = 0   // 帮助后答对不算"连续一次答对"
      const cheer = streakCheer ?? CHEERS[Math.floor(Math.random() * CHEERS.length)]
      q.mascot = cheer.m
      q.bubble = { text: q.streak >= 2 ? cheer.b + ` 🔥x${q.streak}` : cheer.b, cls: 'good' }
      bumpStar()
      bumpMascot()
      if (streakCheer) {
        SFX.win()
        confetti(20)
      } else {
        SFX.cheer()
        if (first) confetti(10)
      }
      const parts: { t: string; r?: number }[] = [{ t: cheer.s }]
      parts.push({ t: '这是「' + target.c + '」', r: rate * 0.95 }, { t: target.c, r: rate * 0.85 })
      say(parts, sRef.current)
      upd()
      timerRef.current = setTimeout(nextQ, streakCheer ? 2600 : 2000)
    } else {
      q.attempts++
      q.streak = 0
      opt.status = 'wrong'
      opt.disabled = true
      SFX.wrong()
      const opener = WRONG_OPENERS[Math.floor(Math.random() * WRONG_OPENERS.length)]
      const again = AGAIN_PROMPTS[Math.floor(Math.random() * AGAIN_PROMPTS.length)]
      if (q.attempts >= 3) {
        // 连错 3 次：高亮正确答案，点了就过，不卡住
        q.bubble = { text: '别急，它在这里 ✨ 点点它！', cls: 'hint' }
        q.mascot = '🤗'
        q.options.forEach(o => {
          if (o.char.c !== target.c) o.disabled = true
          else o.status = 'hint-glow'
        })
        say([{ t: opener }, { t: '别急，它在这里' }, { t: target.c, r: rate * 0.85 }], sRef.current)
      } else {
        // 直接说答错了，并读出误选字的读音，再引导继续找
        const w = opt.char
        q.mascot = '🤔'
        const enc = ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]
        q.bubble = { text: w.w ? `「${w.c}」是${w.w}哦，再找找 💪` : `「${w.c}」不对哦，${enc} 💪`, cls: 'bad' }
        const parts: { t: string; r?: number }[] = [{ t: opener, r: rate * 0.95 }]
        // 读出误选字：如「这个字念『马』，小马的马」
        if (w.w) {
          parts.push({ t: '这个字念「' + w.c + '」，' + w.w + '的' + w.c, r: rate * 0.85 })
        } else {
          parts.push({ t: '这个字念「' + w.c + '」', r: rate * 0.85 })
        }
        // 提醒目标并让小孩继续找
        if (target.w) {
          parts.push({ t: '我们要找的是「' + target.w + '的' + target.c + '」哦，' + again, r: rate * 0.95 })
        } else {
          parts.push({ t: '我们要找的是「' + target.c + '」哦，' + again, r: rate * 0.95 })
        }
        say(parts, sRef.current)
        // 反馈播报期间忽略点按，防止小孩连续误触
        cooldownRef.current = now + WRONG_FEEDBACK_MS
      }
      bumpMascot()
      upd()
    }
  }

  const q = quiz.current
  const cur = q.qs[q.i]
  // 图片 span 始终渲染，由 hints 只切显隐：切换时汉字、顺序、答题状态都不变
  const hints = settings.hints

  return (
    <section className="screen active" id="screen-quiz">
      <header className="topbar">
        <button className="icon-btn" aria-label="回家" onClick={() => { SFX.tap(); onHome() }}>🏠</button>
        <div className={'mascot ' + mascotBump} id="mascot">{q.mascot}</div>
        <button
          className="icon-btn"
          aria-label={hints ? '隐藏图片提示' : '显示图片提示'}
          title="看图提示开/关"
          onClick={() => { patchSettings({ hints: !hints }); SFX.tap() }}
        >{hints ? '🙈' : '🖼️'}</button>
        <button className="icon-btn" aria-label="下一题" title="下一题"
          onClick={() => { if (!q.locked) { SFX.tap(); if (timerRef.current) clearTimeout(timerRef.current); nextQ() } }}>⏭️</button>
        <div className={'star-count ' + starBump} id="starCount">⭐ {q.stars}</div>
        {q.streak >= 2 && <div className="streak-badge">🔥x{q.streak}</div>}
      </header>
      <div className="bubble-row">
        <div className={'bubble ' + q.bubble.cls} id="bubbleText">{q.bubble.text}</div>
        <button className="replay-btn" onClick={() => { SFX.tap(); sayPrompt(cur.target, sRef.current) }}>
          🔊<small>再听一遍</small>
        </button>
      </div>
      <div className="dots">
        {q.qs.map((_, idx) => (
          <span key={idx} className={'dot' + (q.dots[idx] ? ' ' + q.dots[idx] : '') + (idx === q.i ? ' cur' : '')} />
        ))}
      </div>
      <div className="options" id="options">
        {q.options.map((o, idx) => (
          <button
            key={`${q.i}-${idx}`}
            className={'opt ' + (q.pop ? 'pop ' : '') + o.status + (hints ? ' with-emoji' : '')}
            style={{ borderColor: o.color, '--d': `${idx * 70}ms` } as CSSProperties}
            disabled={o.disabled}
            onClick={() => answer(o)}
          >
            <span className={'opt-emoji' + (o.char.e.length > 2 ? ' small' : '')} style={{ display: hints ? '' : 'none' }}>{o.char.e}</span>
            <span className="opt-char kai">{o.char.c}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
