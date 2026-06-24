# CLAUDE.md — Webapp Lập Kế Hoạch Học Tập THPT (HTML + Google Sheets)

---

## QUY TẮC BẮT BUỘC

> **Các quy tắc này có độ ưu tiên cao nhất — không được bỏ qua trong bất kỳ trường hợp nào.**

### 1. Kiến trúc: HTML + Google Apps Script + Google Sheets

> Giống cách làm app **chấm công**: frontend HTML, backend là Google Apps Script, database là Google Sheets.

- **Frontend:** HTML + CSS + JavaScript thuần (KHÔNG dùng React/Next.js/framework nặng)
- **Backend:** Google Apps Script (`Code.gs`) — xử lý `doGet`/`doPost`, đọc/ghi Google Sheets
- **Database:** một Google Sheet, mỗi sheet (tab) là một "bảng" dữ liệu
- **Giao tiếp:** frontend gọi backend qua `google.script.run` (nếu serve bằng HtmlService) **hoặc** `fetch()` tới Web App URL
- **KHÔNG** dùng thư viện build (npm, webpack). Mọi thư viện nạp qua CDN `<script>` nếu cần

### 2. Phân quyền Giáo viên vs Học sinh — kiểm tra phía Apps Script

- Mọi hàm backend đọc/ghi dữ liệu **bắt buộc** nhận `token`/`userId` và kiểm tra vai trò trước khi xử lý
- Học sinh **chỉ** đọc/sửa dòng dữ liệu có `studentId` = chính mình
- Giáo viên **chỉ** xem học sinh thuộc lớp mình phụ trách
- **Không bao giờ** tin `role` gửi từ client — luôn tra lại trong sheet `Users` theo token
- Mật khẩu lưu dạng **hash** trong sheet (không lưu plaintext)

### 3. Mobile First — Học sinh dùng điện thoại là chính

- Viết CSS mobile trước, scale lên desktop bằng `@media (min-width: 768px)`
- Test ở `375px`, `390px`, `768px`, `1280px`
- Không có horizontal scroll trên mobile
- Nút bấm tối thiểu `44×44px`; font tối thiểu `16px` trên mobile
- Điều hướng mobile: **bottom tab bar** (Lịch · Mục tiêu · Ôn thi · Ghi chú · Cá nhân)
- Lịch trên mobile: list view theo ngày, KHÔNG nhồi grid 7 cột

### 4. Tính riêng tư & động lực học tập

- Dữ liệu học tập là riêng tư — chỉ học sinh đó và giáo viên phụ trách được xem
- Không "bêu tên" công khai điểm yếu
- Đếm ngược ngày thi: nhẹ nhàng, kèm động viên — không gây áp lực tiêu cực

### 5. Trải nghiệm tải dữ liệu

- Apps Script phản hồi **chậm hơn** server thường (1–3 giây) → luôn có **loading indicator**
- Cache dữ liệu vào biến JS / `localStorage` để không gọi lại liên tục
- Gộp request khi có thể (lấy nhiều dữ liệu trong 1 lần gọi)

---

## Project Overview

Webapp giúp **học sinh THPT lập kế hoạch học tập** và **giáo viên đồng hành, giao lộ trình, theo dõi tiến độ** — xây dựng bằng **HTML + Google Apps Script + Google Sheets**.

- **Đối tượng:** Giáo viên + Học sinh (2 vai trò)
- **Mục đích:** Học sinh tổ chức việc học, theo dõi mục tiêu, ôn thi THPTQG; giáo viên giao việc và nắm tiến độ
- **Vì sao chọn stack này:** Miễn phí, không cần server riêng, dễ bảo trì, giống app chấm công đang dùng — nhập liệu/xem dữ liệu trực tiếp trên Google Sheet rất tiện
- **Ngôn ngữ:** Tiếng Việt

### Luồng sử dụng

**Học sinh:** Đăng nhập → xem việc cần làm hôm nay → đánh dấu hoàn thành → cập nhật tiến độ mục tiêu → ôn thi → ghi chú.

**Giáo viên:** Đăng nhập → chọn lớp → giao nhiệm vụ cho học sinh/cả lớp → xem tiến độ → nhắc nhở.

---

## Tech Stack

| Thành phần | Công nghệ | Ghi chú |
|-----------|-----------|---------|
| Giao diện | **HTML5 + CSS3 + JavaScript (ES6)** thuần | Không framework |
| Backend | **Google Apps Script** (`.gs`) | doGet/doPost, hàm xử lý dữ liệu |
| Database | **Google Sheets** | Mỗi tab = 1 bảng |
| Lưu file/tài liệu | **Google Drive** | Apps Script tạo folder, lưu link vào Sheet |
| Icon | **lucide** (CDN) hoặc emoji | Nhẹ, không cần build |
| Ngày tháng | **Day.js** (CDN) | Đếm ngược, format ngày |
| Hosting frontend | **GitHub Pages** (đã chốt) | URL: neo-era.github.io/webapp_van |

> **Triển khai (đã chốt):** Frontend tĩnh trên **GitHub Pages**, gọi backend Apps Script bằng `fetch`.
>
> **Xử lý CORS (BẮT BUỘC làm đúng):** Apps Script không hỗ trợ preflight, nên frontend phải gửi request "đơn giản":
> - `method: 'POST'`, `body: JSON.stringify({action, token, ...})`
> - `headers: { 'Content-Type': 'text/plain;charset=utf-8' }` ← KHÔNG dùng `application/json` (sẽ bị preflight → lỗi CORS)
> - KHÔNG set header tùy chỉnh khác; để `redirect: 'follow'` (mặc định)
> - Apps Script `doPost` đọc body qua `e.postData.contents` (vẫn parse JSON bình thường)
>
> Web App phải deploy **"Anyone"** thì fetch ẩn danh mới gọi được. Bảo mật dựa vào token + phân quyền trong code, không dựa vào quyền Google.
>
> GitHub Pages cũng dùng làm **bản demo dữ liệu mẫu**: nếu chưa cấu hình Web App URL, frontend tự chạy ở chế độ mock (xem `frontend/api.js`).

---

## Database — Cấu trúc Google Sheets

> Một Google Sheet tên **"THPT_Database"**, gồm các tab sau. Hàng 1 là tiêu đề cột (header).

### Sheet `Users`
| userId | email | passwordHash | name | role | grade | classId | createdAt |
|--------|-------|--------------|------|------|-------|---------|-----------|
| u001 | hs1@... | (hash) | Nguyễn Văn A | STUDENT | 12 | c001 | ... |
| u002 | gv1@... | (hash) | Cô Lan | TEACHER | | | ... |

- `role`: `STUDENT` hoặc `TEACHER`
- `grade`: 10/11/12 (chỉ học sinh)
- `classId`: lớp học sinh thuộc về (chỉ học sinh)

### Sheet `Classes`
| classId | name | teacherId | createdAt |
|---------|------|-----------|-----------|
| c001 | 12A1 | u002 | ... |

### Sheet `Plans` (kế hoạch / nhiệm vụ học tập)
| planId | studentId | title | subject | description | dueDate | status | assignedBy | createdAt |
|--------|-----------|-------|---------|-------------|---------|--------|------------|-----------|

- `subject`: TOAN, VAN, ANH, LY, HOA, SINH, SU, DIA, GDCD
- `status`: TODO, IN_PROGRESS, DONE
- `assignedBy`: rỗng = học sinh tự tạo; có userId giáo viên = được giao

### Sheet `Goals` (mục tiêu theo môn)
| goalId | studentId | subject | title | targetValue | progress | deadline | createdAt |
|--------|-----------|---------|-------|-------------|----------|----------|-----------|

- `progress`: 0–100 (%)

### Sheet `ExamPlans` (ôn thi THPTQG)
| studentId | examDate | subjects | milestones |
|-----------|----------|----------|------------|

- `subjects`: danh sách môn, ngăn cách dấu phẩy (vd: "TOAN,VAN,ANH")
- `milestones`: JSON các mốc ôn tập

### Sheet `Notes` (ghi chú)
| noteId | studentId | subject | title | content | fileUrl | createdAt | updatedAt |
|--------|-----------|---------|-------|---------|---------|-----------|-----------|

### Sheet `Sessions` (phiên đăng nhập — tùy chọn)
| token | userId | expiresAt |
|-------|--------|-----------|

---

## File Structure

```
webapp-thpt/
├── README.md
├── apps-script/                  # Code chạy trên Google Apps Script
│   ├── Code.gs                   # doGet, doPost, router
│   ├── Auth.gs                   # đăng nhập, hash, kiểm tra token, phân quyền
│   ├── Plans.gs                  # CRUD kế hoạch
│   ├── Goals.gs                  # CRUD mục tiêu + tiến độ
│   ├── Exam.gs                   # ôn thi
│   ├── Notes.gs                  # ghi chú + upload Drive
│   ├── Classes.gs                # lớp + chức năng giáo viên
│   └── Utils.gs                  # đọc/ghi sheet, sinh id, hash, helper
│
├── frontend/                     # File HTML (đẩy lên Apps Script qua HtmlService)
│   ├── index.html                # khung app + router phía client
│   ├── styles.html               # <style> CSS (HtmlService include)
│   ├── app.html                  # <script> JS chính (HtmlService include)
│   └── components/               # (nếu tách) các đoạn HTML/JS theo màn hình
│       ├── login.html
│       ├── today.html
│       ├── calendar.html
│       ├── goals.html
│       ├── exam.html
│       ├── notes.html
│       └── teacher.html
│
└── docs/
    └── SETUP.md                  # hướng dẫn tạo Sheet, deploy Web App
```

> Nếu dùng **HtmlService**, các file `.html` phụ được nạp bằng `<?!= include('styles'); ?>`. Nếu host **GitHub Pages**, để frontend là HTML/CSS/JS riêng và gọi backend qua `fetch(WEB_APP_URL)`.

---

## Backend — Quy ước Apps Script

### Router (Code.gs)
```javascript
// Mọi request đi qua 1 cổng, phân nhánh theo "action"
function doPost(e) {
  const req = JSON.parse(e.postData.contents);
  const action = req.action;          // vd: "login", "getPlans", "savePlan"
  const result = route(action, req);
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Quy ước mỗi hàm xử lý
- Nhận `req` (đã parse JSON), trả về object `{ ok: true, data }` hoặc `{ ok: false, error }`
- Hàm cần đăng nhập: **luôn** gọi `requireAuth(req.token)` đầu tiên → trả về user, hoặc lỗi
- Hàm của giáo viên: kiểm `user.role === 'TEACHER'` và `canAccessClass(user, classId)`
- Đọc/ghi sheet qua helper trong `Utils.gs` (`getRows(sheetName)`, `appendRow`, `updateRowById`) — KHÔNG viết lặp `getRange` rải rác

### Bảo mật
- Hash mật khẩu bằng `Utilities.computeDigest` (SHA-256) + salt — KHÔNG lưu plaintext
- Token đăng nhập sinh ngẫu nhiên, lưu sheet `Sessions` kèm hạn dùng
- Kiểm tra quyền **mọi** thao tác đọc/ghi (Quy tắc 2)
- Giới hạn upload file: ≤10MB, chỉ jpg/png/webp/pdf

---

## Frontend — Quy ước

### Cấu trúc
- App **một trang** (SPA đơn giản): 1 file `index.html`, chuyển màn hình bằng JS (ẩn/hiện `<section>`)
- Router phía client đơn giản theo `hash` (`#today`, `#calendar`, `#goals`...)
- State lưu trong 1 object `App.state`; cache dữ liệu để giảm số lần gọi backend

### Gọi backend
```javascript
// Khi dùng HtmlService:
function callApi(action, payload) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      .handleApi({ action, token: App.state.token, ...payload });
  });
}
```

### Quy ước UI
- Luôn hiện **loading** khi gọi backend (Quy tắc 5)
- Báo lỗi rõ ràng bằng tiếng Việt khi `ok: false`
- Màu môn học: dùng hàm `subjectColor(subject)` thống nhất, KHÔNG hardcode rải rác

---

## Design System

### Màu sắc (Light mode mặc định)
```css
--bg-base:#f8fafc; --bg-surface:#ffffff; --bg-muted:#f1f5f9; --border:#e2e8f0;
--text-primary:#0f172a; --text-secondary:#475569; --text-muted:#94a3b8;
--accent:#4f46e5; --accent-soft:#eef2ff;
--success:#16a34a; --warning:#f59e0b; --danger:#dc2626;

/* Màu môn học */
--toan:#2563eb; --van:#db2777; --anh:#0891b2; --ly:#7c3aed;
--hoa:#ea580c; --sinh:#16a34a; --su:#b45309; --dia:#0d9488;
```

### Typography
```css
font-family: 'Inter','Be Vietnam Pro',system-ui,sans-serif; /* nạp qua Google Fonts CDN */
/* heading lớn dùng clamp() để responsive */
```

### Layout
- Card radius `12px`, button `8px`
- Khoảng cách gọn: `gap: 12px–16px`
- Bottom nav cố định đáy màn hình trên mobile

---

## Các màn hình — Chi tiết

### Đăng nhập (`#login`)
- Form email + mật khẩu → gọi `login` → nhận token → lưu `localStorage`
- Link đăng ký (chọn vai trò Học sinh / Giáo viên)

### Học sinh — Hôm nay (`#today`)
- Việc cần làm hôm nay (checkbox lớn, đánh dấu DONE)
- Tiến độ nhanh theo môn (vòng %)
- Đếm ngược ngày thi (nếu khối 12) + động viên
- Nhắc nhở sắp đến hạn

### Lịch (`#calendar`)
- Mobile: list theo ngày; desktop: grid tuần
- Thêm/sửa/xóa buổi học, gán môn (màu), đặt `dueDate`, đổi `status`

### Mục tiêu (`#goals`)
- Danh sách mục tiêu theo môn, thanh tiến độ %, thêm/sửa, cập nhật `progress`

### Ôn thi (`#exam`)
- Đặt ngày thi + tổ hợp môn, đếm ngược, checklist nội dung ôn

### Ghi chú (`#notes`)
- Tạo ghi chú theo môn, đính kèm tài liệu (lên Drive), tìm kiếm

### Giáo viên (`#teacher`)
- Chọn lớp → bảng học sinh (tên, tiến độ %, nhiệm vụ trễ)
- Giao việc cho 1 học sinh hoặc cả lớp (tạo `Plans` với `assignedBy`)

---

## Development Conventions

- JavaScript thuần ES6, KHÔNG dùng `var` (dùng `const`/`let`)
- Tên hàm backend rõ nghĩa: `getPlans`, `savePlan`, `deletePlan`
- KHÔNG comment giải thích "what" — chỉ comment khi lý do không hiển nhiên
- KHÔNG tạo abstraction sớm — viết thẳng, gom lại khi lặp 3+ lần
- Mọi thao tác sheet đi qua helper trong `Utils.gs`
- ID sinh bằng helper (vd `genId('u')` → "u" + timestamp/random)

---

## Hạn chế cần lưu ý (so với server thật)

- Apps Script có **giới hạn quota** (số lần chạy/ngày, thời gian chạy) — phù hợp quy mô lớp/trường nhỏ, không phải hàng nghìn user đồng thời
- Tốc độ phản hồi chậm hơn → bắt buộc cache + loading (Quy tắc 5)
- Không có realtime thực sự → làm mới bằng cách gọi lại khi cần
- Bảo mật ở mức cơ bản (hash + token) — đủ cho nội bộ, không lưu dữ liệu cực kỳ nhạy cảm

---

## Checklist Trước Khi Bàn Giao

### Setup
- [ ] Tạo Google Sheet "THPT_Database" với đủ các tab + header đúng cột
- [ ] Tạo Apps Script project gắn với Sheet, dán code các file `.gs`
- [ ] Deploy Web App (Execute as: Me; Who has access: Anyone)
- [ ] Tạo dữ liệu mẫu: 1 giáo viên, 3 học sinh, 1 lớp, vài kế hoạch/mục tiêu
- [ ] Đổi mật khẩu mặc định sau khi bàn giao

### QA
- [ ] Đăng nhập/đăng xuất cả 2 vai trò
- [ ] Học sinh A KHÔNG xem được dữ liệu học sinh B (test phân quyền)
- [ ] Giáo viên chỉ thấy học sinh trong lớp mình
- [ ] CRUD kế hoạch / mục tiêu / ghi chú hoạt động, ghi đúng vào Sheet
- [ ] Giáo viên giao việc → hiện ở "Hôm nay" của học sinh
- [ ] Đếm ngược ngày thi tính đúng
- [ ] Test mobile (375 → iPad), bottom nav hoạt động, không scroll ngang
- [ ] Upload tài liệu (chặn >10MB và sai định dạng)
- [ ] Có loading khi gọi backend; báo lỗi tiếng Việt rõ ràng

---

## Mở rộng v2.0 — Nền tảng học tập

> Đặc tả đầy đủ ở **docs/SRS.md Phần II**. Mục này là quy ước kỹ thuật khi code các module mới.
> **MVP:** lớp 12, môn **Toán / Vật lí / Hóa học / Tiếng Anh**. Khung **GDPT 2018** (xem SRS §10.2).

### Phân kỳ
A. Danh mục môn theo khối → B. Bài giảng → C. Giáo viên AI → D. Ngân hàng đề & kiểm tra → E. Luyện thi IELTS/TOEIC.
Làm **bài giảng trước**; **Giáo viên AI (Claude) tích hợp ngay** khi có bài giảng.

### Bảng dữ liệu mới (thêm vào SCHEMA trong Utils.gs để ensureSheets tự tạo)
- **Subjects**: subjectCode, name, grades(csv), category(BAT_BUOC/TU_CHON), active
- **Topics**: topicId, subjectCode, grade, parentId, title, order
- **Lessons**: lessonId, subjectCode, grade, topicId, title, level(CO_BAN/NANG_CAO/CHUYEN), skill, contentMd, order, status(DRAFT/REVIEW/PUBLISHED), source(AI/MANUAL/IMPORT), createdBy, updatedAt
- **Questions**: questionId, subjectCode, grade, topicId, type, difficulty(NB/TH/VD/VDC), level, stem, options(JSON), answer, explanation, status, source
- **Exams**: examId, title, subjectCode, grade, kind(PRACTICE/TEST/MOCK), questionIds(JSON), durationMin, level, published
- **Attempts**: attemptId, studentId, examId, answers(JSON), score, maxScore, startedAt, submittedAt
- **LessonProgress**: studentId, lessonId, status(LEARNED), updatedAt
- **AIChats**: msgId, studentId, context, role(USER/ASSISTANT), content, model, tokens, createdAt

### Quy ước nội dung
- Trạng thái: **DRAFT → REVIEW → PUBLISHED**; chỉ PUBLISHED hiển thị cho học sinh.
- Quy trình: **AI sinh nháp → giáo viên duyệt/sửa → xuất bản**. Ghi `source` (AI/MANUAL/IMPORT).
- Bài giảng dạng **Markdown**; công thức Toán/Lý/Hóa dùng **KaTeX/MathJax**; ảnh/audio lưu Drive.
- Độ khó câu hỏi: **NB/TH/VD/VDC**. Mức độ: **Cơ bản / Nâng cao / Chuyên** (PTNK, LHP).

### Quy ước Giáo viên AI (Claude API)
- Backend gọi **Claude API** qua `UrlFetchApp` (action `aiChat`, `generateLesson`, `generateQuestions`, `gradeWriting`...).
- **Khóa API** lưu ở **Script Properties** key `CLAUDE_API_KEY` — KHÔNG hardcode, KHÔNG lộ client.
  Đọc: `PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY')`.
- **Model:** mặc định `claude-haiku-4-5` (rẻ/nhanh); nâng `claude-sonnet-4-6` / `claude-opus-4-8` cho bài khó hoặc chấm bài.
- **Guardrail:** chỉ phạm vi học tập; KHÔNG tiết lộ đáp án bài thi đang làm; bám nội dung bài giảng đã xuất bản.
- **Kiểm soát chi phí:** giới hạn lượt/HS/ngày; ghi log token vào sheet `AIChats`.
- **Độ trễ:** Apps Script không stream → trả nguyên câu (~3–10s); luôn hiển thị loading.

### Quy trình deploy lại sau khi sửa .gs (clasp)
```
clasp push --force
clasp create-version "mô tả"
clasp update-deployment -V <n> <deploymentId>   # GIỮ NGUYÊN URL, KHÔNG dùng create-deployment
```
Deployment ID hiện tại: `AKfycbzpCJYHRTwRmclDXEKg3kFpJLHtfHTaLlnMDXDzDlkOgJRBvw7NMoI99Ik8iwx99vfrdw`.
Khi thêm scope mới (vd Drive, hoặc lần đầu dùng UrlFetchApp tới Claude) → cần **authorize lại 1 lần** trong editor.
```

