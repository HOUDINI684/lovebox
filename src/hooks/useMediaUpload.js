import { useState, useCallback } from 'react'
import { CLOUDINARY_CONFIG } from '../config/cloudinary'
import { warmMediaUrl } from '../config/mediaTransform'

const MAX_AUDIO_MB = 50
const MAX_VIDEO_MB = 200

export function useMediaUpload() {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

  const validateFile = (file, type) => {
    const maxMb = type === 'video' ? MAX_VIDEO_MB : MAX_AUDIO_MB
    if (file.size > maxMb * 1024 * 1024) throw new Error(`Le fichier depasse la limite de ${maxMb}MB`)
  }

  const uploadFile = useCallback((file, type = 'photo') => {
    return new Promise((resolve, reject) => {
      try { validateFile(file, type) } catch (err) { setError(err.message); reject(err); return }
      if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
        const err = new Error('Cloudinary non configure')
        setError(err.message); reject(err); return
      }
      setUploading(true); setError(null)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)
      formData.append('folder', `loveboxes/${type}`)
      const resourceType = type === 'photo' ? 'image' : 'video'
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`)
      xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)) }
      xhr.onload = () => {
        setUploading(false)
        if (xhr.status >= 200 && xhr.status < 300) {
          const url = JSON.parse(xhr.responseText).secure_url
          warmMediaUrl(url, type)
          resolve(url)
        } else {
          const err = new Error("Echec de l'upload Cloudinary")
          setError(err.message); reject(err)
        }
      }
      xhr.onerror = () => {
        setUploading(false)
        const err = new Error("Erreur reseau pendant l'upload")
        setError(err.message); reject(err)
      }
      xhr.send(formData)
    })
  }, [])

  return { uploadFile, progress, uploading, error }
}