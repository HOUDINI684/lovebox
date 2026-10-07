import { useState } from 'react'
import TreasureChest from './TreasureChest'
import { markSurpriseRevealed } from '../../services/surpriseService'
import { playChestShake, playTreasureReveal } from '../../utils/sound'
import { formatAmount } from '../../utils/format'

export default function TreasureSurprise({ loveboxId, theme, target, amount, currency, finalMessage, revealed, onReveal }) {
  const [taps, setTaps] = useState(0)
  const [phase, setPhase] = useState('tapping') // tapping | opening | done
  const [justRevealed, setJustRevealed] = useState(false)
  const accent = theme?.accent ?? '#F2C14E'
  const displayAmount = formatAmount(amount, currency)

  // Coffre ouvert : le montant reste visible, mais la demande de capture n'apparait qu'a la toute premiere ouverture
  if (revealed || phase === 'done') {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <TreasureChest staticOpen />
        <h2 className="font-display text-2xl text-ivory mt-6 mb-2">
          {justRevealed ? 'Surprise débloquée 🎉' : 'Surprise déjà ouverte ✨'}
        </h2>
        {displayAmount && <p className="font-display text-3xl mb-3" style={{ color: accent }}>{displayAmount}</p>}
        <p className="text-ivory/60 text-sm max-w-xs mb-6">{finalMessage || 'Merci pour ce moment'}</p>
        {justRevealed && (
          <div className="bg-ink-800 border border-gold-500/20 rounded-xl px-4 py-3 max-w-xs">
            <p className="text-ivory/70 text-sm">
              Si tu en es arrivé(e) jusque-là, alors 📸 fais moi une capture d'écran de ce que le coffre a dévoilé… et je m'occupe du reste !
            </p>
          </div>
        )}
      </div>
    )
  }

  const handleTap = () => {
    const nextTaps = taps + 1
    setTaps(nextTaps)
    navigator.vibrate?.(30)
    playChestShake()

    if (nextTaps >= target) {
      setPhase('opening')
      setTimeout(() => {
        playTreasureReveal()
        navigator.vibrate?.(200)
      }, 400)
      setTimeout(() => {
        setPhase('done')
        setJustRevealed(true)
        onReveal?.()
        markSurpriseRevealed(loveboxId).catch((err) => console.error(err))
      }, 1200)
    }
  }

  const intensity = Math.min(taps / target, 1)

  return (
    <div className="flex flex-col items-center text-center py-10 overflow-x-clip">
      <h2 className="font-display text-2xl text-ivory mb-2">Une surprise t'attend...</h2>
      <p className="text-ivory/40 text-sm mb-8">Touche le coffre jusqu'à ce qu'il s'ouvre</p>

      <div onClick={phase === 'tapping' ? handleTap : undefined} className="cursor-pointer">
        <TreasureChest intensity={intensity} burst={phase === 'opening'} />
      </div>

      <p className="text-ivory/30 text-xs mt-8">{Math.min(taps, target)} / {target}</p>
    </div>
  )
}
