import { useStudio } from '../../../hooks/useStudio'
import StepNav from '../StepNav'

export default function Step1Recipient() {
  const { studioData, updateField } = useStudio()
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Pour qui est cette LOVEBOX ?</h2>
      <p className="text-ivory/40 mb-8">On commence par la personne qui va l'ouvrir.</p>
      <label className="block mb-5">
        <span className="text-sm font-medium text-ivory/60 mb-1.5 block">Prénom du destinataire</span>
        <input type="text" value={studioData.recipientName} onChange={(e) => updateField('recipientName', e.target.value)} placeholder="Awa, Kevin, Marie..." className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory focus:outline-none focus:ring-2 focus:ring-gold-500/50 placeholder:text-ivory/25" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ivory/60 mb-1.5 block">Ton email (optionnel — pour être notifié)</span>
        <input type="email" value={studioData.creatorEmail} onChange={(e) => updateField('creatorEmail', e.target.value)} placeholder="toi@email.com" className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory focus:outline-none focus:ring-2 focus:ring-gold-500/50 placeholder:text-ivory/25" />
      </label>
      <StepNav nextDisabled={!studioData.recipientName} />
    </div>
  )
}
