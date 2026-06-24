/**
 * Lessons.gs — Hệ thống bài giảng (sheet Lessons, LessonProgress).
 * Học sinh chỉ xem bài PUBLISHED. Giáo viên tạo/sửa/duyệt.
 */

function cleanLesson(l, includeContent) {
  const o = {
    lessonId: l.lessonId, subjectCode: l.subjectCode, grade: Number(l.grade) || l.grade,
    topicId: l.topicId, title: l.title, level: l.level, skill: l.skill || '',
    order: Number(l.order) || 0, status: l.status, source: l.source,
  };
  if (includeContent) o.contentMd = l.contentMd || '';
  return o;
}

/** Danh sách bài giảng theo chủ đề. HS chỉ thấy PUBLISHED; GV thấy tất cả. */
function getLessons(req) {
  const user = requireAuth(req.token);
  let rows = getRows('Lessons').filter(function (l) {
    return String(l.topicId) === String(req.topicId);
  });
  if (user.role !== 'TEACHER') {
    rows = rows.filter(function (l) { return l.status === 'PUBLISHED'; });
  }
  rows.sort(function (a, b) { return (Number(a.order) || 0) - (Number(b.order) || 0); });
  return jsonOk(rows.map(function (l) { return cleanLesson(l, false); }));
}

/** Chi tiết 1 bài giảng (kèm nội dung). */
function getLesson(req) {
  const user = requireAuth(req.token);
  const l = getRows('Lessons').find(function (x) { return String(x.lessonId) === String(req.lessonId); });
  if (!l) return jsonError('Không tìm thấy bài giảng');
  if (user.role !== 'TEACHER' && l.status !== 'PUBLISHED') return jsonError('Bài giảng chưa được xuất bản');
  return jsonOk(cleanLesson(l, true));
}

/** Thêm/sửa bài giảng (giáo viên). */
function saveLesson(req) {
  const user = requireTeacher(req.token);
  const l = req.lesson || {};
  if (!l.title || !l.topicId) return jsonError('Thiếu tiêu đề hoặc chủ đề');
  const fields = {
    subjectCode: String(l.subjectCode || ''), grade: l.grade || 12, topicId: String(l.topicId),
    title: String(l.title), level: l.level || 'CO_BAN', skill: l.skill || '',
    contentMd: l.contentMd || '', order: Number(l.order) || 0,
    status: l.status || 'DRAFT', source: l.source || 'MANUAL',
    createdBy: user.userId, updatedAt: now(),
  };
  if (l.lessonId) {
    updateRowById('Lessons', 'lessonId', l.lessonId, fields);
    return jsonOk(cleanLesson(Object.assign({ lessonId: l.lessonId }, fields), true));
  }
  const lesson = Object.assign({ lessonId: genId('l') }, fields);
  appendRow('Lessons', lesson);
  return jsonOk(cleanLesson(lesson, true));
}

/** Đổi trạng thái xuất bản (giáo viên). */
function setLessonStatus(req) {
  requireTeacher(req.token);
  const valid = ['DRAFT', 'REVIEW', 'PUBLISHED'];
  if (valid.indexOf(req.status) < 0) return jsonError('Trạng thái không hợp lệ');
  const ok = updateRowById('Lessons', 'lessonId', req.lessonId, { status: req.status, updatedAt: now() });
  return ok ? jsonOk({ lessonId: req.lessonId, status: req.status }) : jsonError('Không tìm thấy bài giảng');
}

function deleteLesson(req) {
  requireTeacher(req.token);
  deleteRowById('Lessons', 'lessonId', req.lessonId);
  return jsonOk({ deleted: req.lessonId });
}

/** Học sinh đánh dấu đã học. */
function markLearned(req) {
  const user = requireAuth(req.token);
  const existing = getRows('LessonProgress').find(function (p) {
    return String(p.studentId) === String(user.userId) && String(p.lessonId) === String(req.lessonId);
  });
  const status = req.learned ? 'LEARNED' : '';
  if (existing) {
    // Cập nhật đúng dòng theo _rowIndex (tránh trùng lessonId của HS khác)
    const sh = getSheet('LessonProgress');
    const header = getHeader('LessonProgress');
    sh.getRange(existing._rowIndex, header.indexOf('status') + 1).setValue(status);
    sh.getRange(existing._rowIndex, header.indexOf('updatedAt') + 1).setValue(now());
  } else {
    appendRow('LessonProgress', { studentId: user.userId, lessonId: req.lessonId, status: status, updatedAt: now() });
  }
  return jsonOk({ lessonId: req.lessonId, learned: !!req.learned });
}

/** Danh sách lessonId đã học của học sinh hiện tại. */
function getLearnedLessons(req) {
  const user = requireAuth(req.token);
  const ids = getRows('LessonProgress')
    .filter(function (p) { return String(p.studentId) === String(user.userId) && p.status === 'LEARNED'; })
    .map(function (p) { return p.lessonId; });
  return jsonOk(ids);
}
