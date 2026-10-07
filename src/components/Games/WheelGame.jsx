import { useState } from 'react'
import { motion } from 'framer-motion'

const MESSAGES = ['Un compliment sincère', 'Un souvenir précieux', 'Une pensée douce', 'Un merci du cœur', 'Une promesse', 'Un sourire garanti']

export default function WheelGame({ onWin, theme }) {
  const accent = theme?.accent ?? '#D4AF37'
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    const spins = 5 + Math.random() * 2
    const finalAngle = spins * 360 + Math.random() * 360
    setRotation(finalAngle)
    const sliceCount = MESSAGES.length
    const chosenIndex = Math.floor(((360 - (finalAngle % 360)) / (360 / sliceCount))) % sliceCount
    setTimeout(() => {
      setResult(MESSAGES[chosenIndex])
      setSpinning(false)
      setTimeout(onWin, 1600)
    }, 3000)
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-6">La roue des surprises</h2>
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className="w-40 h-40 rounded-full mx-auto mb-6"
        style={{ background: `conic-gradient(${accent} 0deg 60deg, #18171B 60deg 120deg, ${accent} 120deg 180deg, #18171B 180deg 240deg, ${accent} 240deg 300deg, #18171B 300deg 360deg)`, border: `4px solid ${accent}`, boxShadow: `0 8px 24px ${accent}44` }}
      />
      {!result ? (
        <button onClick={spin} disabled={spinning} className="text-ink-950 font-semibold px-6 py-3 rounded-full shadow-lg disabled:opacity-50" style={{ backgroundColor: accent }}>
          {spinning ? 'Ça tourne...' : 'Faire tourner'}
        </button>
      ) : (
        <p className="font-script text-2xl" style={{ color: accent }}>{result}</p>
      )}
    </div>
  )
}
