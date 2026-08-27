import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-night-900 text-center px-6">
      <h1 className="font-display text-3xl text-ivory mb-3">Page introuvable</h1>
      <p className="text-ivory/40 mb-6">Ce lien ne mène nulle part.</p>
      <Link to="/" className="text-berry-400 font-medium hover:text-berry-300">Retour à l'accueil</Link>
    </div>
  )
}
