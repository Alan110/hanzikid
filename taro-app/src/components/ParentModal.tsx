/* 家长中心：原样迁移 game.js renderParent/renderVoiceSeg + 分段设置 + 进度 + 重置 */
import { useState } from 'react'
import { useGame } from '../game/ctx'
import { GROUPS } from '../game/util'
import { native } from '../services/native'
import Speech, { say } from '../services/speech'
import { isMastered } from '../services/store'
import { SFX } from '../services/sfx'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ParentModal({ open, onClose }: Props) {
  const { settings, patchSettings, stats, resetStats } = useGame()
  const [, force] = useState(0)
  const [resetArmed, setResetArmed] = useState(false)
  const [resetTimer, setResetTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  if (!open) return null

  const zhVoices = native ? [] : Speech.zhVoices()

  const setSeg = (patch: Partial<typeof settings>) => {
    patchSettings(patch)
    force(n => n + 1)
  }

  const onReset = () => {
    if (!resetArmed) {
      setResetArmed(true)
      const t = setTimeout(() => { setResetArmed(false) }, 3000)
      setResetTimer(t)
      return
    }
    if (resetTimer) clearTimeout(resetTimer)
    setResetArmed(false)
    resetStats()
    force(n => n + 1)
  }

  return (
    <div className="modal" id="parentModal" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-card">
        <div className="modal-head">
          <span>⚙️ 家长中心</span>
          <button className="icon-btn" aria-label="关闭" onClick={onClose}>✖️</button>
        </div>
        <div className="modal-body">
          <div>
            <div className="set-title">🗣️ 朗读人声 <small style={{ color: '#b09a7d' }}>（逐个试听，选最清楚的那个）</small></div>
            <div className="seg" id="segVoice">
              {native ? (
                <span className="voice-note">✅ 正在使用系统原生朗读</span>
              ) : zhVoices.length ? (
                zhVoices.map(v => {
                  const short = v.name.replace(/^(Microsoft|Google)\s+/i, '').replace(/\s*-\s*(Chinese|中文|普通话).*$/i, '').trim()
                  return (
                    <button
                      key={v.voiceURI}
                      className={'seg-btn' + (settings.voiceURI === v.voiceURI ? ' active' : '')}
                      title={v.name}
                      onClick={() => {
                        patchSettings({ voiceURI: v.voiceURI })
                        Speech.pick(settings)
                        force(n => n + 1)
                        say('你好呀，小朋友，我用这个声音陪你玩', settings)
                      }}
                    >{short || v.name}</button>
                  )
                })
              ) : (
                <span className="voice-note">未找到中文语音包，请换 Chrome / Edge 打开</span>
              )}
            </div>
            <p className="voice-note">
              {native
                ? '当前人声：系统原生朗读'
                : Speech.voice
                  ? '当前人声：' + Speech.voice.name
                  : '⚠️ 未检测到中文语音包：请确认设备已装中文 TTS，或改用 Chrome / Edge / Safari 打开'}
            </p>
          </div>
          <div>
            <div className="set-title">
              🎙️ 朗读速度
              <button className="seg-btn" onClick={() => say('你好呀，我是识字小乐园', settings)}>🔊 试听</button>
            </div>
            <div className="seg" id="segRate">
              {[['slow', '慢一些'], ['normal', '标准'], ['fast', '快一些']].map(([v, label]) => (
                <button key={v} className={'seg-btn' + (settings.rate === v ? ' active' : '')}
                  onClick={() => { setSeg({ rate: v }); say('你好呀，小朋友', { ...settings, rate: v }) }}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="set-title">🖼️ 选项图片提示</div>
            <div className="seg" id="segHints">
              <button className={'seg-btn' + (settings.hints ? ' active' : '')} onClick={() => setSeg({ hints: true })}>显示图片</button>
              <button className={'seg-btn' + (!settings.hints ? ' active' : '')} onClick={() => setSeg({ hints: false })}>只看汉字</button>
            </div>
            <p className="voice-note">入门时显示图片帮助联想；孩子熟悉后可切到「只看汉字」真正考认字。</p>
          </div>
          <div>
            <div className="set-title">🎯 每轮题数</div>
            <div className="seg" id="segLen">
              {[5, 10, 15].map(n => (
                <button key={n} className={'seg-btn' + (settings.len === n ? ' active' : '')} onClick={() => setSeg({ len: n })}>{n} 题</button>
              ))}
            </div>
            <p className="voice-note">3 岁半建议 5～10 题，一局 2～3 分钟刚好。</p>
          </div>
          <div>
            <div className="set-title">📊 学习进度</div>
            <div style={{ marginTop: 8 }} id="progressList">
              {GROUPS.map(g => (
                <div className="pg-group" key={g.id}>
                  <b>{g.icon} {g.name}</b>
                  <div className="pg-chips">
                    {g.chars.map(c => (
                      <span key={c.c} className={'chip kai' + (isMastered(stats, c.c) ? ' mastered' : '')} title={c.p}>{c.c}</span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="pg-tip">⭐ 金色 = 已掌握（连对 3 次）。答题会优先安排还没掌握的字。</p>
            </div>
          </div>
          <button className="danger" onClick={onReset}>{resetArmed ? '再点一次确认重置 ⚠️' : '🗑 重置全部进度'}</button>
        </div>
      </div>
    </div>
  )
}
