// Test ngân hàng đề: lấy đề → làm → tự chấm.
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'networkidle0' });
  const out = await p.evaluate(async () => {
    const log = [];
    async function step(n, fn) { try { const r = await fn(); log.push('✅ ' + n + ': ' + JSON.stringify(r).slice(0, 140)); return r; } catch (e) { log.push('❌ ' + n + ': ' + (e && e.message || e)); return null; } }
    const login = await step('login', () => Api.call('login', { email: 'hocsinh@demo.com', password: '123456' }));
    if (login) App.state.token = login.token;
    const exams = await step('getExams(TOAN)', () => Api.call('getExams', { subjectCode: 'TOAN', grade: 12 }));
    if (exams && exams.length) {
      const exam = await step('getExam (ẩn đáp án?)', () => Api.call('getExam', { examId: exams[0].examId }));
      if (exam && exam.questions) {
        // trả lời đúng theo seed: q1->1, q2->0, q3->2 (theo thứ tự)
        const correct = ['1', '0', '2'];
        const answers = {};
        exam.questions.forEach((q, i) => { answers[q.questionId] = correct[i]; });
        await step('submitAttempt (đúng hết)', () => Api.call('submitAttempt', { examId: exam.examId, answers: answers }));
        const wrong = {}; exam.questions.forEach((q) => { wrong[q.questionId] = '9'; });
        await step('submitAttempt (sai hết)', () => Api.call('submitAttempt', { examId: exam.examId, answers: wrong }));
        await step('getAttempts', () => Api.call('getAttempts', { examId: exam.examId }));
      }
    }
    return log;
  });
  out.forEach((l) => console.log(l));
  await b.close();
})();
