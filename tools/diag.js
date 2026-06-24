// Kiểm tra tác động của scope Drive mới tới các action cũ.
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');
// PNG 1x1 base64 (không có tiền tố)
const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'networkidle0' });

  const out = await p.evaluate(async (PNG) => {
    const log = [];
    async function step(name, fn) {
      try { const r = await fn(); log.push('✅ ' + name + ': ' + (typeof r === 'string' ? r : JSON.stringify(r).slice(0, 120))); return r; }
      catch (e) { log.push('❌ ' + name + ': ' + (e && e.message || e)); return null; }
    }
    const login = await step('login', () => Api.call('login', { email: 'hocsinh@demo.com', password: '123456' }));
    if (login) App.state.token = login.token;
    await step('getStudentData', () => Api.call('getStudentData', {}));
    await step('uploadFile (Drive)', () => Api.call('uploadFile', { filename: 'test.png', mimeType: 'image/png', dataBase64: PNG }));
    return log;
  }, PNG);
  out.forEach((l) => console.log(l));
  await b.close();
})();
