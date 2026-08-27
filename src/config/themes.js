// Chaque theme change l'ambiance visuelle : couleurs et rythme des animations.
// La musique reste celle uploadee par le createur (elle a une signification propre,
// les themes ne la remplacent pas).
export const THEMES = [
  {
    id: 'nocturne', name: 'Nocturne', icon: '🌙', description: 'Intime et profond',
    bgFrom: '#0F0A12', bgTo: '#1B1220', accent: '#FF3D68', accentHover: '#E62356',
    glow: 'rgba(255, 61, 104, 0.3)', speed: 1,
    confetti: ['#FF3D68', '#F2C14E', '#8B5CF6', '#FF6B93'],
  },
  {
    id: 'aurore', name: 'Aurore', icon: '🌅', description: 'Chaleureux et vif',
    bgFrom: '#2D1B0E', bgTo: '#4A2A12', accent: '#FF8A3D', accentHover: '#E86F1F',
    glow: 'rgba(255, 138, 61, 0.3)', speed: 0.8,
    confetti: ['#FF8A3D', '#F2C14E', '#FF3D68', '#FFD27D'],
  },
  {
    id: 'ocean', name: 'Océan', icon: '🌊', description: 'Doux et apaisant',
    bgFrom: '#0A1626', bgTo: '#12283F', accent: '#38BDF8', accentHover: '#0EA5E9',
    glow: 'rgba(56, 189, 248, 0.3)', speed: 1.3,
    confetti: ['#38BDF8', '#8B5CF6', '#F5D68C', '#7DD3FC'],
  },
  {
    id: 'dore', name: 'Doré', icon: '✨', description: 'Élégant et précieux',
    bgFrom: '#151013', bgTo: '#241A12', accent: '#F2C14E', accentHover: '#D4A657',
    glow: 'rgba(242, 193, 78, 0.3)', speed: 1,
    confetti: ['#F2C14E', '#F5D68C', '#FF3D68', '#FFFFFF'],
  },
]

export function getTheme(themeId) {
  return THEMES.find((t) => t.id === themeId) || THEMES[0]
}
