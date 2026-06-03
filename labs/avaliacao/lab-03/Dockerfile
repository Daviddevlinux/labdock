FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    vim \
    nano \
    htop \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

COPY scripts/ ./scripts/
COPY simulador.py .
COPY rodar_simulacao.sh .

RUN chmod +x ./scripts/*.sh rodar_simulacao.sh

CMD ["/bin/bash", "--login"]