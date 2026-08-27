import { useMemo } from 'react'
import HeartFindGame from './HeartFindGame'
import DodgeButtonGame from './DodgeButtonGame'
import ColorTapGame from './ColorTapGame'

const GAMES = [HeartFindGame, DodgeButtonGame, ColorTapGame]

export default function MiniGame({ onComplete, theme }) {
  // Choisi une seule fois par ouverture, pour que chaque visite propose un jeu different
  const Game = useMemo(() => GAMES[Math.floor(Math.random() * GAMES.length)], [])
  const bg = `linear-gradient(180deg, ${theme?.bgFrom ?? '#0F0A12'}, ${theme?.bgTo ?? '#1B1220'})`

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: bg }}>
      <Game onComplete={onComplete} theme={theme} />
    </div>
  )
}
