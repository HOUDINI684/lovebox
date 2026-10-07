import { useState } from 'react'
import { useStudio } from '../../../hooks/useStudio'
import StepNav from '../StepNav'

const OCCASIONS = [
  { label: 'Anniversaire', emoji: '🎂' },
  { label: 'Saint-Valentin', emoji: '💌' },
  { label: 'Anniversaire de couple', emoji: '💍' },
  { label: 'Juste parce que', emoji: '✨' },
]

export default function Step2Occasion() {
  const { studioData, updateField } = useStudio()
  const [customMode, setCustomMode] = useState(false)
  const isPreset = OCCASIONS.some((o) => o.label === studioData.occasion)
  const showCustomInput = customMode || (studioData.occasion && !isPreset)

  const selectPreset = (label) => { setCustomMode(false); updateField('occasion', label) }
  const selectAutre = () => { setCustomMode(true); updateField('occasion', '') }

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Quelle est l'occasion ?</h2>
      <p className="text-ivory/40 mb-8">Ça nous aide à donner le bon ton à l'expérience.</p>
      <div className="grid gap-3">
        {OCCASIONS.map(({ label, emoji }) => {
          const active = studioData.occasion === label && !showCustomInput
          return (
            <button key={label} type="button" onClick={() => selectPreset(label)} className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left font-medium transition-colors border ${active ? 'bg-gold-500 text-ink-950 border-gold-500' : 'bg-ink-800 text-ivory border-gold-500/20 hover:border-gold-500/60'}`}>
              <span className="text-xl">{emoji}</span>{label}
            </button>
          )
        })}
        <button type="button" onClick={selectAutre} className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left font-medium transition-colors border ${showCustomInput ? 'bg-gold-500 text-ink-950 border-gold-500' : 'bg-ink-800 text-ivory border-gold-500/20 hover:border-gold-500/60'}`}>
          <span className="text-xl">🎁</span>Autre
        </button>
        {showCustomInput && (
          <input type="text" autoFocus value={studioData.occasion} onChange={(e) => updateField('occasion', e.target.value)} placeholder="Écris ton occasion..." className="w-full px-4 py-3 rounded-xl border border-gold-500/70 bg-ink-800 text-ivory focus:outline-none placeholder:text-ivory/25" />
        )}
      </div>
      <StepNav nextDisabled={!studioData.occasion.trim()} />
    </div>
  )
}
