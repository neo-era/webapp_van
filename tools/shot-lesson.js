// Chụp một bài giảng cụ thể (kiểm tra ví dụ/bảng biến thiên/đồ thị).
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'] });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.setViewport({ width: 390, height: 1400, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await wait(900);
  const info = await p.evaluate(() => {
    App.state.user = { name: 'Mai Tuệ Văn', role: 'STUDENT', grade: 12 };
    App.state.role = 'STUDENT';
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    App.state.tab = 'learn';
    App.state.learn = { view: 'lesson', subjectCode: 'TOAN', subjectName: 'Toán', topicId: 't-toan-c6', topicTitle: 'Chương 6', lessonId: 'l-toan-bayes', lessonTitle: 'Bayes' };
    switchTab('learn');
    return true;
  });
  await wait(700);
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'lesson-bayes.png'), fullPage: true });
  const r = await p.evaluate(() => ({
    katex: document.querySelectorAll('#lesson-content .katex').length,
    hasBBT: !!document.querySelector('#lesson-content table.bbt'),
    hasSVG: !!document.querySelector('#lesson-content svg.graph'),
    hasDetails: !!document.querySelector('#lesson-content details'),
  }));
  console.log('Lỗi JS:', errs.length ? errs : 'không có');
  console.log(JSON.stringify(r));
  await b.close();
})();
