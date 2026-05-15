import Navbar from '../components/Navbar'

export default function Contato() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-hero">
          <h1>Contato</h1>
          <p>Dúvidas sobre a plataforma, sugestões ou interesse em adicionar laboratórios de uma nova disciplina? Fale comigo.</p>
        </div>

        <div className="detail-body">
          <div>
            <div className="section-title">Desenvolvedor</div>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">DM</div>
                <div>
                  <div className="profile-name">David Gonçalves Maia</div>
                  <div className="profile-sub">Sistemas de Informação · UFPB</div>
                </div>
              </div>
              <div className="contact-list">
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <div className="contact-label">E-mail</div>
                    <a href="mailto:david.goncalves@dcx.ufpb.br" className="contact-value">david.goncalves@dcx.ufpb.br</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">💼</span>
                  <div>
                    <div className="contact-label">LinkedIn</div>
                    <a href="https://br.linkedin.com/in/davidmaiadev" target="_blank" rel="noreferrer" className="contact-value">linkedin.com/in/davidmaiadev</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📸</span>
                  <div>
                    <div className="contact-label">Instagram</div>
                    <a href="https://instagram.com/davidev_m" target="_blank" rel="noreferrer" className="contact-value">@davidev_m</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🐙</span>
                  <div>
                    <div className="contact-label">GitHub</div>
                    <a href="https://github.com/Daviddevlinux" target="_blank" rel="noreferrer" className="contact-value">github.com/Daviddevlinux</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}