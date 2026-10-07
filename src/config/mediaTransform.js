export function optimizeImage(url, width = 800) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`)
}
export function optimizeVideo(url, width = 480) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`)
}
export function optimizeAudio(url) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', '/upload/q_auto/')
}
export function warmMediaUrl(url, type) {
  if (!url) return
  if (type === 'video') {
    const v = document.createElement('video')
    v.preload = 'auto'
    v.src = optimizeVideo(url)
  } else if (type === 'audio') {
    const a = new Audio()
    a.preload = 'auto'
    a.src = optimizeAudio(url)
  } else {
    const img = new Image()
    img.src = optimizeImage(url)
  }
}
