# LabDock
## Avaliação de Desempenho de Sistemas (2026.2)
### Lab 03 — Regressão Linear para Predição de Desempenho

**Professora:** Raquel Vigolvino Lopes

## Objetivo

Construir modelos de regressão linear simples e múltipla para prever o
tempo de compressão de conjuntos de arquivos, escolhendo uma ou duas
variáveis preditoras e avaliando a qualidade dos modelos obtidos.

## Contexto

Nos laboratórios anteriores, você observou a variabilidade das
medições e comparou alternativas usando intervalos de confiança. Neste
laboratório, a pergunta muda: em vez de apenas comparar resultados já
coletados, será possível **prever** o desempenho de novos cenários.

O tempo de compressão pode depender de vários fatores. Neste
experimento, ele será a variável resposta e você poderá escolher até
duas das seguintes variáveis preditoras:

- `tamanho_total_mb`: tamanho total do conjunto de arquivos
- `quantidade_arquivos`: número de arquivos no conjunto
- `repetitividade_pct`: percentual de conteúdo repetitivo nos arquivos

Com uma variável preditora, você terá uma **regressão linear simples**:

```text
tempo_real_s = b0 + b1 * tamanho_total_mb
```

Com duas variáveis preditoras, terá uma **regressão linear múltipla**:

```text
tempo_real_s = b0 + b1 * tamanho_total_mb + b2 * quantidade_arquivos
```

O método de compressão será mantido fixo como `tar.gz`. Assim, as
variações no tempo podem ser relacionadas às características dos
datasets, e não à troca de algoritmo de compressão. As repetições de
cada cenário serão usadas para calcular um tempo médio antes do ajuste
dos modelos.

## Pré-requisitos

- Docker e Docker Compose instalados
- Conhecimento básico de terminal Linux
- Noções iniciais de média e gráficos

## Como iniciar o laboratório

Abra um terminal nesta pasta e execute:

```bash
docker compose up -d
docker compose exec avd2026-2-lab-03 bash --login
```

## Exercícios

### Exercício 1 — Formular hipóteses

Antes de gerar os dados, responda:

- Um conjunto maior deve levar mais tempo para comprimir? Por quê?
- Mantendo o tamanho total igual, um conjunto com muitos arquivos deve
  levar o mesmo tempo que um conjunto com poucos arquivos? Por quê?
- A repetitividade dos dados pode afetar o tempo de compressão? Como?

Essas respostas são hipóteses. Ao final, você vai confrontá-las com os
modelos ajustados.

### Exercício 2 — Gerar cenários controlados

Gere os cenários do experimento:

```bash
python3 scripts/gerar_cenarios.py
```

O comando cria 27 cenários, combinando três valores para cada uma das
três variáveis:

| Variável | Valores padrão |
| --- | --- |
| Tamanho total | 1 MB, 4 MB e 8 MB |
| Quantidade de arquivos | 5, 50 e 200 |
| Repetitividade | 20%, 60% e 95% |

As combinações ficam em `dados/cenarios/`. O arquivo
`dados/cenarios.csv` registra as características de cada cenário.
Os dados são sintéticos: a repetitividade representa a proporção de
bytes construídos a partir de um padrão repetido, para permitir o
controle dessa característica. Ao gerar novamente os cenários, o
conteúdo anterior da pasta `dados/` é substituído.

Antes da execução completa, você pode testar todo o fluxo com uma
versão menor, com oito cenários:

```bash
python3 scripts/gerar_cenarios.py --tamanhos-mb 1,2 --quantidades-arquivos 5,50 --repetitividades 20,95
```

Depois do teste, execute novamente o comando sem parâmetros para gerar
os 27 cenários da atividade principal.

Observe o manifesto:

```bash
cat dados/cenarios.csv
```

### Exercício 3 — Coletar as medições

Execute cinco repetições para cada cenário:

```bash
./scripts/executar_experimentos.sh dados 5
```

O script mantém o algoritmo de compressão fixo (`tar.gz`) e salva uma
linha por execução em:

```text
resultados/experimento.csv
```

As colunas principais são:

```text
cenario
tamanho_total_mb
quantidade_arquivos
repetitividade_pct
tempo_real_s
```

Também são coletados tempo de usuário, tempo de sistema, memória,
tamanho comprimido e taxa de compressão. O arquivo mantém uma linha
por execução para registrar a variabilidade; o script de análise usa a
média das repetições de cada cenário, evitando tratar repetições como
novas configurações experimentais.

Cada nova execução substitui `resultados/experimento.csv` e remove os
arquivos comprimidos de execuções anteriores. Como os tempos podem ser
curtos, evite executar outras tarefas pesadas durante a coleta.

### Exercício 4 — Regressão linear simples

Escolha **uma** variável preditora. Comece pelo tamanho total:

```bash
python3 scripts/analisar_regressao.py resultados/experimento.csv --preditores tamanho_total_mb
```

O script informa a equação ajustada, `R2`, `R2 ajustado`, o erro
quadrático médio (`RMSE`) e o erro absoluto médio (`MAE`). Para comparar
modelos com números diferentes de preditores, use principalmente o
`R2 ajustado`. Ele pode ser menor que `R2`, ou até negativo, quando o
modelo explica pouco da variação observada.

Exemplo de interpretação de uma saída fictícia:

```text
tempo_real_s = 0.018000 + 0.120000 * tamanho_total_mb
```

Nos cenários observados, cada MB adicional está associado a
aproximadamente `0,12 s` a mais no tempo previsto. Como este é um
modelo simples, essa associação não isola os efeitos das demais
variáveis do experimento.

Um modelo linear é apenas uma aproximação. Dependendo dos preditores
escolhidos, ele pode produzir uma previsão negativa para algum cenário;
isso não significa tempo negativo, mas evidencia uma limitação do
modelo para aquela combinação de variáveis.

Repita para os outros preditores:

```bash
python3 scripts/analisar_regressao.py resultados/experimento.csv --preditores quantidade_arquivos
python3 scripts/analisar_regressao.py resultados/experimento.csv --preditores repetitividade_pct
```

Compare os valores de `R2` e os erros, mas não use apenas essas
métricas: observe também se o sinal dos coeficientes faz sentido para o
fenômeno estudado. Não compare diretamente a magnitude de coeficientes
que usam unidades diferentes.

### Exercício 5 — Regressão linear múltipla

Agora escolha **duas** variáveis preditoras. Por exemplo:

```bash
python3 scripts/analisar_regressao.py resultados/experimento.csv --preditores tamanho_total_mb quantidade_arquivos
```

Experimente outros pares:

```bash
python3 scripts/analisar_regressao.py resultados/experimento.csv --preditores tamanho_total_mb repetitividade_pct
python3 scripts/analisar_regressao.py resultados/experimento.csv --preditores quantidade_arquivos repetitividade_pct
```

Além dos coeficientes na unidade original, a saída mostra coeficientes
padronizados. Eles permitem comparar a intensidade da associação entre
preditores com unidades diferentes; não representam causalidade.

Responda:

- O `R2 ajustado` melhorou ao adicionar o segundo preditor? A melhora
  parece relevante?
- O erro do modelo (`RMSE` e `MAE`) é pequeno o suficiente para o uso
  que você imaginou? Explique usando a escala dos tempos medidos.
- Considerando os coeficientes padronizados e previsões para cenários
  plausíveis, qual preditor parece ter maior associação com o tempo?
- Algum coeficiente teve sinal contrário ao que você esperava? Como
  você explicaria isso?

### Exercício 6 — Visualizar os dados

Copie o conteúdo de `resultados/experimento.csv` e importe no
[Datawrapper](https://www.datawrapper.de/). Os pontos repetidos de cada
cenário ajudam a visualizar a variabilidade das medições.

Produza pelo menos dois gráficos:

- gráfico de dispersão de `tamanho_total_mb` versus `tempo_real_s`
- gráfico de dispersão de `quantidade_arquivos` versus `tempo_real_s`

Como terceiro gráfico opcional, use `repetitividade_pct` no eixo X e
`tempo_real_s` no eixo Y.

Discuta se as relações observadas visualmente parecem lineares. Um
modelo linear pode ser útil mesmo quando não explica toda a variação,
mas suas limitações precisam ser reconhecidas.

### Exercício 7 — Relatório final

Escreva um relatório curto respondendo:

1. Qual modelo simples apresentou o melhor ajuste? Use `R2`, `RMSE`,
   `MAE` e a interpretação do coeficiente para justificar.
2. Qual par de variáveis gerou o melhor modelo múltiplo?
3. A inclusão do segundo preditor trouxe uma melhora relevante no
   `R2 ajustado`? Quais evidências sustentam sua resposta?
4. Compare suas hipóteses iniciais com os resultados obtidos.
5. O que o modelo não consegue explicar? Cite possíveis fontes de
   variabilidade que ficaram fora dos preditores escolhidos.
6. Em quais situações reais um modelo como esse poderia ajudar a tomar
   decisões sobre desempenho?

## Como encerrar o laboratório

```bash
exit
docker compose down
```

Os dados em `dados/` e os resultados em `resultados/` permanecem na
pasta do laboratório após encerrar o container.
