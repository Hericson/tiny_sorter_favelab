// Web Serial: Arduino Uno (USB), 115200 baud. Chrome/Edge em HTTPS.
(function () {
  'use strict';
  let connection = null;
  let reading = false;
  let writerBusy = Promise.resolve();
  const encoder = new TextEncoder();
  function updateButton() {
    const btn = document.getElementById('connect');
    if (btn) btn.textContent = connection ? 'DESCONECTAR ARDUINO' : 'CONECTAR ARDUINO';
  }
  async function disconnect() {
    if (!connection) return;
    const old = connection;
    connection = null;
    port = null;
    updateButton();
    try { await writerBusy; } catch (_) {}
    // A leitura é encerrada com a desconexão física ou quando o leitor libera o lock.
    try { if (old.readable && old.readable.locked && activeReader) await activeReader.cancel(); } catch (_) {}
    try { await old.close(); } catch (err) { console.warn('Fechar serial:', err); }
  }
  let activeReader = null;
  async function readReplies(device) {
    const decoder = new TextDecoder();
    try {
      while (device === connection && device.readable) {
        const reader = device.readable.getReader();
        activeReader = reader;
        try {
          while (device === connection) {
            const {value, done} = await reader.read();
            if (done) break;
            if (value) console.log('Arduino Uno:', decoder.decode(value, {stream:true}));
          }
        } finally { reader.releaseLock(); activeReader = null; }
      }
    } catch (err) { console.warn('Leitura do Arduino:', err); }
  }
  async function connect() {
    if (!('serial' in navigator)) {
      alert('Use Google Chrome ou Edge no endereço HTTPS do GitHub Pages.');
      return;
    }
    try {
      const selected = await navigator.serial.requestPort();
      await selected.open({baudRate: 115200});
      connection = selected;
      port = {
        send: (data) => {
          writerBusy = writerBusy.catch(() => {}).then(async () => {
            if (!connection || !connection.writable) throw new Error('Arduino desconectado');
            const writer = connection.writable.getWriter();
            try { await writer.write(data instanceof Uint8Array ? data : encoder.encode(String(data))); }
            finally { writer.releaseLock(); }
          });
          return writerBusy;
        }
      };
      updateButton();
      console.log('Arduino Uno conectado. Aguarde 2 segundos para a reinicialização automática.');
      readReplies(selected);
      // O Arduino Uno costuma reiniciar ao abrir a serial; o envio só começa após estabilizar.
      await new Promise(resolve => setTimeout(resolve, 2200));
    } catch (err) {
      console.error('Conexão serial:', err);
      alert('Falha ao conectar ao Arduino: ' + err.message);
    }
  }
  document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'connect') {
      if (connection) disconnect(); else connect();
    }
  });
  document.addEventListener('DOMContentLoaded', updateButton);
})();
