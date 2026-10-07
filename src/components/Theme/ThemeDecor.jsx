import { useMemo } from 'react'
import { motion } from 'framer-motion'

function rand(min, max) { return Math.random() * (max - min) + min }

// Fine poussiere d'or : chaque ambiance a son propre mouvement.
//  drift   = particules qui montent doucement / twinkle = etoiles qui scintillent
const DECOR = {
  onyx: { color: '#D4AF37', motion: 'drift' },
  bordeaux: { color: '#D9B38C', motion: 'drift' },
  minuit: { color: '#E8D5A3', motion: 'twinkle' },
  emeraude: { color: '#CDAA4A', motion: 'twinkle' },
}

export default function ThemeDecor({ themeId }) {
  const conf = DECOR[themeId] || DECOR.onyx
  const particles = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id: i, left: rand(0, 100), top: rand(0, 100), size: rand(1.5, 3.5), duration: rand(5, 11), delay: rand(0, 5),
  })), [])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0 }}
          animate={
            conf.motion === 'drift'
              ? { y: [0, -36], opacity: [0, 0.55, 0] }
              : { opacity: [0.05, 0.7, 0.05], scale: [0.8, 1.2, 0.8] }
          }
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: `${p.left}%`, top: `${p.top}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            backgroundColor: conf.color, boxShadow: `0 0 ${p.size * 3}px ${conf.color}`,
          }}
        />
      ))}
    </div>
  )
}
