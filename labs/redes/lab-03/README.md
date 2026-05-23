# Redes de Computadores — Lab 03: Roteamento entre Redes

## Objetivo

Compreender na prática como o roteamento conecta redes distintas. O aluno irá configurar rotas estáticas entre dois hosts em sub-redes diferentes, usando um container como roteador, observando como os pacotes trafegam entre as redes.

---

## Topologia

```
[host-a]  192.168.1.2
    |
  rede-a (192.168.1.0/24)
    |
[roteador] 192.168.1.254 <--> 192.168.2.254
    |
  rede-b (192.168.2.0/24)
    |
[host-b]  192.168.2.2
```

---

## Pré-requisitos

- Docker e Docker Compose instalados
- Conhecimento básico de terminal Linux
- Noções de endereçamento IP e sub-redes

---

## Como iniciar o laboratório

Abra um terminal nesta pasta e execute:

```bash
docker compose up -d
```

Abra 3 terminais, um para cada container:

**Terminal 1 — roteador:**
```bash
docker compose exec roteador bash --login
```

**Terminal 2 — host-a:**
```bash
docker compose exec host-a bash --login
```

**Terminal 3 — host-b:**
```bash
docker compose exec host-b bash --login
```

---

## Exercícios

### Exercício 1 — Verificar endereços IP de cada container

Em cada terminal, execute:

```bash
ip addr
```

Confirme os endereços:
- `roteador` → `192.168.1.254` e `192.168.2.254`
- `host-a` → `192.168.1.2`
- `host-b` → `192.168.2.2`

---

### Exercício 2 — Testar conectividade na mesma rede

No **Terminal 2** (host-a), teste o ping para o roteador:

```bash
ping -c 4 192.168.1.254
```

No **Terminal 3** (host-b), teste o ping para o roteador:

```bash
ping -c 4 192.168.2.254
```

Ambos devem funcionar pois estão na mesma sub-rede que o roteador.

---

### Exercício 3 — Testar conectividade entre redes (sem rota)

No **Terminal 2** (host-a), tente pingar o host-b:

```bash
ping -c 4 192.168.2.2
```

Observe que **não funciona** — o host-a não sabe como chegar à rede `192.168.2.0/24`.

---

### Exercício 4 — Configurar rotas estáticas

No **Terminal 2** (host-a), adicione uma rota para a rede-b via roteador:

```bash
ip route add 192.168.2.0/24 via 192.168.1.254
```

No **Terminal 3** (host-b), adicione uma rota para a rede-a via roteador:

```bash
ip route add 192.168.1.0/24 via 192.168.2.254
```

Verifique as rotas configuradas em cada host:

```bash
ip route
```

---

### Exercício 5 — Testar conectividade entre redes (com rota)

No **Terminal 2** (host-a), tente pingar o host-b novamente:

```bash
ping -c 4 192.168.2.2
```

Agora deve funcionar! O pacote sai do host-a, passa pelo roteador e chega ao host-b.

---

### Exercício 6 — Observar o roteamento com tcpdump

No **Terminal 1** (roteador), capture o tráfego em todas as interfaces:

```bash
tcpdump -i any icmp -v
```

No **Terminal 2** (host-a), execute o ping:

```bash
ping -c 4 192.168.2.2
```

Observe no **Terminal 1** os pacotes chegando pela `rede-a` e sendo encaminhados para a `rede-b`.

---

## Como encerrar o laboratório

Em cada terminal dentro dos containers:

```bash
exit
```

No terminal fora dos containers:

```bash
docker compose down
```