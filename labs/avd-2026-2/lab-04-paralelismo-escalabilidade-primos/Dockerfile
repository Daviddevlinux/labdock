FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y \
    default-jdk-headless \
    bash \
    nano \
    vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

COPY BenchmarkNumerosPrimos.java .
COPY scripts/ ./scripts/

RUN chmod +x ./scripts/*.sh

CMD ["/bin/bash", "--login"]
