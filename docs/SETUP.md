# SETUP.md — Hướng dẫn cài đặt Backend (Google Sheets + Apps Script)

> Làm theo đúng thứ tự. Phần này bạn **tự thao tác trên Google** (Claude không tự làm được vì cần tài khoản của bạn). Sau khi xong, ta mới viết code logic ở các Prompt tiếp theo.

---

## Bước 1 — Tạo Google Sheet làm database

1. Vào https://sheets.google.com → tạo bảng tính mới.
2. Đổi tên bảng tính thành **`THPT_Database`** (góc trên bên trái).
3. Tạo đủ **7 tab (sheet con)** với tên **chính xác** (phân biệt hoa/thường):

   `Users` · `Classes` · `Plans` · `Goals` · `ExamPlans` · `Notes` · `Sessions`

   > Tab mặc định tên "Trang tính1" → đổi tên thành `Users`. Bấm dấu **+** góc dưới bên trái để thêm tab mới.

---

## Bước 2 — Dán hàng tiêu đề (header) cho từng tab

Với **mỗi tab**, làm như sau để điền header vào hàng 1:

1. Chọn ô **A1** của tab đó.
2. Copy đúng dòng tương ứng bên dưới (cả dòng).
3. Dán vào A1.
4. Vào menu **Dữ liệu → Tách văn bản thành các cột** (Data → Split text to columns), chọn dấu phân tách là **Dấu phẩy**. Header sẽ tự rải ra các cột A, B, C…
5. (Tùy chọn) Bôi đậm hàng 1 cho dễ nhìn.

### Header từng tab (copy nguyên dòng)

**Tab `Users`**
```
userId,email,passwordHash,name,role,grade,classId,createdAt
```

**Tab `Classes`**
```
classId,name,teacherId,createdAt
```

**Tab `Plans`**
```
planId,studentId,title,subject,description,dueDate,status,assignedBy,createdAt
```

**Tab `Goals`**
```
goalId,studentId,subject,title,targetValue,progress,deadline,createdAt
```

**Tab `ExamPlans`**
```
studentId,examDate,subjects,milestones
```

**Tab `Notes`**
```
noteId,studentId,subject,title,content,fileUrl,createdAt,updatedAt
```

**Tab `Sessions`**
```
token,userId,expiresAt
```

### Ý nghĩa các giá trị quan trọng (để nhập đúng sau này)
- `role`: `STUDENT` hoặc `TEACHER`
- `subject`: `TOAN`, `VAN`, `ANH`, `LY`, `HOA`, `SINH`, `SU`, `DIA`, `GDCD`
- `status` (Plans): `TODO`, `IN_PROGRESS`, `DONE`
- `progress` (Goals): số 0–100
- `subjects` (ExamPlans): nhiều môn ngăn cách dấu phẩy, ví dụ `TOAN,VAN,ANH`
- `assignedBy` (Plans): để trống nếu học sinh tự tạo; điền `userId` giáo viên nếu được giao

---

## Bước 3 — Mở Apps Script gắn với Sheet

1. Trong `THPT_Database`, vào menu **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
2. Một dự án Apps Script mới mở ra, đã **gắn sẵn** với bảng tính này (rất quan trọng — nhờ vậy code đọc/ghi được Sheet).
3. Đặt tên dự án (góc trên trái), ví dụ **`THPT Backend`**.

---

## Bước 4 — Dán code các file `.gs`

> Hiện các file trong thư mục `apps-script/` mới chỉ có comment mô tả (chưa có logic). Khi chạy các Prompt 1.x–4.x, Claude sẽ viết code thật, rồi bạn dán theo cách dưới đây.

Trong trình Apps Script:
1. File mặc định tên `Code.gs` → dán nội dung `apps-script/Code.gs`.
2. Bấm **+ → Script** để tạo thêm file, đặt tên trùng (không cần đuôi `.gs`):
   `Utils`, `Auth`, `Plans`, `Goals`, `Exam`, `Notes`, `Classes`.
3. Dán nội dung tương ứng từng file vào.
4. Bấm **Lưu** (biểu tượng đĩa hoặc Ctrl+S).

---

## Bước 5 — Deploy thành Web App

1. Góc trên bên phải bấm **Triển khai → Triển khai mới** (Deploy → New deployment).
2. Bấm bánh răng ⚙ → chọn loại **Ứng dụng web** (Web app).
3. Thiết lập:
   - **Mô tả:** THPT Backend v1
   - **Thực thi với tư cách (Execute as):** **Tôi (Me)**
   - **Ai có quyền truy cập (Who has access):** **Bất kỳ ai (Anyone)**
     > Cần "Anyone" để frontend gọi được. Bảo mật do code tự kiểm tra (token + phân quyền), không dựa vào quyền truy cập của Google.
4. Bấm **Triển khai**. Lần đầu Google sẽ hỏi **cấp quyền** → chọn tài khoản → "Nâng cao" → "Đi tới … (không an toàn)" → **Cho phép**. (Bình thường, vì đây là script của chính bạn.)

---

## Bước 6 — Lấy Web App URL

- Sau khi deploy, copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/AKfy…/exec`).
- **Lưu URL này lại** — frontend sẽ gọi vào đây.
- Mỗi lần sửa code và muốn cập nhật bản chạy: **Triển khai → Quản lý các bản triển khai → ✏ chỉnh sửa → Phiên bản: Mới → Triển khai** (URL giữ nguyên).

> Mẹo: khi đang phát triển, có thể dùng **Triển khai → Kiểm thử các bản triển khai** (Test deployments) để lấy URL `/dev` chạy bản mới nhất mà không cần deploy lại.

---

## Checklist hoàn thành Giai đoạn 0

- [ ] Có bảng tính `THPT_Database` với 7 tab đúng tên
- [ ] Mỗi tab đã có hàng header đúng cột
- [ ] Đã mở Apps Script gắn với Sheet, đặt tên dự án
- [ ] (Sau Prompt 1.x) đã dán code và deploy Web App
- [ ] Đã lưu lại Web App URL

> Xong các bước trên, báo Claude để tiếp tục **Prompt 1.1 — Utils & Router**.
