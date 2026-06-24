/**
 * Utils.gs — Helper dùng chung cho mọi file backend.
 *
 * Dự kiến chứa:
 *  - getSheet(name), getRows(name)           : đọc sheet thành mảng object theo header.
 *  - appendRow(name, obj)                    : thêm một dòng.
 *  - updateRowById(name, idField, id, patch) : sửa dòng theo id.
 *  - deleteRowById(name, idField, id)        : xóa dòng theo id.
 *  - genId(prefix), now()                    : sinh id, lấy thời gian.
 *  - sha256(text, salt)                      : hash mật khẩu.
 *  - jsonOk(data), jsonError(msg)            : chuẩn hóa kết quả trả về.
 *
 * Nguyên tắc: MỌI thao tác đọc/ghi Google Sheets đi qua đây, không getRange rải rác.
 *
 * TODO (Prompt 1.1): hiện thực các helper.
 */
