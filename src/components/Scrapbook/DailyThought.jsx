import { motion } from 'framer-motion'

const FALLBACK_THOUGHTS = [
  "Chaque jour, une petite pensée pour toi.",
  "Reviens quand tu veux — ce petit coin t'appartient.",
  "Un sourire de plus aujourd'hui, grâce à ça ?",
  "Ce souvenir ne s'efface pas, même en revenant souvent.",
  "Prends un instant, rien que pour toi.",
]

function pickThought(thoughts, loveboxId) {
  const pool = thoughts && thoughts.length ? thoughts : FALLBACK_THOUGHTS
  const dayKey = new Date().toISOString().slice(0, 10) + (loveboxId || '')
  let hash = 0
  for (let i = 0; i < dayKey.length; i++) hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0
  return pool[hash % pool.length]
}

export default function DailyThought({ thoughts, loveboxId, accent }) {
  const thought = pickThought(thoughts, loveboxId)
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto rounded-xl px-4 py-3 text-center text-sm font-script text-lg"
      style={{ backgroundColor: `${accent}18`, color: accent }}
    >
      {thought}
    </motion.div>
  )
}
