# PROMPTS.md — Bộ Prompt Thực Hiện Dự Án (HTML + Google Sheets)

> Cách dùng: Dán **lần lượt từng prompt** vào Claude Code theo thứ tự. Hoàn thành & kiểm tra xong prompt trước rồi mới sang prompt sau.
>
> Kiến trúc: **HTML frontend + Google Apps Script backend + Google Sheets database** (giống app chấm công).

---

## GIAI ĐOẠN 0 — Chuẩn bị Google Sheets & cấu trúc dự án

### Prompt 0.1 — Tạo cấu trúc thư mục & tài liệu setup
```
Đọc CLAUDE.md. Tạo cấu trúc thư mục dự án theo mục "File Structure":
thư mục apps-script/, frontend/, docs/ với các file rỗng (có comment header mô tả vai trò mỗi file).

Sau đó viết docs/SETUP.md hướng dẫn tôi từng bước:
1. Tạo Google Sheet tên "THPT_Database" và tạo đủ các tab (Users, Classes, Plans,
   Goals, ExamPlans, Notes, Sessions) với hàng header đúng các cột trong CLAUDE.md
2. Mở Extensions > Apps Script gắn với Sheet đó
3. Cách dán code .gs và deploy Web App (Execute as Me, Anyone)
4. Cách lấy Web App URL

Cho tôi sẵn nội dung header từng tab để tôi copy dán vào dòng 1 của mỗi sheet.
KHÔNG viết code logic ở bước này, chỉ scaffold + hướng dẫn.
```

---

## GIAI ĐOẠN 1 — Backend nền tảng (Apps Script)

### Prompt 1.1 — Utils & Router
```
Đọc CLAUDE.md. Viết apps-script/Utils.gs và apps-script/Code.gs.

Utils.gs — các helper dùng chung:
- getSheet(name), getRows(name) trả mảng object theo header, appendRow(name, obj),
  updateRowById(name, idField, id, patch), deleteRowById(name, idField, id)
- genId(prefix), now(), sha256(text + salt) để hash mật khẩu
- jsonOk(data), jsonError(msg)

Code.gs — cổng vào:
- doPost(e): parse JSON, lấy action, gọi route(action, req), trả JSON
- route(): bảng phân nhánh action → hàm xử lý (tạm thời chỉ "ping" trả {ok:true})
- handleApi(req): bản dùng cho google.script.run (HtmlService)

Tuân thủ quy ước backend trong CLAUDE.md (trả {ok, data}/{ok, error}).
Giải thích cách tôi test hàm ping.
```

### Prompt 1.2 — Xác thực & phân quyền
```
Đọc CLAUDE.md. Viết apps-script/Auth.gs.

Yêu cầu:
- register(req): tạo user trong sheet Users (hash password, chọn role STUDENT/TEACHER),
  chống trùng email
- login(req): kiểm email + hash, sinh token, lưu sheet Sessions kèm expiresAt, trả token + thông tin user
- requireAuth(token): tra Sessions + Users, trả user hoặc lỗi nếu hết hạn/không hợp lệ
- requireTeacher(token): như trên + kiểm role === TEACHER
- canAccessStudent(user, studentId), canAccessClass(user, classId)
- Đăng ký các action login/register vào router trong Code.gs

Tuân thủ Quy tắc 2 (phân quyền) — luôn tra role từ sheet, không tin client.
```

---

## GIAI ĐOẠN 2 — Frontend nền tảng

### Prompt 2.1 — Khung HTML + CSS + đăng nhập
```
Đọc CLAUDE.md. Xây khung frontend trong frontend/.

Yêu cầu:
- index.html: khung SPA, nạp Google Fonts + Day.js qua CDN, có vùng loading toàn cục
- styles.html (hoặc styles.css): CSS theo Design System trong CLAUDE.md (màu, typography,
  card, bottom nav). Mobile First, có @media desktop
- app.html (hoặc app.js): App.state, hàm callApi() gọi backend qua google.script.run,
  router theo hash (#login, #today, #calendar, #goals, #exam, #notes, #teacher),
  helper showLoading/hideLoading, showError tiếng Việt, subjectColor()
- Màn hình #login: form đăng nhập + link đăng ký, lưu token vào localStorage,
  sau đăng nhập điều hướng theo role (học sinh → #today, giáo viên → #teacher)

Tuân thủ Quy tắc 3 (Mobile First) và Quy tắc 5 (loading). Mô tả cách tôi chạy thử.
```

### Prompt 2.2 — Bottom nav & khung các màn hình
```
Đọc CLAUDE.md. Thêm bottom tab bar (mobile) / nav desktop và khung rỗng cho các màn hình
học sinh: #today, #calendar, #goals, #exam, #notes, #ca-nhan.

Yêu cầu:
- Bottom nav 5 mục: Lịch · Mục tiêu · Ôn thi · Ghi chú · Cá nhân (icon lucide/emoji)
- Mỗi màn hình là 1 <section>, chuyển bằng router hash, ẩn/hiện đúng
- #ca-nhan: hiện thông tin user, nút đăng xuất (xóa token)
- Chưa cần data thật, dùng placeholder
```

---

## GIAI ĐOẠN 3 — Tính năng Học sinh

### Prompt 3.1 — Lịch & Kế hoạch
```
Đọc CLAUDE.md. Làm tính năng Lịch (#calendar) + dữ liệu kế hoạch.

Backend apps-script/Plans.gs:
- getPlans(req): trả plans của studentId = chính học sinh (requireAuth)
- savePlan(req): thêm/sửa plan của chính mình (validate subject/status)
- deletePlan(req): xóa plan của chính mình
- Đăng ký action vào router

Frontend #calendar:
- Mobile: list theo ngày (đổi ngày bằng nút/vuốt); desktop: grid tuần
- Thêm/sửa/xóa buổi học, gán môn (màu subjectColor), đặt dueDate, đổi status TODO/IN_PROGRESS/DONE
- Hoàn thiện #today: "Việc cần làm hôm nay" lấy plan có dueDate = hôm nay, checkbox đánh dấu DONE

Test: tạo vài plan, kiểm ghi đúng vào sheet Plans, học sinh khác không thấy.
```

### Prompt 3.2 — Mục tiêu & Tiến độ
```
Đọc CLAUDE.md. Làm tính năng Mục tiêu (#goals).

Backend apps-script/Goals.gs: getGoals, saveGoal, deleteGoal, updateProgress (0–100).
Frontend #goals: danh sách mục tiêu theo môn, thanh/vòng tiến độ %, thêm/sửa, kéo cập nhật progress.
Hoàn thiện vùng "Tiến độ nhanh" ở #today dùng data thật.
Tuân thủ phân quyền (chỉ dữ liệu của chính học sinh).
```

### Prompt 3.3 — Ôn thi THPTQG
```
Đọc CLAUDE.md. Làm tính năng Ôn thi (#exam).

Backend apps-script/Exam.gs: getExamPlan, saveExamPlan (studentId, examDate, subjects, milestones).
Frontend #exam: đặt ngày thi + tổ hợp môn, đếm ngược ngày (Day.js), checklist nội dung ôn theo môn.
Hoàn thiện "Đếm ngược ngày thi" ở #today — hiển thị nhẹ nhàng kèm động viên (Quy tắc 4).
```

### Prompt 3.4 — Ghi chú & Tài liệu
```
Đọc CLAUDE.md. Làm tính năng Ghi chú (#notes).

Backend apps-script/Notes.gs: getNotes, saveNote, deleteNote; uploadFile(req) lưu file lên
Google Drive (tạo folder "THPT_Files"), trả link lưu vào fileUrl. Validate ≤10MB, chỉ jpg/png/webp/pdf.
Frontend #notes: tạo ghi chú theo môn, đính kèm tài liệu, tìm kiếm theo môn/từ khóa.
```

---

## GIAI ĐOẠN 4 — Tính năng Giáo viên

### Prompt 4.1 — Lớp & theo dõi tiến độ
```
Đọc CLAUDE.md. Làm khu vực Giáo viên (#teacher).

Backend apps-script/Classes.gs:
- getMyClasses(req): lớp của giáo viên (requireTeacher)
- getClassStudents(req): học sinh trong lớp + tiến độ TB + số nhiệm vụ trễ
  (kiểm canAccessClass)
Frontend #teacher: chọn lớp → bảng học sinh (tên, tiến độ %, nhiệm vụ trễ).
Phân quyền chặt: giáo viên chỉ thấy lớp/học sinh của mình.
```

### Prompt 4.2 — Giao việc
```
Đọc CLAUDE.md. Làm tính năng Giao việc cho giáo viên.

Backend: mở rộng Plans.gs cho phép giáo viên tạo plan cho học sinh trong lớp mình
(set assignedBy = userId giáo viên; kiểm canAccessClass).
Frontend #teacher: form giao nhiệm vụ — chọn 1 học sinh hoặc cả lớp, nhập tiêu đề/môn/hạn.
Xác nhận nhiệm vụ được giao hiện ở #today của học sinh, có badge "Giáo viên giao".
```

---

## GIAI ĐOẠN 5 — Hoàn thiện & QA

### Prompt 5.1 — Rà soát phân quyền & bảo mật
```
Đọc CLAUDE.md mục "Backend — Bảo mật" và Quy tắc 2.

Rà soát MỌI hàm backend:
- Có gọi requireAuth/requireTeacher trước khi đọc/ghi không?
- Học sinh chỉ thao tác dữ liệu của chính mình; giáo viên chỉ lớp của mình?
- Mật khẩu có hash, không lưu plaintext?
- Upload chặn đúng kích thước/định dạng?
Viết kịch bản test thủ công cho từng trường hợp vượt quyền. Sửa lỗ hổng nếu có.
```

### Prompt 5.2 — QA cuối
```
Đọc CLAUDE.md mục "Checklist Trước Khi Bàn Giao". Chạy lần lượt từng mục:
- Đăng nhập 2 vai trò, test vượt quyền
- CRUD kế hoạch/mục tiêu/ghi chú ghi đúng Sheet
- Giáo viên giao việc → học sinh nhận
- Đếm ngược đúng; mobile (375→iPad) bottom nav ổn, không scroll ngang
- Upload chặn sai định dạng/quá lớn
- Có loading + báo lỗi tiếng Việt
Lập danh sách việc còn tồn đọng nếu có.
```

---

# PHẦN II — MỞ RỘNG: NỀN TẢNG HỌC TẬP (v2.0)

> Giai đoạn 0–5 (Phần I) đã hoàn thành: app lập kế hoạch chạy thật trên GAS.
> Các giai đoạn dưới đây xây nền tảng học tập theo **SRS.md Phần II** và **CLAUDE.md mục "Mở rộng v2.0"**.
> MVP: **lớp 12, môn Toán/Lý/Hóa/Anh**. Khung **GDPT 2018**. Nội dung: **AI sinh nháp → giáo viên duyệt → xuất bản**.

## GIAI ĐOẠN 6 — Module A: Danh mục môn học theo khối

### Prompt 6.1 — Schema danh mục + môn/chủ đề
```
Đọc CLAUDE.md (mục Mở rộng v2.0) và SRS.md §11, §16.1.

Backend:
- Thêm SCHEMA cho sheet Subjects, Topics trong Utils.gs (ensureSheets tự tạo)
- Classes.gs hoặc Catalog.gs: getSubjects (theo khối), getTopics (cây Chương→Bài theo môn+khối),
  saveSubject/saveTopic (chỉ giáo viên/CONTENT_ADMIN)
- Seed danh mục lớp 12: Toán, Vật lí, Hóa học, Tiếng Anh + vài chương mẫu mỗi môn
- Đăng ký action vào Code.gs router

Frontend: màn hình duyệt môn → chủ đề (chưa cần nội dung bài giảng).
Push GAS + redeploy theo quy trình clasp trong CLAUDE.md.
```

## GIAI ĐOẠN 7 — Module B: Hệ thống bài giảng + công cụ AI sinh nháp

### Prompt 7.1 — Bài giảng (CRUD + xem)
```
Đọc CLAUDE.md và SRS.md §12, §16.

Backend Lessons.gs: getLessons (theo chủ đề, chỉ PUBLISHED cho HS), getLesson,
saveLesson/deleteLesson (giáo viên), markLearned (LessonProgress).
Trạng thái DRAFT/REVIEW/PUBLISHED; nội dung Markdown.
Frontend: xem bài giảng theo cây chủ đề, render Markdown + KaTeX (công thức),
tách Cốt lõi/Nâng cao, đánh dấu đã học, theo dõi tiến độ chủ đề.
Push GAS + redeploy.
```

### Prompt 7.2 — Công cụ AI sinh nháp + quy trình duyệt
```
Đọc CLAUDE.md (mục AI + quy trình nội dung) và SRS.md §13.1, §16.2.

Backend: action generateLesson(req) gọi Claude API qua UrlFetchApp (key trong Script Properties),
sinh nháp bài giảng theo (môn, khối, chủ đề, mức độ) → lưu trạng thái DRAFT.
Frontend (giáo viên): nút "Sinh nháp bằng AI" → xem/sửa → "Duyệt & xuất bản" (PUBLISHED).
Tuân thủ: chỉ PUBLISHED hiển thị cho HS; ghi nguồn = AI.
Lưu ý: cần đặt CLAUDE_API_KEY trong Script Properties trước khi test.
```

## GIAI ĐOẠN 8 — Module C: Giáo viên AI (chatbot)

### Prompt 8.1 — Chatbot Claude gắn ngữ cảnh bài giảng
```
Đọc CLAUDE.md (mục AI) và SRS.md §13.

Backend: action aiChat(req) — gọi Claude API, đính kèm nội dung bài giảng đang xem làm ngữ cảnh.
Guardrail: chỉ phạm vi học tập; không làm hộ bài kiểm tra đang diễn ra.
Kiểm soát chi phí: giới hạn lượt/HS/ngày; log token vào sheet AIChats. Model mặc định Haiku 4.5.
Frontend: khung chat trong màn hình bài giảng, có loading (phản hồi ~3-10s), lưu lịch sử (tùy chọn).
```

## GIAI ĐOẠN 9 — Module D: Ngân hàng đề & bài kiểm tra

### Prompt 9.1 — Ngân hàng câu hỏi + sinh nháp AI
```
Đọc CLAUDE.md và SRS.md §14, §16.

Backend Questions.gs: CRUD câu hỏi (môn, khối, chủ đề, độ khó NB/TH/VD/VDC, loại, đáp án, lời giải),
trạng thái DRAFT/PUBLISHED; generateQuestions(req) sinh nháp bằng AI.
Frontend (giáo viên): quản lý + sinh nháp + duyệt câu hỏi.
```

### Prompt 9.2 — Tạo đề, làm bài, tự chấm
```
Đọc CLAUDE.md và SRS.md §14.

Backend Exams.gs: tạo đề (chọn tay hoặc theo ma trận số câu/độ khó), getExam,
submitAttempt (tự chấm trắc nghiệm, lưu Attempts), lịch sử làm bài.
Frontend (HS): làm bài có đếm giờ → nộp → xem điểm + lời giải từng câu.
Tự luận/Writing: chấm bằng AI theo rubric (tùy chọn), giáo viên duyệt lại.
```

## GIAI ĐOẠN 10 — Module E: Luyện thi IELTS / TOEIC

### Prompt 10.1 — Nội dung & đề luyện theo kỹ năng
```
Đọc CLAUDE.md và SRS.md §15.

Tái dùng Lessons/Questions với môn = IELTS / TOEIC + trường kỹ năng
(IELTS: Listening/Reading/Writing/Speaking; TOEIC: Listening/Reading).
Backend: placement test → lộ trình mục tiêu (IELTS 4.5→6.5, TOEIC 450→650).
Đề luyện & thi thử theo định dạng; tự chấm Listening/Reading. Audio lưu Drive.
```

### Prompt 10.2 — AI chấm Writing/Speaking + theo dõi tiến độ
```
Đọc CLAUDE.md (mục AI) và SRS.md §15.

Backend: action gradeWriting/gradeSpeaking — Claude chấm theo band descriptors, trả điểm + góp ý.
Frontend: nộp bài Writing/Speaking → nhận nhận xét; biểu đồ tiến độ band/điểm theo thời gian.
```

---

## Mẹo khi chạy bộ prompt

- Sau mỗi prompt, yêu cầu Claude **commit** với message rõ ràng trước khi sang prompt kế.
- Giai đoạn 0 + đầu giai đoạn 1: bạn cần **tự tạo Google Sheet và deploy Web App** theo docs/SETUP.md, rồi dán Web App URL / test trực tiếp trên Apps Script.
- Vì backend chạy trên Google (không chạy local được hoàn toàn), nhiều bước test phải làm trên **trình Apps Script** hoặc trên Web App đã deploy — Claude sẽ hướng dẫn, nhưng thao tác cuối là bạn thực hiện.
- Nếu Claude làm lệch CLAUDE.md, nhắc: "Đối chiếu lại CLAUDE.md mục ___".
```
