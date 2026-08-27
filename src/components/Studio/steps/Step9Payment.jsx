import { useState } from 'react'
import { useStudio } from '../../../hooks/useStudio'
import { getAllTiers } from '../../../config/payment'
import { createLovebox } from '../../../services/loveboxService'
import { initializeFlutterwavePayment } from '../../../services/paymentService'
import StepNav from '../StepNav'

export default function Step9Payment() {
  const { studioData, updateField } = useStudio()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const tiers = getAllTiers()

  const handlePayment = async () => {
    setLoading(true); setError(null)
    try {
      const loveboxId = await createLovebox(studioData)
      const payment = await initializeFlutterwavePayment({ loveboxId, tier: studioData.tier, recipientEmail: studioData.recipientEmail })
      if (payment?.paymentLink) window.location.href = payment.paymentLink
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Choisissez votre formule</h2>
      <p className="text-ivory/40 mb-8">Dernière étape avant l'envoi.</p>
      <div className="grid gap-3">
        {tiers.map((tier) => {
          const active = studioData.tier === tier.id
          const isSignature = tier.id === 'signature'
          return (
            <button key={tier.id} type="button" onClick={() => updateField('tier', tier.id)} className={`text-left px-5 py-4 rounded-xl border transition-colors ${active ? (isSignature ? 'bg-violet-500 border-violet-500 text-white' : 'bg-berry-500 border-berry-500 text-white') : 'bg-night-800 border-night-600 hover:border-berry-400 text-ivory'}`}>
              <div className="flex items-center justify-between">
                <span className="font-display text-lg">{tier.name}</span>
                <span className="font-medium">{tier.priceXOF.toLocaleString('fr-FR')} XOF</span>
              </div>
              {tier.badge && <span className={`inline-block text-xs mt-1 px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : isSignature ? 'bg-gold-500/20 text-gold-500' : 'bg-berry-500/15 text-berry-400'}`}>{tier.badge}</span>}
              <p className={`text-sm mt-2 ${active ? 'text-white/80' : 'text-ivory/40'}`}>{tier.features.join(' · ')}</p>
            </button>
          )
        })}
      </div>
      {error && <p className="text-sm text-berry-400 mt-4">{error}</p>}
      <StepNav onNext={handlePayment} nextDisabled={loading} nextLabel={loading ? 'Chargement...' : 'Terminer'} />
    </div>
  )
}
