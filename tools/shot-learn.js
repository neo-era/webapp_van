// Chụp tab Học: danh sách môn + một bài giảng (kiểm tra KaTeX) trên backend thật.
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/') + '?role=student&tab=learn';

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'networkidle0' });
  await p.waitForFunction(() => !document.getElementById('app-shell').classList.contains('hidden'), { timeout: 12000 });
  await new Promise((r) => setTimeout(r, 1500)); // chờ getSubjects

  const ov = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  console.log('subjects: scrollW=' + ov.s + ' clientW=' + ov.c + (ov.s > ov.c ? '  ⚠ TRÀN' : ''));
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'learn-subjects.png') });

  // Mở Toán → chủ đề đầu → bài đầu
  await p.evaluate(() => learnOpenSubject('TOAN', 'Toán'));
  await new Promise((r) => setTimeout(r, 3500));
  const topicId = await p.evaluate(() => {
    const card = document.querySelector('#learn-body .card');
    if (card) card.click();
    return true;
  });
  await new Promise((r) => setTimeout(r, 3500));
  await p.evaluate(() => { const c = document.querySelector('#learn-body .card'); if (c) c.click(); });
  await new Promise((r) => setTimeout(r, 3500));
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'learn-lesson.png') });
  const hasKatex = await p.evaluate(() => !!document.querySelector('#lesson-content .katex'));
  console.log('lesson rendered, KaTeX present:', hasKatex);
  await b.close();
})();
