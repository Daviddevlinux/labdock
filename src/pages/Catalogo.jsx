import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import labs from '../data/labs.json'

export default function Catalogo() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-hero">
          <h1>Laboratórios</h1>
          <p>Escolha a disciplina e selecione o laboratório que deseja realizar.</p>
        </div>

        <div className="detail-body">
          <div className="disc-list">
            {labs.disciplinas.map(disc => (
              <div className="disc-card" key={disc.slug}>
                <div className="disc-header">
                  <div className="disc-tag">
                    <div className="disc-dot" style={{ background: disc.cor }} />
                    <span className="disc-name">{disc.nome}</span>
                  </div>
                  <span className="disc-count">{disc.labs.length} laboratório{disc.labs.length > 1 ? 's' : ''}</span>
                </div>
                <div className="disc-labs">
                  {disc.labs.map(lab => (
                    <Link
                      key={lab.slug}
                      to={`/laboratorios/${disc.slug}/${lab.slug}`}
                      className="lab-row"
                    >
                      <div className="lab-row-info">
                        <span>🧪</span>
                        <span>{lab.nome}</span>
                      </div>
                      <span className="lab-row-arrow">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}