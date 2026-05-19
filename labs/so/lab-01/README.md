# SO — Lab 01: Gerenciamento de Processos

## Objetivo
Explorar o gerenciamento de processos em um sistema Linux, observando como o sistema operacional aloca recursos, cria e encerra processos e monitora CPU e memória em tempo real.

## Pré-requisitos
- Docker instalado na máquina
- Docker Compose instalado

## Como iniciar o laboratório

Suba o container com o comando abaixo. O `-d` significa que ele vai rodar em segundo plano (detached), sem travar o terminal:
```bash
docker compose up -d
```

Agora entre dentro do container para começar os exercícios. É como "entrar" em outra máquina Linux:
```bash
docker compose exec so-lab-01 bash
```

Ao entrar no container, rode o script de boas-vindas:
```bash
bash scripts/setup.sh
```

---

## Exercícios

### Exercício 1 — Listando processos

O comando `ps aux` mostra todos os processos que estão rodando no sistema no momento. Cada linha é um processo diferente. As colunas mais importantes são:
- **PID** — identificador único do processo
- **%CPU** — quanto de processador ele está usando
- **%MEM** — quanto de memória ele está usando
- **COMMAND** — qual programa está rodando

```bash
ps aux
```

Para listar os 10 processos que mais consomem CPU, do maior para o menor:
```bash
ps aux --sort=-%cpu | head -10
```
> `--sort=-%cpu` ordena pela coluna CPU em ordem decrescente. `head -10` pega apenas as 10 primeiras linhas.

---

### Exercício 2 — Monitorando em tempo real

O `htop` é um monitor interativo — ele atualiza as informações automaticamente a cada segundo, como um "gerenciador de tarefas" do Linux:
```bash
htop
```
Observe as colunas **PID**, **CPU%**, **MEM%** e **TIME**. Pressione `q` para sair.

---

### Exercício 3 — Criando processos em paralelo

O comando `sleep 300` cria um processo que simplesmente "dorme" por 300 segundos sem fazer nada. O `&` no final faz ele rodar em segundo plano, liberando o terminal para o próximo comando:
```bash
sleep 300 &
sleep 300 &
sleep 300 &
```

Agora liste os processos para ver os 3 que acabou de criar. O `grep sleep` filtra apenas as linhas que contém a palavra "sleep":
```bash
ps aux | grep sleep
```
> O símbolo `|` (pipe) passa o resultado de um comando para outro. Aqui, passa a lista de processos para o `grep` filtrar.

---

### Exercício 4 — Encerrando processos com sinais

No Linux, para encerrar um processo você envia um "sinal" para ele. Os dois mais comuns são:

- **SIGTERM** — pede educadamente para o processo encerrar. O processo pode terminar o que estava fazendo antes de fechar.
- **SIGKILL** — força o encerramento imediatamente, sem chance de o processo reagir.

Pegue o PID de um dos processos `sleep` que criou no exercício anterior e rode:
```bash
kill -SIGTERM <PID>
```

Depois tente com o SIGKILL em outro PID:
```bash
kill -SIGKILL <PID>
```

> Substitua `<PID>` pelo número que apareceu no `ps aux`. Observe a diferença: com SIGTERM o processo pode ignorar o sinal, com SIGKILL não.

---

### Exercício 5 — Simulando carga no sistema

O `stress-ng` é uma ferramenta que força o processador a trabalhar intensamente, simulando uma situação de alta carga. O `--cpu 2` usa 2 núcleos e `--timeout 30s` para depois de 30 segundos:
```bash
stress-ng --cpu 2 --timeout 30s &
```

Agora abra o htop para ver o impacto em tempo real:
```bash
htop
```
> Observe como o uso de CPU dispara. Compare com como estava antes de rodar o stress-ng.

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
> O `docker compose down` para e remove o container. Tudo que foi feito dentro dele é apagado — o ambiente volta do zero na próxima vez que subir.