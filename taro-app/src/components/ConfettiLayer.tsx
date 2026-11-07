/* 撒花效果：模块级触发器 + 全屏图层组件（原样迁移 game.js confetti） */
import { useEffect, useState } from 'react'

interface Piece {
  id: number
  left: number
  fontSize: number
  duration: number
  delay: number
  emo: string
}

const EMO = ['⭐', '🎉', '✨', '🎈', '🌟']
let listener: ((n: number) => void) | null = null
let seq = 0

/** 任意组件里调用 confetti(10) 触发撒花 */
export function confetti(n = 40): void {
  listener?.(n)
}

export default function ConfettiLayer() {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    listener = (n: number) => {
      const batch: Piece[] = []
      for (let i = 0; i < n; i++) {
        batch.push({
          id: ++seq,
          left: Math.random() * 100,
          fontSize: 15 + Math.random() * 18,
          duration: 1.6 + Math.random() * 1.6,
          delay: Math.random() * 0.7,
          emo: EMO[i % EMO.length],
        })
      }
      setPieces(prev => prev.concat(batch))
      const ids = new Set(batch.map(p => p.id))
      setTimeout(() => setPieces(prev => prev.filter(p => !ids.has(p.id))), 4200)
    }
    return () => { listener = null }
  }, [])

  return (
    <div className="confetti-layer">
      {pieces.map(p => (
        <span
          key={p.id}
          className="confetti"
          style={{ left: p.left + '%', fontSize: p.fontSize + 'px', animationDuration: p.duration + 's', animationDelay: p.delay + 's' }}
        >{p.emo}</span>
      ))}
    </div>
  )
}
