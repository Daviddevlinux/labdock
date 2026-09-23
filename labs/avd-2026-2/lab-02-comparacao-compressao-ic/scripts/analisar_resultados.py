#!/usr/bin/env python3
import argparse
import csv
import math
from collections import defaultdict


T_CRITICO_95 = {
    1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
    6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
    11: 2.201, 12: 2.179, 13: 2.160, 14: 2.145, 15: 2.131,
    16: 2.120, 17: 2.110, 18: 2.101, 19: 2.093, 20: 2.086,
    21: 2.080, 22: 2.074, 23: 2.069, 24: 2.064, 25: 2.060,
    26: 2.056, 27: 2.052, 28: 2.048, 29: 2.045, 30: 2.042,
}


def media(valores):
    return sum(valores) / len(valores)


def desvio_amostral(valores):
    if len(valores) < 2:
        return 0.0
    m = media(valores)
    return math.sqrt(sum((v - m) ** 2 for v in valores) / (len(valores) - 1))


def intervalo_confianca_95(valores):
    n = len(valores)
    m = media(valores)
    if n < 2:
        return m, 0.0, m, m
    s = desvio_amostral(valores)
    t = T_CRITICO_95.get(n - 1, 1.960)
    margem = t * s / math.sqrt(n)
    return m, margem, m - margem, m + margem


def carregar_csv(caminho):
    with open(caminho, newline="", encoding="utf-8") as arquivo:
        return list(csv.DictReader(arquivo))


def resumo_por_metodo(linhas, metrica):
    grupos = defaultdict(list)
    for linha in linhas:
        grupos[(linha["dataset"], linha["metodo"])].append(float(linha[metrica]))

    print("\nResumo por dataset e metodo")
    print("dataset,metodo,n,media,margem_ic95,limite_inferior,limite_superior")
    for (dataset, metodo), valores in sorted(grupos.items()):
        m, margem, baixo, alto = intervalo_confianca_95(valores)
        print(f"{dataset},{metodo},{len(valores)},{m:.6f},{margem:.6f},{baixo:.6f},{alto:.6f}")


def diferencas_pareadas(linhas, metrica, baseline, comparado):
    por_chave = {}
    for linha in linhas:
        chave = (linha["dataset"], linha["repeticao"], linha["metodo"])
        por_chave[chave] = float(linha[metrica])

    grupos = defaultdict(list)
    for dataset, repeticao, metodo in por_chave:
        if metodo != baseline:
            continue
        chave_comparado = (dataset, repeticao, comparado)
        if chave_comparado not in por_chave:
            continue
        diferenca = por_chave[chave_comparado] - por_chave[(dataset, repeticao, baseline)]
        grupos[dataset].append(diferenca)

    print(f"\nDiferencas pareadas: {comparado} - {baseline}")
    print("dataset,n,media_diferenca,margem_ic95,limite_inferior,limite_superior")
    for dataset, valores in sorted(grupos.items()):
        m, margem, baixo, alto = intervalo_confianca_95(valores)
        print(f"{dataset},{len(valores)},{m:.6f},{margem:.6f},{baixo:.6f},{alto:.6f}")


def main():
    parser = argparse.ArgumentParser(description="Analisa resultados do Lab 02 de compressao.")
    parser.add_argument("csv", help="Arquivo CSV gerado pelo experimento")
    parser.add_argument("--metrica", default="tempo_real_s", choices=["tempo_real_s", "tamanho_comprimido_bytes", "taxa_compressao"])
    parser.add_argument("--baseline", default="tar.gz")
    parser.add_argument("--comparado", default="tar.bz2")
    args = parser.parse_args()

    linhas = carregar_csv(args.csv)
    if not linhas:
        raise SystemExit("CSV vazio.")

    print(f"Metrica analisada: {args.metrica}")
    resumo_por_metodo(linhas, args.metrica)
    diferencas_pareadas(linhas, args.metrica, args.baseline, args.comparado)


if __name__ == "__main__":
    main()
