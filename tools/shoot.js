// Chụp screenshot bằng puppeteer-core + Edge có sẵn trên máy.
// Dùng: node tools/shoot.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const fileUrl = (q) => 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/') + q;

const SHOTS = [
  { n: 'login-mobile',    q: '' },
  { n: 'today-mobile',    q: '?role=student&tab=today' },
  { n: 'calendar-mobile', q: '?role=student&tab=calendar' },
  { n: 'goals-mobile',    q: '?role=student&tab=goals' },
  { n: 'exam-mobile',     q: '?role=student&tab=exam' },
  { n: 'notes-mobile',    q: '?role=student&tab=notes' },
  { n: 'profile-mobile',  q: '?role=student&tab=profile' },
  { n: 'teacher-mobile',  q: '?role=teacher&tab=teacher' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=1'],
  });
  for (const s of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(fileUrl(s.q), { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 350));
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    await page.screenshot({ path: path.join(ROOT, 'screenshots', s.n + '.png') });
    const warn = overflow.scrollWidth > overflow.clientWidth ? '  ⚠ TRÀN NGANG' : '';
    console.log(`${s.n}: scrollW=${overflow.scrollWidth} clientW=${overflow.clientWidth}${warn}`);
    await page.close();
  }
  await browser.close();
})();
