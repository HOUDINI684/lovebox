import { useState } from 'react'
import { useStudio } from '../../../hooks/useStudio'
import { useMediaUpload } from '../../../hooks/useMediaUpload'
import StepNav from '../StepNav'

export default function Step7AudioLetter() {
  const { studioData, updateField } = useStudio()
  const { uploadFile, uploading, progress, error } = useMediaUpload()
  const [consent, setConsent] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try { updateField('audioLetter', await uploadFile(file, 'audio')) } catch (err) { console.error(err) }
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Musique de la lettre</h2>
      <p className="text-ivory/40 mb-6">Optionnel — elle jouera pendant la lecture de votre lettre.</p>
      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        <span className="text-sm text-ivory/50">Je confirme avoir le droit d'utiliser ce fichier audio (musique personnelle, achetée, ou libre de droits).</span>
      </label>
      <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-10 transition-colors bg-ink-800 ${consent ? 'border-gold-500/20 cursor-pointer hover:border-gold-500/60' : 'border-gold-500/10 opacity-40 cursor-not-allowed'}`}>
        <span className="text-3xl">🎵</span>
        <span className="text-ivory/50 text-sm">Cliquez pour choisir un fichier audio</span>
        <input type="file" accept="audio/*" onChange={handleFile} disabled={!consent} className="hidden" />
      </label>
      {uploading && (
        <div className="mt-4">
          <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden"><div className="h-full bg-gold-500 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="text-sm text-ivory/40 mt-1">Upload en cours... {progress}%</p>
        </div>
      )}
      {error && <p className="text-sm text-danger mt-3">{error}</p>}
      {studioData.audioLetter && <p className="text-sm text-gold-400 mt-3">Musique ajoutée ✓</p>}
      <StepNav />
    </div>
  )
}
