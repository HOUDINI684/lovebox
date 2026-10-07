import { useState } from 'react'
import { motion } from 'framer-motion'

const DESIGNS = {
  classique: 'bg-paper-100 text-ink-900 font-script',
  manuscrite: 'text-ink-900 font-script',
  moderne: 'bg-ink-800 text-ivory font-sans border-l-4 border border-gold-500/20',
}

export default function LetterView({ text, onMusicStart, theme, design = 'classique' }) {
  const [flipped, setFlipped] = useState(false)
  const accent = theme?.accent ?? '#D4AF37'

  const handleFlip = () => { setFlipped(true); onMusicStart?.() }

  const lines = (text || '').split('\n')
  const cardClass = DESIGNS[design] || DESIGNS.classique
  const cardStyle = design === 'manuscrite'
    ? { backgroundColor: '#EFE3C8', backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 27px, rgba(18,17,20,0.08) 28px)' }
    : design === 'moderne' ? { borderLeftColor: accent } : {}

  if (!flipped) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl text-ivory mb-10">
          J'ai quelque chose à te dire…
        </motion.h2>
        <motion.div onClick={handleFlip} className="relative w-64 h-44 cursor-pointer" style={{ perspective: 800 }} whileTap={{ scale: 0.97 }}>
          <div className="absolute inset-0 rounded-lg shadow-xl shadow-black/50 border border-gold-500/30" style={{ background: 'linear-gradient(135deg, #F3EEE3, #E2D4B5)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-12 h-12 rounded-full flex items-center justify-center text-ink-950 text-lg font-display shadow-lg" style={{ backgroundColor: accent }}>
              ❤
            </motion.div>
          </div>
        </motion.div>
        <p className="text-ivory/30 text-xs mt-6 tracking-wide uppercase">Touchez pour révéler</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-6">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl text-ivory mb-8">
        Une lettre pour vous
      </motion.h2>
      <div className={`text-2xl leading-relaxed text-left px-10 py-10 rounded-lg shadow-xl shadow-black/40 max-w-xl w-full max-h-[65vh] overflow-y-auto ${cardClass}`} style={cardStyle}>
        {lines.map((line, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.35, duration: 0.6 }} className="mb-1">
            {line || '\u00A0'}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
