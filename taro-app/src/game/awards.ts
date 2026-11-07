/* 小星星与奖牌结算规则（所有游戏模式共用）
 *  一局结束统一结算：基础星（一次答对 ×1）+ 连击奖励 + 全对奖励 +3
 *  奖牌：每局 🥇全对 / 🥈表现好 / 🥉完成（人人有奖）；成就奖牌持久化解锁 */
import type { Awards } from '../services/store'

export interface MedalDef {
  id: string
  icon: string
  name: string
  desc: string
}

/** 成就奖牌定义（奖牌墙展示顺序） */
export const ACHIEVEMENTS: MedalDef[] = [
  { id: 'star50', icon: '🥉', name: '铜星奖牌', desc: '攒满 50 颗小星星' },
  { id: 'star100', icon: '🥈', name: '银星奖牌', desc: '攒满 100 颗小星星' },
  { id: 'star300', icon: '🥇', name: '金星奖牌', desc: '攒满 300 颗小星星' },
  { id: 'star500', icon: '💎', name: '钻石奖牌', desc: '攒满 500 颗小星星' },
  { id: 'streak8', icon: '🔥', name: '连击小达人', desc: '一局里连续答对 8 次' },
  { id: 'perfect5', icon: '🏆', name: '满分小冠军', desc: '拿 5 次全对金奖' },
]

export const medalOf = (id: string): MedalDef | undefined => ACHIEVEMENTS.find(m => m.id === id)

/** 每局奖牌图标 */
export const RUN_MEDAL_ICON: Record<string, string> = { gold: '🥇', silver: '🥈', bronze: '🥉' }

const STAR_MILESTONES: [number, string][] = [[50, 'star50'], [100, 'star100'], [300, 'star300'], [500, 'star500']]

/** 连击里程碑奖励星数：3 连 +1 / 5 连 +2 / 8 连 +3（取最高档） */
export const streakBonus = (bestStreak: number): number =>
  bestStreak >= 8 ? 3 : bestStreak >= 5 ? 2 : bestStreak >= 3 ? 1 : 0

export interface RunAward {
  /** 结算后的新账本 */
  next: Awards
  /** 本局获得的星星数 */
  stars: number
  /** 本局奖牌 */
  medal: 'gold' | 'silver' | 'bronze'
  /** 本局新解锁的成就奖牌 id */
  unlocked: string[]
}

/** 一局结束统一结算（找一找/读一读/学一学共用，调用处负责持久化 next） */
export function applyRunResult(
  prev: Awards, mode: string, gold: number, silver: number, total: number, bestStreak: number,
): RunAward {
  const perfect = total > 0 && gold === total
  const stars = gold + (perfect ? 3 : 0) + streakBonus(bestStreak)
  const medal: 'gold' | 'silver' | 'bronze' =
    perfect ? 'gold' : (total > 0 && gold >= Math.ceil(total * 0.6) ? 'silver' : 'bronze')
  const next: Awards = {
    stars: prev.stars + stars,
    byMode: Object.assign({}, prev.byMode, { [mode]: (prev.byMode[mode] || 0) + stars }),
    medals: prev.medals.slice(),
    perfectRuns: prev.perfectRuns + (perfect ? 1 : 0),
    bestStreak: Math.max(prev.bestStreak, bestStreak),
  }
  const unlocked: string[] = []
  STAR_MILESTONES.forEach(pair => {
    const n = pair[0]
    const id = pair[1]
    if (prev.stars < n && next.stars >= n && next.medals.indexOf(id) < 0) {
      next.medals.push(id)
      unlocked.push(id)
    }
  })
  if (bestStreak >= 8 && next.medals.indexOf('streak8') < 0) {
    next.medals.push('streak8')
    unlocked.push('streak8')
  }
  if (next.perfectRuns >= 5 && next.medals.indexOf('perfect5') < 0) {
    next.medals.push('perfect5')
    unlocked.push('perfect5')
  }
  return { next, stars, medal, unlocked }
}

/** 过程性加星（如认一认翻完一整组 +2），返回新账本与新解锁成就 */
export function applyStars(prev: Awards, n: number, mode: string): { next: Awards; unlocked: string[] } {
  const next: Awards = {
    stars: prev.stars + n,
    byMode: Object.assign({}, prev.byMode, { [mode]: (prev.byMode[mode] || 0) + n }),
    medals: prev.medals.slice(),
    perfectRuns: prev.perfectRuns,
    bestStreak: prev.bestStreak,
  }
  const unlocked: string[] = []
  STAR_MILESTONES.forEach(pair => {
    const m = pair[0]
    const id = pair[1]
    if (prev.stars < m && next.stars >= m && next.medals.indexOf(id) < 0) {
      next.medals.push(id)
      unlocked.push(id)
    }
  })
  return { next, unlocked }
}
