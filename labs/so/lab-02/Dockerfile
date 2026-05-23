FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    bash \
    vim \
    nano \
    curl \
    coreutils \
    util-linux \
    tree \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m aluno && \
    useradd -m visitante

WORKDIR /lab

COPY scripts/ ./scripts/
COPY README.md .

RUN chmod +x ./scripts/*.sh

CMD ["/bin/bash", "--login"]
