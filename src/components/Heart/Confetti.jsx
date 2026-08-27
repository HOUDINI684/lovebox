import { useMemo } from 'react'
import { motion } from 'framer-motion'

const DEFAULT_COLORS = ['#FF3D68', '#F2C14E', '#8B5CF6', '#FF6B93', '#F5D68C']

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export default function Confetti({ count = 70, colors }) {
  const palette = colors && colors.length ? colors : DEFAULT_COLORS
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: randomBetween(0, 100),
        color: palette[i % palette.length],
        width: randomBetween(6, 11),
        height: randomBetween(10, 16),
        duration: randomBetween(2.4, 4.2),
        delay: randomBetween(0, 0.8),
        rotateStart: randomBetween(0, 360),
        rotateEnd: randomBetween(360, 900) * (Math.random() > 0.5 ? 1 : -1),
        drift: randomBetween(-80, 80),
      })),
    [count, palette]
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: '-10vh', x: 0, opacity: 1, rotate: p.rotateStart }}
          animate={{ y: '110vh', x: p.drift, opacity: [1, 1, 0], rotate: p.rotateEnd }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.4, 0.1, 0.6, 1] }}
          style={{ position: 'absolute', left: `${p.left}%`, top: 0, width: p.width, height: p.height, backgroundColor: p.color, borderRadius: 2 }}
        />
      ))}
    </div>
  )
}
