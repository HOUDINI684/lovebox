import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const GAME_MS = 8000
const FALL_MS = 2200

export default function CatchHeartsGame({ onWin, theme }) {
  const accent = theme?.accent ?? '#D4AF37'
  const [basketX, setBasketX] = useState(50) // percent
  const basketXRef = useRef(50)
  const [hearts, setHearts] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_MS)
  const [over, setOver] = useState(false)
  const trackRef = useRef(null)

  useEffect(() => { basketXRef.current = basketX }, [basketX])

  const moveBasket = useCallback((clientX) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const pct = Math.min(92, Math.max(8, ((clientX - rect.left) / rect.width) * 100))
    setBasketX(pct)
  }, [])

  useEffect(() => {
    if (over) return
    const spawnInterval = setInterval(() => {
      setHearts((h) => [...h, { id: Math.random(), x: 10 + Math.random() * 80 }])
    }, 650)
    const timerInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) { clearInterval(timerInterval); setOver(true); return 0 }
        return t - 100
      })
    }, 100)
    return () => { clearInterval(spawnInterval); clearInterval(timerInterval) }
  }, [over])

  useEffect(() => {
    if (over) setTimeout(onWin, 1200)
  }, [over, onWin])

  const handleHeartDone = (id, x) => {
    if (Math.abs(x - basketXRef.current) < 10) setScore((s) => s + 1)
    setHearts((h) => h.filter((he) => he.id !== id))
  }

  if (over) {
    return (
      <div className="text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-4">🧺</motion.div>
        <p className="font-display text-2xl" style={{ color: accent }}>{score} cœur{score > 1 ? 's' : ''} attrapé{score > 1 ? 's' : ''} !</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-1">Attrape les cœurs</h2>
      <p className="text-ivory/40 text-sm mb-4">Score : {score} · {Math.ceil(timeLeft / 1000)}s</p>
      <div
        ref={trackRef}
        className="relative w-full max-w-xs h-64 mx-auto rounded-xl overflow-hidden bg-ink-800 border border-gold-500/20 touch-none"
        onPointerMove={(e) => e.buttons === 1 && moveBasket(e.clientX)}
        onPointerDown={(e) => moveBasket(e.clientX)}
      >
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ top: '-10%' }}
            animate={{ top: '100%' }}
            transition={{ duration: FALL_MS / 1000, ease: 'linear' }}
            onAnimationComplete={() => handleHeartDone(h.id, h.x)}
            className="absolute text-2xl"
            style={{ left: `${h.x}%`, transform: 'translateX(-50%)' }}
          >
            💗
          </motion.span>
        ))}
        <div className="absolute bottom-2 text-3xl" style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}>
          🧺
        </div>
      </div>
      <p className="text-ivory/30 text-xs mt-3">Glisse le doigt pour déplacer le panier</p>
    </div>
  )
}
