// Test danh mục môn + bài giảng (v2 GĐ6-7).
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
    async function step(name, fn) {
      try { const r = await fn(); log.push('✅ ' + name + ': ' + JSON.stringify(r).slice(0, 160)); return r; }
      catch (e) { log.push('❌ ' + name + ': ' + (e && e.message || e)); return null; }
    }
    const login = await step('login', () => Api.call('login', { email: 'hocsinh@demo.com', password: '123456' }));
    if (login) App.state.token = login.token;
    const subs = await step('getSubjects(12)', () => Api.call('getSubjects', { grade: 12 }));
    if (subs && subs.length) {
      const topics = await step('getTopics(TOAN)', () => Api.call('getTopics', { subjectCode: 'TOAN', grade: 12 }));
      if (topics && topics.length) {
        const lessons = await step('getLessons(chương 1 Toán)', () => Api.call('getLessons', { topicId: topics[0].topicId }));
        if (lessons && lessons.length) {
          await step('getLesson (chi tiết)', () => Api.call('getLesson', { lessonId: lessons[0].lessonId }));
          await step('markLearned', () => Api.call('markLearned', { lessonId: lessons[0].lessonId, learned: true }));
          await step('getLearnedLessons', () => Api.call('getLearnedLessons', {}));
        }
      }
    }
    return log;
  });
  out.forEach((l) => console.log(l));
  await b.close();
})();
