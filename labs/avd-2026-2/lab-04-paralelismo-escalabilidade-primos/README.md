# LabDock
## Avaliação de Desempenho de Sistemas (2026.2)
### Lab 04 — Paralelismo e Escalabilidade na Busca de Primos

**Professora:** Raquel Vigolvino Lopes

## Objetivo

Investigar como o número de threads e o tamanho da carga de trabalho
afetam o tempo de execução e a utilização de CPU de um programa Java
paralelo.

## Contexto

O programa procura números primos no intervalo de 1 até um limite
informado. Ele divide esse intervalo entre as threads solicitadas e
soma as quantidades encontradas em cada parte. O resultado deve ser
igual para todas as configurações; o que muda é o custo da execução.

Neste experimento, `numero_maximo` representa a carga de trabalho e
`threads` representa o grau de paralelismo solicitado. A utilização de
CPU registrada é a média do processo Java como percentual da capacidade
total de processamento disponibilizada ao container. O número de
processadores disponíveis também aparece no CSV.

## Pré-requisitos

- Docker e Docker Compose instalados;
- noções básicas de terminal Linux;
- conceitos iniciais de tempo de execução, CPU e threads.

## Como iniciar

Na pasta do laboratório, execute:

```bash
docker compose up -d --build
docker compose exec avd2026-2-lab-04 bash --login
```

## Exercícios

### Exercício 1 — Conhecer o ambiente e o programa

Registre no relatório o modelo de CPU, a memória e o sistema operacional
do computador hospedeiro. Consulte essas informações nas configurações
do seu sistema, fora do container. Depois, no container, consulte o
ambiente que executará o benchmark:

```bash
nproc
java -version
```

Antes de medir, leia `BenchmarkNumerosPrimos.java`. Identifique como o
intervalo é dividido e como as contagens parciais são combinadas.

### Exercício 2 — Efeito do número de threads

Mantenha `numero_maximo` fixo em 1000000 (ou outro valor grande que você desejar) e varie o número de threads.
Inclua 1 thread, valores intermediários, inclua o valor de `nproc` e também valores acima de `nproc`. Ajuste a lista do exemplo à quantidade de processadores disponível no seu container. O programa aceita até `numero_maximo`
threads, embora usar tantas threads não seja uma escolha recomendada. Escolha um valor de repetições a serem executadas de cada cenário (ideal é 30). No exemplo abaixo estão configuradas 5 repetições de cada experimento.

```bash
./scripts/executar_experimentos.sh 1,2,4,8 1000000 5 resultados/threads.csv
```

O programa faz uma rodada de aquecimento e as repetições na mesma JVM para cada configuração; somente as repetições entram no CSV. Cada medição cria o conjunto de threads dentro do intervalo cronometrado.
No arquivo `threads.csv`, agrupe as linhas por `threads` e calcule a média de `tempo_ms` e `utilizacao_cpu_pct`. Faça um gráfico de threads por tempo médio e outro de threads por utilização média. Explique por que adicionar
threads pode deixar de trazer ganhos ou até aumentar o tempo.

### Exercício 3 — Efeito do tamanho da carga

Escolha uma quantidade de threads a partir dos resultados anteriores e mantenha-a fixa. Varie o limite da busca:

```bash
./scripts/executar_experimentos.sh 4 1000000,2000000,3000000,4000000 30 resultados/carga.csv
```

No arquivo `carga.csv`, agrupe as linhas por `numero_maximo` e calcule a média de `tempo_ms`. Faça um gráfico do limite de busca por tempo médio. Discuta se o crescimento observado parece proporcional e quais fatores
podem explicar diferenças.

Se os valores estiverem muito altos e o experimento demorar muito (mais de 10min) pra rodar, pode alterar os valores. Execute o experimento com uma quantidade grande de repetições de forma que você possa estudar a cauda dos tempos de execução. Em geral, os contratos de nível de serviço falam de tempo médio de resposta (ou execução) e também da cauda desses tempos (que são, por exemplo, os temos de resposta no percentil 90, 95 ou 99).

### Exercício 4 — Relatório

No relatório você tem que contextualizar bem os experimentos que executou, por que escolheu os valores que escolheu, justificar quantidade de repetições, justificar a decisão pela quantidade de threads a ser usada no segundo experimento.

Use tabelas e gráficos construídos a partir dos dados nos arquivos CSVs para responder questões interessantes (algumas listadas abaixo mas pode acrescentar outras). Apresente também os intervalos de confiança da média de suas métricas para a comparação adequada; faça um estudo da cauda do tempo de execução e veja se existe algum modelo de regressão limear que possa prever o tempo de execução com base no número de threads e no número usado para encontrar primos menores que ele. 

1. Como o número de threads afetou o tempo de execução e a utilização de CPU?
2. Qual configuração de threads foi mais adequada nesta máquina? Por quê?
3. O resultado seria necessariamente igual em outra máquina ou com outro limite de recursos no container?
4. Como o aumento de `numero_maximo` afetou o tempo de execução?
5. O programa apresentou escalabilidade nos valores medidos? Justifique e discuta custos de criação/sincronização das threads e limites de CPU.
6. Qual o tempo de resposta dos 5% das execuções mais lentas de cada cenário?

## Sobre as medições

O valor 1000000 acompanha o exemplo da prática, mas a busca pode terminar rápido demais para comparar configurações em algumas máquinas. Nesse caso, use limites maiores e registre os valores utilizados. Para cada
configuração, o programa faz uma execução de aquecimento na mesma JVM, descarta essa medição e grava as repetições seguintes. Outros processos, limites do Docker e diferenças de hardware também podem alterar os resultados. Compare medições feitas no mesmo ambiente e interprete a utilização de CPU junto com o tempo.

## Encerrar

```bash
exit
docker compose down
```
