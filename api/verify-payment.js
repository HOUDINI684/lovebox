import { getDb } from './_firebaseAdmin.js'
import { sendMail } from './_mailer.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { transactionId } = req.body || {}
  if (!transactionId) return res.status(400).json({ error: 'transactionId requis' })

  try {
    const flwRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
    })
    const data = await flwRes.json()
    if (!flwRes.ok) throw new Error(data.message || 'Erreur verification')

    if (data.data.status === 'successful') {
      const loveboxId = data.data.tx_ref.split('_')[1]
      const db = getDb()
      await db.collection('loveboxes').doc(loveboxId).update({ paid: true, paidAt: new Date() })

      const snap = await db.collection('loveboxes').doc(loveboxId).get()
      const lovebox = snap.data()
      if (lovebox?.recipientEmail) {
        await sendMail({
          to: lovebox.recipientEmail,
          subject: 'Une LOVEBOX vous attend',
          html: `<p>Une LOVEBOX vous attend : <a href="${process.env.APP_URL}/box/${loveboxId}">Ouvrir ma LOVEBOX</a></p>`,
        })
      }
      return res.status(200).json({ success: true, loveboxId })
    }

    return res.status(200).json({ success: false, status: data.data.status })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
