// Chẩn đoán toàn bộ luồng dữ liệu học sinh trên backend thật.
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
      const login = await Api.call('login', { email: 'hocsinh@demo.com', password: '123456' });
      App.state.token = login.token;
      log.push('login: ' + login.user.name + ' (' + login.user.role + ')');

      const data = await Api.call('getStudentData', {});
      log.push('getStudentData: plans=' + data.plans.length + ' goals=' + data.goals.length +
        ' exam=' + (data.exam ? 'có (' + (data.exam.checklist || []).length + ' mục)' : 'null') +
        ' notes=' + data.notes.length);

      const saved = await Api.call('savePlan', { plan: { title: 'TEST nhiệm vụ ' + Date.now(), subject: 'LY', dueDate: '2026-06-24', status: 'TODO' } });
      log.push('savePlan: tạo ' + saved.planId);

      const del = await Api.call('deletePlan', { planId: saved.planId });
      log.push('deletePlan: ' + JSON.stringify(del));

      const g = await Api.call('saveGoal', { goal: { title: 'TEST mục tiêu', subject: 'HOA', progress: 33 } });
      log.push('saveGoal: ' + g.goalId + ' progress=' + g.progress);
      await Api.call('deleteGoal', { goalId: g.goalId });
      log.push('deleteGoal: ok');

      return { ok: true, log: log };
    } catch (e) {
      return { ok: false, log: log, error: String(e && e.message || e) };
    }
  });
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
