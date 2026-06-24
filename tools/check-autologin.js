const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');
(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'networkidle0' });
  try { await p.waitForFunction(() => !document.getElementById('app-shell').classList.contains('hidden'), { timeout: 12000 }); } catch (e) {}
  const r = await p.evaluate(() => ({
    appVisible: !document.getElementById('app-shell').classList.contains('hidden'),
    loginHidden: document.getElementById('screen-login').classList.contains('hidden'),
    name: document.getElementById('header-name').textContent,
  }));
  console.log(JSON.stringify(r));
  await b.close();
})();
