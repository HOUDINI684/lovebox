import { describe, it, expect } from 'vitest'
import { validateLovebox, compatibleTiers } from '../shared/lovebox.js'

const img = (n) => ({ url: `https://res.cloudinary.com/demo/image/upload/p${n}.jpg`, caption: '' })
const base = {
  tier: 'classic', recipientName: ' Awa ', recipientEmail: 'awa@example.com', creatorEmail: 'moi@example.com',
  occasion: 'Anniversaire', letter: 'Bonjour', photos: [img(1)], video: null, audioIntro: null, audioLetter: null,
}

describe('validateLovebox', () => {
  it('accepte une LOVEBOX valide et separe les emails', () => {
    const { data, contact, errors } = validateLovebox(base, { cloudName: 'demo' })
    expect(errors).toBeUndefined()
    expect(data.recipientName).toBe('Awa')
    expect(data).not.toHaveProperty('recipientEmail')
    expect(contact).toEqual({ recipientEmail: 'awa@example.com', creatorEmail: 'moi@example.com' })
  })

  it('refuse une formule inconnue au lieu de basculer sur classic', () => {
    expect(validateLovebox({ ...base, tier: 'gratuit' }).errors).toContain('Formule inconnue')
  })

  it('refuse les medias hors Cloudinary (ex. javascript:)', () => {
    expect(validateLovebox({ ...base, photos: [{ url: 'javascript:alert(1)' }] }).errors).toContain('Photo invalide')
    expect(validateLovebox({ ...base, tier: 'premium', video: 'https://evil.com/v.mp4' }).errors).toContain('Média invalide (video)')
  })

  it("restreint au compte Cloudinary configure", () => {
    expect(validateLovebox(base, { cloudName: 'autre' }).errors).toContain('Photo invalide')
  })

  it('applique les limites de formule', () => {
    const photos = Array.from({ length: 11 }, (_, i) => img(i))
    expect(validateLovebox({ ...base, photos }).errors[0]).toMatch(/10 photos/)
    expect(validateLovebox({ ...base, video: img(0).url }).errors[0]).toMatch(/vidéo/)
    expect(validateLovebox({ ...base, audioIntro: img(0).url, audioLetter: img(1).url }).errors[0]).toMatch(/musique/)
    expect(validateLovebox({ ...base, tier: 'premium', photos, video: img(0).url }).errors).toBeUndefined()
  })

  it('exige des emails valides', () => {
    expect(validateLovebox({ ...base, creatorEmail: 'pas-un-email' }).errors).toContain('Votre email est invalide')
  })
})

describe('compatibleTiers', () => {
  it('exclut classic quand une video est presente', () => {
    expect(compatibleTiers({ ...base, video: 'x' }).map((t) => t.id)).toEqual(['premium', 'signature'])
  })
})
