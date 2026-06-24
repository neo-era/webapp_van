const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');
(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  const t0 = Date.now();
  try { await p.waitForFunction(() => !document.getElementById('app-shell').classList.contains('hidden'), { timeout: 20000 }); } catch (e) {}
  const ms = Date.now() - t0;
  const r = await p.evaluate(() => ({
    appVisible: !document.getElementById('app-shell').classList.contains('hidden'),
    name: document.getElementById('header-name').textContent,
  }));
  console.log('Lần đầu (auto-login): ' + ms + 'ms', JSON.stringify(r));

  // Reload → khôi phục từ cache (đã lưu token+user+data)
  await p.reload({ waitUntil: 'domcontentloaded' });
  const t1 = Date.now();
  try { await p.waitForFunction(() => !document.getElementById('app-shell').classList.contains('hidden'), { timeout: 20000 }); } catch (e) {}
  const ms2 = Date.now() - t1;
  const r2 = await p.evaluate(() => ({ appVisible: !document.getElementById('app-shell').classList.contains('hidden'), tasks: (App.data.plans || []).length }));
  console.log('Lần mở lại (cache): ' + ms2 + 'ms', JSON.stringify(r2));
  await b.close();
})();
