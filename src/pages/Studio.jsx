import { motion, AnimatePresence } from 'framer-motion'
import { useStudio } from '../hooks/useStudio'
import Step1Recipient from '../components/Studio/steps/Step1Recipient'
import Step2Occasion from '../components/Studio/steps/Step2Occasion'
import Step3Photos from '../components/Studio/steps/Step3Photos'
import Step4Video from '../components/Studio/steps/Step4Video'
import Step5AudioIntro from '../components/Studio/steps/Step5AudioIntro'
import Step6Letter from '../components/Studio/steps/Step6Letter'
import Step7AudioLetter from '../components/Studio/steps/Step7AudioLetter'
import Step8Heart from '../components/Studio/steps/Step8Heart'
import Step9Payment from '../components/Studio/steps/Step9Payment'

const STEPS = [Step1Recipient, Step2Occasion, Step3Photos, Step4Video, Step5AudioIntro, Step6Letter, Step7AudioLetter, Step8Heart, Step9Payment]
const STEP_LABELS = ['Destinataire', 'Occasion', 'Photos', 'Vidéo', 'Musique', 'Lettre', 'Musique', 'Cœur', 'Formule']

export default function Studio() {
  const { currentStep } = useStudio()
  const StepComponent = STEPS[currentStep - 1]
  return (
    <div className="min-h-screen bg-night-900">
      <div className="max-w-xl mx-auto px-6 pt-10 pb-24">
        <div className="flex items-center justify-between mb-2">
          <span className="font-script text-gold-500 text-xl">LOVEBOX</span>
          <span className="text-sm text-ivory/40">{STEP_LABELS[currentStep - 1]} · {currentStep}/9</span>
        </div>
        <div className="h-1.5 bg-night-700 rounded-full mb-10 overflow-hidden">
          <motion.div className="h-full bg-berry-500 rounded-full" animate={{ width: `${(currentStep / 9) * 100}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
