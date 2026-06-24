/* ============================================================
   App logic (bản UI-first, dùng dữ liệu mẫu MOCK).
   Khi nối Apps Script: thay các hàm load* bằng callApi(...).
   ============================================================ */

const App = {
  state: { user: null, role: null, calDayOffset: 0 },
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
  _toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  return (parts[parts.length - 1][0] || '?').toUpperCase();
}

function fmtDay(d) {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const dj = dayjs(d);
  return `${days[dj.day()]}, ${dj.format('DD/MM')}`;
}

/* ============================================================
   ĐĂNG NHẬP
   ============================================================ */
function login(role) {
  showLoading();
  // Giả lập gọi backend
  setTimeout(() => {
    const user = role === 'teacher' ? MOCK.teacher : MOCK.student;
    App.state.user = user;
    App.state.role = user.role;
    hideLoading();
    enterApp();
  }, 500);
}

function enterApp() {
  $('#screen-login').classList.add('hidden');
  $('#app-shell').classList.remove('hidden');

  const u = App.state.user;
  $('#header-avatar').textContent = initials(u.name);
  $('#header-name').textContent = u.name;
  $('#header-role').textContent = u.role === 'TEACHER' ? 'Giáo viên' : ('Lớp ' + u.className);

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
  $('#app-shell').classList.add('hidden');
  $('#screen-login').classList.remove('hidden');
}

/* ============================================================
   ROUTER TAB
   ============================================================ */
function switchTab(tab) {
  $$('.screen-tab').forEach((s) => s.classList.add('hidden'));
  $('#screen-' + tab).classList.remove('hidden');
  $$('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.tab === tab));
  window.scrollTo(0, 0);

  const render = {
    today: renderToday, calendar: renderCalendar, goals: renderGoals,
    exam: renderExam, notes: renderNotes, profile: renderProfile, teacher: renderTeacher,
  }[tab];
  if (render) render();
}

/* ============================================================
   MÀN HÌNH: HÔM NAY
   ============================================================ */
function renderToday() {
  const todayStr = dayjs().format('YYYY-MM-DD');
  const todayTasks = MOCK.plans.filter((p) => p.dueDate === todayStr);
  const doneCount = todayTasks.filter((p) => p.status === 'DONE').length;

  // đếm ngược
  const dleft = dayjs(MOCK.exam.examDate).diff(dayjs(), 'day');

  const taskHtml = todayTasks.length
    ? todayTasks.map(taskRow).join('')
    : `<div class="empty">Hôm nay không có nhiệm vụ nào 🎉</div>`;

  const goalHtml = MOCK.goals.slice(0, 4).map((g) => `
    <div class="progress-item">
      <div class="ring" style="--val:${g.progress};--col:${subjectColor(g.subject)}">
        <span>${g.progress}%</span>
      </div>
      <div class="progress-item-info">
        <div class="name">${subjectLabel(g.subject)}</div>
        <div class="sub">${g.title}</div>
      </div>
    </div>`).join('');

  $('#screen-today').innerHTML = `
    <div class="page-head">
      <h2>Xin chào, ${App.state.user.name.split(' ').slice(-1)[0]} 👋</h2>
      <p>${fmtDay(dayjs())} · Đã xong ${doneCount}/${todayTasks.length} việc</p>
    </div>

    ${App.state.user.grade === 12 ? `
    <div class="countdown section-block">
      <div class="days">${dleft}</div>
      <div class="label">ngày nữa đến kỳ thi THPTQG</div>
      <div class="cheer">Mỗi ngày một chút, bạn đang tiến gần mục tiêu! 💪</div>
    </div>` : ''}

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

function toggleTask(planId) {
  const p = MOCK.plans.find((x) => x.planId === planId);
  if (!p) return;
  p.status = p.status === 'DONE' ? 'TODO' : 'DONE';
  // Khi nối backend: callApi('savePlan', {plan:p})
  const active = $$('.nav-item.active')[0]?.dataset.tab;
  if (active === 'today') renderToday();
  else if (active === 'calendar') renderCalendar();
  showToast(p.status === 'DONE' ? 'Đã hoàn thành ✔' : 'Đã bỏ đánh dấu', 'success');
}

/* ============================================================
   MÀN HÌNH: LỊCH
   ============================================================ */
function renderCalendar() {
  const day = dayjs().add(App.state.calDayOffset, 'day');
  const dayStr = day.format('YYYY-MM-DD');
  const items = MOCK.plans.filter((p) => p.dueDate === dayStr);

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
      </div>`).join('')
    : `<div class="empty">Không có buổi học nào trong ngày này</div>`;

  $('#screen-calendar').innerHTML = `
    <div class="page-head"><h2>Lịch học</h2><p>Kế hoạch theo ngày</p></div>
    <div class="day-switch">
      <button class="icon-btn" onclick="shiftDay(-1)">‹</button>
      <div style="text-align:center">
        <div class="day-label">${fmtDay(day)}</div>
        <div class="day-sub">${App.state.calDayOffset === 0 ? 'Hôm nay' : (App.state.calDayOffset === 1 ? 'Ngày mai' : '')}</div>
      </div>
      <button class="icon-btn" onclick="shiftDay(1)">›</button>
    </div>
    <div class="card">${list}</div>
    <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="openPlanModal()">+ Thêm buổi học</button>`;
}

function shiftDay(d) { App.state.calDayOffset += d; renderCalendar(); }

/* ============================================================
   MÀN HÌNH: MỤC TIÊU
   ============================================================ */
function renderGoals() {
  const cards = MOCK.goals.map((g) => `
    <div class="card goal-card">
      <div class="goal-top">
        <div>${subjectBadge(g.subject)} <span class="goal-title">${g.title}</span></div>
        <span class="goal-pct" style="color:${subjectColor(g.subject)}">${g.progress}%</span>
      </div>
      <div class="bar"><i style="width:${g.progress}%;background:${subjectColor(g.subject)}"></i></div>
    </div>`).join('');

  $('#screen-goals').innerHTML = `
    <div class="page-head"><h2>Mục tiêu</h2><p>Theo dõi tiến độ từng môn</p></div>
    ${cards}
    <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="openGoalModal()">+ Thêm mục tiêu</button>`;
}

/* ============================================================
   MÀN HÌNH: ÔN THI
   ============================================================ */
function renderExam() {
  const e = MOCK.exam;
  const dleft = dayjs(e.examDate).diff(dayjs(), 'day');
  const subj = e.subjects.map(subjectBadge).join(' ');
  const checklist = e.checklist.map((c, i) => `
    <div class="task">
      <button class="task-check ${c.done ? 'done' : ''}" onclick="toggleCheck(${i})">${c.done ? '✓' : ''}</button>
      <div class="task-body">
        <div class="task-title ${c.done ? 'muted' : ''}">${c.text}</div>
        <div class="task-meta">${subjectBadge(c.subject)}</div>
      </div>
    </div>`).join('');

  $('#screen-exam').innerHTML = `
    <div class="page-head"><h2>Ôn thi THPTQG</h2><p>Lộ trình & nội dung ôn tập</p></div>
    <div class="countdown section-block">
      <div class="days">${dleft}</div>
      <div class="label">ngày nữa đến kỳ thi · ${dayjs(e.examDate).format('DD/MM/YYYY')}</div>
      <div class="cheer">Bạn làm được! Giữ vững nhịp ôn tập nhé 🌟</div>
    </div>
    <div class="section-block">
      <div class="section-title">Tổ hợp môn thi</div>
      <div class="card">${subj}</div>
    </div>
    <div class="section-block">
      <div class="section-title">Checklist nội dung ôn</div>
      <div class="card">${checklist}</div>
    </div>`;
}

function toggleCheck(i) {
  MOCK.exam.checklist[i].done = !MOCK.exam.checklist[i].done;
  renderExam();
}

/* ============================================================
   MÀN HÌNH: GHI CHÚ
   ============================================================ */
function renderNotes() {
  const cards = MOCK.notes.map((n) => `
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div>${subjectBadge(n.subject)} <strong>${n.title}</strong></div>
        <span class="task-time">${dayjs(n.updatedAt).format('DD/MM')}</span>
      </div>
      <div class="muted" style="font-size:0.9rem">${n.content}</div>
    </div>`).join('');

  $('#screen-notes').innerHTML = `
    <div class="page-head"><h2>Ghi chú</h2><p>Lưu lại kiến thức quan trọng</p></div>
    <label class="field" style="margin-bottom:14px">
      <input type="search" placeholder="🔍 Tìm ghi chú…" oninput="filterNotes(this.value)" />
    </label>
    <div id="notes-list">${cards}</div>
    <button class="btn btn-primary btn-block" style="margin-top:8px" onclick="openNoteModal()">+ Thêm ghi chú</button>`;
}

function filterNotes(q) {
  q = q.toLowerCase();
  const filtered = MOCK.notes.filter((n) =>
    n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || subjectLabel(n.subject).toLowerCase().includes(q));
  $('#notes-list').innerHTML = filtered.length
    ? filtered.map((n) => `
      <div class="card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div>${subjectBadge(n.subject)} <strong>${n.title}</strong></div>
          <span class="task-time">${dayjs(n.updatedAt).format('DD/MM')}</span>
        </div>
        <div class="muted" style="font-size:0.9rem">${n.content}</div>
      </div>`).join('')
    : `<div class="empty">Không tìm thấy ghi chú phù hợp</div>`;
}

/* ============================================================
   MÀN HÌNH: CÁ NHÂN
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
      ${u.role === 'STUDENT' ? `
        <div class="profile-row"><span class="k">Khối</span><span>Lớp ${u.grade}</span></div>
        <div class="profile-row"><span class="k">Lớp</span><span>${u.className}</span></div>` : ''}
    </div>
    <button class="btn btn-danger btn-block" style="margin-top:16px" onclick="logout()">Đăng xuất</button>`;
}

/* ============================================================
   MÀN HÌNH: GIÁO VIÊN
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
    return `<tr>
      <td>${s.name}</td>
      <td><div class="bar" style="width:90px"><i style="width:${s.progress}%"></i></div></td>
      <td>${s.progress}%</td>
      <td><span class="pill ${pill}">${s.late} trễ</span></td>
    </tr>`;
  }).join('');

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
      <div class="table-wrap">
        <table class="data">
          <thead><tr><th>Học sinh</th><th>Tiến độ</th><th>%</th><th>Nhiệm vụ</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
    <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="openAssignModal()">+ Giao việc cho lớp</button>`;
}

function selectClass(cid) { App._activeClass = cid; renderTeacher(); }

/* ============================================================
   MODAL (mẫu — chưa lưu thật)
   ============================================================ */
function subjectOptions() {
  return Object.entries(SUBJECTS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
}
function openModal(title, bodyHtml) {
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = bodyHtml;
  $('#modal').classList.remove('hidden');
}
function closeModal() { $('#modal').classList.add('hidden'); }

function openPlanModal() {
  openModal('Thêm buổi học', `
    <label class="field"><span>Tên nhiệm vụ</span><input id="m-title" placeholder="VD: Giải đề Toán 2024" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions()}</select></label>
    <label class="field"><span>Ngày</span><input type="date" id="m-date" value="${dayjs().format('YYYY-MM-DD')}" /></label>
    <button class="btn btn-primary btn-block" onclick="saveMock('Đã thêm buổi học (demo)')">Lưu</button>`);
}
function openGoalModal() {
  openModal('Thêm mục tiêu', `
    <label class="field"><span>Mục tiêu</span><input id="m-title" placeholder="VD: Đạt 8.0 môn Toán" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions()}</select></label>
    <button class="btn btn-primary btn-block" onclick="saveMock('Đã thêm mục tiêu (demo)')">Lưu</button>`);
}
function openNoteModal() {
  openModal('Thêm ghi chú', `
    <label class="field"><span>Tiêu đề</span><input id="m-title" placeholder="Tiêu đề ghi chú" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions()}</select></label>
    <label class="field"><span>Nội dung</span><textarea id="m-content" rows="4" placeholder="Nội dung…"></textarea></label>
    <button class="btn btn-primary btn-block" onclick="saveMock('Đã thêm ghi chú (demo)')">Lưu</button>`);
}
function openAssignModal() {
  openModal('Giao việc cho lớp', `
    <label class="field"><span>Nhiệm vụ</span><input id="m-title" placeholder="VD: Làm đề ôn số 3" /></label>
    <label class="field"><span>Môn học</span><select id="m-subject">${subjectOptions()}</select></label>
    <label class="field"><span>Hạn nộp</span><input type="date" id="m-date" value="${dayjs().add(2,'day').format('YYYY-MM-DD')}" /></label>
    <button class="btn btn-primary btn-block" onclick="saveMock('Đã giao việc cho lớp (demo)')">Giao việc</button>`);
}
function saveMock(msg) { closeModal(); showToast(msg, 'success'); }

/* ============================================================
   KHỞI TẠO SỰ KIỆN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  $('#login-form').addEventListener('submit', (e) => { e.preventDefault(); login('student'); });
  $$('[data-demo]').forEach((b) => b.addEventListener('click', () => login(b.dataset.demo)));
  $('#btn-logout').addEventListener('click', logout);
  $$('.nav-item').forEach((n) => n.addEventListener('click', () => switchTab(n.dataset.tab)));
  $$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));

  // Hook chụp ảnh/test nhanh: ?role=student&tab=today (bỏ qua đăng nhập)
  const q = new URLSearchParams(location.search);
  const role = q.get('role');
  if (role === 'student' || role === 'teacher') {
    const user = role === 'teacher' ? MOCK.teacher : MOCK.student;
    App.state.user = user; App.state.role = user.role;
    enterApp();
    const tab = q.get('tab');
    if (tab) switchTab(tab);
  }
});
