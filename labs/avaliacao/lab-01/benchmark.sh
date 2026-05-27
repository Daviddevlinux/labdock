#!/bin/bash

OUTPUT_DIR="/lab/resultados"
CSV="$OUTPUT_DIR/benchmark.csv"

mkdir -p "$OUTPUT_DIR"

echo "cenario,nucleo,duracao_s,eventos_por_seg,latencia_media_ms,uso_cpu_percent" > "$CSV"

echo ""
echo "========================================"
echo "  LABDOCK — Benchmark de CPU e Memória"
echo "========================================"
echo ""

rodar_cenario() {
    local LABEL=$1
    local NUCLEO=$2
    local DURACAO=$3

    echo "→ Rodando: $LABEL ($NUCLEO núcleo(s), ${DURACAO}s)..."

    RESULTADO=$(sysbench cpu \
        --cpu-max-prime=20000 \
        --threads=$NUCLEO \
        --time=$DURACAO \
        run 2>/dev/null)

    EVENTOS=$(echo "$RESULTADO" | grep "events per second" | awk '{print $NF}')
    LATENCIA=$(echo "$RESULTADO" | grep "avg:" | awk '{print $NF}')

    CPU_ANTES=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
    stress-ng --cpu $NUCLEO --timeout ${DURACAO}s > /dev/null 2>&1 &
    STRESS_PID=$!
    sleep 2
    CPU_DURANTE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
    wait $STRESS_PID 2>/dev/null

    echo "$LABEL,$NUCLEO,$DURACAO,$EVENTOS,$LATENCIA,$CPU_DURANTE" >> "$CSV"
    echo "   ✓ eventos/s: $EVENTOS | latência avg: ${LATENCIA}ms | CPU: ${CPU_DURANTE}%"
    echo ""
}

echo "📊 Iniciando coleta de métricas..."
echo ""

rodar_cenario "Carga Leve"   1 10
rodar_cenario "Carga Media"  2 10
rodar_cenario "Carga Alta"   4 10

echo "========================================"
echo "  ✅ Benchmark concluído!"
echo "  📁 Resultados salvos em: $CSV"
echo ""
echo "  Próximo passo:"
echo "  1. Abra o arquivo resultados/benchmark.csv"
echo "  2. Importe no Google Sheets"
echo "  3. Selecione os dados e insira um gráfico"
echo "========================================"
echo ""

cat "$CSV"