import { useStudio } from '../../../hooks/useStudio'
import StepNav from '../StepNav'

export default function Step6Letter() {
  const { studioData, updateField } = useStudio()
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Écrivez votre lettre</h2>
      <p className="text-ivory/40 mb-8">Le cœur de la LOVEBOX. Prenez votre temps.</p>
      <textarea maxLength={5000} value={studioData.letter} onChange={(e) => updateField('letter', e.target.value)} rows={10} placeholder="Écrivez ce que vous ressentez..." className="w-full px-5 py-4 rounded-xl border border-night-600 bg-night-800 text-ivory font-script text-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-berry-400 placeholder:text-ivory/25 placeholder:font-sans placeholder:text-base" />
      <StepNav nextDisabled={!studioData.letter.trim()} />
    </div>
  )
}
