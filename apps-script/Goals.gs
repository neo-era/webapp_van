/**
 * Goals.gs — CRUD mục tiêu theo môn & cập nhật tiến độ (sheet Goals).
 */

function cleanGoal(g) {
  return {
    goalId: g.goalId, studentId: g.studentId, subject: g.subject, title: g.title,
    targetValue: g.targetValue, progress: Number(g.progress) || 0, deadline: asDateStr(g.deadline),
  };
}

function getGoals(req) {
  const user = requireAuth(req.token);
  const goals = getRows('Goals')
    .filter(function (g) { return String(g.studentId) === String(user.userId); })
    .map(cleanGoal);
  return jsonOk(goals);
}

function saveGoal(req) {
  const user = requireAuth(req.token);
  const g = req.goal || {};
  if (!g.title) return jsonError('Vui lòng nhập tên mục tiêu');

  const fields = {
    subject: validSubject(g.subject),
    title: String(g.title),
    targetValue: g.targetValue || '',
    progress: clampProgress(g.progress),
    deadline: g.deadline ? String(g.deadline) : '',
  };

  if (g.goalId) {
    const existing = getRows('Goals').find(function (x) { return String(x.goalId) === String(g.goalId); });
    if (!existing) return jsonError('Không tìm thấy mục tiêu');
    if (String(existing.studentId) !== String(user.userId)) return jsonError('Không có quyền sửa mục tiêu này');
    updateRowById('Goals', 'goalId', g.goalId, fields);
    return jsonOk(cleanGoal(Object.assign(existing, fields)));
  }

  const goal = Object.assign({ goalId: genId('g'), studentId: user.userId, createdAt: now() }, fields);
  appendRow('Goals', goal);
  return jsonOk(cleanGoal(goal));
}

function deleteGoal(req) {
  const user = requireAuth(req.token);
  const existing = getRows('Goals').find(function (x) { return String(x.goalId) === String(req.goalId); });
  if (!existing) return jsonError('Không tìm thấy mục tiêu');
  if (String(existing.studentId) !== String(user.userId)) return jsonError('Không có quyền xóa mục tiêu này');
  deleteRowById('Goals', 'goalId', req.goalId);
  return jsonOk({ deleted: req.goalId });
}

function updateProgress(req) {
  const user = requireAuth(req.token);
  const existing = getRows('Goals').find(function (x) { return String(x.goalId) === String(req.goalId); });
  if (!existing) return jsonError('Không tìm thấy mục tiêu');
  if (String(existing.studentId) !== String(user.userId)) return jsonError('Không có quyền');
  const progress = clampProgress(req.progress);
  updateRowById('Goals', 'goalId', req.goalId, { progress: progress });
  return jsonOk(cleanGoal(Object.assign(existing, { progress: progress })));
}

function clampProgress(v) {
  let n = Number(v);
  if (isNaN(n)) n = 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}
