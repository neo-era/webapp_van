/**
 * Plans.gs — CRUD kế hoạch / nhiệm vụ học tập (sheet Plans).
 * Học sinh chỉ thao tác dữ liệu của chính mình (Quy tắc 2).
 */

function cleanPlan(p) {
  return {
    planId: p.planId, studentId: p.studentId, title: p.title, subject: p.subject,
    description: p.description, dueDate: asDateStr(p.dueDate), status: p.status,
    assignedBy: p.assignedBy,
  };
}

/** Lấy kế hoạch của chính học sinh. */
function getPlans(req) {
  const user = requireAuth(req.token);
  const plans = getRows('Plans')
    .filter(function (p) { return String(p.studentId) === String(user.userId); })
    .map(cleanPlan);
  return jsonOk(plans);
}

/** Thêm mới hoặc sửa kế hoạch của chính mình. */
function savePlan(req) {
  const user = requireAuth(req.token);
  const p = req.plan || {};
  if (!p.title) return jsonError('Vui lòng nhập tên nhiệm vụ');

  const fields = {
    title: String(p.title),
    subject: validSubject(p.subject),
    description: p.description ? String(p.description) : '',
    dueDate: p.dueDate ? String(p.dueDate) : '',
    status: validStatus(p.status),
  };

  if (p.planId) {
    const existing = getRows('Plans').find(function (x) { return String(x.planId) === String(p.planId); });
    if (!existing) return jsonError('Không tìm thấy nhiệm vụ');
    if (String(existing.studentId) !== String(user.userId)) return jsonError('Không có quyền sửa nhiệm vụ này');
    updateRowById('Plans', 'planId', p.planId, fields);
    return jsonOk(cleanPlan(Object.assign(existing, fields)));
  }

  const plan = Object.assign({
    planId: genId('p'), studentId: user.userId, assignedBy: '', createdAt: now(),
  }, fields);
  appendRow('Plans', plan);
  return jsonOk(cleanPlan(plan));
}

/** Xóa kế hoạch của chính mình. */
function deletePlan(req) {
  const user = requireAuth(req.token);
  const existing = getRows('Plans').find(function (x) { return String(x.planId) === String(req.planId); });
  if (!existing) return jsonError('Không tìm thấy nhiệm vụ');
  if (String(existing.studentId) !== String(user.userId)) return jsonError('Không có quyền xóa nhiệm vụ này');
  deleteRowById('Plans', 'planId', req.planId);
  return jsonOk({ deleted: req.planId });
}
