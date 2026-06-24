// Test luồng đăng nhập (chế độ mock) end-to-end.
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'networkidle0' });

  // Submit form đăng nhập (email/mật khẩu đã điền sẵn trong HTML)
  await p.click('#login-form button[type=submit]');
  await new Promise((r) => setTimeout(r, 4000)); // backend thật ~1.5–2s

  const shellVisible = await p.evaluate(() => !document.getElementById('app-shell').classList.contains('hidden'));
  const name = await p.evaluate(() => document.getElementById('header-name').textContent);
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'after-login.png') });
  console.log('app hiện sau đăng nhập:', shellVisible);
  console.log('tên người dùng:', name);
  console.log('lỗi JS:', errors.length ? errors : 'không có');
  await b.close();
})();
