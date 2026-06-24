// Kiểm tra render màn KẾT QUẢ bài kiểm tra (tất định, không cần backend).
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await wait(1200); // chờ marked/katex CDN

  await p.evaluate(() => {
    App.state.user = { name: 'Học sinh Demo', role: 'STUDENT', grade: 12 };
    App.state.role = 'STUDENT';
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    App.state.tab = 'learn';
    App.state.learn = {
      view: 'examResult', examId: 'x', examTitle: 'Kiểm tra nhanh: Đạo hàm',
      result: {
        score10: 6.7, correct: 2, gradable: 3, total: 3,
        results: [
          { stem: 'Đạo hàm của $y=x^2$ là?', correct: true, explanation: '$(x^2)\'=2x$.' },
          { stem: 'Số nghiệm của $x^2-1=0$?', correct: false, explanation: '$x=\\pm 1$ nên có 2 nghiệm.' },
          { stem: 'Trình bày ứng dụng đạo hàm.', correct: null, explanation: '' },
        ],
      },
    };
    switchTab('learn');
  });
  await wait(800);
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'exam-result.png') });
  const r = await p.evaluate(() => ({
    pills: document.querySelectorAll('#screen-learn .pill').length,
    katex: !!document.querySelector('#screen-learn .katex'),
    score: (document.querySelector('#screen-learn .days') || {}).textContent,
  }));
  console.log(JSON.stringify(r));
  await b.close();
})();
