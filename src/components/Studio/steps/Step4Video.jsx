import { useState } from 'react'
import { useStudio } from '../../../hooks/useStudio'
import { useMediaUpload } from '../../../hooks/useMediaUpload'
import StepNav from '../StepNav'

export default function Step4Video() {
  const { studioData, updateField } = useStudio()
  const { uploadFile, uploading, progress, error } = useMediaUpload()
  const [mode, setMode] = useState(studioData.videoType || 'upload')

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadFile(file, 'video')
      updateField('video', url)
      updateField('videoType', 'upload')
    } catch (err) { console.error(err) }
  }

  const handleLinkChange = (e) => { updateField('video', e.target.value); updateField('videoType', 'link') }
  const switchMode = (m) => { setMode(m); updateField('video', null); updateField('videoType', m) }

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Ajoutez une vidéo</h2>
      <p className="text-ivory/40 mb-6">Optionnel — un message filmé rend l'instant encore plus vivant.</p>
      <div className="flex gap-2 mb-5">
        <button type="button" onClick={() => switchMode('upload')} className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${mode === 'upload' ? 'bg-gold-500 text-ink-950' : 'bg-ink-800 text-ivory/50 border border-gold-500/20'}`}>Uploader un fichier</button>
        <button type="button" onClick={() => switchMode('link')} className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${mode === 'link' ? 'bg-gold-500 text-ink-950' : 'bg-ink-800 text-ivory/50 border border-gold-500/20'}`}>Lien (YouTube, etc.)</button>
      </div>
      {mode === 'upload' ? (
        <>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gold-500/20 rounded-2xl py-10 cursor-pointer hover:border-gold-500/60 transition-colors bg-ink-800">
            <span className="text-3xl">🎥</span>
            <span className="text-ivory/50 text-sm">Cliquez pour choisir une vidéo</span>
            <input type="file" accept="video/*" onChange={handleFile} className="hidden" />
          </label>
          {uploading && (
            <div className="mt-4">
              <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden"><div className="h-full bg-gold-500 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
              <p className="text-sm text-ivory/40 mt-1">Upload en cours... {progress}%</p>
            </div>
          )}
          {error && <p className="text-sm text-danger mt-3">{error}</p>}
        </>
      ) : (
        <input type="url" value={studioData.videoType === 'link' ? studioData.video || '' : ''} onChange={handleLinkChange} placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-ink-800 text-ivory focus:outline-none focus:ring-2 focus:ring-gold-500/50 placeholder:text-ivory/25" />
      )}
      {studioData.video && <p className="text-sm text-gold-400 mt-3">Vidéo ajoutée ✓</p>}
      <StepNav nextLabel="Suivant" />
    </div>
  )
}
