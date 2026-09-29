// Source unique des formules et de la validation d'une LOVEBOX.
// Importe a la fois par le front (Vite) et par les fonctions Vercel (api/) :
// ne doit dependre ni de import.meta.env ni de process.env.

export const TIERS = {
  classic: {
    id: 'classic', name: 'Classic', priceXOF: 4999,
    features: ['10 Polaroïds', '1 musique', 'Lettre'],
    limits: { photos: 10, musics: 1, video: false },
  },
  premium: {
    id: 'premium', name: 'Premium', priceXOF: 9999,
    features: ['25 Polaroïds', '2 musiques', 'Vidéo', 'Lettre'], badge: 'Populaire',
    limits: { photos: 25, musics: 2, video: true },
  },
  signature: {
    id: 'signature', name: 'Signature', priceXOF: 24999,
    features: ['Illimité', 'Vidéo custom', 'Support prioritaire'], badge: 'Premium',
    limits: { photos: 200, musics: 2, video: true },
  },
}

export const CURRENCY = 'XOF'

export const MAX_LENGTHS = { name: 60, email: 254, occasion: 60, letter: 5000, caption: 80 }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  return typeof value === 'string' && value.length <= MAX_LENGTHS.email && EMAIL_RE.test(value)
}

export function isCloudinaryUrl(value, cloudName) {
  if (typeof value !== 'string') return false
  const prefix = cloudName ? `https://res.cloudinary.com/${cloudName}/` : 'https://res.cloudinary.com/'
  return value.startsWith(prefix)
}

function optionalString(value, max) {
  if (value == null || value === '') return ''
  if (typeof value !== 'string') return null
  return value.length <= max ? value.trim() : null
}

// Valide et normalise les donnees du Studio.
// Retourne { data } si tout est valide, sinon { errors: string[] }.
// `data` ne contient que les champs publics (lisibles par le destinataire) ;
// les emails sont renvoyes a part dans `contact` pour etre stockes en prive.
export function validateLovebox(input, { cloudName } = {}) {
  const errors = []
  const src = input && typeof input === 'object' ? input : {}

  const tier = TIERS[src.tier]
  if (!tier) errors.push('Formule inconnue')

  const recipientName = optionalString(src.recipientName, MAX_LENGTHS.name)
  if (!recipientName) errors.push('Prénom du destinataire requis (60 caractères max)')

  if (!isValidEmail(src.recipientEmail)) errors.push('Email du destinataire invalide')
  if (!isValidEmail(src.creatorEmail)) errors.push('Votre email est invalide')

  const occasion = optionalString(src.occasion, MAX_LENGTHS.occasion)
  if (occasion === null) errors.push('Occasion invalide')

  const letter = optionalString(src.letter, MAX_LENGTHS.letter)
  if (letter === null) errors.push(`Lettre trop longue (${MAX_LENGTHS.letter} caractères max)`)

  const photos = Array.isArray(src.photos) ? src.photos : null
  if (!photos || photos.length === 0) errors.push('Au moins une photo est requise')
  const cleanPhotos = (photos || []).map((p) => ({
    url: p?.url,
    caption: optionalString(p?.caption, MAX_LENGTHS.caption),
  }))
  if (cleanPhotos.some((p) => !isCloudinaryUrl(p.url, cloudName) || p.caption === null)) {
    errors.push('Photo invalide')
  }

  const media = { video: src.video || null, audioIntro: src.audioIntro || null, audioLetter: src.audioLetter || null }
  for (const [key, url] of Object.entries(media)) {
    if (url && !isCloudinaryUrl(url, cloudName)) errors.push(`Média invalide (${key})`)
  }

  if (tier) {
    const { limits } = tier
    if (cleanPhotos.length > limits.photos) {
      errors.push(`La formule ${tier.name} est limitée à ${limits.photos} photos`)
    }
    const musics = [media.audioIntro, media.audioLetter].filter(Boolean).length
    if (musics > limits.musics) {
      errors.push(`La formule ${tier.name} est limitée à ${limits.musics} musique`)
    }
    if (media.video && !limits.video) {
      errors.push(`La formule ${tier.name} n'inclut pas la vidéo`)
    }
  }

  if (errors.length) return { errors }
  return {
    data: { tier: tier.id, recipientName, occasion, letter, photos: cleanPhotos, ...media },
    contact: { recipientEmail: src.recipientEmail.trim(), creatorEmail: src.creatorEmail.trim() },
  }
}

// Formules compatibles avec le contenu deja saisi (utilise pour griser les autres).
export function compatibleTiers(input) {
  return Object.values(TIERS).filter((t) => {
    const musics = [input.audioIntro, input.audioLetter].filter(Boolean).length
    return (input.photos?.length ?? 0) <= t.limits.photos && musics <= t.limits.musics && (!input.video || t.limits.video)
  })
}
