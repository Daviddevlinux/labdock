FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y \
    python3 \
    default-jdk-headless \
    time \
    bash \
    nano \
    vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /lab

COPY scripts/ ./scripts/
COPY merge_sort.py .
COPY MergeSort.java .

RUN chmod +x ./scripts/*.sh

CMD ["/bin/bash", "--login"]
