import { useState, useEffect, useRef, useMemo } from 'react'

const OTHER_COLORS = ['#8C2F3E', '#7C8DB5', '#3F8F6B', '#F3EEE3']

export default function ColorTapGame({ onWin, theme }) {
  const target = theme?.accent ?? '#D4AF37'
  const PALETTE = useMemo(() => [target, ...OTHER_COLORS], [target])
  const [current, setCurrent] = useState(OTHER_COLORS[0])
  const [ready, setReady] = useState(false)
  const [misses, setMisses] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      setCurrent(next)
      setReady(next === target)
    }, 500)
    return () => clearInterval(intervalRef.current)
  }, [target, PALETTE])

  const handleTap = () => {
    if (ready) { clearInterval(intervalRef.current); onWin() }
    else setMisses((m) => m + 1)
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-1">Tape au bon moment</h2>
      <p className="text-ivory/40 text-sm mb-2">Attends que le cercle prenne la couleur du thème</p>
      <p className="text-ivory/25 text-xs mb-6">Ratés : {misses}</p>
      <button onClick={handleTap} className="w-32 h-32 rounded-full mx-auto block shadow-xl transition-colors" style={{ backgroundColor: current }} />
    </div>
  )
}
