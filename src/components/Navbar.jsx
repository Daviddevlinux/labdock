import { Link, useLocation } from 'react-router-dom'
import useTheme from '../hooks/useTheme'

export default function Navbar() {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Lab<span>Dock</span></Link>
      <div className="navbar-links">
        <Link to="/sobre" className={pathname === '/sobre' ? 'active' : ''}>Sobre</Link>
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Início</Link>
        <Link to="/contato" className={pathname === '/contato' ? 'active' : ''}>Contato</Link>
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <Link to="/laboratorios" className="navbar-btn">Laboratórios →</Link>
      </div>
    </nav>
  )
}
