import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Insere des parametres d'optimisation Cloudinary (qualite auto, format auto,
// largeur plafonnee) pour un chargement rapide meme sur un appareil sans cache.
function optimizeCloudinaryImage(url) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', '/upload/q_auto,f_auto,w_800/')
}

export default function PolaroidGallery({ photos = [], onNext, theme, mode = 'single' }) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const timerRef = useRef(null)
  const accent = theme?.accent ?? '#FF3D68'
  const speed = theme?.speed ?? 1
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0F0A12'}, ${theme?.bgTo ?? '#1B1220'})`

  const PHOTO_FILTERS = {
    ocean: 'saturate(1.1) hue-rotate(-8deg) brightness(0.95) contrast(1.05)',
    aurore: 'saturate(1.25) sepia(0.18) hue-rotate(-6deg) brightness(1.02)',
    dore: 'saturate(1.1) sepia(0.25) contrast(1.05)',
    nocturne: 'saturate(0.92) contrast(1.05) brightness(0.96)',
  }
  const photoFilter = PHOTO_FILTERS[theme?.id] || 'none'

  const isLast = index === photos.length - 1
  const photo = photos[index]

  useEffect(() => {
    setLoaded(false)
  }, [index])

  const advance = () => {
    if (isLast) onNext()
    else setIndex((i) => i + 1)
  }

  // Mode montage : avance automatiquement une fois la photo chargee, sans besoin de toucher l'ecran
  useEffect(() => {
    if (mode !== 'montage' || photos.length === 0 || !loaded) return
    timerRef.current = setTimeout(advance, 3000 * speed)
    return () => clearTimeout(timerRef.current)
  }, [mode, index, photos.length, speed, loaded])

  if (photos.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: bg }}>
        <button onClick={onNext} className="text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-colors" style={{ backgroundColor: accent }}>
          Continuer
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={mode === 'single' ? advance : undefined}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 select-none"
      style={{ background: bg, cursor: mode === 'single' ? 'pointer' : 'default' }}
    >
      <h2 className="font-display text-2xl text-ivory mb-8">Vos souvenirs</h2>

      <div className="relative w-full max-w-sm aspect-square bg-ivory p-3 pb-8 shadow-2xl shadow-black/50 rounded-sm">
        <div className="relative w-full h-full overflow-hidden bg-night-700">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-7 h-7 border-2 border-night-600 rounded-full"
                style={{ borderTopColor: accent }}
              />
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={optimizeCloudinaryImage(photo.url)}
              alt={photo.caption || ''}
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onLoad={() => setLoaded(true)}
              className="w-full h-full object-cover"
              style={{ filter: photoFilter }}
            />
          </AnimatePresence>
        </div>
      </div>

      {photo.caption && (
        <motion.p key={`cap-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-script text-xl text-ivory/70 mt-4 text-center max-w-sm">
          {photo.caption}
        </motion.p>
      )}

      <div className="flex items-center gap-2 mt-10">
        {photos.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: i <= index ? accent : 'rgba(245,237,240,0.25)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {i < photos.length - 1 && <span className="w-6 h-px" style={{ backgroundColor: i < index ? accent : 'rgba(245,237,240,0.15)' }} />}
          </div>
        ))}
      </div>

      {mode === 'single' && (
        <p className="text-ivory/30 text-xs mt-6 tracking-wide uppercase">
          {isLast ? 'Touchez pour continuer' : 'Touchez pour la suite'}
        </p>
      )}
    </div>
  )
}