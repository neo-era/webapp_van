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
    const out = { TOAN: 0, list: [], totalQ: 0 };
    (EXAMS.TOAN || []).forEach((e) => { out.TOAN++; out.list.push(e.title.slice(0, 30) + ' (' + e.questions.length + 'c)'); out.totalQ += e.questions.length; });
    return out;
  });
  console.log('Lỗi JS:', errs.length ? errs : 'không có');
  console.log('Số đề TOAN:', r.TOAN, '| tổng câu:', r.totalQ);
  r.list.forEach((l) => console.log(' -', l));
  await b.close();
})();
