/**
 * Questions.gs — Ngân hàng câu hỏi (sheet Questions).
 * type: MCQ (1 đáp án), TRUEFALSE, SHORT (trả lời ngắn), ESSAY (tự luận).
 * options: JSON mảng chuỗi (cho MCQ). answer: MCQ=index(0-based); TRUEFALSE='true'/'false'; SHORT=đáp án.
 * difficulty: NB/TH/VD/VDC. status: DRAFT/PUBLISHED.
 */

function parseJsonSafe_(s, fallback) {
  try { return s ? JSON.parse(s) : fallback; } catch (e) { return fallback; }
}

function cleanQuestion(q, forStudent) {
  const o = {
    questionId: q.questionId, subjectCode: q.subjectCode, grade: Number(q.grade) || q.grade,
    topicId: q.topicId, type: q.type, difficulty: q.difficulty, level: q.level,
    stem: q.stem, options: parseJsonSafe_(q.options, []), status: q.status, source: q.source,
  };
  if (!forStudent) { o.answer = q.answer; o.explanation = q.explanation; }
  return o;
}

/** Danh sách câu hỏi (giáo viên: tất cả; lọc theo subject/grade/topic/difficulty). */
function getQuestions(req) {
  requireTeacher(req.token);
  let rows = getRows('Questions');
  if (req.subjectCode) rows = rows.filter(function (q) { return String(q.subjectCode) === String(req.subjectCode); });
  if (req.grade) rows = rows.filter(function (q) { return String(q.grade) === String(req.grade); });
  if (req.topicId) rows = rows.filter(function (q) { return String(q.topicId) === String(req.topicId); });
  if (req.difficulty) rows = rows.filter(function (q) { return q.difficulty === req.difficulty; });
  return jsonOk(rows.map(function (q) { return cleanQuestion(q, false); }));
}

function saveQuestion(req) {
  requireTeacher(req.token);
  const q = req.question || {};
  if (!q.stem) return jsonError('Thiếu nội dung câu hỏi');
  const fields = {
    subjectCode: String(q.subjectCode || ''), grade: q.grade || 12, topicId: q.topicId || '',
    type: q.type || 'MCQ', difficulty: q.difficulty || 'NB', level: q.level || 'CO_BAN',
    stem: String(q.stem), options: JSON.stringify(q.options || []),
    answer: String(q.answer == null ? '' : q.answer), explanation: q.explanation || '',
    status: q.status || 'DRAFT', source: q.source || 'MANUAL',
  };
  if (q.questionId) {
    updateRowById('Questions', 'questionId', q.questionId, fields);
    return jsonOk(cleanQuestion(Object.assign({ questionId: q.questionId }, fields), false));
  }
  const question = Object.assign({ questionId: genId('q') }, fields);
  appendRow('Questions', question);
  return jsonOk(cleanQuestion(question, false));
}

function deleteQuestion(req) {
  requireTeacher(req.token);
  deleteRowById('Questions', 'questionId', req.questionId);
  return jsonOk({ deleted: req.questionId });
}

function setQuestionStatus(req) {
  requireTeacher(req.token);
  const valid = ['DRAFT', 'PUBLISHED'];
  if (valid.indexOf(req.status) < 0) return jsonError('Trạng thái không hợp lệ');
  updateRowById('Questions', 'questionId', req.questionId, { status: req.status });
  return jsonOk({ questionId: req.questionId, status: req.status });
}

/** Chấm 1 câu tự động. Trả về true/false; ESSAY trả null (cần chấm tay/AI). */
function gradeAnswer_(q, studentAnswer) {
  const ans = String(studentAnswer == null ? '' : studentAnswer).trim();
  if (q.type === 'ESSAY') return null;
  if (q.type === 'SHORT') {
    return ans.toLowerCase() === String(q.answer || '').trim().toLowerCase();
  }
  // MCQ / TRUEFALSE: so khớp trực tiếp với answer
  return ans === String(q.answer || '').trim();
}
