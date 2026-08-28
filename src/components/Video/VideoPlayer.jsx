import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Insere des parametres d'optimisation Cloudinary dans l'URL (qualite auto,
// format auto, largeur plafonnee) pour un chargement beaucoup plus rapide,
// sans avoir a re-uploader le fichier.
function optimizeCloudinaryVideo(url) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', '/upload/q_auto,f_auto,w_720/')
}

export default function VideoPlayer({ url, onEnded, theme }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0F0A12'}, ${theme?.bgTo ?? '#1B1220'})`
  const accent = theme?.accent ?? '#FF3D68'
  const optimizedUrl = optimizeCloudinaryVideo(url)

  const handlePlay = () => {
    setPlaying(true)
    videoRef.current?.play()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: bg }}>
      <h2 className="font-display text-3xl text-ivory mb-8">Un message vidéo</h2>

      <div className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl shadow-black/40 bg-night-800">
        <video
          ref={videoRef}
          src={optimizedUrl}
          controls={playing}
          playsInline
          preload="auto"
          onEnded={onEnded}
          onCanPlay={() => setLoading(false)}
          onLoadedMetadata={(e) => { e.target.volume = 1 }}
          className="w-full block"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-night-800">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-white/20 rounded-full"
              style={{ borderTopColor: accent }}
            />
          </div>
        )}

        {!loading && !playing && (
          <button onClick={handlePlay} className="absolute inset-0 flex items-center justify-center bg-black/30">
            <motion.span
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white shadow-lg"
              style={{ backgroundColor: accent }}
            >
              ▶
            </motion.span>
          </button>
        )}
      </div>

      <button onClick={onEnded} className="mt-8 text-ivory/50 hover:text-ivory/80 text-sm font-medium transition-colors">
        Passer
      </button>
    </div>
  )
}