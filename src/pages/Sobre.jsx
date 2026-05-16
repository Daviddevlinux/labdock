import Navbar from '../components/Navbar'

export default function Sobre() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-hero">
          <h1>Sobre o LabDock</h1>
          <p>Por que esse projeto foi criado e o que ele resolve.</p>
        </div>

        <div className="detail-body">
          <div>
            <div className="section-title">A motivação</div>
            <div className="sobre-block">
              <p>Em disciplinas como Sistemas Operacionais, Redes de Computadores e Avaliação de Desempenho de Sistemas, nem sempre apenas acompanhar a explicação do professor é suficiente para consolidar o conteúdo. Em muitos casos, o entendimento acontece de verdade quando o aluno consegue testar, observar e repetir aquele contexto na prática.</p>
              <p>Pensando nisso, e em conjunto com os professores dessas disciplinas, foram criados laboratórios que reproduzem cenários próximos aos vistos em sala de aula. A proposta é sair do modelo em que o aluno apenas observa uma demonstração na máquina do professor e avançar para uma experiência em que ele também pode executar o laboratório por conta própria.</p>
              <div className="quote">
                <p>"A ideia do LabDock é transformar a aula em prática: o aluno vê, roda, testa e aprende no próprio ambiente."</p>
              </div>
              <p>Com o LabDock, esses ambientes podem ser executados tanto no laboratório da universidade quanto em casa, na máquina do próprio estudante. O foco é dar autonomia para praticar mais, revisar melhor os assuntos e tornar o aprendizado menos passivo e mais aplicado.</p>
            </div>
          </div>

          <div>
            <div className="section-title">Como funciona</div>
            <div className="sobre-block">
              <p>Cada laboratório é empacotado como um ambiente Docker. O professor define previamente as ferramentas, dependências e exercícios que farão parte da atividade, e essa configuração fica descrita nos arquivos do laboratório.</p>
              <p>Com isso, o aluno não precisa reproduzir manualmente o ambiente na própria máquina. Ao baixar o arquivo <code>.zip</code> e executar <code>docker compose up</code>, ele inicia o mesmo conjunto de serviços e configurações preparado pelo professor. Como o laboratório roda em contêineres isolados e reproduzíveis, o comportamento tende a ser o mesmo em diferentes máquinas, seja no laboratório da universidade ou em casa.</p>

              <div className="flow-diagram" aria-label="Fluxo de funcionamento do LabDock">
                <div className="flow-step flow-step-professor">
                  <strong>Professor</strong>
                  <span>Define ferramentas e exercícios do lab</span>
                </div>
                <div className="flow-arrow" aria-hidden="true">↓</div>

                <div className="flow-step flow-step-platform">
                  <strong>Plataforma LabDock</strong>
                  <span>Lab publicado e disponível para download</span>
                </div>
                <div className="flow-arrow" aria-hidden="true">↓</div>

                <div className="flow-step flow-step-student">
                  <strong>Aluno</strong>
                  <span>Baixa o .zip com 1 clique no site</span>
                </div>
                <div className="flow-arrow" aria-hidden="true">↓</div>

                <div className="flow-step flow-step-docker">
                  <strong>docker compose up</strong>
                  <span>Ambiente pronto em qualquer máquina</span>
                </div>

                <div className="flow-prereq">
                  <strong>Pré-requisito único</strong>
                  <span>Docker instalado · grátis · Win · macOS · Linux</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-title">Instituição</div>
            <div className="inst-card">
              <div className="inst-content">
                <div className="inst-eyebrow">Projeto vinculado à</div>
                <div className="inst-name">Universidade Federal da Paraíba</div>
                <div className="inst-sub">Departamento de Ciências Exatas</div>
                <div className="inst-sub">Curso de Sistemas de Informação</div>
              </div>
              <div className="inst-logos" aria-label="Marcas institucionais">
                <div className="inst-logo-box">
                  <img className="inst-logo" src="/brands/ufpb.png" alt="Logo da Universidade Federal da Paraíba" />
                </div>
                <div className="inst-logo-box">
                  <img className="inst-logo inst-logo-dcx" src="/brands/dcx.png" alt="Logo do Departamento de Ciências Exatas" />
                </div>
                <div className="inst-logo-box">
                  <img className="inst-logo inst-logo-si" src="/brands/si.png" alt="Logo do curso de Sistemas de Informação" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
