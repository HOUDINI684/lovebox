import { useRef, useState, useCallback, useEffect } from 'react'
import { AUDIO_SETTINGS } from '../config/audio'
import { optimizeAudio } from '../config/mediaTransform'

export function useAudio(url) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume] = useState(AUDIO_SETTINGS.defaultVolume)

  useEffect(() => {
    if (!url) return
    const audio = new Audio(optimizeAudio(url))
    audio.volume = volume
    audio.loop = true
    audio.preload = 'auto'
    audio.addEventListener('error', () => console.warn(`[LOVEBOX] Fichier audio introuvable: ${url}`))
    audioRef.current = audio
    return () => { audio.pause(); audioRef.current = null }
  }, [url])

  const play = useCallback(() => {
    if (!audioRef.current) return
    const target = volume
    audioRef.current.volume = 0
    audioRef.current.play().catch((err) => console.warn('[LOVEBOX] Lecture impossible:', err.message))
    setIsPlaying(true)
    const steps = Math.max(1, Math.round(AUDIO_SETTINGS.fadeInMs / AUDIO_SETTINGS.fadeStepMs))
    let step = 0
    const interval = setInterval(() => {
      step += 1
      if (audioRef.current) audioRef.current.volume = Math.min(target, (target / steps) * step)
      if (step >= steps) clearInterval(interval)
    }, AUDIO_SETTINGS.fadeStepMs)
  }, [volume])

  const pause = useCallback(() => { audioRef.current?.pause(); setIsPlaying(false) }, [])

  const fadeOut = useCallback((durationMs = AUDIO_SETTINGS.introFadeOutMs) => {
    if (!audioRef.current) return
    const steps = Math.max(1, Math.round(durationMs / AUDIO_SETTINGS.fadeStepMs))
    let currentStep = 0
    const startVolume = audioRef.current.volume
    const interval = setInterval(() => {
      currentStep += 1
      const newVolume = Math.max(0, startVolume - (startVolume / steps) * currentStep)
      if (audioRef.current) audioRef.current.volume = newVolume
      if (currentStep >= steps) { clearInterval(interval); pause() }
    }, AUDIO_SETTINGS.fadeStepMs)
  }, [pause])

  return { isPlaying, play, pause, fadeOut, volume }
}