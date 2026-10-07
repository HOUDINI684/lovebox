import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { registerHeartTouched } from '../../services/heartService'
import NameConfetti from './NameConfetti'
import { playHeartPop, playChime } from '../../utils/sound'

export default function InteractiveHeart({ loveboxId, theme, recipientName, finalMessage }) {
  const [touched, setTouched] = useState(false)
  const [taps, setTaps] = useState(0)
  const accent = theme?.accent ?? '#D4AF37'

  const handleTouch = async () => {
    setTaps((t) => t + 1)
    navigator.vibrate?.(taps === 0 ? 150 : 40)
    if (!touched) {
      playChime()
      setTouched(true)
      try { await registerHeartTouched(loveboxId) } catch (err) { console.error(err) }
    } else {
      playHeartPop()
    }
  }

  const scale = 1 + Math.min(taps * 0.06, 0.5)
  const confettiCount = Math.min(70 + taps * 20, 220)

  return (
    <div className="relative flex flex-col items-center justify-center text-center py-10 overflow-hidden min-h-[50vh]">
      {taps > 0 && (
        <motion.div
          key={`glow-${taps}`}
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: 0, scale: 2.2 }}
          transition={{ duration: 0.8 }}
          className="absolute w-72 h-72 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}44, transparent 70%)` }}
        />
      )}
      {taps > 0 && <NameConfetti key={taps} name={recipientName} colors={theme?.confetti} count={confettiCount} />}

      <h2 className="font-display text-3xl text-ivory mb-10 relative z-10">
        {touched ? (finalMessage || 'Merci pour ce moment') : 'Touche le cœur'}
      </h2>

      {touched && (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-28 h-28 rounded-full bg-ink-800 border-4 border-gold-500/20 flex items-center justify-center mb-8 relative z-10 shadow-lg">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: accent }} />
        </motion.div>
      )}

      <motion.div
        animate={{ scale: [scale, scale * 1.12, scale], rotate: [-4, 4, -4] }}
        transition={{ scale: { repeat: Infinity, duration: 1.2 }, rotate: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }}
        onClick={handleTouch}
        className="text-8xl relative z-10 cursor-pointer"
      >
        ❤️
      </motion.div>

      {taps > 0 && <p className="relative z-10 text-ivory/30 text-xs mt-6">{taps} {taps > 1 ? 'battements' : 'battement'}</p>}
    </div>
  )
}
