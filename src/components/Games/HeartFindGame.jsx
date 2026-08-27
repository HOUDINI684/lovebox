import { useState, useEffect } from 'react'

export default function HeartFindGame({ onComplete }) {
  const [heartCell, setHeartCell] = useState(4)
  const [won, setWon] = useState(false)

  useEffect(() => {
    if (won) return
    const interval = setInterval(() => setHeartCell(Math.floor(Math.random() * 9)), 650)
    return () => clearInterval(interval)
  }, [won])

  const handleTap = (i) => {
    if (won) return
    if (i === heartCell) {
      setWon(true)
      setTimeout(onComplete, 900)
    }
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-2">Trouve le cœur qui bat</h2>
      <p className="text-ivory/40 text-sm mb-8">{won ? 'Trouvé ! 💗' : 'Il se cache et se déplace...'}</p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleTap(i)}
            className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl"
          >
            {i === heartCell ? '💗' : ''}
          </button>
        ))}
      </div>
      {!won && <button onClick={onComplete} className="mt-8 text-ivory/30 text-xs underline">Passer ce jeu</button>}
    </div>
  )
}
