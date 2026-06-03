# Avaliação de Desempenho — Lab 03: Simulação de Filas

## Objetivo

Simular o comportamento de uma fila M/M/1 sob diferentes níveis de carga, coletar métricas de tempo de espera, tamanho da fila e utilização do servidor, e observar como o sistema se comporta quando se aproxima da saturação.

---

## Contexto: Teoria das Filas

A **teoria das filas** é um ramo da matemática aplicada que modela sistemas onde chegadas e atendimentos ocorrem de forma aleatória. É amplamente usada em avaliação de desempenho de sistemas computacionais, redes e servidores.

### O modelo M/M/1

O modelo **M/M/1** é o mais simples e fundamental da teoria das filas:

- **Primeiro M** — chegadas seguem distribuição de Poisson (intervalos aleatórios com média constante)
- **Segundo M** — tempos de serviço seguem distribuição exponencial (aleatórios com média constante)
- **1** — um único servidor atendendo os clientes

### Parâmetros fundamentais

- **λ (lambda)** — taxa de chegada: quantos clientes chegam por segundo em média
- **μ (mu)** — taxa de serviço: quantos clientes o servidor consegue atender por segundo
- **ρ (rho)** — utilização do servidor: `ρ = λ/μ`

### A regra mais importante

Quando `ρ < 1`, o sistema é estável — o servidor consegue dar conta das chegadas. Quando `ρ → 1`, o sistema começa a saturar: a fila cresce indefinidamente e o tempo de espera explode. Este é o comportamento que você vai observar neste laboratório.

---

## Pré-requisitos

- Docker e Docker Compose instalados
- Conhecimento básico de terminal Linux
- Noções de probabilidade e distribuições (desejável)

---

## Como iniciar o laboratório

Abra um terminal nesta pasta e execute:

```bash
docker compose up -d
docker compose exec avd-lab-03 bash --login
```

---

## Exercícios

### Exercício 1 — Explorar o código do simulador

Antes de rodar a simulação, leia o código para entender o que está sendo simulado:

```bash
cat simulador.py
```

Identifique no código:
- O valor de `taxa_servico` — quantos clientes o servidor atende por segundo
- Os 4 cenários simulados e suas taxas de chegada
- O que cada métrica coletada representa

> **Por que simulação?** Em sistemas reais, testar o comportamento próximo à saturação pode derrubar o serviço. A simulação permite estudar esses cenários com segurança, em qualquer escala de tempo.

---

### Exercício 2 — Rodar a simulação

Execute o simulador:

```bash
./rodar_simulacao.sh
```

Os 4 cenários simulados são:

| Cenário | Taxa chegada (λ) | Utilização (ρ) |
|---|---|---|
| Carga Leve | 3 clientes/s | 30% |
| Carga Média | 5 clientes/s | 50% |
| Carga Alta | 7 clientes/s | 70% |
| Carga Crítica | 9 clientes/s | 90% |

O servidor atende **10 clientes/s** em todos os cenários. Observe como as métricas mudam conforme a utilização aumenta.

---

### Exercício 3 — Verificar o CSV gerado

```bash
cat resultados/simulacao_fila.csv
```

O formato é:

```
cenario,taxa_chegada,utilizacao_pct,espera_media_ms,tempo_sistema_ms,tamanho_fila_medio
Carga Leve (ρ=0.3),3,30.0,...
Carga Media (ρ=0.5),5,50.0,...
Carga Alta (ρ=0.7),7,70.0,...
Carga Critica (ρ=0.9),9,90.0,...
```

Copie toda a saída — você vai usar no Exercício 5.

---

### Exercício 4 — Calcular os valores teóricos e comparar

A fila M/M/1 tem fórmulas fechadas que permitem calcular os valores esperados teoricamente. Compare os resultados da simulação com a teoria:

**Fórmulas M/M/1:**

- Utilização: `ρ = λ/μ`
- Tempo médio de espera na fila: `Wq = ρ / (μ - λ)`
- Tempo médio no sistema: `W = 1 / (μ - λ)`
- Tamanho médio da fila: `Lq = ρ² / (1 - ρ)`

Para o cenário de **Carga Alta** (λ=7, μ=10):

```
ρ = 7/10 = 0.7
Wq = 0.7 / (10 - 7) = 0.233s = 233ms
W  = 1 / (10 - 7)   = 0.333s = 333ms
Lq = 0.49 / 0.3     = 1.63 clientes
```

Compare esses valores com o que o simulador gerou. A diferença existe porque a simulação usa números aleatórios — com mais clientes simulados, os valores convergem para a teoria.

---

### Exercício 5 — Visualizar no Datawrapper

**Passo 1** — Acesse [datawrapper.de](https://datawrapper.de) e clique em **"Start creating"**.

**Passo 2** — Clique em **"Copy & paste data table"** e cole o CSV completo.

**Passo 3** — Clique em **Proceed** até chegar em **Visualize**.

**Passo 4** — Escolha **Column Chart**.

**Passo 5** — Na aba **Refine → Select column**, explore cada métrica:
- `espera_media_ms` — tempo médio de espera na fila
- `tempo_sistema_ms` — tempo total no sistema
- `tamanho_fila_medio` — quantos clientes aguardam em média

**O que observar:**
- Como a espera média muda entre ρ=0.3 e ρ=0.9?
- O crescimento é linear ou exponencial?
- O que acontece com o tamanho da fila quando ρ se aproxima de 1?

---

### Exercício 6 — Análise dos resultados

Com base nos gráficos e nos valores teóricos, responda:

1. **A espera média cresce de forma linear com a utilização?** O que isso implica para o projeto de sistemas?
2. **Qual a diferença entre ρ=0.7 e ρ=0.9 em termos de tempo de espera?** O resultado surpreende?
3. **Por que sistemas reais nunca devem operar com ρ próximo de 1?**
4. **Se o servidor fosse duas vezes mais rápido (μ=20)**, qual seria o impacto na espera para o cenário de carga crítica?
5. **Como esse modelo se relaciona com o que você observou no Lab 02** (Apache Bench)?

> **Conclusão:** A teoria das filas mostra que a relação entre utilização e tempo de espera é altamente não-linear. Um sistema com 70% de utilização pode ser razoável, mas com 90% a espera pode ser 3 a 10 vezes maior. Por isso, sistemas em produção geralmente são dimensionados para operar entre 50% e 70% de utilização — deixando margem para picos de carga.

---

## Como encerrar o laboratório

```bash
exit
docker compose down
```

> Os resultados ficam salvos na pasta `resultados/` mesmo após encerrar o container.