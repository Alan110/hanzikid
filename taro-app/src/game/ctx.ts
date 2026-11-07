/* 游戏全局上下文：设置 / 学习统计 / 小星星奖牌 / 屏幕切换 */
import { createContext, useContext } from 'react'
import type { Awards, Settings, Stats } from '../services/store'

export type ScreenKey = 'home' | 'learn' | 'quiz' | 'read' | 'end' | 'flow' | 'awards'
export type ModeKey = 'learn' | 'quiz' | 'read' | 'flow'

export interface RunResult {
  mode: 'quiz' | 'read' | 'flow'
  total: number
  gold: number
  silver: number
  /** 本局获得的星星（含连击/全对奖励） */
  stars: number
  /** 本局奖牌 */
  medal: 'gold' | 'silver' | 'bronze'
  /** 本局新解锁的成就奖牌 id */
  unlocked: string[]
}

export interface GameCtxValue {
  settings: Settings
  stats: Stats
  /** 小星星与奖牌账本（全局积累） */
  awards: Awards
  /** 更新并持久化设置（浅合并） */
  patchSettings: (patch: Partial<Settings>) => void
  /** 记一次答题结果：s 出现 / first 一次对 / 否则 w 答错，持久化 */
  bumpStat: (c: string, first: boolean) => void
  resetStats: () => void
  /** 过程性加星（认一认翻完一组等），返回新解锁的成就奖牌 id 列表 */
  addStars: (n: number, mode: string) => string[]
  resetAwards: () => void
  goto: (screen: ScreenKey) => void
}

export const GameCtx = createContext<GameCtxValue>(null as any)

export const useGame = (): GameCtxValue => useContext(GameCtx)
