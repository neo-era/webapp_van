/**
 * Setup.gs — Khởi tạo database & seed dữ liệu demo.
 *
 * - ensureSheets() (trong Utils.gs) tự tạo tab + header.
 * - seedIfEmpty() tự thêm dữ liệu demo nếu sheet Users đang rỗng.
 * Cả hai được gọi tự động ở đầu mỗi request (route trong Code.gs),
 * nên không cần chạy tay — lần gọi đầu tiên tới Web App sẽ tự khởi tạo.
 */

// Tài khoản demo (đổi mật khẩu sau khi dùng thật).
const DEMO_PASSWORD = '123456';

/** Seed 1 giáo viên, 1 lớp, 3 học sinh + vài kế hoạch/mục tiêu nếu DB trống. */
function seedIfEmpty() {
  if (getRows('Users').length > 0) return; // đã có dữ liệu → bỏ qua

  const hash = sha256(DEMO_PASSWORD, SALT);
  const t = now();

  // Giáo viên
  const teacherId = genId('u');
  appendRow('Users', {
    userId: teacherId, email: 'giaovien@demo.com', passwordHash: hash,
    name: 'Cô Trần Thị Lan', role: 'TEACHER', grade: '', classId: '', createdAt: t,
  });

  // Lớp
  const classId = genId('c');
  appendRow('Classes', { classId: classId, name: '12A1', teacherId: teacherId, createdAt: t });

  // Học sinh
  const students = [
    { name: 'Nguyễn Văn An', email: 'hocsinh@demo.com' },
    { name: 'Trần Thị Bình', email: 'binh@demo.com' },
    { name: 'Lê Hoàng Cường', email: 'cuong@demo.com' },
  ];
  const ids = students.map(function (s) {
    const id = genId('u');
    appendRow('Users', {
      userId: id, email: s.email, passwordHash: hash, name: s.name,
      role: 'STUDENT', grade: 12, classId: classId, createdAt: t,
    });
    return id;
  });
  const anId = ids[0];

  // Vài kế hoạch cho An (1 do giáo viên giao)
  const today = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  const plans = [
    { title: 'Giải 20 câu hàm số', subject: 'TOAN', status: 'TODO', assignedBy: teacherId },
    { title: 'Học từ vựng Unit 5', subject: 'ANH', status: 'DONE', assignedBy: '' },
    { title: 'Viết mở bài "Vợ nhặt"', subject: 'VAN', status: 'TODO', assignedBy: '' },
  ];
  plans.forEach(function (p) {
    appendRow('Plans', {
      planId: genId('p'), studentId: anId, title: p.title, subject: p.subject,
      description: '', dueDate: today, status: p.status, assignedBy: p.assignedBy, createdAt: t,
    });
  });

  // Mục tiêu cho An
  const goals = [
    { subject: 'TOAN', title: 'Đạt 8.5 thi thử Toán', progress: 70 },
    { subject: 'ANH', title: 'TOEIC 650+', progress: 45 },
  ];
  goals.forEach(function (g) {
    appendRow('Goals', {
      goalId: genId('g'), studentId: anId, subject: g.subject, title: g.title,
      targetValue: '', progress: g.progress, deadline: '', createdAt: t,
    });
  });

  // Kế hoạch ôn thi cho An (kèm checklist nội dung ôn)
  const checklist = [
    { subject: 'TOAN', text: 'Hàm số & đồ thị', done: true },
    { subject: 'TOAN', text: 'Tích phân', done: false },
    { subject: 'LY', text: 'Dao động cơ', done: true },
    { subject: 'HOA', text: 'Este – Lipit', done: false },
    { subject: 'ANH', text: 'Ngữ pháp nâng cao', done: false },
  ];
  appendRow('ExamPlans', {
    studentId: anId, examDate: '2026-06-26', subjects: 'TOAN,VAN,ANH,LY,HOA',
    milestones: JSON.stringify(checklist),
  });

  // Ghi chú mẫu cho An
  appendRow('Notes', {
    noteId: genId('n'), studentId: anId, subject: 'TOAN',
    title: 'Công thức tích phân từng phần',
    content: 'u·dv = uv − ∫v·du. Ưu tiên chọn u theo quy tắc LIATE.',
    fileUrl: '', createdAt: t, updatedAt: t,
  });
}

/** Có thể chạy tay từ trình Apps Script nếu muốn khởi tạo ngay. */
function initDatabase() {
  ensureSheets();
  seedIfEmpty();
  Logger.log('Khởi tạo xong. Users: ' + getRows('Users').length);
}
