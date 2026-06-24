// Chẩn đoán luồng giáo viên trên backend thật.
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
    try {
      // Giáo viên
      const t = await Api.call('login', { email: 'giaovien@demo.com', password: '123456' });
      App.state.token = t.token;
      log.push('login GV: ' + t.user.name);

      const td = await Api.call('getTeacherData', {});
      const c = td.classes[0];
      log.push('getTeacherData: ' + td.classes.length + ' lớp; lớp ' + c.name + ' có ' + c.studentCount + ' HS');
      c.students.forEach((s) => log.push('  - ' + s.name + ': ' + s.progress + '%, ' + s.late + ' trễ'));

      // Giao việc cho cả lớp
      const a = await Api.call('assignTask', { classId: c.classId, title: 'TEST đề ôn ' + Date.now(), subject: 'TOAN', dueDate: '2026-06-25' });
      log.push('assignTask cả lớp: giao cho ' + a.assigned + ' HS');

      // Đăng nhập học sinh kiểm tra đã nhận
      const s = await Api.call('login', { email: 'hocsinh@demo.com', password: '123456' });
      App.state.token = s.token;
      const sd = await Api.call('getStudentData', {});
      const assigned = sd.plans.filter((p) => p.assignedBy && p.title.indexOf('TEST đề ôn') === 0);
      log.push('HS An nhận: ' + assigned.length + ' nhiệm vụ TEST (assignedBy=' + (assigned[0] ? assigned[0].assignedBy : 'none') + ')');
      // dọn dẹp
      for (const pl of assigned) await Api.call('deletePlan', { planId: pl.planId });
      log.push('đã dọn ' + assigned.length + ' nhiệm vụ test');

      return { ok: true, log };
    } catch (e) {
      return { ok: false, log, error: String(e && e.message || e) };
    }
  });
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
