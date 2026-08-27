export const PAYMENT_CONFIG = {
  TIERS: {
    classic: { id: 'classic', name: 'Classic', priceXOF: 4999, features: ['10 Polaroïds', '1 musique', 'Lettre'] },
    premium: { id: 'premium', name: 'Premium', priceXOF: 9999, features: ['25 Polaroïds', '2 musiques', 'Vidéo', 'Lettre'], badge: 'Populaire' },
    signature: { id: 'signature', name: 'Signature', priceXOF: 24999, features: ['Illimité', 'Vidéo custom', 'Support prioritaire'], badge: 'Premium' },
  },
}
export const getAllTiers = () => Object.values(PAYMENT_CONFIG.TIERS)
