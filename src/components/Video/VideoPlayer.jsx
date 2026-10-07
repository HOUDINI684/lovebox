import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

function optimizeCloudinaryVideo(url) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', '/upload/q_auto,f_auto,w_480/')
}

function getYouTubeEmbed(url) {
  const patterns = [/youtu\.be\/([^?&]+)/, /youtube\.com\/watch\?v=([^?&]+)/, /youtube\.com\/embed\/([^?&]+)/]
  for (const re of patterns) {
    const match = url.match(re)
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0`
  }
  return null
}

function getVimeoEmbed(url) {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? `https://player.vimeo.com/video/${match[1]}` : null
}

export default function VideoPlayer({ url, onEnded, theme }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0B0B0D'}, ${theme?.bgTo ?? '#17151A'})`
  const accent = theme?.accent ?? '#D4AF37'

  const youtubeEmbed = getYouTubeEmbed(url)
  const vimeoEmbed = getVimeoEmbed(url)
  const embedUrl = youtubeEmbed || vimeoEmbed

  const handlePlay = () => { setPlaying(true); videoRef.current?.play() }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: bg }}>
      <h2 className="font-display text-3xl text-ivory mb-8">Un message vidéo</h2>

      {embedUrl ? (
        <div className="w-full max-w-lg aspect-video rounded-xl overflow-hidden shadow-xl shadow-black/40">
          <iframe src={embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      ) : (
        <div className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-xl shadow-black/40 bg-ink-700">
          <video ref={videoRef} src={optimizeCloudinaryVideo(url)} controls={playing} playsInline preload="auto" onEnded={onEnded} onCanPlay={() => setLoading(false)} onLoadedMetadata={(e) => { e.target.volume = 1 }} className="w-full block" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-700">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-gold-500/20 rounded-full" style={{ borderTopColor: accent }} />
            </div>
          )}
          {!loading && !playing && (
            <button onClick={handlePlay} className="absolute inset-0 flex items-center justify-center bg-black/35">
              <motion.span whileTap={{ scale: 0.9 }} className="w-20 h-20 rounded-full flex items-center justify-center text-3xl text-ink-950 shadow-lg" style={{ backgroundColor: accent }}>▶</motion.span>
            </button>
          )}
        </div>
      )}

      <button onClick={onEnded} className="mt-8 text-ivory/50 hover:text-ivory/80 text-sm font-medium transition-colors">Passer</button>
    </div>
  )
}
