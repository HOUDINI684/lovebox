import { API_BASE_URL } from '../config/api'

async function callApi(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erreur serveur')
  return data
}

export async function initializeFlutterwavePayment(paymentData) {
  return callApi('/api/initialize-payment', paymentData)
}
export async function verifyFlutterwavePayment(transactionId) {
  return callApi('/api/verify-payment', { transactionId })
}
