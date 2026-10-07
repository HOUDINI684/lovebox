import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import HeartFindGame from './HeartFindGame'
import DodgeButtonGame from './DodgeButtonGame'
import ColorTapGame from './ColorTapGame'
import MemoryPhotoGame from './MemoryPhotoGame'
import WouldYouRatherGame from './WouldYouRatherGame'
import ScratchCardGame from './ScratchCardGame'
import WheelGame from './WheelGame'
import TypeRaceGame from './TypeRaceGame'
import PhotoMysteryGame from './PhotoMysteryGame'
import DuoQuizGame from './DuoQuizGame'
import CatchHeartsGame from './CatchHeartsGame'

function CircularLoader({ accent, onDone }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const duration = 1100
    const interval = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - start) / duration) * 100))
      setProgress(p)
      if (p >= 100) { clearInterval(interval); setTimeout(onDone, 150) }
    }, 20)
    return () => clearInterval(interval)
  }, [onDone])

  const r = 46
  const circumference = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg width="110" height="110" className="-rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(243,238,227,0.12)" strokeWidth="6" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} />
      </svg>
      <p className="font-display text-xl mt-[-70px]" style={{ color: accent }}>{progress}%</p>
    </div>
  )
}

export default function MiniGame({ theme, photos = [] }) {
  const [phase, setPhase] = useState('select') // select | loading | playing | reward
  const [selectedId, setSelectedId] = useState(null)
  const accent = theme?.accent ?? '#D4AF37'

  const GAMES = useMemo(() => {
    const list = [
      { id: 'heart-find', icon: '💗', label: 'Trouve le cœur', component: HeartFindGame },
      { id: 'dodge', icon: '🎯', label: 'Attrape-moi', component: DodgeButtonGame },
      { id: 'color-tap', icon: '🎨', label: 'Tape au bon moment', component: ColorTapGame },
      { id: 'would-you-rather', icon: '💭', label: 'Tu préfères...', component: WouldYouRatherGame },
      { id: 'scratch', icon: '✨', label: 'Carte à gratter', component: ScratchCardGame },
      { id: 'wheel', icon: '🎡', label: 'Roue des surprises', component: WheelGame },
      { id: 'type-race', icon: '⌨️', label: 'Tape la phrase', component: TypeRaceGame },
      { id: 'duo-quiz', icon: '💞', label: 'Quel duo êtes-vous ?', component: DuoQuizGame },
      { id: 'catch-hearts', icon: '🧺', label: 'Attrape les cœurs', component: CatchHeartsGame },
    ]
    if (photos.length >= 3) list.push({ id: 'memory', icon: '🧩', label: 'Memory souvenirs', component: MemoryPhotoGame })
    if (photos.length >= 1) list.push({ id: 'photo-mystery', icon: '🖼️', label: 'Photo mystère', component: PhotoMysteryGame })
    return list
  }, [photos.length])

  const selectedGame = GAMES.find((g) => g.id === selectedId)

  const handleSelect = (id) => {
    setSelectedId(id)
    setPhase('loading')
  }

  const ChosenGame = selectedGame?.component

  return (
    <div className="px-4 py-6 min-h-[50vh]">
      {phase === 'select' && (
        <div>
          <h2 className="font-display text-2xl text-ivory mb-1 text-center">Choisis ton jeu</h2>
          <p className="text-ivory/40 text-sm mb-6 text-center">{GAMES.length} jeux disponibles</p>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {GAMES.map((g) => (
              <button key={g.id} onClick={() => handleSelect(g.id)} className="flex flex-col items-center gap-1.5 bg-ink-800 border border-gold-500/20 rounded-xl py-4 px-1 hover:border-gold-500/60 transition-colors">
                <span className="text-2xl">{g.icon}</span>
                <span className="text-[11px] text-ivory/60 text-center leading-tight">{g.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'loading' && <CircularLoader accent={accent} onDone={() => setPhase('playing')} />}

      {phase === 'playing' && ChosenGame && (
        <ChosenGame onWin={() => setPhase('reward')} theme={theme} photos={photos} />
      )}

      {phase === 'reward' && (
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} className="text-6xl mb-4">🎉</motion.div>
          <p className="font-display text-2xl mb-6" style={{ color: accent }}>Bravo !</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setPhase('loading')} className="text-ink-950 text-sm font-semibold px-5 py-2.5 rounded-full" style={{ backgroundColor: accent }}>
              Rejouer
            </button>
            <button onClick={() => setPhase('select')} className="text-ivory/50 text-sm font-medium px-5 py-2.5 rounded-full border border-gold-500/20">
              Autres jeux
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
