import { motion } from 'framer-motion'

const BASE_TABS = [
  { id: 'photos', label: 'Photos', icon: '📸' },
  { id: 'letter', label: 'Lettre', icon: '💌' },
  { id: 'quiz', label: 'Quiz', icon: '💞', conditional: true },
  { id: 'game', label: 'Jeu', icon: '🎮' },
  { id: 'surprise', label: 'Surprise', icon: '🎁' },
]

// Un seul accent or : l'onglet actif est en or plein, les autres restent discrets.
export default function TabBar({ active, onChange, hasQuiz, accent = '#D4AF37' }) {
  const tabs = BASE_TABS.filter((t) => !t.conditional || hasQuiz)
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-ink-950/95 backdrop-blur border-t border-gold-500/25 flex justify-around py-2 px-1 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
    >
      {tabs.map((tab, i) => {
        const isActive = active === tab.id
        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            animate={{ scale: isActive ? 1.06 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl border"
            style={{
              background: isActive ? `linear-gradient(135deg, ${accent}, ${accent}CC)` : 'rgba(24,23,27,0.7)',
              borderColor: isActive ? accent : 'rgba(212,175,55,0.15)',
              boxShadow: isActive ? `0 6px 16px ${accent}40` : 'none',
            }}
          >
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
              className="text-xl"
              style={{ opacity: isActive ? 1 : 0.75 }}
            >
              {tab.icon}
            </motion.span>
            <span className="text-[10px] font-semibold tracking-wide" style={{ color: isActive ? '#0B0B0D' : 'rgba(243,238,227,0.55)' }}>
              {tab.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
