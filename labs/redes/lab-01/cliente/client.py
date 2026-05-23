import socket

HOST = "servidor"
PORT = 9000

print(f"[CLIENTE] Conectando ao servidor {HOST}:{PORT}...")

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    print("[CLIENTE] Conectado! Digite uma mensagem (tente: oi, hora, sair)\n")

    while True:
        msg = input("Você: ")
        if not msg:
            continue
        s.sendall((msg + "\n").encode("utf-8"))
        resposta = s.recv(1024).decode("utf-8").strip()
        print(f"Servidor: {resposta}")
        if resposta == "SAIR":
            print("[CLIENTE] Conexão encerrada.")
            break