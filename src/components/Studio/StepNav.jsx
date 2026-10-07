import { useStudio } from '../../hooks/useStudio'

export default function StepNav({ onNext, nextDisabled, nextLabel }) {
  const { currentStep, nextStep, prevStep, totalSteps } = useStudio()
  return (
    <div className="flex items-center justify-between mt-10">
      <button onClick={prevStep} disabled={currentStep === 1} type="button" className="px-5 py-2.5 rounded-full text-ivory/50 font-medium disabled:opacity-0 disabled:pointer-events-none hover:bg-ink-700 hover:text-ivory transition-colors">
        Précédent
      </button>
      <button onClick={onNext || nextStep} disabled={nextDisabled} type="button" className="px-7 py-3 rounded-full bg-gold-500 text-ink-950 font-medium shadow-lg shadow-gold-500/20 disabled:bg-ink-700 disabled:text-ivory/30 disabled:shadow-none hover:enabled:bg-gold-400 transition-colors">
        {nextLabel || (currentStep === totalSteps ? 'Terminer' : 'Suivant')}
      </button>
    </div>
  )
}
