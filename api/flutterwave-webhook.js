import { timingSafeEqual } from 'node:crypto'
import { prepare, serverError } from './_http.js'
import { confirmPayment } from './_payment.js'

function sameSecret(received, expected) {
  if (typeof received !== 'string' || !expected) return false
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Webhook Flutterwave (Dashboard > Settings > Webhooks), avec le "secret hash"
// identique a FLW_SECRET_HASH. Le corps n'est jamais cru : la transaction est
// re-verifiee via l'API Flutterwave dans confirmPayment.
export default async function handler(req, res) {
  if (!prepare(req, res, { cors: false })) return
  if (!sameSecret(req.headers['verif-hash'], process.env.FLW_SECRET_HASH)) {
    return res.status(401).json({ error: 'Signature invalide' })
  }

  const { event, data } = req.body || {}
  if (event !== 'charge.completed' || !data?.id) return res.status(200).json({ ignored: true })

  try {
    const { paid } = await confirmPayment(String(data.id))
    return res.status(200).json({ paid })
  } catch (error) {
    return serverError(res, 'flutterwave-webhook', error)
  }
}
