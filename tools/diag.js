// Test nội dung IELTS/TOEIC + đề luyện + tự chấm.
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  const out = await p.evaluate(async () => {
    const log = [];
    async function step(n, fn) { try { const r = await fn(); log.push('✅ ' + n + ': ' + JSON.stringify(r).slice(0, 130)); return r; } catch (e) { log.push('❌ ' + n + ': ' + (e && e.message || e)); return null; } }
    const login = await step('login', () => Api.call('login', { email: 'hocsinh@demo.com', password: '123456' }));
    if (login) App.state.token = login.token;
    const subs = await step('getSubjects (có IELTS/TOEIC?)', () => Api.call('getSubjects', { grade: 12 }));
    await step('getTopics(IELTS)', () => Api.call('getTopics', { subjectCode: 'IELTS', grade: 12 }));
    const exams = await step('getExams(TOEIC)', () => Api.call('getExams', { subjectCode: 'TOEIC', grade: 12 }));
    if (exams && exams.length) {
      const exam = await step('getExam(TOEIC test)', () => Api.call('getExam', { examId: exams[0].examId }));
      if (exam && exam.questions) {
        const ans = {}; exam.questions.forEach((q) => { ans[q.questionId] = q.questionId; }); // sai để test
        await step('submitAttempt', () => Api.call('submitAttempt', { examId: exam.examId, answers: ans }));
      }
    }
    return log;
  });
  out.forEach((l) => console.log(l));
  await b.close();
})();
