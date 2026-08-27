import { useEffect, useRef } from 'react'

function samplePointsForText(text, width, height, targetCount) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let fontSize = Math.floor(height * 0.6)
  ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`
  while (ctx.measureText(text).width > width * 0.9 && fontSize > 10) {
    fontSize -= 2
    ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`
  }
  ctx.fillText(text, width / 2, height / 2)

  const { data } = ctx.getImageData(0, 0, width, height)
  const points = []
  const step = 3
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 128) points.push({ x, y })
    }
  }
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[points[i], points[j]] = [points[j], points[i]]
  }
  if (points.length === 0) return []
  if (points.length > targetCount) return points.slice(0, targetCount)
  const result = [...points]
  while (result.length < targetCount) {
    const base = points[result.length % points.length]
    result.push({ x: base.x + (Math.random() - 0.5) * 4, y: base.y + (Math.random() - 0.5) * 4 })
  }
  return result
}

const DEFAULT_COLORS = ['#FF3D68', '#F2C14E', '#8B5CF6', '#FF6B93', '#F5D68C']

export default function NameConfetti({ name, colors }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const palette = colors && colors.length ? colors : DEFAULT_COLORS
    const label = (name || '').trim().toUpperCase() || 'MERCI'
    const textWidth = Math.min(window.innerWidth * 0.85, 700)
    const textHeight = 140
    const targetCount = Math.min(260, Math.max(90, label.length * 14))
    const targets = samplePointsForText(label, textWidth, textHeight, targetCount)
    const offsetX = (window.innerWidth - textWidth) / 2
    const offsetY = window.innerHeight * 0.38

    const particles = targets.map((t) => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.5,
      tx: offsetX + t.x,
      ty: offsetY + t.y,
      color: palette[Math.floor(Math.random() * palette.length)],
      size: 3 + Math.random() * 2.5,
      fallVx: (Math.random() - 0.5) * 40,
      fallVy: 60 + Math.random() * 40,
    }))

    let start = null
    const arriveDuration = 1400
    const holdDuration = 1300
    let raf
    const ease = (t) => 1 - Math.pow(1 - t, 3)

    const tick = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (particles.length === 0) return

      if (elapsed < arriveDuration) {
        const t = ease(Math.min(1, elapsed / arriveDuration))
        particles.forEach((p) => {
          ctx.beginPath()
          ctx.fillStyle = p.color
          ctx.arc(p.x + (p.tx - p.x) * t, p.y + (p.ty - p.y) * t, p.size, 0, Math.PI * 2)
          ctx.fill()
        })
        raf = requestAnimationFrame(tick)
      } else if (elapsed < arriveDuration + holdDuration) {
        particles.forEach((p) => {
          ctx.beginPath()
          ctx.fillStyle = p.color
          ctx.arc(p.tx, p.ty, p.size, 0, Math.PI * 2)
          ctx.fill()
        })
        raf = requestAnimationFrame(tick)
      } else {
        const t = (elapsed - arriveDuration - holdDuration) / 1000
        let visible = false
        particles.forEach((p) => {
          const y = p.ty + p.fallVy * t + 90 * t * t
          if (y < window.innerHeight + 20) {
            visible = true
            ctx.globalAlpha = Math.max(0, 1 - t / 2.2)
            ctx.beginPath()
            ctx.fillStyle = p.color
            ctx.arc(p.tx + p.fallVx * t, y, p.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
          }
        })
        if (visible) raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [name, colors])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />
}
