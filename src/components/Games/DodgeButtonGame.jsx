import { useState } from 'react'
import { motion } from 'framer-motion'

export default function DodgeButtonGame({ onComplete, theme }) {
  const [attempts, setAttempts] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const accent = theme?.accent ?? '#FF3D68'
  const REQUIRED = 4

  const handleClick = () => {
    if (attempts + 1 >= REQUIRED) { onComplete(); return }
    setPos({ x: (Math.random() - 0.5) * 180, y: (Math.random() - 0.5) * 120 })
    setAttempts((a) => a + 1)
  }

  return (
    <div className="text-center relative h-64 flex flex-col items-center justify-center">
      <h2 className="font-display text-2xl text-ivory mb-2">Attrape-moi si tu peux</h2>
      <p className="text-ivory/40 text-sm mb-10">Le bouton n'a pas envie de se laisser faire...</p>
      <motion.button
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        onClick={handleClick}
        className="text-white font-semibold px-7 py-3.5 rounded-full shadow-lg"
        style={{ backgroundColor: accent }}
      >
        Continuer
      </motion.button>
      <button onClick={onComplete} className="mt-10 text-ivory/30 text-xs underline">Passer ce jeu</button>
    </div>
  )
}
