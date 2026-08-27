import { getDb } from './_firebaseAdmin.js'

const TIER_PRICES_XOF = { classic: 4999, premium: 9999, signature: 24999 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { loveboxId, tier, recipientEmail } = req.body || {}
  if (!loveboxId || !tier) return res.status(400).json({ error: 'loveboxId et tier requis' })

  const amount = TIER_PRICES_XOF[tier] || TIER_PRICES_XOF.classic
  const txRef = `lovebox_${loveboxId}_${Date.now()}`

  try {
    const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
      body: JSON.stringify({
        tx_ref: txRef, amount, currency: 'XOF',
        redirect_url: process.env.PAYMENT_REDIRECT_URL || 'http://localhost:5173/studio',
        customer: { email: recipientEmail || 'client@lovebox.app' },
        customizations: { title: 'LOVEBOX', description: `Formule ${tier}` },
      }),
    })
    const data = await flwRes.json()
    if (!flwRes.ok) throw new Error(data.message || 'Erreur Flutterwave')

    const db = getDb()
    await db.collection('loveboxes').doc(loveboxId).update({ txRef, tier, amount })

    return res.status(200).json({ paymentLink: data.data.link, txRef })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
