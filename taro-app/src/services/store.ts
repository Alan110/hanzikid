/* 本地存储：设置与进度（原样迁移 harmony-app game.js 的 store 逻辑）
 *
 * 原生壳内：设置与进度走原生持久化（卸载重装不丢），轻微 UI 状态（hzk_last 等）仍用 localStorage；
 * 浏览器直接打开：全部回退 localStorage，方便开发调试。
 */
import { native } from './native'

export interface Settings {
  rate: string
  hints: boolean
  len: number
  learnIcon: boolean
  readIcon: boolean
  voiceURI?: string
}

/** 每字学习统计：s 出现 / f 一次答对 / w 答错 */
export interface CharStat {
  s: number
  f: number
  w: number
}

export type Stats = Record<string, CharStat>

export const DEFAULT_SETTINGS: Settings = { rate: 'normal', hints: true, len: 10, learnIcon: false, readIcon: false }

const store = {
  get(k: string, d: any): any {
    try {
      if (native && k === 'hzk_stats') {
        const raw = native.getProgress()
        return raw ? JSON.parse(raw) : d
      }
      if (native && k === 'hzk_settings') {
        const raw = native.getSettings()
        return raw ? JSON.parse(raw) : d
      }
      const v = localStorage.getItem(k)
      return v ? JSON.parse(v) : d
    } catch (e) { return d }
  },
  set(k: string, v: any): void {
    try {
      if (native && k === 'hzk_stats') { native.setProgress(JSON.stringify(v)); return }
      if (native && k === 'hzk_settings') { native.setSettings(JSON.stringify(v)); return }
      localStorage.setItem(k, JSON.stringify(v))
    } catch (e) { /* 忽略存储异常 */ }
  },
}

// 一次性迁移：老版本（纯 WebView localStorage）进度在原生侧为空时搬上去
if (native) {
  const migrate = (localKey: string, nativeGet: () => string, nativeSet: (v: string) => void) => {
    try {
      const local = localStorage.getItem(localKey)
      if (local && !nativeGet()) nativeSet(local)
    } catch (e) { /* 忽略 */ }
  }
  migrate('hzk_stats', () => native.getProgress(), v => native.setProgress(v))
  migrate('hzk_settings', () => native.getSettings(), v => native.setSettings(v))
}

export function loadSettings(): Settings {
  return Object.assign({}, DEFAULT_SETTINGS, store.get('hzk_settings', {}))
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

export function loadLast(): { mode?: string; group?: string } {
  return store.get('hzk_last', {}) || {}
}

export function saveLast(v: { mode: string; group: string }): void {
  store.set('hzk_last', v)
}

/** 连对 3 次算掌握 */
export const isMastered = (stats: Stats, c: string): boolean => !!(stats[c] && stats[c].f >= 3)
