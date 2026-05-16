import Navbar from '../components/Navbar'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.25 1.65a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 2.2A3.3 3.3 0 1 0 15.3 12 3.3 3.3 0 0 0 12 8.7Z"
        fill="currentColor"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.94 8.5A1.56 1.56 0 1 1 6.9 5.38a1.56 1.56 0 0 1 .04 3.12ZM5.6 9.8h2.67V18H5.6Zm4.34 0h2.55v1.12h.04a2.79 2.79 0 0 1 2.52-1.38c2.7 0 3.2 1.78 3.2 4.1V18h-2.66v-3.89c0-.93-.02-2.12-1.3-2.12s-1.5 1.01-1.5 2.05V18H9.94Z"
        fill="currentColor"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18a2.65 2.65 0 0 0-1.1-1.46c-.9-.62.07-.6.07-.6a2.1 2.1 0 0 1 1.53 1.03 2.14 2.14 0 0 0 2.92.84 2.16 2.16 0 0 1 .64-1.35c-2.22-.25-4.56-1.11-4.56-4.93a3.85 3.85 0 0 1 1.03-2.68 3.57 3.57 0 0 1 .1-2.64s.84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03a3.57 3.57 0 0 1 .1 2.64 3.84 3.84 0 0 1 1.03 2.68c0 3.83-2.34 4.68-4.58 4.93a2.4 2.4 0 0 1 .69 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

const socialLinks = [
  {
    href: 'https://instagram.com/daviddev_m',
    label: 'Instagram',
    handle: '@daviddev_m',
    icon: <InstagramIcon />,
  },
  {
    href: 'https://br.linkedin.com/in/davidmaiadev',
    label: 'LinkedIn',
    handle: 'linkedin.com/in/davidmaiadev',
    icon: <LinkedInIcon />,
  },
  {
    href: 'https://github.com/Daviddevlinux',
    label: 'GitHub',
    handle: 'github.com/Daviddevlinux',
    icon: <GitHubIcon />,
  },
]

export default function Contato() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-hero">
          <h1>Contato</h1>
        </div>

        <div className="detail-body">
          <div className="contact-layout">
            <section className="profile-card">
              <div className="profile-header profile-header-stack">
                <div className="profile-identity">
                  <div className="profile-avatar">DM</div>
                  <div>
                    <div className="profile-name">David Gonçalves Maia</div>
                    <div className="profile-sub">Sistemas de Informação · UFPB</div>
                    <a href="mailto:david.goncalves@dcx.ufpb.br" className="profile-email">
                      david.goncalves@dcx.ufpb.br
                    </a>
                  </div>
                </div>
              </div>

              <div className="social-strip">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link"
                    aria-label={link.label}
                    title={link.label}
                  >
                    <span className="social-icon">{link.icon}</span>
                    <span className="social-meta">
                      <span className="social-name">{link.label}</span>
                      <span className="social-handle">{link.handle}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <section className="contrib-card">
              <div className="section-title">Contribuição</div>
              <h2>Quer melhorar o LabDock?</h2>
              <p>
                O projeto possui código público no GitHub. Se quiser contribuir com melhorias,
                correções ou novos laboratórios, entre no perfil e acompanhe o repositório.
              </p>
              <a
                href="https://github.com/Daviddevlinux/labdock"
                target="_blank"
                rel="noreferrer"
                className="contrib-button"
              >
                <GitHubIcon />
                <span>Ver GitHub do projeto</span>
              </a>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
