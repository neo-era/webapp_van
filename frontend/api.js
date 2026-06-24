/* ============================================================
   api.js — Lớp gọi backend Apps Script.
   - Nếu CONFIG.WEB_APP_URL trống → chạy chế độ DEMO (dữ liệu mẫu MOCK).
   - Nếu đã điền URL → gọi thật bằng fetch theo đúng chuẩn tránh CORS.
   ============================================================ */

const CONFIG = {
  // URL Web App Apps Script (đã deploy tự động bằng clasp).
  // Để trống '' nếu muốn quay lại chế độ demo dữ liệu mẫu.
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzpCJYHRTwRmclDXEKg3kFpJLHtfHTaLlnMDXDzDlkOgJRBvw7NMoI99Ik8iwx99vfrdw/exec',
};

const Api = {
  isMock() { return !CONFIG.WEB_APP_URL; },

  /**
   * Gọi backend. Tự đính kèm token đăng nhập.
   * QUAN TRỌNG (CLAUDE.md): dùng Content-Type text/plain để tránh preflight CORS.
   */
  async call(action, payload) {
    if (Api.isMock()) return MockApi.call(action, payload);

    const body = JSON.stringify(Object.assign(
      { action: action, token: App.state.token || '' },
      payload || {}
    ));

    let res;
    try {
      res = await fetch(CONFIG.WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: body,
        redirect: 'follow',
      });
    } catch (e) {
      throw new Error('Không kết nối được máy chủ. Kiểm tra mạng hoặc Web App URL.');
    }

    let json;
    try { json = await res.json(); }
    catch (e) { throw new Error('Máy chủ trả về dữ liệu không hợp lệ.'); }

    if (!json || json.ok !== true) {
      throw new Error((json && json.error) || 'Đã có lỗi xảy ra.');
    }
    return json.data;
  },
};

/* ------------------------------------------------------------
   MockApi — giả lập backend cho bản demo (GitHub Pages, chưa có URL).
   Chỉ hỗ trợ các action cần cho luồng demo; mở rộng dần khi cần.
   ------------------------------------------------------------ */
const MockApi = {
  async call(action, payload) {
    await new Promise((r) => setTimeout(r, 250)); // giả lập độ trễ mạng
    payload = payload || {};
    switch (action) {
      case 'ping':
        return { pong: true };

      case 'login': {
        const email = String(payload.email || '').toLowerCase();
        const isTeacher = email.includes('giaovien') || email === MOCK.teacher.email;
        return { token: 'mock-token', user: isTeacher ? MOCK.teacher : MOCK.student };
      }

      case 'register':
        return MOCK.student;

      default:
        throw new Error('Chế độ demo chưa hỗ trợ "' + action + '".');
    }
  },
};
