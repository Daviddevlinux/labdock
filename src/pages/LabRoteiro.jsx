import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import Navbar from '../components/Navbar'
import labs from '../data/labs.json'
import { readmes } from '../lib/readmes'

const avdLabSlug = 'lab-01-variabilidade-merge-sort'
const avdDisciplinaSlug = 'avaliacao-desempenho-sistemas-2026-2'

const quickCommands = [
  {
    title: '1. Criar a entrada',
    command: 'python3 scripts/gerar_entrada.py 50000 entrada.txt',
    expected: "Arquivo 'entrada.txt' gerado com 50000 números (modo: aleatorio).",
  },
  {
    title: '2. Rodar o experimento',
    command: './scripts/executar_experimento.sh entrada.txt 50000',
    expected: 'Executando python... Executando java... Experimento concluído.',
  },
  {
    title: '3. Conferir a tabela',
    command: 'cat resultados/experimento.csv',
    expected: 'Uma tabela CSV com linguagem, tamanho, execução, tempos e memória.',
  },
]

const metricCards = [
  {
    label: 'Tempo real',
    description: 'É o tempo do cronômetro: começa quando o programa inicia e termina quando ele acaba.',
  },
  {
    label: 'Tempo de usuário',
    description: 'É o tempo de CPU gasto pelo próprio programa comparando e organizando números.',
  },
  {
    label: 'Tempo de sistema',
    description: 'É o tempo de CPU gasto em pedidos ao sistema operacional, como ler o arquivo de entrada.',
  },
  {
    label: 'Memória',
    description: 'É o maior espaço de memória usado pelo programa durante a execução.',
  },
]

const exerciseSections = [
  {
    title: 'Exercício 1',
    subtitle: 'Conhecer as duas implementações',
    body: 'Antes de medir, compare os arquivos Python e Java. Os dois fazem Merge Sort: dividem a lista em partes menores, ordenam essas partes e depois juntam tudo.',
    commands: ['cat merge_sort.py', 'cat MergeSort.java'],
    checks: [
      'Onde acontece a recursão em cada linguagem.',
      'Onde acontece a mesclagem, chamada de merge.',
      'Onde cada programa confirma que o resultado ficou ordenado.',
    ],
  },
  {
    title: 'Exercício 2',
    subtitle: 'Gerar uma entrada e medir pela primeira vez',
    body: 'Crie uma lista com 50 mil números e rode Python e Java cinco vezes cada. O CSV será acumulativo: novas medições entram no final do arquivo.',
    commands: [
      'python3 scripts/gerar_entrada.py 50000 entrada.txt',
      './scripts/executar_experimento.sh entrada.txt 50000',
      'cat resultados/experimento.csv',
    ],
    checks: [
      'Aparecem linhas para python e java.',
      'Cada linguagem tem mais de uma execução.',
      'Os tempos não precisam ser iguais aos exemplos.',
    ],
  },
  {
    title: 'Exercício 3',
    subtitle: 'Observar a variação entre execuções',
    body: 'Use o mesmo arquivo de entrada e rode o experimento novamente. A pergunta central é: as repetições deram exatamente o mesmo tempo?',
    commands: [
      './scripts/executar_experimento.sh entrada.txt 50000',
      'cat resultados/experimento.csv',
    ],
    checks: [
      'Compare as linhas python,50000 entre si.',
      'Compare as linhas java,50000 entre si.',
      'Calcule média e desvio padrão do tempo_real_s.',
    ],
  },
  {
    title: 'Exercício 4',
    subtitle: 'Testar tamanhos diferentes',
    body: 'Agora a ideia é observar escalabilidade: o que acontece quando o tamanho da entrada cresce?',
    commands: [
      'python3 scripts/gerar_entrada.py 10000 entrada-10000.txt',
      './scripts/executar_experimento.sh entrada-10000.txt 10000',
      'python3 scripts/gerar_entrada.py 100000 entrada-100000.txt',
      './scripts/executar_experimento.sh entrada-100000.txt 100000',
      'python3 scripts/gerar_entrada.py 1000000 entrada-1000000.txt',
      './scripts/executar_experimento.sh entrada-1000000.txt 1000000',
    ],
    checks: [
      'O número usado para gerar a entrada deve ser o mesmo usado no experimento.',
      'O CSV deve ter resultados para pelo menos três tamanhos.',
      'Entradas grandes podem demorar alguns segundos.',
    ],
  },
  {
    title: 'Exercício 5',
    subtitle: 'Criar gráficos no Datawrapper',
    body: 'Use o CSV para montar gráficos. Se houver várias execuções por tamanho, calcule a média antes de fazer o gráfico de tempo.',
    commands: ['cat resultados/experimento.csv'],
    checks: [
      'Gráfico de tempo de execução versus tamanho da entrada.',
      'Gráfico usando memória ou outra métrica relevante.',
      'Linhas ou cores separadas para Python e Java.',
    ],
  },
  {
    title: 'Exercício 6',
    subtitle: 'Escrever o relatório final',
    body: 'O relatório deve usar os dados e gráficos para sustentar as conclusões. A resposta não deve ser baseada em uma execução isolada.',
    commands: [],
    checks: [
      'Comparação entre linguagens.',
      'Variabilidade entre execuções.',
      'Escalabilidade e relação com O(n log n).',
      'Consumo de memória.',
      'Uma métrica adicional que valeria medir.',
    ],
  },
]

function CodeBlock({ children }) {
  return <pre className="roteiro-code"><code>{children}</code></pre>
}

function AvdMergeSortRoteiro({ disciplina, lab, disciplinaSlug, labSlug }) {
  return (
    <>
      <Navbar />
      <main className="container roteiro-page">
        <section className="roteiro-hero">
          <div className="breadcrumb">
            <Link to="/laboratorios">Laboratórios</Link> › <Link to={`/laboratorios/${disciplinaSlug}/${labSlug}`}>{lab.nome}</Link> › Roteiro
          </div>

          <div className="roteiro-hero-grid">
            <div>
              <p className="roteiro-kicker">{disciplina.nome}</p>
              <h1>Lab 01: Variabilidade e Comparação de Desempenho</h1>
              <p>
                Um roteiro guiado para entender por que medir o tempo de um programa uma única vez
                não basta. O aluno compara Merge Sort em Python e Java, coleta dados, cria gráficos
                e escreve uma conclusão baseada em evidência.
              </p>
              <div className="roteiro-actions">
                <a className="btn-primary" href="#passo-a-passo">Começar roteiro</a>
                <a className="btn-secondary" href="#entrega">Ver entrega final</a>
                <Link to={`/laboratorios/${disciplinaSlug}/${labSlug}`} className="roteiro-return-btn">
                  <span aria-hidden="true">←</span> Voltar para a página do laboratório
                </Link>
              </div>
            </div>

            <aside className="roteiro-summary" aria-label="Resumo do laboratório">
              <div>
                <span>Professora</span>
                <strong>{lab.professor.nome}</strong>
              </div>
              <div>
                <span>Duração</span>
                <strong>{lab.duracao}</strong>
              </div>
              <div>
                <span>Nível</span>
                <strong>{lab.nivel}</strong>
              </div>
              <div>
                <span>Ferramentas</span>
                <strong>Python, Java, Docker, CSV</strong>
              </div>
            </aside>
          </div>
        </section>

        <section className="roteiro-panel roteiro-intro">
          <div>
            <p className="section-title">Ideia central</p>
            <h2>O mesmo caminho pode levar tempos diferentes</h2>
            <p>
              Imagine cronometrar todos os dias o tempo de casa até a faculdade. A rota é a mesma,
              mas o trânsito, o sinal e pequenas diferenças no caminho mudam o resultado. Com
              programas acontece algo parecido: o mesmo código, com os mesmos dados, pode variar
              entre execuções.
            </p>
          </div>
          <div className="roteiro-analogy" aria-label="Analogia visual do experimento">
            <div>Casa</div>
            <span>rota igual</span>
            <div>Faculdade</div>
            <small>tempos diferentes a cada medição</small>
          </div>
        </section>

        <section className="roteiro-panel">
          <p className="section-title">Como pensar no experimento</p>
          <div className="roteiro-flow">
            <div>
              <strong>Entrada</strong>
              <span>Lista de números</span>
            </div>
            <div>
              <strong>Repetições</strong>
              <span>Python e Java várias vezes</span>
            </div>
            <div>
              <strong>CSV</strong>
              <span>Tempo e memória registrados</span>
            </div>
            <div>
              <strong>Gráficos</strong>
              <span>Comparação por linguagem</span>
            </div>
            <div>
              <strong>Relatório</strong>
              <span>Conclusão com evidência</span>
            </div>
          </div>
        </section>

        <section className="roteiro-panel">
          <p className="section-title">Preparação</p>
          <div className="roteiro-two-col">
            <div>
              <h2>1. Abra o ambiente do laboratório</h2>
              <p>
                O Docker funciona como uma caixa pronta: dentro dela já estão Python, Java e as
                ferramentas do experimento. Primeiro ligue a caixa, depois entre nela.
              </p>
            </div>
            <div>
              <CodeBlock>{'docker compose up -d\ndocker compose exec avd2026-2-lab-01 bash --login'}</CodeBlock>
              <p className="roteiro-hint">Quando aparecer algo parecido com <code>root@...:/lab#</code>, os próximos comandos já são dentro do container.</p>
            </div>
          </div>
        </section>

        <section className="roteiro-panel" id="passo-a-passo">
          <p className="section-title">Resumo executável</p>
          <h2>O caminho mínimo para gerar dados</h2>
          <div className="roteiro-command-grid">
            {quickCommands.map((item, index) => (
              <article className={`roteiro-command-card${index === 2 ? ' roteiro-command-card--wide' : ''}`} key={item.title}>
                <h3>{item.title}</h3>
                <CodeBlock>{item.command}</CodeBlock>
                <p><strong>Esperado:</strong> {item.expected}</p>
              </article>
            ))}
          </div>
          <div className="roteiro-warning">
            <strong>Atenção ao tamanho da entrada</strong>
            <p><strong>50.000 é apenas um exemplo.</strong> Você pode escolher outro tamanho de entrada; só use o mesmo número para gerar o arquivo e para executar o experimento.</p>
            <div className="roteiro-size-guide" aria-label="Sugestões de tamanhos de entrada">
              <span>Boas opções para testar:</span>
              <code>10.000</code>
              <code>50.000</code>
              <code>100.000</code>
              <code>1.000.000</code>
            </div>
            <CodeBlock>{'python3 scripts/gerar_entrada.py 200000 entrada.txt\n./scripts/executar_experimento.sh entrada.txt 200000'}</CodeBlock>
          </div>
        </section>

        <section className="roteiro-panel">
          <p className="section-title">Conceitos que aparecem no CSV</p>
          <h2>Como ler as métricas sem travar no vocabulário</h2>
          <div className="roteiro-metric-grid">
            {metricCards.map(metric => (
              <article className="roteiro-metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <p>{metric.description}</p>
              </article>
            ))}
          </div>
          <div className="roteiro-note">
            <strong>JIT no Java</strong>
            <p>
              A máquina virtual Java pode preparar e otimizar partes do código durante as primeiras
              execuções. Por isso, comparar só uma rodada pode levar a uma conclusão fraca.
            </p>
          </div>
        </section>

        <section className="roteiro-panel">
          <p className="section-title">Exercícios</p>
          <h2>Passo a passo do laboratório</h2>
          <div className="roteiro-exercises">
            {exerciseSections.map(section => (
              <article className="roteiro-exercise" key={section.title}>
                <div className="roteiro-exercise-head">
                  <span>{section.title}</span>
                  <h3>{section.subtitle}</h3>
                </div>
                <p>{section.body}</p>
                {section.commands.length > 0 && (
                  <CodeBlock>{section.commands.join('\n')}</CodeBlock>
                )}
                <ul>
                  {section.checks.map(check => <li key={check}>{check}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="roteiro-panel" id="entrega">
          <p className="section-title">Entrega final</p>
          <h2>O relatório precisa responder estas cinco perguntas</h2>
          <ol className="roteiro-report-list">
            <li>Qual implementação foi mais rápida? Isso se manteve em todos os tamanhos?</li>
            <li>Uma única execução seria suficiente para afirmar qual linguagem é mais rápida?</li>
            <li>O crescimento do tempo parece linear ou mais acentuado? Relacione com O(n log n).</li>
            <li>O consumo de memória cresce da mesma forma que o tempo?</li>
            <li>Além de tempo e memória, qual outra métrica seria interessante medir?</li>
          </ol>
        </section>

        <section className="roteiro-panel roteiro-finish">
          <div>
            <p className="section-title">Encerramento</p>
            <h2>Ao terminar, desligue o ambiente</h2>
            <p>Os resultados continuam salvos na pasta <code>resultados/</code>.</p>
          </div>
          <CodeBlock>{'exit\ndocker compose down'}</CodeBlock>
        </section>
      </main>
    </>
  )
}

export default function LabRoteiro() {
  const { disciplinaSlug, labSlug } = useParams()

  const disciplina = labs.disciplinas.find(d => d.slug === disciplinaSlug)
  const lab = disciplina?.labs.find(l => l.slug === labSlug)
  const readmeHtml = lab?.readme && readmes[lab.readme]
    ? marked.parse(readmes[lab.readme])
    : null

  if (lab && disciplinaSlug === avdDisciplinaSlug && labSlug === avdLabSlug) {
    return (
      <AvdMergeSortRoteiro
        disciplina={disciplina}
        lab={lab}
        disciplinaSlug={disciplinaSlug}
        labSlug={labSlug}
      />
    )
  }

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
          <Link to={`/laboratorios/${disciplinaSlug}/${labSlug}`} className="roteiro-return-btn roteiro-back">← Voltar para a página do laboratório</Link>
        </div>

        <div className="detail-body">
          <div className="readme-content" dangerouslySetInnerHTML={{ __html: readmeHtml }} />
        </div>
      </div>
    </>
  )
}
