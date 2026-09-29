import { prepare, serverError, appUrl } from './_http.js'
import { confirmPayment } from './_payment.js'

// Appele par la page de retour Flutterwave. Le webhook fait le meme travail
// cote serveur : les deux sont idempotents, le premier arrive gagne.
export default async function handler(req, res) {
  if (!prepare(req, res)) return

  const transactionId = String(req.body?.transactionId ?? '')
  if (!/^\d{1,20}$/.test(transactionId)) return res.status(400).json({ error: 'transactionId invalide' })

  try {
    const { paid, loveboxId } = await confirmPayment(transactionId)
    if (!paid) return res.status(200).json({ paid: false })
    return res.status(200).json({ paid: true, loveboxId, shareUrl: `${appUrl()}/box/${loveboxId}` })
  } catch (error) {
    return serverError(res, 'verify-payment', error)
  }
}
