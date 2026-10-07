import { motion } from 'framer-motion'

// burst : ouverture animee (lumiere + pieces) / staticOpen : coffre deja ouvert, sans animation
export default function TreasureChest({ intensity = 0, burst = false, staticOpen = false }) {
  const open = burst || staticOpen
  const shakeX = intensity * 6
  const shakeRotate = intensity * 4
  const shaking = !burst && intensity > 0

  return (
    <div className="relative flex items-center justify-center" style={{ perspective: 600 }}>
      {burst && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.5, 1.8] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FFEBB3, #F2C14E33, transparent 70%)' }}
        />
      )}

      <motion.div
        animate={
          burst
            ? { y: [0, -6, 0], scale: [1, 1.06, 1] }
            : shaking
              ? { x: [-shakeX, shakeX, -shakeX], rotate: [-shakeRotate, shakeRotate, -shakeRotate] }
              : { x: 0, rotate: 0 }
        }
        transition={{ duration: burst ? 0.5 : 0.18, repeat: shaking ? Infinity : 0, ease: 'easeInOut' }}
        className="relative w-40 h-32"
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-20 rounded-md"
          style={{
            background: 'linear-gradient(180deg, #8B5E34, #6B4423)',
            boxShadow: 'inset 0 -6px 10px rgba(0,0,0,0.25), inset 0 3px 4px rgba(255,255,255,0.15)',
          }}
        >
          <div className="absolute left-3 top-0 bottom-0 w-2" style={{ background: 'linear-gradient(180deg, #F2C14E, #C8941F)' }} />
          <div className="absolute right-3 top-0 bottom-0 w-2" style={{ background: 'linear-gradient(180deg, #F2C14E, #C8941F)' }} />
          <div
            className="absolute left-1/2 top-2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle at 35% 30%, #FFE08A, #C8941F)', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }}
          >
            <div className="w-1.5 h-2.5 rounded-sm bg-[#6B4423]" />
          </div>
        </div>

        {/* Tas d'or visible quand le coffre est ouvert */}
        <motion.div
          initial={false}
          animate={{ opacity: open ? 1 : 0, scaleY: open ? 1 : 0.3 }}
          transition={{ duration: 0.5, delay: open ? 0.2 : 0 }}
          className="absolute left-3 right-3 bottom-[4.9rem] h-8 origin-bottom"
          style={{
            borderRadius: '50% 50% 0 0',
            background: 'radial-gradient(circle at 50% 100%, #FFE9A8, #D4AF37 55%, #B8962E)',
            boxShadow: '0 -4px 16px rgba(255,224,138,0.65)',
          }}
        >
          <span className="absolute left-[22%] top-[28%] w-2.5 h-2.5 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #FFF3C4, #C8941F)' }} />
          <span className="absolute left-[48%] top-[10%] w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #FFF3C4, #C8941F)' }} />
          <span className="absolute left-[70%] top-[34%] w-2.5 h-2.5 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #FFF3C4, #C8941F)' }} />
        </motion.div>

        {/* Couvercle : se releve sur le cote, charniere en bas a gauche */}
        <motion.div
          initial={false}
          animate={open ? { rotate: -26, x: -6, y: -4 } : { rotate: 0, x: 0, y: 0 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
          className="absolute left-0 right-0 bottom-[4.4rem] h-14 rounded-t-full"
          style={{
            transformOrigin: 'left bottom',
            background: 'linear-gradient(180deg, #A9754A, #8B5E34)',
            boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.2), inset 0 3px 5px rgba(255,255,255,0.2)',
          }}
        >
          <div className="absolute left-3 top-0 bottom-0 w-2 rounded-t-full" style={{ background: 'linear-gradient(180deg, #F2C14E, #C8941F)' }} />
          <div className="absolute right-3 top-0 bottom-0 w-2 rounded-t-full" style={{ background: 'linear-gradient(180deg, #F2C14E, #C8941F)' }} />
        </motion.div>

        {burst &&
          Array.from({ length: 10 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
              animate={{
                opacity: [1, 1, 0],
                x: (Math.random() - 0.5) * 160,
                y: -60 - Math.random() * 70,
                scale: [0.6, 1, 0.8],
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1 + Math.random() * 0.4, ease: 'easeOut' }}
              className="absolute left-1/2 top-2 w-3 h-3 rounded-full"
              style={{ background: 'radial-gradient(circle at 35% 30%, #FFE08A, #C8941F)' }}
            />
          ))}
      </motion.div>
    </div>
  )
}
