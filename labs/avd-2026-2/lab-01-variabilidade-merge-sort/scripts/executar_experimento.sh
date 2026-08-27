#!/bin/bash
# LabDock — Avaliação de Desempenho de Sistemas (2026.2)
# Lab 01 — Variabilidade e Comparação de Desempenho
#
# Executa as versões Python e Java do Merge Sort sobre o mesmo arquivo
# de entrada, repetindo várias vezes, e registra tempo (real, usuário,
# sistema) e memória de cada execução em resultados/experimento.csv.
#
# Uso:
#   ./scripts/executar_experimento.sh <arquivo_entrada> <tamanho_entrada> [repeticoes]
#
# Exemplo:
#   python3 scripts/gerar_entrada.py 50000 entrada.txt
#   ./scripts/executar_experimento.sh entrada.txt 50000 5

set -e

ARQUIVO_ENTRADA=${1:?"Informe o arquivo de entrada (ex: entrada.txt)"}
TAMANHO=${2:?"Informe o tamanho da entrada (usado apenas para registrar no CSV)"}
REPETICOES=${3:-5}

RESULTADOS="resultados/experimento.csv"
mkdir -p resultados

if [ ! -f "$RESULTADOS" ]; then
  echo "linguagem,tamanho_entrada,execucao,tempo_real_s,tempo_usuario_s,tempo_sistema_s,memoria_kb" > "$RESULTADOS"
fi

if [ ! -f MergeSort.class ] || [ MergeSort.java -nt MergeSort.class ]; then
  echo "Compilando MergeSort.java..."
  javac MergeSort.java
fi

medir() {
  local linguagem=$1
  shift
  local comando=("$@")

  for i in $(seq 1 "$REPETICOES"); do
    echo "Executando $linguagem (execução $i/$REPETICOES, tamanho=$TAMANHO)..."

    SAIDA_TIME=$( { /usr/bin/time -v "${comando[@]}" "$ARQUIVO_ENTRADA" > /dev/null; } 2>&1 )

    ELAPSED_RAW=$(echo "$SAIDA_TIME" | grep "Elapsed (wall clock)" | awk -F': ' '{print $2}')
    TEMPO_REAL=$(echo "$ELAPSED_RAW" | awk -F: '{ if (NF==3) printf "%.3f", $1*3600+$2*60+$3; else printf "%.3f", $1*60+$2 }')
    TEMPO_USUARIO=$(echo "$SAIDA_TIME" | grep "User time" | awk '{print $4}')
    TEMPO_SISTEMA=$(echo "$SAIDA_TIME" | grep "System time" | awk '{print $4}')
    MEMORIA=$(echo "$SAIDA_TIME" | grep "Maximum resident set size" | awk '{print $6}')

    echo "$linguagem,$TAMANHO,$i,$TEMPO_REAL,$TEMPO_USUARIO,$TEMPO_SISTEMA,$MEMORIA" >> "$RESULTADOS"
  done
}

medir "python" python3 merge_sort.py
medir "java" java MergeSort

echo ""
echo "✔ Experimento concluído! Resultados salvos em $RESULTADOS"
