import { motion } from 'framer-motion'

export default function GalleryModeSelect({ onSelect, theme }) {
  const accent = theme?.accent ?? '#FF3D68'
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0F0A12'}, ${theme?.bgTo ?? '#1B1220'})`

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: bg }}>
      <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl text-ivory mb-2">
        Comment veux-tu revivre ces souvenirs ?
      </motion.h2>
      <p className="text-ivory/40 text-sm mb-10">Choisis ton mode d'affichage</p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => onSelect('single')}
          className="rounded-2xl p-5 flex flex-col items-center gap-1 border border-white/10 bg-white/5"
        >
          <span className="text-2xl">🖐️</span>
          <span className="font-display text-base text-ivory">Une par une</span>
          <span className="text-xs text-ivory/50">À ton rythme, en touchant l'écran</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => onSelect('montage')}
          className="rounded-2xl p-5 flex flex-col items-center gap-1 border border-white/10"
          style={{ backgroundColor: `${accent}22` }}
        >
          <span className="text-2xl">🎬</span>
          <span className="font-display text-base text-ivory">Montage automatique</span>
          <span className="text-xs text-ivory/50">Les photos s'enchaînent seules</span>
        </motion.button>
      </div>
    </div>
  )
}
