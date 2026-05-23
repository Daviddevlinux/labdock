FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    netcat-openbsd \
    tcpdump \
    iproute2 \
    iputils-ping \
    curl \
    vim \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

COPY server.py .

CMD ["python3", "server.py"]