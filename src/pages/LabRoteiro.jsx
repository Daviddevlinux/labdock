import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import Navbar from '../components/Navbar'
import labs from '../data/labs.json'
import { readmes } from '../lib/readmes'

export default function LabRoteiro() {
  const { disciplinaSlug, labSlug } = useParams()

  const disciplina = labs.disciplinas.find(d => d.slug === disciplinaSlug)
  const lab = disciplina?.labs.find(l => l.slug === labSlug)
  const readmeHtml = lab?.readme && readmes[lab.readme]
    ? marked.parse(readmes[lab.readme])
    : null

  if (!lab || !readmeHtml) return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-hero">
          <h1>Roteiro não encontrado</h1>
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
            <Link to="/laboratorios">Laboratórios</Link> › <Link to={`/laboratorios/${disciplinaSlug}/${labSlug}`}>{lab.nome}</Link> › Roteiro
          </div>
          <h1 className="detail-title">Roteiro — {lab.nome}</h1>
          <Link to={`/laboratorios/${disciplinaSlug}/${labSlug}`} className="btn-secondary roteiro-back">← Voltar para o laboratório</Link>
        </div>

        <div className="detail-body">
          <div className="readme-content" dangerouslySetInnerHTML={{ __html: readmeHtml }} />
        </div>
      </div>
    </>
  )
}
