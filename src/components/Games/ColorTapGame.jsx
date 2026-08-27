import { useState, useEffect, useRef } from 'react'

const PALETTE = ['#FF3D68', '#38BDF8', '#F2C14E', '#8B5CF6', '#FF8A3D']

export default function ColorTapGame({ onComplete, theme }) {
  const target = theme?.accent ?? '#FF3D68'
  const [current, setCurrent] = useState(PALETTE[0])
  const [ready, setReady] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      setCurrent(next)
      setReady(next === target)
    }, 500)
    return () => clearInterval(intervalRef.current)
  }, [target])

  const handleTap = () => {
    if (ready) { clearInterval(intervalRef.current); onComplete() }
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-2">Tape au bon moment</h2>
      <p className="text-ivory/40 text-sm mb-8">Attends que le cercle prenne la couleur du thème</p>
      <button onClick={handleTap} className="w-32 h-32 rounded-full mx-auto block shadow-2xl transition-colors" style={{ backgroundColor: current }} />
      <button onClick={onComplete} className="mt-10 text-ivory/30 text-xs underline">Passer ce jeu</button>
    </div>
  )
}
