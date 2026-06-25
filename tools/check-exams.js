const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');
(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 700));
  const r = await p.evaluate(() => {
    const out = {};
    Object.keys(EXAMS).forEach((k) => {
      out[k] = { n: (EXAMS[k] || []).length, q: (EXAMS[k] || []).reduce((s, e) => s + e.questions.length, 0) };
    });
    return out;
  });
  console.log('Lỗi JS:', errs.length ? errs : 'không có');
  const g8 = ['TOAN8', 'KHTN8', 'ANH8'];
  let totN = 0, totQ = 0;
  Object.keys(r).forEach((k) => { totN += r[k].n; totQ += r[k].q; });
  console.log('LỚP 8 →', g8.map((k) => k + ': ' + (r[k] ? r[k].n : 0)).join(' | '));
  console.log('TỔNG (mọi môn):', totN, 'đề /', totQ, 'câu');
  await b.close();
})();
