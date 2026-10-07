import React from 'react'
import ReactDOM from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import './index.css'
import { StudioContext } from './contexts/StudioContext'
import StudioPage from './pages/Studio'
import ThemeSelect from './components/Theme/ThemeSelect'
import ThemeDecor from './components/Theme/ThemeDecor'
import BoxOpening from './components/Box/BoxOpening'
import Scrapbook from './components/Scrapbook/Scrapbook'
import { getTheme } from './config/themes'

const q = new URLSearchParams(location.search)
const view = q.get('view') || 'theme'
const step = Number(q.get('step') || 1)
const variant = q.get('v') || ''

const P = (n) => `/qa-photos/photo${n}.jpg`
const photos = [
  { url: P(1), caption: 'Notre premier voyage', question: 'Où étions-nous ?', isCover: true },
  { url: P(3), caption: 'Un dimanche parfait', question: '' },
  { url: P(2), caption: 'Le soir de tes 22 ans', question: 'Quel jour c\'était ?' },
  { url: P(4), caption: 'Sous les étoiles', question: '' },
]
const quizQuestions = [
  { question: 'Quelle est notre chanson ?', answer: 'Perfect', wrongAnswer: '' },
  { question: 'Où nous sommes-nous rencontrés ?', answer: 'Cotonou', wrongAnswer: '' },
  { question: 'Quel est mon plat préféré ?', answer: 'Le poulet braisé', wrongAnswer: '' },
  { question: 'Quelle est ma couleur préférée ?', answer: 'Le bleu nuit', wrongAnswer: '' },
  { question: 'Quel est notre endroit préféré ensemble ?', answer: 'La plage de Fidjrossè', wrongAnswer: '' },
  { question: 'Quel surnom me donnes-tu ?', answer: 'Ma lumière', wrongAnswer: '' },
]
const letter = "Ma chère Awa,\n\nJoyeux anniversaire. Chaque jour à tes côtés est un cadeau, et je voulais te le dire autrement que par un simple message.\n\nMerci d'être là, tout simplement.\n\nAvec tout mon cœur."
const thoughts = ['Un sourire de plus aujourd\'hui, grâce à ça ?']

const studioBase = {
  recipientName: '', creatorEmail: '', occasion: '', photos: [], video: null, videoType: null,
  audioIntro: null, audioLetter: null, letter: '', letterDesign: 'classique', finalMessage: '',
  quizQuestions: [], dailyThoughts: [], surpriseTarget: '', surpriseAmount: '', surpriseCurrency: 'FCFA', recipientPhone: '',
}
function studioData() {
  const d = { ...studioBase }
  if (step >= 1) d.recipientName = variant === 'empty' ? '' : 'Awa'
  if (step >= 2) d.occasion = 'Anniversaire'
  if (step >= 3) d.photos = photos
  if (step >= 4) { d.video = 'clip.mp4'; d.videoType = 'upload' }
  if (step >= 5) d.audioIntro = 'musique.mp3'
  if (step >= 6) d.letter = letter
  if (step >= 8) {
    d.quizQuestions = quizQuestions.slice(0, 3)
    d.dailyThoughts = ['Chaque jour, une petite pensée pour toi.', 'Prends un instant, rien que pour toi.']
  }
  if (step >= 9) { d.surpriseTarget = '23'; d.finalMessage = 'Joyeux anniversaire, Awa ❤️' }
  return d
}
const lovebox = {
  recipientName: 'Awa', photos, video: null, letter, letterDesign: 'classique', quizQuestions, dailyThoughts: thoughts,
  surpriseTarget: '23', surpriseAmount: '', surpriseCurrency: 'FCFA', finalMessage: 'Joyeux anniversaire, Awa ❤️', surpriseRevealed: false,
}
const audio = { fadeOut() {}, play() {} }
const theme = getTheme(q.get('theme') || 'onyx')

function App() {
  if (view === 'studio') {
    const value = { currentStep: step, totalSteps: 9, studioData: studioData(), updateField: () => {}, nextStep: () => {}, prevStep: () => {} }
    return <StudioContext.Provider value={value}><StudioPage /></StudioContext.Provider>
  }
  if (view === 'theme') return <ThemeSelect recipientName="Awa" onSelect={() => {}} />
  if (view === 'box') return <div style={{ background: `linear-gradient(180deg, ${theme.bgFrom}, ${theme.bgTo})` }}><ThemeDecor themeId={theme.id} /><div className="relative z-10"><BoxOpening recipientName="Awa" theme={theme} onStart={() => {}} onOpen={() => {}} /></div></div>
  return <><ThemeDecor themeId={theme.id} /><div className="relative z-10"><Scrapbook lovebox={lovebox} loveboxId="demo" theme={theme} introAudio={audio} letterAudio={audio} /></div></>
}
ReactDOM.createRoot(document.getElementById('root')).render(<MemoryRouter><App /></MemoryRouter>)
