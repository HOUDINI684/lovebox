import { useStudio } from '../../../hooks/useStudio'
import StepNav from '../StepNav'

const OCCASIONS = [
  { label: 'Anniversaire', emoji: '🎂' }, { label: 'Saint-Valentin', emoji: '💌' },
  { label: 'Anniversaire de couple', emoji: '💍' }, { label: 'Juste parce que', emoji: '✨' }, { label: 'Autre', emoji: '🎁' },
]

export default function Step2Occasion() {
  const { studioData, updateField } = useStudio()
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Quelle est l'occasion ?</h2>
      <p className="text-ivory/40 mb-8">Ça nous aide à donner le bon ton à l'expérience.</p>
      <div className="grid gap-3">
        {OCCASIONS.map(({ label, emoji }) => {
          const active = studioData.occasion === label
          return (
            <button key={label} type="button" onClick={() => updateField('occasion', label)} className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left font-medium transition-colors border ${active ? 'bg-berry-500 text-white border-berry-500' : 'bg-night-800 text-ivory border-night-600 hover:border-berry-400'}`}>
              <span className="text-xl">{emoji}</span>{label}
            </button>
          )
        })}
      </div>
      <StepNav nextDisabled={!studioData.occasion} />
    </div>
  )
}
