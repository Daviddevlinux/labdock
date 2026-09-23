# LabDock
## Avaliação de Desempenho de Sistemas (2026.2)
### Lab 02 — Comparação de Algoritmos de Compressão com Intervalos de Confiança

**Professora:** Raquel Vigolvino Lopes

## Objetivo

Comparar algoritmos de compressão usando medições repetidas, intervalos
de confiança e experimentos pareados, observando o compromisso entre
tempo de execução e tamanho final do arquivo comprimido.

## Contexto

Em avaliações de desempenho, frequentemente precisamos decidir qual
alternativa é "melhor" entre várias opções. No entanto, essa decisão
raramente deve ser baseada em uma única execução. Medições de tempo
podem variar, e métodos diferentes podem apresentar vantagens em
métricas diferentes.

Neste laboratório, você vai comparar métodos de compressão disponíveis
em sistemas Linux:

- `zip`
- `tar.gz` (tar + gzip)
- `tar.bz2` (tar + bzip2)
- `tar.xz` (tar + xz)

O `tar` sozinho apenas empacota arquivos. A compressão acontece quando
ele é combinado com algoritmos como `gzip`, `bzip2` ou `xz`.

O experimento será **pareado**: os mesmos conjuntos de arquivos serão
comprimidos por todos os métodos. Isso permite calcular a diferença
entre métodos para cada conjunto de dados e, a partir dessas
diferenças, construir um intervalo de confiança da diferença média.

## Pré-requisitos

- Docker e Docker Compose instalados
- Conhecimento básico de terminal Linux
- Noções iniciais de média, desvio padrão e intervalo de confiança

## Como iniciar o laboratório

Abra um terminal nesta pasta e execute:

```bash
docker compose up -d
docker compose exec avd2026-2-lab-02 bash --login
```

## Exercícios

### Exercício 1 — Empacotar, comprimir e formular hipóteses

Antes de executar o experimento completo, faça um teste pequeno para
observar a diferença entre apenas empacotar arquivos e realmente
comprimi-los:

```bash
mkdir -p teste-compressao
printf "LabDock LabDock LabDock LabDock LabDock\n%.0s" {1..200} > teste-compressao/exemplo.txt

tar -cf exemplo.tar teste-compressao
tar -czf exemplo.tar.gz teste-compressao
tar -cjf exemplo.tar.bz2 teste-compressao
tar -cJf exemplo.tar.xz teste-compressao

ls -lh exemplo.tar exemplo.tar.gz exemplo.tar.bz2 exemplo.tar.xz
```

O arquivo `.tar` apenas empacota o diretório em um único arquivo. Já
os arquivos `.tar.gz`, `.tar.bz2` e `.tar.xz` empacotam e também
comprimem usando algoritmos diferentes.

Responda:

- O arquivo `.tar` ficou menor que os arquivos comprimidos? Por quê?
- Por que `tar.gz`, `tar.bz2` e `tar.xz` aparecem juntos com `tar`?
- Antes de medir, qual método você espera que seja mais rápido?
- Antes de medir, qual método você espera que gere o menor arquivo?
- Você espera que o método mais rápido também gere o menor arquivo?
  Justifique sua hipótese.

### Exercício 2 — Gerar conjuntos de arquivos

Gere os conjuntos de arquivos que serão usados no experimento:

```bash
./scripts/gerar_datasets.sh
```

O script cria a pasta `dados/` com diferentes tipos de conteúdo:

- `texto`: arquivos textuais com frases repetidas
- `csv`: tabelas simulando medições de desempenho
- `codigo`: arquivos de código-fonte Python
- `repetitivo`: conteúdo altamente redundante
- `aleatorio`: conteúdo com menor padrão aparente

Observe os tamanhos gerados:

```bash
du -sh dados/*
```

Responda:

- Quais conjuntos você espera que comprimam melhor?
- Quais conjuntos você espera que comprimam pior?
- Por que o tipo de dado pode influenciar a taxa de compressão?

### Exercício 3 — Executar o experimento

Execute o experimento com 10 repetições:

```bash
./scripts/executar_experimento.sh dados 10
```

O script comprime cada conjunto de arquivos usando `zip`, `tar.gz`,
`tar.bz2` e `tar.xz`. Para cada combinação, ele mede:

- tempo real de execução
- tempo de usuário
- tempo de sistema
- uso máximo de memória
- tamanho original
- tamanho comprimido
- taxa de compressão

Os resultados são salvos em:

```bash
resultados/experimento.csv
```

Cada linha representa uma execução:

```text
dataset,metodo,repeticao,tempo_real_s,tempo_usuario_s,tempo_sistema_s,memoria_kb,tamanho_original_bytes,tamanho_comprimido_bytes,taxa_compressao,arquivo_saida
```

A taxa de compressão é calculada como:

```text
tamanho_comprimido / tamanho_original
```

Quanto menor a taxa, maior foi a redução de tamanho.

### Exercício 4 — Calcular intervalos de confiança

Analise os resultados de tempo real:

```bash
python3 scripts/analisar_resultados.py resultados/experimento.csv
```

O script mostra:

- a média de cada método em cada conjunto de dados
- a margem do intervalo de confiança de 95%
- o limite inferior e superior do intervalo
- a diferença pareada entre dois métodos

Por padrão, a comparação pareada é:

```text
tar.bz2 - tar.gz
```

Ou seja, valores positivos indicam que `tar.bz2` foi mais lento que
`tar.gz` para aquela métrica; valores negativos indicam que foi mais
rápido.

Você pode comparar outros métodos:

```bash
python3 scripts/analisar_resultados.py resultados/experimento.csv --baseline tar.gz --comparado tar.xz
python3 scripts/analisar_resultados.py resultados/experimento.csv --baseline zip --comparado tar.gz
```

Também é possível analisar o tamanho final:

```bash
python3 scripts/analisar_resultados.py resultados/experimento.csv --metrica taxa_compressao --baseline tar.gz --comparado tar.xz
```

Responda:

- O intervalo de confiança da diferença inclui zero?
- Se inclui zero, o que isso sugere sobre a diferença entre os métodos?
- Se não inclui zero, qual método apresentou melhor desempenho para a
  métrica analisada?

### Exercício 5 — Visualizar no Datawrapper

Copie o conteúdo de `resultados/experimento.csv` e importe no
[Datawrapper](https://www.datawrapper.de/):

1. Acesse datawrapper.de e clique em **Start creating**
2. Clique em **Copy & paste data table** e cole o conteúdo do CSV
3. Clique em **Proceed** até chegar em **Visualize**
4. Escolha gráficos adequados para comparar os métodos

Produza pelo menos dois gráficos:

- **Tempo médio de compressão por método e dataset**
- **Taxa de compressão por método e dataset**

Sugestões:

- gráfico de barras agrupadas para comparar métodos por dataset
- gráfico de pontos para mostrar tempo versus taxa de compressão
- gráfico de linhas se você decidir criar datasets com tamanhos
  diferentes

### Exercício 6 — Alterar o experimento

Agora modifique o experimento para investigar uma nova pergunta. Você
pode:

- criar seus próprios arquivos dentro de `dados/`
- remover alguns datasets e manter apenas os que deseja analisar
- aumentar o número de repetições
- comparar apenas dois métodos
- criar datasets de tamanhos diferentes

Exemplos:

```bash
./scripts/executar_experimento.sh dados 30
python3 scripts/analisar_resultados.py resultados/experimento.csv --baseline tar.bz2 --comparado tar.xz
```

Se você quiser recomeçar do zero:

```bash
rm -rf resultados
./scripts/executar_experimento.sh dados 10
```

### Exercício 7 — Relatório final

Com base nos dados coletados, nos intervalos de confiança e nos
gráficos produzidos, escreva um relatório curto respondendo:

1. **Tempo de compressão.** Qual método foi mais rápido? Isso se
   manteve em todos os tipos de arquivo?
2. **Tamanho final.** Qual método gerou os menores arquivos? Ele também
   foi o mais rápido?
3. **Compromisso entre métricas.** Existe uma troca entre tempo de
   execução e taxa de compressão? Explique usando seus dados.
4. **Experimento pareado.** Por que faz sentido comparar os métodos
   usando os mesmos datasets?
5. **Intervalo de confiança da diferença.** Em alguma comparação o
   intervalo incluiu zero? O que isso significa?
6. **Influência do tipo de dado.** Os resultados mudaram entre texto,
   CSV, código, dados repetitivos e dados aleatórios?
7. **Decisão prática.** Se você precisasse escolher um método para
   comprimir muitos arquivos em um servidor, qual escolheria? Depende
   do objetivo ser economizar tempo ou espaço?

## Como encerrar o laboratório

```bash
exit
docker compose down
```

Os dados em `dados/` e os resultados em `resultados/` ficam salvos na
pasta do laboratório mesmo após encerrar o container.
