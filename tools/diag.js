// Chẩn đoán gọi backend thật từ trình duyệt (CORS / redirect).
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  p.on('console', (m) => console.log('console:', m.text()));
  await p.goto(url, { waitUntil: 'networkidle0' });

  const result = await p.evaluate(async () => {
    try {
      const data = await Api.call('login', { email: 'hocsinh@demo.com', password: '123456' });
      return { ok: true, data: data };
    } catch (e) {
      return { ok: false, error: String(e && e.message || e) };
    }
  });
  console.log('KẾT QUẢ:', JSON.stringify(result, null, 2));
  await b.close();
})();
