#!/usr/bin/env python3
import argparse
import os
import sys
import time
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Executa uma compressao tar.gz e coleta metricas do processo filho."
    )
    parser.add_argument("origem", help="Diretorio que sera comprimido.")
    parser.add_argument("saida", help="Arquivo .tar.gz que sera criado.")
    args = parser.parse_args()

    origem = Path(args.origem)
    if not origem.is_dir():
        raise SystemExit(f"Erro: diretorio de origem nao encontrado: {origem}")

    inicio = time.perf_counter_ns()
    pid = os.fork()
    if pid == 0:
        try:
            os.execvp(
                "tar",
                ["tar", "-czf", args.saida, "-C", str(origem.parent), origem.name],
            )
        except OSError as error:
            print(f"Erro ao executar tar: {error}", file=sys.stderr)
            os._exit(127)

    _, status, uso = os.wait4(pid, 0)
    fim = time.perf_counter_ns()
    if not os.WIFEXITED(status) or os.WEXITSTATUS(status) != 0:
        raise SystemExit("Erro: a compressao falhou.")

    print(
        f"{(fim - inicio) / 1_000_000_000:.9f},"
        f"{uso.ru_utime:.9f},{uso.ru_stime:.9f},{uso.ru_maxrss}"
    )


if __name__ == "__main__":
    main()
