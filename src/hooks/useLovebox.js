import { useContext } from 'react'
import { LoveBoxContext } from '../contexts/LoveBoxContext'

export function useLovebox() {
  const context = useContext(LoveBoxContext)
  if (!context) throw new Error('useLovebox must be used within LoveBoxProvider')
  return context
}
