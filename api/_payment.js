import { getDb } from './_firebaseAdmin.js'
import { sendMail } from './_mailer.js'
import { appUrl, escapeHtml, isLoveboxId } from './_http.js'
import { CURRENCY } from '../shared/lovebox.js'

export const TX_PREFIX = 'lovebox'

export function buildTxRef(loveboxId) {
  return `${TX_PREFIX}_${loveboxId}_${Date.now()}`
}

export function parseTxRef(txRef) {
  const [prefix, loveboxId] = String(txRef || '').split('_')
  return prefix === TX_PREFIX && isLoveboxId(loveboxId) ? loveboxId : null
}

export function privateRef(db, loveboxId) {
  return db.collection('loveboxes').doc(loveboxId).collection('private').doc('meta')
}

async function fetchTransaction(transactionId) {
  const res = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Flutterwave verify ${res.status}: ${body.message || 'erreur'}`)
  return body.data
}

// Verifie une transaction aupres de Flutterwave (jamais sur la foi du client)
// et marque la LOVEBOX comme payee. Idempotent : les emails ne partent qu'une fois,
// meme si le webhook et la page de retour appellent en parallele.
// Retourne { paid, loveboxId, reason? }.
export async function confirmPayment(transactionId) {
  const tx = await fetchTransaction(transactionId)
  const loveboxId = parseTxRef(tx?.tx_ref)
  if (!loveboxId) return { paid: false, loveboxId: null, reason: 'tx_ref inconnu' }
  if (tx.status !== 'successful') return { paid: false, loveboxId, reason: `statut ${tx.status}` }

  const db = getDb()
  const publicDoc = db.collection('loveboxes').doc(loveboxId)
  const metaDoc = privateRef(db, loveboxId)

  const outcome = await db.runTransaction(async (t) => {
    const [pub, meta] = await Promise.all([t.get(publicDoc), t.get(metaDoc)])
    if (!pub.exists || !meta.exists) return { paid: false, reason: 'LOVEBOX introuvable' }
    const m = meta.data()
    if (m.txRef !== tx.tx_ref) return { paid: false, reason: 'tx_ref ne correspond pas' }
    if (tx.currency !== CURRENCY || Number(tx.amount) < m.amount) {
      return { paid: false, reason: `montant invalide (${tx.amount} ${tx.currency}, attendu ${m.amount} ${CURRENCY})` }
    }
    if (pub.data().paid) return { paid: true, newlyPaid: false, meta: m }
    t.update(publicDoc, { paid: true, paidAt: new Date() })
    t.update(metaDoc, { flwTransactionId: String(tx.id), paidAmount: Number(tx.amount) })
    return { paid: true, newlyPaid: true, meta: m, recipientName: pub.data().recipientName }
  })

  if (!outcome.paid) {
    console.warn(`[LOVEBOX] Paiement refuse pour ${loveboxId}: ${outcome.reason}`)
    return { paid: false, loveboxId, reason: outcome.reason }
  }

  if (outcome.newlyPaid) {
    const link = `${appUrl()}/box/${loveboxId}`
    const name = escapeHtml(outcome.recipientName)
    await Promise.allSettled([
      sendMail({
        to: outcome.meta.recipientEmail,
        subject: 'Une LOVEBOX vous attend',
        html: `<p>${name}, une LOVEBOX vous attend : <a href="${link}">Ouvrir ma LOVEBOX</a></p>`,
      }),
      sendMail({
        to: outcome.meta.creatorEmail,
        subject: 'Votre LOVEBOX est prête',
        html: `<p>Paiement confirmé. La LOVEBOX de ${name} a été envoyée.</p><p>Lien à partager : <a href="${link}">${link}</a></p>`,
      }),
    ]).then((results) => results
      .filter((r) => r.status === 'rejected')
      .forEach((r) => console.error('[LOVEBOX] Email non envoye:', r.reason)))
  }
  return { paid: true, loveboxId }
}
