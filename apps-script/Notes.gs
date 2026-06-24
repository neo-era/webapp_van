/**
 * Notes.gs — Ghi chú (sheet Notes). Hiện hỗ trợ ghi chú dạng văn bản.
 * Upload tài liệu lên Drive sẽ bổ sung sau (cần thêm quyền Drive → authorize lại).
 */

function cleanNote(n) {
  return {
    noteId: n.noteId, studentId: n.studentId, subject: n.subject, title: n.title,
    content: n.content, fileUrl: n.fileUrl, updatedAt: asDateStr(n.updatedAt) || n.updatedAt,
  };
}

function getNotes(req) {
  const user = requireAuth(req.token);
  const notes = getRows('Notes')
    .filter(function (n) { return String(n.studentId) === String(user.userId); })
    .map(cleanNote);
  return jsonOk(notes);
}

function saveNote(req) {
  const user = requireAuth(req.token);
  const n = req.note || {};
  if (!n.title) return jsonError('Vui lòng nhập tiêu đề ghi chú');

  const fields = {
    subject: validSubject(n.subject),
    title: String(n.title),
    content: n.content ? String(n.content) : '',
    fileUrl: n.fileUrl ? String(n.fileUrl) : '',
    updatedAt: now(),
  };

  if (n.noteId) {
    const existing = getRows('Notes').find(function (x) { return String(x.noteId) === String(n.noteId); });
    if (!existing) return jsonError('Không tìm thấy ghi chú');
    if (String(existing.studentId) !== String(user.userId)) return jsonError('Không có quyền sửa ghi chú này');
    updateRowById('Notes', 'noteId', n.noteId, fields);
    return jsonOk(cleanNote(Object.assign(existing, fields)));
  }

  const note = Object.assign({ noteId: genId('n'), studentId: user.userId, createdAt: now() }, fields);
  appendRow('Notes', note);
  return jsonOk(cleanNote(note));
}

function deleteNote(req) {
  const user = requireAuth(req.token);
  const existing = getRows('Notes').find(function (x) { return String(x.noteId) === String(req.noteId); });
  if (!existing) return jsonError('Không tìm thấy ghi chú');
  if (String(existing.studentId) !== String(user.userId)) return jsonError('Không có quyền xóa ghi chú này');
  deleteRowById('Notes', 'noteId', req.noteId);
  return jsonOk({ deleted: req.noteId });
}

/** Upload tài liệu lên Google Drive (folder THPT_Files), trả link xem. */
function uploadFile(req) {
  requireAuth(req.token);
  const allowed = { 'image/jpeg': 1, 'image/png': 1, 'image/webp': 1, 'application/pdf': 1 };
  if (!allowed[req.mimeType]) return jsonError('Chỉ chấp nhận file jpg, png, webp, pdf');
  if (!req.dataBase64) return jsonError('Thiếu dữ liệu file');

  const bytes = Utilities.base64Decode(req.dataBase64);
  if (bytes.length > 10 * 1024 * 1024) return jsonError('File tối đa 10MB');

  const folder = getOrCreateFolder_('THPT_Files');
  const blob = Utilities.newBlob(bytes, req.mimeType, req.filename || 'file');
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return jsonOk({ fileUrl: file.getUrl(), name: file.getName() });
}

function getOrCreateFolder_(name) {
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}
