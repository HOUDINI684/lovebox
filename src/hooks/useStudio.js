import { useContext } from 'react'
import { StudioContext } from '../contexts/StudioContext'

export function useStudio() {
  const context = useContext(StudioContext)
  if (!context) throw new Error('useStudio must be used within StudioProvider')
  return context
}
