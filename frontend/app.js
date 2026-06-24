/* ============================================================
   App logic — nạp/lưu dữ liệu thật qua Api.call (Apps Script).
   Nếu CONFIG.WEB_APP_URL trống, Api tự dùng MockApi (xem api.js).
   ============================================================ */

const App = {
  state: { user: null, role: null, token: null, calDayOffset: 0, tab: 'today' },
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
    switchTab('today');
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
  App.state.tab = tab;
  $$('.screen-tab').forEach((s) => s.classList.add('hidden'));
  $('#screen-' + tab).classList.remove('hidden');
  $$('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.tab === tab));
  window.scrollTo(0, 0);
  rerender();
}

function rerender() {
  const render = {
    today: renderToday, learn: renderLearn, calendar: renderCalendar, goals: renderGoals,
    exam: renderExam, notes: renderNotes, profile: renderProfile, teacher: renderTeacher,
  }[App.state.tab];
  if (render) render();
}

/* ============================================================
   HÔM NAY
   ============================================================ */
function renderToday() {
  if (App.state.loadingData && !App.data.plans.length && !App.data.goals.length && !App.data.exam) {
    $('#screen-today').innerHTML = `<div class="page-head"><h2>Xin chào 👋</h2><p>Đang tải dữ liệu…</p></div>
      <div class="card"><div class="empty">Đang tải…</div></div>`;
    return;
  }
  const todayStr = dayjs().format('YYYY-MM-DD');
  const todayTasks = App.data.plans.filter((p) => p.dueDate === todayStr);
  const doneCount = todayTasks.filter((p) => p.status === 'DONE').length;

  const taskHtml = todayTasks.length
    ? todayTasks.map(taskRow).join('')
    : `<div class="empty">Hôm nay không có nhiệm vụ nào 🎉</div>`;

  const goals = App.data.goals.slice(0, 4);
  const goalHtml = goals.length ? goals.map((g) => `
    <div class="progress-item">
      <div class="ring" style="--val:${g.progress};--col:${subjectColor(g.subject)}"><span>${g.progress}%</span></div>
      <div class="progress-item-info">
        <div class="name">${subjectLabel(g.subject)}</div>
        <div class="sub">${g.title}</div>
      </div>
    </div>`).join('') : `<div class="empty">Chưa có mục tiêu nào</div>`;

  let countdownHtml = '';
  if (App.data.exam && App.data.exam.examDate) {
    const dleft = daysLeft(App.data.exam.examDate);
    countdownHtml = `
      <div class="countdown section-block">
        <div class="days">${dleft}</div>
        <div class="label">ngày nữa đến kỳ thi THPTQG</div>
        <div class="cheer">Mỗi ngày một chút, bạn đang tiến gần mục tiêu! 💪</div>
      </div>`;
  }

  $('#screen-today').innerHTML = `
    <div class="page-head">
      <h2>Xin chào, ${String(App.state.user.name).split(' ').slice(-1)[0]} 👋</h2>
      <p>${fmtDay(dayjs())} · Đã xong ${doneCount}/${todayTasks.length} việc</p>
    </div>
    ${countdownHtml}
    <div class="section-block">
      <div class="section-title">Việc cần làm hôm nay
        <span class="link" onclick="switchTab('calendar')">Xem lịch →</span></div>
      <div class="card">${taskHtml}</div>
    </div>
    <div class="section-block">
      <div class="section-title">Tiến độ mục tiêu
        <span class="link" onclick="switchTab('goals')">Tất cả →</span></div>
      <div class="card"><div class="progress-grid">${goalHtml}</div></div>
    </div>`;
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
      ${u.role === 'STUDENT' ? `<div class="profile-row"><span class="k">Khối</span><span>Lớp ${u.grade || 12}</span></div>` : ''}
    </div>
    <button class="btn btn-ghost btn-block" style="margin-top:16px" onclick="openPasswordModal()">Đổi mật khẩu</button>
    <button class="btn btn-danger btn-block" style="margin-top:8px" onclick="logout()">Đăng xuất</button>`;
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

  if (v.view === 'subjects') {
    const subs = Content.subjects();
    el.innerHTML = `<div class="page-head"><h2>Học</h2><p>Chọn môn để xem bài giảng</p></div>
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
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('topics')">‹ ${v.subjectName}</p>
        <h2>Bài kiểm tra</h2><p>Chọn đề để làm</p></div>
      ${exams.length
        ? exams.map((e) => `
          <div class="card" style="margin-bottom:10px;cursor:pointer" onclick="learnStartExam('${e.examId}','${e.title.replace(/'/g, '')}')">
            <strong>${e.title}</strong>
            <div class="task-meta"><span class="muted">${e.questions.length} câu${e.durationMin ? ' · ' + e.durationMin + ' phút' : ''}</span></div>
          </div>`).join('')
        : `<div class="empty">Chưa có đề kiểm tra nào</div>`}`;
    return;
  }

  if (v.view === 'examTake') {
    const exam = Exams.get(v.examId);
    if (!exam) { el.innerHTML = `<div class="empty">Không tìm thấy đề</div>`; return; }
    v.exam = exam;
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('exams')">‹ Bài kiểm tra</p>
        <h2>${v.examTitle}</h2></div>
      <div id="exam-body">` +
      exam.questions.map((q, i) => `
        <div class="card" style="margin-bottom:12px">
          <div class="q-stem" data-md>${i + 1}. ${q.stem}</div>
          <div style="margin-top:8px">${renderQuestionInput(q, i)}</div>
        </div>`).join('') +
      `<button class="btn btn-primary btn-block" style="margin-top:8px" onclick="learnSubmitExam()">Nộp bài</button></div>`;
    $$('#exam-body .q-stem').forEach((el2) => renderMarkdown(el2.innerHTML, el2));
    $$('#exam-body .opt-label').forEach((el2) => renderMarkdown(el2.innerHTML, el2));
    return;
  }

  if (v.view === 'examResult') {
    const r = v.result;
    el.innerHTML = `<div class="page-head">
        <p class="link" onclick="learnBack('exams')">‹ Bài kiểm tra</p>
        <h2>Kết quả: ${v.examTitle}</h2></div>
      <div class="countdown section-block"><div class="days">${r.score10}</div>
        <div class="label">điểm · đúng ${r.correct}/${r.gradable} câu</div></div>
      ${r.results.map((it, i) => `
        <div class="card" style="margin-bottom:10px;border-left:4px solid ${it.correct === true ? 'var(--success)' : (it.correct === false ? 'var(--danger)' : 'var(--warning)')}">
          <div data-md class="q-stem">${i + 1}. ${it.stem}</div>
          <div class="task-meta" style="margin-top:6px">
            ${it.correct === true ? '<span class="pill pill-ok">Đúng</span>' : (it.correct === false ? '<span class="pill pill-late">Sai</span>' : '<span class="pill pill-warn">Tự luận</span>')}
          </div>
          ${it.explanation ? `<div class="muted" data-md style="margin-top:6px;font-size:0.88rem">💡 ${it.explanation}</div>` : ''}
        </div>`).join('')}
      <button class="btn btn-primary btn-block" style="margin-top:8px" onclick="learnStartExam('${v.examId}','${(v.examTitle || '').replace(/'/g, '')}')">Làm lại</button>`;
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
  Object.assign(App.state.learn, { view: 'examTake', examId: examId, examTitle: title });
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
