import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Lab<span>Dock</span></Link>
      <div className="navbar-links">
        <Link to="/sobre" className={pathname === '/sobre' ? 'active' : ''}>Sobre</Link>
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Início</Link>
        <Link to="/contato" className={pathname === '/contato' ? 'active' : ''}>Contato</Link>
        <Link to="/laboratorios" className="navbar-btn">Laboratórios →</Link>
      </div>
    </nav>
  )
}