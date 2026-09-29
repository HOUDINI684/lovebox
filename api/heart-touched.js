import { getDb } from './_firebaseAdmin.js'
import { sendMail } from './_mailer.js'
import { prepare, serverError, escapeHtml, isLoveboxId } from './_http.js'
import { privateRef } from './_payment.js'

// Notifie le createur une seule fois : les appels suivants sont sans effet,
// ce qui empeche d'utiliser l'endpoint pour spammer une adresse.
export default async function handler(req, res) {
  if (!prepare(req, res)) return

  const { loveboxId } = req.body || {}
  if (!isLoveboxId(loveboxId)) return res.status(400).json({ error: 'loveboxId invalide' })

  try {
    const db = getDb()
    const ref = db.collection('loveboxes').doc(loveboxId)
    const outcome = await db.runTransaction(async (t) => {
      const [pub, meta] = await Promise.all([t.get(ref), t.get(privateRef(db, loveboxId))])
      if (!pub.exists || !pub.data().paid) return { found: false }
      if (pub.data().heartTouched) return { found: true, notify: false }
      t.update(ref, { heartTouched: true, heartTouchedAt: new Date() })
      return { found: true, notify: true, name: pub.data().recipientName, to: meta.data()?.creatorEmail }
    })

    if (!outcome.found) return res.status(404).json({ error: 'LOVEBOX introuvable' })
    if (outcome.notify && outcome.to) {
      const name = escapeHtml(outcome.name || 'Le destinataire')
      await sendMail({
        to: outcome.to,
        subject: `${outcome.name || 'Le destinataire'} a touché le cœur`,
        html: `<p>${name} vient d'ouvrir son cœur sur sa LOVEBOX.</p>`,
      })
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    return serverError(res, 'heart-touched', error)
  }
}
