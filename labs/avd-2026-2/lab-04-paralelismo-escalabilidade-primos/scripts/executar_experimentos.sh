#!/usr/bin/env bash
set -euo pipefail

threads_csv="${1:-1,2,4}"
maximos_csv="${2:-110000,220000,330000}"
repeticoes="${3:-5}"
saida="${4:-resultados/experimento.csv}"

if ! [[ "$repeticoes" =~ ^[1-9][0-9]*$ ]]; then
  echo "Erro: repeticoes deve ser um inteiro positivo." >&2
  exit 2
fi

IFS=',' read -r -a threads_lista <<< "$threads_csv"
IFS=',' read -r -a maximos_lista <<< "$maximos_csv"
for threads in "${threads_lista[@]}"; do
  if ! [[ "$threads" =~ ^[1-9][0-9]*$ ]]; then
    echo "Erro: threads deve conter inteiros positivos separados por virgula." >&2
    exit 2
  fi
done
for maximo in "${maximos_lista[@]}"; do
  if ! [[ "$maximo" =~ ^[0-9]+$ ]] || (( maximo < 2 )); then
    echo "Erro: cada limite de busca deve ser um inteiro >= 2." >&2
    exit 2
  fi
done

mkdir -p "$(dirname "$saida")"
mkdir -p /tmp/labdock-lab04
javac -d /tmp/labdock-lab04 BenchmarkNumerosPrimos.java
printf 'threads,numero_maximo,repeticao,primos_encontrados,tempo_ms,utilizacao_cpu_pct,processadores_disponiveis\n' > "$saida"

for maximo in "${maximos_lista[@]}"; do
  for threads in "${threads_lista[@]}"; do
    if (( threads > maximo )); then
      echo "Erro: threads ($threads) nao pode superar o limite ($maximo)." >&2
      exit 2
    fi
    echo "Aquecendo e medindo: threads=$threads, numero_maximo=$maximo"
    medicoes=$(java -cp /tmp/labdock-lab04 BenchmarkNumerosPrimos "$threads" "$maximo" "$repeticoes")
    while IFS= read -r metricas; do
      printf '%s,%s,%s\n' "$threads" "$maximo" "$metricas" >> "$saida"
    done <<< "$medicoes"
  done
done

echo "Resultados salvos em: $saida"
