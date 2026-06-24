// Đổi tên tài khoản demo trên dữ liệu thật.
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  const out = await p.evaluate(async () => {
    const login = await Api.call('login', { email: 'hocsinh@demo.com', password: '123456' });
    App.state.token = login.token;
    const r = await Api.call('updateProfile', { name: 'Mai Tuệ Văn' });
    return r;
  });
  console.log(JSON.stringify(out));
  await b.close();
})();
