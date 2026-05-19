import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useTheme from '../hooks/useTheme'

export default function Navbar() {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Lab<span>Dock</span></Link>

      <button
        type="button"
        className="navbar-menu-btn"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-expanded={isMenuOpen}
        aria-controls="navbar-links"
        aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="navbar-links"
        className={`navbar-links${isMenuOpen ? ' navbar-links-open' : ''}`}
      >
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
