# Redes de Computadores — Lab 02: Análise de Tráfego com tcpdump
---

## Objetivo

Capturar e analisar tráfego de rede em tempo real utilizando o tcpdump. O aluno irá gerar diferentes tipos de tráfego (HTTP, DNS, ICMP) e observar como os pacotes trafegam nas camadas do modelo TCP/IP, identificando protocolos, endereços e portas.

---

## Pré-requisitos

- Docker e Docker Compose instalados
- Conhecimento básico de terminal Linux
- Noções dos modelos OSI e TCP/IP

---

## Como iniciar o laboratório

Abra um terminal nesta pasta e execute:

```bash
docker compose up -d
docker compose exec analisador bash --login
```

---

## Exercícios

### Exercício 1 — Listar interfaces de rede

Antes de capturar, verifique quais interfaces estão disponíveis:

```bash
tcpdump -D
```

```bash
ip addr
```

Anote o nome da interface principal (geralmente `eth0`).

---

### Exercício 2 — Capturar tráfego ICMP (ping)

Abra um **Terminal 2** nesta pasta e entre no container:

```bash
docker compose exec analisador bash --login
```

No **Terminal 1**, inicie a captura de pacotes ICMP:

```bash
tcpdump -i eth0 icmp -v
```

No **Terminal 2**, gere tráfego com ping:

```bash
ping -c 4 8.8.8.8
```

Observe no **Terminal 1** os pacotes ICMP Echo Request e Echo Reply sendo capturados. Use `Ctrl+C` para parar a captura.

---

### Exercício 3 — Capturar tráfego DNS

No **Terminal 1**, capture apenas tráfego DNS (porta 53):

```bash
tcpdump -i eth0 port 53 -v
```

No **Terminal 2**, faça uma consulta DNS:

```bash
dig google.com
```

```bash
dig github.com
```

Observe no **Terminal 1** as queries DNS e as respostas com os endereços IP resolvidos.

---

### Exercício 4 — Capturar tráfego HTTP

No **Terminal 1**, capture tráfego na porta 80:

```bash
tcpdump -i eth0 port 80 -v
```

No **Terminal 2**, faça uma requisição HTTP:

```bash
curl -v http://example.com
```

Observe o handshake TCP (SYN, SYN-ACK, ACK) e os dados HTTP trafegando.

---

### Exercício 5 — Filtrar por host

No **Terminal 1**, capture apenas pacotes de um host específico:

```bash
tcpdump -i eth0 host 8.8.8.8 -v
```

No **Terminal 2**, gere tráfego para esse host:

```bash
ping -c 4 8.8.8.8
dig @8.8.8.8 google.com
```

Observe que apenas os pacotes destinados ou originados de `8.8.8.8` aparecem na captura.

---

### Exercício 6 — Salvar captura em arquivo

Capture o tráfego e salve em um arquivo `.pcap` para análise posterior:

```bash
tcpdump -i eth0 -w /lab/captura.pcap -c 20
```

Em outro terminal, gere tráfego variado:

```bash
ping -c 5 8.8.8.8
curl http://example.com
dig google.com
```

Depois leia o arquivo capturado:

```bash
tcpdump -r /lab/captura.pcap -v
```

---

## Como encerrar o laboratório

No terminal dentro do container:

```bash
exit
```

No terminal fora do container:

```bash
docker compose down
```