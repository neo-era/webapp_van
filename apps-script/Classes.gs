/**
 * Classes.gs — Lớp học và chức năng phía giáo viên (sheet Classes, ClassMember*).
 *
 * Dự kiến chứa:
 *  - getMyClasses(req)      : danh sách lớp của giáo viên (requireTeacher).
 *  - getClassStudents(req)  : học sinh trong lớp + tiến độ TB + số nhiệm vụ trễ
 *                             (kiểm canAccessClass).
 *  - (Prompt 4.2) giao việc cho cả lớp / từng học sinh.
 *
 * Ghi chú: quan hệ học sinh ↔ lớp lưu qua cột classId trong sheet Users
 *          (đơn giản, 1 học sinh thuộc 1 lớp). Mở rộng sheet ClassMember nếu cần nhiều lớp.
 *
 * TODO (Prompt 4.1): hiện thực chức năng giáo viên.
 */
