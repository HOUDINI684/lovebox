import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TypewriterCaption from './TypewriterCaption'

function optimizeCloudinaryImage(url) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', '/upload/q_auto,f_auto,w_800/')
}

const ROTATIONS = [-3, 2, -2, 3, -4, 2]

export default function PolaroidGallery({ photos = [], theme }) {
  const [index, setIndex] = useState(0)
  const [loadedIndex, setLoadedIndex] = useState(-1)
  const [revealedIndex, setRevealedIndex] = useState(-1)
  const [direction, setDirection] = useState(1)
  const accent = theme?.accent ?? '#D4AF37'

  const photo = photos[index]
  // L'etat est rattache a l'index de la photo (et non remis a zero par un effet) :
  // une image deja en cache qui se charge instantanement s'affiche donc correctement.
  const loaded = loadedIndex === index
  const answerRevealed = revealedIndex === index

  const advance = (dir = 1) => {
    setDirection(dir)
    setIndex((i) => (i + 1) % photos.length)
  }

  if (photos.length === 0) {
    return <p className="text-ivory/40 text-sm text-center py-16">Aucune photo ajoutée.</p>
  }

  const handleDragEnd = (e, info) => {
    if (info.offset.x < -80 || info.velocity.x < -400) advance(1)
    else if (info.offset.x > 80 || info.velocity.x > 400) { setDirection(-1); setIndex((i) => (i - 1 + photos.length) % photos.length) }
  }

  return (
    <div className="flex flex-col items-center px-2 select-none">
      <div className="flex gap-1.5 w-full max-w-sm mb-6">
        {photos.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-ivory/15 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: accent }} animate={{ width: i === index ? '100%' : '0%' }} transition={{ duration: 0.2 }} />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-sm aspect-square">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            drag="x"
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: direction * 60, rotate: ROTATIONS[index % ROTATIONS.length] }}
            animate={{ opacity: 1, x: 0, rotate: ROTATIONS[index % ROTATIONS.length] }}
            exit={{ opacity: 0, x: direction * -260, rotate: direction * -20 }}
            transition={{ duration: 0.4 }}
            onClick={() => advance(1)}
            className="absolute inset-0 bg-paper-100 p-3 pb-8 shadow-xl shadow-black/40 rounded-sm cursor-grab active:cursor-grabbing"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#E4DDCC]">
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-7 h-7 border-2 border-gold-500/20 rounded-full" style={{ borderTopColor: accent }} />
                </div>
              )}
              <img src={optimizeCloudinaryImage(photo.url)} alt={photo.caption || ''} onLoad={() => setLoadedIndex(index)} style={{ opacity: loaded ? 1 : 0 }} className="w-full h-full object-cover transition-opacity duration-300" draggable={false} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {photo.question && !answerRevealed && (
        <div className="mt-6 text-center max-w-sm">
          <p className="text-ivory/70 text-sm mb-2">❓ {photo.question}</p>
          <button onClick={(e) => { e.stopPropagation(); setRevealedIndex(index) }} className="text-ink-950 text-xs font-semibold px-4 py-2 rounded-full" style={{ backgroundColor: accent }}>
            Voir la réponse
          </button>
        </div>
      )}

      {photo.caption && (!photo.question || answerRevealed) && (
        <TypewriterCaption key={`cap-${index}`} text={photo.caption} className="font-script text-xl text-ivory/70 mt-6 text-center max-w-sm min-h-[1.75rem]" />
      )}

      <p className="text-ivory/30 text-xs mt-6 tracking-wide uppercase">Glisse pour voir la suite</p>
    </div>
  )
}
