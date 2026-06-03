#!/bin/bash

OUTPUT_DIR="/lab/resultados"
CSV="$OUTPUT_DIR/benchmark_web.csv"

mkdir -p "$OUTPUT_DIR"

echo "cenario,requisicoes,concorrencia,req_por_seg,latencia_media_ms,latencia_p90_ms,latencia_p99_ms" > "$CSV"

echo ""
echo "========================================"
echo "  LABDOCK — Benchmark Web (Apache Bench)"
echo "========================================"
echo ""

# Garantir que o Apache está rodando
service apache2 start > /dev/null 2>&1
sleep 1

rodar_cenario() {
    local LABEL=$1
    local TOTAL=$2
    local CONCORRENCIA=$3

    echo "→ Rodando: $LABEL ($TOTAL requisições, $CONCORRENCIA simultâneas)..."

    RESULTADO=$(ab -n $TOTAL -c $CONCORRENCIA http://localhost/ 2>/dev/null)

    REQ_SEG=$(echo "$RESULTADO" | grep "Requests per second" | awk '{print $4}')
    LAT_MEDIA=$(echo "$RESULTADO" | grep "Time per request" | head -1 | awk '{print $4}')
    LAT_P90=$(echo "$RESULTADO" | grep " 90%" | awk '{print $2}')
    LAT_P99=$(echo "$RESULTADO" | grep " 99%" | awk '{print $2}')

    echo "$LABEL,$TOTAL,$CONCORRENCIA,$REQ_SEG,$LAT_MEDIA,$LAT_P90,$LAT_P99" >> "$CSV"
    echo "   ✓ req/s: $REQ_SEG | latência avg: ${LAT_MEDIA}ms | p90: ${LAT_P90}ms | p99: ${LAT_P99}ms"
    echo ""
}

echo "📊 Iniciando coleta de métricas..."
echo ""

rodar_cenario "Carga Leve"   100  1
rodar_cenario "Carga Media"  100  10
rodar_cenario "Carga Alta"   100  50

echo "========================================"
echo "  ✅ Benchmark concluído!"
echo "  📁 Resultados salvos em: $CSV"
echo ""
echo "  Próximo passo:"
echo "  1. Rode: cat resultados/benchmark_web.csv"
echo "  2. Cole os dados no Datawrapper"
echo "  3. Visualize throughput e latência"
echo "========================================"
echo ""

cat "$CSV"