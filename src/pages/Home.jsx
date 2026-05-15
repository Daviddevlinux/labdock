import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import labs from '../data/labs.json'

export default function Home() {
  const totalLabs = labs.disciplinas.reduce((acc, d) => acc + d.labs.length, 0)

  return (
    <>
      <Navbar />
      <div className="container">
        <section className="hero">
          <div className="hero-badge">🎓 UFPB · DSC</div>
          <h1>Laboratórios práticos prontos para rodar</h1>
          <p>Plataforma do Departamento de Sistemas e Computação para distribuição de ambientes acadêmicos padronizados. Sem configuração, sem conflito de versões.</p>
          <div className="hero-actions">
            <Link to="/laboratorios" className="btn-primary">Ver laboratórios</Link>
            <Link to="/sobre" className="btn-secondary">Como funciona</Link>
          </div>
        </section>

        <div className="stats">
          <div className="stat">
            <div className="stat-n">{labs.disciplinas.length}</div>
            <div className="stat-l">Disciplinas</div>
          </div>
          <div className="stat">
            <div className="stat-n">{totalLabs}</div>
            <div className="stat-l">Laboratórios</div>
          </div>
          <div className="stat">
            <div className="stat-n">Docker</div>
            <div className="stat-l">Tecnologia base</div>
          </div>
        </div>

        <section className="section">
          <div className="section-title">Por que usar</div>
          <div className="info-grid">
            <div className="info-card">
              <div className="icon">💻</div>
              <h3>Funciona em qualquer máquina</h3>
              <p>Windows, macOS ou Linux — o ambiente é sempre idêntico para todos.</p>
            </div>
            <div className="info-card">
              <div className="icon">⚡</div>
              <h3>Zero tempo de setup</h3>
              <p>Baixe, descompacte e rode. O laboratório está pronto em instantes.</p>
            </div>
            <div className="info-card">
              <div className="icon">🔄</div>
              <h3>Reiniciável a qualquer momento</h3>
              <p>Errou? Destrua o ambiente e recrie do zero com um comando.</p>
            </div>
            <div className="info-card">
              <div className="icon">📦</div>
              <h3>Tudo incluso no download</h3>
              <p>Ambiente, instruções e exercícios vêm juntos num único arquivo.</p>
            </div>
          </div>
          <div className="prereq">
            <span>🐳</span>
            <p><strong>Pré-requisito:</strong> Docker instalado na sua máquina. Gratuito e disponível para Windows, macOS e Linux. <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noreferrer">Como instalar →</a></p>
          </div>
        </section>
      </div>
    </>
  )
}