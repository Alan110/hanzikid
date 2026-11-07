/* 游戏全局上下文：设置 / 学习统计 / 屏幕切换 */
import { createContext, useContext } from 'react'
import type { Settings, Stats } from '../services/store'

export type ScreenKey = 'home' | 'learn' | 'quiz' | 'read' | 'end' | 'flow'
export type ModeKey = 'learn' | 'quiz' | 'read' | 'flow'

export interface RunResult {
  mode: 'quiz' | 'read' | 'flow'
  total: number
  gold: number
  silver: number
}

export interface GameCtxValue {
  settings: Settings
  stats: Stats
  /** 更新并持久化设置（浅合并） */
  patchSettings: (patch: Partial<Settings>) => void
  /** 记一次答题结果：s 出现 / first 一次对 / 否则 w 答错，持久化 */
  bumpStat: (c: string, first: boolean) => void
  resetStats: () => void
  goto: (screen: ScreenKey) => void
}

export const GameCtx = createContext<GameCtxValue>(null as any)

export const useGame = (): GameCtxValue => useContext(GameCtx)
