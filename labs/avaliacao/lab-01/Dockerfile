FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    stress-ng \
    sysbench \
    htop \
    procps \
    bc \
    vim \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

COPY scripts/ ./scripts/
COPY benchmark.sh .

RUN chmod +x ./scripts/*.sh benchmark.sh

CMD ["/bin/bash", "--login"]