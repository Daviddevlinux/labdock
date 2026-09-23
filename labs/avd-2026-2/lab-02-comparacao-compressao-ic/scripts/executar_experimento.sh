#!/bin/bash
set -euo pipefail

DATASETS="${1:-dados}"
REPETICOES="${2:-10}"
RESULTADOS="resultados"
CSV="$RESULTADOS/experimento.csv"
ARQUIVOS="$RESULTADOS/arquivos"

mkdir -p "$RESULTADOS" "$ARQUIVOS"

if [ ! -d "$DATASETS" ]; then
  echo "Diretorio de dados nao encontrado: $DATASETS"
  echo "Execute primeiro: ./scripts/gerar_datasets.sh"
  exit 1
fi

if [ ! -f "$CSV" ]; then
  echo "dataset,metodo,repeticao,tempo_real_s,tempo_usuario_s,tempo_sistema_s,memoria_kb,tamanho_original_bytes,tamanho_comprimido_bytes,taxa_compressao,arquivo_saida" > "$CSV"
fi

medir() {
  local dataset="$1"
  local metodo="$2"
  local repeticao="$3"
  local origem="$DATASETS/$dataset"
  local tmp_time
  local saida
  local tamanho_original
  local tamanho_comprimido
  local taxa
  local parent
  local base
  local saida_abs

  tmp_time="$(mktemp)"
  parent="$(dirname "$origem")"
  base="$(basename "$origem")"
  tamanho_original="$(python3 - <<PY
from pathlib import Path
origem = Path("$origem")
print(sum(arquivo.stat().st_size for arquivo in origem.rglob("*") if arquivo.is_file()))
PY
)"

  case "$metodo" in
    zip)
      saida="$ARQUIVOS/${dataset}_rep${repeticao}.zip"
      saida_abs="$(pwd)/$saida"
      rm -f "$saida_abs"
      /usr/bin/time -f "%e,%U,%S,%M" -o "$tmp_time" \
        bash -c "cd '$parent' && zip -qr '$saida_abs' '$base'"
      ;;
    tar.gz)
      saida="$ARQUIVOS/${dataset}_rep${repeticao}.tar.gz"
      saida_abs="$(pwd)/$saida"
      rm -f "$saida_abs"
      /usr/bin/time -f "%e,%U,%S,%M" -o "$tmp_time" \
        tar -czf "$saida_abs" -C "$parent" "$base"
      ;;
    tar.bz2)
      saida="$ARQUIVOS/${dataset}_rep${repeticao}.tar.bz2"
      saida_abs="$(pwd)/$saida"
      rm -f "$saida_abs"
      /usr/bin/time -f "%e,%U,%S,%M" -o "$tmp_time" \
        tar -cjf "$saida_abs" -C "$parent" "$base"
      ;;
    tar.xz)
      saida="$ARQUIVOS/${dataset}_rep${repeticao}.tar.xz"
      saida_abs="$(pwd)/$saida"
      rm -f "$saida_abs"
      /usr/bin/time -f "%e,%U,%S,%M" -o "$tmp_time" \
        tar -cJf "$saida_abs" -C "$parent" "$base"
      ;;
    *)
      echo "Metodo desconhecido: $metodo"
      rm -f "$tmp_time"
      exit 1
      ;;
  esac

  tamanho_comprimido="$(python3 - <<PY
from pathlib import Path
print(Path("$saida_abs").stat().st_size)
PY
)"
  taxa="$(python3 - <<PY
original = $tamanho_original
comprimido = $tamanho_comprimido
print(f"{comprimido / original:.6f}")
PY
)"

  echo "$dataset,$metodo,$repeticao,$(cat "$tmp_time"),$tamanho_original,$tamanho_comprimido,$taxa,$saida" >> "$CSV"
  rm -f "$tmp_time"
}

for repeticao in $(seq 1 "$REPETICOES"); do
  for caminho in "$DATASETS"/*; do
    [ -d "$caminho" ] || continue
    dataset="$(basename "$caminho")"
    for metodo in zip tar.gz tar.bz2 tar.xz; do
      echo "Executando: dataset=$dataset metodo=$metodo repeticao=$repeticao"
      medir "$dataset" "$metodo" "$repeticao"
    done
  done
done

echo ""
echo "Resultados salvos em: $CSV"
