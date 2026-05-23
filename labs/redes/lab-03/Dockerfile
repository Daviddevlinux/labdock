FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    iproute2 \
    iputils-ping \
    tcpdump \
    netcat-openbsd \
    curl \
    vim \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

CMD ["/bin/bash", "--login"]