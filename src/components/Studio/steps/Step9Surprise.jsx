import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStudio } from '../../../hooks/useStudio'
import { createLovebox } from '../../../services/loveboxService'
import { CURRENCIES, formatAmount } from '../../../utils/format'
import StepNav from '../StepNav'

export default function Step9Surprise() {
  const { studioData, updateField } = useStudio()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFinish = async () => {
    setLoading(true); setError(null)
    try {
      const id = await createLovebox(studioData)
      navigate(`/created/${id}`)
    } catch (err) { setError(err.message); setLoading(false) }
  }

  const preview = formatAmount(studioData.surpriseAmount, studioData.surpriseCurrency)
  const amountWithoutTarget = studioData.surpriseAmount && !studioData.surpriseTarget

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">La surprise finale</h2>
      <p className="text-ivory/40 mb-6">
        Un cœur interactif attendra votre destinataire. Vous pouvez en plus y cacher une surprise à débloquer
        en tapant un nombre de fois précis — l'âge qu'iel vient d'avoir, par exemple.
      </p>
      <div className="flex justify-center py-4">
        <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} className="text-6xl">❤️</motion.span>
      </div>

      <label className="block mb-5">
        <span className="text-sm font-medium text-ivory/60 mb-1.5 block">Message final (optionnel)</span>
        <textarea value={studioData.finalMessage} onChange={(e) => updateField('finalMessage', e.target.value)} rows={2} placeholder="Merci pour ce moment..." className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory focus:outline-none focus:ring-2 focus:ring-gold-500/50 placeholder:text-ivory/25" />
      </label>

      <div className="border-t border-gold-500/20 pt-5 mb-5">
        <h3 className="font-display text-lg text-ivory mb-1">🎁 Surprise cachée (optionnel)</h3>
        <p className="text-ivory/40 text-sm mb-4">
          Si tu remplis ces champs, un coffre au trésor apparaîtra à la place du cœur simple — à débloquer en tapant
          le bon nombre de fois. Aucun vrai transfert d'argent n'est effectué par l'app : c'est une mise en scène,
          l'envoi reste à faire toi-même, en dehors de LOVEBOX.
        </p>

        <label className="block mb-3">
          <span className="text-sm font-medium text-ivory/60 mb-1.5 block">Nombre de tapes à atteindre</span>
          <input type="number" min="1" value={studioData.surpriseTarget} onChange={(e) => updateField('surpriseTarget', e.target.value)} placeholder="23" className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory focus:outline-none focus:ring-2 focus:ring-gold-500/50 placeholder:text-ivory/25" />
        </label>

        <div className="mb-3">
          <span className="text-sm font-medium text-ivory/60 mb-1.5 block">Montant promis</span>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={12}
              value={studioData.surpriseAmount}
              onChange={(e) => updateField('surpriseAmount', e.target.value.replace(/\D/g, ''))}
              placeholder="10000"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory focus:outline-none focus:ring-2 focus:ring-gold-500/50 placeholder:text-ivory/25"
            />
            <select
              value={studioData.surpriseCurrency}
              onChange={(e) => updateField('surpriseCurrency', e.target.value)}
              className="px-3 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {preview && <p className="text-xs text-ivory/40 mt-1.5">Affiché au destinataire : {preview}</p>}
          {amountWithoutTarget && <p className="text-xs text-danger mt-1">Renseigne aussi le nombre de tapes pour activer le coffre.</p>}
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ivory/60 mb-1.5 block">Numéro du destinataire <span className="text-ivory/30">(visible uniquement par toi)</span></span>
          <input type="tel" value={studioData.recipientPhone} onChange={(e) => updateField('recipientPhone', e.target.value)} placeholder="+229 00 00 00 00" className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory focus:outline-none focus:ring-2 focus:ring-gold-500/50 placeholder:text-ivory/25" />
        </label>
      </div>

      {error && <p className="text-sm text-danger mt-4">{error}</p>}
      <StepNav onNext={handleFinish} nextDisabled={loading} nextLabel={loading ? 'Création...' : 'Terminer'} />
    </div>
  )
}
