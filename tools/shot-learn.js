// Chụp tab Học (nội dung TĨNH — phải tức thì): môn → chủ đề → bài (KaTeX).
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/') + '?role=student&tab=learn';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => !document.getElementById('app-shell').classList.contains('hidden'), { timeout: 20000 });
  // chuyển sang tab học (nội dung tĩnh, tức thì)
  await p.evaluate(() => switchTab('learn'));
  await wait(500);
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'learn-subjects.png') });

  const t0 = Date.now();
  await p.evaluate(() => learnOpenSubject('TOAN', 'Toán'));
  await wait(300);
  await p.evaluate(() => { const c = document.querySelector('#screen-learn .card'); if (c) c.click(); }); // chủ đề đầu
  await wait(300);
  await p.evaluate(() => { const c = document.querySelector('#screen-learn .card'); if (c) c.click(); }); // bài đầu
  await wait(500);
  const ms = Date.now() - t0;
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'learn-lesson.png') });
  const r = await p.evaluate(() => ({ view: App.state.learn.view, katex: !!document.querySelector('#lesson-content .katex'), title: (document.querySelector('#screen-learn h2') || {}).textContent }));
  console.log('điều hướng tới bài: ' + ms + 'ms', JSON.stringify(r));
  await b.close();
})();
