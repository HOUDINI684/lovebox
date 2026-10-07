import { useState, useMemo } from 'react'

function optimizeCloudinaryImage(url, w = 500) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/q_auto,f_auto,w_${w}/`)
}

const STEPS = [24, 14, 6, 0]

export default function PhotoMysteryGame({ onWin, theme, photos = [] }) {
  const accent = theme?.accent ?? '#D4AF37'
  const photo = useMemo(() => photos[Math.floor(Math.random() * photos.length)], [photos])
  const [step, setStep] = useState(0)

  const reveal = () => {
    if (step >= STEPS.length - 1) {
      setTimeout(onWin, 900)
      setStep(STEPS.length - 1)
      return
    }
    setStep((s) => s + 1)
  }

  if (!photo) return null

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-1">Photo mystère</h2>
      <p className="text-ivory/40 text-sm mb-6">Un souvenir se révèle petit à petit</p>
      <div className="w-56 h-56 mx-auto rounded-xl overflow-hidden shadow-xl mb-6">
        <img
          src={optimizeCloudinaryImage(photo.url)}
          alt=""
          className="w-full h-full object-cover transition-all duration-500"
          style={{ filter: `blur(${STEPS[step]}px)`, transform: `scale(${1 + STEPS[step] / 60})` }}
        />
      </div>
      <button onClick={reveal} className="text-ink-950 font-semibold px-6 py-3 rounded-full shadow-lg" style={{ backgroundColor: accent }}>
        {step >= STEPS.length - 1 ? "C'est ça ! ✨" : 'Révéler un peu plus'}
      </button>
    </div>
  )
}
