/* ============================================================
   Dữ liệu mẫu — chỉ dùng cho bản xem giao diện (UI-first).
   Khi nối Apps Script, thay bằng dữ liệu thật từ Google Sheets.
   ============================================================ */

const SUBJECTS = {
  TOAN: { label: 'Toán', color: 'var(--toan)' },
  VAN:  { label: 'Văn',  color: 'var(--van)' },
  ANH:  { label: 'Anh',  color: 'var(--anh)' },
  LY:   { label: 'Lý',   color: 'var(--ly)' },
  HOA:  { label: 'Hóa',  color: 'var(--hoa)' },
  SINH: { label: 'Sinh', color: 'var(--sinh)' },
  SU:   { label: 'Sử',   color: 'var(--su)' },
  DIA:  { label: 'Địa',  color: 'var(--dia)' },
  GDCD: { label: 'GDCD', color: 'var(--gdcd)' },
};

// ngày hôm nay theo dayjs
const _today = dayjs().format('YYYY-MM-DD');
const _plus = (n) => dayjs().add(n, 'day').format('YYYY-MM-DD');

const MOCK = {
  student: {
    userId: 'u001', name: 'Nguyễn Văn An', email: 'hocsinh@demo.com',
    role: 'STUDENT', grade: 12, className: '12A1',
  },
  teacher: {
    userId: 'u002', name: 'Cô Trần Thị Lan', email: 'giaovien@demo.com',
    role: 'TEACHER',
  },

  plans: [
    { planId: 'p1', title: 'Giải 20 câu hàm số', subject: 'TOAN', dueDate: _today, status: 'TODO', assignedBy: 'u002' },
    { planId: 'p2', title: 'Học từ vựng Unit 5', subject: 'ANH', dueDate: _today, status: 'DONE', assignedBy: '' },
    { planId: 'p3', title: 'Viết mở bài "Vợ nhặt"', subject: 'VAN', dueDate: _today, status: 'TODO', assignedBy: '' },
    { planId: 'p4', title: 'Ôn dao động điều hòa', subject: 'LY', dueDate: _plus(1), status: 'TODO', assignedBy: 'u002' },
    { planId: 'p5', title: 'Bài tập este – lipit', subject: 'HOA', dueDate: _plus(1), status: 'TODO', assignedBy: '' },
    { planId: 'p6', title: 'Đọc bài Cách mạng tháng Tám', subject: 'SU', dueDate: _plus(2), status: 'TODO', assignedBy: '' },
  ],

  goals: [
    { goalId: 'g1', subject: 'TOAN', title: 'Đạt 8.5 thi thử Toán', progress: 70 },
    { goalId: 'g2', subject: 'ANH', title: 'TOEIC 650+', progress: 45 },
    { goalId: 'g3', subject: 'VAN', title: 'Nghị luận xã hội thuần thục', progress: 60 },
    { goalId: 'g4', subject: 'LY', title: 'Chắc chương Điện xoay chiều', progress: 30 },
  ],

  exam: {
    examDate: '2026-06-26',
    subjects: ['TOAN', 'VAN', 'ANH', 'LY', 'HOA'],
    checklist: [
      { subject: 'TOAN', text: 'Hàm số & đồ thị', done: true },
      { subject: 'TOAN', text: 'Tích phân', done: false },
      { subject: 'LY', text: 'Dao động cơ', done: true },
      { subject: 'HOA', text: 'Este – Lipit', done: false },
      { subject: 'ANH', text: 'Ngữ pháp nâng cao', done: false },
    ],
  },

  notes: [
    { noteId: 'n1', subject: 'TOAN', title: 'Công thức tích phân từng phần', content: 'u·dv = uv − ∫v·du. Nhớ ưu tiên chọn u theo LIATE.', updatedAt: _today },
    { noteId: 'n2', subject: 'VAN', title: 'Dẫn chứng nghị luận', content: 'Một số dẫn chứng về nghị lực sống: Nick Vujicic, thầy Nguyễn Ngọc Ký…', updatedAt: _plus(-1) },
    { noteId: 'n3', subject: 'ANH', title: 'Phrasal verbs hay gặp', content: 'look up, get over, put off, come across…', updatedAt: _plus(-2) },
  ],

  // dữ liệu phía giáo viên
  classes: [
    { classId: 'c001', name: '12A1', studentCount: 3 },
    { classId: 'c002', name: '12A2', studentCount: 2 },
  ],
  // --- v2: học tập (demo) ---
  subjects: [
    { subjectCode: 'TOAN', name: 'Toán', grades: ['12'], category: 'BAT_BUOC', active: true },
    { subjectCode: 'LY', name: 'Vật lí', grades: ['12'], category: 'TU_CHON', active: true },
    { subjectCode: 'HOA', name: 'Hóa học', grades: ['12'], category: 'TU_CHON', active: true },
    { subjectCode: 'ANH', name: 'Tiếng Anh', grades: ['12'], category: 'BAT_BUOC', active: true },
  ],
  topics: {
    TOAN: [
      { topicId: 'tt1', subjectCode: 'TOAN', grade: 12, title: 'Ứng dụng đạo hàm & khảo sát hàm số', order: 1 },
      { topicId: 'tt2', subjectCode: 'TOAN', grade: 12, title: 'Nguyên hàm – Tích phân', order: 2 },
    ],
  },
  lessons: {
    tt1: [
      { lessonId: 'll1', topicId: 'tt1', subjectCode: 'TOAN', title: 'Tính đơn điệu của hàm số', level: 'CO_BAN',
        contentMd: '## Cốt lõi\n\nHàm số $y=f(x)$ **đồng biến** trên $K$ nếu $f\'(x)\\ge 0$ với mọi $x\\in K$.\n\n## Nâng cao\nBài toán tham số quy về $f\'(x)\\ge 0\\ \\forall x$.' },
    ],
  },

  classStudents: {
    c001: [
      { name: 'Nguyễn Văn An', progress: 72, late: 0 },
      { name: 'Trần Thị Bình', progress: 54, late: 2 },
      { name: 'Lê Hoàng Cường', progress: 38, late: 3 },
    ],
    c002: [
      { name: 'Phạm Thu Dung', progress: 81, late: 0 },
      { name: 'Võ Minh Đức', progress: 60, late: 1 },
    ],
  },
};
