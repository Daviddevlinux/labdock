#!/usr/bin/env python3
"""
Simulador de Fila M/M/1
LabDock — Avaliação de Desempenho de Sistemas — Lab 03

Uma fila M/M/1 tem:
- M: chegadas com distribuição de Poisson (aleatórias)
- M: tempo de serviço com distribuição exponencial (aleatório)
- 1: um único servidor

Parâmetros:
- lambda (λ): taxa de chegada (clientes por segundo)
- mu (μ): taxa de serviço (clientes por segundo)
- rho (ρ): utilização do servidor = λ/μ
"""

import random
import sys
import os
import csv

def simular_fila(taxa_chegada, taxa_servico, num_clientes, seed=42):
    """
    Simula uma fila M/M/1.
    Retorna métricas: utilização, tempo médio de espera,
    tempo médio no sistema e tamanho médio da fila.
    """
    random.seed(seed)

    tempo_atual = 0.0
    tempo_livre_servidor = 0.0
    tempos_espera = []
    tempos_sistema = []
    tamanhos_fila = []
    fila = []

    for i in range(num_clientes):
        # Intervalo entre chegadas (distribuição exponencial)
        intervalo = random.expovariate(taxa_chegada)
        tempo_atual += intervalo

        # Tamanho da fila no momento da chegada
        tamanhos_fila.append(len(fila))

        # Se servidor livre, atende imediatamente
        if tempo_livre_servidor <= tempo_atual:
            inicio_servico = tempo_atual
        else:
            inicio_servico = tempo_livre_servidor

        tempo_espera = inicio_servico - tempo_atual
        tempos_espera.append(tempo_espera)

        # Tempo de serviço (distribuição exponencial)
        tempo_servico = random.expovariate(taxa_servico)
        tempo_saida = inicio_servico + tempo_servico
        tempo_livre_servidor = tempo_saida

        tempo_no_sistema = tempo_saida - tempo_atual
        tempos_sistema.append(tempo_no_sistema)

        # Atualiza fila
        fila = [c for c in fila if c > tempo_atual]
        fila.append(tempo_saida)

    utilizacao = taxa_chegada / taxa_servico
    espera_media = sum(tempos_espera) / len(tempos_espera)
    sistema_medio = sum(tempos_sistema) / len(tempos_sistema)
    fila_media = sum(tamanhos_fila) / len(tamanhos_fila)

    return {
        "utilizacao": round(utilizacao, 3),
        "espera_media_s": round(espera_media, 4),
        "tempo_sistema_s": round(sistema_medio, 4),
        "tamanho_fila_medio": round(fila_media, 3)
    }


def main():
    taxa_servico = 10.0  # servidor atende 10 clientes/segundo
    num_clientes = 1000
    output_dir = "/lab/resultados"
    os.makedirs(output_dir, exist_ok=True)
    csv_path = os.path.join(output_dir, "simulacao_fila.csv")

    cenarios = [
        ("Carga Leve (ρ=0.3)",   3.0),
        ("Carga Media (ρ=0.5)",  5.0),
        ("Carga Alta (ρ=0.7)",   7.0),
        ("Carga Critica (ρ=0.9)", 9.0),
    ]

    print("")
    print("=" * 50)
    print("  LABDOCK — Simulação de Fila M/M/1")
    print("=" * 50)
    print(f"  Servidor: {taxa_servico} clientes/s")
    print(f"  Clientes simulados por cenário: {num_clientes}")
    print("=" * 50)
    print("")

    resultados = []

    for nome, taxa_chegada in cenarios:
        print(f"→ Simulando: {nome}...")
        metricas = simular_fila(taxa_chegada, taxa_servico, num_clientes)
        metricas["cenario"] = nome
        metricas["taxa_chegada"] = taxa_chegada
        resultados.append(metricas)

        print(f"   ✓ Utilização: {metricas['utilizacao']*100:.0f}%")
        print(f"   ✓ Espera média: {metricas['espera_media_s']*1000:.1f}ms")
        print(f"   ✓ Tempo no sistema: {metricas['tempo_sistema_s']*1000:.1f}ms")
        print(f"   ✓ Tamanho médio da fila: {metricas['tamanho_fila_medio']:.2f} clientes")
        print("")

    # Salvar CSV
    with open(csv_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "cenario", "taxa_chegada", "utilizacao_pct",
            "espera_media_ms", "tempo_sistema_ms", "tamanho_fila_medio"
        ])
        for r in resultados:
            writer.writerow([
                r["cenario"],
                r["taxa_chegada"],
                round(r["utilizacao"] * 100, 1),
                round(r["espera_media_s"] * 1000, 2),
                round(r["tempo_sistema_s"] * 1000, 2),
                r["tamanho_fila_medio"]
            ])

    print("=" * 50)
    print("  ✅ Simulação concluída!")
    print(f"  📁 Resultados salvos em: {csv_path}")
    print("")
    print("  Próximo passo:")
    print("  1. Rode: cat resultados/simulacao_fila.csv")
    print("  2. Cole os dados no Datawrapper")
    print("  3. Visualize espera, fila e utilização")
    print("=" * 50)
    print("")

    # Exibir CSV no terminal
    with open(csv_path) as f:
        print(f.read())


if __name__ == "__main__":
    main()