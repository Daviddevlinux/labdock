#!/usr/bin/env python3
"""
LabDock — Avaliação de Desempenho de Sistemas (2026.2)
Lab 01 — Variabilidade e Comparação de Desempenho

Gera um arquivo de entrada com números inteiros para os algoritmos
de ordenação. O tamanho e o modo de geração ficam a critério do
estudante — parte do experimento é decidir quais entradas testar.

Uso:
    python3 gerar_entrada.py <tamanho> <arquivo_saida> [modo]

Modos disponíveis:
    aleatorio    (padrão) — números em ordem aleatória
    crescente    — pior caso para alguns algoritmos, melhor para outros
    decrescente  — ordem inversa
"""
import random
import sys


def main():
    if len(sys.argv) < 3:
        print("Uso: python3 gerar_entrada.py <tamanho> <arquivo_saida> [modo]")
        print("  modo: aleatorio (padrão) | crescente | decrescente")
        sys.exit(1)

    tamanho = int(sys.argv[1])
    arquivo_saida = sys.argv[2]
    modo = sys.argv[3] if len(sys.argv) > 3 else "aleatorio"

    if modo == "crescente":
        numeros = list(range(tamanho))
    elif modo == "decrescente":
        numeros = list(range(tamanho, 0, -1))
    elif modo == "aleatorio":
        numeros = [random.randint(0, 1_000_000) for _ in range(tamanho)]
    else:
        print(f"Modo desconhecido: '{modo}'. Use aleatorio, crescente ou decrescente.")
        sys.exit(1)

    with open(arquivo_saida, "w") as f:
        f.write(" ".join(map(str, numeros)))

    print(f"Arquivo '{arquivo_saida}' gerado com {tamanho} números (modo: {modo}).")


if __name__ == "__main__":
    main()
