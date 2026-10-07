import { useStudio } from '../../../hooks/useStudio'
import { useMediaUpload } from '../../../hooks/useMediaUpload'
import StepNav from '../StepNav'

const PRESET_QUESTIONS = [
  'Où étions-nous ?',
  'Quel jour c\'était ?',
  'Qui a pris cette photo ?',
  "Qu'est-ce qu'on faisait juste avant ?",
  'Qu\'est-ce qui te fait rire sur cette photo ?',
  "Quelle était l'occasion ?",
]

export default function Step3Photos() {
  const { studioData, updateField } = useStudio()
  const { uploadFile, uploading, progress, error } = useMediaUpload()

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files)
    const urls = []
    for (const file of files) {
      try { urls.push({ url: await uploadFile(file, 'photo'), caption: '', question: '', isCover: false }) } catch (err) { console.error(err) }
    }
    const merged = [...studioData.photos, ...urls]
    // La premiere photo devient la couverture par defaut si aucune n'est encore choisie
    if (merged.length > 0 && !merged.some((p) => p.isCover)) merged[0] = { ...merged[0], isCover: true }
    updateField('photos', merged)
  }

  const updatePhoto = (index, field, value) => {
    const next = studioData.photos.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    updateField('photos', next)
  }

  const setCover = (index) => {
    const next = studioData.photos.map((p, i) => ({ ...p, isCover: i === index }))
    updateField('photos', next)
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Ajoutez vos Polaroïds</h2>
      <p className="text-ivory/40 mb-8">Les photos qui racontent votre histoire. Ajoutez une anecdote, et si tu veux, une petite question à deviner avant.</p>
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gold-500/20 rounded-2xl py-10 cursor-pointer hover:border-gold-500/60 transition-colors bg-ink-800">
        <span className="text-3xl">📸</span>
        <span className="text-ivory/50 text-sm">Cliquez pour choisir vos photos</span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      </label>
      {uploading && (
        <div className="mt-4">
          <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden"><div className="h-full bg-gold-500 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="text-sm text-ivory/40 mt-1">Upload en cours... {progress}%</p>
        </div>
      )}
      {error && <p className="text-sm text-danger mt-3">{error}</p>}
      {studioData.photos.length > 0 && (
        <div className="grid gap-4 mt-5">
          {studioData.photos.map((photo, i) => (
            <div key={i} className="flex gap-3 bg-ink-800 border border-gold-500/20 rounded-xl p-3">
              <img src={photo.url} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <input type="text" value={photo.caption} onChange={(e) => updatePhoto(i, 'caption', e.target.value)} placeholder="Anecdote (optionnel)" maxLength={80} className="bg-transparent text-ivory text-sm px-1 py-1 focus:outline-none placeholder:text-ivory/25 border-b border-gold-500/10" />
                <input type="text" value={photo.question} onChange={(e) => updatePhoto(i, 'question', e.target.value)} placeholder="Question à deviner (optionnel)" maxLength={80} className="bg-transparent text-ivory text-sm px-1 py-1 focus:outline-none placeholder:text-ivory/25" />
                <div className="flex flex-wrap gap-1 mt-1">
                  {PRESET_QUESTIONS.map((q) => (
                    <button key={q} type="button" onClick={() => updatePhoto(i, 'question', q)} className="text-[11px] px-2 py-1 rounded-full bg-ink-700 text-ivory/50 hover:bg-gold-500/15">
                      {q}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setCover(i)} className={`self-start text-[11px] px-2 py-1 rounded-full mt-1 font-medium ${photo.isCover ? 'bg-gold-500 text-ink-950' : 'bg-ink-700 text-ivory/50 hover:bg-gold-500/15'}`}>
                  {photo.isCover ? '★ Photo de couverture' : '☆ Utiliser comme fond'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-ivory/30 mt-3">{studioData.photos.length} photo(s) ajoutée(s)</p>
      <StepNav nextDisabled={studioData.photos.length === 0} />
    </div>
  )
}
