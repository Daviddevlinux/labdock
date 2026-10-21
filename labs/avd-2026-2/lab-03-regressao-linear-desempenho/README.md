# LabDock
## Avaliação de Desempenho de Sistemas (2026.2)
### Lab 03 — Regressão Linear para Predição de Desempenho

**Professora:** Raquel Vigolvino Lopes

## Objetivo

Explorar dados de compressão e construir modelos de regressão linear
simples e múltipla. Antes de ajustar os modelos, você analisará a
relação entre as variáveis por meio de gráficos de dispersão e da
correlação de Pearson.

## Contexto

Nos laboratórios anteriores, você observou a variabilidade das
medições e comparou alternativas usando intervalos de confiança. Neste
laboratório, a pergunta muda: será possível usar características de um
cenário para prever uma métrica de desempenho?

O experimento mantém o método de compressão fixo como `tar.gz` e varia
três características dos conjuntos de arquivos, que poderão ser usadas
como variáveis preditoras:

- `tamanho_total_mb`: tamanho total do conjunto de arquivos;
- `quantidade_arquivos`: número de arquivos no conjunto;
- `repetitividade_pct`: percentual de conteúdo repetitivo nos arquivos.

Após explorar os dados, escolha uma das seguintes métricas de tempo
como variável resposta:

- `tempo_real_s`: tempo decorrido total;
- `tempo_usuario_s`: tempo de CPU gasto em modo usuário;
- `tempo_sistema_s`: tempo de CPU gasto pelo sistema operacional.

Com uma variável preditora, você terá uma **regressão linear simples**:

```text
tempo_usuario_s = b0 + b1 * tamanho_total_mb
```

Com duas variáveis preditoras, terá uma **regressão linear múltipla**:

```text
tempo_usuario_s = b0 + b1 * tamanho_total_mb + b2 * repetitividade_pct
```

As repetições de cada cenário são usadas para calcular uma média antes
do ajuste dos modelos. Assim, medições repetidas registram a
variabilidade, mas não são tratadas como novos cenários experimentais.

## Pré-requisitos

- Docker e Docker Compose instalados;
- conhecimento básico de terminal Linux;
- noções iniciais de média, gráficos e correlação.

## Como iniciar o laboratório

Abra um terminal nesta pasta e execute:

```bash
docker compose up -d
docker compose exec avd2026-2-lab-03 bash --login
```

## Exercícios

### Exercício 1 — Formular hipóteses

Antes de gerar os dados, responda:

- Um conjunto maior deve aumentar o tempo de usuário durante a
  compressão? Por quê?
- Mantendo o tamanho total igual, um conjunto com muitos arquivos deve
  afetar o tempo real? Por quê?
- A repetitividade pode afetar os tempos medidos? Como?

Essas respostas são hipóteses. Você vai confrontá-las com os gráficos,
as correlações e os modelos ajustados.

### Exercício 2 — Gerar cenários controlados

Gere os cenários do experimento:

```bash
python3 scripts/gerar_cenarios.py
```

O comando cria 27 cenários, combinando três valores para cada variável:

| Variável | Valores padrão |
| --- | --- |
| Tamanho total | 1 MB, 4 MB e 8 MB |
| Quantidade de arquivos | 5, 50 e 200 |
| Repetitividade | 20%, 60% e 95% |

As combinações ficam em `dados/cenarios/`. O arquivo
`dados/cenarios.csv` registra as características de cada cenário.
Os dados são sintéticos: a repetitividade representa a proporção de
bytes construídos a partir de um padrão repetido. Ao gerar novamente os
cenários, o conteúdo anterior da pasta `dados/` é substituído.

Antes da execução completa, você pode testar o fluxo com oito cenários:

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

O script salva uma linha por execução em:

```text
resultados/experimento.csv
```

Além das variáveis dos cenários, o arquivo registra `tempo_real_s`,
`tempo_usuario_s`, `tempo_sistema_s`, memória, tamanho comprimido e
taxa de compressão. Cada nova execução substitui o CSV e remove os
arquivos comprimidos de execuções anteriores. Como os tempos podem ser
curtos, evite executar outras tarefas pesadas durante a coleta.

### Exercício 4 — Explorar os dados antes da regressão

Escolha inicialmente uma variável resposta e gere os gráficos de
dispersão e a matriz de correlação de Pearson. Por exemplo, para
explorar o tempo real:

```bash
python3 scripts/explorar_dados.py resultados/experimento.csv --resposta tempo_real_s
```

Repita para `tempo_usuario_s` e, caso apresente variação suficiente,
para `tempo_sistema_s`:

```bash
python3 scripts/explorar_dados.py resultados/experimento.csv --resposta tempo_usuario_s
python3 scripts/explorar_dados.py resultados/experimento.csv --resposta tempo_sistema_s
```

O script cria, em `resultados/exploracao/`:

- um gráfico de dispersão da resposta escolhida contra cada preditor;
- `matriz_correlacao.svg`, com as correlações entre todas as variáveis;
- `matriz_correlacao.csv`, para inspeção em uma planilha.

Analise:

1. Há uma relação aproximadamente linear entre a resposta e cada
   preditor?
2. Quais preditores têm maior correlação, em valor absoluto, com a
   resposta escolhida?
3. Há preditores muito correlacionados entre si? Isso pode indicar
   multicolinearidade e tornar a interpretação de uma regressão
   múltipla menos confiável.

Não existe uma variável resposta obrigatória. Escolha a que apresentar
relações mais úteis para a análise e justifique essa escolha com os
gráficos e as correlações observadas.

### Exercício 5 — Regressão linear simples

Escolha uma variável resposta e **um preditor indicado pela exploração**.
Por exemplo, se `quantidade_arquivos` tiver relação linear com
`tempo_real_s`, execute:

```bash
python3 scripts/analisar_regressao.py resultados/experimento.csv --resposta tempo_real_s --preditores quantidade_arquivos
```

Se os gráficos indicarem que `tamanho_total_mb` explica melhor o tempo
de usuário, você pode ajustar outro modelo:

```bash
python3 scripts/analisar_regressao.py resultados/experimento.csv --resposta tempo_usuario_s --preditores tamanho_total_mb
```

O script informa a equação ajustada, `R2`, `R2 ajustado`, `RMSE`, `MAE`
e o coeficiente padronizado. Um `R2 ajustado` pode ser menor que `R2`,
ou até negativo, quando o modelo explica pouco da variação observada.

Em uma regressão simples, interprete o coeficiente como uma associação
nos cenários observados. Ela não isola os efeitos das demais variáveis
do experimento.

### Exercício 6 — Regressão linear múltipla

Escolha a mesma resposta e dois preditores que tenham relação com ela,
mas que não apresentem correlação excessiva entre si. Por exemplo:

```bash
python3 scripts/analisar_regressao.py resultados/experimento.csv --resposta tempo_usuario_s --preditores tamanho_total_mb repetitividade_pct
```

Compare o modelo múltiplo com os modelos simples correspondentes.
Além dos coeficientes na unidade original, a saída mostra coeficientes
padronizados. Eles ajudam a comparar a intensidade da associação entre
preditores com unidades diferentes, mas não representam causalidade.

Responda:

- O `R2 ajustado` melhorou ao adicionar o segundo preditor? A melhora
  parece relevante?
- Os erros do modelo (`RMSE` e `MAE`) são pequenos na escala da resposta
  escolhida?
- Os preditores escolhidos apresentam multicolinearidade preocupante?
- Algum coeficiente teve sinal contrário ao esperado? Como isso pode
  ser explicado?

Um modelo linear é apenas uma aproximação. Ele pode produzir uma
previsão negativa para um tempo; isso não representa um tempo negativo
real, mas uma limitação do modelo para aquela combinação de variáveis.

### Exercício 7 — Relatório final

Escreva um relatório curto respondendo:

1. Qual variável resposta você escolheu e por quê?
2. O que os gráficos de dispersão e as correlações de Pearson mostraram?
3. Qual modelo simples apresentou o melhor ajuste?
4. Qual modelo múltiplo você testou? Os preditores escolhidos tinham
   correlação forte entre si?
5. A inclusão do segundo preditor trouxe uma melhora relevante no
   `R2 ajustado`?
6. Quais limitações e fontes de variabilidade permanecem fora do modelo?

## Como encerrar o laboratório

```bash
exit
docker compose down
```
