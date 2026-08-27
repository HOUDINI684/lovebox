import { createContext, useState, useCallback } from 'react'

export const StudioContext = createContext()

export function StudioProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [studioData, setStudioData] = useState({
    recipientName: '', recipientEmail: '', occasion: '',
    photos: [], video: null, audioIntro: null, audioLetter: null,
    letter: '', tier: 'classic',
  })

  const updateField = useCallback((field, value) => {
    setStudioData((prev) => ({ ...prev, [field]: value }))
  }, [])
  const nextStep = useCallback(() => setCurrentStep((p) => (p < 9 ? p + 1 : p)), [])
  const prevStep = useCallback(() => setCurrentStep((p) => (p > 1 ? p - 1 : p)), [])

  return (
    <StudioContext.Provider value={{ currentStep, studioData, updateField, nextStep, prevStep }}>
      {children}
    </StudioContext.Provider>
  )
}
