/**
 * Utils.gs — Helper dùng chung cho mọi file backend.
 *
 * Nguyên tắc: MỌI thao tác đọc/ghi Google Sheets đi qua đây, không getRange rải rác.
 */

// Salt cho hash mật khẩu. ĐỔI chuỗi này 1 lần khi setup thật rồi giữ nguyên
// (đổi sau sẽ làm sai toàn bộ mật khẩu đã lưu).
const SALT = 'THPT_v1_doi_chuoi_nay_khi_setup';

// Cấu trúc các tab (sheet) và cột header. Backend tự tạo nếu thiếu.
const SCHEMA = {
  Users:     ['userId', 'email', 'passwordHash', 'name', 'role', 'grade', 'classId', 'createdAt'],
  Classes:   ['classId', 'name', 'teacherId', 'createdAt'],
  Plans:     ['planId', 'studentId', 'title', 'subject', 'description', 'dueDate', 'status', 'assignedBy', 'createdAt'],
  Goals:     ['goalId', 'studentId', 'subject', 'title', 'targetValue', 'progress', 'deadline', 'createdAt'],
  ExamPlans: ['studentId', 'examDate', 'subjects', 'milestones'],
  Notes:     ['noteId', 'studentId', 'subject', 'title', 'content', 'fileUrl', 'createdAt', 'updatedAt'],
  Sessions:  ['token', 'userId', 'expiresAt'],

  // --- v2.0: nền tảng học tập ---
  Subjects:       ['subjectCode', 'name', 'grades', 'category', 'active'],
  Topics:         ['topicId', 'subjectCode', 'grade', 'parentId', 'title', 'order'],
  Lessons:        ['lessonId', 'subjectCode', 'grade', 'topicId', 'title', 'level', 'skill', 'contentMd', 'order', 'status', 'source', 'createdBy', 'updatedAt'],
  Questions:      ['questionId', 'subjectCode', 'grade', 'topicId', 'type', 'difficulty', 'level', 'stem', 'options', 'answer', 'explanation', 'status', 'source'],
  Exams:          ['examId', 'title', 'subjectCode', 'grade', 'kind', 'questionIds', 'durationMin', 'level', 'published'],
  Attempts:       ['attemptId', 'studentId', 'examId', 'answers', 'score', 'maxScore', 'startedAt', 'submittedAt'],
  LessonProgress: ['studentId', 'lessonId', 'status', 'updatedAt'],
  AIChats:        ['msgId', 'studentId', 'context', 'role', 'content', 'model', 'tokens', 'createdAt'],
};

/** Spreadsheet đang gắn với Apps Script này. */
function DB() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/** Tạo các tab còn thiếu + ghi header đúng. Gọi đầu mỗi request (route). */
function ensureSheets() {
  const ss = DB();
  Object.keys(SCHEMA).forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const header = SCHEMA[name];
    const current = sh.getRange(1, 1, 1, header.length).getValues()[0].map(String);
    const mismatch = header.some(function (h, i) { return current[i] !== h; });
    if (mismatch) {
      sh.getRange(1, 1, 1, header.length).setValues([header]);
      sh.setFrozenRows(1);
    }
  });
  // Xóa tab mặc định trống (vd "Trang tính1"/"Sheet1") không thuộc schema
  ss.getSheets().forEach(function (sh) {
    if (!SCHEMA[sh.getName()] && sh.getLastRow() === 0 && ss.getSheets().length > 1) {
      try { ss.deleteSheet(sh); } catch (e) {}
    }
  });
}

/** Lấy sheet theo tên (tự tạo nếu thiếu). */
function getSheet(name) {
  let sh = DB().getSheetByName(name);
  if (!sh && SCHEMA[name]) { ensureSheets(); sh = DB().getSheetByName(name); }
  if (!sh) throw new Error('Không tìm thấy sheet "' + name + '".');
  return sh;
}

/** Hàng tiêu đề (header) của sheet. */
function getHeader(name) {
  const sh = getSheet(name);
  const lastCol = sh.getLastColumn();
  return sh.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
}

/**
 * Đọc toàn bộ dòng dữ liệu thành mảng object theo header.
 * Mỗi object có thêm _rowIndex (số dòng thật trên sheet) để tiện cập nhật.
 */
function getRows(name) {
  const sh = getSheet(name);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const header = values[0].map(String);
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const obj = {};
    let empty = true;
    for (let c = 0; c < header.length; c++) {
      const v = values[i][c];
      obj[header[c]] = v;
      if (v !== '' && v !== null) empty = false;
    }
    if (!empty) {
      obj._rowIndex = i + 1;
      rows.push(obj);
    }
  }
  return rows;
}

/** Thêm 1 dòng; map các trường của obj theo đúng thứ tự cột. */
function appendRow(name, obj) {
  const sh = getSheet(name);
  const header = getHeader(name);
  const row = header.map(function (h) {
    return (obj[h] !== undefined && obj[h] !== null) ? obj[h] : '';
  });
  sh.appendRow(row);
  return obj;
}

/** Cập nhật dòng đầu tiên có idField === id bằng các trường trong patch. */
function updateRowById(name, idField, id, patch) {
  const sh = getSheet(name);
  const header = getHeader(name);
  const idCol = header.indexOf(idField);
  if (idCol < 0) throw new Error('Sheet "' + name + '" không có cột ' + idField);
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(id)) {
      for (let c = 0; c < header.length; c++) {
        if (patch[header[c]] !== undefined) {
          sh.getRange(i + 1, c + 1).setValue(patch[header[c]]);
        }
      }
      return true;
    }
  }
  return false;
}

/** Xóa dòng đầu tiên có idField === id. */
function deleteRowById(name, idField, id) {
  const sh = getSheet(name);
  const header = getHeader(name);
  const idCol = header.indexOf(idField);
  if (idCol < 0) throw new Error('Sheet "' + name + '" không có cột ' + idField);
  const values = sh.getDataRange().getValues();
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][idCol]) === String(id)) {
      sh.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

/** Sinh id duy nhất, vd genId('u') -> "u_lq3k8x2a". */
function genId(prefix) {
  const ts = new Date().getTime().toString(36);
  const rnd = Math.floor(Math.random() * 1679616).toString(36); // 36^4
  return (prefix || 'id') + '_' + ts + rnd;
}

/** Thời điểm hiện tại dạng ISO (chuỗi). */
function now() {
  return new Date().toISOString();
}

/** Ngày hôm nay theo giờ VN, dạng yyyy-MM-dd. */
function todayStr() {
  return Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
}

/** Chuẩn hóa ô ngày (Sheet có thể trả Date) về chuỗi yyyy-MM-dd. */
function asDateStr(v) {
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  return v ? String(v) : '';
}

// Giá trị hợp lệ cho môn học & trạng thái.
const VALID_SUBJECTS = ['TOAN', 'VAN', 'ANH', 'LY', 'HOA', 'SINH', 'SU', 'DIA', 'GDCD'];
const VALID_STATUS = ['TODO', 'IN_PROGRESS', 'DONE'];
function validSubject(s) { return VALID_SUBJECTS.indexOf(s) >= 0 ? s : 'TOAN'; }
function validStatus(s) { return VALID_STATUS.indexOf(s) >= 0 ? s : 'TODO'; }

/** Hash SHA-256 (hex) của text + salt — dùng cho mật khẩu. */
function sha256(text, salt) {
  const raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    (salt || '') + text,
    Utilities.Charset.UTF_8
  );
  return raw.map(function (b) {
    return ('0' + (b & 0xff).toString(16)).slice(-2);
  }).join('');
}

/** Kết quả thành công / thất bại chuẩn hóa. */
function jsonOk(data) {
  return { ok: true, data: (data === undefined ? null : data) };
}
function jsonError(msg) {
  return { ok: false, error: String(msg) };
}
