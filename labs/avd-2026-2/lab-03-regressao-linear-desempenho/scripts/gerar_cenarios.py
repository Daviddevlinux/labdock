#!/usr/bin/env python3
import argparse
import csv
import os
import shutil
from pathlib import Path


PATTERN = b"LABDOCK-AVALIACAO-DE-DESEMPENHO\n"


def parse_values(value, label, minimum, maximum):
    try:
        values = [float(item.strip()) for item in value.split(",") if item.strip()]
    except ValueError as error:
        raise argparse.ArgumentTypeError(f"{label} deve conter numeros separados por virgula.") from error

    if not values or any(item < minimum or item > maximum for item in values):
        raise argparse.ArgumentTypeError(
            f"{label} deve conter valores entre {minimum} e {maximum}."
        )
    return values


def parse_integer_values(value, label, minimum, maximum):
    try:
        values = [int(item.strip()) for item in value.split(",") if item.strip()]
    except ValueError as error:
        raise argparse.ArgumentTypeError(
            f"{label} deve conter numeros inteiros separados por virgula."
        ) from error

    if not values or any(item < minimum or item > maximum for item in values):
        raise argparse.ArgumentTypeError(
            f"{label} deve conter valores inteiros entre {minimum} e {maximum}."
        )
    return values


def repeated_bytes(size):
    return (PATTERN * ((size // len(PATTERN)) + 1))[:size]


def write_file(path, size, repetitividade):
    repeated_size = round(size * repetitividade / 100)
    random_size = size - repeated_size
    with path.open("wb") as output:
        output.write(repeated_bytes(repeated_size))
        output.write(os.urandom(random_size))


def main():
    parser = argparse.ArgumentParser(
        description="Gera cenarios controlados para o Lab 03."
    )
    parser.add_argument("--saida", default="dados", help="Diretorio onde os cenarios serao gerados.")
    parser.add_argument(
        "--tamanhos-mb",
        default="1,4,8",
        help="Tamanhos totais dos cenarios em MB, separados por virgula.",
    )
    parser.add_argument(
        "--quantidades-arquivos",
        default="5,50,200",
        help="Quantidades de arquivos por cenario, separadas por virgula.",
    )
    parser.add_argument(
        "--repetitividades",
        default="20,60,95",
        help="Percentuais de conteudo repetitivo, separados por virgula.",
    )
    args = parser.parse_args()

    sizes_mb = parse_values(args.tamanhos_mb, "Tamanhos", 0.1, 1024)
    file_counts = parse_integer_values(args.quantidades_arquivos, "Quantidades", 1, 10000)
    repetitividades = parse_values(args.repetitividades, "Repetitividades", 0, 100)

    output = Path(args.saida)
    output.mkdir(parents=True, exist_ok=True)
    for item in output.iterdir():
        if item.is_dir():
            shutil.rmtree(item)
        else:
            item.unlink()
    scenarios_dir = output / "cenarios"
    scenarios_dir.mkdir()

    manifest = output / "cenarios.csv"
    with manifest.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow([
            "cenario",
            "tamanho_total_mb",
            "quantidade_arquivos",
            "repetitividade_pct",
        ])

        scenario_number = 1
        for size_mb in sizes_mb:
            total_size = int(size_mb * 1024 * 1024)
            for file_count in file_counts:
                for repetitividade in repetitividades:
                    scenario = f"cenario_{scenario_number:02d}"
                    scenario_dir = scenarios_dir / scenario
                    scenario_dir.mkdir()

                    base_size, remainder = divmod(total_size, file_count)
                    for index in range(file_count):
                        file_size = base_size + (1 if index < remainder else 0)
                        write_file(
                            scenario_dir / f"arquivo_{index + 1:04d}.bin",
                            file_size,
                            repetitividade,
                        )

                    writer.writerow([scenario, size_mb, file_count, repetitividade])
                    scenario_number += 1

    print(f"{scenario_number - 1} cenarios gerados em: {output}")
    print(f"Manifesto de cenarios: {manifest}")
    print("Preditores disponiveis: tamanho_total_mb, quantidade_arquivos, repetitividade_pct")


if __name__ == "__main__":
    main()
