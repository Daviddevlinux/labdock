import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import labs from '../data/labs.json'

export default function LabDetail() {
  const { disciplinaSlug, labSlug } = useParams()

  const disciplina = labs.disciplinas.find(d => d.slug === disciplinaSlug)
  const lab = disciplina?.labs.find(l => l.slug === labSlug)

  if (!lab) return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-hero">
          <h1>Laboratório não encontrado</h1>
          <Link to="/laboratorios">← Voltar ao catálogo</Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-hero">
          <div className="breadcrumb">
            <Link to="/laboratorios">Laboratórios</Link> › {disciplina.nome} › {lab.nome}
          </div>
          <h1 className="detail-title">{lab.nome}</h1>
          <p className="detail-desc">{lab.descricao}</p>
          <div className="detail-tags">
            <span className="dtag">{disciplina.nome}</span>
            <span className="dtag">Nível: {lab.nivel}</span>
            <span className="dtag">⏱ {lab.duracao}</span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h4>O que você vai aprender</h4>
            <div className="obj-list">
              {lab.objetivos.map((obj, i) => (
                <div className="obj-item" key={i}>
                  <span className="check">✓</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h4>Professor responsável</h4>
            <div className="prof-card">
              <div className="prof-avatar">{lab.professor.iniciais}</div>
              <div>
                <div className="prof-name">{lab.professor.nome}</div>
                <div className="prof-dept">{lab.professor.departamento}</div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Ferramentas no ambiente</h4>
            <div className="tools-grid">
              {lab.ferramentas.map(f => (
                <span className="tool" key={f}>{f}</span>
              ))}
            </div>
          </div>

          <div className="download-box">
            <h4>Baixar laboratório</h4>
            <p>Inclui o ambiente Docker completo, instruções de uso e o enunciado dos exercícios.</p>
            <a href={lab.download.url} className="download-btn">
              ⬇ Baixar {lab.download.arquivo}
            </a>
            <div className="download-hint">
              Pré-requisito: Docker instalado · <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noreferrer">Como instalar o Docker</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}