import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoveBoxProvider } from './contexts/LoveBoxContext'
import { StudioProvider } from './contexts/StudioContext'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Recipient from './pages/Recipient'
import PaymentReturn from './pages/PaymentReturn'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<StudioProvider><Studio /></StudioProvider>} />
        <Route path="/paiement/retour" element={<PaymentReturn />} />
        <Route path="/box/:loveboxId" element={<LoveBoxProvider><Recipient /></LoveBoxProvider>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
