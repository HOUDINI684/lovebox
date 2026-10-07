import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Created() {
  const { loveboxId } = useParams()
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/box/${loveboxId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ink-950">
      <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl mb-6">🎁</motion.span>
      <h1 className="font-display text-3xl text-ivory mb-2">Ta LOVEBOX est prête !</h1>
      <p className="text-ivory/50 mb-8 max-w-sm">Partage ce lien avec la personne à qui elle est destinée.</p>
      <div className="w-full max-w-sm bg-ink-800 border border-gold-500/20 rounded-xl px-4 py-3 mb-4 text-ivory/80 text-sm break-all">
        {shareUrl}
      </div>
      <button onClick={handleCopy} className="bg-gold-500 hover:bg-gold-400 text-ink-950 font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-gold-500/20 transition-colors mb-6">
        {copied ? 'Copié ✓' : 'Copier le lien'}
      </button>
      <Link to="/studio" className="text-ivory/40 text-sm hover:text-ivory/70">Créer une autre LOVEBOX</Link>
    </div>
  )
}
