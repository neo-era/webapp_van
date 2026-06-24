/**
 * Plans.gs — CRUD kế hoạch / nhiệm vụ học tập (sheet Plans).
 *
 * Dự kiến chứa:
 *  - getPlans(req)    : trả plans của chính học sinh (requireAuth).
 *  - savePlan(req)    : thêm/sửa plan của chính mình (validate subject/status).
 *  - deletePlan(req)  : xóa plan của chính mình.
 *  - (Prompt 4.2) cho phép giáo viên tạo plan cho học sinh trong lớp mình
 *    (set assignedBy = userId giáo viên, kiểm canAccessClass).
 *
 * TODO (Prompt 3.1): hiện thực CRUD kế hoạch.
 */
