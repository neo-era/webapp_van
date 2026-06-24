// Chụp form đăng ký.
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');
(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 900, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'networkidle0' });
  await p.evaluate(() => toggleAuth('register'));
  await new Promise((r) => setTimeout(r, 600));
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'register-mobile.png') });
  console.log('done');
  await b.close();
})();
