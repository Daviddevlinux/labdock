#!/bin/bash
set -euo pipefail

DADOS="${1:-dados}"
REPETICOES="${2:-5}"
MANIFESTO="$DADOS/cenarios.csv"
RESULTADOS="resultados"
CSV="$RESULTADOS/experimento.csv"
ARQUIVOS="$RESULTADOS/arquivos"

if [ ! -f "$MANIFESTO" ]; then
  echo "Manifesto nao encontrado: $MANIFESTO"
  echo "Execute primeiro: python3 scripts/gerar_cenarios.py"
  exit 1
fi

if ! [[ "$REPETICOES" =~ ^[1-9][0-9]*$ ]]; then
  echo "A quantidade de repeticoes deve ser um inteiro positivo."
  exit 1
fi

mkdir -p "$RESULTADOS" "$ARQUIVOS"
find "$ARQUIVOS" -mindepth 1 -maxdepth 1 -type f -name '*.tar.gz' -delete
echo "cenario,tamanho_total_mb,quantidade_arquivos,repetitividade_pct,repeticao,tempo_real_s,tempo_usuario_s,tempo_sistema_s,memoria_kb,tamanho_comprimido_bytes,taxa_compressao" > "$CSV"

medir() {
  local cenario="$1"
  local tamanho_mb="$2"
  local quantidade="$3"
  local repetitividade="$4"
  local repeticao="$5"
  local origem="$DADOS/cenarios/$cenario"
  local saida="$ARQUIVOS/${cenario}_rep${repeticao}.tar.gz"
  local tempo
  local inicio_ns
  local fim_ns
  local tempo_real
  local tamanho_original
  local tamanho_comprimido
  local taxa

  tempo="$(mktemp)"
  rm -f "$saida"
  tamanho_original="$(python3 - <<PY
from pathlib import Path
origem = Path("$origem")
print(sum(arquivo.stat().st_size for arquivo in origem.iterdir() if arquivo.is_file()))
PY
)"

  inicio_ns="$(date +%s%N)"
  /usr/bin/time -f "%U,%S,%M" -o "$tempo" \
    tar -czf "$saida" -C "$(dirname "$origem")" "$(basename "$origem")"
  fim_ns="$(date +%s%N)"
  tempo_real="$(python3 - <<PY
inicio = $inicio_ns
fim = $fim_ns
print(f"{(fim - inicio) / 1_000_000_000:.9f}")
PY
)"

  tamanho_comprimido="$(python3 - <<PY
from pathlib import Path
print(Path("$saida").stat().st_size)
PY
)"
  taxa="$(python3 - <<PY
original = $tamanho_original
comprimido = $tamanho_comprimido
print(f"{comprimido / original:.6f}")
PY
)"

  echo "$cenario,$tamanho_mb,$quantidade,$repetitividade,$repeticao,$tempo_real,$(cat "$tempo"),$tamanho_comprimido,$taxa" >> "$CSV"
  rm -f "$tempo"
}

while IFS=, read -r cenario tamanho_mb quantidade repetitividade; do
  repetitividade="${repetitividade//$'\r'/}"
  [ "$cenario" = "cenario" ] && continue
  for repeticao in $(seq 1 "$REPETICOES"); do
    echo "Executando: $cenario | repeticao $repeticao/$REPETICOES"
    medir "$cenario" "$tamanho_mb" "$quantidade" "$repetitividade" "$repeticao"
  done
done < "$MANIFESTO"

echo ""
echo "Resultados salvos em: $CSV"
