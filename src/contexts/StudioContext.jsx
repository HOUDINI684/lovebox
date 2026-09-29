import { createContext, useState, useCallback, useEffect } from 'react'

export const StudioContext = createContext()

// Le brouillon survit a un aller-retour vers la page de paiement (onglet courant uniquement).
export const DRAFT_KEY = 'lovebox:studio-draft'

const EMPTY_DRAFT = {
  recipientName: '', recipientEmail: '', creatorEmail: '', occasion: '',
  photos: [], video: null, audioIntro: null, audioLetter: null,
  letter: '', tier: 'classic',
}

function loadDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY))
    if (saved?.studioData) return { step: saved.step || 1, studioData: { ...EMPTY_DRAFT, ...saved.studioData } }
  } catch { /* stockage indisponible : on repart de zero */ }
  return { step: 1, studioData: EMPTY_DRAFT }
}

export function clearStudioDraft() {
  try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
}

export function StudioProvider({ children }) {
  const [initial] = useState(loadDraft)
  const [currentStep, setCurrentStep] = useState(initial.step)
  const [studioData, setStudioData] = useState(initial.studioData)

  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step: currentStep, studioData })) } catch { /* ignore */ }
  }, [currentStep, studioData])

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
