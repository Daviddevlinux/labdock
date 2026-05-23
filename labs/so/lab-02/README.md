# SO — Lab 02: Sistema de Arquivos e Permissões

## Objetivo
Explorar a estrutura do sistema de arquivos Linux, entender como as permissões funcionam e como o sistema operacional controla o acesso de usuários a arquivos e diretórios.

## Pré-requisitos
- Docker instalado na máquina
- Docker Compose instalado

## Como iniciar o laboratório

Suba o container:
```bash
docker compose up -d
```

Entre no container:
```bash
docker compose exec so-lab-02 bash --login
```

---

## Exercícios

### Exercício 1 — Explorando a estrutura de diretórios

O Linux organiza tudo em uma árvore de diretórios a partir da raiz `/`. Cada pasta tem um propósito específico no sistema:
- `/etc` — arquivos de configuração do sistema
- `/var` — arquivos variáveis como logs
- `/home` — pastas pessoais dos usuários
- `/tmp` — arquivos temporários

Visualize a estrutura completa com o comando `tree`:
```bash
tree / -L 2
```
> `-L 2` limita a exibição a 2 níveis de profundidade, para não exibir tudo de uma vez.

Navegue entre os diretórios e explore o conteúdo:
```bash
cd /etc
ls -lh
cd /home
ls -lh
```
> O `-lh` no `ls` exibe os arquivos em formato de lista (`-l`) com tamanhos legíveis por humanos (`-h`), como "4.0K" em vez de "4096".

---

### Exercício 2 — Criando arquivos e diretórios

Crie uma estrutura de diretórios para simular um projeto:
```bash
cd /lab
mkdir -p projeto/src projeto/docs projeto/testes
```
> `mkdir -p` cria todos os diretórios de uma vez, inclusive os intermediários.

Crie arquivos dentro das pastas:
```bash
touch projeto/src/main.sh
touch projeto/docs/readme.txt
echo "Meu primeiro arquivo" > projeto/docs/readme.txt
cat projeto/docs/readme.txt
```
> `touch` cria um arquivo vazio. `echo "texto" > arquivo` escreve texto dentro do arquivo. `cat` exibe o conteúdo.

---

### Exercício 3 — Entendendo permissões

No Linux, cada arquivo tem 3 tipos de permissão para 3 grupos diferentes:

- **Tipos:** `r` (leitura), `w` (escrita), `x` (execução)
- **Grupos:** dono do arquivo, grupo, outros usuários

Veja as permissões dos arquivos criados:
```bash
ls -l projeto/src/main.sh
```

A saída será algo como `-rw-r--r--`. Leia assim:
```
- rw- r-- r--
│  │   │   └── outros: só leitura
│  │   └────── grupo: só leitura
│  └────────── dono: leitura e escrita
└───────────── tipo: arquivo comum
```

---

### Exercício 4 — Alterando permissões com chmod

Dê permissão de execução ao arquivo `main.sh`:
```bash
chmod +x projeto/src/main.sh
ls -l projeto/src/main.sh
```
> `+x` adiciona permissão de execução. Observe como a saída mudou de `-rw-r--r--` para `-rwxr-xr-x`.

Agora remova todas as permissões de "outros":
```bash
chmod o-rwx projeto/src/main.sh
ls -l projeto/src/main.sh
```
> `o-rwx` significa: para "outros" (`o`), remover (`-`) leitura, escrita e execução (`rwx`).

---

### Exercício 5 — Verificando uso de disco

Veja quanto espaço está sendo usado no sistema:
```bash
df -h
```
> `df` mostra o uso de disco por partição. `-h` exibe os valores em formato legível (KB, MB, GB).

Veja o tamanho dos diretórios que criou:
```bash
du -sh /lab/projeto/*
```
> `du` mostra o tamanho de diretórios. `-s` exibe o total de cada um e `-h` em formato legível.

---

## Como encerrar o laboratório

Saia do container:
```bash
exit
```

Desligue o container:
```bash
docker compose down
```
