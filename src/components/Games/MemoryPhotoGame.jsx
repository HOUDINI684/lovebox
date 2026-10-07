import { useState, useMemo, useEffect } from 'react'

function optimizeCloudinaryImage(url, w = 200) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/q_auto,f_auto,w_${w}/`)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function MemoryPhotoGame({ onWin, theme, photos = [] }) {
  const accent = theme?.accent ?? '#D4AF37'
  const pairCount = Math.min(6, photos.length)
  const chosenPhotos = useMemo(() => shuffle(photos).slice(0, pairCount), [photos, pairCount])
  const cards = useMemo(
    () => shuffle(chosenPhotos.flatMap((p, i) => [{ id: i + 'a', photoIndex: i, url: p.url }, { id: i + 'b', photoIndex: i, url: p.url }])),
    [chosenPhotos]
  )
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped
      if (cards[a].photoIndex === cards[b].photoIndex) {
        setMatched((m) => [...m, cards[a].photoIndex])
        setTimeout(() => setFlipped([]), 500)
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }, [flipped, cards])

  useEffect(() => {
    if (chosenPhotos.length > 0 && matched.length === chosenPhotos.length) {
      setTimeout(onWin, 700)
    }
  }, [matched, chosenPhotos.length, onWin])

  const handleTap = (i) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(cards[i].photoIndex)) return
    setFlipped((f) => [...f, i])
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl text-ivory mb-1">Memory souvenirs</h2>
      <p className="text-ivory/40 text-sm mb-6">Retrouve les paires</p>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {cards.map((c, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(c.photoIndex)
          return (
            <button key={c.id} onClick={() => handleTap(i)} className="aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: isFlipped ? 'transparent' : accent }}>
              {isFlipped ? <img src={optimizeCloudinaryImage(c.url)} alt="" className="w-full h-full object-cover" /> : <span className="text-ink-950 text-xl flex items-center justify-center h-full">?</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
