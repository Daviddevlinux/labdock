import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Catalogo from './pages/Catalogo'
import LabDetail from './pages/LabDetail'
import Contato from './pages/Contato'
import useTheme from './hooks/useTheme'
import './index.css'

export default function App() {
  useTheme()
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/laboratorios" element={<Catalogo />} />
        <Route path="/laboratorios/:disciplinaSlug/:labSlug" element={<LabDetail />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </BrowserRouter>
  )
}
