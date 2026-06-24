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
  switch (action) {
    // --- Hệ thống ---
    case 'ping':      return jsonOk({ pong: true, time: now() });

    // --- Xác thực (Auth.gs) ---
    case 'register':  return register(req);
    case 'login':     return login(req);

    // --- Sẽ bổ sung ở các Prompt sau ---
    // Plans (3.1), Goals (3.2), Exam (3.3), Notes (3.4), Classes (4.x)

    default:          return jsonError('Action không hợp lệ: ' + action);
  }
}

/* ============================================================
   Hàm test chạy trực tiếp trong trình Apps Script (nút Run).
   Xem kết quả ở: Chế độ xem → Nhật ký (View → Logs) / Executions.
   ============================================================ */
function _testPing() {
  Logger.log(JSON.stringify(route('ping', {})));
}
