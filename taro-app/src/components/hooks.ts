/* React 小工具：ref + 强制刷新（移植原 imperative 状态机用）、bump 动画 */
import { useCallback, useEffect, useRef, useState } from 'react'

/** 强制刷新 hook：状态放在 ref 里原样操作，mutate 后调用 upd() 触发重渲染 */
export function useForceUpdate(): () => void {
  const [, setTick] = useState(0)
  return useCallback(() => setTick(t => t + 1), [])
}

/** 保持 ref 始终指向最新值（给 setTimeout 回调避免过期闭包用） */
export function useLatest<T>(value: T): { current: T } {
  const ref = useRef(value)
  ref.current = value
  return ref
}

/** bump 弹跳动画：返回 className 片段与触发函数（等价原 classList 版 bump()） */
export function useBump(): { cls: string; bump: () => void } {
  const [on, setOn] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const bump = useCallback(() => {
    setOn(false)
    // 先移除再下一帧加回，确保动画重新触发（对应原 void el.offsetWidth）
    setTimeout(() => setOn(true), 20)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(false), 520)
  }, [])

  return { cls: on ? 'bump' : '', bump }
}
