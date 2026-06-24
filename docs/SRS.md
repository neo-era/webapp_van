# SRS — Đặc Tả Yêu Cầu Phần Mềm
## Webapp Lập Kế Hoạch Học Tập THPT ("Học Kế Hoạch")

| | |
|---|---|
| **Phiên bản** | 2.0 |
| **Ngày** | 24/06/2026 |
| **Trạng thái** | Phần I đã triển khai · Phần II là kế hoạch mở rộng |
| **Repo** | github.com/neo-era/webapp_van |
| **URL chạy thật** | https://neo-era.github.io/webapp_van/ |

> **Cấu trúc tài liệu:** **Phần I (§1–§9)** mô tả hệ thống lập kế hoạch học tập **đã triển khai**. **Phần II (§10–§17)** đặc tả **mở rộng thành nền tảng học tập** (bài giảng, giáo viên AI, ngân hàng đề, luyện thi IELTS/TOEIC) — **kế hoạch, chưa triển khai**.

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

**Mở rộng (phiên bản 2.0 — kế hoạch, xem Phần II):**
- Danh mục môn học theo khối (Chương trình GDPT 2018).
- Hệ thống bài giảng chất lượng cao (cốt lõi + nâng cao + chuyên).
- Giáo viên AI (chatbot, dùng Claude API).
- Ngân hàng đề & bài kiểm tra nhiều cấp độ, tự chấm.
- Luyện thi tiếng Anh IELTS (4.5→6.5) và TOEIC (450→650).

Ngoài phạm vi: nhắn tin nội bộ, thông báo email/đẩy, thống kê nâng cao, ứng dụng di động native, thanh toán.

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

# PHẦN II — MỞ RỘNG: NỀN TẢNG HỌC TẬP (v2.0 — KẾ HOẠCH)

## 10. Tổng quan mở rộng

Nâng cấp từ công cụ lập kế hoạch thành **nền tảng học tập THPT** theo **Chương trình GDPT 2018**, gồm 5 module:

| Module | Tên | Phụ thuộc |
|--------|-----|-----------|
| **A** | Danh mục môn học theo khối | (nền tảng) |
| **B** | Hệ thống bài giảng | A |
| **C** | Giáo viên AI (chatbot Claude) | B |
| **D** | Ngân hàng đề & bài kiểm tra | A, B |
| **E** | Luyện thi IELTS / TOEIC | B, C, D |

### 10.1 Phạm vi MVP
- **Khối 12**, 4 môn: **Toán, Vật lí, Hóa học, Tiếng Anh**.
- Nội dung tạo theo quy trình **AI sinh nháp → giáo viên duyệt → xuất bản**.
- Giáo viên AI dùng **Claude API**, tích hợp ngay từ giai đoạn đầu.

### 10.2 Phân cấp nội dung
- **Khối:** 10 · 11 · 12.
- **Mức độ:** Cơ bản · Nâng cao · **Chuyên** (Phổ thông Năng khiếu, Lê Hồng Phong…).
- **Độ khó câu hỏi (chuẩn Bộ GD):** Nhận biết (NB) · Thông hiểu (TH) · Vận dụng (VD) · Vận dụng cao (VDC).

> "Trường chuyên biệt" được mô hình hóa bằng **mức độ Chuyên** (lớp nội dung/đề nâng cao hơn), không phải khung chương trình khác.

> **Khung chương trình:** **GDPT 2018** là khung hiện hành (Thông tư 32/2018/TT-BGDĐT); năm 2026 lớp 12 đã áp dụng hoàn toàn. Không có "GDPT 2026". Lưu ý: từ **năm học 2026–2027** dùng **bộ SGK thống nhất toàn quốc** — nội dung bài giảng/đề nên bám bộ SGK này và cập nhật theo các điều chỉnh nội dung của Bộ GD&ĐT (nếu có).

### 10.3 Vai trò mở rộng
Thêm vai trò **Quản trị nội dung (CONTENT_ADMIN)** — có thể là giáo viên được cấp quyền — phụ trách sinh nháp AI, duyệt và xuất bản bài giảng/câu hỏi. (Giai đoạn đầu: gộp vào vai trò Giáo viên.)

---

## 11. Module A — Danh mục môn học theo khối

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-100 | Lưu danh mục môn học theo Chương trình GDPT 2018, gắn với khối (10/11/12). | Bắt buộc |
| FR-101 | Mỗi môn có cây chủ đề: **Chương → Bài** (chuyên đề). | Bắt buộc |
| FR-102 | Phân loại môn: bắt buộc / tự chọn; gắn mức độ nội dung (Cơ bản/Nâng cao/Chuyên). | Nên có |
| FR-103 | Quản trị thêm/sửa/ẩn môn, chương, bài. | Bắt buộc |

**Danh mục môn lớp 12 (GDPT 2018) — tham khảo:**
- *Bắt buộc:* Ngữ văn, Toán, Ngoại ngữ 1 (Tiếng Anh), Lịch sử, GDQP-AN, GD thể chất, HĐ trải nghiệm–hướng nghiệp, ND giáo dục địa phương.
- *Tự chọn (theo định hướng):* Vật lí, Hóa học, Sinh học, Địa lí, GD kinh tế & pháp luật, Tin học, Công nghệ, Âm nhạc, Mĩ thuật.
- **MVP triển khai:** Toán · Vật lí · Hóa học · Tiếng Anh.

---

## 12. Module B — Hệ thống bài giảng

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-110 | Bài giảng gắn với (môn, khối, chủ đề, mức độ), nội dung dạng **Markdown** (hỗ trợ công thức, hình ảnh, bảng). | Bắt buộc |
| FR-111 | Học sinh xem bài giảng theo cây chủ đề; đánh dấu **đã học**. | Bắt buộc |
| FR-112 | Mỗi bài có phần **Cốt lõi** và **Nâng cao** tách bạch, trình bày dễ đọc. | Bắt buộc |
| FR-113 | Trạng thái bài giảng: **DRAFT → REVIEW → PUBLISHED**; chỉ PUBLISHED hiển thị cho HS. | Bắt buộc |
| FR-114 | Liên kết bài giảng ↔ câu hỏi luyện tập (Module D) và ↔ giáo viên AI (Module C). | Nên có |
| FR-115 | Theo dõi tiến độ học theo chủ đề (đã học / tổng số bài). | Nên có |

> Công thức Toán/Lý/Hóa: dùng cú pháp **KaTeX/MathJax** trong Markdown. Hình ảnh lưu trên Drive (như tài liệu đính kèm hiện có).

---

## 13. Module C — Giáo viên AI (chatbot)

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-120 | Học sinh hỏi đáp với AI trong ngữ cảnh **bài giảng đang xem** (giải thích, ví dụ, gợi ý). | Bắt buộc |
| FR-121 | AI **bám nội dung bài giảng đã xuất bản** (đưa nội dung bài làm ngữ cảnh — RAG đơn giản). | Bắt buộc |
| FR-122 | AI **không làm hộ** bài kiểm tra/thi đang diễn ra; chỉ gợi ý hướng. | Bắt buộc |
| FR-123 | Giới hạn số lượt hỏi/HS/ngày để kiểm soát chi phí. | Bắt buộc |
| FR-124 | Lưu lịch sử hội thoại (tùy chọn) để HS xem lại. | Nên có |
| FR-125 | (Module E) AI chấm & góp ý bài Writing/Speaking theo tiêu chí. | Nên có |

### 13.1 Kiến trúc AI
- Backend Apps Script gọi **Claude API** qua `UrlFetchApp` (action `aiChat`).
- **Khóa API** lưu trong **Script Properties** (`CLAUDE_API_KEY`) — không lộ ra client.
- **Model:** mặc định **Claude Haiku 4.5** (rẻ, nhanh) cho hỏi đáp thường; nâng lên **Sonnet 4.6 / Opus 4.8** cho câu hỏi khó hoặc chấm bài.
- **Ngữ cảnh:** đính kèm nội dung bài giảng liên quan + câu hỏi của HS vào prompt.
- **Guardrail:** chỉ phạm vi học tập; từ chối nội dung ngoài lề; không tiết lộ đáp án bài thi đang làm.
- **Kiểm soát chi phí:** giới hạn lượt/ngày; ghi log token (sheet `AIChats`).
- **Độ trễ:** Apps Script không stream → trả nguyên câu (~3–10s); luôn hiển thị loading.
- **Riêng tư:** không gửi thông tin cá nhân nhạy cảm sang API.

---

## 14. Module D — Ngân hàng đề & bài kiểm tra

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-130 | Ngân hàng câu hỏi gắn (môn, khối, chủ đề, **độ khó NB/TH/VD/VDC**, mức độ). | Bắt buộc |
| FR-131 | Loại câu hỏi: trắc nghiệm 1 đáp án, nhiều đáp án, đúng/sai, trả lời ngắn, tự luận. | Bắt buộc |
| FR-132 | Tạo đề: chọn thủ công hoặc **tự sinh theo ma trận** (số câu mỗi độ khó/chủ đề). | Nên có |
| FR-133 | HS làm bài có **đếm giờ**; nộp bài; **tự chấm** phần trắc nghiệm. | Bắt buộc |
| FR-134 | Hiển thị kết quả + **lời giải/giải thích** từng câu sau khi nộp. | Bắt buộc |
| FR-135 | Tự luận/Writing: chấm bằng **AI theo rubric** (tùy chọn), giáo viên duyệt lại. | Nên có |
| FR-136 | Lưu lịch sử làm bài; thống kê điểm theo chủ đề để gợi ý ôn tập. | Nên có |
| FR-137 | Giáo viên giao đề cho lớp/học sinh (mở rộng từ FR-53). | Nên có |

---

## 15. Module E — Luyện thi IELTS / TOEIC

> Hỗ trợ **cả hai**: **IELTS** mục tiêu **4.5 → 6.5** và **TOEIC** mục tiêu **450 → 650**.

| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-140 | Bài kiểm tra đầu vào (placement) → xác định trình độ & lộ trình mục tiêu. | Nên có |
| FR-141 | Nội dung theo **kỹ năng**: IELTS (Listening, Reading, Writing, Speaking); TOEIC (Listening, Reading). | Bắt buộc |
| FR-142 | Bài giảng từ vựng/ngữ pháp/chiến lược làm bài theo từng band/mốc điểm. | Bắt buộc |
| FR-143 | **Đề luyện & thi thử** theo định dạng IELTS/TOEIC; tự chấm Listening/Reading. | Bắt buộc |
| FR-144 | **AI chấm Writing/Speaking** theo tiêu chí (band descriptors), kèm góp ý cải thiện. | Nên có |
| FR-145 | Theo dõi tiến độ band/điểm theo thời gian; lộ trình tới mục tiêu. | Nên có |

> Tái sử dụng Module B (bài giảng) và D (đề/câu hỏi) với môn = `IELTS` / `TOEIC` và trường **kỹ năng**. Audio (Listening) lưu trên Drive.

---

## 16. Mô hình dữ liệu mở rộng & quy trình nội dung

### 16.1 Bảng dữ liệu mới (Google Sheets)
| Bảng | Cột chính |
|------|-----------|
| **Subjects** | subjectCode, name, grades(csv), category(BAT_BUOC/TU_CHON), active |
| **Topics** | topicId, subjectCode, grade, parentId(chương), title, order |
| **Lessons** | lessonId, subjectCode, grade, topicId, title, level(CO_BAN/NANG_CAO/CHUYEN), skill(cho IELTS/TOEIC), contentMd, order, status(DRAFT/REVIEW/PUBLISHED), source(AI/MANUAL/IMPORT), createdBy, updatedAt |
| **Questions** | questionId, subjectCode, grade, topicId, type, difficulty(NB/TH/VD/VDC), level, stem, options(JSON), answer, explanation, status, source |
| **Exams** | examId, title, subjectCode, grade, kind(PRACTICE/TEST/MOCK), questionIds(JSON), durationMin, level, published |
| **Attempts** | attemptId, studentId, examId, answers(JSON), score, maxScore, startedAt, submittedAt |
| **LessonProgress** | studentId, lessonId, status(LEARNED), updatedAt |
| **AIChats** | msgId, studentId, context(lessonId), role(USER/ASSISTANT), content, model, tokens, createdAt |

### 16.2 Quy trình nội dung (AI sinh nháp + duyệt)
| Mã | Yêu cầu | Ưu tiên |
|----|---------|---------|
| FR-150 | Công cụ quản trị **sinh nháp** bài giảng/câu hỏi bằng AI theo (môn, khối, chủ đề, mức độ). | Bắt buộc |
| FR-151 | Nội dung AI tạo ở trạng thái **DRAFT**, không hiển thị cho HS. | Bắt buộc |
| FR-152 | Giáo viên **chỉnh sửa & duyệt** → chuyển **PUBLISHED** mới hiển thị. | Bắt buộc |
| FR-153 | Ghi nhận **nguồn** nội dung (AI/MANUAL/IMPORT) và người duyệt. | Nên có |

Trạng thái: `DRAFT → REVIEW → PUBLISHED` (có thể quay lại DRAFT khi cần sửa).

---

## 17. Yêu cầu phi chức năng bổ sung, lộ trình & rủi ro

### 17.1 Phi chức năng bổ sung
| Mã | Yêu cầu |
|----|---------|
| NFR-10 | **Chi phí AI** kiểm soát được: chọn model theo nhu cầu, giới hạn lượt/ngày, log token. |
| NFR-11 | **Chất lượng nội dung**: mọi bài giảng/câu hỏi phải qua **duyệt người** trước khi xuất bản. |
| NFR-12 | **Bảo mật khóa AI**: lưu server-side (Script Properties), không lộ client. |
| NFR-13 | **Khả năng mở rộng dữ liệu**: nếu ngân hàng đề/nội dung lớn vượt giới hạn Google Sheets, sẵn sàng **chuyển DB** (vd Supabase/Postgres) — thiết kế lớp truy cập tách biệt để dễ thay. |
| NFR-14 | **Liêm chính học thuật**: AI không tiết lộ đáp án khi đang làm bài thi. |

### 17.2 Lộ trình triển khai
- **GĐ 1 — Nền tảng nội dung:** Module A + B; thí điểm **Toán 12**; quy trình AI-draft + duyệt; tích hợp **Giáo viên AI (C)** trên bài giảng.
- **GĐ 2 — Đánh giá:** Module D (ngân hàng đề, làm bài, tự chấm, lời giải).
- **GĐ 3 — Mở rộng môn:** hoàn thiện **Vật lí, Hóa học, Tiếng Anh** lớp 12 (bài giảng + đề).
- **GĐ 4 — Luyện thi:** Module E (IELTS 4.5→6.5 & TOEIC 450→650), AI chấm Writing/Speaking.
- **GĐ 5 (tùy chọn):** mở rộng khối 10–11, mức độ Chuyên, di chuyển DB nếu cần.

### 17.3 Rủi ro & giảm thiểu
| Rủi ro | Mức | Giảm thiểu |
|--------|-----|-----------|
| Khối lượng nội dung lớn | Cao | AI sinh nháp + duyệt; làm cuốn chiếu từng môn/chủ đề |
| Chi phí API AI tăng | Trung bình | Model rẻ mặc định, giới hạn lượt, cache câu hỏi thường gặp |
| Giới hạn Google Sheets/GAS | Trung bình | Tách lớp dữ liệu, sẵn sàng chuyển Postgres; phân trang dữ liệu |
| Chất lượng/độ chính xác nội dung AI | Cao | Bắt buộc duyệt người; đối chiếu SGK/khung GDPT 2018 |
| Bản quyền tài liệu nhập | Trung bình | Chỉ dùng nguồn được phép; ưu tiên nội dung tự soạn/AI |

---

## 18. Lịch sử phiên bản

| Phiên bản | Ngày | Thay đổi |
|-----------|------|----------|
| 1.0 | 24/06/2026 | Bản đầu tiên — đặc tả theo hệ thống đã triển khai (Auth, Học sinh, Giáo viên, đăng ký, đổi MK, khôi phục phiên, upload Drive). |
| 2.0 | 24/06/2026 | Thêm Phần II — mở rộng nền tảng học tập: danh mục môn theo khối, bài giảng, giáo viên AI (Claude), ngân hàng đề & kiểm tra, luyện thi IELTS/TOEIC; mô hình dữ liệu mở rộng, kiến trúc AI, quy trình nội dung, lộ trình, rủi ro. |
