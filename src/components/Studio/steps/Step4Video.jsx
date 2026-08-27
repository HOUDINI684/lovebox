import { useStudio } from '../../../hooks/useStudio'
import { useMediaUpload } from '../../../hooks/useMediaUpload'
import StepNav from '../StepNav'

export default function Step4Video() {
  const { studioData, updateField } = useStudio()
  const { uploadFile, uploading, progress, error } = useMediaUpload()

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try { updateField('video', await uploadFile(file, 'video')) } catch (err) { console.error(err) }
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Ajoutez une vidéo</h2>
      <p className="text-ivory/40 mb-8">Optionnel — un message filmé rend l'instant encore plus vivant.</p>
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-night-600 rounded-2xl py-10 cursor-pointer hover:border-berry-400 transition-colors bg-night-800">
        <span className="text-3xl">🎥</span>
        <span className="text-ivory/50 text-sm">Cliquez pour choisir une vidéo</span>
        <input type="file" accept="video/*" onChange={handleFile} className="hidden" />
      </label>
      {uploading && (
        <div className="mt-4">
          <div className="h-1.5 bg-night-700 rounded-full overflow-hidden"><div className="h-full bg-berry-500 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="text-sm text-ivory/40 mt-1">Upload en cours... {progress}%</p>
        </div>
      )}
      {error && <p className="text-sm text-berry-400 mt-3">{error}</p>}
      {studioData.video && <p className="text-sm text-berry-400 mt-3">Vidéo ajoutée ✓</p>}
      <StepNav nextLabel="Suivant" />
    </div>
  )
}
