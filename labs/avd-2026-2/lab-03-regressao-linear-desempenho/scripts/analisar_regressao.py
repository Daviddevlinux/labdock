#!/usr/bin/env python3
import argparse
import csv
import math


PREDITORES_VALIDOS = [
    "tamanho_total_mb",
    "quantidade_arquivos",
    "repetitividade_pct",
]

RESPOSTAS_VALIDAS = [
    "tempo_real_s",
    "tempo_usuario_s",
    "tempo_sistema_s",
]


def resolver_sistema(matriz, vetor):
    tamanho = len(vetor)
    aumentada = [linha[:] + [valor] for linha, valor in zip(matriz, vetor)]

    for coluna in range(tamanho):
        pivot = max(range(coluna, tamanho), key=lambda linha: abs(aumentada[linha][coluna]))
        if abs(aumentada[pivot][coluna]) < 1e-12:
            raise ValueError("Os preditores escolhidos nao permitem ajustar um modelo unico.")
        aumentada[coluna], aumentada[pivot] = aumentada[pivot], aumentada[coluna]

        divisor = aumentada[coluna][coluna]
        aumentada[coluna] = [valor / divisor for valor in aumentada[coluna]]

        for linha in range(tamanho):
            if linha == coluna:
                continue
            fator = aumentada[linha][coluna]
            aumentada[linha] = [
                atual - fator * referencia
                for atual, referencia in zip(aumentada[linha], aumentada[coluna])
            ]

    return [linha[-1] for linha in aumentada]


def ajustar_ols(observacoes, resposta, preditores):
    x = [[1.0] + [linha[preditor] for preditor in preditores] for linha in observacoes]
    y = [linha[resposta] for linha in observacoes]
    colunas = len(x[0])

    xtx = [
        [sum(linha[i] * linha[j] for linha in x) for j in range(colunas)]
        for i in range(colunas)
    ]
    xty = [sum(linha[i] * resposta for linha, resposta in zip(x, y)) for i in range(colunas)]
    coeficientes = resolver_sistema(xtx, xty)
    estimados = [sum(valor * coeficiente for valor, coeficiente in zip(linha, coeficientes)) for linha in x]
    residuos = [real - estimado for real, estimado in zip(y, estimados)]
    media_y = sum(y) / len(y)
    soma_total = sum((real - media_y) ** 2 for real in y)
    soma_residuos = sum(residuo ** 2 for residuo in residuos)
    r2 = 1 - soma_residuos / soma_total if soma_total else 1.0
    quantidade_preditores = len(preditores)
    r2_ajustado = 1 - (1 - r2) * (len(y) - 1) / (len(y) - quantidade_preditores - 1)
    rmse = math.sqrt(soma_residuos / len(y))
    mae = sum(abs(residuo) for residuo in residuos) / len(y)
    desvio_y = desvio_padrao(y)
    betas_padronizados = [
        coeficiente * desvio_padrao([linha[preditor] for linha in observacoes]) / desvio_y
        if desvio_y else 0.0
        for coeficiente, preditor in zip(coeficientes[1:], preditores)
    ]
    return coeficientes, r2, r2_ajustado, rmse, mae, betas_padronizados, estimados


def desvio_padrao(valores):
    media = sum(valores) / len(valores)
    return math.sqrt(sum((valor - media) ** 2 for valor in valores) / (len(valores) - 1))


def carregar_observacoes(caminho, resposta, preditores):
    with open(caminho, newline="", encoding="utf-8") as arquivo:
        leitor = csv.DictReader(arquivo)
        obrigatorias = {"cenario", resposta, *preditores}
        if not leitor.fieldnames or not obrigatorias.issubset(leitor.fieldnames):
            raise ValueError("O CSV nao possui as colunas necessarias para esta analise.")

        cenarios = {}
        for linha in leitor:
            try:
                cenario = linha["cenario"].strip()
                valores = {chave: float(linha[chave]) for chave in [resposta, *preditores]}
            except (KeyError, TypeError, ValueError) as error:
                raise ValueError("O CSV contem uma linha com valores invalidos.") from error
            if not cenario:
                raise ValueError("O CSV contem uma linha sem identificador de cenario.")

            if cenario not in cenarios:
                cenarios[cenario] = {
                    "preditores": {preditor: valores[preditor] for preditor in preditores},
                    "respostas": [],
                }
            elif any(
                cenarios[cenario]["preditores"][preditor] != valores[preditor]
                for preditor in preditores
            ):
                raise ValueError("Um mesmo cenario possui valores conflitantes de preditores.")
            cenarios[cenario]["respostas"].append(valores[resposta])

    observacoes = []
    for cenario, valores in cenarios.items():
        respostas = valores["respostas"]
        observacoes.append({
            "cenario": cenario,
            **valores["preditores"],
            resposta: sum(respostas) / len(respostas),
            "repeticoes": len(respostas),
        })
    return observacoes


def imprimir_modelo(coeficientes, resposta, preditores):
    termos = [f"{coeficientes[0]:.6f}"]
    for coeficiente, preditor in zip(coeficientes[1:], preditores):
        sinal = "+" if coeficiente >= 0 else "-"
        termos.append(f"{sinal} {abs(coeficiente):.6f} * {preditor}")
    print(f"{resposta} = " + " ".join(termos))


def main():
    parser = argparse.ArgumentParser(
        description="Ajusta uma regressao linear simples ou multipla para os resultados do Lab 03."
    )
    parser.add_argument("csv", help="Arquivo experimento.csv gerado pelo laboratorio.")
    parser.add_argument(
        "--resposta",
        required=True,
        choices=RESPOSTAS_VALIDAS,
        help="Variavel de resposta que o modelo deve prever.",
    )
    parser.add_argument(
        "--preditores",
        nargs="+",
        required=True,
        choices=PREDITORES_VALIDOS,
        help="Escolha um preditor para regressao simples ou dois para regressao multipla.",
    )
    args = parser.parse_args()

    if len(args.preditores) > 2:
        parser.error("Escolha no maximo dois preditores.")
    if len(set(args.preditores)) != len(args.preditores):
        parser.error("Cada preditor deve ser informado apenas uma vez.")

    try:
        observacoes = carregar_observacoes(args.csv, args.resposta, args.preditores)
        if len(observacoes) < len(args.preditores) + 2:
            raise ValueError("Ha observacoes insuficientes para ajustar este modelo.")
        coeficientes, r2, r2_ajustado, rmse, mae, betas_padronizados, estimados = ajustar_ols(
            observacoes, args.resposta, args.preditores
        )
    except (OSError, ValueError) as error:
        raise SystemExit(f"Erro: {error}") from error

    tipo = "simples" if len(args.preditores) == 1 else "multipla"
    print(f"Regressao linear {tipo}")
    print(f"Cenarios medios analisados: {len(observacoes)}")
    print(f"Variavel resposta: {args.resposta}")
    print(f"Preditores: {', '.join(args.preditores)}")
    print("")
    print("Modelo ajustado")
    imprimir_modelo(coeficientes, args.resposta, args.preditores)
    print("")
    print("Qualidade do ajuste")
    print(f"R2: {r2:.4f}")
    print(f"R2 ajustado: {r2_ajustado:.4f}")
    print(f"RMSE: {rmse:.6f} s")
    print(f"MAE: {mae:.6f} s")
    print("")
    print("Coeficientes padronizados")
    for preditor, beta in zip(args.preditores, betas_padronizados):
        print(f"{preditor}: {beta:.4f}")
    print("")
    print("Primeiras previsoes")
    print(f"cenario,repeticoes,observado_medio_{args.resposta},previsto_{args.resposta},residuo_{args.resposta}")
    for observacao, previsto in list(zip(observacoes, estimados))[:10]:
        observado = observacao[args.resposta]
        print(
            f"{observacao['cenario']},{observacao['repeticoes']},{observado:.6f},"
            f"{previsto:.6f},{observado - previsto:.6f}"
        )

    previsoes_negativas = sum(previsto < 0 for previsto in estimados)
    if previsoes_negativas:
        print("")
        print(
            f"Aviso: o modelo produziu {previsoes_negativas} previsao(oes) negativa(s). "
            "Isso indica uma limitacao da aproximacao linear, nao um tempo negativo real."
        )


if __name__ == "__main__":
    main()
