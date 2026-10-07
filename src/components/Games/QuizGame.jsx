import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Autre bonne reponse du quiz, utilisee comme fausse proposition quand le createur n'en a pas ecrit
function pickOtherAnswer(questions, index) {
  const own = questions[index].answer.trim().toLowerCase()
  const candidates = questions
    .filter((_, j) => j !== index)
    .map((q) => q.answer.trim())
    .filter((a) => a && a.toLowerCase() !== own)
  if (candidates.length === 0) return null
  return candidates[Math.floor(Math.random() * candidates.length)]
}

function buildProposals(questions) {
  return questions.map((q, i) => {
    const answer = q.answer.trim()
    const custom = q.wrongAnswer?.trim()
    const wrong = custom && custom.toLowerCase() !== answer.toLowerCase() ? custom : pickOtherAnswer(questions, i)
    const showTrue = !wrong || Math.random() < 0.5
    return { question: q.question.trim(), answer, shown: showTrue ? answer : wrong, isTrue: showTrue }
  })
}

export default function QuizGame({ questions, theme }) {
  const [proposals, setProposals] = useState(() => buildProposals(questions))
  const [index, setIndex] = useState(0)
  const [claim, setClaim] = useState(null) // reponse du destinataire : true (Vrai) / false (Faux)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const accent = theme?.accent ?? '#D4AF37'

  const total = proposals.length
  const p = proposals[index]
  const isLast = index === total - 1
  const answered = claim !== null
  const correct = answered && claim === p.isTrue

  const choose = (value) => {
    if (answered) return
    setClaim(value)
    if (value === p.isTrue) setScore((s) => s + 1)
  }

  const next = () => {
    if (isLast) { setDone(true); return }
    setClaim(null)
    setIndex((i) => i + 1)
  }

  const restart = () => {
    setProposals(buildProposals(questions))
    setIndex(0); setClaim(null); setScore(0); setDone(false)
  }

  if (done) {
    const pct = Math.round((score / total) * 100)
    const comment = pct === 100 ? 'Tu le/la connais par cœur !' : pct >= 60 ? 'Tu le/la connais vraiment bien !' : "Encore quelques découvertes à faire, c'est aussi ça le jeu !"
    return (
      <div className="text-center py-8">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-4">💕</motion.div>
        <p className="font-display text-4xl mb-1" style={{ color: accent }}>{pct} / 100</p>
        <p className="text-ivory/40 text-xs mb-3">{score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {total}</p>
        <p className="text-ivory/60 text-sm mb-6 max-w-xs mx-auto">{comment}</p>
        <div className="bg-ink-800 border border-gold-500/20 rounded-xl px-4 py-3 max-w-xs mx-auto mb-6">
          <p className="text-ivory/70 text-sm">📸 Fais une capture d'écran de ton score et envoie-la pour montrer à quel point tu le/la connais !</p>
        </div>
        <button onClick={restart} className="text-ink-950 text-sm font-semibold px-6 py-2.5 rounded-full" style={{ backgroundColor: accent }}>
          Recommencer
        </button>
      </div>
    )
  }

  return (
    <div className="text-center py-6 max-w-sm mx-auto">
      <p className="text-ivory/40 text-xs uppercase tracking-widest mb-6">Question {index + 1} / {total}</p>
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <h2 className="font-display text-2xl text-ivory mb-5">{p.question}</h2>
          <div className="bg-ink-800 border border-gold-500/20 rounded-xl px-5 py-4 mb-6 shadow-sm">
            <p className="font-script text-2xl" style={{ color: accent }}>{p.shown}</p>
          </div>

          {!answered ? (
            <>
              <p className="text-ivory/50 text-sm mb-3">Vrai ou faux ?</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => choose(true)} className="text-ink-950 font-semibold px-8 py-3 rounded-full shadow-lg" style={{ backgroundColor: accent }}>
                  Vrai
                </button>
                <button onClick={() => choose(false)} className="font-semibold px-8 py-3 rounded-full border-2 bg-ink-800" style={{ color: accent, borderColor: accent }}>
                  Faux
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-ivory/80 text-sm mb-5">
                {correct && p.isTrue && '✅ Exact !'}
                {correct && !p.isTrue && <>✅ Bien vu ! La vraie réponse : <strong>{p.answer}</strong></>}
                {!correct && p.isTrue && "❌ Raté, c'était bien la bonne réponse."}
                {!correct && !p.isTrue && <>❌ Raté ! La vraie réponse : <strong>{p.answer}</strong></>}
              </p>
              <button onClick={next} className="text-ink-950 font-semibold px-6 py-3 rounded-full shadow-lg" style={{ backgroundColor: accent }}>
                {isLast ? 'Voir mon score' : 'Question suivante'}
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
