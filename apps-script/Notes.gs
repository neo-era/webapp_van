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
