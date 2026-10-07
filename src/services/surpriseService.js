import { API_BASE_URL } from '../config/api'

export async function markSurpriseRevealed(loveboxId) {
  const response = await fetch(`${API_BASE_URL}/api/surprise-revealed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loveboxId }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erreur serveur')
  return data
}
