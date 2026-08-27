import { useStudio } from '../../hooks/useStudio'

export default function StepNav({ onNext, nextDisabled, nextLabel }) {
  const { currentStep, nextStep, prevStep } = useStudio()
  return (
    <div className="flex items-center justify-between mt-10">
      <button onClick={prevStep} disabled={currentStep === 1} type="button" className="px-5 py-2.5 rounded-full text-ivory/50 font-medium disabled:opacity-0 disabled:pointer-events-none hover:bg-night-700 hover:text-ivory transition-colors">
        Précédent
      </button>
      <button onClick={onNext || nextStep} disabled={nextDisabled} type="button" className="px-7 py-3 rounded-full bg-berry-500 text-white font-medium shadow-lg shadow-berry-500/30 disabled:bg-night-700 disabled:text-ivory/30 disabled:shadow-none hover:enabled:bg-berry-600 transition-colors">
        {nextLabel || (currentStep === 9 ? 'Terminer' : 'Suivant')}
      </button>
    </div>
  )
}
