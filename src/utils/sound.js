// Petits sons synthetises via Web Audio API, sans fichier audio a charger.
// Utilises pour renforcer le feedback sur les interactions cles (coeur, recompense).

let ctx = null
function getContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  return ctx
}

function tone({ freq = 440, duration = 0.15, type = 'sine', volume = 0.15, glideTo = null }) {
  const audioCtx = getContext()
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, audioCtx.currentTime + duration)
  gain.gain.setValueAtTime(volume, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start()
  osc.stop(audioCtx.currentTime + duration)
}

// Petit "pop" doux, pour un tap sur le coeur
export function playHeartPop() {
  tone({ freq: 520, glideTo: 720, duration: 0.12, type: 'sine', volume: 0.12 })
}

// Carillon chaleureux, pour le tout premier tap (le "declic")
export function playChime() {
  tone({ freq: 660, glideTo: 880, duration: 0.35, type: 'sine', volume: 0.14 })
  setTimeout(() => tone({ freq: 990, duration: 0.4, type: 'sine', volume: 0.1 }), 90)
}

// Petit "tic" sec, pour chaque secousse du coffre
export function playChestShake() {
  tone({ freq: 180, duration: 0.05, type: 'square', volume: 0.05 })
}

// "Cha-ching" pour l'ouverture du coffre
export function playTreasureReveal() {
  tone({ freq: 523, duration: 0.14, type: 'triangle', volume: 0.16 })
  setTimeout(() => tone({ freq: 784, duration: 0.14, type: 'triangle', volume: 0.16 }), 100)
  setTimeout(() => tone({ freq: 1047, glideTo: 1568, duration: 0.5, type: 'sine', volume: 0.14 }), 200)
}
