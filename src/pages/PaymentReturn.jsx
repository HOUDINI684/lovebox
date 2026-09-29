import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyFlutterwavePayment } from '../services/paymentService'
import { clearStudioDraft } from '../contexts/StudioContext'

// Page de retour Flutterwave : ?status=successful&tx_ref=...&transaction_id=...
export default function PaymentReturn() {
  const [params] = useSearchParams()
  const transactionId = params.get('transaction_id')
  const cancelled = params.get('status') === 'cancelled' || !transactionId
  const [state, setState] = useState(cancelled ? { status: 'cancelled' } : { status: 'loading' })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (cancelled) return
    verifyFlutterwavePayment(transactionId)
      .then((res) => {
        if (res.paid) { clearStudioDraft(); setState({ status: 'paid', shareUrl: res.shareUrl }) }
        else setState({ status: 'failed' })
      })
      .catch((err) => setState({ status: 'error', message: err.message }))
  }, [cancelled, transactionId])

  const copy = async () => {
    try { await navigator.clipboard.writeText(state.shareUrl); setCopied(true) } catch { /* copie manuelle */ }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-night-900 text-center px-6">
      <span className="font-script text-gold-500 text-2xl mb-6">LOVEBOX</span>
      {state.status === 'loading' && <p className="text-ivory/50">Vérification du paiement...</p>}
      {state.status === 'paid' && (
        <>
          <h1 className="font-display text-3xl text-ivory mb-3">Votre LOVEBOX est envoyée 💗</h1>
          <p className="text-ivory/40 mb-6">Le destinataire l'a reçue par email. Vous pouvez aussi partager ce lien :</p>
          <div className="w-full max-w-md flex gap-2">
            <input readOnly value={state.shareUrl} className="flex-1 px-4 py-3 rounded-xl border border-night-600 bg-night-800 text-ivory text-sm" onFocus={(e) => e.target.select()} />
            <button type="button" onClick={copy} className="px-5 rounded-xl bg-berry-500 text-white font-medium hover:bg-berry-600">{copied ? 'Copié' : 'Copier'}</button>
          </div>
        </>
      )}
      {(state.status === 'cancelled' || state.status === 'failed' || state.status === 'error') && (
        <>
          <h1 className="font-display text-3xl text-ivory mb-3">Paiement non confirmé</h1>
          <p className="text-ivory/40 mb-6">
            {state.status === 'cancelled' && 'Le paiement a été annulé.'}
            {state.status === 'failed' && "Le paiement n'a pas abouti. Aucun montant n'a été validé pour cette LOVEBOX."}
            {state.status === 'error' && state.message}
          </p>
          <Link to="/studio" className="text-berry-400 font-medium hover:text-berry-300">Retour au studio (votre brouillon est conservé)</Link>
        </>
      )}
    </div>
  )
}
