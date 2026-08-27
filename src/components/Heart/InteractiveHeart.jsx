import { useState } from 'react'
import { motion } from 'framer-motion'
import { registerHeartTouched } from '../../services/heartService'
import NameConfetti from './NameConfetti'

export default function InteractiveHeart({ loveboxId, theme, recipientName }) {
  const [touched, setTouched] = useState(false)
  const [burst, setBurst] = useState(0)
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0F0A12'}, ${theme?.bgTo ?? '#1B1220'})`
  const gold = theme?.accent ?? '#F2C14E'

  const handleTouch = async () => {
    setBurst((b) => b + 1)
    if (!touched) {
      setTouched(true)
      try {
        await registerHeartTouched(loveboxId)
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden" style={{ background: bg }}>
      {burst > 0 && <NameConfetti key={burst} name={recipientName} colors={theme?.confetti} />}

      <h2 className="font-display text-3xl text-ivory mb-10 relative z-10">
        {touched ? 'Merci pour ce moment' : 'Écoute cette musique'}
      </h2>

      {touched && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-night-700 to-night-900 border-4 border-night-600 flex items-center justify-center mb-8 relative z-10 shadow-xl"
        >
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: gold }} />
        </motion.div>
      )}

      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        onClick={handleTouch}
        className="text-8xl relative z-10 cursor-pointer"
      >
        💗
      </motion.div>
    </div>
  )
}
