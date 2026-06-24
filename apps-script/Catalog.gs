/**
 * Catalog.gs — Danh mục môn học & cây chủ đề (sheet Subjects, Topics).
 * Đọc: mọi người dùng đã đăng nhập. Ghi: giáo viên (CONTENT_ADMIN).
 */

function cleanSubject(s) {
  return {
    subjectCode: s.subjectCode, name: s.name,
    grades: s.grades ? String(s.grades).split(',').filter(Boolean) : [],
    category: s.category, active: s.active !== false && s.active !== 'FALSE',
  };
}
function cleanTopic(t) {
  return {
    topicId: t.topicId, subjectCode: t.subjectCode, grade: Number(t.grade) || t.grade,
    parentId: t.parentId || '', title: t.title, order: Number(t.order) || 0,
  };
}

/** Danh sách môn (lọc theo khối nếu truyền req.grade). */
function getSubjects(req) {
  requireAuth(req.token);
  let subjects = getRows('Subjects').map(cleanSubject).filter(function (s) { return s.active; });
  if (req.grade) {
    subjects = subjects.filter(function (s) { return s.grades.indexOf(String(req.grade)) >= 0; });
  }
  return jsonOk(subjects);
}

/** Cây chủ đề (Chương → Bài) theo môn + khối. */
function getTopics(req) {
  requireAuth(req.token);
  const topics = getRows('Topics')
    .filter(function (t) {
      return String(t.subjectCode) === String(req.subjectCode) &&
        (!req.grade || String(t.grade) === String(req.grade));
    })
    .map(cleanTopic)
    .sort(function (a, b) { return a.order - b.order; });
  return jsonOk(topics);
}

/** Thêm/sửa môn (giáo viên). */
function saveSubject(req) {
  requireTeacher(req.token);
  const s = req.subject || {};
  if (!s.subjectCode || !s.name) return jsonError('Thiếu mã môn hoặc tên môn');
  const fields = {
    name: String(s.name),
    grades: Array.isArray(s.grades) ? s.grades.join(',') : String(s.grades || ''),
    category: s.category || 'TU_CHON',
    active: s.active === false ? 'FALSE' : 'TRUE',
  };
  const existing = getRows('Subjects').find(function (x) { return String(x.subjectCode) === String(s.subjectCode); });
  if (existing) updateRowById('Subjects', 'subjectCode', s.subjectCode, fields);
  else appendRow('Subjects', Object.assign({ subjectCode: s.subjectCode }, fields));
  return jsonOk(cleanSubject(Object.assign({ subjectCode: s.subjectCode }, fields)));
}

/** Thêm/sửa chủ đề (giáo viên). */
function saveTopic(req) {
  requireTeacher(req.token);
  const t = req.topic || {};
  if (!t.subjectCode || !t.title) return jsonError('Thiếu môn hoặc tên chủ đề');
  const fields = {
    subjectCode: String(t.subjectCode), grade: t.grade || 12,
    parentId: t.parentId || '', title: String(t.title), order: Number(t.order) || 0,
  };
  if (t.topicId) {
    updateRowById('Topics', 'topicId', t.topicId, fields);
    return jsonOk(cleanTopic(Object.assign({ topicId: t.topicId }, fields)));
  }
  const topic = Object.assign({ topicId: genId('t') }, fields);
  appendRow('Topics', topic);
  return jsonOk(cleanTopic(topic));
}
