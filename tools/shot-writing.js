// Kiểm tra render màn Luyện Writing (tất định).
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
  await wait(900);
  await p.evaluate(() => {
    App.state.user = { name: 'Học sinh Demo', role: 'STUDENT', grade: 12 };
    App.state.role = 'STUDENT';
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    App.state.tab = 'learn';
    App.state.learn = { view: 'writing', subjectCode: 'IELTS', subjectName: 'Luyện thi IELTS' };
    switchTab('learn');
  });
  await wait(500);
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'writing.png') });
  const r = await p.evaluate(() => ({
    target: (document.querySelector('#screen-learn .page-head p') || {}).textContent,
    hasPrompt: !!document.getElementById('writing-prompt'),
    hasTextarea: !!document.getElementById('writing-essay'),
  }));
  console.log(JSON.stringify(r));
  await b.close();
})();
