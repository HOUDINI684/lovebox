import { useStudio } from '../../../hooks/useStudio'
import StepNav from '../StepNav'

const DESIGNS = [
  { id: 'classique', name: 'Classique', preview: 'bg-paper-100 text-ink-900', sample: 'Aa' },
  { id: 'manuscrite', name: 'Manuscrite', preview: 'bg-paper-200 text-ink-900', sample: 'Aa' },
  { id: 'moderne', name: 'Moderne', preview: 'bg-ink-800 text-ivory border border-gold-500/30', sample: 'Aa' },
]

export default function Step6Letter() {
  const { studioData, updateField } = useStudio()
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Écrivez votre lettre</h2>
      <p className="text-ivory/40 mb-6">Le cœur de la LOVEBOX. Prenez votre temps.</p>
      <div className="flex gap-3 mb-6">
        {DESIGNS.map((d) => (
          <button key={d.id} type="button" onClick={() => updateField('letterDesign', d.id)} className={`flex-1 rounded-xl p-3 text-center border-2 transition-colors ${studioData.letterDesign === d.id ? 'border-gold-500' : 'border-transparent'}`}>
            <div className={`rounded-lg py-3 mb-1 font-script text-lg ${d.preview}`}>{d.sample}</div>
            <span className="text-xs text-ivory/50">{d.name}</span>
          </button>
        ))}
      </div>
      <textarea value={studioData.letter} onChange={(e) => updateField('letter', e.target.value)} rows={10} placeholder="Écrivez ce que vous ressentez..." className="w-full px-5 py-4 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory font-script text-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-gold-500/50 placeholder:text-ivory/25 placeholder:font-sans placeholder:text-base" />
      <StepNav nextDisabled={!studioData.letter.trim()} />
    </div>
  )
}
