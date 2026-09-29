// Utilitaires communs aux fonctions Vercel : CORS restreint, methode, erreurs.

function allowedOrigins() {
  return [process.env.APP_URL, ...(process.env.ALLOWED_ORIGINS || '').split(',')]
    .map((o) => (o || '').trim().replace(/\/$/, ''))
    .filter(Boolean)
}

// Gere CORS + preflight + controle de methode. Retourne false si la requete est deja traitee.
export function prepare(req, res, { method = 'POST', cors = true } = {}) {
  if (cors) {
    const origin = req.headers?.origin
    if (origin && allowedOrigins().includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
      res.setHeader('Access-Control-Allow-Methods', `${method}, OPTIONS`)
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    }
    if (req.method === 'OPTIONS') { res.status(204).end(); return false }
  }
  if (req.method !== method) { res.status(405).json({ error: 'Method not allowed' }); return false }
  return true
}

// Ne renvoie jamais le detail d'une erreur interne au client.
export function serverError(res, context, error) {
  console.error(`[LOVEBOX] ${context}:`, error)
  return res.status(500).json({ error: 'Erreur serveur, merci de réessayer.' })
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

export function appUrl() {
  return (process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '')
}

// Les IDs Firestore auto-generes sont alphanumeriques (20 caracteres).
export function isLoveboxId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9]{10,40}$/.test(value)
}
