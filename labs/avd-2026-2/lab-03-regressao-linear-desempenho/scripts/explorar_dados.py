#!/usr/bin/env python3
import argparse
import csv
import html
import math
from pathlib import Path


PREDITORES = [
    "tamanho_total_mb",
    "quantidade_arquivos",
    "repetitividade_pct",
]
RESPOSTAS = [
    "tempo_real_s",
    "tempo_usuario_s",
    "tempo_sistema_s",
]
VARIAVEIS_MATRIZ = [
    *PREDITORES,
    *RESPOSTAS,
    "memoria_kb",
    "tamanho_comprimido_bytes",
    "taxa_compressao",
]
ROTULOS = {
    "tamanho_total_mb": "Tamanho total (MB)",
    "quantidade_arquivos": "Quantidade de arquivos",
    "repetitividade_pct": "Repetitividade (%)",
    "tempo_real_s": "Tempo real (s)",
    "tempo_usuario_s": "Tempo de usuario (s)",
    "tempo_sistema_s": "Tempo de sistema (s)",
    "memoria_kb": "Memoria (KB)",
    "tamanho_comprimido_bytes": "Tamanho comprimido (bytes)",
    "taxa_compressao": "Taxa de compressao",
}


def carregar_cenarios_medios(caminho):
    with open(caminho, newline="", encoding="utf-8") as arquivo:
        leitor = csv.DictReader(arquivo)
        obrigatorias = {"cenario", *VARIAVEIS_MATRIZ}
        if not leitor.fieldnames or not obrigatorias.issubset(leitor.fieldnames):
            raise ValueError("O CSV nao possui as colunas necessarias para a exploracao.")

        cenarios = {}
        for linha in leitor:
            try:
                cenario = linha["cenario"].strip()
                valores = {variavel: float(linha[variavel]) for variavel in VARIAVEIS_MATRIZ}
            except (KeyError, TypeError, ValueError) as error:
                raise ValueError("O CSV contem uma linha com valores invalidos.") from error
            if not cenario:
                raise ValueError("O CSV contem uma linha sem identificador de cenario.")
            cenarios.setdefault(cenario, []).append(valores)

    return [
        {
            "cenario": cenario,
            **{
                variavel: sum(linha[variavel] for linha in repeticoes) / len(repeticoes)
                for variavel in VARIAVEIS_MATRIZ
            },
        }
        for cenario, repeticoes in cenarios.items()
    ]


def correlacao_pearson(valores_x, valores_y):
    media_x = sum(valores_x) / len(valores_x)
    media_y = sum(valores_y) / len(valores_y)
    desvios_x = [valor - media_x for valor in valores_x]
    desvios_y = [valor - media_y for valor in valores_y]
    denominador = math.sqrt(sum(valor ** 2 for valor in desvios_x) * sum(valor ** 2 for valor in desvios_y))
    return None if denominador == 0 else sum(x * y for x, y in zip(desvios_x, desvios_y)) / denominador


def calcular_matriz(observacoes):
    valores = {
        variavel: [observacao[variavel] for observacao in observacoes]
        for variavel in VARIAVEIS_MATRIZ
    }
    matriz = [
        [correlacao_pearson(valores[linha], valores[coluna]) for coluna in VARIAVEIS_MATRIZ]
        for linha in VARIAVEIS_MATRIZ
    ]
    return valores, matriz


def salvar_matriz_csv(caminho, matriz):
    with caminho.open("w", newline="", encoding="utf-8") as arquivo:
        escritor = csv.writer(arquivo)
        escritor.writerow(["variavel", *VARIAVEIS_MATRIZ])
        for variavel, linha in zip(VARIAVEIS_MATRIZ, matriz):
            escritor.writerow([variavel, *["" if valor is None else f"{valor:.6f}" for valor in linha]])


def interpolar_cor(cor_inicial, cor_final, proporcao):
    inicio = tuple(int(cor_inicial[posicao:posicao + 2], 16) for posicao in (1, 3, 5))
    fim = tuple(int(cor_final[posicao:posicao + 2], 16) for posicao in (1, 3, 5))
    canais = [round(a + (b - a) * proporcao) for a, b in zip(inicio, fim)]
    return "#" + "".join(f"{canal:02x}" for canal in canais)


def cor_correlacao(valor):
    if valor is None:
        return "#d1d5db"
    if valor >= 0:
        return interpolar_cor("#f7f7f7", "#b2182b", valor)
    return interpolar_cor("#f7f7f7", "#2166ac", abs(valor))


def escrever_svg(caminho, largura, altura, elementos):
    conteudo = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{largura}" height="{altura}" viewBox="0 0 {largura} {altura}">',
        '<rect width="100%" height="100%" fill="white"/>',
        '<style>text { font-family: Arial, sans-serif; fill: #1f2937; }</style>',
        *elementos,
        "</svg>",
    ]
    caminho.write_text("\n".join(conteudo), encoding="utf-8")


def gerar_matriz_svg(caminho, matriz):
    tamanho_celula = 92
    margem_esquerda = 245
    margem_superior = 235
    quantidade = len(VARIAVEIS_MATRIZ)
    largura = margem_esquerda + quantidade * tamanho_celula + 40
    altura = margem_superior + quantidade * tamanho_celula + 70
    elementos = [
        f'<text x="{largura / 2}" y="36" font-size="23" font-weight="bold" text-anchor="middle">Matriz de correlacao de Pearson - dados de compressao</text>',
        '<text x="24" y="68" font-size="13" fill="#2166ac">-1: relacao linear negativa</text>',
        '<text x="330" y="68" font-size="13" fill="#4b5563">0: sem relacao linear</text>',
        '<text x="620" y="68" font-size="13" fill="#b2182b">1: relacao linear positiva</text>',
    ]
    for indice, variavel in enumerate(VARIAVEIS_MATRIZ):
        x = margem_esquerda + indice * tamanho_celula + tamanho_celula / 2
        y = margem_superior - 10
        rotulo = html.escape(ROTULOS[variavel])
        elementos.append(f'<text x="{x}" y="{y}" font-size="12" text-anchor="end" transform="rotate(-45 {x} {y})">{rotulo}</text>')
        elementos.append(f'<text x="{margem_esquerda - 10}" y="{margem_superior + indice * tamanho_celula + 56}" font-size="12" text-anchor="end">{rotulo}</text>')
    for linha, valores_linha in enumerate(matriz):
        for coluna, valor in enumerate(valores_linha):
            x = margem_esquerda + coluna * tamanho_celula
            y = margem_superior + linha * tamanho_celula
            texto = "n/a" if valor is None else f"{valor:.2f}"
            elementos.append(f'<rect x="{x}" y="{y}" width="{tamanho_celula}" height="{tamanho_celula}" fill="{cor_correlacao(valor)}" stroke="white"/>')
            elementos.append(f'<text x="{x + tamanho_celula / 2}" y="{y + tamanho_celula / 2 + 5}" font-size="14" text-anchor="middle">{texto}</text>')
    escrever_svg(caminho, largura, altura, elementos)


def limites(valores):
    minimo = min(valores)
    maximo = max(valores)
    if minimo == maximo:
        return minimo - 1, maximo + 1
    margem = (maximo - minimo) * 0.08
    return minimo - margem, maximo + margem


def posicao(valor, minimo, maximo, inicio, tamanho, inverter=False):
    proporcao = (valor - minimo) / (maximo - minimo)
    if inverter:
        proporcao = 1 - proporcao
    return inicio + proporcao * tamanho


def gerar_dispersoes_svg(caminho, valores, resposta):
    largura = 1500
    altura = 470
    elementos = [
        '<text x="750" y="34" font-size="23" font-weight="bold" text-anchor="middle">Dispersoes para escolha de preditores</text>',
    ]
    valores_y = valores[resposta]
    minimo_y, maximo_y = limites(valores_y)
    for indice, preditor in enumerate(PREDITORES):
        inicio_x = 65 + indice * 485
        inicio_y = 90
        largura_grafico = 360
        altura_grafico = 280
        minimo_x, maximo_x = limites(valores[preditor])
        elementos.extend([
            f'<text x="{inicio_x + largura_grafico / 2}" y="66" font-size="15" font-weight="bold" text-anchor="middle">{html.escape(ROTULOS[resposta])} x {html.escape(ROTULOS[preditor])}</text>',
            f'<line x1="{inicio_x}" y1="{inicio_y + altura_grafico}" x2="{inicio_x + largura_grafico}" y2="{inicio_y + altura_grafico}" stroke="#374151"/>',
            f'<line x1="{inicio_x}" y1="{inicio_y}" x2="{inicio_x}" y2="{inicio_y + altura_grafico}" stroke="#374151"/>',
            f'<text x="{inicio_x + largura_grafico / 2}" y="{inicio_y + altura_grafico + 46}" font-size="13" text-anchor="middle">{html.escape(ROTULOS[preditor])}</text>',
            f'<text x="{inicio_x - 42}" y="{inicio_y + altura_grafico / 2}" font-size="13" text-anchor="middle" transform="rotate(-90 {inicio_x - 42} {inicio_y + altura_grafico / 2})">{html.escape(ROTULOS[resposta])}</text>',
        ])
        for passo in range(5):
            proporcao = passo / 4
            x = inicio_x + proporcao * largura_grafico
            y = inicio_y + (1 - proporcao) * altura_grafico
            valor_x = minimo_x + proporcao * (maximo_x - minimo_x)
            valor_y = minimo_y + proporcao * (maximo_y - minimo_y)
            elementos.extend([
                f'<line x1="{x}" y1="{inicio_y}" x2="{x}" y2="{inicio_y + altura_grafico}" stroke="#e5e7eb"/>',
                f'<line x1="{inicio_x}" y1="{y}" x2="{inicio_x + largura_grafico}" y2="{y}" stroke="#e5e7eb"/>',
                f'<text x="{x}" y="{inicio_y + altura_grafico + 18}" font-size="11" text-anchor="middle">{valor_x:.2g}</text>',
                f'<text x="{inicio_x - 8}" y="{y + 4}" font-size="11" text-anchor="end">{valor_y:.2g}</text>',
            ])
        for valor_x, valor_y in zip(valores[preditor], valores_y):
            x = posicao(valor_x, minimo_x, maximo_x, inicio_x, largura_grafico)
            y = posicao(valor_y, minimo_y, maximo_y, inicio_y, altura_grafico, inverter=True)
            elementos.append(f'<circle cx="{x}" cy="{y}" r="4" fill="#2166ac" fill-opacity="0.8"/>')
    escrever_svg(caminho, largura, altura, elementos)


def formatar_correlacao(valor):
    return "indefinida (sem variacao)" if valor is None else f"{valor:.3f}"


def main():
    parser = argparse.ArgumentParser(
        description="Gera graficos de dispersao e matriz de correlacao de Pearson para o Lab 03."
    )
    parser.add_argument("csv", help="Arquivo experimento.csv gerado pelo laboratorio.")
    parser.add_argument(
        "--resposta",
        required=True,
        choices=RESPOSTAS,
        help="Variavel resposta usada nos graficos de dispersao.",
    )
    parser.add_argument(
        "--saida",
        help="Diretorio para salvar os arquivos de exploracao. O padrao e resultados/exploracao.",
    )
    args = parser.parse_args()

    try:
        observacoes = carregar_cenarios_medios(args.csv)
    except (OSError, ValueError) as error:
        raise SystemExit(f"Erro: {error}") from error
    if len(observacoes) < 3:
        raise SystemExit("Erro: sao necessarios ao menos tres cenarios para calcular correlacoes.")

    valores, matriz = calcular_matriz(observacoes)
    diretorio_saida = Path(args.saida) if args.saida else Path(args.csv).parent / "exploracao"
    diretorio_saida.mkdir(parents=True, exist_ok=True)
    matriz_csv = diretorio_saida / "matriz_correlacao.csv"
    matriz_svg = diretorio_saida / "matriz_correlacao.svg"
    dispersoes_svg = diretorio_saida / f"dispersoes_{args.resposta}.svg"
    salvar_matriz_csv(matriz_csv, matriz)
    gerar_matriz_svg(matriz_svg, matriz)
    gerar_dispersoes_svg(dispersoes_svg, valores, args.resposta)

    indice_resposta = VARIAVEIS_MATRIZ.index(args.resposta)
    print("Exploracao dos dados")
    print(f"Cenarios medios analisados: {len(observacoes)}")
    print(f"Variavel resposta escolhida: {args.resposta}")
    print("")
    print("Correlacao de Pearson entre a resposta e os preditores")
    for indice, preditor in enumerate(PREDITORES):
        print(f"{preditor}: {formatar_correlacao(matriz[indice_resposta][indice])}")
    print("")
    print("Correlacao de Pearson entre os preditores")
    for indice, preditor in enumerate(PREDITORES):
        for outro_indice in range(indice + 1, len(PREDITORES)):
            outro = PREDITORES[outro_indice]
            print(f"{preditor} x {outro}: {formatar_correlacao(matriz[indice][outro_indice])}")
    print("")
    print(f"Matriz CSV: {matriz_csv}")
    print(f"Matriz SVG: {matriz_svg}")
    print(f"Dispersoes SVG: {dispersoes_svg}")


if __name__ == "__main__":
    main()
