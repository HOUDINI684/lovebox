import { createContext, useState, useCallback } from 'react'

export const StudioContext = createContext()

const TOTAL_STEPS = 9

export function StudioProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [studioData, setStudioData] = useState({
    recipientName: '',
    creatorEmail: '',
    occasion: '',
    photos: [],
    video: null,
    videoType: null, // 'upload' | 'link'
    audioIntro: null,
    audioLetter: null,
    letter: '',
    letterDesign: 'classique',
    finalMessage: '',
    quizQuestions: [], // [{ question, answer }]
    dailyThoughts: [], // [string]
    surpriseTarget: '', // nombre de tapes cible (vide = pas de surprise)
    surpriseAmount: '', // montant promis (chiffres uniquement)
    surpriseCurrency: 'FCFA', // FCFA par defaut
    recipientPhone: '', // visible uniquement par le createur
  })

  const updateField = useCallback((field, value) => {
    setStudioData((prev) => ({ ...prev, [field]: value }))
  }, [])
  const nextStep = useCallback(() => setCurrentStep((p) => (p < TOTAL_STEPS ? p + 1 : p)), [])
  const prevStep = useCallback(() => setCurrentStep((p) => (p > 1 ? p - 1 : p)), [])

  return (
    <StudioContext.Provider value={{ currentStep, studioData, updateField, nextStep, prevStep, totalSteps: TOTAL_STEPS }}>
      {children}
    </StudioContext.Provider>
  )
}
