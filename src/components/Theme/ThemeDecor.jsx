import { useMemo } from 'react'
import { motion } from 'framer-motion'

function rand(min, max) { return Math.random() * (max - min) + min }

export default function ThemeDecor({ themeId }) {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: rand(0, 100),
    top: rand(0, 100),
    size: rand(2, 5),
    duration: rand(3, 7),
    delay: rand(0, 3),
  })), [])

  if (themeId === 'ocean') {
    const bubbles = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
      id: i, left: rand(0, 100), size: rand(6, 16), duration: rand(6, 12), delay: rand(0, 5),
    })), [])
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {bubbles.map((b) => (
          <motion.span
            key={b.id}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.5, 0] }}
            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: `${b.left}%`, width: b.size, height: b.size, borderRadius: '50%', border: '1px solid rgba(125,211,252,0.4)' }}
          />
        ))}
        <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <motion.path
            fill="#38BDF8"
            animate={{ d: ['M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z', 'M0,40 C300,10 900,90 1200,40 L1200,120 L0,120 Z', 'M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    )
  }

  if (themeId === 'aurore') {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,138,61,0.4), transparent 70%)' }}
        />
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -40, opacity: [0, 0.6, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
            style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, borderRadius: '50%', backgroundColor: '#FFD27D' }}
          />
        ))}
      </div>
    )
  }

  if (themeId === 'dore') {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
            style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, borderRadius: '50%', backgroundColor: '#F2C14E', boxShadow: '0 0 6px #F2C14E' }}
          />
        ))}
      </div>
    )
  }

  // nocturne par defaut : etoiles scintillantes
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
          style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, borderRadius: '50%', backgroundColor: '#F5EDF0' }}
        />
      ))}
    </div>
  )
}
