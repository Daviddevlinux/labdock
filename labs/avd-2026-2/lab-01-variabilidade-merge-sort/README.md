# LabDock

## Avaliação de Desempenho de Sistemas (2026.2)

### Lab 01 — Variabilidade e Comparação de Desempenho

**Professora:** Raquel Vigolvino Lopes

## Objetivo

Você vai descobrir, na prática, por que medir o tempo de um programa uma
única vez não basta. Vamos comparar duas versões do mesmo algoritmo de
ordenação, o **Merge Sort**: uma escrita em Python e outra em Java. Ao final,
você terá dados e gráficos para discutir variabilidade, tempo, memória e
escalabilidade.

## Antes de começar: a ideia do experimento

Pense assim: se você cronometrar todo dia o tempo que leva pra ir de casa até
a faculdade, pela mesma rota, você não vai ter o mesmo tempo todo dia. Um dia
tem mais trânsito, outro dia o sinal fecha, outro dia você anda um pouco mais
rápido sem nem perceber. O tempo “real” da viagem varia, mesmo que o trajeto
seja sempre o mesmo.

Com programas de computador é parecido: rodar o mesmo código, sobre os mesmos
dados, duas vezes seguidas, não vai dar exatamente o mesmo tempo. Isso é
normal — e é exatamente isso que você vai comprovar neste laboratório.

Essa diferença pode acontecer porque outros programas usam o computador ao
mesmo tempo, porque o sistema operacional alterna a atenção entre tarefas, ou
porque dados usados recentemente ficam temporariamente mais fáceis de acessar.
No Java, também existe a preparação automática do código para execução pela
máquina virtual, chamada **JIT** (*Just-In-Time*): nas primeiras execuções, ela
pode alterar um pouco os tempos observados.

Para uma comparação justa, faremos várias repetições e depois olharemos para
os resultados como um conjunto, usando medidas como média, mediana e desvio
padrão. Esse planejamento — decidir entradas, repetições e como resumir os
dados antes de concluir algo — é chamado de **planejamento experimental**.

## Pré-requisitos

- Docker e Docker Compose instalados.
- Um terminal aberto na pasta deste laboratório.
- Noções de complexidade de algoritmos ajudam, mas não são obrigatórias.

> **O que é Docker?** Pense nele como uma caixa pronta para o laboratório:
> dentro dela já estão Python, Java e as demais ferramentas necessárias. Você
> usa os comandos abaixo para abrir essa caixa, sem precisar instalar cada
> ferramenta separadamente no seu computador.

## Resumo rápido: comandos e resultado esperado

Execute estes comandos **depois de entrar no container**, como explicado na
próxima seção.

| O que fazer | Comando | O que esperar |
|---|---|---|
| 1. Criar uma lista de números para ordenar | `python3 scripts/gerar_entrada.py 50000 entrada.txt` | `Arquivo 'entrada.txt' gerado com 50000 números (modo: aleatorio).` |
| 2. Rodar o experimento | `./scripts/executar_experimento.sh entrada.txt 50000` | Linhas `Executando python...` e `Executando java...`; no fim, `✔ Experimento concluído!` |
| 3. Ver os resultados | `cat resultados/experimento.csv` | Uma tabela de texto com os tempos e a memória de cada execução |

> **Importante:** depois de gerar a entrada, use o **mesmo número** no
> comando do experimento. Esse número é registrado no CSV; se não bater, sua
> tabela ficará identificada incorretamente.
>
> ```bash
> python3 scripts/gerar_entrada.py 200000 entrada.txt
> ./scripts/executar_experimento.sh entrada.txt 200000
> #                                              ^^^^^^ tem que bater com o número acima
> ```

## Como iniciar o laboratório

1. Abra um terminal nesta pasta.
2. Inicie a caixa do laboratório em segundo plano:

   ```bash
   docker compose up -d
   ```

   Você deverá ver mensagens informando que o serviço foi criado ou iniciado.
   O `-d` significa “em segundo plano”: o container continua rodando enquanto
   você usa o terminal.

3. Entre no ambiente do laboratório:

   ```bash
   docker compose exec avd2026-2-lab-01 bash --login
   ```

   Se deu certo, o começo da linha do terminal muda para algo parecido com
   isto, indicando que você está dentro do container:

   ```text
   root@...:/lab#
   ```

Os comandos dos exercícios a seguir devem ser executados **dentro desse
ambiente**, a menos que seja indicado o contrário.

## Exercícios

### Exercício 1 — Conhecer as duas implementações

Antes de medir, veja o que será comparado:

```bash
cat merge_sort.py
cat MergeSort.java
```

Os dois arquivos implementam o **Merge Sort**, um jeito de ordenar números que
funciona como organizar um baralho: você divide o monte em partes menores até
ficar fácil lidar com elas e depois junta as partes já ordenadas. A parte em
que a função chama a si mesma para resolver pedaços menores é a **recursão**.
A parte que junta dois pedaços ordenados é a **mesclagem** (`merge`).

Ao ler os arquivos, identifique:

- Onde acontece a recursão em cada linguagem.
- Onde acontece a mesclagem (`merge`).
- Onde cada programa verifica a corretude no final — isto é, confirma que o
  resultado realmente ficou em ordem.

Não precisa alterar o código. A ideia é perceber que os dois programas fazem a
mesma tarefa; assim, as diferenças medidas podem ser discutidas em relação às
linguagens e ao ambiente de execução.

### Exercício 2 — Gerar uma entrada e fazer a primeira medição

Primeiro, crie uma lista com 50 mil números:

```bash
python3 scripts/gerar_entrada.py 50000 entrada.txt
```

Saída esperada:

```text
Arquivo 'entrada.txt' gerado com 50000 números (modo: aleatorio).
```

O primeiro número é o tamanho da lista. Por padrão, os números são criados em
ordem aleatória. Se quiser testar uma lista crescente ou decrescente, acrescente
o modo ao final do comando:

```bash
python3 scripts/gerar_entrada.py 50000 entrada.txt decrescente
```

Saída esperada:

```text
Arquivo 'entrada.txt' gerado com 50000 números (modo: decrescente).
```

Agora execute o experimento. Ele roda Python e Java cinco vezes cada e guarda
as medições:

```bash
./scripts/executar_experimento.sh entrada.txt 50000
```

Você verá mensagens parecidas com estas; os valores de tempo não serão iguais
aos do exemplo e podem variar entre execuções:

```text
Compilando MergeSort.java...
Executando python (execução 1/5, tamanho=50000)...
...
Executando java (execução 5/5, tamanho=50000)...

✔ Experimento concluído! Resultados salvos em resultados/experimento.csv
```

Se quiser fazer dez repetições em vez de cinco, passe o terceiro argumento:

```bash
./scripts/executar_experimento.sh entrada.txt 50000 10
```

Abra o arquivo criado:

```bash
cat resultados/experimento.csv
```

Ele terá um cabeçalho e uma linha para cada execução, por exemplo:

```text
linguagem,tamanho_entrada,execucao,tempo_real_s,tempo_usuario_s,tempo_sistema_s,memoria_kb
python,50000,1,0.123,0.110,0.010,12345
java,50000,1,0.087,0.070,0.010,45678
```

Os valores acima são apenas ilustrativos. O arquivo CSV é uma tabela em texto:
cada vírgula separa uma coluna. Ele é acumulativo, então novas execuções são
adicionadas ao final do mesmo arquivo.

#### O que cada tempo significa?

Imagine que você cronometra uma receita:

- **Tempo real** (*wall clock*) é o tempo do relógio na parede: começa quando
  você inicia e termina quando tudo acabou, inclusive esperas. É o tempo que
  você mediria com um cronômetro.
- **Tempo de usuário** é a parte do tempo de CPU usada pelo próprio programa,
  como comparar números e montar listas.
- **Tempo de sistema** é a parte do tempo de CPU usada para pedir ajuda ao
  sistema operacional, por exemplo ao ler o arquivo de entrada.
- **Memória** é o maior espaço de memória ocupado pelo programa durante a
  execução, medido aqui em kilobytes (KB).

Em uma máquina sem outras tarefas pesadas, o tempo real costuma ser próximo da
soma do tempo de usuário com o tempo de sistema. Mas essa relação pode mudar
quando há concorrência por CPU, espera por recursos ou outras atividades no
computador. Esse custo extra de coordenação e espera é chamado de **overhead**.

### Exercício 3 — Observar a variação entre execuções

Use **o mesmo tamanho de entrada** e observe as linhas no CSV de uma mesma
linguagem. Você pode repetir o comando anterior para acrescentar mais dados:

```bash
./scripts/executar_experimento.sh entrada.txt 50000
cat resultados/experimento.csv
```

Compare, por exemplo, todas as linhas que começam com `python,50000` e depois
as que começam com `java,50000`.

- Os tempos são idênticos entre repetições ou variam?
- Calcule manualmente, ou em uma planilha, a média e o desvio padrão de
  `tempo_real_s` para cada linguagem nesse tamanho. A **média** é um valor
  central; o **desvio padrão** mostra o quanto as medições se espalham em torno
  dessa média.
- O desvio padrão ficou pequeno (medições mais consistentes) ou grande
  (medições mais variáveis)? O que isso diz sobre confiar em apenas uma rodada?

### Exercício 4 — Testar diferentes tamanhos de entrada

Repita os exercícios 2 e 3 para **pelo menos três tamanhos diferentes**. Uma
boa sequência para começar é 10 mil, 100 mil e 1 milhão de números:

```bash
python3 scripts/gerar_entrada.py 10000 entrada-10000.txt
./scripts/executar_experimento.sh entrada-10000.txt 10000

python3 scripts/gerar_entrada.py 100000 entrada-100000.txt
./scripts/executar_experimento.sh entrada-100000.txt 100000

python3 scripts/gerar_entrada.py 1000000 entrada-1000000.txt
./scripts/executar_experimento.sh entrada-1000000.txt 1000000
```

> **Importante:** em cada par de comandos, o tamanho informado ao gerar o
> arquivo precisa ser o mesmo tamanho informado ao executar o experimento.

Você também pode testar os modos `aleatorio`, `crescente` e `decrescente` para
investigar se a ordem inicial dos números faz diferença. Como o script acumula
os resultados, o arquivo `resultados/experimento.csv` deverá ter linhas de
Python e Java para todos os tamanhos escolhidos.

> **Atenção:** entradas grandes podem levar alguns segundos. Isso não é erro:
> é parte do que você está observando. Se o computador ficar lento, comece com
> tamanhos menores e aumente aos poucos.

Aqui entra a ideia de **escalabilidade**: observe como o tempo muda quando a
quantidade de números aumenta. É como comparar o tempo de organizar 10 papéis,
100 papéis e mil papéis: se a pilha cresce, o trabalho também cresce, mas nem
sempre na mesma proporção. O Merge Sort tem complexidade teórica
`O(n log n)`, que descreve como o trabalho tende a crescer conforme `n`, o
tamanho da entrada, aumenta.

### Exercício 5 — Criar gráficos no Datawrapper

Copie o conteúdo de `resultados/experimento.csv` — ou baixe esse arquivo — e
importe-o no [Datawrapper](https://www.datawrapper.de/):

1. Acesse o site e clique em **Start creating**.
2. Escolha **Copy & paste data table** e cole o conteúdo do CSV.
3. Clique em **Proceed** até chegar à etapa **Visualize**.
4. Escolha um gráfico adequado para comparar as linguagens. Para tempo médio,
   um gráfico de linhas pode usar o tamanho da entrada no eixo X e o tempo no
   eixo Y, com uma linha para Python e outra para Java.

Produza pelo menos dois gráficos:

- **Tempo de execução versus tamanho da entrada**, comparando Python e Java.
- Um gráfico à sua escolha usando **memória** ou outra métrica relevante.

Se houver mais de uma execução para cada tamanho, calcule a média antes de
montar o gráfico de tempo médio. Assim, uma execução excepcionalmente rápida ou
lenta terá menos peso na sua conclusão.

### Exercício 6 — Relatório final

Com os dados e gráficos em mãos, escreva um relatório curto. Ele pode ficar
neste README, em um documento separado ou no formato informado pela professora.
Responda às cinco perguntas abaixo:

1. **Comparação entre linguagens.** Qual implementação foi mais rápida? Isso
   se manteve para todos os tamanhos testados, ou houve alguma inversão? Se
   houve, a que você atribui essa mudança? *Dica: pense no que acontece antes
   de o algoritmo começar a rodar em cada linguagem, inclusive a preparação
   automática do Java (JIT).*
2. **Variabilidade.** Com base no Exercício 3, uma única execução seria
   suficiente para afirmar qual linguagem é mais rápida? Por quê?
3. **Escalabilidade.** No gráfico de tempo versus tamanho, o crescimento parece
   **linear**? Um crescimento linear desenha aproximadamente uma reta: dobrar
   a entrada tende a dobrar o tempo. O que você observou se aproxima disso ou
   é mais acentuado? Relacione a resposta à complexidade teórica do Merge Sort.
4. **Memória.** O consumo de memória cresce da mesma forma que o tempo? Alguma
   linguagem usa consistentemente mais memória que a outra?
5. **Métrica adicional.** Além de tempo e memória, proponha uma métrica que
   seria interessante medir — por exemplo, energia, operações de leitura e
   escrita (I/O), ou quantidade de comparações. Explique por que ela importa e,
   se possível, como poderia medi-la.

## Como encerrar o laboratório

Quando terminar, saia do container e desligue o ambiente:

```bash
exit
docker compose down
```

Saída esperada após o segundo comando: mensagens informando que o container e
a rede foram removidos. Seus resultados continuam na pasta `resultados/`, mesmo
depois de encerrar o container.
