#!/bin/bash
set -euo pipefail

SAIDA="${1:-dados}"

mkdir -p "$SAIDA"
find "$SAIDA" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
mkdir -p "$SAIDA"/{texto,csv,codigo,repetitivo,aleatorio}
export SAIDA

python3 - <<'PY'
from pathlib import Path
import random
import string
import os

base = Path(os.environ["SAIDA"])
random.seed(20262)

paragrafos = [
    "avaliacao de desempenho exige repeticao controle experimental e interpretacao estatistica",
    "intervalos de confianca ajudam a quantificar a incerteza das medicoes coletadas",
    "algoritmos de compressao apresentam compromissos entre tempo de execucao e tamanho final",
    "arquivos com alta redundancia costumam comprimir melhor do que dados aleatorios",
]

for i in range(1, 21):
    linhas = []
    for _ in range(1200):
        linhas.append(random.choice(paragrafos))
    (base / "texto" / f"texto_{i:02d}.txt").write_text("\n".join(linhas) + "\n", encoding="utf-8")

for i in range(1, 16):
    linhas = ["execucao,tamanho,tempo_ms,memoria_kb,categoria"]
    for j in range(3500):
        tamanho = random.choice([1000, 5000, 10000, 50000, 100000])
        tempo = tamanho / 1000 + random.gauss(0, 2)
        memoria = 1024 + tamanho // 20 + random.randint(-80, 80)
        categoria = random.choice(["pequeno", "medio", "grande"])
        linhas.append(f"{j},{tamanho},{tempo:.3f},{memoria},{categoria}")
    (base / "csv" / f"medicoes_{i:02d}.csv").write_text("\n".join(linhas) + "\n", encoding="utf-8")

template = """def merge_sort(valores):
    if len(valores) <= 1:
        return valores
    meio = len(valores) // 2
    esquerda = merge_sort(valores[:meio])
    direita = merge_sort(valores[meio:])
    return merge(esquerda, direita)

def merge(esquerda, direita):
    resultado = []
    i = j = 0
    while i < len(esquerda) and j < len(direita):
        if esquerda[i] <= direita[j]:
            resultado.append(esquerda[i])
            i += 1
        else:
            resultado.append(direita[j])
            j += 1
    resultado.extend(esquerda[i:])
    resultado.extend(direita[j:])
    return resultado
"""

for i in range(1, 31):
    codigo = [template]
    for j in range(80):
        codigo.append(f"def experimento_{i}_{j}(entrada):\n    return sum(entrada) + {i * j}\n")
    (base / "codigo" / f"programa_{i:02d}.py").write_text("\n".join(codigo), encoding="utf-8")

for i in range(1, 11):
    bloco = ("LABDOCK-" + str(i) + "-") * 5000
    (base / "repetitivo" / f"repetitivo_{i:02d}.txt").write_text((bloco + "\n") * 120, encoding="utf-8")

for i in range(1, 11):
    conteudo = "".join(random.choice(string.printable) for _ in range(350_000))
    (base / "aleatorio" / f"aleatorio_{i:02d}.txt").write_text(conteudo, encoding="utf-8")
PY

echo "Conjuntos de arquivos gerados em: $SAIDA"
du -sh "$SAIDA"/*
