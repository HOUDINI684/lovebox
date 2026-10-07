import { useState, useEffect, useRef } from 'react'

const PHRASES = [
  'tu comptes plus que tu ne le penses',
  'chaque jour avec toi est un cadeau',
  'ton sourire illumine ma journee',
  'je pense a toi plus que tu ne le crois',
  'merci pour tous ces moments a deux',
]

export default function TypeRaceGame({ onWin, theme }) {
  const accent = theme?.accent ?? '#D4AF37'
  const phrase = useRef(PHRASES[Math.floor(Math.random() * PHRASES.length)]).current
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [finished, setFinished] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const handleChange = (e) => {
    const val = e.target.value
    if (!startTime) setStartTime(Date.now())
    setInput(val)
    if (val.trim().toLowerCase() === phrase) {
      const time = ((Date.now() - (startTime || Date.now())) / 1000).toFixed(1)
      setElapsed(time)
      setFinished(true)
      setTimeout(onWin, 1200)
    }
  }

  return (
    <div className="text-center max-w-sm mx-auto">
      <h2 className="font-display text-2xl text-ivory mb-1">Tape la phrase</h2>
      <p className="text-ivory/40 text-sm mb-6">Le plus vite possible !</p>
      <p className="font-script text-2xl text-ivory mb-6 px-2">{phrase}</p>
      {!finished ? (
        <input
          autoFocus
          value={input}
          onChange={handleChange}
          placeholder="Écris ici..."
          className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory text-center focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': accent }}
        />
      ) : (
        <p className="font-display text-xl" style={{ color: accent }}>Bravo, {elapsed}s ! ⚡</p>
      )}
    </div>
  )
}
