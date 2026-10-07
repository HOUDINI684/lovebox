import { createContext, useState } from 'react'

export const LoveBoxContext = createContext()

export function LoveBoxProvider({ children }) {
  const [currentStep, setCurrentStep] = useState('theme')
  const [heartTouched, setHeartTouched] = useState(false)
  const touchHeart = () => setHeartTouched(true)
  return (
    <LoveBoxContext.Provider value={{ currentStep, setCurrentStep, heartTouched, touchHeart }}>
      {children}
    </LoveBoxContext.Provider>
  )
}
