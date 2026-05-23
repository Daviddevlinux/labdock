import socket
from datetime import datetime

HOST = "0.0.0.0"
PORT = 9000

def handle_message(msg):
    msg = msg.strip().lower()
    if msg == "oi":
        return "Olá! Servidor TCP respondendo."
    elif msg == "hora":
        return f"Hora atual no servidor: {datetime.now().strftime('%H:%M:%S')}"
    elif msg == "sair":
        return "SAIR"
    else:
        return f"[ECHO] {msg}"

print(f"[SERVIDOR] Aguardando conexões em {HOST}:{PORT}...", flush=True)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT))
    s.listen()

    while True:
        conn, addr = s.accept()
        print(f"[SERVIDOR] Conexão recebida de {addr}", flush=True)
        with conn:
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                msg = data.decode("utf-8")
                print(f"[SERVIDOR] Recebido: {msg.strip()}", flush=True)
                resposta = handle_message(msg)
                conn.sendall((resposta + "\n").encode("utf-8"))
                if resposta == "SAIR":
                    print(f"[SERVIDOR] Cliente {addr} encerrou a conexão.", flush=True)
                    break