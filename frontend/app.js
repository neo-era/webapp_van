/* ============================================================
   App logic — nạp/lưu dữ liệu thật qua Api.call (Apps Script).
   Nếu CONFIG.WEB_APP_URL trống, Api tự dùng MockApi (xem api.js).
   ============================================================ */

const App = {
  state: { user: null, role: null, token: null, calDayOffset: 0, tab: 'learn' },
  data: { plans: [], goals: [], exam: null, notes: [], classes: [] },
};

// TẠM THỜI bỏ qua trang đăng nhập: tự đăng nhập demo khi mở app.
// 'student' | 'teacher' để vào thẳng vai trò đó; đặt '' để KHÔI PHỤC trang đăng nhập.
const DEV_AUTO_LOGIN = 'student';

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function subjectColor(code) { return (SUBJECTS[code] || {}).color || 'var(--text-muted)'; }
function subjectLabel(code) { return (SUBJECTS[code] || {}).label || code; }
function subjectBadge(code) {
  return `<span class="subject-badge" style="background:${subjectColor(code)}">${subjectLabel(code)}</span>`;
}

function showLoading() { $('#loading').classList.remove('hidden'); }
function hideLoading() { $('#loading').classList.add('hidden'); }

let _toastTimer;
function showToast(msg, type = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast ' + type;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}

function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/);
  return (parts[parts.length - 1][0] || '?').toUpperCase();
}
function fmtDay(d) {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const dj = dayjs(d);
  return `${days[dj.day()]}, ${dj.format('DD/MM')}`;
}
// Số ngày còn lại tới mốc (so theo đầu ngày, không tính giờ).
function daysLeft(dateStr) {
  return dayjs(dateStr).startOf('day').diff(dayjs().startOf('day'), 'day');
}
// Đọc file thành base64 (bỏ tiền tố data:...;base64,).
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* ============================================================
   ĐĂNG NHẬP & NẠP DỮ LIỆU
   ============================================================ */
async function doLogin(email, password) {
  if (!email || !password) { showToast('Nhập email và mật khẩu', 'error'); return; }
  showLoading();
  let data;
  try {
    data = await Api.call('login', { email: email, password: password });
  } catch (e) {
    hideLoading(); showToast(e.message || 'Đăng nhập thất bại', 'error'); return;
  }
  hideLoading();
  App.state.token = data.token;
  App.state.user = data.user;
  App.state.role = data.user.role;
  saveSession();
  enterApp();        // hiện app NGAY
  loadRoleData();    // tải dữ liệu chạy nền
}

function saveSession() {
  try {
    localStorage.setItem('thpt_token', App.state.token);
    localStorage.setItem('thpt_user', JSON.stringify(App.state.user));
  } catch (e) {}
}

// Tải dữ liệu theo vai trò (chạy nền, không chặn UI).
async function loadRoleData() {
  App.state.loadingData = true; rerender();
  try {
    if (App.state.role === 'STUDENT') await loadStudentData();
    else if (App.state.role === 'TEACHER') await loadTeacherData();
  } catch (e) {
    showToast('Không tải được dữ liệu: ' + e.message, 'error');
  } finally {
    App.state.loadingData = false; rerender();
  }
}

// Khôi phục phiên TỨC THÌ từ cache (không gọi backend), rồi làm mới nền.
function restoreFromCache(token, userJson) {
  try {
    const u = JSON.parse(userJson);
    if (!u || !u.role) return false;
    App.state.token = token; App.state.user = u; App.state.role = u.role;
    // Prefill dữ liệu từ cache → hiện nội dung NGAY, không chờ backend
    try {
      const cached = JSON.parse(localStorage.getItem('thpt_data') || 'null');
      if (cached) {
        App.data.plans = cached.plans || [];
        App.data.goals = cached.goals || [];
        App.data.exam = cached.exam || null;
        App.data.notes = cached.notes || [];
      }
    } catch (e) {}
    enterApp();
    loadRoleData();    // làm mới ngầm
    return true;
  } catch (e) { return false; }
}

function loginDemo(role) {
  // Dùng mật khẩu của tài khoản demo đã seed (MockApi bỏ qua mật khẩu).
  const u = role === 'teacher' ? MOCK.teacher : MOCK.student;
  return doLogin(u.email, '123456');
}

/* ---------- Đăng ký / chuyển form auth ---------- */
function toggleAuth(mode) {
  const isReg = mode === 'register';
  $('#login-form').classList.toggle('hidden', isReg);
  $('#login-extra').classList.toggle('hidden', isReg);
  $('#register-form').classList.toggle('hidden', !isReg);
  $('.auth-sub').textContent = isReg ? 'Tạo tài khoản mới' : 'Lập kế hoạch học tập THPT';
  if (isReg) { onRegRoleChange(); loadPublicClasses(); }
}
function onRegRoleChange() {
  const isStudent = $('#reg-role').value === 'STUDENT';
  $('#reg-class-field').classList.toggle('hidden', !isStudent);
}
async function loadPublicClasses() {
  try {
    const classes = await Api.call('getPublicClasses', {});
    $('#reg-class').innerHTML = '<option value="">— Chưa chọn —</option>' +
      classes.map((c) => `<option value="${c.classId}">${c.name}</option>`).join('');
  } catch (e) {}
}
async function doRegister() {
  const name = $('#reg-name').value.trim();
  const email = $('#reg-email').value.trim();
  const password = $('#reg-password').value;
  const role = $('#reg-role').value;
  if (!name || !email || !password) { showToast('Vui lòng nhập đủ thông tin', 'error'); return; }
  if (password.length < 6) { showToast('Mật khẩu tối thiểu 6 ký tự', 'error'); return; }
  showLoading();
  try {
    await Api.call('register', {
      name: name, email: email, password: password, role: role,
      grade: role === 'STUDENT' ? 12 : '',
      classId: role === 'STUDENT' ? $('#reg-class').value : '',
    });
    await doLogin(email, password); // tự đăng nhập sau khi tạo
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    hideLoading();
  }
}

/* ---------- Khôi phục phiên từ token đã lưu ---------- */
async function restoreSession() {
  showLoading();
  try {
    const user = await Api.call('whoami', {});
    App.state.user = user;
    App.state.role = user.role;
    if (user.role === 'STUDENT') await loadStudentData();
    else await loadTeacherData();
    enterApp();
  } catch (e) {
    App.state.token = null;
    try { localStorage.removeItem('thpt_token'); } catch (_) {}
  } finally {
    hideLoading();
  }
}

async function loadStudentData() {
  const d = await Api.call('getStudentData', {});
  App.data.plans = d.plans || [];
  App.data.goals = d.goals || [];
  App.data.exam = d.exam || null;
  App.data.notes = d.notes || [];
  if (d.user) { App.state.user = d.user; saveSession(); refreshHeader(); }
  try { localStorage.setItem('thpt_data', JSON.stringify({ plans: App.data.plans, goals: App.data.goals, exam: App.data.exam, notes: App.data.notes })); } catch (e) {}
}

function refreshHeader() {
  const u = App.state.user;
  if (!u) return;
  $('#header-avatar').textContent = initials(u.name);
  $('#header-name').textContent = u.name;
}

async function loadTeacherData() {
  const d = await Api.call('getTeacherData', {});
  App.data.classes = d.classes || [];
}

function enterApp() {
  $('#screen-login').classList.add('hidden');
  $('#app-shell').classList.remove('hidden');

  const u = App.state.user;
  $('#header-avatar').textContent = initials(u.name);
  $('#header-name').textContent = u.name;
  $('#header-role').textContent = u.role === 'TEACHER' ? 'Giáo viên'
    : (u.classId ? 'Học sinh' : 'Học sinh');

  if (u.role === 'TEACHER') {
    $('#bottom-nav').classList.add('hidden');
    $('#bottom-nav-teacher').classList.remove('hidden');
    switchTab('teacher');
  } else {
    $('#bottom-nav').classList.remove('hidden');
    $('#bottom-nav-teacher').classList.add('hidden');
    switchTab('learn');
  }
}

function logout() {
  App.state.user = null;
  App.state.token = null;
  App.data = { plans: [], goals: [], exam: null, notes: [], classes: [] };
  App._activeClass = null;
  App.state.learn = { view: 'subjects' };
  App.data.subjects = null;
  App._tcache = null; App._lcache = null;
  try {
    localStorage.removeItem('thpt_token');
    localStorage.removeItem('thpt_user');
    localStorage.removeItem('thpt_data');
  } catch (e) {}
  $('#app-shell').classList.add('hidden');
  $('#screen-login').classList.remove('hidden');
}

/* ============================================================
   ROUTER TAB
   ============================================================ */
function switchTab(tab) {
  if (!$('#screen-' + tab)) tab = 'learn';
  App.state.tab = tab;
  $$('.screen-tab').forEach((s) => s.classList.add('hidden'));
  $('#screen-' + tab).classList.remove('hidden');
  $$('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.tab === tab));
  window.scrollTo(0, 0);
  rerender();
}

function rerender() {
  const render = {
    learn: renderLearn, calendar: renderCalendar, goals: renderGoals,
    exam: renderExam, notes: renderNotes, profile: renderProfile, teacher: renderTeacher,
    sim: renderSim,
  }[App.state.tab];
  if (render) render();
}

function taskRow(p) {
  const done = p.status === 'DONE';
  return `
    <div class="task ${done ? 'done' : ''}">
      <button class="task-check ${done ? 'done' : ''}" onclick="toggleTask('${p.planId}')">${done ? '✓' : ''}</button>
      <div class="task-body">
        <div class="task-title">${p.title}</div>
        <div class="task-meta">
          ${subjectBadge(p.subject)}
          ${p.assignedBy ? '<span class="badge-assigned">Giáo viên giao</span>' : ''}
        </div>
      </div>
    </div>`;
}

async function toggleTask(planId) {
  const p = App.data.plans.find((x) => x.planId === planId);
  if (!p) return;
  const newStatus = p.status === 'DONE' ? 'TODO' : 'DONE';
  p.status = newStatus; // cập nhật lạc quan
  rerender();
  try {
    await Api.call('savePlan', { plan: { planId: p.planId, title: p.title, subject: p.subject, description: p.description, dueDate: p.dueDate, status: newStatus } });
  } catch (e) {
    p.status = newStatus === 'DONE' ? 'TODO' : 'DONE'; // hoàn tác
    rerender();
    showToast(e.message, 'error');
  }
}

/* ============================================================
   LỊCH
   ============================================================ */
function renderCalendar() {
  const day = dayjs().add(App.state.calDayOffset, 'day');
  const dayStr = day.format('YYYY-MM-DD');
  const items = App.data.plans.filter((p) => p.dueDate === dayStr);

  const list = items.length
    ? items.map((p) => `
      <div class="cal-item">
        <div class="cal-stripe" style="background:${subjectColor(p.subject)}"></div>
        <div class="cal-body">
          <div class="task-title ${p.status === 'DONE' ? 'muted' : ''}">${p.title}</div>
          <div class="task-meta">${subjectBadge(p.subject)}
            ${p.assignedBy ? '<span class="badge-assigned">GV giao</span>' : ''}
            <span class="task-time">${p.status === 'DONE' ? 'Đã xong' : 'Chưa xong'}</span>
          </div>
        </div>
        <button class="task-check ${p.status === 'DONE' ? 'done' : ''}" onclick="toggleTask('${p.planId}')">${p.status === 'DONE' ? '✓' : ''}</button>
        <button class="icon-btn" onclick="removePlan('${p.planId}')" title="Xóa">🗑</button>
      </div>`).join('')
    : `<div class="empty">Không có buổi học nào trong ngày này</div>`;

  $('#screen-calendar').innerHTML = `
    <div class="page-head"><h2>Lịch học</h2><p>Kế hoạch theo ngày</p></div>
    <div class="day-switch">
      <button class="icon-btn" onclick="shiftDay(-1)">‹</button>
      <div style="text-align:center">
        <div class="day-label">${fmtDay(day)}</div>
        <div class="day-sub">${App.state.calDayOffset === 0 ? 'Hôm nay' : (App.state.calDayOffset === 1 ? 'Ngày mai' : (App.state.calDayOffset === -1 ? 'Hôm qua' : ''))}</div>
      </div>
      <button class="icon-btn" onclick="shiftDay(1)">›</button>
    </div>
    <div class="card">${list}</div>
    <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="openPlanModal()">+ Thêm buổi học</button>`;
}
function shiftDay(d) { App.state.calDayOffset += d; renderCalendar(); }

async function removePlan(planId) {
  if (!confirm('Xóa nhiệm vụ này?')) return;
  showLoading();
  try {
    await Api.call('deletePlan', { planId: planId });
    App.data.plans = App.data.plans.filter((p) => p.planId !== planId);
    rerender();
    showToast('Đã xóa', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

/* ============================================================
   MỤC TIÊU
   ============================================================ */
function renderGoals() {
  const cards = App.data.goals.length ? App.data.goals.map((g) => `
    <div class="card goal-card" onclick="openGoalModal('${g.goalId}')">
      <div class="goal-top">
        <div>${subjectBadge(g.subject)} <span class="goal-title">${g.title}</span></div>
        <span class="goal-pct" style="color:${subjectColor(g.subject)}">${g.progress}%</span>
      </div>
      <div class="bar"><i style="width:${g.progress}%;background:${subjectColor(g.subject)}"></i></div>
    </div>`).join('') : `<div class="empty">Chưa có mục tiêu. Thêm mục tiêu đầu tiên nhé!</div>`;

  $('#screen-goals').innerHTML = `
    <div class="page-head"><h2>Mục tiêu</h2><p>Theo dõi tiến độ từng môn</p></div>
    ${cards}
    <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="openGoalModal()">+ Thêm mục tiêu</button>`;
}

/* ============================================================
   ÔN THI
   ============================================================ */
function renderExam() {
  const e = App.data.exam;
  if (!e || !e.examDate) {
    $('#screen-exam').innerHTML = `
      <div class="page-head"><h2>Ôn thi THPTQG</h2><p>Thiết lập kỳ thi của bạn</p></div>
      <div class="card"><div class="empty">Chưa thiết lập kỳ thi.</div></div>
      <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="openExamSetup()">Thiết lập kỳ thi</button>`;
    return;
  }
  const dleft = daysLeft(e.examDate);
  const subj = e.subjects.length ? e.subjects.map(subjectBadge).join(' ') : '<span class="muted">Chưa chọn môn</span>';
  const checklist = (e.checklist || []).length ? e.checklist.map((c, i) => `
    <div class="task">
      <button class="task-check ${c.done ? 'done' : ''}" onclick="toggleCheck(${i})">${c.done ? '✓' : ''}</button>
      <div class="task-body">
        <div class="task-title ${c.done ? 'muted' : ''}">${c.text}</div>
        <div class="task-meta">${subjectBadge(c.subject)}</div>
      </div>
      <button class="icon-btn" onclick="removeCheck(${i})" title="Xóa">🗑</button>
    </div>`).join('') : `<div class="empty">Chưa có nội dung ôn nào</div>`;

  $('#screen-exam').innerHTML = `
    <div class="page-head"><h2>Ôn thi THPTQG</h2><p>Lộ trình & nội dung ôn tập</p></div>
    <div class="countdown section-block">
      <div class="days">${dleft}</div>
      <div class="label">ngày nữa đến kỳ thi · ${dayjs(e.examDate).format('DD/MM/YYYY')}</div>
      <div class="cheer">Bạn làm được! Giữ vững nhịp ôn tập nhé 🌟</div>
    </div>
    <div class="section-block">
      <div class="section-title">Tổ hợp môn thi <span class="link" onclick="openExamSetup()">Sửa</span></div>
      <div class="card">${subj}</div>
    </div>
    <div class="section-block">
      <div class="section-title">Checklist nội dung ôn <span class="link" onclick="openCheckModal()">+ Thêm</span></div>
      <div class="card">${checklist}</div>
    </div>`;
}

async function saveExam() {
  const e = App.data.exam || { examDate: '', subjects: [], checklist: [] };
  await Api.call('saveExamPlan', { examDate: e.examDate, subjects: e.subjects, checklist: e.checklist });
}
async function toggleCheck(i) {
  App.data.exam.checklist[i].done = !App.data.exam.checklist[i].done;
  renderExam();
  try { await saveExam(); } catch (err) { showToast(err.message, 'error'); }
}
async function removeCheck(i) {
  App.data.exam.checklist.splice(i, 1);
  renderExam();
  try { await saveExam(); } catch (err) { showToast(err.message, 'error'); }
}

/* ============================================================
   GHI CHÚ
   ============================================================ */
function renderNotes() {
  $('#screen-notes').innerHTML = `
    <div class="page-head"><h2>Ghi chú</h2><p>Lưu lại kiến thức quan trọng</p></div>
    <label class="field" style="margin-bottom:14px">
      <input type="search" placeholder="🔍 Tìm ghi chú…" oninput="filterNotes(this.value)" />
    </label>
    <div id="notes-list">${notesHtml(App.data.notes)}</div>
    <button class="btn btn-primary btn-block" style="margin-top:8px" onclick="openNoteModal()">+ Thêm ghi chú</button>`;
}
function notesHtml(list) {
  if (!list.length) return `<div class="empty">Chưa có ghi chú nào</div>`;
  return list.map((n) => `
    <div class="card" style="margin-bottom:12px" onclick="openNoteModal('${n.noteId}')">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div>${subjectBadge(n.subject)} <strong>${n.title}</strong></div>
        <span class="task-time">${n.updatedAt ? dayjs(n.updatedAt).format('DD/MM') : ''}</span>
      </div>
      <div class="muted" style="font-size:0.9rem">${n.content || ''}</div>
      ${n.fileUrl ? `<a href="${n.fileUrl}" target="_blank" onclick="event.stopPropagation()" style="font-size:0.85rem">📎 Tài liệu</a>` : ''}
    </div>`).join('');
}
function filterNotes(q) {
  q = (q || '').toLowerCase();
  const filtered = App.data.notes.filter((n) =>
    (n.title || '').toLowerCase().includes(q) ||
    (n.content || '').toLowerCase().includes(q) ||
    subjectLabel(n.subject).toLowerCase().includes(q));
  $('#notes-list').innerHTML = notesHtml(filtered);
}

/* ============================================================
   CÁ NHÂN
   ============================================================ */
function renderProfile() {
  const u = App.state.user;
  $('#screen-profile').innerHTML = `
    <div class="page-head"><h2>Cá nhân</h2></div>
    <div class="card" style="text-align:center">
      <div class="profile-big-avatar">${initials(u.name)}</div>
      <h3>${u.name}</h3>
      <p class="muted">${u.role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'}</p>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="profile-row"><span class="k">Email</span><span>${u.email}</span></div>
      ${u.role === 'STUDENT' ? `<div class="profile-row"><span class="k">Khối</span>
        <select id="profile-grade" onchange="changeGrade(this.value)" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;background:var(--bg-surface);color:var(--text-primary);font-size:16px">
          ${[8, 10, 11, 12].map((g) => `<option value="${g}"${(+u.grade || 12) === g ? ' selected' : ''}>Lớp ${g}</option>`).join('')}
        </select></div>` : ''}
    </div>
    <button class="btn btn-ghost btn-block" style="margin-top:16px" onclick="openPasswordModal()">Đổi mật khẩu</button>
    <button class="btn btn-danger btn-block" style="margin-top:8px" onclick="logout()">Đăng xuất</button>`;
}

async function changeGrade(g) {
  const grade = +g;
  App.state.user.grade = grade;
  saveSession();
  App.state.learn = { view: 'subjects' };
  showToast(`Đã chuyển sang Lớp ${grade}`, 'success');
  try { await Api.call('updateProfile', { grade }); } catch (e) {}
}

function openPasswordModal() {
  openModal('Đổi mật khẩu', `
    <label class="field"><span>Mật khẩu hiện tại</span><input type="password" id="m-old" /></label>
    <label class="field"><span>Mật khẩu mới</span><input type="password" id="m-new" placeholder="tối thiểu 6 ký tự" /></label>
    <label class="field"><span>Nhập lại mật khẩu mới</span><input type="password" id="m-new2" /></label>
    <button class="btn btn-primary btn-block" onclick="savePassword()">Lưu</button>`);
}
async function savePassword() {
  const o = $('#m-old').value, n = $('#m-new').value, n2 = $('#m-new2').value;
  if (n.length < 6) { showToast('Mật khẩu mới tối thiểu 6 ký tự', 'error'); return; }
  if (n !== n2) { showToast('Mật khẩu nhập lại không khớp', 'error'); return; }
  showLoading();
  try {
    await Api.call('changePassword', { oldPassword: o, newPassword: n });
    closeModal(); showToast('Đã đổi mật khẩu', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

/* ============================================================
   MÔ PHỎNG — Phòng thí nghiệm ảo Lý – Hóa
   ============================================================ */
const SIM_LIST = [
  { key: 'graph', label: '📈 Vẽ đồ thị hàm số', tag: 'Toán' },
  { key: 'geo', label: '📐 Hình học động (tam giác)', tag: 'Toán' },
  { key: 'lever', label: '⚖️ Đòn bẩy', tag: 'Lý 8' },
  { key: 'arch', label: '🌊 Lực đẩy Archimedes', tag: 'Lý 8' },
  { key: 'ohm', label: '⚡ Định luật Ohm', tag: 'Lý' },
  { key: 'boyle', label: '🎈 Định luật Boyle (khí)', tag: 'Lý 12' },
  { key: 'conc', label: '💧 Nồng độ dung dịch', tag: 'Hóa 8' },
  { key: 'ph', label: '🧪 Thang pH', tag: 'Hóa 8' },
  { key: 'reaction', label: '⚗️ Mô phỏng phản ứng', tag: 'Hóa 12' },
  { key: 'molecule', label: '🧬 Phân tử (xoay 3D)', tag: 'Hóa 12' },
  { key: 'electro', label: '🔌 Điện phân', tag: 'Hóa 12' },
  { key: 'polymer', label: '🔗 Trùng hợp polymer', tag: 'Hóa 12' },
  { key: 'metalsalt', label: '🔋 Kim loại + muối', tag: 'Hóa 12' },
  { key: 'heart', label: '❤️ Hệ tuần hoàn', tag: 'Sinh 8' },
  { key: 'digest', label: '🍽️ Hệ tiêu hóa', tag: 'Sinh 8' },
  { key: 'lungs', label: '🫁 Hệ hô hấp', tag: 'Sinh 8' },
  { key: 'pendulum', label: '🕰️ Con lắc đơn', tag: 'Lý' },
  { key: 'wave', label: '〰️ Sóng ngang', tag: 'Lý' },
  { key: 'standing', label: '🌊 Sóng dừng (phản xạ)', tag: 'Lý' },
  { key: 'spring', label: '🪀 Con lắc lò xo', tag: 'Lý' },
];
function launchSim(key) { App.state.sim = key; switchTab('sim'); }

function renderSim() {
  const cur = App.state.sim || (App.state.sim = 'lever');
  $('#screen-sim').innerHTML = `
    <div class="page-head">
      <p class="link" onclick="switchTab('learn')">‹ Quay lại Học</p>
      <h2>🔬 Phòng mô phỏng</h2><p>Kéo thanh trượt để xem hiện tượng thay đổi theo thời gian thực</p>
    </div>
    <div class="sim-tabs">
      ${SIM_LIST.map((s) => `<button class="sim-tab ${s.key === cur ? 'active' : ''}" onclick="openSim('${s.key}')">${s.label}<small>${s.tag}</small></button>`).join('')}
    </div>
    <div class="card" id="sim-stage"></div>`;
  openSim(cur);
}

function openSim(key) {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  App.state.sim = key;
  $$('.sim-tab').forEach((b) => b.classList.toggle('active', b.getAttribute('onclick').includes(`'${key}'`)));
  ({ graph: simGraph, geo: simGeo, lever: simLever, arch: simArch, ohm: simOhm, boyle: simBoyle,
    conc: simConc, ph: simPH, reaction: simReaction, molecule: simMolecule,
    electro: simElectro, polymer: simPolymer, metalsalt: simMetalSalt,
    heart: simHeart, digest: simDigest, lungs: simLungs, pendulum: simPendulum, wave: simWave,
    standing: simStanding, spring: simSpring }[key])();
}

function simSlider(id, label, min, max, val, step, unit, fn) {
  return `<label class="sim-row"><span>${label}</span>
    <input id="${id}" type="range" min="${min}" max="${max}" value="${val}" step="${step || 1}" oninput="${fn}()">
    <b id="${id}v">${val}</b>${unit ? ' ' + unit : ''}</label>`;
}
function simStage(controls) {
  $('#sim-stage').innerHTML = `${controls}
    <canvas id="sim-canvas" width="320" height="210" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
}
function simCtx() {
  const c = document.getElementById('sim-canvas');
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  return ctx;
}
function setv(id, v) { const e = document.getElementById(id + 'v'); if (e) e.textContent = v; }
function numv(id) { return parseFloat(document.getElementById(id).value); }

/* ⚖️ Đòn bẩy */
function simLever() {
  simStage(
    simSlider('lev-f1', 'Lực F₁', 10, 100, 40, 1, 'N', 'simLeverUpdate') +
    simSlider('lev-d1', 'Cánh tay đòn d₁', 10, 100, 50, 1, 'cm', 'simLeverUpdate') +
    simSlider('lev-f2', 'Lực F₂', 10, 100, 50, 1, 'N', 'simLeverUpdate') +
    simSlider('lev-d2', 'Cánh tay đòn d₂', 10, 100, 40, 1, 'cm', 'simLeverUpdate'));
  simLeverUpdate();
}
function simLeverUpdate() {
  const F1 = numv('lev-f1'), d1 = numv('lev-d1'), F2 = numv('lev-f2'), d2 = numv('lev-d2');
  ['lev-f1', 'lev-d1', 'lev-f2', 'lev-d2'].forEach((id) => setv(id, numv(id)));
  const t1 = F1 * d1, t2 = F2 * d2;
  const ctx = simCtx();
  const cx = 160, cy = 120;
  let ang = Math.max(-0.32, Math.min(0.32, (t2 - t1) / 9000));
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
  ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-130, 0); ctx.lineTo(130, 0); ctx.stroke();
  // tạ trái (F1) & phải (F2)
  ctx.fillStyle = '#dc2626'; ctx.fillRect(-130, -6 - F1 * 0.4, 22, F1 * 0.4);
  ctx.fillStyle = '#16a34a'; ctx.fillRect(108, -6 - F2 * 0.4, 22, F2 * 0.4);
  ctx.restore();
  // điểm tựa
  ctx.fillStyle = '#475569'; ctx.beginPath(); ctx.moveTo(cx, cy + 2); ctx.lineTo(cx - 16, cy + 40); ctx.lineTo(cx + 16, cy + 40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
  ctx.fillText('F₁', cx - 126, cy + 56); ctx.fillText('F₂', cx + 112, cy + 56);
  const bal = Math.abs(t1 - t2) < 50;
  document.getElementById('sim-out').innerHTML =
    `τ₁ = F₁·d₁ = <b>${t1}</b> &nbsp; | &nbsp; τ₂ = F₂·d₂ = <b>${t2}</b><br>` +
    (bal ? '<span style="color:var(--success)">✅ Đòn bẩy CÂN BẰNG (τ₁ = τ₂)</span>'
         : `<span style="color:var(--warning)">⚠️ Lệch về phía ${t1 > t2 ? 'F₁ (trái)' : 'F₂ (phải)'} — để cân bằng cần F₂ = ${(t1 / d2).toFixed(1)} N</span>`);
}

/* 🌊 Lực đẩy Archimedes */
function simArch() {
  simStage(simSlider('arch-d', 'Khối lượng riêng vật D', 200, 2500, 600, 10, 'kg/m³', 'simArchUpdate') +
    `<p class="muted" style="font-size:.8rem">Khối lượng riêng của nước ≈ 1000 kg/m³</p>`);
  simArchUpdate();
}
function simArchUpdate() {
  const D = numv('arch-d'); setv('arch-d', D);
  const ctx = simCtx();
  // bể nước
  ctx.fillStyle = '#dbeafe'; ctx.fillRect(40, 70, 240, 130);
  ctx.strokeStyle = '#94a3b8'; ctx.strokeRect(40, 70, 240, 130);
  ctx.strokeStyle = '#60a5fa'; ctx.beginPath(); ctx.moveTo(40, 80); ctx.lineTo(280, 80); ctx.stroke();
  const water = 1000, bw = 60, bh = 46, bx = 130;
  let state, by;
  if (D < water) { const f = D / water; by = 80 - bh * (1 - f); state = 'NỔI'; }
  else if (D === water) { by = 100; state = 'LƠ LỬNG'; }
  else { by = 200 - bh - 4; state = 'CHÌM'; }
  ctx.fillStyle = '#f59e0b'; ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#b45309'; ctx.strokeRect(bx, by, bw, bh);
  // mũi tên F_A (lên) và P (xuống)
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2, by - 24); ctx.stroke();
  ctx.fillStyle = '#16a34a'; ctx.fillText('F_A', bx + bw / 2 + 4, by - 16);
  ctx.strokeStyle = '#dc2626'; ctx.beginPath(); ctx.moveTo(bx + bw / 2, by + bh); ctx.lineTo(bx + bw / 2, by + bh + 24); ctx.stroke();
  ctx.fillStyle = '#dc2626'; ctx.fillText('P', bx + bw / 2 + 4, by + bh + 18);
  const cmp = D < water ? 'F_A > P' : (D > water ? 'F_A < P' : 'F_A = P');
  document.getElementById('sim-out').innerHTML =
    `Vật <b>${state}</b> &nbsp;(${cmp}) — D_vật ${D < water ? '<' : (D > water ? '>' : '=')} D_nước.`;
}

/* ⚡ Định luật Ohm */
function simOhm() {
  simStage(simSlider('ohm-u', 'Hiệu điện thế U', 0, 24, 12, 1, 'V', 'simOhmUpdate') +
    simSlider('ohm-r', 'Điện trở R', 1, 100, 6, 1, 'Ω', 'simOhmUpdate'));
  simOhmUpdate();
}
function simOhmUpdate() {
  const U = numv('ohm-u'), R = numv('ohm-r'); setv('ohm-u', U); setv('ohm-r', R);
  const I = U / R;
  const ctx = simCtx();
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(60, 50, 200, 110);
  // pin
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, 160); ctx.lineTo(150, 148); ctx.stroke();
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(168, 160); ctx.lineTo(168, 144); ctx.stroke();
  ctx.fillStyle = '#dc2626'; ctx.font = '11px sans-serif'; ctx.fillText('Nguồn U', 120, 178);
  // bóng đèn — độ sáng theo I
  const bright = Math.max(0, Math.min(1, I / 4));
  ctx.fillStyle = `rgba(253,224,71,${0.2 + 0.8 * bright})`;
  ctx.beginPath(); ctx.arc(160, 50, 16, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(160, 50, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.fillText('Đèn (R)', 185, 50);
  document.getElementById('sim-out').innerHTML =
    `Cường độ dòng điện: I = U / R = ${U} / ${R} = <b>${I.toFixed(2)} A</b>. Đèn ${bright > 0.6 ? 'sáng mạnh' : (bright > 0.2 ? 'sáng vừa' : 'mờ')}.`;
}

/* 🎈 Định luật Boyle – Mariotte */
const SIM_BOYLE_DOTS = Array.from({ length: 26 }, (_, i) => ({ x: (i * 53 % 100) / 100, y: ((i * 37 + 11) % 100) / 100 }));
function simBoyle() {
  simStage(simSlider('boyle-v', 'Thể tích V', 1, 10, 5, 1, 'L', 'simBoyleUpdate') +
    `<p class="muted" style="font-size:.8rem">Đẳng nhiệt: p·V = 10 (không đổi)</p>`);
  simBoyleUpdate();
}
function simBoyleUpdate() {
  const V = numv('boyle-v'); setv('boyle-v', V);
  const p = 10 / V;
  const ctx = simCtx();
  const x0 = 110, w = 100, bottom = 190, maxH = 150;
  const h = maxH * V / 10;
  const top = bottom - h;
  // xi lanh
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(x0, bottom - maxH, w, maxH);
  // khí
  ctx.fillStyle = '#dbeafe'; ctx.fillRect(x0, top, w, h);
  // pít tông
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(x0 - 4, top - 10, w + 8, 10);
  // phân tử khí
  ctx.fillStyle = '#4f46e5';
  SIM_BOYLE_DOTS.forEach((d) => { ctx.beginPath(); ctx.arc(x0 + 8 + d.x * (w - 16), top + 6 + d.y * (h - 12), 3, 0, Math.PI * 2); ctx.fill(); });
  document.getElementById('sim-out').innerHTML =
    `V = ${V} L ⇒ áp suất p = 10 / V = <b>${p.toFixed(2)}</b> (đơn vị). Thể tích giảm ⇒ phân tử dày hơn ⇒ áp suất tăng (p·V = 10).`;
}

/* 💧 Nồng độ phần trăm dung dịch */
function simConc() {
  simStage(simSlider('conc-ct', 'Khối lượng chất tan', 0, 50, 20, 1, 'g', 'simConcUpdate') +
    simSlider('conc-w', 'Khối lượng nước', 50, 200, 80, 1, 'g', 'simConcUpdate'));
  simConcUpdate();
}
function simConcUpdate() {
  const ct = numv('conc-ct'), w = numv('conc-w'); setv('conc-ct', ct); setv('conc-w', w);
  const C = ct / (ct + w) * 100;
  const ctx = simCtx();
  // cốc
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(110, 50, 100, 150);
  // dung dịch — màu đậm theo C%
  const a = Math.min(1, C / 35);
  ctx.fillStyle = `rgba(37,99,235,${0.12 + 0.8 * a})`;
  ctx.fillRect(112, 70, 96, 128);
  document.getElementById('sim-out').innerHTML =
    `m_dd = ${ct} + ${w} = <b>${ct + w}</b> g ⇒ C% = ${ct}/${ct + w} × 100% = <b>${C.toFixed(1)}%</b>. Càng nhiều chất tan ⇒ dung dịch càng đậm màu.`;
}

/* 🧪 Thang pH */
function simPH() {
  simStage(simSlider('ph-v', 'Giá trị pH', 0, 14, 7, 1, '', 'simPHUpdate'));
  simPHUpdate();
}
function simPHColor(pH) {
  if (pH <= 3) return '#e11d48';
  if (pH <= 6) return '#f59e0b';
  if (pH === 7) return '#16a34a';
  if (pH <= 10) return '#0891b2';
  return '#6d28d9';
}
function simPHUpdate() {
  const pH = numv('ph-v'); setv('ph-v', pH);
  const ctx = simCtx();
  // dải màu thang pH
  for (let i = 0; i <= 14; i++) {
    ctx.fillStyle = simPHColor(i); ctx.fillRect(20 + i * 20, 40, 20, 40);
  }
  // con trỏ
  const x = 20 + pH * 20 + 10;
  ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.moveTo(x, 86); ctx.lineTo(x - 6, 98); ctx.lineTo(x + 6, 98); ctx.closePath(); ctx.fill();
  // ống nghiệm đổi màu
  ctx.fillStyle = simPHColor(pH); ctx.fillRect(140, 120, 40, 70);
  ctx.strokeStyle = '#475569'; ctx.strokeRect(140, 120, 40, 70);
  const loai = pH < 7 ? 'ACID' : (pH > 7 ? 'BASE (kiềm)' : 'TRUNG TÍNH');
  document.getElementById('sim-out').innerHTML =
    `pH = <b>${pH}</b> ⇒ môi trường <b>${loai}</b>. ${pH < 7 ? 'Quỳ tím hóa đỏ.' : (pH > 7 ? 'Quỳ tím hóa xanh.' : 'Quỳ tím không đổi màu.')}`;
}
function simNoop() {}

/* 📈 Công cụ vẽ đồ thị hàm số (có tham số a → đồ thị động) */
function compileFn(raw) {
  let s = (raw || '').toLowerCase().replace(/\s+/g, '');
  if (!s) throw new Error('Nhập biểu thức');
  s = s.replace(/\bpi\b/g, 'PI_').replace(/\bsqrt\b/g, 'SQRT_').replace(/\bsin\b/g, 'SIN_')
    .replace(/\bcos\b/g, 'COS_').replace(/\btan\b/g, 'TAN_').replace(/\babs\b/g, 'ABS_')
    .replace(/\bexp\b/g, 'EXP_').replace(/\bln\b/g, 'LN_').replace(/\blog\b/g, 'LOG_').replace(/\be\b/g, 'E_');
  if (!/^[0-9xa.+\-*/^()A-Z_]*$/.test(s)) throw new Error('Ký tự không hợp lệ');
  s = s.replace(/([0-9xa)])\s*([xa(A-Z])/g, '$1*$2');
  s = s.replace(/\^/g, '**').replace(/PI_/g, 'Math.PI').replace(/E_/g, 'Math.E')
    .replace(/SQRT_/g, 'Math.sqrt').replace(/SIN_/g, 'Math.sin').replace(/COS_/g, 'Math.cos')
    .replace(/TAN_/g, 'Math.tan').replace(/ABS_/g, 'Math.abs').replace(/EXP_/g, 'Math.exp')
    .replace(/LN_/g, 'Math.log').replace(/LOG_/g, 'Math.log10');
  return new Function('x', 'a', 'return (' + s + ');');
}
function niceStep(range) {
  const raw = range / 8, p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p;
  return (n < 1.5 ? 1 : (n < 3 ? 2 : (n < 7 ? 5 : 10))) * p;
}
function simGraph() {
  const cur = App.state.graphFn || (App.state.graphFn = 'x^2');
  $('#sim-stage').innerHTML = `
    <div class="sim-fn">
      <input id="g-fn" type="text" value="${cur}" placeholder="vd: x^2 - 3*x + 2 ; a*sin(x) ; 1/x" oninput="simGraphUpdate()">
      <button class="btn btn-primary btn-sm" onclick="simGraphUpdate()">Vẽ</button>
    </div>
    <div class="sim-quick">${['x^2', 'x^3-3*x', 'a*x^2', 'sin(x)', '1/x', 'sqrt(x)', 'abs(x)'].map((e) => `<button class="sim-chip" onclick="simGraphSet('${e}')">${e}</button>`).join('')}</div>
    ${simSlider('g-a', 'Tham số a', -5, 5, 1, 0.1, '', 'simGraphUpdate')}
    <div class="sim-mini">
      <label>x: <input id="g-xmin" type="number" value="-10" oninput="simGraphUpdate()"> … <input id="g-xmax" type="number" value="10" oninput="simGraphUpdate()"></label>
      <label>y: <input id="g-ymin" type="number" value="-8" oninput="simGraphUpdate()"> … <input id="g-ymax" type="number" value="8" oninput="simGraphUpdate()"></label>
    </div>
    <canvas id="sim-canvas" width="320" height="260" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  simGraphUpdate();
}
function simGraphSet(e) { document.getElementById('g-fn').value = e; App.state.graphFn = e; simGraphUpdate(); }
function simGraphAxes(xmin, xmax, ymin, ymax) {
  const ctx = simCtx(), W = 320, H = 260;
  const PX = (x) => (x - xmin) / (xmax - xmin) * W, PY = (y) => H - (y - ymin) / (ymax - ymin) * H;
  const sx = niceStep(xmax - xmin), sy = niceStep(ymax - ymin);
  ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  for (let gx = Math.ceil(xmin / sx) * sx; gx <= xmax; gx += sx) { const X = PX(gx); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, H); ctx.stroke(); }
  for (let gy = Math.ceil(ymin / sy) * sy; gy <= ymax; gy += sy) { const Y = PY(gy); ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(W, Y); ctx.stroke(); }
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
  if (0 >= ymin && 0 <= ymax) { const Y = PY(0); ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(W, Y); ctx.stroke(); }
  if (0 >= xmin && 0 <= xmax) { const X = PX(0); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, H); ctx.stroke(); }
  return ctx;
}
function simGraphUpdate() {
  const raw = document.getElementById('g-fn').value; App.state.graphFn = raw;
  const a = numv('g-a'); setv('g-a', a);
  const xmin = numv('g-xmin'), xmax = numv('g-xmax'), ymin = numv('g-ymin'), ymax = numv('g-ymax');
  const out = document.getElementById('sim-out');
  if (!(xmax > xmin) || !(ymax > ymin)) { out.innerHTML = '<span style="color:var(--danger)">Khoảng x hoặc y chưa hợp lệ (giá trị đầu phải nhỏ hơn giá trị cuối).</span>'; return; }
  let f;
  try { f = compileFn(raw); const t = f(1, a); if (typeof t !== 'number') throw new Error('NaN'); } catch (err) {
    simGraphAxes(xmin, xmax, ymin, ymax);
    out.innerHTML = '<span style="color:var(--danger)">⚠️ Biểu thức chưa hợp lệ. Cho phép: x, a, + - * / ^, sin, cos, tan, sqrt, abs, ln, log, exp, pi.</span>'; return;
  }
  const ctx = simGraphAxes(xmin, xmax, ymin, ymax), W = 320, H = 260;
  const PY = (y) => H - (y - ymin) / (ymax - ymin) * H, span = ymax - ymin;
  ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 2; ctx.beginPath();
  let pen = false;
  for (let px = 0; px <= W; px++) {
    const x = xmin + px / W * (xmax - xmin); let y;
    try { y = f(x, a); } catch (e) { y = NaN; }
    if (Number.isFinite(y) && y > ymin - span * 2 && y < ymax + span * 2) {
      const py = PY(y); if (!pen) { ctx.moveTo(px, py); pen = true; } else ctx.lineTo(px, py);
    } else pen = false;
  }
  ctx.stroke();
  out.innerHTML = `Đồ thị <b>y = ${raw}</b>${raw.toLowerCase().includes('a') ? ` &nbsp;(a = ${a})` : ''}. Kéo "Tham số a" để xem đồ thị biến đổi động.`;
}

/* 📐 Hình học động — tổng ba góc tam giác = 180° */
function simGeo() {
  simStage(simSlider('geo-ax', 'Đỉnh A — ngang', 70, 250, 160, 1, '', 'simGeoUpdate') +
    simSlider('geo-ay', 'Đỉnh A — cao', 25, 150, 45, 1, '', 'simGeoUpdate'));
  simGeoUpdate();
}
function simGeoUpdate() {
  const ax = numv('geo-ax'), ay = numv('geo-ay'); setv('geo-ax', ax); setv('geo-ay', ay);
  const A = [ax, ay], B = [60, 185], C = [260, 185];
  const ang = (p, q, r) => {
    const u = [p[0] - q[0], p[1] - q[1]], v = [r[0] - q[0], r[1] - q[1]];
    const d = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]));
    return Math.acos(Math.max(-1, Math.min(1, d))) * 180 / Math.PI;
  };
  const gA = ang(B, A, C), gB = ang(A, B, C), gC = ang(A, C, B);
  const ctx = simCtx();
  ctx.fillStyle = '#eef2ff'; ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '13px sans-serif';
  ctx.fillText('A', A[0] - 4, A[1] - 7); ctx.fillText('B', B[0] - 14, B[1] + 6); ctx.fillText('C', C[0] + 7, C[1] + 6);
  document.getElementById('sim-out').innerHTML =
    `Â = ${gA.toFixed(1)}° &nbsp;·&nbsp; B̂ = ${gB.toFixed(1)}° &nbsp;·&nbsp; Ĉ = ${gC.toFixed(1)}°<br><b>Tổng ba góc = ${(gA + gB + gC).toFixed(1)}° = 180°</b> — luôn đúng dù kéo đỉnh A đến đâu.`;
}

/* ⚗️ Mô phỏng phản ứng — va chạm phân tử theo nhiệt độ */
function simReaction() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('rx-temp', 'Nhiệt độ', 10, 100, 50, 1, '°C', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="210" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>
    <button class="btn btn-ghost btn-sm" onclick="simReaction()" style="margin-top:6px">↺ Bắt đầu lại</button>`;
  const dots = [];
  for (let i = 0; i < 18; i++) {
    const t = (i * 2.39996) % 6.283;
    dots.push({ x: 40 + (i * 53 % 250), y: 55 + (i * 71 % 120), vx: Math.cos(t), vy: Math.sin(t), col: i % 3 === 0 ? '#dc2626' : '#2563eb' });
  }
  App.state.react = { prog: 0, dots };
  simReactionLoop();
}
function simReactionLoop() {
  const T = numv('rx-temp'); setv('rx-temp', T);
  const sp = 0.3 + T / 35, st = App.state.react;
  st.prog = Math.min(100, st.prog + T * 0.015);
  const ctx = simCtx();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.strokeRect(20, 40, 280, 150);
  st.dots.forEach((d, i) => {
    d.x += d.vx * sp; d.y += d.vy * sp;
    if (d.x < 26 || d.x > 314) { d.vx *= -1; d.x = Math.max(26, Math.min(314, d.x)); }
    if (d.y < 46 || d.y > 184) { d.vy *= -1; d.y = Math.max(46, Math.min(184, d.y)); }
    const isW = (i / st.dots.length) < st.prog / 100;
    ctx.fillStyle = isW ? '#06b6d4' : d.col;
    ctx.beginPath(); ctx.arc(d.x, d.y, 5, 0, Math.PI * 2); ctx.fill();
  });
  document.getElementById('sim-out').innerHTML =
    `Phản ứng 2H₂ + O₂ → 2H₂O. Nhiệt độ cao ⇒ phân tử chuyển động nhanh ⇒ va chạm nhiều ⇒ <b>tốc độ phản ứng tăng</b>.<br>Tiến độ: <b>${st.prog.toFixed(0)}%</b> (xanh lơ = phân tử nước đã tạo thành).`;
  App.state.simRAF = requestAnimationFrame(simReactionLoop);
}

/* 🧬 Xem phân tử — xoay giả 3D */
const MOL_DATA = {
  H2O: { desc: 'Nước — góc liên kết ≈ 104,5°, phân tử phân cực', atoms: [{ p: [0, 0, 0], col: '#dc2626', r: 16 }, { p: [-0.9, 0.5, 0], col: '#e5e7eb', r: 10 }, { p: [0.9, 0.5, 0], col: '#e5e7eb', r: 10 }], bonds: [[0, 1], [0, 2]] },
  CO2: { desc: 'Cacbon đioxit — phân tử thẳng, không phân cực', atoms: [{ p: [0, 0, 0], col: '#334155', r: 14 }, { p: [-1.2, 0, 0], col: '#dc2626', r: 14 }, { p: [1.2, 0, 0], col: '#dc2626', r: 14 }], bonds: [[0, 1], [0, 2]] },
  CH4: { desc: 'Metan — hình tứ diện đều', atoms: [{ p: [0, 0, 0], col: '#334155', r: 15 }, { p: [0.8, 0.8, 0.8], col: '#e5e7eb', r: 9 }, { p: [-0.8, -0.8, 0.8], col: '#e5e7eb', r: 9 }, { p: [-0.8, 0.8, -0.8], col: '#e5e7eb', r: 9 }, { p: [0.8, -0.8, -0.8], col: '#e5e7eb', r: 9 }], bonds: [[0, 1], [0, 2], [0, 3], [0, 4]] },
  NH3: { desc: 'Amoniac — hình chóp tam giác', atoms: [{ p: [0, -0.3, 0], col: '#2563eb', r: 15 }, { p: [0.9, 0.4, 0.5], col: '#e5e7eb', r: 9 }, { p: [-0.9, 0.4, 0.5], col: '#e5e7eb', r: 9 }, { p: [0, 0.4, -1], col: '#e5e7eb', r: 9 }], bonds: [[0, 1], [0, 2], [0, 3]] },
};
function simMolecule() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  const cur = (App.state.mol && App.state.mol.name) || 'H2O';
  $('#sim-stage').innerHTML = `
    <div class="sim-quick">${Object.keys(MOL_DATA).map((m) => `<button class="sim-chip ${m === cur ? 'on' : ''}" onclick="simMoleculeSet('${m}')">${m}</button>`).join('')}</div>
    <canvas id="sim-canvas" width="320" height="230" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#0f172a;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  App.state.mol = { name: cur, angle: (App.state.mol && App.state.mol.angle) || 0 };
  simMoleculeLoop();
}
function simMoleculeSet(m) { App.state.mol = { name: m, angle: 0 }; simMolecule(); }
function simMoleculeLoop() {
  const m = App.state.mol; m.angle += 0.02;
  const data = MOL_DATA[m.name], ctx = simCtx(), cx = 160, cy = 115, scale = 44, th = m.angle;
  const proj = data.atoms.map((at) => {
    const x = at.p[0] * Math.cos(th) + at.p[2] * Math.sin(th);
    const z = -at.p[0] * Math.sin(th) + at.p[2] * Math.cos(th);
    return { sx: cx + x * scale, sy: cy + at.p[1] * scale, z, col: at.col, r: at.r };
  });
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 5;
  data.bonds.forEach((b) => { ctx.beginPath(); ctx.moveTo(proj[b[0]].sx, proj[b[0]].sy); ctx.lineTo(proj[b[1]].sx, proj[b[1]].sy); ctx.stroke(); });
  proj.map((p, i) => ({ p, i })).sort((a, b) => a.p.z - b.p.z).forEach((o) => {
    const p = o.p, rr = Math.max(6, p.r * (1 + 0.14 * p.z));
    ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.sx, p.sy, rr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1; ctx.stroke();
  });
  document.getElementById('sim-out').innerHTML = `Phân tử <b>${m.name}</b> — ${data.desc}. (Đỏ = O, xám = H, đen = C, xanh = N)`;
  App.state.simRAF = requestAnimationFrame(simMoleculeLoop);
}

/* 🔌 Điện phân — ion di chuyển về điện cực */
function simElectro() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('el-i', 'Cường độ dòng điện', 1, 10, 5, 1, 'A', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="210" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  const ions = [];
  for (let i = 0; i < 14; i++) ions.push({ x: 90 + (i * 41 % 140), y: 55 + (i * 67 % 110), ch: i % 2 ? 1 : -1 });
  App.state.electro = ions;
  simElectroLoop();
}
function simElectroLoop() {
  const I = numv('el-i'); setv('el-i', I); const sp = 0.3 + I / 6;
  const ctx = simCtx();
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(40, 40, 240, 140);
  ctx.fillStyle = '#dbeafe'; ctx.fillRect(42, 42, 236, 136);
  ctx.fillStyle = '#cbd5e1'; ctx.fillRect(60, 30, 12, 158); ctx.fillRect(248, 30, 12, 158);
  ctx.fillStyle = '#dc2626'; ctx.font = '12px sans-serif'; ctx.fillText('(–) catot', 44, 200);
  ctx.fillStyle = '#2563eb'; ctx.fillText('anot (+)', 214, 200);
  App.state.electro.forEach((io) => {
    io.x += (io.ch > 0 ? -sp : sp);
    if (io.x < 76 || io.x > 244) io.x = 150 + (io.y % 40) - 20;
    ctx.fillStyle = io.ch > 0 ? '#dc2626' : '#2563eb';
    ctx.beginPath(); ctx.arc(io.x, io.y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.fillText(io.ch > 0 ? '+' : '–', io.x - 3, io.y + 3);
  });
  document.getElementById('sim-out').innerHTML =
    `Ion dương (cation, đỏ) chạy về <b>catot (–)</b> và bị <b>khử</b> (nhận e); ion âm (anion, xanh) chạy về <b>anot (+)</b> và bị <b>oxi hóa</b> (nhường e). Dòng điện càng lớn ⇒ ion di chuyển càng nhanh.`;
  App.state.simRAF = requestAnimationFrame(simElectroLoop);
}

/* 🔗 Phản ứng trùng hợp polymer */
function simPolymer() {
  simStage(simSlider('poly-n', 'Số mắt xích n', 1, 12, 4, 1, '', 'simPolymerUpdate'));
  simPolymerUpdate();
}
function simPolymerUpdate() {
  const n = numv('poly-n'); setv('poly-n', n);
  const ctx = simCtx();
  const y = 105, w = 18, gap = 8, totalW = n * (w + gap) - gap, x0 = Math.max(8, (320 - totalW) / 2);
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (w + gap);
    if (i > 0) { ctx.strokeStyle = '#475569'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - gap, y); ctx.lineTo(x, y); ctx.stroke(); }
    ctx.fillStyle = '#4f46e5'; ctx.fillRect(x, y - 13, w, 26);
    ctx.strokeStyle = '#312e81'; ctx.lineWidth = 1; ctx.strokeRect(x, y - 13, w, 26);
  }
  document.getElementById('sim-out').innerHTML =
    `Trùng hợp: <b>${n}</b> phân tử monome (vd CH₂=CH₂) liên kết với nhau tạo mạch polime (–CH₂–CH₂–)<sub>${n}</sub>. Hệ số polime hóa n = số mắt xích.`;
}

/* 🔋 Kim loại đẩy kim loại khỏi muối: Fe + CuSO₄ */
function simMetalSalt() {
  simStage(simSlider('ms-p', 'Mức độ phản ứng', 0, 100, 0, 1, '%', 'simMetalSaltUpdate'));
  simMetalSaltUpdate();
}
function simMetalSaltUpdate() {
  const p = numv('ms-p'); setv('ms-p', p); const f = p / 100;
  const ctx = simCtx();
  const r = Math.round(37 + (150 - 37) * f), g = Math.round(99 + (175 - 99) * f), b = Math.round(235 - (235 - 130) * f);
  ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(60, 50, 200, 140);
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(60, 50, 200, 140);
  ctx.fillStyle = '#9ca3af'; ctx.fillRect(150, 40, 20, 130);
  const cu = Math.round(9 * f); ctx.fillStyle = '#ea580c';
  if (cu > 0) { ctx.fillRect(150 - cu, 40, cu, 130); ctx.fillRect(170, 40, cu, 130); }
  document.getElementById('sim-out').innerHTML =
    `Fe + CuSO₄ → FeSO₄ + Cu. Nhúng thanh sắt vào dung dịch CuSO₄ (xanh lam): đồng (Cu, màu cam) bám lên thanh sắt, dung dịch nhạt màu dần do tạo FeSO₄. Mức phản ứng: <b>${p}%</b>.`;
}

/* ❤️ Hệ tuần hoàn — tim đập, máu lưu thông */
function drawHeartShape(ctx, cx, cy, r) {
  ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.8);
  ctx.bezierCurveTo(cx + r * 1.3, cy - r * 0.4, cx + r * 0.45, cy - r * 1.1, cx, cy - r * 0.3);
  ctx.bezierCurveTo(cx - r * 0.45, cy - r * 1.1, cx - r * 1.3, cy - r * 0.4, cx, cy + r * 0.8);
  ctx.closePath(); ctx.fill();
}
function simHeart() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('hr-bpm', 'Nhịp tim', 40, 160, 75, 1, 'lần/phút', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="235" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  const dots = [];
  for (let i = 0; i < 16; i++) dots.push({ th: i / 16 * Math.PI * 2 });
  App.state.heart = { dots, beat: 0 };
  simHeartLoop();
}
function simHeartLoop() {
  const bpm = numv('hr-bpm'); setv('hr-bpm', bpm);
  const st = App.state.heart, sp = bpm / 60 * 0.045, cx = 160, cy = 120, rx = 105, ry = 78;
  st.beat += bpm / 60 * 0.13;
  const ctx = simCtx();
  ctx.lineWidth = 9;
  ctx.strokeStyle = '#fca5a5'; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.strokeStyle = '#93c5fd'; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
  ctx.font = '11px sans-serif'; ctx.fillStyle = '#475569';
  ctx.fillText('Phổi', cx - 13, cy - ry - 6); ctx.fillText('Cơ thể', cx - 18, cy + ry + 18);
  ctx.fillStyle = '#dc2626'; ctx.fillText('Động mạch', cx + 30, cy - 6);
  ctx.fillStyle = '#2563eb'; ctx.fillText('Tĩnh mạch', cx - 96, cy - 6);
  const s = 1 + 0.13 * Math.max(0, Math.sin(st.beat));
  ctx.fillStyle = '#ef4444'; drawHeartShape(ctx, cx, cy, 17 * s);
  st.dots.forEach((d) => {
    d.th = (d.th + sp) % (Math.PI * 2);
    const x = cx + rx * Math.cos(d.th), y = cy + ry * Math.sin(d.th);
    ctx.fillStyle = Math.cos(d.th) > 0 ? '#dc2626' : '#2563eb';
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
  document.getElementById('sim-out').innerHTML =
    `Tim co bóp <b>${bpm} lần/phút</b> đẩy máu đi khắp cơ thể. Máu <b style="color:#dc2626">đỏ tươi giàu O₂</b> theo động mạch tới cơ quan; máu <b style="color:#2563eb">đỏ thẫm giàu CO₂</b> theo tĩnh mạch về tim rồi lên phổi nhận O₂.`;
  App.state.simRAF = requestAnimationFrame(simHeartLoop);
}

/* 🍽️ Hệ tiêu hóa — thức ăn đi qua các cơ quan */
const DIGEST_PATH = [
  { x: 160, y: 28, name: 'Miệng', note: 'nhai nhỏ, trộn nước bọt (enzyme amylase phân giải tinh bột)' },
  { x: 160, y: 70, name: 'Thực quản', note: 'co bóp nhu động đẩy thức ăn xuống dạ dày' },
  { x: 115, y: 110, name: 'Dạ dày', note: 'acid HCl và enzyme pepsin tiêu hóa protein' },
  { x: 205, y: 150, name: 'Ruột non', note: 'tiêu hóa hoàn toàn và HẤP THỤ chất dinh dưỡng (chủ yếu)' },
  { x: 110, y: 195, name: 'Ruột già', note: 'hấp thụ nước, tạo và thải phân' },
];
function simDigest() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('dg-sp', 'Tốc độ', 1, 10, 4, 1, '', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="235" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  App.state.digest = { t: 0 };
  simDigestLoop();
}
function simDigestLoop() {
  const sp = numv('dg-sp'); setv('dg-sp', sp);
  const st = App.state.digest; st.t = (st.t + sp * 0.004) % (DIGEST_PATH.length - 1);
  const i = Math.floor(st.t), f = st.t - i, A = DIGEST_PATH[i], B = DIGEST_PATH[Math.min(i + 1, DIGEST_PATH.length - 1)];
  const bx = A.x + (B.x - A.x) * f, by = A.y + (B.y - A.y) * f;
  const ctx = simCtx();
  ctx.strokeStyle = '#fdba74'; ctx.lineWidth = 13; ctx.lineJoin = 'round'; ctx.beginPath();
  ctx.moveTo(DIGEST_PATH[0].x, DIGEST_PATH[0].y); DIGEST_PATH.slice(1).forEach((p) => ctx.lineTo(p.x, p.y)); ctx.stroke();
  ctx.font = '11px sans-serif';
  DIGEST_PATH.forEach((p, idx) => {
    ctx.fillStyle = idx === i ? '#ea580c' : '#cbd5e1'; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 6.3); ctx.fill();
    ctx.fillStyle = '#334155'; ctx.fillText(p.name, p.x + 11, p.y + 4);
  });
  ctx.fillStyle = '#16a34a'; ctx.beginPath(); ctx.arc(bx, by, 7, 0, 6.3); ctx.fill();
  document.getElementById('sim-out').innerHTML = `Thức ăn đang ở <b>${A.name}</b>: ${A.note}.`;
  App.state.simRAF = requestAnimationFrame(simDigestLoop);
}

/* 🕰️ Con lắc đơn — dao động */
function simPendulum() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('pd-l', 'Chiều dài dây L', 0.2, 2, 1, 0.1, 'm', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="235" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  App.state.pend = { ph: 0 };
  simPendulumLoop();
}
function simPendulumLoop() {
  const L = numv('pd-l'); setv('pd-l', L.toFixed(1));
  const g = 9.8, T = 2 * Math.PI * Math.sqrt(L / g), st = App.state.pend;
  st.ph += 2 * Math.PI / (T * 60);
  const th = 0.5 * Math.cos(st.ph);
  const ctx = simCtx(), px = 160, py = 26, len = 45 + L * 72;
  const bx = px + len * Math.sin(th), by = py + len * Math.cos(th);
  ctx.fillStyle = '#475569'; ctx.fillRect(px - 22, py - 6, 44, 6);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
  ctx.fillStyle = '#4f46e5'; ctx.beginPath(); ctx.arc(bx, by, 14, 0, 6.3); ctx.fill();
  document.getElementById('sim-out').innerHTML =
    `Con lắc đơn dài L = ${L.toFixed(1)} m. Chu kì T = 2π·√(L/g) = <b>${T.toFixed(2)} s</b>. Với biên độ nhỏ, T <b>không phụ thuộc</b> khối lượng và biên độ — chỉ phụ thuộc L và g.`;
  App.state.simRAF = requestAnimationFrame(simPendulumLoop);
}

/* 〰️ Sóng ngang */
function simWave() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('wv-a', 'Biên độ A', 5, 50, 30, 1, 'px', 'simNoop')}
    ${simSlider('wv-l', 'Bước sóng λ', 40, 200, 100, 5, 'px', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="190" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  App.state.wave = { ph: 0 };
  simWaveLoop();
}
function simWaveLoop() {
  const A = numv('wv-a'), lam = numv('wv-l'); setv('wv-a', A); setv('wv-l', lam);
  const st = App.state.wave; st.ph += 0.09;
  const ctx = simCtx(), cy = 95;
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(320, cy); ctx.stroke();
  ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let x = 0; x <= 320; x++) { const y = cy - A * Math.sin(2 * Math.PI * (x / lam) - st.ph); if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
  ctx.stroke();
  document.getElementById('sim-out').innerHTML =
    `Sóng ngang: biên độ A = <b>${A}</b> px, bước sóng λ = <b>${lam}</b> px. Tốc độ truyền sóng v = λ·f (f là tần số). Tăng λ ⇒ bước sóng dài hơn; tăng A ⇒ sóng cao hơn.`;
  App.state.simRAF = requestAnimationFrame(simWaveLoop);
}

/* 🫁 Hệ hô hấp — phổi phồng/xẹp khi thở */
function simLungs() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('lg-rate', 'Nhịp thở', 8, 30, 16, 1, 'lần/phút', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="235" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  App.state.lung = { ph: 0 };
  simLungsLoop();
}
function simLungsLoop() {
  const rate = numv('lg-rate'); setv('lg-rate', rate);
  const st = App.state.lung; st.ph += rate / 60 * 0.105;
  const breath = 0.5 + 0.5 * Math.sin(st.ph), inhaling = Math.cos(st.ph) > 0;
  const sf = 0.78 + 0.22 * breath;
  const ctx = simCtx();
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(155, 18, 10, 40);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(160, 56); ctx.lineTo(120, 78); ctx.moveTo(160, 56); ctx.lineTo(200, 78); ctx.stroke();
  ctx.fillStyle = inhaling ? '#fca5a5' : '#fecdd3';
  ctx.beginPath(); ctx.ellipse(118, 120, 30 * sf, 50 * sf, 0, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.ellipse(202, 120, 30 * sf, 50 * sf, 0, 0, 6.3); ctx.fill();
  const dia = 178 + 14 * breath;
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 4; ctx.beginPath();
  ctx.moveTo(70, dia); ctx.quadraticCurveTo(160, dia + (inhaling ? 18 : -2), 250, dia); ctx.stroke();
  ctx.fillStyle = '#7c3aed'; ctx.font = '11px sans-serif'; ctx.fillText('Cơ hoành', 135, 222);
  ctx.fillStyle = inhaling ? '#16a34a' : '#dc2626'; ctx.font = 'bold 12px sans-serif';
  ctx.fillText(inhaling ? '↓ O₂ vào' : '↑ CO₂ ra', 132, 14);
  document.getElementById('sim-out').innerHTML = inhaling
    ? `<b style="color:#16a34a">HÍT VÀO:</b> cơ hoành hạ xuống, lồng ngực mở rộng, phổi nở ra để lấy khí O₂. Nhịp thở ${rate} lần/phút.`
    : `<b style="color:#dc2626">THỞ RA:</b> cơ hoành nâng lên, lồng ngực thu nhỏ, phổi xẹp lại để đẩy khí CO₂ ra ngoài. Nhịp thở ${rate} lần/phút.`;
  App.state.simRAF = requestAnimationFrame(simLungsLoop);
}

/* 🌊 Sóng dừng — giao thoa sóng tới & sóng phản xạ */
function simStanding() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('st-n', 'Số bụng sóng', 1, 5, 3, 1, '', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="190" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  App.state.stand = { ph: 0 };
  simStandingLoop();
}
function simStandingLoop() {
  const n = numv('st-n'); setv('st-n', n);
  const st = App.state.stand; st.ph += 0.11;
  const ctx = simCtx(), x0 = 20, x1 = 300, L = x1 - x0, cy = 95, A = 50, env = Math.cos(st.ph);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x1, cy); ctx.stroke();
  // bao hình hai biên (nét đứt)
  ctx.strokeStyle = '#cbd5e1'; ctx.setLineDash([4, 3]);
  for (const sgn of [1, -1]) { ctx.beginPath(); for (let x = x0; x <= x1; x++) { const y = cy - sgn * A * Math.sin(n * Math.PI * (x - x0) / L); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.setLineDash([]);
  // dây tại thời điểm t
  ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let x = x0; x <= x1; x++) { const y = cy - A * Math.sin(n * Math.PI * (x - x0) / L) * env; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke();
  // nút (đứng yên)
  ctx.fillStyle = '#dc2626';
  for (let i = 0; i <= n; i++) { const x = x0 + i / n * L; ctx.beginPath(); ctx.arc(x, cy, 4, 0, 6.3); ctx.fill(); }
  document.getElementById('sim-out').innerHTML =
    `Sóng dừng hình thành do <b>sóng tới</b> và <b>sóng phản xạ</b> giao thoa. Có <b>${n}</b> bụng sóng (dao động cực đại) và <b>${n + 1}</b> nút (chấm đỏ — luôn đứng yên).`;
  App.state.simRAF = requestAnimationFrame(simStandingLoop);
}

/* 🪀 Con lắc lò xo */
function simSpring() {
  if (App.state.simRAF) { cancelAnimationFrame(App.state.simRAF); App.state.simRAF = null; }
  $('#sim-stage').innerHTML = `${simSlider('sp-m', 'Khối lượng m', 0.1, 2, 0.5, 0.1, 'kg', 'simNoop')}
    <canvas id="sim-canvas" width="320" height="235" style="width:100%;max-width:340px;display:block;margin:10px auto;background:#fff;border:1px solid var(--border);border-radius:10px"></canvas>
    <div id="sim-out" class="sim-out"></div>`;
  App.state.spr = { ph: 0 };
  simSpringLoop();
}
function simSpringLoop() {
  const m = numv('sp-m'); setv('sp-m', m.toFixed(1));
  const k = 20, T = 2 * Math.PI * Math.sqrt(m / k), st = App.state.spr;
  st.ph += 2 * Math.PI / (T * 60);
  const ctx = simCtx(), px = 160, top = 24, yc = 130, A = 34, y = yc + A * Math.cos(st.ph);
  ctx.fillStyle = '#475569'; ctx.fillRect(px - 40, top - 8, 80, 8);
  // lò xo zigzag
  ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(px, top);
  const coils = 9, seg = (y - 14 - top) / coils;
  for (let i = 0; i < coils; i++) { const yy = top + seg * (i + 0.5); ctx.lineTo(px + (i % 2 ? 13 : -13), yy); }
  ctx.lineTo(px, y - 14); ctx.stroke();
  // vật nặng
  ctx.fillStyle = '#4f46e5'; ctx.fillRect(px - 20, y - 14, 40, 30);
  ctx.strokeStyle = '#312e81'; ctx.lineWidth = 1; ctx.strokeRect(px - 20, y - 14, 40, 30);
  document.getElementById('sim-out').innerHTML =
    `Con lắc lò xo (độ cứng k = 20 N/m, khối lượng m = ${m.toFixed(1)} kg). Chu kì T = 2π·√(m/k) = <b>${T.toFixed(2)} s</b>. T tăng khi m tăng hoặc k giảm; không phụ thuộc biên độ.`;
  App.state.simRAF = requestAnimationFrame(simSpringLoop);
}

/* ============================================================
   HỌC — Bài giảng (môn → chủ đề → bài)
   ============================================================ */
function renderMarkdown(md, el) {
  try { el.innerHTML = window.marked ? marked.parse(md || '') : (md || ''); }
  catch (e) { el.textContent = md || ''; }
  if (window.renderMathInElement) {
    try {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    } catch (e) {}
  }
}

async function renderLearn() {
  const v = App.state.learn || (App.state.learn = { view: 'subjects' });
  const el = $('#screen-learn');
  if (v.view !== 'examTake') clearExamTimer();

  if (v.view === 'subjects') {
    const g = (App.state.user && App.state.user.grade) || 12;
    // Lọc theo khối lớp: môn có grade trùng lớp HS; môn không gắn grade (IELTS/TOEIC) hiện cho mọi lớp.
    const subs = Content.subjects().filter((s) => !s.grade || s.grade === g);
    el.innerHTML = `<div class="page-head"><h2>Học</h2><p>Chọn môn để xem bài giảng · Lớp ${g}</p></div>
      <button class="btn btn-ghost btn-block" style="margin-bottom:12px" onclick="switchTab('sim')">🔬 Phòng mô phỏng Lý – Hóa</button>
      ${subs.map((s) => `
        <div class="card" style="margin-bottom:10px;cursor:pointer" onclick="learnOpenSubject('${s.code}','${s.name.replace(/'/g, '')}')">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong>${s.name}</strong><span class="muted">›</span></div>
        </div>`).join('')}`;
    return;
  }

  if (v.view === 'topics') {
    const eng = Content.target(v.subjectCode);
    const topics = Content.topics(v.subjectCode);
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('subjects')">‹ Môn học</p>
        <h2>${v.subjectName}</h2><p>Chọn chủ đề</p></div>
      ${eng ? `<div class="countdown section-block" style="padding:14px">
          <div style="font-size:1.05rem;font-weight:700">🎯 Mục tiêu: ${eng}</div>
          <div class="cheer" style="margin-top:4px">Luyện đều mỗi ngày để tiến bộ vững chắc!</div></div>
        <button class="btn btn-ghost btn-block" style="margin-bottom:8px" onclick="learnOpenWriting()">✍️ Luyện Writing (AI chấm)</button>` : ''}
      <button class="btn btn-ghost btn-block" style="margin-bottom:12px" onclick="learnOpenExams()">📝 Bài kiểm tra môn ${v.subjectName}</button>
      ${topics.length
        ? topics.map((t) => `
          <div class="card" style="margin-bottom:10px;cursor:pointer" onclick="learnOpenTopic('${t.id}','${t.title.replace(/'/g, '')}')">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>${t.title}</span><span class="muted">›</span></div>
          </div>`).join('')
        : `<div class="empty">Chủ đề đang được cập nhật</div>`}`;
    return;
  }

  if (v.view === 'lessons') {
    const lessons = Content.lessons(v.subjectCode, v.topicId);
    const learned = getLearnedSet();
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('topics')">‹ ${v.subjectName}</p>
        <h2>${v.topicTitle}</h2><p>Danh sách bài giảng</p></div>
      ${lessons.length
        ? lessons.map((l) => `
          <div class="card" style="margin-bottom:10px;cursor:pointer" onclick="learnOpenLesson('${l.id}','${l.title.replace(/'/g, '')}')">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>${learned.has(l.id) ? '✅ ' : ''}${l.title}</span>
              <span class="badge-assigned">${l.level === 'NANG_CAO' ? 'Nâng cao' : (l.level === 'CHUYEN' ? 'Chuyên' : 'Cơ bản')}</span></div>
          </div>`).join('')
        : `<div class="empty">Bài giảng đang được biên soạn</div>`}`;
    return;
  }

  if (v.view === 'exams') {
    const exams = Exams.list(v.subjectCode);
    const wrongN = getWrong().length;
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('topics')">‹ ${v.subjectName}</p>
        <h2>Bài kiểm tra</h2><p>Chọn đề để làm · bấm vào đề để bắt đầu (có tính giờ)</p></div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <button class="btn btn-primary" style="flex:1" onclick="learnQuickPractice()">⚡ Luyện nhanh 15 câu</button>
        <button class="btn btn-ghost" style="flex:1" onclick="learnOpenWrong()">📕 Câu sai${wrongN ? ' (' + wrongN + ')' : ''}</button>
      </div>
      ${exams.length
        ? exams.map((e) => {
          const bs = bestScore(e.examId);
          return `
          <div class="card" style="margin-bottom:10px;cursor:pointer" onclick="learnStartExam('${e.examId}','${e.title.replace(/'/g, '')}')">
            <strong>${e.title}</strong>
            <div class="task-meta"><span class="muted">${e.questions.length} câu${e.durationMin ? ' · ' + e.durationMin + ' phút' : ''}</span>${bs != null ? ` <span class="pill pill-ok">Điểm cao nhất: ${bs}</span>` : ''}</div>
          </div>`;
        }).join('')
        : `<div class="empty">Chưa có đề kiểm tra nào</div>`}`;
    return;
  }

  if (v.view === 'examTake') {
    const exam = v.customExam || Exams.get(v.examId);
    if (!exam) { el.innerHTML = `<div class="empty">Không tìm thấy đề</div>`; return; }
    v.exam = exam;
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('exams')">‹ Bài kiểm tra</p>
        <h2>${v.examTitle}</h2></div>
      ${exam.durationMin ? '<div id="exam-timer" class="exam-timer"></div>' : ''}
      <div id="exam-body">` +
      exam.questions.map((q, i) => `
        <div class="card" style="margin-bottom:12px">
          <div class="q-stem" data-md>${i + 1}. ${q.stem}</div>
          <div style="margin-top:8px">${renderQuestionInput(q, i)}</div>
        </div>`).join('') +
      `<button class="btn btn-primary btn-block" style="margin-top:8px" onclick="learnSubmitExam()">Nộp bài</button></div>`;
    $$('#exam-body .q-stem').forEach((el2) => renderMarkdown(el2.innerHTML, el2));
    $$('#exam-body .opt-label').forEach((el2) => renderMarkdown(el2.innerHTML, el2));
    startExamTimer(exam.durationMin);
    return;
  }

  if (v.view === 'wrong') {
    const list = getWrong();
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('exams')">‹ Bài kiểm tra</p>
        <h2>📕 Sổ tay câu sai</h2><p>Ôn lại tất cả câu đã làm sai (mọi môn)</p></div>
      ${list.length ? `<button class="btn btn-ghost btn-sm" style="margin-bottom:10px" onclick="clearAllWrong()">🗑 Xóa hết</button>` : ''}
      ${list.length ? list.map((w, i) => `
        <div class="card" style="margin-bottom:10px;border-left:4px solid var(--danger)">
          <div data-md class="q-stem">${i + 1}. ${w.stem}</div>
          <div style="margin-top:6px">${(w.options || []).map((o, idx) => `<div class="opt-label" data-md style="padding:3px 0;${idx === w.answer ? 'color:var(--success);font-weight:600' : ''}">${idx === w.answer ? '✓ ' : ''}${o}</div>`).join('')}</div>
          ${w.explanation ? `<div class="muted" data-md style="margin-top:6px;font-size:0.88rem">💡 ${w.explanation}</div>` : ''}
          <button class="icon-btn" style="margin-top:6px" onclick="removeWrong(${i})" title="Đã thuộc, xóa">✓ Đã thuộc</button>
        </div>`).join('') : `<div class="empty">Chưa có câu sai nào được lưu 🎉</div>`}`;
    $$('#screen-learn [data-md]').forEach((el2) => renderMarkdown(el2.innerHTML, el2));
    return;
  }

  if (v.view === 'examResult') {
    const r = v.result;
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('exams')">‹ Bài kiểm tra</p>
        <h2>Kết quả: ${v.examTitle}</h2></div>
      <div class="countdown section-block"><div class="days">${r.score10}</div>
        <div class="label">điểm · đúng ${r.correct}/${r.gradable} câu</div></div>
      ${r.savedWrong ? `<button class="btn btn-ghost btn-block" style="margin-bottom:10px" onclick="learnOpenWrong()">📕 Đã lưu ${r.savedWrong} câu sai vào Sổ tay — ôn ngay ▸</button>` : ''}
      ${r.results.map((it, i) => `
        <div class="card" style="margin-bottom:10px;border-left:4px solid ${it.correct === true ? 'var(--success)' : (it.correct === false ? 'var(--danger)' : 'var(--warning)')}">
          <div data-md class="q-stem">${i + 1}. ${it.stem}</div>
          <div class="task-meta" style="margin-top:6px">
            ${it.correct === true ? '<span class="pill pill-ok">Đúng</span>' : (it.correct === false ? '<span class="pill pill-late">Sai</span>' : '<span class="pill pill-warn">Tự luận</span>')}
          </div>
          ${it.explanation ? `<div class="muted" data-md style="margin-top:6px;font-size:0.88rem">💡 ${it.explanation}</div>` : ''}
        </div>`).join('')}
      <button class="btn btn-primary btn-block" style="margin-top:8px" onclick="${String(v.examId).indexOf('quick-') === 0 ? 'learnQuickPractice()' : `learnStartExam('${v.examId}','${(v.examTitle || '').replace(/'/g, '')}')`}">Làm lại</button>`;
    $$('#screen-learn [data-md]').forEach((el2) => renderMarkdown(el2.innerHTML, el2));
    return;
  }

  if (v.view === 'writing') {
    const prompt = v.subjectCode === 'TOEIC'
      ? 'Viết email cho đồng nghiệp đề xuất một cuộc họp về dự án mới (50–80 từ).'
      : 'Some people believe technology makes life more complex. To what extent do you agree or disagree? (viết khoảng 150–250 từ)';
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('topics')">‹ ${v.subjectName}</p>
        <h2>Luyện Writing (AI chấm)</h2><p>🎯 ${engTarget(v.subjectCode)}</p></div>
      <div class="card section-block"><div class="section-title">Đề bài</div>
        <p id="writing-prompt">${prompt}</p></div>
      <label class="field"><span>Bài làm của bạn</span>
        <textarea id="writing-essay" rows="9" placeholder="Viết bài tại đây…"></textarea></label>
      <button class="btn btn-primary btn-block" style="margin-top:10px" onclick="learnSubmitWriting()">Gửi AI chấm</button>
      <div id="writing-feedback" class="card lesson-content hidden" style="margin-top:14px"></div>`;
    return;
  }

  if (v.view === 'lesson') {
    const lesson = Content.lesson(v.subjectCode, v.topicId, v.lessonId);
    if (!lesson) { el.innerHTML = `<div class="empty">Không tìm thấy bài học</div>`; return; }
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('lessons')">‹ ${v.topicTitle}</p>
        <h2>${lesson.title}</h2></div>
      <div class="card"><div id="lesson-content" class="lesson-content"></div></div>
      <button id="lesson-learn-btn" class="btn btn-block" style="margin-top:14px" onclick="learnToggleLearned()">…</button>

      <div class="section-block" style="margin-top:22px">
        <div class="section-title">💬 Hỏi giáo viên AI</div>
        <div class="card">
          <div id="ai-answer" class="lesson-content" style="min-height:8px"></div>
          <div style="display:flex;gap:8px;margin-top:10px">
            <input id="ai-input" class="field" style="flex:1" placeholder="Hỏi về bài học này…"
              onkeydown="if(event.key==='Enter')aiAsk()" />
            <button class="btn btn-primary btn-sm" onclick="aiAsk()">Gửi</button>
          </div>
          <p class="muted" style="font-size:0.78rem;margin-top:6px">AI chỉ gợi ý học tập, không làm hộ bài kiểm tra.</p>
        </div>
      </div>`;
    renderHtmlContent(lesson.html, $('#lesson-content'));
    updateLearnBtn(getLearnedSet().has(lesson.id));
    return;
  }
}

// Hiển thị nội dung HTML tĩnh + render công thức KaTeX
function renderHtmlContent(html, el) {
  el.innerHTML = html || '';
  if (window.renderMathInElement) {
    try {
      renderMathInElement(el, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
        throwOnError: false,
      });
    } catch (e) {}
  }
}

async function aiAsk() {
  const input = $('#ai-input');
  const q = input.value.trim();
  if (!q) return;
  const ans = $('#ai-answer');
  ans.innerHTML = '<div class="muted">Giáo viên AI đang trả lời…</div>';
  input.value = '';
  try {
    const r = await Api.call('aiChat', { message: q + ' (Bài học: ' + (App.state.learn.lessonTitle || '') + ')' });
    renderMarkdown('**Hỏi:** ' + q + '\n\n' + r.reply, ans);
  } catch (e) { ans.innerHTML = `<div class="empty">${e.message}</div>`; }
}

function openGenerateLesson() {
  const v = App.state.learn;
  openModal('Sinh nháp bài giảng (AI)', `
    <label class="field"><span>Tiêu đề bài giảng</span><input id="m-title" placeholder="VD: Cực trị của hàm số" /></label>
    <label class="field"><span>Mức độ</span><select id="m-level">
      <option value="CO_BAN">Cơ bản</option>
      <option value="NANG_CAO">Nâng cao</option>
      <option value="CHUYEN">Chuyên</option>
    </select></label>
    <p class="muted" style="font-size:0.82rem">AI sẽ tạo bản nháp (DRAFT). Bạn xem lại và bấm "Xuất bản" để hiển thị cho học sinh.</p>
    <button class="btn btn-primary btn-block" onclick="runGenerateLesson()">✨ Sinh nháp</button>`);
}
async function runGenerateLesson() {
  const v = App.state.learn;
  const title = $('#m-title').value.trim();
  if (!title) { showToast('Nhập tiêu đề', 'error'); return; }
  showLoading();
  try {
    await Api.call('generateLesson', {
      subjectCode: v.subjectCode, grade: App.state.user.grade || 12,
      topicId: v.topicId, title: title, level: $('#m-level').value,
    });
    if (App._lcache) delete App._lcache[v.topicId];
    closeModal(); renderLearn();
    showToast('Đã tạo bản nháp. Mở bài để xem & xuất bản.', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

async function learnTogglePublish(lessonId, status) {
  const next = status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  showLoading();
  try {
    await Api.call('setLessonStatus', { lessonId: lessonId, status: next });
    if (App.state.learn.lesson) App.state.learn.lesson.status = next;
    if (App._lcache) App._lcache = {}; // làm mới danh sách bài giảng
    renderLearn();
    showToast(next === 'PUBLISHED' ? 'Đã xuất bản' : 'Đã chuyển nháp', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

function updateLearnBtn(done) {
  const btn = $('#lesson-learn-btn');
  if (!btn) return;
  btn.textContent = done ? '✓ Đã học (bỏ đánh dấu)' : 'Đánh dấu đã học';
  btn.className = 'btn btn-block ' + (done ? 'btn-ghost' : 'btn-primary');
}

function learnOpenSubject(code, name) {
  App.state.learn = { view: 'topics', subjectCode: code, subjectName: name };
  renderLearn();
}
function learnOpenTopic(topicId, title) {
  Object.assign(App.state.learn, { view: 'lessons', topicId: topicId, topicTitle: title });
  renderLearn();
}
function learnOpenLesson(lessonId, title) {
  Object.assign(App.state.learn, { view: 'lesson', lessonId: lessonId, lessonTitle: title });
  renderLearn();
}
function learnBack(view) {
  App.state.learn.view = view;
  if (view === 'subjects') App.state.learn = { view: 'subjects' };
  renderLearn();
}
/* ---- Luyện thi IELTS/TOEIC ---- */
function engTarget(code) {
  if (code === 'IELTS') return 'IELTS 4.5 → 6.5';
  if (code === 'TOEIC') return 'TOEIC 450 → 650';
  return '';
}
function learnOpenWriting() {
  Object.assign(App.state.learn, { view: 'writing' });
  renderLearn();
}
async function learnSubmitWriting() {
  const v = App.state.learn;
  const essay = $('#writing-essay').value.trim();
  if (!essay) { showToast('Hãy viết bài trước', 'error'); return; }
  const fb = $('#writing-feedback');
  fb.classList.remove('hidden');
  fb.innerHTML = '<div class="muted">Giáo viên AI đang chấm bài…</div>';
  try {
    const r = await Api.call('gradeWriting', { exam: v.subjectCode, prompt: $('#writing-prompt').textContent, essay: essay });
    renderMarkdown(r.feedback, fb);
  } catch (e) { fb.innerHTML = `<div class="empty">${e.message}</div>`; }
}

/* ---- Bài kiểm tra ---- */
function learnOpenExams() {
  Object.assign(App.state.learn, { view: 'exams' });
  renderLearn();
}
function learnStartExam(examId, title) {
  Object.assign(App.state.learn, { view: 'examTake', examId: examId, examTitle: title, customExam: null });
  renderLearn();
}
function learnOpenWrong() {
  App.state.learn.view = 'wrong';
  renderLearn();
}
function learnQuickPractice() {
  const v = App.state.learn;
  const all = [];
  Exams.list(v.subjectCode).forEach((e) => (e.questions || []).forEach((q) => { if (q.options) all.push(q); }));
  if (all.length < 5) { showToast('Môn này chưa đủ câu để luyện nhanh', 'error'); return; }
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = all[i]; all[i] = all[j]; all[j] = t; }
  const n = Math.min(15, all.length);
  const picked = all.slice(0, n).map((q, i) => Object.assign({ questionId: 'quick-' + i, type: 'MCQ' }, q));
  const exam = { examId: 'quick-' + v.subjectCode, title: '⚡ Luyện nhanh — ' + v.subjectName, durationMin: Math.max(10, Math.round(n * 1.2)), questions: picked };
  Object.assign(v, { view: 'examTake', examId: exam.examId, examTitle: exam.title, customExam: exam });
  renderLearn();
}
function renderQuestionInput(q, i) {
  const name = 'q-' + q.questionId;
  if (q.type === 'TRUEFALSE') {
    return ['true', 'false'].map((val) => `
      <label style="display:block;margin:4px 0"><input type="radio" name="${name}" value="${val}" />
        ${val === 'true' ? 'Đúng' : 'Sai'}</label>`).join('');
  }
  if (q.type === 'SHORT') {
    return `<input class="field" name="${name}" placeholder="Nhập đáp án…" />`;
  }
  if (q.type === 'ESSAY') {
    return `<textarea class="field" name="${name}" rows="4" placeholder="Trả lời…"></textarea>`;
  }
  // MCQ
  return (q.options || []).map((opt, idx) => `
    <label style="display:flex;gap:8px;align-items:flex-start;margin:6px 0">
      <input type="radio" name="${name}" value="${idx}" style="margin-top:4px" />
      <span class="opt-label">${opt}</span></label>`).join('');
}
function collectAnswers(exam) {
  const answers = {};
  exam.questions.forEach((q) => {
    const name = 'q-' + q.questionId;
    const checked = document.querySelector('input[name="' + name + '"]:checked');
    if (checked) { answers[q.questionId] = checked.value; return; }
    const field = document.querySelector('[name="' + name + '"]');
    if (field && field.value != null) answers[q.questionId] = field.value;
  });
  return answers;
}
// Tự chấm tại trình duyệt (đề tĩnh) → tức thì, không gọi backend
function learnSubmitExam() {
  const v = App.state.learn;
  if (!v.exam) return;
  const answers = collectAnswers(v.exam);
  let correct = 0, gradable = 0;
  const results = v.exam.questions.map(function (q) {
    const your = answers[q.questionId];
    let ok = null;
    if (q.type === 'MCQ' || q.options) { gradable++; ok = String(your) === String(q.answer); if (ok) correct++; }
    return {
      stem: q.stem, your: your == null ? '' : your, answer: q.answer,
      explanation: q.explanation, correct: ok,
    };
  });
  const score10 = gradable ? Math.round((correct / gradable) * 100) / 10 : 0;
  v.result = { score10: score10, correct: correct, gradable: gradable, total: v.exam.questions.length, results: results };
  clearExamTimer();
  const wrongItems = v.exam.questions
    .filter((q) => (q.options) && String(answers[q.questionId]) !== String(q.answer))
    .map((q) => ({ stem: q.stem, options: q.options, answer: q.answer, explanation: q.explanation, subject: v.subjectCode || '', examTitle: v.examTitle || '' }));
  if (wrongItems.length) addWrong(wrongItems);
  v.result.savedWrong = wrongItems.length;
  saveAttempt({ examId: v.examId, title: v.examTitle || '', subject: v.subjectCode || '', score10: score10, correct: correct, gradable: gradable, total: v.exam.questions.length, date: new Date().toISOString() });
  v.view = 'examResult';
  renderLearn();
  showToast('Đã nộp bài · ' + score10 + ' điểm', 'success');
}

// "Đã học" lưu localStorage (không cần backend → tức thì)
function getLearnedSet() {
  try { return new Set(JSON.parse(localStorage.getItem('thpt_learned') || '[]')); }
  catch (e) { return new Set(); }
}
function setLearned(id, on) {
  const s = getLearnedSet();
  if (on) s.add(id); else s.delete(id);
  try { localStorage.setItem('thpt_learned', JSON.stringify([...s])); } catch (e) {}
}
function learnToggleLearned() {
  const id = App.state.learn.lessonId;
  const isDone = getLearnedSet().has(id);
  setLearned(id, !isDone);
  updateLearnBtn(!isDone);
  showToast(!isDone ? 'Đã đánh dấu học xong' : 'Đã bỏ đánh dấu', 'success');
}

/* ===== Đồng hồ làm bài thi ===== */
function clearExamTimer() {
  if (App.state.examTimer) { clearInterval(App.state.examTimer); App.state.examTimer = null; }
}
function startExamTimer(min) {
  clearExamTimer();
  if (!min) return;
  App.state.examEndsAt = Date.now() + min * 60000;
  const tick = () => {
    const el = document.getElementById('exam-timer');
    if (!el) { clearExamTimer(); return; }
    let s = Math.round((App.state.examEndsAt - Date.now()) / 1000);
    if (s <= 0) {
      el.textContent = '⏰ Hết giờ — đang nộp bài…'; el.className = 'exam-timer danger';
      clearExamTimer(); learnSubmitExam(); return;
    }
    const m = Math.floor(s / 60), ss = String(s % 60).padStart(2, '0');
    el.textContent = '⏱ ' + m + ':' + ss + ' còn lại';
    el.className = 'exam-timer' + (s <= 60 ? ' warn' : '');
  };
  tick();
  App.state.examTimer = setInterval(tick, 1000);
}

/* ===== Lịch sử làm bài & Sổ tay câu sai (localStorage) ===== */
function getAttempts() { try { return JSON.parse(localStorage.getItem('thpt_attempts') || '[]'); } catch (e) { return []; } }
function saveAttempt(a) {
  const arr = getAttempts(); arr.push(a);
  if (arr.length > 300) arr.splice(0, arr.length - 300);
  try { localStorage.setItem('thpt_attempts', JSON.stringify(arr)); } catch (e) {}
}
function bestScore(examId) {
  const s = getAttempts().filter((a) => a.examId === examId).map((a) => a.score10);
  return s.length ? Math.max.apply(null, s) : null;
}
function getWrong() { try { return JSON.parse(localStorage.getItem('thpt_wrong') || '[]'); } catch (e) { return []; } }
function saveWrongList(arr) { try { localStorage.setItem('thpt_wrong', JSON.stringify(arr.slice(-500))); } catch (e) {} }
function addWrong(items) {
  const cur = getWrong(), seen = new Set(cur.map((w) => w.stem));
  items.forEach((it) => { if (!seen.has(it.stem)) { cur.push(it); seen.add(it.stem); } });
  saveWrongList(cur);
}
function removeWrong(idx) {
  const arr = getWrong(); arr.splice(idx, 1); saveWrongList(arr);
  App.state.learn.view = 'wrong'; renderLearn();
}
function clearAllWrong() {
  if (!confirm('Xóa toàn bộ câu sai đã lưu?')) return;
  saveWrongList([]); App.state.learn.view = 'wrong'; renderLearn();
}

/* ============================================================
   GIÁO VIÊN (dữ liệu thật)
   ============================================================ */
function renderTeacher() {
  const classes = App.data.classes || [];
  if (App.state.loadingData && !classes.length) {
    $('#screen-teacher').innerHTML = `<div class="page-head"><h2>Lớp học</h2><p>Đang tải…</p></div>
      <div class="card"><div class="empty">Đang tải dữ liệu lớp…</div></div>`;
    return;
  }
  if (!classes.length) {
    $('#screen-teacher').innerHTML = `
      <div class="page-head"><h2>Lớp học</h2><p>Theo dõi tiến độ học sinh</p></div>
      <div class="card"><div class="empty">Bạn chưa phụ trách lớp nào.</div></div>
      <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="openClassModal()">+ Tạo lớp mới</button>`;
    return;
  }
  if (!App._activeClass || !classes.find((c) => c.classId === App._activeClass)) {
    App._activeClass = classes[0].classId;
  }
  const active = classes.find((c) => c.classId === App._activeClass);

  const tabs = classes.map((c) => `
    <button class="class-tab ${c.classId === App._activeClass ? 'active' : ''}" onclick="selectClass('${c.classId}')">
      ${c.name} · ${c.studentCount} HS
    </button>`).join('');

  const students = active.students || [];
  const rows = students.length ? students.map((s) => {
    const pill = s.late === 0 ? 'pill-ok' : (s.late <= 2 ? 'pill-warn' : 'pill-late');
    return `<tr><td>${s.name}</td>
      <td><div class="bar" style="width:90px"><i style="width:${s.progress}%"></i></div></td>
      <td>${s.progress}%</td><td><span class="pill ${pill}">${s.late} trễ</span></td></tr>`;
  }).join('') : `<tr><td colspan="4" class="muted" style="text-align:center">Lớp chưa có học sinh</td></tr>`;
  const avg = students.length ? Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length) : 0;

  $('#screen-teacher').innerHTML = `
    <div class="page-head"><h2>Lớp học</h2><p>Theo dõi tiến độ học sinh</p></div>
    <div class="class-tabs">${tabs}</div>
    <div class="card section-block">
      <div class="section-title">Tiến độ trung bình lớp</div>
      <div style="display:flex;align-items:center;gap:14px">
        <div class="ring" style="--val:${avg};width:64px;height:64px"><span style="width:48px;height:48px">${avg}%</span></div>
        <div class="muted">${students.length} học sinh đang theo dõi</div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Danh sách học sinh</div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Học sinh</th><th>Tiến độ</th><th>%</th><th>Nhiệm vụ</th></tr></thead>
        <tbody>${rows}</tbody></table></div>
    </div>
    <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="openAssignModal()">+ Giao việc cho lớp ${active.name}</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="openClassModal()">+ Tạo lớp mới</button>`;
}
function selectClass(cid) { App._activeClass = cid; renderTeacher(); }

function openClassModal() {
  openModal('Tạo lớp mới', `
    <label class="field"><span>Tên lớp</span><input id="m-title" placeholder="VD: 12A3" /></label>
    <button class="btn btn-primary btn-block" onclick="saveClass()">Tạo lớp</button>`);
}
async function saveClass() {
  const name = $('#m-title').value.trim();
  if (!name) { showToast('Nhập tên lớp', 'error'); return; }
  showLoading();
  try {
    const c = await Api.call('createClass', { name: name });
    await loadTeacherData();
    App._activeClass = c.classId;
    closeModal(); rerender(); showToast('Đã tạo lớp ' + name, 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

function openAssignModal() {
  const active = (App.data.classes || []).find((c) => c.classId === App._activeClass);
  if (!active) return;
  const studentOpts = ['<option value="">📋 Cả lớp (' + active.studentCount + ' HS)</option>']
    .concat((active.students || []).map((s) => `<option value="${s.userId}">${s.name}</option>`)).join('');
  openModal('Giao việc · ' + active.name, `
    <label class="field"><span>Giao cho</span><select id="m-target">${studentOpts}</select></label>
    <label class="field"><span>Nhiệm vụ</span><input id="m-title" placeholder="VD: Làm đề ôn số 3" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions('TOAN')}</select></label>
    <label class="field"><span>Hạn nộp</span><input type="date" id="m-date" value="${dayjs().add(2, 'day').format('YYYY-MM-DD')}" /></label>
    <button class="btn btn-primary btn-block" onclick="saveAssign()">Giao việc</button>`);
}
async function saveAssign() {
  const title = $('#m-title').value.trim();
  if (!title) { showToast('Nhập tên nhiệm vụ', 'error'); return; }
  const payload = {
    classId: App._activeClass,
    studentId: $('#m-target').value || undefined,
    title: title, subject: $('#m-subject').value, dueDate: $('#m-date').value,
  };
  showLoading();
  try {
    const r = await Api.call('assignTask', payload);
    await loadTeacherData(); // làm mới tiến độ/nhiệm vụ trễ
    closeModal(); rerender();
    showToast('Đã giao việc cho ' + r.assigned + ' học sinh', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

/* ============================================================
   MODAL
   ============================================================ */
function subjectOptions(sel) {
  return Object.entries(SUBJECTS).map(([k, v]) =>
    `<option value="${k}" ${k === sel ? 'selected' : ''}>${v.label}</option>`).join('');
}
function openModal(title, bodyHtml) {
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = bodyHtml;
  $('#modal').classList.remove('hidden');
}
function closeModal() { $('#modal').classList.add('hidden'); }

/* --- Kế hoạch --- */
function openPlanModal() {
  const date = dayjs().add(App.state.calDayOffset, 'day').format('YYYY-MM-DD');
  openModal('Thêm buổi học', `
    <label class="field"><span>Tên nhiệm vụ</span><input id="m-title" placeholder="VD: Giải đề Toán 2024" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions('TOAN')}</select></label>
    <label class="field"><span>Ngày</span><input type="date" id="m-date" value="${date}" /></label>
    <button class="btn btn-primary btn-block" onclick="savePlanForm()">Lưu</button>`);
}
async function savePlanForm() {
  const title = $('#m-title').value.trim();
  if (!title) { showToast('Nhập tên nhiệm vụ', 'error'); return; }
  const plan = { title: title, subject: $('#m-subject').value, dueDate: $('#m-date').value, status: 'TODO' };
  showLoading();
  try {
    const saved = await Api.call('savePlan', { plan: plan });
    App.data.plans.push(saved);
    closeModal(); rerender(); showToast('Đã thêm', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

/* --- Mục tiêu --- */
function openGoalModal(goalId) {
  const g = goalId ? App.data.goals.find((x) => x.goalId === goalId) : null;
  openModal(g ? 'Sửa mục tiêu' : 'Thêm mục tiêu', `
    <label class="field"><span>Mục tiêu</span><input id="m-title" value="${g ? g.title : ''}" placeholder="VD: Đạt 8.0 môn Toán" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions(g ? g.subject : 'TOAN')}</select></label>
    <label class="field"><span>Tiến độ: <b id="m-prog-val">${g ? g.progress : 0}</b>%</span>
      <input type="range" id="m-progress" min="0" max="100" value="${g ? g.progress : 0}" oninput="document.getElementById('m-prog-val').textContent=this.value" /></label>
    <button class="btn btn-primary btn-block" onclick="saveGoalForm('${goalId || ''}')">Lưu</button>
    ${g ? `<button class="btn btn-danger btn-block" style="margin-top:8px" onclick="removeGoal('${g.goalId}')">Xóa mục tiêu</button>` : ''}`);
}
async function saveGoalForm(goalId) {
  const title = $('#m-title').value.trim();
  if (!title) { showToast('Nhập tên mục tiêu', 'error'); return; }
  const goal = { goalId: goalId || undefined, title: title, subject: $('#m-subject').value, progress: Number($('#m-progress').value) };
  showLoading();
  try {
    const saved = await Api.call('saveGoal', { goal: goal });
    const idx = App.data.goals.findIndex((x) => x.goalId === saved.goalId);
    if (idx >= 0) App.data.goals[idx] = saved; else App.data.goals.push(saved);
    closeModal(); rerender(); showToast('Đã lưu', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}
async function removeGoal(goalId) {
  if (!confirm('Xóa mục tiêu này?')) return;
  showLoading();
  try {
    await Api.call('deleteGoal', { goalId: goalId });
    App.data.goals = App.data.goals.filter((g) => g.goalId !== goalId);
    closeModal(); rerender(); showToast('Đã xóa', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

/* --- Ghi chú --- */
function openNoteModal(noteId) {
  const n = noteId ? App.data.notes.find((x) => x.noteId === noteId) : null;
  openModal(n ? 'Sửa ghi chú' : 'Thêm ghi chú', `
    <label class="field"><span>Tiêu đề</span><input id="m-title" value="${n ? n.title : ''}" placeholder="Tiêu đề ghi chú" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions(n ? n.subject : 'TOAN')}</select></label>
    <label class="field"><span>Nội dung</span><textarea id="m-content" rows="5" placeholder="Nội dung…">${n ? n.content : ''}</textarea></label>
    <label class="field"><span>Đính kèm (jpg/png/webp/pdf, ≤10MB)</span>
      <input type="file" id="m-file" accept=".jpg,.jpeg,.png,.webp,.pdf" /></label>
    ${n && n.fileUrl ? `<a href="${n.fileUrl}" target="_blank">📎 Tài liệu đã đính kèm</a>` : ''}
    <button class="btn btn-primary btn-block" onclick="saveNoteForm('${noteId || ''}')">Lưu</button>
    ${n ? `<button class="btn btn-danger btn-block" style="margin-top:8px" onclick="removeNote('${n.noteId}')">Xóa ghi chú</button>` : ''}`);
}
async function saveNoteForm(noteId) {
  const title = $('#m-title').value.trim();
  if (!title) { showToast('Nhập tiêu đề', 'error'); return; }
  const existing = noteId ? App.data.notes.find((x) => x.noteId === noteId) : null;
  let fileUrl = existing ? (existing.fileUrl || '') : '';
  showLoading();
  try {
    const fileInput = $('#m-file');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const f = fileInput.files[0];
      if (f.size > 10 * 1024 * 1024) { showToast('File tối đa 10MB', 'error'); hideLoading(); return; }
      const b64 = await fileToBase64(f);
      const up = await Api.call('uploadFile', { filename: f.name, mimeType: f.type, dataBase64: b64 });
      fileUrl = up.fileUrl;
    }
    const note = { noteId: noteId || undefined, title: title, subject: $('#m-subject').value, content: $('#m-content').value, fileUrl: fileUrl };
    const saved = await Api.call('saveNote', { note: note });
    const idx = App.data.notes.findIndex((x) => x.noteId === saved.noteId);
    if (idx >= 0) App.data.notes[idx] = saved; else App.data.notes.unshift(saved);
    closeModal(); rerender(); showToast('Đã lưu', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}
async function removeNote(noteId) {
  if (!confirm('Xóa ghi chú này?')) return;
  showLoading();
  try {
    await Api.call('deleteNote', { noteId: noteId });
    App.data.notes = App.data.notes.filter((n) => n.noteId !== noteId);
    closeModal(); rerender(); showToast('Đã xóa', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

/* --- Ôn thi: thiết lập & thêm checklist --- */
function openExamSetup() {
  const e = App.data.exam || { examDate: '', subjects: [] };
  const checks = Object.entries(SUBJECTS).map(([k, v]) =>
    `<label style="display:inline-flex;align-items:center;gap:6px;margin:4px 10px 4px 0">
      <input type="checkbox" class="m-subj" value="${k}" ${e.subjects.indexOf(k) >= 0 ? 'checked' : ''}/> ${v.label}</label>`).join('');
  openModal('Thiết lập kỳ thi', `
    <label class="field"><span>Ngày thi</span><input type="date" id="m-date" value="${e.examDate || ''}" /></label>
    <div class="field"><span>Tổ hợp môn thi</span><div>${checks}</div></div>
    <button class="btn btn-primary btn-block" onclick="saveExamSetup()">Lưu</button>`);
}
async function saveExamSetup() {
  const date = $('#m-date').value;
  if (!date) { showToast('Chọn ngày thi', 'error'); return; }
  const subjects = $$('.m-subj').filter((c) => c.checked).map((c) => c.value);
  if (!App.data.exam) App.data.exam = { checklist: [] };
  App.data.exam.examDate = date;
  App.data.exam.subjects = subjects;
  showLoading();
  try { await saveExam(); closeModal(); rerender(); showToast('Đã lưu', 'success'); }
  catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}
function openCheckModal() {
  openModal('Thêm nội dung ôn', `
    <label class="field"><span>Nội dung</span><input id="m-title" placeholder="VD: Ôn chương Tích phân" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions('TOAN')}</select></label>
    <button class="btn btn-primary btn-block" onclick="saveCheckItem()">Thêm</button>`);
}
async function saveCheckItem() {
  const text = $('#m-title').value.trim();
  if (!text) { showToast('Nhập nội dung', 'error'); return; }
  if (!App.data.exam) App.data.exam = { examDate: '', subjects: [], checklist: [] };
  if (!App.data.exam.checklist) App.data.exam.checklist = [];
  App.data.exam.checklist.push({ subject: $('#m-subject').value, text: text, done: false });
  showLoading();
  try { await saveExam(); closeModal(); rerender(); showToast('Đã thêm', 'success'); }
  catch (e) { showToast(e.message, 'error'); }
  finally { hideLoading(); }
}

/* ============================================================
   KHỞI TẠO SỰ KIỆN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  $('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    doLogin($('#login-email').value.trim(), $('#login-password').value);
  });
  $('#register-form').addEventListener('submit', (e) => { e.preventDefault(); doRegister(); });
  $$('[data-demo]').forEach((b) => b.addEventListener('click', () => loginDemo(b.dataset.demo)));
  $('#btn-logout').addEventListener('click', logout);
  $$('.nav-item').forEach((n) => n.addEventListener('click', () => switchTab(n.dataset.tab)));
  $$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));

  // Hook test/chụp ảnh: ?role=student|teacher → đăng nhập demo nhanh
  const q = new URLSearchParams(location.search);
  const role = q.get('role');
  if (role === 'student' || role === 'teacher') {
    loginDemo(role).then(() => { const t = q.get('tab'); if (t) switchTab(t); });
    return;
  }
  // Khôi phục phiên TỨC THÌ từ cache (vào app ngay, làm mới nền)
  let savedToken = null, savedUser = null;
  try { savedToken = localStorage.getItem('thpt_token'); savedUser = localStorage.getItem('thpt_user'); } catch (e) {}
  if (savedToken && savedUser && restoreFromCache(savedToken, savedUser)) return;

  // TẠM THỜI: tự đăng nhập demo (bỏ qua trang đăng nhập)
  if (DEV_AUTO_LOGIN === 'student' || DEV_AUTO_LOGIN === 'teacher') {
    loginDemo(DEV_AUTO_LOGIN);
  }
});
