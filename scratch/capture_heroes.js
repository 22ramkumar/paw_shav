const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getRaw(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  waitOpen() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function captureHero(client, url, name) {
  await client.send('Page.navigate', { url });
  await sleep(1500);

  const shot = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 1366,
      height: 600,
      scale: 1
    }
  });

  fs.writeFileSync(path.join(__dirname, `hero_${name}.png`), Buffer.from(shot.data, 'base64'));
}

async function main() {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    '--window-size=1366,900'
  ]);

  await sleep(1500);

  try {
    const listRaw = await getRaw('http://127.0.0.1:9222/json/list');
    const targets = JSON.parse(listRaw);
    const target = targets.find(t => t.type === 'page') || targets[0];

    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.waitOpen();
    await client.send('Page.enable');

    const pages = [
      ['index.html', 'index'],
      ['facilities.html', 'facilities'],
      ['pricing.html', 'pricing'],
      ['services.html', 'services'],
      ['about.html', 'about'],
      ['contact.html', 'contact'],
      ['blog.html', 'blog']
    ];

    for (const [page, name] of pages) {
      await captureHero(client, `http://localhost:3000/${page}`, name);
    }

    console.log('Done capturing heroes');
    client.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    chrome.kill();
  }
}

main();
