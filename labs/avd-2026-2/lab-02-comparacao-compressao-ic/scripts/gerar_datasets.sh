#!/bin/bash
set -euo pipefail

SAIDA="${1:-dados}"
TAMANHO_POR_CONJUNTO="${2:-5M}"

mkdir -p "$SAIDA"
find "$SAIDA" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
mkdir -p "$SAIDA"/{texto,csv,codigo,repetitivo,aleatorio}
export SAIDA
export TAMANHO_POR_CONJUNTO

python3 - <<'PY'
from pathlib import Path
import random
import string
import os
import re

base = Path(os.environ["SAIDA"])
raw_target = os.environ["TAMANHO_POR_CONJUNTO"]
random.seed(20262)

def parse_size(value):
    match = re.fullmatch(r"\s*(\d+(?:\.\d+)?)\s*([kmgt]?)b?\s*", value, re.IGNORECASE)
    if not match:
        raise SystemExit(
            "Tamanho invalido. Use valores como 500K, 1M, 10M ou 1G."
        )
    number = float(match.group(1))
    suffix = match.group(2).lower()
    multipliers = {"": 1, "k": 1024, "m": 1024**2, "g": 1024**3, "t": 1024**4}
    size = int(number * multipliers[suffix])
    if size <= 0:
        raise SystemExit("O tamanho precisa ser maior que zero.")
    return size

target_size = parse_size(raw_target)

paragrafos = [
    "avaliacao de desempenho exige repeticao controle experimental e interpretacao estatistica",
    "intervalos de confianca ajudam a quantificar a incerteza das medicoes coletadas",
    "algoritmos de compressao apresentam compromissos entre tempo de execucao e tamanho final",
    "arquivos com alta redundancia costumam comprimir melhor do que dados aleatorios",
]

def fit_to_size(chunks, target):
    texto = []
    total = 0
    iterator = iter(chunks)
    while total < target:
        try:
            chunk = next(iterator)
        except StopIteration:
            iterator = iter(chunks)
            chunk = next(iterator)
        encoded = chunk.encode("utf-8")
        remaining = target - total
        if len(encoded) > remaining:
            texto.append(encoded[:remaining].decode("utf-8", errors="ignore"))
            break
        texto.append(chunk)
        total += len(encoded)
    return "".join(texto).encode("utf-8")[:target].decode("utf-8", errors="ignore")

def write_dataset_chunks(folder, prefix, extension, chunks, file_count):
    per_file = target_size // file_count
    remainder = target_size % file_count
    for i in range(1, file_count + 1):
        size = per_file + (1 if i <= remainder else 0)
        content = fit_to_size(chunks(), size)
        (base / folder / f"{prefix}_{i:02d}.{extension}").write_text(content, encoding="utf-8")

def texto_chunks():
    while True:
        yield random.choice(paragrafos) + "\n"

def csv_chunks():
    yield "execucao,tamanho,tempo_ms,memoria_kb,categoria\n"
    j = 0
    while True:
        tamanho = random.choice([1000, 5000, 10000, 50000, 100000])
        tempo = tamanho / 1000 + random.gauss(0, 2)
        memoria = 1024 + tamanho // 20 + random.randint(-80, 80)
        categoria = random.choice(["pequeno", "medio", "grande"])
        yield f"{j},{tamanho},{tempo:.3f},{memoria},{categoria}\n"
        j += 1

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

def codigo_chunks():
    yield template
    i = 1
    while True:
        yield f"def experimento_{i}(entrada):\n    return sum(entrada) + {i}\n\n"
        i += 1

def repetitivo_chunks():
    while True:
        yield "LABDOCK-LABDOCK-LABDOCK-LABDOCK-LABDOCK\n"

def aleatorio_chunks():
    alphabet = string.ascii_letters + string.digits + string.punctuation + " \n"
    while True:
        yield "".join(random.choice(alphabet) for _ in range(1024))

write_dataset_chunks("texto", "texto", "txt", texto_chunks, 20)
write_dataset_chunks("csv", "medicoes", "csv", csv_chunks, 15)
write_dataset_chunks("codigo", "programa", "py", codigo_chunks, 30)
write_dataset_chunks("repetitivo", "repetitivo", "txt", repetitivo_chunks, 10)
write_dataset_chunks("aleatorio", "aleatorio", "txt", aleatorio_chunks, 10)
PY

echo "Conjuntos de arquivos gerados em: $SAIDA"
echo "Tamanho aproximado por conjunto: $TAMANHO_POR_CONJUNTO"
du -sh "$SAIDA"/*
