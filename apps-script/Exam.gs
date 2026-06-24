/**
 * Exam.gs — Kế hoạch ôn thi THPTQG (sheet ExamPlans, 1 dòng / học sinh).
 * subjects lưu dạng "TOAN,VAN,..."; milestones lưu JSON checklist.
 */

function cleanExam(row) {
  let checklist = [];
  try { checklist = row.milestones ? JSON.parse(row.milestones) : []; } catch (e) { checklist = []; }
  return {
    studentId: row.studentId,
    examDate: asDateStr(row.examDate),
    subjects: row.subjects ? String(row.subjects).split(',').filter(Boolean) : [],
    checklist: checklist,
  };
}

function getExamPlan(req) {
  const user = requireAuth(req.token);
  const row = getRows('ExamPlans').find(function (e) { return String(e.studentId) === String(user.userId); });
  return jsonOk(row ? cleanExam(row) : null);
}

function saveExamPlan(req) {
  const user = requireAuth(req.token);
  const subjects = Array.isArray(req.subjects) ? req.subjects.map(validSubject) : [];
  const checklist = Array.isArray(req.checklist) ? req.checklist : [];
  const fields = {
    examDate: req.examDate ? String(req.examDate) : '',
    subjects: subjects.join(','),
    milestones: JSON.stringify(checklist),
  };

  const existing = getRows('ExamPlans').find(function (e) { return String(e.studentId) === String(user.userId); });
  if (existing) {
    updateRowById('ExamPlans', 'studentId', user.userId, fields);
  } else {
    appendRow('ExamPlans', Object.assign({ studentId: user.userId }, fields));
  }
  return jsonOk(cleanExam(Object.assign({ studentId: user.userId }, fields)));
}
