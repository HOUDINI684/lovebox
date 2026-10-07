import { useRef, useEffect, useState } from 'react'

const MESSAGES = [
  'Tu illumines chaque journée.',
  'Ton sourire vaut tous les trésors.',
  'Chaque moment avec toi compte double.',
  "Tu es exactement là où tu dois être : dans un cœur qui t'aime.",
]

export default function ScratchCardGame({ onWin, theme }) {
  const canvasRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const accent = theme?.accent ?? '#D4AF37'
  const message = useRef(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
  const scratchedCount = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = accent
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0B0B0D'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Gratte-moi ✨', canvas.width / 2, canvas.height / 2)
  }, [accent])

  const scratch = (e) => {
    if (revealed) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    const point = e.touches ? e.touches[0] : e
    const x = (point.clientX - rect.left) * (canvas.width / rect.width)
    const y = (point.clientY - rect.top) * (canvas.height / rect.height)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    ctx.fill()
    scratchedCount.current += 1
    if (scratchedCount.current > 40) {
      setRevealed(true)
      setTimeout(onWin, 1200)
    }
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-1">Carte à gratter</h2>
      <p className="text-ivory/40 text-sm mb-6">Gratte avec le doigt (ou la souris)</p>
      <div className="relative w-64 h-32 mx-auto rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center bg-ink-800 px-4">
          <p className="font-script text-xl text-ivory">{message.current}</p>
        </div>
        <canvas
          ref={canvasRef}
          width={256}
          height={128}
          onMouseMove={(e) => e.buttons === 1 && scratch(e)}
          onTouchMove={scratch}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none"
        />
      </div>
    </div>
  )
}
