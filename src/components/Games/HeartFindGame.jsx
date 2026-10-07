import { useState, useEffect } from 'react'

export default function HeartFindGame({ onWin }) {
  const [heartCell, setHeartCell] = useState(4)
  const [won, setWon] = useState(false)
  const [taps, setTaps] = useState(0)

  useEffect(() => {
    if (won) return
    const interval = setInterval(() => setHeartCell(Math.floor(Math.random() * 9)), 650)
    return () => clearInterval(interval)
  }, [won])

  const handleTap = (i) => {
    if (won) return
    setTaps((t) => t + 1)
    if (i === heartCell) { setWon(true); setTimeout(onWin, 700) }
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-1">Trouve le cœur qui bat</h2>
      <p className="text-ivory/40 text-sm mb-2">{won ? 'Trouvé ! 💗' : 'Il se cache et se déplace...'}</p>
      <p className="text-ivory/25 text-xs mb-6">Essais : {taps}</p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <button key={i} onClick={() => handleTap(i)} className="aspect-square rounded-xl bg-ink-800 border border-gold-500/20 flex items-center justify-center text-2xl">
            {i === heartCell ? '💗' : ''}
          </button>
        ))}
      </div>
    </div>
  )
}
