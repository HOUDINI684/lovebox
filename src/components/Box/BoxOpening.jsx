import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BoxOpening({ onOpen, onStart, recipientName, theme }) {
  const [opening, setOpening] = useState(false)
  const speed = theme?.speed ?? 1
  const accent = theme?.accent ?? '#FF3D68'
  const accentHover = theme?.accentHover ?? '#E62356'

  const handleOpen = () => {
    if (opening) return
    setOpening(true)
    onStart?.()
    setTimeout(onOpen, 3000 * speed)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: `linear-gradient(180deg, ${theme?.bgFrom ?? '#0F0A12'}, ${theme?.bgTo ?? '#1B1220'})` }}
    >
      {!opening && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-ivory/50 text-sm tracking-widest uppercase mb-4"
        >
          Une surprise t'attend{recipientName ? `, ${recipientName}` : ''}…
        </motion.p>
      )}

      <motion.div
        animate={
          opening
            ? { scale: [1, 0.88, 1.2, 1.6], rotate: [0, -4, 8, 16], opacity: [1, 1, 1, 0] }
            : { scale: [1, 1.06, 1, 1.12, 1] }
        }
        transition={
          opening
            ? { duration: 3 * speed, ease: 'easeInOut', times: [0, 0.15, 0.55, 1] }
            : { duration: 1.1 * speed, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.4, 0.6, 1] }
        }
        className="text-8xl mb-10"
      >
        🎁
      </motion.div>

      {!opening && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleOpen}
          className="text-white font-semibold px-8 py-4 rounded-full text-base shadow-lg transition-colors"
          style={{ backgroundColor: accent, boxShadow: `0 8px 24px ${theme?.glow ?? 'rgba(255,61,104,0.3)'}` }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accent)}
        >
          Ouvrir ma LOVEBOX →
        </motion.button>
      )}
    </div>
  )
}
