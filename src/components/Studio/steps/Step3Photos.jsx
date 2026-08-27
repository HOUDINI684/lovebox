import { useStudio } from '../../../hooks/useStudio'
import { useMediaUpload } from '../../../hooks/useMediaUpload'
import StepNav from '../StepNav'

export default function Step3Photos() {
  const { studioData, updateField } = useStudio()
  const { uploadFile, uploading, progress, error } = useMediaUpload()

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files)
    const urls = []
    for (const file of files) {
      try { urls.push({ url: await uploadFile(file, 'photo'), caption: '' }) } catch (err) { console.error(err) }
    }
    updateField('photos', [...studioData.photos, ...urls])
  }

  const updateCaption = (index, caption) => {
    const next = studioData.photos.map((p, i) => (i === index ? { ...p, caption } : p))
    updateField('photos', next)
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Ajoutez vos Polaroïds</h2>
      <p className="text-ivory/40 mb-8">Les photos qui racontent votre histoire. Ajoutez une petite anecdote si vous voulez.</p>

      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-night-600 rounded-2xl py-10 cursor-pointer hover:border-berry-400 transition-colors bg-night-800">
        <span className="text-3xl">📸</span>
        <span className="text-ivory/50 text-sm">Cliquez pour choisir vos photos</span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      </label>

      {uploading && (
        <div className="mt-4">
          <div className="h-1.5 bg-night-700 rounded-full overflow-hidden"><div className="h-full bg-berry-500 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="text-sm text-ivory/40 mt-1">Upload en cours... {progress}%</p>
        </div>
      )}
      {error && <p className="text-sm text-berry-400 mt-3">{error}</p>}

      {studioData.photos.length > 0 && (
        <div className="grid gap-3 mt-5">
          {studioData.photos.map((photo, i) => (
            <div key={i} className="flex items-center gap-3 bg-night-800 border border-night-600 rounded-xl p-2">
              <img src={photo.url} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
              <input
                type="text"
                value={photo.caption}
                onChange={(e) => updateCaption(i, e.target.value)}
                placeholder="Anecdote (optionnel)"
                maxLength={80}
                className="flex-1 bg-transparent text-ivory text-sm px-2 py-1 focus:outline-none placeholder:text-ivory/25"
              />
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-ivory/30 mt-3">{studioData.photos.length} photo(s) ajoutée(s)</p>

      <StepNav nextDisabled={studioData.photos.length === 0} />
    </div>
  )
}
