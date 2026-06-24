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
  await new Promise((r) => setTimeout(r, 800));
  const r = await p.evaluate(() => {
    const out = { chapters: Content.topics('TOAN').length, lessonsPerChapter: {}, total: 0 };
    Content.topics('TOAN').forEach((t) => { out.lessonsPerChapter[t.id] = t.lessons.length; out.total += t.lessons.length; });
    // render thử 1 bài có công thức
    const d = document.createElement('div'); document.body.appendChild(d);
    const l = Content.lesson('TOAN', 't-toan-c5', 'l-toan-matphang');
    if (l) renderHtmlContent(l.html, d);
    out.katex = d.querySelectorAll('.katex').length;
    out.sampleTitle = l ? l.title : null;
    return out;
  });
  console.log('Lỗi JS:', errs.length ? errs : 'không có');
  console.log(JSON.stringify(r, null, 2));
  await b.close();
})();
