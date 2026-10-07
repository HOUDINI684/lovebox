import { useState } from 'react'
import PolaroidGallery from '../Gallery/PolaroidGallery'
import CatalogGrid from '../Gallery/CatalogGrid'
import VideoPlayer from '../Video/VideoPlayer'

export default function PhotosTab({ photos, video, theme }) {
  const [mode, setMode] = useState('single')
  const [showVideo, setShowVideo] = useState(false)
  const accent = theme?.accent ?? '#D4AF37'

  if (showVideo) {
    return (
      <div className="relative">
        <button onClick={() => setShowVideo(false)} className="mb-4 text-ivory/50 text-sm underline">← Retour aux photos</button>
        <VideoPlayer url={video} theme={theme} onEnded={() => setShowVideo(false)} />
      </div>
    )
  }

  const pill = (id, label) => (
    <button onClick={() => setMode(id)} className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors" style={{ backgroundColor: mode === id ? accent : 'rgba(24,23,27,0.9)', color: mode === id ? '#0B0B0D' : 'rgba(243,238,227,0.55)', border: '1px solid rgba(212,175,55,0.25)' }}>
      {label}
    </button>
  )

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        {pill('single', '🖐️ Une par une')}
        {pill('catalog', '🗂️ Catalogue')}
        {video && (
          <button onClick={() => setShowVideo(true)} className="px-4 py-1.5 rounded-full text-xs font-medium bg-ink-800 text-ivory/50 border border-gold-500/20">
            🎥 Voir la vidéo
          </button>
        )}
      </div>
      {mode === 'catalog' ? <CatalogGrid photos={photos} theme={theme} /> : <PolaroidGallery photos={photos} theme={theme} />}
    </div>
  )
}
