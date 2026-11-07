/* 游戏纯逻辑工具（原样迁移 game.js：出题、拼音同音容错判定） */
import { HANZI_DATA, type HanziChar } from './data'
import { native } from '../services/native'
import type { Stats } from '../services/store'

export const GROUPS = HANZI_DATA.groups
export const ALL_CHARS: HanziChar[] = GROUPS.flatMap(g => g.chars)

export function shuffle<T>(a: T[]): T[] {
  const r = a.slice()
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

export const poolOf = (id: string): HanziChar[] =>
  (id === 'all' ? ALL_CHARS : (GROUPS.find(g => g.id === id) || GROUPS[0]).chars)

export const groupName = (id: string): string =>
  (id === 'all' ? '全部汉字' : GROUPS.find(g => g.id === id)!.name)

/* ================= 读一读判定：声调宽容 + 同音字容错 ================= */

// 声调宽容：拼音去声调建同音索引，孩子说 mǎ 识别成「马」也算读对
const TONE_MAP: Record<string, string> = {
  'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
  'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
  'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
  'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
  'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
  'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v', 'ü': 'v',
}

export const stripTone = (p: string): string =>
  (p || '').toLowerCase().replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, m => TONE_MAP[m])

const PIN_INDEX: Record<string, string[]> = {}
ALL_CHARS.forEach(ch => {
  const k = stripTone(ch.p)
  if (!k) return
  ;(PIN_INDEX[k] = PIN_INDEX[k] || []).push(ch.c)
})

/** 判定：识别文本含目标字 / 目标词语 / 同音字（去声调）任一即读对。
 *  同音判定优先走原生音译（任意同音字都算对），再退回字库内的同音字表 */
export function judgeRead(text: string, target: HanziChar): 'ok' | 'empty' | 'no' {
  const norm = String(text || '').replace(/[^一-龥]/g, '')
  if (!norm) return 'empty'
  if (norm.includes(target.c)) return 'ok'
  if (target.w && norm.includes(target.w)) return 'ok'
  const py = stripTone(target.p)
  if (!py) return 'no'
  // 1) 原生音译：识别文本里任一音节与目标读音相同即算读对（容忍 ASR 输出同音字）
  try {
    if (native && typeof native.pinyinOf === 'function') {
      const asrPy = native.pinyinOf(norm) || ''
      const sylls = asrPy.split(/\s+/).filter(Boolean)
      if (sylls.indexOf(py) >= 0) return 'ok'
    }
  } catch (e) { /* 忽略原生异常 */ }
  // 2) 兜底：字库内同音字
  const homo = PIN_INDEX[py] || []
  for (let i = 0; i < homo.length; i++) if (norm.includes(homo[i])) return 'ok'
  return 'no'
}

/** 出题排序：优先练没掌握的字，得分越低越靠前，掺一点随机避免每次顺序雷同 */
export function pickQuestions(pool: HanziChar[], n: number, stats: Stats): HanziChar[] {
  const scored = pool.map(ch => {
    const st = stats[ch.c] || { f: 0, w: 0 }
    return { ch, key: (st.f || 0) - (st.w || 0) + ((st.f || 0) >= 3 ? 2 : 0) + Math.random() * 2 }
  })
  scored.sort((a, b) => a.key - b.key)
  return scored.slice(0, n).map(s => s.ch)
}
