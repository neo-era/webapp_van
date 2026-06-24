/**
 * Auth.gs — Đăng nhập, đăng ký, phiên làm việc và phân quyền.
 *
 * Dự kiến chứa:
 *  - register(req) : tạo user mới trong sheet Users (hash mật khẩu, chống trùng email).
 *  - login(req)    : kiểm tra email + mật khẩu, sinh token lưu sheet Sessions.
 *  - requireAuth(token)    : trả về user hợp lệ hoặc lỗi nếu token sai/hết hạn.
 *  - requireTeacher(token) : như requireAuth + bắt buộc role === 'TEACHER'.
 *  - canAccessStudent(user, studentId), canAccessClass(user, classId).
 *
 * Quy tắc 2 (CLAUDE.md): luôn tra role/quyền từ sheet, KHÔNG tin client.
 *
 * TODO (Prompt 1.2): hiện thực xác thực & phân quyền.
 */
