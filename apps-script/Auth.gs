/**
 * Auth.gs — Đăng nhập, đăng ký, phiên làm việc và phân quyền.
 *
 * Quy tắc 2 (CLAUDE.md): luôn tra role/quyền từ sheet, KHÔNG tin client.
 */

const SESSION_HOURS = 24 * 7; // phiên đăng nhập hết hạn sau 7 ngày

/** Đăng ký tài khoản mới vào sheet Users. */
function register(req) {
  const email = String(req.email || '').trim().toLowerCase();
  const password = String(req.password || '');
  const name = String(req.name || '').trim();
  const role = (req.role === 'TEACHER') ? 'TEACHER' : 'STUDENT';

  if (!email || !password || !name) return jsonError('Vui lòng nhập đủ họ tên, email và mật khẩu');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return jsonError('Email không hợp lệ');
  if (password.length < 6) return jsonError('Mật khẩu tối thiểu 6 ký tự');

  const users = getRows('Users');
  if (users.some(function (u) { return String(u.email).toLowerCase() === email; })) {
    return jsonError('Email này đã được đăng ký');
  }

  const user = {
    userId: genId('u'),
    email: email,
    passwordHash: sha256(password, SALT),
    name: name,
    role: role,
    grade: (role === 'STUDENT') ? (req.grade || '') : '',
    classId: (role === 'STUDENT') ? (req.classId || '') : '',
    createdAt: now(),
  };
  appendRow('Users', user);
  return jsonOk(publicUser(user));
}

/** Đăng nhập: kiểm tra email + mật khẩu, sinh token lưu sheet Sessions. */
function login(req) {
  const email = String(req.email || '').trim().toLowerCase();
  const password = String(req.password || '');

  const users = getRows('Users');
  const user = users.find(function (u) { return String(u.email).toLowerCase() === email; });
  if (!user || user.passwordHash !== sha256(password, SALT)) {
    return jsonError('Email hoặc mật khẩu không đúng');
  }

  const token = Utilities.getUuid();
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString();
  appendRow('Sessions', { token: token, userId: user.userId, expiresAt: expiresAt });

  return jsonOk({ token: token, user: publicUser(user) });
}

/** Trả về thông tin user từ token (dùng khôi phục phiên khi tải lại trang). */
function whoami(req) {
  const user = requireAuth(req.token);
  return jsonOk(publicUser(user));
}

/** Đổi mật khẩu (cần mật khẩu hiện tại). */
function changePassword(req) {
  const user = requireAuth(req.token);
  const oldP = String(req.oldPassword || '');
  const newP = String(req.newPassword || '');
  if (newP.length < 6) return jsonError('Mật khẩu mới tối thiểu 6 ký tự');
  if (user.passwordHash !== sha256(oldP, SALT)) return jsonError('Mật khẩu hiện tại không đúng');
  updateRowById('Users', 'userId', user.userId, { passwordHash: sha256(newP, SALT) });
  return jsonOk({ changed: true });
}

/** Lọc bỏ passwordHash trước khi trả về client. */
function publicUser(u) {
  return {
    userId: u.userId, email: u.email, name: u.name,
    role: u.role, grade: u.grade, classId: u.classId,
  };
}

/**
 * Bắt buộc đã đăng nhập. Trả về user (object đầy đủ từ sheet) hoặc ném lỗi.
 * Dùng ở đầu mọi hàm cần xác thực.
 */
function requireAuth(token) {
  if (!token) throw new Error('Bạn chưa đăng nhập');
  const session = getRows('Sessions').find(function (s) {
    return String(s.token) === String(token);
  });
  if (!session) throw new Error('Phiên không hợp lệ, vui lòng đăng nhập lại');
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    throw new Error('Phiên đã hết hạn, vui lòng đăng nhập lại');
  }
  const user = getRows('Users').find(function (u) {
    return String(u.userId) === String(session.userId);
  });
  if (!user) throw new Error('Tài khoản không tồn tại');
  return user;
}

/** Như requireAuth + bắt buộc là giáo viên. */
function requireTeacher(token) {
  const user = requireAuth(token);
  if (user.role !== 'TEACHER') throw new Error('Chỉ giáo viên mới có quyền thực hiện việc này');
  return user;
}

/** Học sinh chỉ truy cập dữ liệu của mình; giáo viên truy cập học sinh trong lớp mình. */
function canAccessStudent(user, studentId) {
  if (!user) return false;
  if (user.role === 'STUDENT') return String(user.userId) === String(studentId);
  if (user.role === 'TEACHER') {
    const student = getRows('Users').find(function (u) {
      return String(u.userId) === String(studentId);
    });
    if (!student || !student.classId) return false;
    return canAccessClass(user, student.classId);
  }
  return false;
}

/** Giáo viên chỉ truy cập lớp do mình phụ trách. */
function canAccessClass(user, classId) {
  if (!user || user.role !== 'TEACHER') return false;
  const cls = getRows('Classes').find(function (c) {
    return String(c.classId) === String(classId);
  });
  return !!cls && String(cls.teacherId) === String(user.userId);
}

/* ============================================================
   Hàm test chạy trực tiếp trong trình Apps Script (nút Run).
   Lưu ý: chạy nhiều lần sẽ tạo nhiều user/session — xóa bớt trong Sheet nếu cần.
   ============================================================ */
function _testAuth() {
  const email = 'test_' + new Date().getTime() + '@demo.com';
  Logger.log('register: ' + JSON.stringify(register({
    email: email, password: '123456', name: 'HS Test', role: 'STUDENT', grade: 12
  })));
  const res = login({ email: email, password: '123456' });
  Logger.log('login: ' + JSON.stringify(res));
  const token = res.data.token;
  Logger.log('requireAuth: ' + JSON.stringify(requireAuth(token)));
  Logger.log('login sai mật khẩu: ' + JSON.stringify(login({ email: email, password: 'sai' })));
}
