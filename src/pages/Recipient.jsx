import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getLovebox } from '../services/loveboxService'
import { useLovebox } from '../hooks/useLovebox'
import { useAudio } from '../hooks/useAudio'
import { AUDIO_SETTINGS } from '../config/audio'
import ThemeSelect from '../components/Theme/ThemeSelect'
import ThemeDecor from '../components/Theme/ThemeDecor'
import BoxOpening from '../components/Box/BoxOpening'
import GalleryModeSelect from '../components/Gallery/GalleryModeSelect'
import PolaroidGallery from '../components/Gallery/PolaroidGallery'
import VideoPlayer from '../components/Video/VideoPlayer'
import MiniGame from '../components/Games/MiniGame'
import LetterView from '../components/Letter/LetterView'
import InteractiveHeart from '../components/Heart/InteractiveHeart'

export default function Recipient() {
  const { loveboxId } = useParams()
  const { currentStep, setCurrentStep } = useLovebox()
  const [lovebox, setLovebox] = useState(null)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(null)
  const [galleryMode, setGalleryMode] = useState('single')

  useEffect(() => {
    getLovebox(loveboxId)
      .then(setLovebox)
      .catch((err) => setError(err.message))
  }, [loveboxId])

  const introAudio = useAudio(lovebox?.audioIntro || null)
  const letterAudio = useAudio(lovebox?.audioLetter || null)

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-night-900 text-ivory/70">{error}</div>
  }
  if (!lovebox) {
    return <div className="min-h-screen flex items-center justify-center bg-night-900 text-ivory/50">Chargement...</div>
  }

  const handleThemeSelect = (selected) => {
    setTheme(selected)
    setCurrentStep('box')
  }

  const leaveGallery = () => {
    introAudio.fadeOut(AUDIO_SETTINGS.introFadeOutMs)
    setCurrentStep(lovebox.video ? 'video' : 'game')
  }

  return (
    <>
      {theme && <ThemeDecor themeId={theme.id} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative z-10"
        >
          {currentStep === 'theme' && (
            <ThemeSelect recipientName={lovebox.recipientName} onSelect={handleThemeSelect} />
          )}
          {currentStep === 'box' && (
            <BoxOpening
              recipientName={lovebox.recipientName}
              theme={theme}
              onStart={() => introAudio.play()}
              onOpen={() => setCurrentStep('gallery-mode')}
            />
          )}
          {currentStep === 'gallery-mode' && (
            <GalleryModeSelect
              theme={theme}
              onSelect={(mode) => { setGalleryMode(mode); setCurrentStep('gallery') }}
            />
          )}
          {currentStep === 'gallery' && (
            <PolaroidGallery photos={lovebox.photos} theme={theme} mode={galleryMode} onNext={leaveGallery} />
          )}
          {currentStep === 'video' && lovebox.video && (
            <VideoPlayer url={lovebox.video} theme={theme} onEnded={() => setCurrentStep('game')} />
          )}
          {currentStep === 'game' && (
            <MiniGame theme={theme} onComplete={() => setCurrentStep('letter')} />
          )}
          {currentStep === 'letter' && (
            <LetterView
              text={lovebox.letter}
              theme={theme}
              onMusicStart={() => letterAudio.play()}
              onFinished={() => setCurrentStep('heart')}
            />
          )}
          {currentStep === 'heart' && (
            <InteractiveHeart loveboxId={loveboxId} theme={theme} recipientName={lovebox.recipientName} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}