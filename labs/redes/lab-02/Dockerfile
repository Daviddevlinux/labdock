FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    tcpdump \
    curl \
    wget \
    iputils-ping \
    iproute2 \
    netcat-openbsd \
    dnsutils \
    vim \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

COPY scripts/ ./scripts/

RUN chmod +x ./scripts/*.sh

CMD ["/bin/bash", "--login"]