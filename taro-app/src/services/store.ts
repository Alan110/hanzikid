/* 本地存储：设置与进度
 *
 * 数据路由全部在网页侧，按能力探测，原生壳只做哑 K-V：
 *   读：kvGet(key) → legacy 专用键（老壳数据迁移）→ localStorage
 *   写：kvSet(key) → legacy 专用键 → localStorage
 * 一旦壳实现 kvGet/kvSet，任何新数据类型都零原生改动；
 * 旧壳（只有 getProgress 等）自动透传兼容，浏览器直接打开全部回退 localStorage。
 */

import { native } from './native'

export interface Settings {
  rate: string
  hints: boolean
  len: number
  learnIcon: boolean
  readIcon: boolean
  /** 找一找里穿插「看图找字」题型 */
  picQuiz: boolean
  voiceURI?: string
  /** 一次性迁移标记：learnIcon 默认值从关翻转为开（只翻一次） */
  iconFlip?: number
}

/** 每字学习统计：s 出现 / f 一次答对 / w 答错 */
export interface CharStat {
  s: number
  f: number
  w: number
}

export type Stats = Record<string, CharStat>

/** 小星星与奖牌账本（全局积累，所有游戏模式共用） */
export interface Awards {
  /** 累计小星星 */
  stars: number
  /** 各模式星星：learn/quiz/read/flow */
  byMode: Record<string, number>
  /** 已解锁的成就奖牌 id 列表 */
  medals: string[]
  /** 全对局数（满分小冠军进度用） */
  perfectRuns: number
  /** 历史最高连击 */
  bestStreak: number
}

export const EMPTY_AWARDS: Awards = { stars: 0, byMode: {}, medals: [], perfectRuns: 0, bestStreak: 0 }

export const DEFAULT_SETTINGS: Settings = { rate: 'normal', hints: true, len: 10, learnIcon: true, readIcon: false, picQuiz: true }

/** legacy 专用键（老版本壳的按类型桥方法），仅作老数据迁移回退用 */
function legacyRead(k: string): string {
  if (!native) return ''
  if (k === 'hzk_stats' && typeof native.getProgress === 'function') return native.getProgress()
  if (k === 'hzk_settings' && typeof native.getSettings === 'function') return native.getSettings()
  return ''
}

function legacyWrite(k: string, json: string): boolean {
  if (!native) return false
  if (k === 'hzk_stats' && typeof native.setProgress === 'function') { native.setProgress(json); return true }
  if (k === 'hzk_settings' && typeof native.setSettings === 'function') { native.setSettings(json); return true }
  return false
}

const store = {
  get(k: string, d: any): any {
    try {
      let raw = ''
      if (native && typeof native.kvGet === 'function') raw = native.kvGet(k)
      if (!raw) raw = legacyRead(k)
      if (raw) return JSON.parse(raw)
      const v = localStorage.getItem(k)
      return v ? JSON.parse(v) : d
    } catch (e) { return d }
  },
  set(k: string, v: any): void {
    try {
      const json = JSON.stringify(v)
      if (native && typeof native.kvSet === 'function') { native.kvSet(k, json); return }
      if (legacyWrite(k, json)) return
      localStorage.setItem(k, json)
    } catch (e) { /* 忽略存储异常 */ }
  },
}

export function loadSettings(): Settings {
  const raw = store.get('hzk_settings', {}) || {}
  const s = Object.assign({}, DEFAULT_SETTINGS, raw)
  // 一次性迁移：认一认「看图」默认开，把老设备的旧设置也翻转一次（此后以用户手动操作为准）
  if (!raw.iconFlip) {
    s.learnIcon = true
    s.iconFlip = 1
    saveSettings(s)
  }
  return s
}

export function saveSettings(settings: Settings): void {
  store.set('hzk_settings', settings)
}

export function loadStats(): Stats {
  return store.get('hzk_stats', {})
}

export function saveStats(stats: Stats): void {
  store.set('hzk_stats', stats)
}

export function loadAwards(): Awards {
  const raw = store.get('hzk_awards', null)
  if (!raw || typeof raw !== 'object') return { stars: 0, byMode: {}, medals: [], perfectRuns: 0, bestStreak: 0 }
  return {
    stars: Number(raw.stars) || 0,
    byMode: raw.byMode && typeof raw.byMode === 'object' ? raw.byMode : {},
    medals: Array.isArray(raw.medals) ? raw.medals.filter((m: unknown) => typeof m === 'string') : [],
    perfectRuns: Number(raw.perfectRuns) || 0,
    bestStreak: Number(raw.bestStreak) || 0,
  }
}

export function saveAwards(awards: Awards): void {
  store.set('hzk_awards', awards)
}

export function loadLast(): { mode?: string; group?: string } {
  return store.get('hzk_last', {}) || {}
}

export function saveLast(v: { mode: string; group: string }): void {
  store.set('hzk_last', v)
}

/** 连对 3 次算掌握 */
export const isMastered = (stats: Stats, c: string): boolean => !!(stats[c] && stats[c].f >= 3)
