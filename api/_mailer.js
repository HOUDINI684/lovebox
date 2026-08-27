import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
  }
  return transporter
}

export async function sendMail({ to, subject, html }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('[LOVEBOX] Email ignore (pas de config Gmail) ->', { to, subject })
    return
  }
  await getTransporter().sendMail({ from: `LOVEBOX <${process.env.GMAIL_USER}>`, to, subject, html })
}
