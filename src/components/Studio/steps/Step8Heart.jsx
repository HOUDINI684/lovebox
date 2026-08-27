import { motion } from 'framer-motion'
import StepNav from '../StepNav'

export default function Step8Heart() {
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Le cœur interactif</h2>
      <p className="text-ivory/40 mb-8">À la fin de sa LOVEBOX, votre destinataire pourra toucher un cœur battant, entouré de confettis. Vous recevrez une notification à cet instant précis.</p>
      <div className="flex justify-center py-8">
        <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} className="text-7xl">💗</motion.span>
      </div>
      <StepNav />
    </div>
  )
}
