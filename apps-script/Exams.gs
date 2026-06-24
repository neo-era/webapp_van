/**
 * Exams.gs — Đề kiểm tra & bài làm (sheet Exams, Attempts).
 * questionIds: JSON mảng id. kind: PRACTICE/TEST/MOCK.
 */

function examToObj(e) {
  return {
    examId: e.examId, title: e.title, subjectCode: e.subjectCode, grade: Number(e.grade) || e.grade,
    kind: e.kind, questionIds: parseJsonSafe_(e.questionIds, []), durationMin: Number(e.durationMin) || 0,
    level: e.level, published: e.published === true || e.published === 'TRUE',
  };
}

/** Giáo viên tạo đề: chọn câu hỏi cụ thể, hoặc tự bốc theo ma trận độ khó. */
function createExam(req) {
  requireTeacher(req.token);
  if (!req.title) return jsonError('Thiếu tên đề');
  let questionIds = Array.isArray(req.questionIds) ? req.questionIds.slice() : [];

  // Tự bốc theo ma trận {NB:n, TH:n, VD:n, VDC:n} từ câu PUBLISHED cùng môn/khối
  if (req.matrix) {
    const pool = getRows('Questions').filter(function (q) {
      return q.status === 'PUBLISHED' && String(q.subjectCode) === String(req.subjectCode) &&
        (!req.grade || String(q.grade) === String(req.grade));
    });
    ['NB', 'TH', 'VD', 'VDC'].forEach(function (d) {
      const n = Number(req.matrix[d]) || 0;
      const cands = pool.filter(function (q) { return q.difficulty === d; });
      for (let i = 0; i < n && i < cands.length; i++) questionIds.push(cands[i].questionId);
    });
  }
  if (!questionIds.length) return jsonError('Đề chưa có câu hỏi nào');

  const exam = {
    examId: genId('e'), title: String(req.title), subjectCode: req.subjectCode || '',
    grade: req.grade || 12, kind: req.kind || 'PRACTICE', questionIds: JSON.stringify(questionIds),
    durationMin: Number(req.durationMin) || 0, level: req.level || 'CO_BAN',
    published: req.published === false ? 'FALSE' : 'TRUE',
  };
  appendRow('Exams', exam);
  return jsonOk(examToObj(exam));
}

/** Danh sách đề (HS chỉ thấy published). */
function getExams(req) {
  const user = requireAuth(req.token);
  let rows = getRows('Exams');
  if (req.subjectCode) rows = rows.filter(function (e) { return String(e.subjectCode) === String(req.subjectCode); });
  if (req.grade) rows = rows.filter(function (e) { return String(e.grade) === String(req.grade); });
  if (user.role !== 'TEACHER') rows = rows.filter(function (e) { return e.published === true || e.published === 'TRUE'; });
  return jsonOk(rows.map(examToObj));
}

/** Lấy đề để làm bài: kèm câu hỏi, ẩn đáp án với học sinh. */
function getExam(req) {
  const user = requireAuth(req.token);
  const e = getRows('Exams').find(function (x) { return String(x.examId) === String(req.examId); });
  if (!e) return jsonError('Không tìm thấy đề');
  const exam = examToObj(e);
  const isStudent = user.role !== 'TEACHER';
  const qmap = {};
  getRows('Questions').forEach(function (q) { qmap[q.questionId] = q; });
  exam.questions = exam.questionIds.map(function (id) { return qmap[id]; })
    .filter(Boolean).map(function (q) { return cleanQuestion(q, isStudent); });
  return jsonOk(exam);
}

/** Nộp bài: tự chấm trắc nghiệm/đúng-sai/trả lời ngắn; trả kết quả + lời giải. */
function submitAttempt(req) {
  const user = requireAuth(req.token);
  const e = getRows('Exams').find(function (x) { return String(x.examId) === String(req.examId); });
  if (!e) return jsonError('Không tìm thấy đề');
  const exam = examToObj(e);
  const answers = req.answers || {};
  const qmap = {};
  getRows('Questions').forEach(function (q) { qmap[q.questionId] = q; });

  let correct = 0, gradable = 0;
  const results = exam.questionIds.map(function (id) {
    const q = qmap[id];
    if (!q) return null;
    const your = answers[id];
    const res = gradeAnswer_(q, your);
    if (res !== null) { gradable++; if (res) correct++; }
    return {
      questionId: id, type: q.type, stem: q.stem, your: your == null ? '' : your,
      answer: q.answer, explanation: q.explanation, correct: res,
    };
  }).filter(Boolean);

  const score10 = gradable ? Math.round((correct / gradable) * 100) / 10 : 0;
  appendRow('Attempts', {
    attemptId: genId('a'), studentId: user.userId, examId: exam.examId,
    answers: JSON.stringify(answers), score: score10, maxScore: 10,
    startedAt: req.startedAt || '', submittedAt: now(),
  });
  return jsonOk({ correct: correct, gradable: gradable, total: exam.questionIds.length, score10: score10, results: results });
}

/** Lịch sử làm bài của học sinh. */
function getAttempts(req) {
  const user = requireAuth(req.token);
  let rows = getRows('Attempts').filter(function (a) { return String(a.studentId) === String(user.userId); });
  if (req.examId) rows = rows.filter(function (a) { return String(a.examId) === String(req.examId); });
  return jsonOk(rows.map(function (a) {
    return { attemptId: a.attemptId, examId: a.examId, score: Number(a.score) || 0, submittedAt: asDateStr(a.submittedAt) || a.submittedAt };
  }));
}
