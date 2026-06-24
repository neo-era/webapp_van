/**
 * Classes.gs — Lớp học & chức năng giáo viên (sheet Classes + Users).
 * Quan hệ học sinh ↔ lớp lưu qua cột classId trong Users (1 HS thuộc 1 lớp).
 * Giáo viên chỉ truy cập lớp do mình phụ trách (canAccessClass).
 */

/** Gộp toàn bộ dữ liệu cho app giáo viên: các lớp + học sinh + tiến độ. */
function getTeacherData(req) {
  const teacher = requireTeacher(req.token);
  const classes = getRows('Classes').filter(function (c) {
    return String(c.teacherId) === String(teacher.userId);
  });
  const allUsers = getRows('Users');
  const allGoals = getRows('Goals');
  const allPlans = getRows('Plans');
  const today = todayStr();

  const result = classes.map(function (c) {
    const students = allUsers
      .filter(function (u) { return u.role === 'STUDENT' && String(u.classId) === String(c.classId); })
      .map(function (s) {
        const goals = allGoals.filter(function (g) { return String(g.studentId) === String(s.userId); });
        const progress = goals.length
          ? Math.round(goals.reduce(function (a, g) { return a + (Number(g.progress) || 0); }, 0) / goals.length)
          : 0;
        const late = allPlans.filter(function (p) {
          const d = asDateStr(p.dueDate);
          return String(p.studentId) === String(s.userId) && p.status !== 'DONE' && d && d < today;
        }).length;
        return { userId: s.userId, name: s.name, progress: progress, late: late };
      });
    return { classId: c.classId, name: c.name, studentCount: students.length, students: students };
  });

  return jsonOk({ teacher: publicUser(teacher), classes: result });
}

/** Giáo viên giao 1 nhiệm vụ cho 1 học sinh hoặc cả lớp. */
function assignTask(req) {
  const teacher = requireTeacher(req.token);
  if (!canAccessClass(teacher, req.classId)) return jsonError('Không có quyền với lớp này');
  if (!req.title) return jsonError('Vui lòng nhập tên nhiệm vụ');

  const subject = validSubject(req.subject);
  const dueDate = req.dueDate ? String(req.dueDate) : '';
  const description = req.description ? String(req.description) : '';

  let targets;
  if (req.studentId) {
    const s = getRows('Users').find(function (u) { return String(u.userId) === String(req.studentId); });
    if (!s || String(s.classId) !== String(req.classId)) return jsonError('Học sinh không thuộc lớp này');
    targets = [req.studentId];
  } else {
    targets = getRows('Users')
      .filter(function (u) { return u.role === 'STUDENT' && String(u.classId) === String(req.classId); })
      .map(function (u) { return u.userId; });
  }
  if (!targets.length) return jsonError('Lớp chưa có học sinh nào');

  const t = now();
  targets.forEach(function (sid) {
    appendRow('Plans', {
      planId: genId('p'), studentId: sid, title: String(req.title), subject: subject,
      description: description, dueDate: dueDate, status: 'TODO', assignedBy: teacher.userId, createdAt: t,
    });
  });
  return jsonOk({ assigned: targets.length });
}
