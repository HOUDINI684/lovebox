import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LetterView({ text, onFinished, onMusicStart, theme }) {
  const [revealed, setRevealed] = useState(false)
  const accent = theme?.accent ?? '#FF3D68'
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0F0A12'}, ${theme?.bgTo ?? '#1B1220'})`

  const handleReveal = () => {
    setRevealed(true)
    onMusicStart?.()
  }

  if (!revealed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center" style={{ background: bg }}>
        <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl text-ivory mb-8">
          J'ai quelque chose à te dire…
        </motion.h2>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleReveal}
          className="text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-colors"
          style={{ backgroundColor: accent }}
        >
          Révéler
        </motion.button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: bg }}>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl text-ivory mb-8">
        Une lettre pour vous
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15 }}
        className="font-script text-2xl leading-relaxed whitespace-pre-wrap text-left bg-ivory text-night-800 px-10 py-10 rounded-lg shadow-2xl shadow-black/40 max-w-xl w-full"
      >
        {text}
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onFinished}
        className="mt-10 text-white font-medium px-8 py-3.5 rounded-full shadow-lg transition-colors"
        style={{ backgroundColor: accent }}
      >
        Continuer
      </motion.button>
    </div>
  )
}
