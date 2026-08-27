# LabDock
## Avaliação de Desempenho de Sistemas (2026.2)
### Lab 01 — Variabilidade e Comparação de Desempenho

**Professora:** Raquel Vigolvino Lopes

## Objetivo

Sentir na prática a variabilidade das medições de desempenho e comparar
o comportamento de duas implementações equivalentes de Merge Sort —
uma em Python e outra em Java — sob diferentes tamanhos de entrada,
produzindo um relatório final com gráficos que sustentem suas
conclusões.

## Contexto

Ao medir o desempenho de um programa, é tentador rodá-lo **uma única
vez** e considerar o resultado como "o" tempo de execução. Na prática,
medições de desempenho variam entre execuções por diversos fatores:
escalonamento do sistema operacional, estado do cache, coleta de lixo
(no caso do Java), ruído de outros processos na máquina, entre outros.

Por isso, avaliação de desempenho séria exige **planejamento
experimental**: decidir quantas repetições fazer, quais entradas
testar, e como resumir estatisticamente os resultados (média, mediana,
desvio padrão, percentis) antes de tirar qualquer conclusão.

Neste laboratório, você vai comparar duas implementações do mesmo
algoritmo (Merge Sort) em linguagens diferentes — Python e Java — e
observar como o tempo de execução, o uso de CPU e o consumo de memória
variam entre execuções e entre tamanhos de entrada.

## Pré-requisitos

- Docker e Docker Compose instalados
- Conhecimento básico de terminal Linux
- Noções de complexidade de algoritmos (desejável)

## Como iniciar o laboratório

Abra um terminal nesta pasta e execute:

```bash
docker compose up -d
docker compose exec avd2026-2-lab-01 bash --login
```

## Exercícios

### Exercício 1 — Explorar as implementações

Antes de rodar qualquer experimento, leia o código das duas
implementações:

```bash
cat merge_sort.py
cat MergeSort.java
```

Ambas implementam o mesmo algoritmo (Merge Sort recursivo, dividindo o
vetor ao meio e mesclando as partes ordenadas). Identifique:

- Onde ocorre a recursão em cada versão
- Onde ocorre a mesclagem (`merge`)
- Que ambas fazem uma verificação de corretude ao final (garantindo que
  o resultado está de fato ordenado)

### Exercício 2 — Gerar uma entrada e rodar um primeiro experimento

Gere um arquivo de entrada com um tamanho à sua escolha:

```bash
python3 scripts/gerar_entrada.py 50000 entrada.txt
```

O primeiro parâmetro é o tamanho do vetor. Você pode gerar entradas em
três modos: `aleatorio` (padrão), `crescente` ou `decrescente` — por
exemplo:

```bash
python3 scripts/gerar_entrada.py 50000 entrada.txt decrescente
```

Em seguida, rode o experimento, que executa as duas versões (Python e
Java) várias vezes cada, medindo tempo e memória de cada execução:

```bash
./scripts/executar_experimento.sh entrada.txt 50000
```

Por padrão, cada versão roda 5 vezes. Você pode alterar esse número
passando um terceiro parâmetro:

```bash
./scripts/executar_experimento.sh entrada.txt 50000 10
```

Os resultados são salvos (e acumulados) em
`resultados/experimento.csv`, com uma linha por execução, contendo:

```
linguagem,tamanho_entrada,execucao,tempo_real_s,tempo_usuario_s,tempo_sistema_s,memoria_kb
```

**Por que medir tempo real, de usuário e de sistema separadamente?**
O tempo *real* (wall clock) é o que você sentiria com um cronômetro na
mão; o tempo de *usuário* é o tempo de CPU gasto executando o código
do programa; o tempo de *sistema* é o tempo de CPU gasto em chamadas
ao sistema operacional (como leitura de arquivos). Em uma máquina
ociosa, tempo real ≈ tempo de usuário + tempo de sistema — mas isso
pode mudar bastante se outros processos estiverem competindo por CPU.

### Exercício 3 — Observar a variação entre execuções

Repita o Exercício 2 usando **o mesmo tamanho de entrada** e observe as
linhas geradas no CSV para uma mesma linguagem.

- Os tempos de execução são idênticos entre repetições, ou variam?
- Calcule manualmente (ou em uma planilha) a média e o desvio padrão
  do `tempo_real_s` para cada linguagem, considerando apenas as
  execuções desse tamanho de entrada.
- O desvio padrão é pequeno (medições consistentes) ou grande
  (medições muito variáveis)? O que isso sugere sobre a confiabilidade
  de uma medição feita com uma única execução?

### Exercício 4 — Testar diferentes tamanhos de entrada

Repita os Exercícios 2 e 3 para **pelo menos três tamanhos de entrada
diferentes**, à sua escolha (por exemplo, 10 mil, 100 mil e 1 milhão de
elementos — mas sinta-se livre para escolher outros valores, inclusive
testar diferentes distribuições com o parâmetro de modo do gerador).

Como o script acumula os resultados no mesmo arquivo CSV, ao final
deste exercício `resultados/experimento.csv` deverá conter execuções
de Python e Java para todos os tamanhos testados.

**Atenção:** para tamanhos muito grandes, a execução pode demorar
alguns segundos — isso é esperado e faz parte da observação.

### Exercício 5 — Visualizar no Datawrapper

Copie o conteúdo do arquivo `resultados/experimento.csv` (ou baixe o
arquivo do container) e importe no [Datawrapper](https://www.datawrapper.de/):

1. Acesse datawrapper.de e clique em **Start creating**
2. Clique em **Copy & paste data table** e cole o conteúdo do CSV
3. Clique em **Proceed** até chegar em **Visualize**
4. Escolha o tipo de gráfico mais adequado para comparar Python e Java
   (por exemplo, um gráfico de linhas com o tamanho da entrada no eixo
   X e o tempo médio no eixo Y, uma linha para cada linguagem)

Produza pelo menos dois gráficos:

- **Tempo de execução vs. tamanho da entrada**, comparando Python e
  Java
- Um gráfico à sua escolha, envolvendo **memória** ou outra métrica que
  você considere relevante

### Exercício 6 — Relatório final

Com base nos dados coletados e nos gráficos produzidos, escreva um
relatório curto (pode ser neste próprio README, em um documento à
parte, ou no formato que a professora indicar em sala) respondendo:

1. **Comparação entre linguagens.** Qual implementação foi mais rápida?
   Isso se manteve consistente para todos os tamanhos de entrada
   testados, ou houve alguma inversão? Se houve, a que você atribui
   essa mudança? *(Dica: pense no que acontece antes mesmo do
   algoritmo começar a rodar, em cada linguagem.)*
2. **Variabilidade.** Com base no que você observou no Exercício 3, uma
   única execução seria suficiente para afirmar qual linguagem é mais
   rápida? Por quê?
3. **Escalabilidade.** Observando o gráfico de tempo vs. tamanho da
   entrada, o crescimento parece **linear**? Uma aplicação que escala
   linearmente apresenta uma reta nesse tipo de gráfico. O que você
   observou se aproxima disso, ou o crescimento é mais acentuado?
   Relacione sua resposta com a complexidade teórica do Merge Sort.
4. **Memória.** O consumo de memória também cresce da mesma forma que
   o tempo de execução? Alguma linguagem consome consistentemente mais
   memória que a outra?
5. **Métrica adicional.** Além de tempo de execução e memória, proponha
   **uma outra métrica** que poderia ser interessante medir neste
   experimento (por exemplo, algo relacionado a energia, a I/O, ao
   número de operações de comparação, ou outra que você imagine).
   Explique por que ela seria relevante e, se possível, como você a
   mediria.

## Como encerrar o laboratório

```bash
exit
docker compose down
```

Os resultados ficam salvos na pasta `resultados/` mesmo após encerrar
o container.
