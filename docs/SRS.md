# SRS — Đặc Tả Yêu Cầu Phần Mềm
## Webapp Lập Kế Hoạch Học Tập THPT ("Học Kế Hoạch")

| | |
|---|---|
| **Phiên bản** | 1.0 |
| **Ngày** | 24/06/2026 |
| **Trạng thái** | Đã triển khai (các tính năng cốt lõi) |
| **Repo** | github.com/neo-era/webapp_van |
| **URL chạy thật** | https://neo-era.github.io/webapp_van/ |

---

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu mô tả yêu cầu của webapp giúp **học sinh THPT lập kế hoạch học tập** và **giáo viên đồng hành, giao nhiệm vụ, theo dõi tiến độ**. Tài liệu dành cho người phát triển, người kiểm thử và chủ sở hữu sản phẩm.

### 1.2 Phạm vi
Sản phẩm là một ứng dụng web cho 2 nhóm người dùng (Học sinh, Giáo viên), gồm:
- Quản lý kế hoạch/nhiệm vụ học tập theo ngày.
- Đặt mục tiêu theo môn và theo dõi tiến độ.
- Lập lộ trình ôn thi THPTQG (đếm ngược + checklist).
- Ghi chú kèm tài liệu đính kèm.
- Giáo viên quản lý lớp, giao việc, xem tiến độ học sinh.

Ngoài phạm vi (phiên bản 1.0): nhắn tin nội bộ, thông báo email/đẩy, thống kê nâng cao, ứng dụng di động native, thanh toán.

### 1.3 Định nghĩa & thuật ngữ
| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| THPTQG | Kỳ thi Tốt nghiệp THPT Quốc gia |
| GAS | Google Apps Script (nền tảng backend) |
| Plan / Nhiệm vụ | Một việc cần làm trong kế hoạch học tập |
| Goal / Mục tiêu | Mục tiêu học tập theo môn, có tiến độ % |
| Token | Chuỗi định danh phiên đăng nhập |
| SPA | Single Page Application |

### 1.4 Tài liệu liên quan
- `CLAUDE.md` — quy ước thiết kế & kỹ thuật.
- `docs/SETUP.md` — hướng dẫn cài đặt backend.
- `PROMPTS.md` — lộ trình phát triển.

---

## 2. Mô tả tổng thể

### 2.1 Bối cảnh sản phẩm
Ứng dụng web độc lập, kiến trúc 3 lớp:
- **Frontend (client):** HTML + CSS + JavaScript thuần, host trên **GitHub Pages**.
- **Backend (API):** **Google Apps Script** (Web App) xử lý nghiệp vụ & phân quyền.
- **Dữ liệu:** **Google Sheets** (cơ sở dữ liệu) + **Google Drive** (lưu tài liệu đính kèm).

```
[Trình duyệt: HTML/JS]  --fetch (POST, text/plain)-->  [Apps Script /exec]  --->  [Google Sheets]
                                                              └────────────────->  [Google Drive]
```

### 2.2 Chức năng tổng quát
1. Xác thực: đăng ký, đăng nhập, đổi mật khẩu, khôi phục phiên.
2. Học sinh: kế hoạch, mục tiêu, ôn thi, ghi chú.
3. Giáo viên: quản lý lớp, giao việc, theo dõi tiến độ.

### 2.3 Nhóm người dùng
| Nhóm | Đặc điểm | Quyền |
|------|----------|-------|
| **Học sinh (STUDENT)** | HS lớp 10–12, dùng điện thoại là chính | Quản lý dữ liệu học tập **của chính mình** |
| **Giáo viên (TEACHER)** | GV phụ trách 1+ lớp | Tạo lớp, giao việc, xem tiến độ HS **trong lớp mình** |

### 2.4 Môi trường vận hành
- Trình duyệt hiện đại (Chrome, Edge, Safari, Firefox) trên di động & desktop.
- Yêu cầu kết nối Internet (gọi Apps Script).
- Tài khoản Google của chủ sở hữu (deploy backend + lưu dữ liệu).

### 2.5 Ràng buộc thiết kế
- **Mobile First**: thiết kế cho màn hình nhỏ trước; không cuộn ngang; nút ≥ 44×44px; chữ ≥ 16px.
- **CORS**: frontend gọi Apps Script bằng `Content-Type: text/plain` (tránh preflight).
- **Hạn mức GAS**: phù hợp quy mô lớp/trường nhỏ; không phải hàng nghìn người dùng đồng thời.
- Không dùng framework nặng / công cụ build (chạy thuần qua CDN).

### 2.6 Giả định & phụ thuộc
- Google Sheets/Drive/Apps Script khả dụng.
- Mỗi học sinh thuộc tối đa **1 lớp** (lưu ở cột `classId`).
- Chủ sở hữu đã cấp quyền (authorize) cho script (gồm Drive cho tính năng đính kèm).

---

## 3. Yêu cầu chức năng

> Ký hiệu: **FR-x**. Mức ưu tiên: **Bắt buộc / Nên có / Tùy chọn**.

### 3.1 Xác thực & tài khoản

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-1 | Người dùng đăng ký tài khoản (họ tên, email, mật khẩu, vai trò). HS có thể chọn lớp. | Bắt buộc |
| FR-2 | Email phải hợp lệ và **không trùng**; mật khẩu tối thiểu 6 ký tự. | Bắt buộc |
| FR-3 | Đăng nhập bằng email + mật khẩu; nhận token phiên. | Bắt buộc |
| FR-4 | Mật khẩu lưu dạng **băm (SHA-256 + salt)**, không lưu thô. | Bắt buộc |
| FR-5 | Phiên hết hạn sau **7 ngày**; tự đăng nhập lại nếu token còn hạn (localStorage). | Nên có |
| FR-6 | Đổi mật khẩu (yêu cầu nhập mật khẩu hiện tại). | Nên có |
| FR-7 | Đăng xuất (xóa token). | Bắt buộc |

### 3.2 Học sinh — Kế hoạch (Lịch)

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-10 | Xem nhiệm vụ theo ngày (chuyển ngày trước/sau). | Bắt buộc |
| FR-11 | Thêm/sửa/xóa nhiệm vụ (tên, môn, ngày, trạng thái). | Bắt buộc |
| FR-12 | Đánh dấu hoàn thành (TODO ↔ DONE). | Bắt buộc |
| FR-13 | Màn hình "Hôm nay" hiển thị nhiệm vụ đến hạn hôm nay + số việc đã xong. | Bắt buộc |
| FR-14 | Phân biệt nhiệm vụ **tự tạo** và **giáo viên giao** (nhãn). | Nên có |

### 3.3 Học sinh — Mục tiêu

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-20 | Thêm/sửa/xóa mục tiêu theo môn (tên, tiến độ %). | Bắt buộc |
| FR-21 | Cập nhật tiến độ 0–100%; hiển thị thanh/vòng tiến độ. | Bắt buộc |
| FR-22 | Màn hình "Hôm nay" hiển thị tóm tắt tiến độ mục tiêu. | Nên có |

### 3.4 Học sinh — Ôn thi THPTQG

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-30 | Thiết lập ngày thi + tổ hợp môn. | Bắt buộc |
| FR-31 | Hiển thị **đếm ngược** số ngày tới kỳ thi (kèm động viên). | Bắt buộc |
| FR-32 | Quản lý checklist nội dung ôn (thêm/đánh dấu/xóa theo môn). | Nên có |

### 3.5 Học sinh — Ghi chú

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-40 | Thêm/sửa/xóa ghi chú (tiêu đề, môn, nội dung). | Bắt buộc |
| FR-41 | Tìm kiếm ghi chú theo từ khóa/môn. | Nên có |
| FR-42 | Đính kèm tài liệu (jpg/png/webp/pdf, ≤10MB) lưu trên Drive. | Tùy chọn |

### 3.6 Giáo viên

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-50 | Tạo lớp mới. | Bắt buộc |
| FR-51 | Xem danh sách lớp mình phụ trách + số học sinh. | Bắt buộc |
| FR-52 | Xem danh sách học sinh trong lớp: tiến độ TB, số nhiệm vụ trễ. | Bắt buộc |
| FR-53 | Giao nhiệm vụ cho **1 học sinh** hoặc **cả lớp** (tên, môn, hạn). | Bắt buộc |
| FR-54 | Nhiệm vụ được giao xuất hiện ở màn hình của học sinh, có nhãn "Giáo viên giao". | Bắt buộc |

### 3.7 Phân quyền (xuyên suốt)

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-60 | Mọi thao tác đọc/ghi **kiểm tra token + vai trò phía backend**. | Bắt buộc |
| FR-61 | Học sinh chỉ truy cập dữ liệu **của chính mình**. | Bắt buộc |
| FR-62 | Giáo viên chỉ truy cập **lớp/học sinh do mình phụ trách**. | Bắt buộc |
| FR-63 | Không tin `role`/`userId` gửi từ client — luôn tra từ Sheet. | Bắt buộc |

---

## 4. Yêu cầu phi chức năng

| Mã | Loại | Yêu cầu |
|----|------|---------|
| NFR-1 | **Hiệu năng** | Thao tác đọc dữ liệu chính ≤ ~3s (giới hạn độ trễ Apps Script); gộp dữ liệu học sinh trong 1 lần gọi (`getStudentData`). |
| NFR-2 | **Khả dụng** | Luôn có chỉ báo tải (loading) khi gọi backend; báo lỗi rõ ràng bằng tiếng Việt. |
| NFR-3 | **Giao diện** | Mobile First, responsive 375–1280px, không cuộn ngang; điều hướng bằng bottom nav. |
| NFR-4 | **Bảo mật** | Băm mật khẩu; token có hạn; kiểm quyền phía server; validate kiểu file & dung lượng khi upload. |
| NFR-5 | **Khả năng bảo trì** | Mọi truy cập Sheet qua helper chung; mã tách theo chức năng (Auth/Plans/Goals/Exam/Notes/Classes). |
| NFR-6 | **Tính riêng tư** | Dữ liệu học tập chỉ hiển thị cho chủ nhân & giáo viên phụ trách; không "bêu tên" công khai. |
| NFR-7 | **Chi phí** | Sử dụng dịch vụ miễn phí (GitHub Pages, Google Sheets/Drive/Apps Script). |
| NFR-8 | **Tương thích** | Chrome/Edge/Safari/Firefox bản hiện hành (di động & desktop). |

---

## 5. Mô hình dữ liệu (Google Sheets)

Mỗi tab là một "bảng". Khóa chính in **đậm**.

### Users
`**userId**, email, passwordHash, name, role(STUDENT|TEACHER), grade, classId, createdAt`

### Classes
`**classId**, name, teacherId, createdAt`

### Plans (kế hoạch/nhiệm vụ)
`**planId**, studentId, title, subject, description, dueDate, status(TODO|IN_PROGRESS|DONE), assignedBy, createdAt`

### Goals (mục tiêu)
`**goalId**, studentId, subject, title, targetValue, progress(0–100), deadline, createdAt`

### ExamPlans (ôn thi, 1 dòng/HS)
`**studentId**, examDate, subjects(csv), milestones(JSON checklist)`

### Notes (ghi chú)
`**noteId**, studentId, subject, title, content, fileUrl, createdAt, updatedAt`

### Sessions (phiên)
`**token**, userId, expiresAt`

**Quan hệ:** `Users.classId → Classes.classId`; `Classes.teacherId → Users.userId`; `Plans/Goals/Notes/ExamPlans.studentId → Users.userId`.

**Danh mục môn:** TOAN, VAN, ANH, LY, HOA, SINH, SU, DIA, GDCD.

---

## 6. Giao diện ngoài

### 6.1 Giao diện người dùng
- **Auth:** đăng nhập / đăng ký.
- **Học sinh:** Hôm nay · Lịch · Mục tiêu · Ôn thi · Ghi chú · Cá nhân (bottom nav).
- **Giáo viên:** Lớp học · Cá nhân.

### 6.2 Giao diện API (Apps Script)
- Điểm cuối duy nhất: `POST {WEB_APP_URL}` với thân JSON `{ action, token, ...payload }`.
- Phản hồi: `{ ok: true, data }` hoặc `{ ok: false, error }`.
- Danh sách action: `register, login, whoami, changePassword, getPublicClasses, getStudentData, getPlans, savePlan, deletePlan, getGoals, saveGoal, deleteGoal, updateProgress, getExamPlan, saveExamPlan, getNotes, saveNote, deleteNote, uploadFile, getTeacherData, assignTask, createClass`.

### 6.3 Giao diện phần cứng/phần mềm khác
- Google Drive: lưu tài liệu đính kèm (folder `THPT_Files`, chia sẻ "ai có link đều xem").

---

## 7. Trường hợp sử dụng tiêu biểu

**UC-1 — Học sinh đánh dấu hoàn thành nhiệm vụ**
1. HS đăng nhập → màn hình Hôm nay.
2. Nhấn ô chọn cạnh nhiệm vụ.
3. Hệ thống cập nhật trạng thái DONE (lạc quan) và lưu xuống Sheet.
4. Nếu lỗi → hoàn tác + thông báo.

**UC-2 — Giáo viên giao việc cho cả lớp**
1. GV đăng nhập → chọn lớp.
2. Nhấn "Giao việc" → chọn "Cả lớp", nhập tên/môn/hạn.
3. Hệ thống tạo nhiệm vụ cho từng HS (assignedBy = GV).
4. Mỗi HS thấy nhiệm vụ mới có nhãn "Giáo viên giao".

**UC-3 — Học sinh đăng ký & vào lớp**
1. Mở app → "Đăng ký".
2. Nhập thông tin, chọn vai trò Học sinh, chọn lớp (nếu có).
3. Hệ thống tạo tài khoản và tự đăng nhập.

---

## 8. Tiêu chí chấp nhận (tóm tắt kiểm thử)

- [ ] Đăng ký/đăng nhập/đổi mật khẩu hoạt động; mật khẩu sai bị từ chối.
- [ ] Học sinh A không xem/sửa được dữ liệu của học sinh B.
- [ ] Giáo viên chỉ thấy học sinh trong lớp mình.
- [ ] CRUD kế hoạch/mục tiêu/ghi chú ghi đúng vào Sheet.
- [ ] Giáo viên giao việc → học sinh nhận đúng, có nhãn.
- [ ] Đếm ngược ngày thi tính đúng.
- [ ] Upload tài liệu: chặn sai định dạng/quá 10MB; lưu link Drive.
- [ ] Mobile (375–768px): không cuộn ngang, bottom nav hoạt động.
- [ ] Có loading + thông báo lỗi tiếng Việt khi gọi backend.

---

## 9. Lịch sử phiên bản

| Phiên bản | Ngày | Thay đổi |
|-----------|------|----------|
| 1.0 | 24/06/2026 | Bản đầu tiên — đặc tả theo hệ thống đã triển khai (Auth, Học sinh, Giáo viên, đăng ký, đổi MK, khôi phục phiên, upload Drive). |
