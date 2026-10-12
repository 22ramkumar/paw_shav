const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function test() {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    '--window-size=1366,900'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  
  function getRaw(url) {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
      }).on('error', reject);
    });
  }

  const listRaw = await getRaw('http://127.0.0.1:9222/json/list');
  const target = JSON.parse(listRaw)[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  const pages = [
    'index.html',
    'home2.html',
    'facilities.html',
    'about.html',
    'pricing.html',
    'services.html',
    'contact.html',
    'blog.html'
  ];
  
  const res = {};
  for (const p of pages) {
    await send('Page.navigate', { url: 'http://localhost:3000/' + p });
    await new Promise(r => setTimeout(r, 1200));
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const h1 = document.querySelector("h1");
        const hr = h1 ? h1.getBoundingClientRect() : null;
        const pEl = document.querySelector("section p");
        const pr = pEl ? pEl.getBoundingClientRect() : null;
        const b = document.querySelector("section .badge-pet, section [class*='badge'], section span.inline-flex, section div.inline-flex");
        const br = b ? b.getBoundingClientRect() : null;
        const s = document.querySelector("section");
        const sr = s ? s.getBoundingClientRect() : null;
        return {
          sectionHeight: sr ? Math.round(sr.height) : 0,
          badgeTop: br ? Math.round(br.top) : null,
          badgeText: b ? b.innerText.trim().slice(0, 25) : null,
          h1Top: hr ? Math.round(hr.top) : null,
          h1Height: hr ? Math.round(hr.height) : null,
          pTop: pr ? Math.round(pr.top) : null,
          pHeight: pr ? Math.round(pr.height) : null
        };
      })()`,
      returnByValue: true
    });
    res[p] = evalRes.result.value;
  }
  console.log(JSON.stringify(res, null, 2));
  ws.close();
  chrome.kill();
}
test();
