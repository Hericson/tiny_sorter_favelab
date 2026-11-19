# Tiny Sorter — Arduino Uno + GitHub Pages

Página p5.js adaptada a partir do projeto fornecido, com Web Serial para **Arduino Uno**.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub (ex.: `tiny-sorter`).
2. Envie **o conteúdo desta pasta** para a raiz do repositório (não envie somente o ZIP, nem uma pasta externa envolvendo os arquivos).
3. Vá a **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
4. Abra `https://SEU-USUARIO.github.io/tiny-sorter/` no Chrome ou Edge.
5. Aguarde o deploy e permita o uso da webcam e da porta serial quando solicitado.

## Preparar o Arduino Uno

- Abra `arduino_uno/tiny_sorter_uno.ino` no Arduino IDE e grave na placa.
- SG90: **sinal (laranja) → D9**, **GND (marrom) → GND**, **positivo (vermelho) → 5V** para teste sem carga, conforme montagem que já funcionou no Uno.
- Para uso sob carga, uma fonte externa de 5 V com GND compartilhado pode ser necessária. Nunca ligue o positivo de uma fonte externa diretamente ao pino 5V enquanto o Uno estiver alimentado pela USB.
- Feche o Monitor Serial antes de conectar pela página. A porta é 115200 baud.

## Usar a página

1. Conecte o Arduino Uno ao **mesmo notebook que abre a página**.
2. Clique em `CONECTAR ARDUINO` e selecione a porta USB. Aguarde ~2 segundos pelo reset automático do Uno.
3. O campo de modelo já traz `https://teachablemachine.withgoogle.com/models/EZhpJnnFA/`.
4. Clique em `LOAD MODEL`, autorize a webcam e teste Pedra/Concha/Vazio.
5. A página envia `A\n` para Pedra e `B\n` para Concha (confiança > 90%, intervalo mínimo 2,5 s). Vazio não envia comando.
6. O Uno gira a 45° ou 135°, aguarda 1 segundo, retorna a 90° e envia `ACK:A` ou `ACK:B` (visível no Console do Chrome, F12).

## Observações

- GitHub Pages hospeda apenas os arquivos estáticos. A webcam e o Arduino Uno pertencem a cada notebook, não ao servidor.
- A página requer Chrome/Edge com Web Serial, HTTPS e autorização do usuário.
- Não é necessário incluir bibliotecas ESP32Servo no Uno: o programa usa `<Servo.h>`.
- `index.html` referencia bibliotecas JavaScript externas via CDN; é necessária conexão à Internet.
- Ajuste os ângulos no arquivo `.ino` para corresponder ao mecanismo real.
- A montagem não foi validada em hardware físico nesta execução.
