export const CURRENCIES = ['FCFA', 'EUR', 'USD']

// Montant + devise. Les anciennes LOVEBOX (texte libre, sans devise) s'affichent telles quelles.
export function formatAmount(amount, currency) {
  if (amount === undefined || amount === null || amount === '') return ''
  if (!currency) return String(amount)
  const digits = String(amount).replace(/\D/g, '')
  if (!digits) return ''
  return `${Number(digits).toLocaleString('fr-FR')} ${currency}`
}
