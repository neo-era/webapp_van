/* ============================================================
   curriculum.js — NỘI DUNG BÀI HỌC (HTML tĩnh).
   Tải cùng trang → hiển thị TỨC THÌ, không gọi backend.

   CÁCH THÊM BÀI HỌC:
   1. Tìm môn (subjects[].code) và chủ đề (topics[]) phù hợp, hoặc thêm mới.
   2. Thêm một object vào mảng lessons:
        { id: 'ma-duy-nhat', title: 'Tên bài', level: 'CO_BAN'|'NANG_CAO'|'CHUYEN',
          html: `<h2>Cốt lõi</h2> ...viết HTML tại đây... ` }
   3. Viết nội dung bằng HTML bình thường: <h2> <p> <ul><li> <table> <img> <strong> ...
      - Công thức Toán/Lý/Hóa: bọc trong $...$ (KaTeX tự render), vd: $f'(x) \ge 0$.
      - Ảnh: <img src="https://..." alt="..."> (đặt link ảnh trực tiếp).
   4. Lưu file → đẩy GitHub. Xong, không cần backend.
   ============================================================ */

const CURRICULUM = {
  subjects: [
    {
      code: 'TOAN', name: 'Toán', grade: 12,
      topics: [
        {
          id: 't-toan-hamso', title: 'Ứng dụng đạo hàm & khảo sát hàm số',
          lessons: [
            {
              id: 'l-toan-dondieu', title: 'Tính đơn điệu của hàm số', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Cho hàm số $y=f(x)$ có đạo hàm trên khoảng $K$:</p>
                <ul>
                  <li>Nếu $f'(x) > 0$ với mọi $x \\in K$ thì hàm số <strong>đồng biến</strong> trên $K$.</li>
                  <li>Nếu $f'(x) < 0$ với mọi $x \\in K$ thì hàm số <strong>nghịch biến</strong> trên $K$.</li>
                </ul>
                <h3>Các bước xét tính đơn điệu</h3>
                <ol>
                  <li>Tìm tập xác định.</li>
                  <li>Tính $f'(x)$; tìm nghiệm của $f'(x)=0$ và điểm $f'(x)$ không xác định.</li>
                  <li>Lập bảng biến thiên và kết luận.</li>
                </ol>
                <h2>Nâng cao</h2>
                <p>Bài toán tham số: tìm $m$ để hàm số đồng biến trên $\\mathbb{R}$ thường quy về điều kiện
                $f'(x) \\ge 0\\ \\forall x$ — xét dấu tam thức bậc hai ($a>0$ và $\\Delta \\le 0$).</p>
                <p><em>Ví dụ:</em> $y=x^3-3mx+1$ có $y'=3x^2-3m \\ge 0\\ \\forall x \\Leftrightarrow m \\le 0$.</p>
              `,
            },
            {
              id: 'l-toan-cuctri', title: 'Cực trị của hàm số', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>$x_0$ là điểm cực trị nếu $f'(x)$ <strong>đổi dấu</strong> khi qua $x_0$:</p>
                <ul>
                  <li>$f'$ đổi từ $+$ sang $-$: $x_0$ là điểm <strong>cực đại</strong>.</li>
                  <li>$f'$ đổi từ $-$ sang $+$: $x_0$ là điểm <strong>cực tiểu</strong>.</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Dùng đạo hàm cấp hai: nếu $f'(x_0)=0$ và $f''(x_0)<0$ thì $x_0$ là cực đại; $f''(x_0)>0$ thì cực tiểu.</p>
              `,
            },
          ],
        },
        {
          id: 't-toan-tichphan', title: 'Nguyên hàm – Tích phân',
          lessons: [
            {
              id: 'l-toan-nguyenham', title: 'Khái niệm nguyên hàm', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>$F(x)$ là nguyên hàm của $f(x)$ nếu $F'(x)=f(x)$. Họ nguyên hàm: $\\int f(x)\\,dx = F(x)+C$.</p>
                <p>Một số công thức cơ bản: $\\int x^n dx = \\dfrac{x^{n+1}}{n+1}+C\\ (n\\ne -1)$, $\\int \\dfrac{1}{x}dx=\\ln|x|+C$.</p>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'LY', name: 'Vật lí', grade: 12,
      topics: [
        {
          id: 't-ly-daodong', title: 'Dao động cơ',
          lessons: [
            {
              id: 'l-ly-dieuhoa', title: 'Dao động điều hòa', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Phương trình: $x = A\\cos(\\omega t + \\varphi)$, với $A$ là biên độ, $\\omega$ tần số góc, $\\varphi$ pha ban đầu.</p>
                <ul>
                  <li>Chu kì $T = \\dfrac{2\\pi}{\\omega}$, tần số $f = \\dfrac{1}{T}$.</li>
                  <li>Vận tốc $v = -A\\omega\\sin(\\omega t+\\varphi)$; gia tốc $a = -\\omega^2 x$.</li>
                </ul>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'HOA', name: 'Hóa học', grade: 12,
      topics: [
        {
          id: 't-hoa-este', title: 'Este – Lipit',
          lessons: [
            {
              id: 'l-hoa-este', title: 'Khái niệm & tính chất Este', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Este tạo thành khi thay nhóm $-OH$ của axit cacboxylic bằng nhóm $-OR$. Công thức đơn chức no: $C_nH_{2n}O_2$.</p>
                <p>Phản ứng thủy phân trong môi trường kiềm (xà phòng hóa) tạo muối + ancol.</p>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'ANH', name: 'Tiếng Anh', grade: 12,
      topics: [
        {
          id: 't-anh-tenses', title: 'Tenses & Verb forms',
          lessons: [
            {
              id: 'l-anh-present-perfect', title: 'Present Perfect', level: 'CO_BAN',
              html: `
                <h2>Form</h2>
                <p><strong>S + have/has + V3/ed</strong></p>
                <h2>Usage</h2>
                <ul>
                  <li>Hành động xảy ra trong quá khứ, còn liên quan hiện tại.</li>
                  <li>Dấu hiệu: <em>just, already, yet, since, for, ever, never</em>.</li>
                </ul>
                <p>Ex: She <strong>has lived</strong> here <em>for</em> 5 years.</p>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'IELTS', name: 'Luyện thi IELTS', target: 'IELTS 4.5 → 6.5',
      topics: [
        {
          id: 't-ielts-reading', title: 'Reading',
          lessons: [
            {
              id: 'l-ielts-skim', title: 'Skimming & Scanning', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Skimming</strong>: đọc lướt lấy ý chính của đoạn (đọc câu đầu/cuối).</li>
                  <li><strong>Scanning</strong>: dò nhanh tìm thông tin cụ thể (số liệu, tên riêng).</li>
                </ul>
                <h2>Mẹo</h2>
                <p>Đọc câu hỏi trước, gạch từ khóa; phân bổ ~20 phút/passage.</p>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'TOEIC', name: 'Luyện thi TOEIC', target: 'TOEIC 450 → 650',
      topics: [
        {
          id: 't-toeic-reading', title: 'Reading (Part 5-7)',
          lessons: [
            {
              id: 'l-toeic-part5', title: 'Part 5: Ngữ pháp & từ vựng', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Xác định <strong>loại từ</strong> cần điền dựa vào vị trí trong câu (danh/động/tính/trạng từ).</p>
                <p>Bẫy hay gặp: cùng họ từ — <em>success / successful / successfully</em>.</p>
              `,
            },
          ],
        },
      ],
    },
  ],
};

// Helpers tra cứu nhanh trong nội dung tĩnh
const Content = {
  subjects() { return CURRICULUM.subjects; },
  subject(code) { return CURRICULUM.subjects.find((s) => s.code === code); },
  topics(code) { const s = Content.subject(code); return s ? s.topics : []; },
  topic(code, topicId) { return Content.topics(code).find((t) => t.id === topicId); },
  lessons(code, topicId) { const t = Content.topic(code, topicId); return t ? t.lessons : []; },
  lesson(code, topicId, lessonId) { return Content.lessons(code, topicId).find((l) => l.id === lessonId); },
  target(code) { const s = Content.subject(code); return s ? (s.target || '') : ''; },
};
