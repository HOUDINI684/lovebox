import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function optimizeCloudinaryImage(url, w = 400) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/q_auto,f_auto,w_${w}/`)
}

export default function CatalogGrid({ photos, theme }) {
  const [openIndex, setOpenIndex] = useState(null)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const accent = theme?.accent ?? '#D4AF37'

  const openPhoto = (i) => { setOpenIndex(i); setAnswerRevealed(false) }
  const close = () => setOpenIndex(null)
  const next = () => { setAnswerRevealed(false); setOpenIndex((i) => (i + 1) % photos.length) }
  const prev = () => { setAnswerRevealed(false); setOpenIndex((i) => (i - 1 + photos.length) % photos.length) }

  const photo = openIndex !== null ? photos[openIndex] : null

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p, i) => (
          <button key={i} onClick={() => openPhoto(i)} className="aspect-square rounded-lg overflow-hidden bg-ink-700">
            <img src={optimizeCloudinaryImage(p.url, 200)} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {photo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 bg-black/85 z-40 flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-ink-800 border border-gold-500/20 rounded-lg p-3 pb-6 max-w-sm w-full">
              <img src={optimizeCloudinaryImage(photo.url, 800)} alt="" className="w-full aspect-square object-cover rounded" />
              {photo.question && !answerRevealed && (
                <div className="mt-3 text-center">
                  <p className="text-ivory/70 text-sm mb-2">❓ {photo.question}</p>
                  <button onClick={() => setAnswerRevealed(true)} className="text-ink-950 text-xs font-semibold px-4 py-2 rounded-full" style={{ backgroundColor: accent }}>Voir la réponse</button>
                </div>
              )}
              {photo.caption && (!photo.question || answerRevealed) && (
                <p className="font-script text-lg text-ivory/70 mt-3 text-center">{photo.caption}</p>
              )}
              <div className="flex justify-between mt-4">
                <button onClick={prev} className="text-ivory/40 text-sm">← Précédente</button>
                <button onClick={close} className="text-ivory/40 text-sm">Fermer</button>
                <button onClick={next} className="text-ivory/40 text-sm">Suivante →</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
