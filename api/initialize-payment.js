import { getDb } from './_firebaseAdmin.js'
import { prepare, serverError, appUrl } from './_http.js'
import { buildTxRef, privateRef } from './_payment.js'
import { validateLovebox, TIERS, CURRENCY } from '../shared/lovebox.js'

// Cree la LOVEBOX cote serveur (le client n'a aucun droit d'ecriture Firestore)
// puis initialise le paiement Flutterwave. Le montant vient toujours du serveur.
export default async function handler(req, res) {
  if (!prepare(req, res)) return

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME
  const result = validateLovebox(req.body?.lovebox, { cloudName })
  if (result.errors) return res.status(400).json({ error: result.errors.join('. '), errors: result.errors })

  const { data, contact } = result
  const amount = TIERS[data.tier].priceXOF

  try {
    const db = getDb()
    const ref = db.collection('loveboxes').doc()
    const txRef = buildTxRef(ref.id)
    const batch = db.batch()
    batch.set(ref, { ...data, id: ref.id, paid: false, heartTouched: false, createdAt: new Date() })
    batch.set(privateRef(db, ref.id), { ...contact, txRef, amount, currency: CURRENCY })
    await batch.commit()

    const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
      body: JSON.stringify({
        tx_ref: txRef, amount, currency: CURRENCY,
        redirect_url: process.env.PAYMENT_REDIRECT_URL || `${appUrl()}/paiement/retour`,
        customer: { email: contact.creatorEmail },
        customizations: { title: 'LOVEBOX', description: `Formule ${TIERS[data.tier].name}` },
      }),
    })
    const flw = await flwRes.json().catch(() => ({}))
    if (!flwRes.ok || !flw.data?.link) throw new Error(`Flutterwave payments ${flwRes.status}: ${flw.message || 'pas de lien'}`)

    return res.status(200).json({ paymentLink: flw.data.link, loveboxId: ref.id })
  } catch (error) {
    return serverError(res, 'initialize-payment', error)
  }
}
