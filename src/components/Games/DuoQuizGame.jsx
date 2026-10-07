import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUESTIONS = [
  { q: 'Un soir libre, vous préférez :', options: [{ label: 'Sortir à l\'aventure', trait: 'Aventure' }, { label: 'Un film sous la couette', trait: 'Tendresse' }] },
  { q: 'Votre truc à vous deux :', options: [{ label: 'Rire de tout', trait: 'Complicité' }, { label: 'Se comprendre sans un mot', trait: 'Tendresse' }] },
  { q: 'En voyage, vous êtes plutôt :', options: [{ label: 'Improviser sur place', trait: 'Aventure' }, { label: 'Tout planifier ensemble', trait: 'Complicité' }] },
  { q: 'Votre langage secret :', options: [{ label: 'Les private jokes', trait: 'Complicité' }, { label: 'Les petits gestes doux', trait: 'Tendresse' }] },
]

export default function DuoQuizGame({ onWin, theme }) {
  const accent = theme?.accent ?? '#D4AF37'
  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState({})
  const [result, setResult] = useState(null)

  const pick = (trait) => {
    const next = { ...scores, [trait]: (scores[trait] || 0) + 1 }
    setScores(next)
    if (index >= QUESTIONS.length - 1) {
      const sorted = Object.entries(next).sort((a, b) => b[1] - a[1])
      const top = sorted.slice(0, 2).map(([t]) => t)
      setResult(top.length > 1 ? `${top[0]} & ${top[1]}` : top[0] || 'Complicité')
      setTimeout(onWin, 1600)
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (result) {
    return (
      <div className="text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-4">💞</motion.div>
        <p className="text-ivory/50 text-sm mb-1">Vous formez le duo</p>
        <p className="font-display text-2xl" style={{ color: accent }}>{result}</p>
      </div>
    )
  }

  const question = QUESTIONS[index]

  return (
    <div className="text-center max-w-sm mx-auto">
      <p className="text-ivory/40 text-xs uppercase tracking-widest mb-6">Question {index + 1} / {QUESTIONS.length}</p>
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <h2 className="font-display text-xl text-ivory mb-6">{question.q}</h2>
          <div className="flex flex-col gap-3">
            {question.options.map((opt, i) => (
              <button key={i} onClick={() => pick(opt.trait)} className="px-5 py-3.5 rounded-xl font-medium bg-ink-800 border border-gold-500/20 text-ivory hover:border-gold-500/60 transition-colors">
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
