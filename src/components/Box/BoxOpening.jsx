import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const HOLD_MS = 900

export default function BoxOpening({ onOpen, onStart, recipientName, theme }) {
  const [opening, setOpening] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const intervalRef = useRef(null)
  const accent = theme?.accent ?? '#D4AF37'
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0B0B0D'}, ${theme?.bgTo ?? '#17151A'})`

  const startHold = useCallback(() => {
    if (opening) return
    const startedAt = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const p = Math.min(1, elapsed / HOLD_MS)
      setHoldProgress(p)
      if (p >= 1) {
        clearInterval(intervalRef.current)
        setOpening(true)
        navigator.vibrate?.(200)
        onStart?.()
        setTimeout(onOpen, 3000)
      }
    }, 20)
  }, [opening, onStart, onOpen])

  const cancelHold = useCallback(() => {
    if (opening) return
    clearInterval(intervalRef.current)
    setHoldProgress(0)
  }, [opening])

  const circumference = 2 * Math.PI * 54

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: bg }}>
      {!opening && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-ivory/50 text-sm tracking-widest uppercase mb-4">
          Une surprise t'attend{recipientName ? `, ${recipientName}` : ''}…
        </motion.p>
      )}

      <div className="relative flex items-center justify-center mb-10">
        {!opening && (
          <svg width="120" height="120" className="absolute -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(243,238,227,0.12)" strokeWidth="4" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={accent} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - holdProgress)} strokeLinecap="round" />
          </svg>
        )}
        <motion.div
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          animate={opening ? { scale: [1, 0.88, 1.2, 1.6], rotate: [0, -4, 8, 16], opacity: [1, 1, 1, 0] } : { scale: [1, 1.04, 1] }}
          transition={opening ? { duration: 3, ease: 'easeInOut', times: [0, 0.15, 0.55, 1] } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl select-none"
          style={{ cursor: opening ? 'default' : 'pointer', touchAction: 'none' }}
        >
          🎁
        </motion.div>
      </div>

      {!opening && (
        <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="text-sm tracking-wide uppercase font-medium" style={{ color: accent }}>
          Maintiens pour ouvrir
        </motion.p>
      )}
    </div>
  )
}
