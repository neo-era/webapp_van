/**
 * Code.gs — Cổng vào của backend (router).
 *
 * Quy ước trả về: { ok: true, data } hoặc { ok: false, error } (xem Utils.gs).
 *  - doGet(e)           : kiểm tra hoạt động / (sau này) phục vụ HTML.
 *  - doPost(e)          : nhận request JSON, phân nhánh theo "action".
 *  - handleApi(req)     : điểm gọi cho google.script.run (khi serve bằng HtmlService).
 *  - route(action, req) : bảng phân nhánh action → hàm xử lý.
 */

/** Phục vụ GET — hiện trả JSON kiểm tra. (Có thể đổi sang HtmlService sau.) */
function doGet(e) {
  const body = jsonOk({ service: 'THPT Backend', time: now() });
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Phục vụ POST — frontend gửi JSON { action, token, ...payload }. */
function doPost(e) {
  let res;
  try {
    const req = (e && e.postData && e.postData.contents)
      ? JSON.parse(e.postData.contents)
      : {};
    res = route(req.action, req);
  } catch (err) {
    res = jsonError('Yêu cầu không hợp lệ: ' + err);
  }
  return ContentService
    .createTextOutput(JSON.stringify(res))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Dùng cho google.script.run (HtmlService) — cùng router với doPost. */
function handleApi(req) {
  try {
    return route(req && req.action, req || {});
  } catch (err) {
    return jsonError(String(err));
  }
}

/** Bảng phân nhánh action → hàm xử lý. */
function route(action, req) {
  ensureSheets();   // tự tạo tab + header nếu thiếu
  seedIfEmpty();    // tự seed dữ liệu demo nếu DB trống

  switch (action) {
    // --- Hệ thống ---
    case 'ping':      return jsonOk({ pong: true, time: now() });

    // --- Xác thực (Auth.gs) ---
    case 'register':       return register(req);
    case 'login':          return login(req);

    // --- Gộp dữ liệu học sinh (1 lần gọi) ---
    case 'getStudentData': return getStudentData(req);

    // --- Kế hoạch (Plans.gs) ---
    case 'getPlans':       return getPlans(req);
    case 'savePlan':       return savePlan(req);
    case 'deletePlan':     return deletePlan(req);

    // --- Mục tiêu (Goals.gs) ---
    case 'getGoals':       return getGoals(req);
    case 'saveGoal':       return saveGoal(req);
    case 'deleteGoal':     return deleteGoal(req);
    case 'updateProgress': return updateProgress(req);

    // --- Ôn thi (Exam.gs) ---
    case 'getExamPlan':    return getExamPlan(req);
    case 'saveExamPlan':   return saveExamPlan(req);

    // --- Ghi chú (Notes.gs) ---
    case 'getNotes':       return getNotes(req);
    case 'saveNote':       return saveNote(req);
    case 'deleteNote':     return deleteNote(req);

    // --- Giáo viên (Classes.gs) ---
    case 'getTeacherData': return getTeacherData(req);
    case 'assignTask':     return assignTask(req);

    default:               return jsonError('Action không hợp lệ: ' + action);
  }
}

/** Gộp toàn bộ dữ liệu cần cho app học sinh trong 1 lần gọi (giảm độ trễ). */
function getStudentData(req) {
  const user = requireAuth(req.token);
  const sid = user.userId;
  const plans = getRows('Plans').filter(function (p) { return String(p.studentId) === String(sid); }).map(cleanPlan);
  const goals = getRows('Goals').filter(function (g) { return String(g.studentId) === String(sid); }).map(cleanGoal);
  const examRow = getRows('ExamPlans').find(function (e) { return String(e.studentId) === String(sid); });
  const notes = getRows('Notes').filter(function (n) { return String(n.studentId) === String(sid); }).map(cleanNote);
  return jsonOk({
    user: publicUser(user),
    plans: plans,
    goals: goals,
    exam: examRow ? cleanExam(examRow) : null,
    notes: notes,
  });
}

/* ============================================================
   Hàm test chạy trực tiếp trong trình Apps Script (nút Run).
   Xem kết quả ở: Chế độ xem → Nhật ký (View → Logs) / Executions.
   ============================================================ */
function _testPing() {
  Logger.log(JSON.stringify(route('ping', {})));
}
