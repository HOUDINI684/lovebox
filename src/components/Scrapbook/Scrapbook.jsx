import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TabBar from './TabBar'
import DailyThought from './DailyThought'
import PhotosTab from './PhotosTab'
import LetterView from '../Letter/LetterView'
import GameTab from './GameTab'
import QuizGame from '../Games/QuizGame'
import SurpriseTab from './SurpriseTab'
import { AUDIO_SETTINGS } from '../../config/audio'
import { optimizeImage } from '../../config/mediaTransform'
import { getCompleteQuiz, MIN_QUIZ_QUESTIONS } from '../../utils/quiz'

export default function Scrapbook({ lovebox, loveboxId, theme, introAudio, letterAudio }) {
  const [activeTab, setActiveTab] = useState('photos')
  const [surpriseRevealed, setSurpriseRevealed] = useState(!!lovebox.surpriseRevealed)
  const navigate = useNavigate()
  const accent = theme?.accent ?? '#D4AF37'
  const quizQuestions = useMemo(() => getCompleteQuiz(lovebox.quizQuestions), [lovebox.quizQuestions])
  const hasQuiz = quizQuestions.length >= MIN_QUIZ_QUESTIONS

  const coverPhoto = lovebox.photos?.find((p) => p.isCover) || lovebox.photos?.[0]
  const bgTint = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0B0B0D'}cc, ${theme?.bgTo ?? '#17151A'}cc)`
  const bg = coverPhoto
    ? `${bgTint}, url(${optimizeImage(coverPhoto.url, 1200)})`
    : `linear-gradient(180deg, ${theme?.bgFrom ?? '#0B0B0D'}, ${theme?.bgTo ?? '#17151A'})`

  const handleLetterReveal = () => {
    introAudio.fadeOut(AUDIO_SETTINGS.introFadeOutMs)
    letterAudio.play()
  }

  return (
    <div className="min-h-screen pb-24 bg-cover bg-center bg-fixed overflow-x-hidden" style={{ backgroundImage: bg }}>
      <div className="max-w-xl mx-auto px-4 pt-8">
        <DailyThought thoughts={lovebox.dailyThoughts} loveboxId={loveboxId} accent={accent} />

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-6">
            {activeTab === 'photos' && <PhotosTab photos={lovebox.photos} video={lovebox.video} theme={theme} />}
            {activeTab === 'letter' && (
              <LetterView
                text={lovebox.letter}
                theme={theme}
                design={lovebox.letterDesign}
                onMusicStart={handleLetterReveal}
              />
            )}
            {activeTab === 'quiz' && hasQuiz && <QuizGame questions={quizQuestions} theme={theme} />}
            {activeTab === 'game' && <GameTab theme={theme} photos={lovebox.photos} />}
            {activeTab === 'surprise' && (
              <SurpriseTab
                loveboxId={loveboxId}
                theme={theme}
                recipientName={lovebox.recipientName}
                finalMessage={lovebox.finalMessage}
                target={lovebox.surpriseTarget}
                amount={lovebox.surpriseAmount}
                currency={lovebox.surpriseCurrency}
                revealed={surpriseRevealed}
                onReveal={() => setSurpriseRevealed(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-10">
          <button onClick={() => navigate('/')} className="text-ivory/35 text-xs underline bg-ink-900/60 px-3 py-1.5 rounded-full">
            💌 Toi aussi, offre ce moment à quelqu'un
          </button>
        </div>
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} hasQuiz={hasQuiz} accent={accent} />
    </div>
  )
}
