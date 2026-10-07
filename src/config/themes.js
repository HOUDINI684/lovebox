// Quatre ambiances sombres et precieuses. Le destinataire choisit la sienne a chaque ouverture.
// speed < 1 = animations plus vives, speed > 1 = plus lentes et calmes.
export const THEMES = [
  {
    id: 'onyx', name: 'Onyx', icon: '🖤', description: 'Noir et or classique',
    bgFrom: '#0B0B0D', bgTo: '#17151A',
    accent: '#D4AF37', accentHover: '#E0BC4A', glow: 'rgba(212,175,55,0.28)', speed: 1,
    confetti: ['#D4AF37', '#E8D5A3', '#F3EEE3', '#B8962E'],
  },
  {
    id: 'bordeaux', name: 'Bordeaux', icon: '🍷', description: 'Profond et chaleureux',
    bgFrom: '#14080B', bgTo: '#2A1016',
    accent: '#D9B38C', accentHover: '#E6C4A2', glow: 'rgba(217,179,140,0.26)', speed: 0.85,
    confetti: ['#D9B38C', '#E8D5A3', '#8C2F3E', '#F3EEE3'],
  },
  {
    id: 'minuit', name: 'Minuit', icon: '🌙', description: 'Calme et étoilé',
    bgFrom: '#080C16', bgTo: '#111A2E',
    accent: '#C9B27C', accentHover: '#D8C48F', glow: 'rgba(201,178,124,0.26)', speed: 1.25,
    confetti: ['#C9B27C', '#E8D5A3', '#7C8DB5', '#F3EEE3'],
  },
  {
    id: 'emeraude', name: 'Émeraude', icon: '💎', description: 'Rare et précieux',
    bgFrom: '#07120D', bgTo: '#0E2218',
    accent: '#CDAA4A', accentHover: '#DDBA5A', glow: 'rgba(205,170,74,0.26)', speed: 1,
    confetti: ['#CDAA4A', '#E8D5A3', '#3F8F6B', '#F3EEE3'],
  },
]

export const DEFAULT_ACCENT = '#D4AF37'
export const DEFAULT_BG_FROM = '#0B0B0D'
export const DEFAULT_BG_TO = '#17151A'

export function getTheme(themeId) {
  return THEMES.find((t) => t.id === themeId) || THEMES[0]
}
