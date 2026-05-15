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
              <p>Quem já cursou uma disciplina prática de computação sabe como é: a aula começa, o professor passa o exercício, e metade da turma trava antes mesmo de começar. Java não funciona na versão certa, uma biblioteca está faltando, o Linux do colega se comporta diferente do seu, a porta está ocupada.</p>
              <p>Esse tempo perdido em configuração de ambiente é um problema real e recorrente. Não é culpa do professor nem do aluno — é estrutural. Cada máquina é diferente, e garantir que todos partam do mesmo ponto é genuinamente difícil.</p>
              <div className="quote">
                <p>"O objetivo do LabDock é que o único comando que o aluno precise rodar antes de estudar seja: docker compose up."</p>
              </div>
              <p>O projeto nasceu como Trabalho de Conclusão de Curso no Departamento de Sistemas e Computação da UFPB, com o objetivo de criar uma solução simples, gratuita e reutilizável para distribuição de laboratórios acadêmicos padronizados.</p>
            </div>
          </div>

          <div>
            <div className="section-title">Instituição</div>
            <div className="inst-card">
              <div className="inst-icon">🎓</div>
              <div>
                <div className="inst-name">Universidade Federal da Paraíba</div>
                <div className="inst-sub">Departamento de Sistemas e Computação · DSC/UFPB</div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-title">Como funciona</div>
            <div className="sobre-block">
              <p>Cada laboratório é empacotado como um ambiente Docker. O professor define uma vez quais ferramentas e exercícios compõem o lab. O aluno baixa um arquivo <code>.zip</code> com tudo dentro, roda <code>docker compose up</code> e o ambiente está pronto — igual em qualquer máquina.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}