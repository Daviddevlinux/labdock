FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y \
    python3 \
    time \
    bash \
    nano \
    vim \
    gzip \
    tar \
    coreutils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

COPY scripts/ ./scripts/

RUN chmod +x ./scripts/*.sh ./scripts/*.py

CMD ["/bin/bash", "--login"]
