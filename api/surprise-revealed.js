import { getDb } from './_firebaseAdmin.js'
import { sendMail } from './_mailer.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { loveboxId } = req.body || {}
  if (!loveboxId) return res.status(400).json({ error: 'loveboxId requis' })

  try {
    const db = getDb()
    const ref = db.collection('loveboxes').doc(loveboxId)
    await ref.update({ surpriseRevealed: true, surpriseRevealedAt: new Date() })

    const snap = await ref.get()
    const lovebox = snap.data()
    if (lovebox?.creatorEmail) {
      await sendMail({
        to: lovebox.creatorEmail,
        subject: `${lovebox.recipientName || 'Le destinataire'} a ouvert le coffre 🎁`,
        html: `<p>${lovebox.recipientName || 'Le destinataire'} vient de debloquer la surprise de sa LOVEBOX.</p>`,
      })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
