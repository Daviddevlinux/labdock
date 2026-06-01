FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    apache2 \
    apache2-utils \
    curl \
    htop \
    bc \
    vim \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

COPY scripts/ ./scripts/
COPY benchmark_web.sh .

RUN chmod +x ./scripts/*.sh benchmark_web.sh

RUN echo "<h1>LabDock - Servidor de Teste</h1>" > /var/www/html/index.html

CMD ["/bin/bash", "--login"]