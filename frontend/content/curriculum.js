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
          id: 't-toan-c1', title: 'Chương 1 · Ứng dụng đạo hàm để khảo sát và vẽ đồ thị',
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
            {
              id: 'l-toan-gtln-gtnn', title: 'GTLN – GTNN của hàm số', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Tìm giá trị lớn nhất (GTLN) – nhỏ nhất (GTNN) của $f(x)$ trên đoạn $[a;b]$:</p>
                <ol>
                  <li>Tính $f'(x)$, tìm các nghiệm $x_i \\in [a;b]$ của $f'(x)=0$.</li>
                  <li>Tính $f(a),\\ f(b),\\ f(x_i)$.</li>
                  <li>GTLN là số lớn nhất, GTNN là số nhỏ nhất trong các giá trị trên.</li>
                </ol>
                <h2>Nâng cao</h2>
                <p>Trên khoảng (không phải đoạn): lập bảng biến thiên để kết luận. Bài toán thực tế (tối ưu chi phí, diện tích) thường đưa về tìm GTNN/GTLN của một hàm số.</p>
              `,
            },
            {
              id: 'l-toan-tiemcan', title: 'Tiệm cận của đồ thị hàm số', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Tiệm cận ngang</strong> $y=y_0$ nếu $\\lim\\limits_{x\\to\\pm\\infty} f(x)=y_0$.</li>
                  <li><strong>Tiệm cận đứng</strong> $x=x_0$ nếu $\\lim\\limits_{x\\to x_0^{\\pm}} f(x)=\\pm\\infty$.</li>
                  <li><strong>Tiệm cận xiên</strong> $y=ax+b$ với $a=\\lim\\dfrac{f(x)}{x}$, $b=\\lim\\,[f(x)-ax]$.</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Với hàm $y=\\dfrac{ax+b}{cx+d}\\ (c\\ne 0)$: tiệm cận đứng $x=-\\dfrac{d}{c}$, tiệm cận ngang $y=\\dfrac{a}{c}$.</p>
              `,
            },
            {
              id: 'l-toan-khaosat', title: 'Khảo sát và vẽ đồ thị hàm số', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi — Sơ đồ khảo sát</h2>
                <ol>
                  <li>Tập xác định.</li>
                  <li>Đạo hàm, chiều biến thiên, cực trị.</li>
                  <li>Giới hạn, tiệm cận (nếu có).</li>
                  <li>Bảng biến thiên.</li>
                  <li>Vẽ đồ thị: điểm đặc biệt (giao trục), tính đối xứng.</li>
                </ol>
                <h2>Nâng cao</h2>
                <p>Các dạng đồ thị thường gặp: bậc ba $y=ax^3+bx^2+cx+d$, trùng phương $y=ax^4+bx^2+c$, phân thức $y=\\dfrac{ax+b}{cx+d}$.</p>
              `,
            },
          ],
        },
        {
          id: 't-toan-c2', title: 'Chương 2 · Vectơ và hệ trục tọa độ trong không gian',
          lessons: [
            {
              id: 'l-toan-vecto-kg', title: 'Vectơ trong không gian', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Các phép toán vectơ (cộng, trừ, nhân với số) trong không gian tương tự trong mặt phẳng, tuân theo quy tắc hình bình hành và quy tắc ba điểm.</p>
                <p>Quy tắc hình hộp: $\\vec{AC'} = \\vec{AB}+\\vec{AD}+\\vec{AA'}$.</p>
                <h2>Nâng cao</h2>
                <p>Ba vectơ <strong>đồng phẳng</strong> khi tồn tại $m,n$ sao cho $\\vec{c}=m\\vec{a}+n\\vec{b}$.</p>
              `,
            },
            {
              id: 'l-toan-oxyz', title: 'Hệ tọa độ Oxyz – tọa độ điểm & vectơ', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Điểm $M(x;y;z)$, vectơ $\\vec{u}=(a;b;c)$. Với $A(x_1;y_1;z_1)$, $B(x_2;y_2;z_2)$:</p>
                <ul>
                  <li>$\\vec{AB}=(x_2-x_1;\\,y_2-y_1;\\,z_2-z_1)$.</li>
                  <li>$AB=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$.</li>
                  <li>Trung điểm $I=\\left(\\dfrac{x_1+x_2}{2};\\dfrac{y_1+y_2}{2};\\dfrac{z_1+z_2}{2}\\right)$.</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Trọng tâm tam giác $ABC$: $G=\\left(\\dfrac{x_A+x_B+x_C}{3};\\dots\\right)$.</p>
              `,
            },
            {
              id: 'l-toan-tichvohuong', title: 'Tích vô hướng & ứng dụng', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <p>Với $\\vec{u}=(a_1;b_1;c_1)$, $\\vec{v}=(a_2;b_2;c_2)$:</p>
                <p>$\\vec{u}\\cdot\\vec{v}=a_1a_2+b_1b_2+c_1c_2$, và $\\cos(\\vec{u},\\vec{v})=\\dfrac{\\vec{u}\\cdot\\vec{v}}{|\\vec{u}|\\,|\\vec{v}|}$.</p>
                <p>Hai vectơ vuông góc $\\Leftrightarrow \\vec{u}\\cdot\\vec{v}=0$.</p>
                <h2>Nâng cao</h2>
                <p>Tích có hướng $\\vec{u}\\wedge\\vec{v}$ cho vectơ vuông góc với cả hai — dùng tính diện tích, thể tích.</p>
              `,
            },
          ],
        },
        {
          id: 't-toan-c3', title: 'Chương 3 · Số đặc trưng đo mức độ phân tán (mẫu ghép nhóm)',
          lessons: [
            {
              id: 'l-toan-khoangbt', title: 'Khoảng biến thiên & khoảng tứ phân vị', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Khoảng biến thiên</strong> $R = $ giá trị lớn nhất $-$ giá trị nhỏ nhất.</li>
                  <li><strong>Khoảng tứ phân vị</strong> $\\Delta_Q = Q_3 - Q_1$ — đo độ phân tán của 50% dữ liệu giữa, ít bị ảnh hưởng bởi giá trị bất thường.</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Giá trị $x$ là <em>ngoại lệ</em> nếu $x < Q_1 - 1{,}5\\,\\Delta_Q$ hoặc $x > Q_3 + 1{,}5\\,\\Delta_Q$.</p>
              `,
            },
            {
              id: 'l-toan-phuongsai', title: 'Phương sai & độ lệch chuẩn', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <p>Với mẫu ghép nhóm, $x_i$ là giá trị đại diện nhóm, $n_i$ tần số, $\\bar{x}$ số trung bình:</p>
                <p>Phương sai $s^2=\\dfrac{1}{n}\\sum n_i(x_i-\\bar{x})^2$; độ lệch chuẩn $s=\\sqrt{s^2}$.</p>
                <h2>Nâng cao</h2>
                <p>$s$ càng lớn → dữ liệu càng phân tán quanh trung bình. Dùng so sánh độ ổn định giữa hai mẫu.</p>
              `,
            },
          ],
        },
        {
          id: 't-toan-c4', title: 'Chương 4 · Nguyên hàm và Tích phân',
          lessons: [
            {
              id: 'l-toan-nguyenham', title: 'Khái niệm nguyên hàm', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>$F(x)$ là nguyên hàm của $f(x)$ nếu $F'(x)=f(x)$. Họ nguyên hàm: $\\int f(x)\\,dx = F(x)+C$.</p>
                <p>Công thức cơ bản: $\\int x^n dx = \\dfrac{x^{n+1}}{n+1}+C\\,(n\\ne -1)$, $\\int \\dfrac{1}{x}dx=\\ln|x|+C$, $\\int e^x dx=e^x+C$.</p>
                <h2>Nâng cao</h2>
                <p>$\\int \\sin x\\,dx=-\\cos x+C$, $\\int \\cos x\\,dx=\\sin x+C$.</p>
              `,
            },
            {
              id: 'l-toan-tichphan', title: 'Tích phân', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Công thức Newton–Leibniz: $\\displaystyle\\int_a^b f(x)\\,dx = F(b)-F(a)$ với $F$ là một nguyên hàm của $f$.</p>
                <p>Tính chất: $\\int_a^b = -\\int_b^a$; $\\int_a^c+\\int_c^b=\\int_a^b$; tuyến tính với tổng và hằng số.</p>
                <h2>Nâng cao</h2>
                <p>Phương pháp đổi biến số và tích phân từng phần: $\\int u\\,dv = uv-\\int v\\,du$.</p>
              `,
            },
            {
              id: 'l-toan-ungdung-tp', title: 'Ứng dụng tích phân (diện tích, thể tích)', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li>Diện tích hình phẳng giới hạn bởi $y=f(x)$, trục $Ox$, $x=a$, $x=b$: $S=\\displaystyle\\int_a^b |f(x)|\\,dx$.</li>
                  <li>Diện tích giữa hai đường: $S=\\displaystyle\\int_a^b |f(x)-g(x)|\\,dx$.</li>
                  <li>Thể tích khối tròn xoay quanh $Ox$: $V=\\pi\\displaystyle\\int_a^b [f(x)]^2\\,dx$.</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Bài toán chuyển động: quãng đường $s=\\int v(t)\\,dt$; vận tốc $v=\\int a(t)\\,dt$.</p>
              `,
            },
          ],
        },
        {
          id: 't-toan-c5', title: 'Chương 5 · Phương pháp tọa độ trong không gian',
          lessons: [
            {
              id: 'l-toan-matphang', title: 'Phương trình mặt phẳng', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <p>Mặt phẳng qua $M(x_0;y_0;z_0)$ với vectơ pháp tuyến $\\vec{n}=(A;B;C)$:</p>
                <p>$A(x-x_0)+B(y-y_0)+C(z-z_0)=0 \\;\\Leftrightarrow\\; Ax+By+Cz+D=0$.</p>
                <h2>Nâng cao</h2>
                <p>Khoảng cách từ $M(x_0;y_0;z_0)$ đến $(P): Ax+By+Cz+D=0$ là $d=\\dfrac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$.</p>
              `,
            },
            {
              id: 'l-toan-duongthang', title: 'Phương trình đường thẳng', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <p>Đường thẳng qua $M(x_0;y_0;z_0)$, vectơ chỉ phương $\\vec{u}=(a;b;c)$:</p>
                <ul>
                  <li>Tham số: $x=x_0+at,\\ y=y_0+bt,\\ z=z_0+ct$.</li>
                  <li>Chính tắc: $\\dfrac{x-x_0}{a}=\\dfrac{y-y_0}{b}=\\dfrac{z-z_0}{c}$ (khi $a,b,c\\ne 0$).</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Vị trí tương đối hai đường thẳng dựa vào $\\vec{u_1},\\vec{u_2}$ và một điểm — song song, cắt, chéo nhau.</p>
              `,
            },
            {
              id: 'l-toan-matcau', title: 'Phương trình mặt cầu', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Mặt cầu tâm $I(a;b;c)$, bán kính $R$: $(x-a)^2+(y-b)^2+(z-c)^2=R^2$.</p>
                <p>Dạng khai triển $x^2+y^2+z^2-2ax-2by-2cz+d=0$ với $R=\\sqrt{a^2+b^2+c^2-d}$ (cần $a^2+b^2+c^2-d>0$).</p>
                <h2>Nâng cao</h2>
                <p>Vị trí mặt phẳng & mặt cầu: so sánh $d(I,(P))$ với $R$ (không cắt / tiếp xúc / cắt theo đường tròn).</p>
              `,
            },
          ],
        },
        {
          id: 't-toan-c6', title: 'Chương 6 · Xác suất có điều kiện',
          lessons: [
            {
              id: 'l-toan-xs-codieukien', title: 'Xác suất có điều kiện', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <p>Xác suất của $A$ khi biết $B$ đã xảy ra: $P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$ (với $P(B)>0$).</p>
                <p>Quy tắc nhân: $P(A\\cap B)=P(B)\\cdot P(A\\mid B)$.</p>
                <h2>Nâng cao</h2>
                <p>Hai biến cố <strong>độc lập</strong> khi $P(A\\mid B)=P(A)$, tức $P(A\\cap B)=P(A)P(B)$.</p>
              `,
            },
            {
              id: 'l-toan-bayes', title: 'Công thức xác suất toàn phần & Bayes', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Nếu $B_1,B_2$ là hệ đầy đủ (chia đôi không gian mẫu): xác suất toàn phần</p>
                <p>$P(A)=P(B_1)P(A\\mid B_1)+P(B_2)P(A\\mid B_2)$.</p>
                <p>Công thức Bayes: $P(B_1\\mid A)=\\dfrac{P(B_1)P(A\\mid B_1)}{P(A)}$.</p>
                <h2>Nâng cao</h2>
                <p>Dùng sơ đồ cây để hình dung; Bayes giúp "đảo chiều" xác suất — rất hay gặp trong bài toán xét nghiệm, chẩn đoán.</p>
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
