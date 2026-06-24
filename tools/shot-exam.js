// Test đề kiểm tra TĨNH: làm bài + tự chấm tại trình duyệt (tức thì).
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
  await p.setViewport({ width: 390, height: 1000, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await wait(900);

  // Mở đề tĩnh (không cần backend)
  await p.evaluate(() => {
    App.state.user = { name: 'Mai Tuệ Văn', role: 'STUDENT', grade: 12 };
    App.state.role = 'STUDENT';
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    App.state.tab = 'learn';
    App.state.learn = { view: 'examTake', subjectCode: 'TOAN', subjectName: 'Toán', examId: 'toan-c1', examTitle: 'Đạo hàm & Khảo sát' };
    switchTab('learn');
  });
  await wait(400);
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'exam-take.png') });

  // Chọn đúng hết theo đáp án trong EXAMS rồi nộp
  const res = await p.evaluate(() => {
    const ex = Exams.get('toan-c1');
    ex.questions.forEach((q) => {
      const r = document.querySelector('input[name="q-' + q.questionId + '"][value="' + q.answer + '"]');
      if (r) r.checked = true;
    });
    learnSubmitExam();
    return { score: App.state.learn.result.score10, correct: App.state.learn.result.correct, view: App.state.learn.view };
  });
  await wait(300);
  await p.screenshot({ path: path.join(ROOT, 'screenshots', 'exam-result.png') });
  console.log('Lỗi JS:', errs.length ? errs : 'không có');
  console.log(JSON.stringify(res));
  await b.close();
})();
