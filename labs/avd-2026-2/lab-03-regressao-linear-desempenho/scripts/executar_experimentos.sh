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
  local metricas
  local tempo_real
  local tempo_usuario
  local tempo_sistema
  local memoria
  local tamanho_original
  local tamanho_comprimido
  local taxa

  rm -f "$saida"
  tamanho_original="$(python3 - <<PY
from pathlib import Path
origem = Path("$origem")
print(sum(arquivo.stat().st_size for arquivo in origem.iterdir() if arquivo.is_file()))
PY
)"

  metricas="$(python3 scripts/medir_compressao.py "$origem" "$saida")"
  IFS=, read -r tempo_real tempo_usuario tempo_sistema memoria <<< "$metricas"

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

  echo "$cenario,$tamanho_mb,$quantidade,$repetitividade,$repeticao,$tempo_real,$tempo_usuario,$tempo_sistema,$memoria,$tamanho_comprimido,$taxa" >> "$CSV"
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
