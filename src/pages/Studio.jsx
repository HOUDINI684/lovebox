import { motion, AnimatePresence } from 'framer-motion'
import { useStudio } from '../hooks/useStudio'
import Step1Recipient from '../components/Studio/steps/Step1Recipient'
import Step2Occasion from '../components/Studio/steps/Step2Occasion'
import Step3Photos from '../components/Studio/steps/Step3Photos'
import Step4Video from '../components/Studio/steps/Step4Video'
import Step5AudioIntro from '../components/Studio/steps/Step5AudioIntro'
import Step6Letter from '../components/Studio/steps/Step6Letter'
import Step7AudioLetter from '../components/Studio/steps/Step7AudioLetter'
import Step8Interactivity from '../components/Studio/steps/Step8Interactivity'
import Step9Surprise from '../components/Studio/steps/Step9Surprise'

const STEPS = [Step1Recipient, Step2Occasion, Step3Photos, Step4Video, Step5AudioIntro, Step6Letter, Step7AudioLetter, Step8Interactivity, Step9Surprise]
const STEP_LABELS = ['Destinataire', 'Occasion', 'Photos', 'Vidéo', 'Musique', 'Lettre', 'Musique', 'Interactivité', 'Surprise']

export default function Studio() {
  const { currentStep, totalSteps } = useStudio()
  const StepComponent = STEPS[currentStep - 1]
  return (
    <div className="min-h-screen bg-ink-950">
      <div className="max-w-xl mx-auto px-6 pt-10 pb-24">
        <div className="flex items-center justify-between mb-2">
          <span className="font-script text-gold-400 text-xl">LOVEBOX</span>
          <span className="text-sm text-ivory/40">{STEP_LABELS[currentStep - 1]} · {currentStep}/{totalSteps}</span>
        </div>
        <div className="h-1.5 bg-ink-700 rounded-full mb-10 overflow-hidden">
          <motion.div className="h-full bg-gold-500 rounded-full" animate={{ width: `${(currentStep / totalSteps) * 100}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
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
