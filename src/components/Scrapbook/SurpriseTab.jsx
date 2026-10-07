import InteractiveHeart from '../Heart/InteractiveHeart'
import TreasureSurprise from '../Heart/TreasureSurprise'

export default function SurpriseTab({ loveboxId, theme, recipientName, finalMessage, target, amount, currency, revealed, onReveal }) {
  const hasTarget = target && Number(target) > 0

  if (!hasTarget) {
    return <InteractiveHeart loveboxId={loveboxId} theme={theme} recipientName={recipientName} finalMessage={finalMessage} />
  }

  return (
    <TreasureSurprise
      loveboxId={loveboxId}
      theme={theme}
      target={Number(target)}
      amount={amount}
      currency={currency}
      finalMessage={finalMessage}
      revealed={revealed}
      onReveal={onReveal}
    />
  )
}
