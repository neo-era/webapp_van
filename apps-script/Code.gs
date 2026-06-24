/**
 * Code.gs — Cổng vào của backend (router).
 *
 * Vai trò:
 *  - doGet(e)  : phục vụ trang HTML (nếu dùng HtmlService) hoặc kiểm tra hoạt động.
 *  - doPost(e) : nhận request JSON từ frontend, phân nhánh theo "action".
 *  - route(action, req) : bảng phân nhánh action → hàm xử lý tương ứng.
 *  - handleApi(req)     : điểm gọi cho google.script.run (khi serve bằng HtmlService).
 *
 * Quy ước trả về: { ok: true, data } hoặc { ok: false, error } (xem Utils.gs).
 *
 * TODO (Prompt 1.1): hiện thực doPost, route, handleApi.
 */
