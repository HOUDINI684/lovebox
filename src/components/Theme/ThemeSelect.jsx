import { motion } from 'framer-motion'
import { THEMES } from '../../config/themes'

export default function ThemeSelect({ onSelect, recipientName }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-night-900 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl text-ivory mb-2"
      >
        Une LOVEBOX t'attend{recipientName ? `, ${recipientName}` : ''}
      </motion.h2>
      <p className="text-ivory/40 text-sm mb-10">Choisis l'ambiance de ton expérience</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {THEMES.map((theme, i) => (
          <motion.button
            key={theme.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(theme)}
            className="rounded-2xl p-5 flex flex-col items-center gap-2 border border-white/10 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
              boxShadow: `0 8px 24px ${theme.glow}`,
            }}
          >
            <span className="text-3xl">{theme.icon}</span>
            <span className="font-display text-base text-ivory">{theme.name}</span>
            <span className="text-xs text-ivory/50">{theme.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
