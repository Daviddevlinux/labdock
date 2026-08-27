#!/usr/bin/env python3
"""
LabDock — Avaliação de Desempenho de Sistemas (2026.2)
Lab 01 — Variabilidade e Comparação de Desempenho

Implementação de Merge Sort em Python, usada para comparação de
desempenho com a versão em Java (MergeSort.java).

Uso:
    python3 merge_sort.py <arquivo_entrada>
"""
import sys


def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    meio = len(arr) // 2
    esquerda = merge_sort(arr[:meio])
    direita = merge_sort(arr[meio:])
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


def main():
    if len(sys.argv) != 2:
        print("Uso: python3 merge_sort.py <arquivo_entrada>")
        sys.exit(1)

    with open(sys.argv[1]) as f:
        numeros = [int(x) for x in f.read().split()]

    ordenado = merge_sort(numeros)

    if ordenado != sorted(numeros):
        print("ERRO: a saída não está corretamente ordenada!")
        sys.exit(1)

    print(f"[Python] Ordenação concluída: {len(numeros)} elementos.")


if __name__ == "__main__":
    main()
