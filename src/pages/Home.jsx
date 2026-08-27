import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-night-900">
      <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-script text-gold-500 text-2xl mb-2">
        pour ceux qui comptent
      </motion.span>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }} className="font-display text-6xl md:text-7xl text-ivory tracking-tight mb-4">
        LOVEBOX
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.35 }} className="text-lg text-ivory/60 max-w-md mb-10">
        Offrez une émotion, pas seulement un cadeau. Photos, voix, lettre et musique, réunis dans un souvenir qu'on ouvre du bout du cœur.
      </motion.p>
      <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.55 }} onClick={() => navigate('/studio')} className="bg-berry-500 hover:bg-berry-600 text-white font-medium px-8 py-4 rounded-full text-lg shadow-lg shadow-berry-500/30 transition-colors">
        Créer une LOVEBOX
      </motion.button>
    </div>
  )
}
