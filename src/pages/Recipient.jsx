import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getLovebox } from '../services/loveboxService'
import { useLovebox } from '../hooks/useLovebox'
import { useAudio } from '../hooks/useAudio'
import ThemeSelect from '../components/Theme/ThemeSelect'
import ThemeDecor from '../components/Theme/ThemeDecor'
import BoxOpening from '../components/Box/BoxOpening'
import Scrapbook from '../components/Scrapbook/Scrapbook'

export default function Recipient() {
  const { loveboxId } = useParams()
  const { currentStep, setCurrentStep } = useLovebox()
  const [lovebox, setLovebox] = useState(null)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    getLovebox(loveboxId)
      .then(setLovebox)
      .catch((err) => setError(err.message))
  }, [loveboxId])

  const introAudio = useAudio(lovebox?.audioIntro || null)
  const letterAudio = useAudio(lovebox?.audioLetter || null)

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-ink-950 text-ivory/70">{error}</div>
  }
  if (!lovebox) {
    return <div className="min-h-screen flex items-center justify-center bg-ink-950 text-ivory/50">Chargement...</div>
  }

  const handleThemeSelect = (selected) => {
    setTheme(selected)
    setCurrentStep('box')
  }

  return (
    <>
      {theme && <ThemeDecor themeId={theme.id} />}
      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: 'easeInOut' }} className="relative z-10">
          {currentStep === 'theme' && (
            <ThemeSelect recipientName={lovebox.recipientName} onSelect={handleThemeSelect} />
          )}
          {currentStep === 'box' && (
            <BoxOpening recipientName={lovebox.recipientName} theme={theme} onStart={() => introAudio.play()} onOpen={() => setCurrentStep('scrapbook')} />
          )}
          {currentStep === 'scrapbook' && (
            <Scrapbook lovebox={lovebox} loveboxId={loveboxId} theme={theme} introAudio={introAudio} letterAudio={letterAudio} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
