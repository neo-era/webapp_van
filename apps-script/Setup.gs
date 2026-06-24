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

/** Seed danh mục môn + chủ đề + vài bài giảng mẫu (nếu Subjects rỗng). */
function seedCatalogIfEmpty() {
  if (getRows('Subjects').length > 0) return;
  const t = now();

  // Môn lớp 12 (MVP)
  const subjects = [
    { subjectCode: 'TOAN', name: 'Toán', category: 'BAT_BUOC' },
    { subjectCode: 'LY', name: 'Vật lí', category: 'TU_CHON' },
    { subjectCode: 'HOA', name: 'Hóa học', category: 'TU_CHON' },
    { subjectCode: 'ANH', name: 'Tiếng Anh', category: 'BAT_BUOC' },
  ];
  subjects.forEach(function (s) {
    appendRow('Subjects', { subjectCode: s.subjectCode, name: s.name, grades: '12', category: s.category, active: 'TRUE' });
  });

  // Vài chương mẫu mỗi môn
  const chapters = {
    TOAN: ['Ứng dụng đạo hàm & khảo sát hàm số', 'Nguyên hàm – Tích phân', 'Số phức'],
    LY: ['Dao động cơ', 'Sóng cơ', 'Dòng điện xoay chiều'],
    HOA: ['Este – Lipit', 'Amin – Amino axit – Protein', 'Đại cương kim loại'],
    ANH: ['Tenses & Verb forms', 'Reading skills', 'Writing skills'],
  };
  const topicIdByTitle = {};
  Object.keys(chapters).forEach(function (code) {
    chapters[code].forEach(function (title, i) {
      const id = genId('t');
      appendRow('Topics', { topicId: id, subjectCode: code, grade: 12, parentId: '', title: title, order: i + 1 });
      topicIdByTitle[code + '|' + title] = id;
    });
  });

  // Bài giảng mẫu (đã xuất bản) cho Toán 12 — chương đầu
  const toanTopic = topicIdByTitle['TOAN|Ứng dụng đạo hàm & khảo sát hàm số'];
  appendRow('Lessons', {
    lessonId: genId('l'), subjectCode: 'TOAN', grade: 12, topicId: toanTopic,
    title: 'Tính đơn điệu của hàm số', level: 'CO_BAN', skill: '',
    contentMd: [
      '## Cốt lõi',
      '',
      'Hàm số $y=f(x)$ **đồng biến** trên khoảng $K$ nếu $f\'(x) \\ge 0$ với mọi $x \\in K$ (dấu bằng tại hữu hạn điểm).',
      '',
      '- $f\'(x) > 0$ trên $K$ ⇒ hàm số đồng biến trên $K$.',
      '- $f\'(x) < 0$ trên $K$ ⇒ hàm số nghịch biến trên $K$.',
      '',
      '### Các bước xét tính đơn điệu',
      '1. Tìm tập xác định.',
      '2. Tính $f\'(x)$, tìm nghiệm và điểm $f\'(x)$ không xác định.',
      '3. Lập bảng biến thiên, kết luận.',
      '',
      '## Nâng cao',
      'Bài toán tham số $m$: tìm $m$ để hàm số đồng biến trên $\\mathbb{R}$ thường quy về điều kiện $f\'(x) \\ge 0\\ \\forall x$ (xét $\\Delta \\le 0$ và hệ số dẫn đầu).',
    ].join('\n'),
    order: 1, status: 'PUBLISHED', source: 'MANUAL', createdBy: 'seed', updatedAt: t,
  });
}

/** Seed vài câu hỏi + 1 đề mẫu cho Toán 12 (nếu Questions rỗng). */
function seedQuestionsIfEmpty() {
  if (getRows('Questions').length > 0) return;
  const toanTopic = getRows('Topics').find(function (t) { return String(t.subjectCode) === 'TOAN'; });
  if (!toanTopic) return;
  const tid = toanTopic.topicId;

  const qs = [
    { stem: 'Hàm số $y=x^3-3x$ đồng biến trên khoảng nào?', options: ['$(-1;1)$', '$(-\\infty;-1)$ và $(1;+\\infty)$', '$(0;+\\infty)$', '$\\mathbb{R}$'], answer: 1, difficulty: 'TH', explanation: '$y\'=3x^2-3>0 \\Leftrightarrow x<-1$ hoặc $x>1$.' },
    { stem: 'Đạo hàm của $y=\\ln x$ là?', options: ['$\\dfrac{1}{x}$', '$x$', '$\\dfrac{1}{x^2}$', '$\\ln x$'], answer: 0, difficulty: 'NB', explanation: '$(\\ln x)\'=\\dfrac{1}{x}$.' },
    { stem: 'Số nghiệm của phương trình $x^2-5x+6=0$ là?', options: ['0', '1', '2', '3'], answer: 2, difficulty: 'NB', explanation: '$x=2$ hoặc $x=3$.' },
  ];
  const ids = qs.map(function (q) {
    const id = genId('q');
    appendRow('Questions', {
      questionId: id, subjectCode: 'TOAN', grade: 12, topicId: tid, type: 'MCQ',
      difficulty: q.difficulty, level: 'CO_BAN', stem: q.stem, options: JSON.stringify(q.options),
      answer: String(q.answer), explanation: q.explanation, status: 'PUBLISHED', source: 'MANUAL',
    });
    return id;
  });

  appendRow('Exams', {
    examId: genId('e'), title: 'Kiểm tra nhanh: Đạo hàm & Hàm số', subjectCode: 'TOAN', grade: 12,
    kind: 'PRACTICE', questionIds: JSON.stringify(ids), durationMin: 15, level: 'CO_BAN', published: 'TRUE',
  });
}

/** Seed nội dung luyện thi IELTS & TOEIC (nếu chưa có môn IELTS). */
function seedEnglishIfEmpty() {
  if (getRows('Subjects').some(function (s) { return String(s.subjectCode) === 'IELTS'; })) return;
  const t = now();

  appendRow('Subjects', { subjectCode: 'IELTS', name: 'Luyện thi IELTS', grades: '10,11,12', category: 'TU_CHON', active: 'TRUE' });
  appendRow('Subjects', { subjectCode: 'TOEIC', name: 'Luyện thi TOEIC', grades: '10,11,12', category: 'TU_CHON', active: 'TRUE' });

  function topic(code, title, order) {
    const id = genId('t');
    appendRow('Topics', { topicId: id, subjectCode: code, grade: 12, parentId: '', title: title, order: order });
    return id;
  }
  topic('IELTS', 'Listening', 1);
  const iR = topic('IELTS', 'Reading', 2);
  topic('IELTS', 'Writing', 3);
  topic('IELTS', 'Speaking', 4);
  topic('TOEIC', 'Listening (Part 1-4)', 1);
  const tR = topic('TOEIC', 'Reading (Part 5-7)', 2);

  appendRow('Lessons', {
    lessonId: genId('l'), subjectCode: 'IELTS', grade: 12, topicId: iR, title: 'Kỹ thuật Skimming & Scanning',
    level: 'CO_BAN', skill: 'Reading',
    contentMd: '## Cốt lõi\n- **Skimming**: đọc lướt để nắm ý chính của đoạn.\n- **Scanning**: dò nhanh tìm thông tin cụ thể (số liệu, tên riêng).\n\n## Nâng cao\nPhân bổ ~20 phút/passage; đọc câu hỏi trước, gạch từ khóa.',
    order: 1, status: 'PUBLISHED', source: 'MANUAL', createdBy: 'seed', updatedAt: t,
  });
  appendRow('Lessons', {
    lessonId: genId('l'), subjectCode: 'TOEIC', grade: 12, topicId: tR, title: 'Part 5: Ngữ pháp & từ vựng',
    level: 'CO_BAN', skill: 'Reading',
    contentMd: '## Cốt lõi\nXác định **loại từ** cần điền (danh/động/tính/trạng từ) dựa vào vị trí trong câu.\n\n## Nâng cao\nBẫy hay gặp: cùng họ từ (*success / successful / successfully*).',
    order: 1, status: 'PUBLISHED', source: 'MANUAL', createdBy: 'seed', updatedAt: t,
  });

  const q1 = genId('q');
  appendRow('Questions', { questionId: q1, subjectCode: 'TOEIC', grade: 12, topicId: tR, type: 'MCQ', difficulty: 'TH', level: 'CO_BAN', stem: 'The report must be submitted ____ Friday.', options: JSON.stringify(['in', 'on', 'at', 'by']), answer: '3', explanation: '"by Friday" = hạn chót đến thứ Sáu.', status: 'PUBLISHED', source: 'MANUAL' });
  const q2 = genId('q');
  appendRow('Questions', { questionId: q2, subjectCode: 'TOEIC', grade: 12, topicId: tR, type: 'MCQ', difficulty: 'NB', level: 'CO_BAN', stem: 'She is responsible ____ marketing.', options: JSON.stringify(['for', 'to', 'with', 'of']), answer: '0', explanation: 'be responsible **for** something.', status: 'PUBLISHED', source: 'MANUAL' });
  appendRow('Exams', { examId: genId('e'), title: 'TOEIC Reading – Mini test', subjectCode: 'TOEIC', grade: 12, kind: 'PRACTICE', questionIds: JSON.stringify([q1, q2]), durationMin: 10, level: 'CO_BAN', published: 'TRUE' });
}

/** Có thể chạy tay từ trình Apps Script nếu muốn khởi tạo ngay. */
function initDatabase() {
  ensureSheets();
  seedIfEmpty();
  seedCatalogIfEmpty();
  seedQuestionsIfEmpty();
  seedEnglishIfEmpty();
  Logger.log('Khởi tạo xong. Users: ' + getRows('Users').length + ', Subjects: ' + getRows('Subjects').length + ', Questions: ' + getRows('Questions').length);
}

/**
 * Chạy hàm này 1 lần trong trình Apps Script để CẤP QUYỀN DRIVE
 * (cần cho tính năng đính kèm tài liệu vào ghi chú).
 */
function _authorizeDrive() {
  const folder = getOrCreateFolder_('THPT_Files');
  Logger.log('Đã cấp quyền Drive. Folder: ' + folder.getName());
}
