/* ============================================================
   App logic — nạp/lưu dữ liệu thật qua Api.call (Apps Script).
   Nếu CONFIG.WEB_APP_URL trống, Api tự dùng MockApi (xem api.js).
   ============================================================ */

const App = {
  state: { user: null, role: null, token: null, calDayOffset: 0, tab: 'today' },
  data: { plans: [], goals: [], exam: null, notes: [] },
};

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

/* ============================================================
   ĐĂNG NHẬP & NẠP DỮ LIỆU
   ============================================================ */
async function doLogin(email, password) {
  if (!email || !password) { showToast('Nhập email và mật khẩu', 'error'); return; }
  showLoading();
  try {
    const data = await Api.call('login', { email: email, password: password });
    App.state.token = data.token;
    App.state.user = data.user;
    App.state.role = data.user.role;
    try { localStorage.setItem('thpt_token', data.token); } catch (e) {}
    if (data.user.role === 'STUDENT') await loadStudentData();
    enterApp();
  } catch (e) {
    showToast(e.message || 'Đăng nhập thất bại', 'error');
  } finally {
    hideLoading();
  }
}

function loginDemo(role) {
  // Dùng mật khẩu của tài khoản demo đã seed (MockApi bỏ qua mật khẩu).
  const u = role === 'teacher' ? MOCK.teacher : MOCK.student;
  return doLogin(u.email, '123456');
}

async function loadStudentData() {
  const d = await Api.call('getStudentData', {});
  App.data.plans = d.plans || [];
  App.data.goals = d.goals || [];
  App.data.exam = d.exam || null;
  App.data.notes = d.notes || [];
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
  App.data = { plans: [], goals: [], exam: null, notes: [] };
  try { localStorage.removeItem('thpt_token'); } catch (e) {}
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
    today: renderToday, calendar: renderCalendar, goals: renderGoals,
    exam: renderExam, notes: renderNotes, profile: renderProfile, teacher: renderTeacher,
  }[App.state.tab];
  if (render) render();
}

/* ============================================================
   HÔM NAY
   ============================================================ */
function renderToday() {
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
    <button class="btn btn-danger btn-block" style="margin-top:16px" onclick="logout()">Đăng xuất</button>`;
}

/* ============================================================
   GIÁO VIÊN (tạm dùng dữ liệu mẫu — sẽ nối thật ở Prompt 4.x)
   ============================================================ */
function renderTeacher() {
  if (!App._activeClass) App._activeClass = MOCK.classes[0].classId;
  const tabs = MOCK.classes.map((c) => `
    <button class="class-tab ${c.classId === App._activeClass ? 'active' : ''}" onclick="selectClass('${c.classId}')">
      ${c.name} · ${c.studentCount} HS
    </button>`).join('');
  const students = MOCK.classStudents[App._activeClass] || [];
  const rows = students.map((s) => {
    const pill = s.late === 0 ? 'pill-ok' : (s.late <= 2 ? 'pill-warn' : 'pill-late');
    return `<tr><td>${s.name}</td>
      <td><div class="bar" style="width:90px"><i style="width:${s.progress}%"></i></div></td>
      <td>${s.progress}%</td><td><span class="pill ${pill}">${s.late} trễ</span></td></tr>`;
  }).join('');
  const avg = students.length ? Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length) : 0;

  $('#screen-teacher').innerHTML = `
    <div class="page-head"><h2>Lớp học</h2><p>Theo dõi tiến độ học sinh <span class="badge-assigned">demo</span></p></div>
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
    </div>`;
}
function selectClass(cid) { App._activeClass = cid; renderTeacher(); }

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
    <button class="btn btn-primary btn-block" onclick="saveNoteForm('${noteId || ''}')">Lưu</button>
    ${n ? `<button class="btn btn-danger btn-block" style="margin-top:8px" onclick="removeNote('${n.noteId}')">Xóa ghi chú</button>` : ''}`);
}
async function saveNoteForm(noteId) {
  const title = $('#m-title').value.trim();
  if (!title) { showToast('Nhập tiêu đề', 'error'); return; }
  const note = { noteId: noteId || undefined, title: title, subject: $('#m-subject').value, content: $('#m-content').value };
  showLoading();
  try {
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
  $$('[data-demo]').forEach((b) => b.addEventListener('click', () => loginDemo(b.dataset.demo)));
  $('#btn-logout').addEventListener('click', logout);
  $$('.nav-item').forEach((n) => n.addEventListener('click', () => switchTab(n.dataset.tab)));
  $$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));

  // Hook test/chụp ảnh: ?role=student|teacher → đăng nhập demo nhanh
  const q = new URLSearchParams(location.search);
  const role = q.get('role');
  if (role === 'student' || role === 'teacher') {
    loginDemo(role).then(() => { const t = q.get('tab'); if (t) switchTab(t); });
  }
});
