import { useState, useMemo } from 'react'

const PROMPTS = [
  ['Un cadeau surprise', 'Une soirée surprise'],
  ['Un message doux chaque matin', 'Un appel chaque soir'],
  ['Voyager ensemble', 'Cuisiner ensemble'],
  ['Un bouquet de fleurs', 'Une boîte de chocolats'],
  ['Danser sous la pluie', 'Regarder les étoiles'],
]

export default function WouldYouRatherGame({ onWin, theme }) {
  const accent = theme?.accent ?? '#D4AF37'
  const [round, setRound] = useState(0)
  const [chosen, setChosen] = useState(null)
  const prompt = useMemo(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)], [round])

  const handlePick = (i) => {
    setChosen(i)
    setTimeout(() => {
      if (round >= 2) onWin()
      else { setRound((r) => r + 1); setChosen(null) }
    }, 700)
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-1">Tu préfères... ?</h2>
      <p className="text-ivory/40 text-sm mb-6">Round {round + 1} / 3</p>
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        {prompt.map((opt, i) => (
          <button key={i} onClick={() => handlePick(i)} className="px-5 py-4 rounded-xl font-medium transition-colors border" style={{ backgroundColor: chosen === i ? accent : 'rgba(24,23,27,0.9)', color: chosen === i ? '#0B0B0D' : '#F3EEE3', borderColor: 'rgba(212,175,55,0.25)' }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
