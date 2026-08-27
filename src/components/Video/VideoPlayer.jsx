export default function VideoPlayer({ url, onEnded, theme }) {
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0F0A12'}, ${theme?.bgTo ?? '#1B1220'})`
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: bg }}>
      <h2 className="font-display text-3xl text-ivory mb-8">Un message vidéo</h2>
      <video
        src={url}
        controls
        autoPlay
        onEnded={onEnded}
        onLoadedMetadata={(e) => { e.target.volume = 1 }}
        className="w-full max-w-lg rounded-xl shadow-2xl shadow-black/40"
      />
      <button onClick={onEnded} className="mt-8 text-ivory/50 hover:text-ivory/80 text-sm font-medium transition-colors">
        Passer
      </button>
    </div>
  )
}
