import { useEffect, useState } from 'react'

export default function TypewriterCaption({ text, className }) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    setShown('')
    if (!text) return
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 35)
    return () => clearInterval(interval)
  }, [text])

  return <p className={className}>{shown}</p>
}
