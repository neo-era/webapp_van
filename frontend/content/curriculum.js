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
                <div class="luuy">
                  <strong>Lưu ý (chính xác hóa):</strong> Điều kiện đủ tổng quát là $f'(x)\\ge 0\\ \\forall x\\in K$ và $f'(x)=0$ chỉ tại <em>hữu hạn điểm</em> thì hàm vẫn đồng biến trên $K$.
                  <em>Ví dụ:</em> $y=x^3$ có $y'=3x^2\\ge 0$ (chỉ bằng 0 tại $x=0$) nên đồng biến trên $\\mathbb{R}$.
                </div>
                <h3>Các bước xét tính đơn điệu</h3>
                <ol>
                  <li>Tìm tập xác định.</li>
                  <li>Tính $f'(x)$; tìm nghiệm của $f'(x)=0$ và điểm $f'(x)$ không xác định.</li>
                  <li>Lập bảng biến thiên và kết luận.</li>
                </ol>
                <h2>Nâng cao</h2>
                <p>Bài toán tham số: tìm $m$ để hàm số đồng biến trên $\\mathbb{R}$ thường quy về điều kiện
                $f'(x) \\ge 0\\ \\forall x$ — xét dấu tam thức bậc hai ($a>0$ và $\\Delta \\le 0$).</p>
                <p>Bài toán tham số: $y=x^3-3mx+1$ có $y'=3x^2-3m \\ge 0\\ \\forall x \\Leftrightarrow m \\le 0$.</p>

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Xét tính đơn điệu của $y=x^3-3x$.</p>
                  <p><strong>Giải:</strong> TXĐ: $\\mathbb{R}$. $y'=3x^2-3=3(x-1)(x+1)$; $y'=0 \\Leftrightarrow x=\\pm 1$.</p>
                  <table class="bbt">
                    <tr><td class="lbl">$x$</td><td>$-\\infty$</td><td>$-1$</td><td>$1$</td><td>$+\\infty$</td></tr>
                    <tr><td class="lbl">$y'$</td><td>$+$</td><td>$0\\ -\\ 0$</td><td></td><td>$+$</td></tr>
                    <tr><td class="lbl">$y$</td><td>↗</td><td>$2$ (CĐ) ↘ $-2$ (CT)</td><td></td><td>↗</td></tr>
                  </table>
                  <p>Vậy hàm số đồng biến trên $(-\\infty;-1)$ và $(1;+\\infty)$; nghịch biến trên $(-1;1)$.</p>
                </div>

                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tìm các khoảng đơn điệu của $y=-x^3+3x^2-1$.</p>
                  <details><summary>Xem đáp án</summary>
                    <p>$y'=-3x^2+6x=-3x(x-2)$; $y'=0 \\Leftrightarrow x=0$ hoặc $x=2$. Hàm số <strong>đồng biến</strong> trên $(0;2)$, <strong>nghịch biến</strong> trên $(-\\infty;0)$ và $(2;+\\infty)$.</p>
                  </details>
                </div>

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (hàm phân thức)</div>
                  <p>Xét tính đơn điệu của $y=\\dfrac{x-2}{x+1}$.</p>
                  <p><strong>Giải:</strong> TXĐ $\\mathbb{R}\\setminus\\{-1\\}$. $y'=\\dfrac{(x+1)-(x-2)}{(x+1)^2}=\\dfrac{3}{(x+1)^2}>0$.</p>
                  <p>Vậy hàm <strong>đồng biến</strong> trên mỗi khoảng $(-\\infty;-1)$ và $(-1;+\\infty)$ (không kết luận đồng biến trên cả hai vì không liên tục tại $x=-1$).</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 3 (bài toán tham số)</div>
                  <p>Tìm $m$ để $y=x^3+3x^2+mx-1$ đồng biến trên $\\mathbb{R}$.</p>
                  <p><strong>Giải:</strong> $y'=3x^2+6x+m\\ge 0\\ \\forall x \\Leftrightarrow \\Delta'=9-3m\\le 0 \\Leftrightarrow m\\ge 3$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Xét tính đơn điệu của $y=x^4-2x^2$.</p>
                  <details><summary>Đáp án</summary><p>$y'=4x^3-4x=4x(x-1)(x+1)$. Đồng biến trên $(-1;0)$ và $(1;+\\infty)$; nghịch biến trên $(-\\infty;-1)$ và $(0;1)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm $m$ để $y=\\dfrac{mx+1}{x+2}$ đồng biến trên từng khoảng xác định.</p>
                  <details><summary>Đáp án</summary><p>$y'=\\dfrac{2m-1}{(x+2)^2}>0 \\Leftrightarrow 2m-1>0 \\Leftrightarrow m>\\dfrac{1}{2}$.</p></details>
                </div>
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
                <div class="luuy">
                  <strong>Lưu ý (bẫy thường gặp):</strong> $f'(x_0)=0$ là điều kiện <em>cần</em> nhưng <em>chưa đủ</em>. Phải kiểm tra $f'$ <strong>đổi dấu</strong> qua $x_0$.
                  <em>Phản ví dụ:</em> $y=x^3$ có $y'(0)=0$ nhưng $x=0$ <strong>không</strong> là điểm cực trị (vì $y'\\ge 0$ không đổi dấu).
                </div>
                <h2>Nâng cao</h2>
                <p>Dùng đạo hàm cấp hai: nếu $f'(x_0)=0$ và $f''(x_0)<0$ thì $x_0$ là cực đại; $f''(x_0)>0$ thì cực tiểu. (Khi $f''(x_0)=0$ phải xét dấu $f'$.)</p>

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tìm cực trị của $y=x^3-3x^2+2$.</p>
                  <p><strong>Giải:</strong> $y'=3x^2-6x=3x(x-2)$; $y'=0 \\Leftrightarrow x=0$ hoặc $x=2$.</p>
                  <ul>
                    <li>$x=0$: $y'$ đổi $+ \\to -$ ⇒ <strong>cực đại</strong>, $y_{CĐ}=2$.</li>
                    <li>$x=2$: $y'$ đổi $- \\to +$ ⇒ <strong>cực tiểu</strong>, $y_{CT}=-2$.</li>
                  </ul>
                </div>

                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tìm $m$ để $y=x^3-3mx+1$ có hai điểm cực trị.</p>
                  <details><summary>Xem đáp án</summary>
                    <p>$y'=3x^2-3m$. Hàm có 2 cực trị $\\Leftrightarrow y'=0$ có 2 nghiệm phân biệt $\\Leftrightarrow m>0$.</p>
                  </details>
                </div>

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (hàm trùng phương)</div>
                  <p>Tìm cực trị của $y=x^4-2x^2$.</p>
                  <p><strong>Giải:</strong> $y'=4x^3-4x=4x(x-1)(x+1)$; $y'=0\\Leftrightarrow x=0,\\pm1$.</p>
                  <ul>
                    <li>$x=\\pm1$: cực tiểu, $y_{CT}=-1$.</li>
                    <li>$x=0$: cực đại, $y_{CĐ}=0$.</li>
                  </ul>
                  <p>Đồ thị dạng chữ W — có <strong>3 cực trị</strong>.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 3 (dùng đạo hàm cấp hai)</div>
                  <p>Xét $y=x^3-3x$: $y'=3x^2-3=0\\Leftrightarrow x=\\pm1$; $y''=6x$.</p>
                  <p>$y''(-1)=-6<0$ ⇒ $x=-1$ cực đại; $y''(1)=6>0$ ⇒ $x=1$ cực tiểu.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Hàm $y=x^4+2x^2$ có mấy cực trị?</p>
                  <details><summary>Đáp án</summary><p>$y'=4x^3+4x=4x(x^2+1)=0\\Leftrightarrow x=0$. Chỉ <strong>1 cực trị</strong> (cực tiểu tại $x=0$).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm $m$ để $y=x^4-2mx^2+1$ có 3 điểm cực trị.</p>
                  <details><summary>Đáp án</summary><p>$y'=4x^3-4mx=4x(x^2-m)$. Có 3 cực trị $\\Leftrightarrow x^2=m$ có 2 nghiệm khác 0 $\\Leftrightarrow m>0$.</p></details>
                </div>
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

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tìm GTLN, GTNN của $y=x^3-3x+2$ trên $[0;2]$.</p>
                  <p><strong>Giải:</strong> $y'=3x^2-3=0 \\Leftrightarrow x=1$ (nhận $x=1\\in[0;2]$).</p>
                  <p>$y(0)=2,\\quad y(1)=0,\\quad y(2)=4$. Vậy $\\max y = 4$ tại $x=2$; $\\min y = 0$ tại $x=1$.</p>
                </div>

                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tìm GTNN của $y=x+\\dfrac{4}{x}$ trên $(0;+\\infty)$.</p>
                  <details><summary>Xem đáp án</summary>
                    <p>$y'=1-\\dfrac{4}{x^2}=0 \\Leftrightarrow x=2$. Lập BBT ⇒ $\\min y = y(2)=4$ (theo Cô-si: $x+\\dfrac{4}{x}\\ge 2\\sqrt{4}=4$).</p>
                  </details>
                </div>

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (trên đoạn, hàm trùng phương)</div>
                  <p>Tìm GTLN, GTNN của $y=x^4-2x^2+3$ trên $[-1;2]$.</p>
                  <p><strong>Giải:</strong> $y'=4x^3-4x=4x(x-1)(x+1)$; nghiệm trong đoạn: $x=-1,0,1$.</p>
                  <p>$y(-1)=2,\\ y(0)=3,\\ y(1)=2,\\ y(2)=11$. Vậy $\\max y=11$ tại $x=2$; $\\min y=2$ tại $x=\\pm1$.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 3 (bài toán thực tế)</div>
                  <p>Một mảnh vườn hình chữ nhật có chu vi $20$ m. Tìm kích thước để diện tích lớn nhất.</p>
                  <p><strong>Giải:</strong> Gọi một cạnh là $x$ thì cạnh kia $10-x$. $S=x(10-x)=-x^2+10x$, $S'=-2x+10=0\\Leftrightarrow x=5$. Vậy hình vuông cạnh $5$ m, $S_{\\max}=25\\ \\text{m}^2$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm GTLN, GTNN của $y=2x^3-3x^2-12x+1$ trên $[-2;3]$.</p>
                  <details><summary>Đáp án</summary><p>$y'=6x^2-6x-12=6(x-2)(x+1)$; nghiệm $-1,2$. $y(-2)=-3,\\ y(-1)=8,\\ y(2)=-19,\\ y(3)=-8$. Vậy $\\max=8$ tại $x=-1$; $\\min=-19$ tại $x=2$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm GTNN của $y=x+\\dfrac{9}{x}$ trên $(0;+\\infty)$.</p>
                  <details><summary>Đáp án</summary><p>$y'=1-\\dfrac{9}{x^2}=0\\Leftrightarrow x=3$; $\\min y=y(3)=6$ (Cô-si).</p></details>
                </div>
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

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tìm các tiệm cận của $y=\\dfrac{2x+1}{x-1}$.</p>
                  <p><strong>Giải:</strong> $\\lim\\limits_{x\\to 1^{\\pm}} y = \\pm\\infty$ ⇒ tiệm cận đứng $x=1$.</p>
                  <p>$\\lim\\limits_{x\\to\\pm\\infty} y = 2$ ⇒ tiệm cận ngang $y=2$.</p>
                </div>

                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tìm tiệm cận đứng và ngang của $y=\\dfrac{x+3}{2x-4}$.</p>
                  <details><summary>Xem đáp án</summary>
                    <p>Tiệm cận đứng $x=2$ (mẫu $=0$); tiệm cận ngang $y=\\dfrac{1}{2}$.</p>
                  </details>
                </div>

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (đồ thị & tiệm cận của hàm phân thức)</div>
                  <p>Đồ thị $y=\\dfrac{2x+1}{x-1}$ có tiệm cận đứng $x=1$ và tiệm cận ngang $y=2$ (đường nét đứt):</p>
                  <svg class="graph" viewBox="0 0 220 180" width="220" height="180" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="95" x2="215" y2="95" stroke="#94a3b8"/>
                    <line x1="60" y1="12" x2="60" y2="175" stroke="#94a3b8"/>
                    <line x1="120" y1="12" x2="120" y2="175" stroke="#dc2626" stroke-width="1" stroke-dasharray="4 3"/>
                    <line x1="10" y1="95" x2="215" y2="95" stroke="#16a34a" stroke-width="1" stroke-dasharray="4 3"/>
                    <polyline points="20,104 70,114 95,133 108,170" fill="none" stroke="#4f46e5" stroke-width="2"/>
                    <polyline points="132,20 145,58 170,76 220,86" fill="none" stroke="#4f46e5" stroke-width="2"/>
                    <text x="124" y="24" fill="#dc2626">x=1</text>
                    <text x="14" y="90" fill="#16a34a">y=2</text>
                  </svg>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 3 (tiệm cận xiên)</div>
                  <p>Tìm tiệm cận của $y=\\dfrac{x^2+1}{x}=x+\\dfrac{1}{x}$.</p>
                  <p><strong>Giải:</strong> Tiệm cận đứng $x=0$. Tiệm cận xiên: $a=\\lim\\dfrac{y}{x}=1$, $b=\\lim(y-x)=\\lim\\dfrac{1}{x}=0$ ⇒ $y=x$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm tiệm cận đứng và ngang của $y=\\dfrac{3x-2}{x+1}$.</p>
                  <details><summary>Đáp án</summary><p>Tiệm cận đứng $x=-1$; tiệm cận ngang $y=3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Đồ thị $y=\\dfrac{2x-1}{x^2-1}$ có tất cả bao nhiêu đường tiệm cận?</p>
                  <details><summary>Đáp án</summary><p>Mẫu $x^2-1=(x-1)(x+1)$ ⇒ 2 tiệm cận đứng $x=\\pm1$; bậc tử $<$ bậc mẫu ⇒ tiệm cận ngang $y=0$. Tổng cộng <strong>3 tiệm cận</strong>.</p></details>
                </div>
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

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu — Khảo sát $y=x^3-3x$</div>
                  <p>TXĐ $\\mathbb{R}$; $y'=3x^2-3$, $y'=0 \\Leftrightarrow x=\\pm1$. $\\lim\\limits_{x\\to\\pm\\infty}y=\\pm\\infty$.</p>
                  <table class="bbt">
                    <tr><td class="lbl">$x$</td><td>$-\\infty$</td><td>$-1$</td><td>$1$</td><td>$+\\infty$</td></tr>
                    <tr><td class="lbl">$y'$</td><td>$+$</td><td>$0\\ -\\ 0$</td><td></td><td>$+$</td></tr>
                    <tr><td class="lbl">$y$</td><td>↗</td><td>$2$ ↘ $-2$</td><td></td><td>↗</td></tr>
                  </table>
                  <p>Đồ thị (điểm uốn $O(0;0)$, cực đại $(-1;2)$, cực tiểu $(1;-2)$):</p>
                  <svg class="graph" viewBox="0 0 240 200" width="240" height="200" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="100" x2="232" y2="100" stroke="#94a3b8" stroke-width="1"/>
                    <line x1="120" y1="15" x2="120" y2="190" stroke="#94a3b8" stroke-width="1"/>
                    <polygon points="232,100 226,97 226,103" fill="#94a3b8"/>
                    <polygon points="120,15 117,21 123,21" fill="#94a3b8"/>
                    <polyline points="20,160 45,66 70,40 95,59 120,100 145,141 170,160 195,134 220,40" fill="none" stroke="#4f46e5" stroke-width="2"/>
                    <circle cx="70" cy="40" r="3" fill="#16a34a"/>
                    <circle cx="170" cy="160" r="3" fill="#dc2626"/>
                    <text x="124" y="13">y</text>
                    <text x="228" y="113">x</text>
                    <text x="124" y="113">O</text>
                    <text x="48" y="36">CĐ(-1;2)</text>
                    <text x="150" y="175">CT(1;-2)</text>
                  </svg>
                </div>

                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Lập bảng biến thiên của $y=-x^3+3x^2$ và nêu cực trị.</p>
                  <details><summary>Xem đáp án</summary>
                    <p>$y'=-3x^2+6x=-3x(x-2)$; $x=0$ (CT, $y=0$), $x=2$ (CĐ, $y=4$). Đồng biến $(0;2)$, nghịch biến ngoài đoạn đó.</p>
                  </details>
                </div>

                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 — Khảo sát $y=x^4-2x^2$ (hàm trùng phương)</div>
                  <p>TXĐ $\\mathbb{R}$; $y'=4x^3-4x=4x(x-1)(x+1)$, nghiệm $x=0,\\pm1$. $\\lim\\limits_{x\\to\\pm\\infty}y=+\\infty$.</p>
                  <table class="bbt">
                    <tr><td class="lbl">$x$</td><td>$-\\infty$</td><td>$-1$</td><td>$0$</td><td>$1$</td><td>$+\\infty$</td></tr>
                    <tr><td class="lbl">$y'$</td><td>$-$</td><td>$0\\,+$</td><td>$0\\,-$</td><td>$0\\,+$</td><td></td></tr>
                    <tr><td class="lbl">$y$</td><td>↘</td><td>$-1$ ↗ $0$</td><td>↘ $-1$</td><td>↗</td><td></td></tr>
                  </table>
                  <p>Đồ thị đối xứng qua trục $Oy$ (hàm chẵn), dạng chữ W; CĐ $(0;0)$, hai CT $(\\pm1;-1)$:</p>
                  <svg class="graph" viewBox="0 0 220 150" width="220" height="150" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="76" x2="215" y2="76" stroke="#94a3b8"/>
                    <line x1="110" y1="20" x2="110" y2="140" stroke="#94a3b8"/>
                    <polyline points="20,51 50,121 80,96 110,76 140,96 170,121 200,51" fill="none" stroke="#4f46e5" stroke-width="2"/>
                    <circle cx="110" cy="76" r="3" fill="#16a34a"/>
                    <circle cx="50" cy="121" r="3" fill="#dc2626"/>
                    <circle cx="170" cy="121" r="3" fill="#dc2626"/>
                    <text x="113" y="18">y</text>
                    <text x="205" y="73">x</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Lập bảng biến thiên của $y=-x^4+2x^2$ và nêu cực trị.</p>
                  <details><summary>Đáp án</summary><p>$y'=-4x^3+4x=-4x(x-1)(x+1)$; CĐ tại $x=\\pm1$ ($y=1$), CT tại $x=0$ ($y=0$). Đồ thị dạng chữ M (úp ngược).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Đồ thị hàm $y=\\dfrac{ax+b}{cx+d}$ có dạng gì?</p>
                  <details><summary>Đáp án</summary><p>Dạng <strong>hyperbol</strong> gồm hai nhánh, nhận tiệm cận đứng $x=-\\dfrac{d}{c}$ và tiệm cận ngang $y=\\dfrac{a}{c}$ làm tâm đối xứng.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Cho $\\vec{a}=(1;0;1)$, $\\vec{b}=(0;1;1)$, $\\vec{c}=(1;1;2)$. Chứng minh ba vectơ đồng phẳng.</p>
                  <p><strong>Giải:</strong> Ta thấy $\\vec{a}+\\vec{b}=(1;1;2)=\\vec{c}$, tức $\\vec{c}=1\\cdot\\vec{a}+1\\cdot\\vec{b}$. Vậy ba vectơ đồng phẳng.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Cho $\\vec{u}=(2;-1;0)$, $\\vec{v}=(1;3;1)$. Tính $\\vec{u}+2\\vec{v}$.</p>
                  <details><summary>Xem đáp án</summary><p>$\\vec{u}+2\\vec{v}=(2+2;\\,-1+6;\\,0+2)=(4;5;2)$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (quy tắc hình hộp)</div>
                  <p>Trong hình hộp $ABCD.A'B'C'D'$, chứng minh $\\vec{AB}+\\vec{AD}+\\vec{AA'}=\\vec{AC'}$.</p>
                  <p><strong>Giải:</strong> $\\vec{AB}+\\vec{AD}=\\vec{AC}$ (quy tắc hình bình hành đáy); cộng tiếp $\\vec{AA'}$ ⇒ $\\vec{AC}+\\vec{AA'}=\\vec{AC'}$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tính độ dài $\\vec{a}=(1;2;-1)$.</p>
                  <details><summary>Đáp án</summary><p>$|\\vec{a}|=\\sqrt{1+4+1}=\\sqrt{6}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Ba vectơ $\\vec{a}=(1;1;0)$, $\\vec{b}=(0;1;1)$, $\\vec{c}=(2;3;1)$ có đồng phẳng không?</p>
                  <details><summary>Đáp án</summary><p>$2\\vec{a}+\\vec{b}=(2;3;1)=\\vec{c}$ ⇒ <strong>đồng phẳng</strong>.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Cho $A(1;2;-1)$, $B(3;0;5)$. Tính $\\vec{AB}$, $AB$ và trung điểm $I$.</p>
                  <p><strong>Giải:</strong> $\\vec{AB}=(2;-2;6)$; $AB=\\sqrt{4+4+36}=\\sqrt{44}=2\\sqrt{11}$; $I=(2;1;2)$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Cho $A(0;1;2)$, $B(2;3;4)$, $C(4;5;0)$. Tìm trọng tâm $G$ của $\\triangle ABC$.</p>
                  <details><summary>Xem đáp án</summary><p>$G=\\left(\\dfrac{0+2+4}{3};\\dfrac{1+3+5}{3};\\dfrac{2+4+0}{3}\\right)=(2;3;2)$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (tìm điểm)</div>
                  <p>Cho $A(2;-1;3)$, $B(0;1;1)$. Tìm $M$ sao cho $B$ là trung điểm $AM$.</p>
                  <p><strong>Giải:</strong> $M=2B-A=(2\\cdot0-2;\\ 2\\cdot1-(-1);\\ 2\\cdot1-3)=(-2;3;-1)$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm điểm đối xứng của $A(1;2;3)$ qua gốc tọa độ $O$.</p>
                  <details><summary>Đáp án</summary><p>$A'=(-1;-2;-3)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm trọng tâm tam giác $A(1;0;0)$, $B(0;2;0)$, $C(0;0;3)$.</p>
                  <details><summary>Đáp án</summary><p>$G=\\left(\\dfrac{1}{3};\\dfrac{2}{3};1\\right)$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Cho $\\vec{u}=(1;2;2)$, $\\vec{v}=(2;-2;1)$. Tính $\\vec{u}\\cdot\\vec{v}$ và góc giữa hai vectơ.</p>
                  <p><strong>Giải:</strong> $\\vec{u}\\cdot\\vec{v}=2-4+2=0$ ⇒ $\\vec{u}\\perp\\vec{v}$, góc bằng $90^\\circ$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tìm $m$ để $\\vec{a}=(1;m;-1)$ vuông góc $\\vec{b}=(2;1;3)$.</p>
                  <details><summary>Xem đáp án</summary><p>$\\vec{a}\\cdot\\vec{b}=2+m-3=m-1=0 \\Leftrightarrow m=1$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (góc giữa hai vectơ)</div>
                  <p>Tính góc giữa $\\vec{u}=(1;1;0)$ và $\\vec{v}=(1;0;1)$.</p>
                  <p><strong>Giải:</strong> $\\cos(\\vec{u},\\vec{v})=\\dfrac{1+0+0}{\\sqrt{2}\\cdot\\sqrt{2}}=\\dfrac{1}{2}$ ⇒ góc $=60^\\circ$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tính $\\vec{u}\\cdot\\vec{v}$ với $\\vec{u}=(2;3;-1)$, $\\vec{v}=(1;-1;2)$.</p>
                  <details><summary>Đáp án</summary><p>$2-3-2=-3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm góc giữa $\\vec{a}=(1;0;0)$ và $\\vec{b}=(1;1;0)$.</p>
                  <details><summary>Đáp án</summary><p>$\\cos=\\dfrac{1}{\\sqrt{2}}$ ⇒ góc $=45^\\circ$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Mẫu: $4,6,7,9,10,12,15$. Tính $R$ và $\\Delta_Q$.</p>
                  <p><strong>Giải:</strong> $R=15-4=11$. Trung vị $=9$; nửa dưới $\\{4,6,7\\}\\Rightarrow Q_1=6$; nửa trên $\\{10,12,15\\}\\Rightarrow Q_3=12$. Vậy $\\Delta_Q=12-6=6$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Mẫu: $5,8,8,11,14,20$. Tính $R$ và $\\Delta_Q$.</p>
                  <details><summary>Xem đáp án</summary><p>$R=20-5=15$; $Q_1=8$, $Q_3=14 \\Rightarrow \\Delta_Q=6$. (Kiểm ngoại lệ: $20<14+1{,}5\\cdot 6=23$ nên không có ngoại lệ.)</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (mẫu ghép nhóm)</div>
                  <p>Chiều cao (cm) học sinh: $[150;160)$ tần số 5, $[160;170)$ tần số 12, $[170;180)$ tần số 3.</p>
                  <p><strong>Giải:</strong> Khoảng biến thiên $\\approx 180-150=30$ cm (lấy theo đầu mút nhóm đầu và cuối).</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Mẫu $3,7,7,10,15,18,21$. Tính $R$ và $\\Delta_Q$.</p>
                  <details><summary>Đáp án</summary><p>$R=21-3=18$; trung vị $=10$, $Q_1=7$, $Q_3=18 \\Rightarrow \\Delta_Q=11$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm giá trị ngoại lệ (nếu có) của mẫu $2,5,6,7,8,30$.</p>
                  <details><summary>Đáp án</summary><p>$Q_1=5,\\ Q_3=8,\\ \\Delta_Q=3$; ngưỡng trên $8+1{,}5\\cdot3=12{,}5$. Vậy $30$ là <strong>ngoại lệ</strong>.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Mẫu ghép nhóm: $[0;10)$, $[10;20)$, $[20;30)$ với tần số $2,5,3$ (giá trị đại diện $5,15,25$).</p>
                  <p><strong>Giải:</strong> $\\bar{x}=\\dfrac{2\\cdot5+5\\cdot15+3\\cdot25}{10}=\\dfrac{160}{10}=16$.</p>
                  <p>$s^2=\\dfrac{1}{10}\\big[2(5-16)^2+5(15-16)^2+3(25-16)^2\\big]=\\dfrac{242+5+243}{10}=49 \\Rightarrow s=7$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tính phương sai của mẫu có giá trị đại diện $2,4,6$ với tần số $1,2,1$.</p>
                  <details><summary>Xem đáp án</summary><p>$\\bar{x}=\\dfrac{2+8+6}{4}=4$; $s^2=\\dfrac{1}{4}[1\\cdot4+2\\cdot0+1\\cdot4]=2$, $s=\\sqrt{2}$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (biểu đồ tần số)</div>
                  <p>Mẫu ghép nhóm với tần số $2,5,3$ (ví dụ trên) có biểu đồ cột:</p>
                  <svg class="graph" viewBox="0 0 220 150" width="220" height="150" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="120" x2="200" y2="120" stroke="#94a3b8"/>
                    <rect x="34" y="88" width="40" height="32" fill="#4f46e5" opacity="0.85"/>
                    <rect x="90" y="40" width="40" height="80" fill="#4f46e5" opacity="0.85"/>
                    <rect x="146" y="72" width="40" height="48" fill="#4f46e5" opacity="0.85"/>
                    <text x="50" y="84" text-anchor="middle">2</text>
                    <text x="110" y="36" text-anchor="middle">5</text>
                    <text x="166" y="68" text-anchor="middle">3</text>
                    <text x="54" y="132" text-anchor="middle">[0;10)</text>
                    <text x="110" y="132" text-anchor="middle">[10;20)</text>
                    <text x="166" y="132" text-anchor="middle">[20;30)</text>
                  </svg>
                  <p>So sánh độ ổn định: hai mẫu cùng $\\bar{x}$, mẫu nào có $s$ nhỏ hơn thì <strong>ổn định hơn</strong>.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tính phương sai mẫu có giá trị đại diện $10,20,30$ với tần số $3,4,3$.</p>
                  <details><summary>Đáp án</summary><p>$\\bar{x}=\\dfrac{30+80+90}{10}=20$; $s^2=\\dfrac{1}{10}[3\\cdot100+4\\cdot0+3\\cdot100]=60$, $s=2\\sqrt{15}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Mẫu A có $s=2$, mẫu B có $s=5$ (cùng trung bình). Mẫu nào ổn định hơn?</p>
                  <details><summary>Đáp án</summary><p>Mẫu A (độ lệch chuẩn nhỏ hơn ⇒ ít phân tán hơn).</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tìm $\\displaystyle\\int (3x^2+2x)\\,dx$.</p>
                  <p><strong>Giải:</strong> $\\displaystyle\\int (3x^2+2x)\\,dx = x^3 + x^2 + C$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tìm $\\displaystyle\\int \\left(e^x+\\dfrac{1}{x}\\right)dx$.</p>
                  <details><summary>Xem đáp án</summary><p>$e^x+\\ln|x|+C$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (đổi biến đơn giản)</div>
                  <p>Tìm $\\displaystyle\\int \\cos(2x)\\,dx$.</p>
                  <p><strong>Giải:</strong> $\\displaystyle\\int \\cos(2x)\\,dx=\\dfrac{1}{2}\\sin(2x)+C$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm $\\displaystyle\\int (4x^3-2)\\,dx$.</p>
                  <details><summary>Đáp án</summary><p>$x^4-2x+C$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm $\\displaystyle\\int e^{2x}\\,dx$.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{1}{2}e^{2x}+C$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tính $\\displaystyle\\int_1^2 2x\\,dx$.</p>
                  <p><strong>Giải:</strong> $\\displaystyle\\int_1^2 2x\\,dx=\\big[x^2\\big]_1^2=4-1=3$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tính $\\displaystyle\\int_0^{\\pi/2}\\cos x\\,dx$.</p>
                  <details><summary>Xem đáp án</summary><p>$\\big[\\sin x\\big]_0^{\\pi/2}=1-0=1$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (tích phân từng phần)</div>
                  <p>Tính $\\displaystyle\\int_0^1 x e^{x}\\,dx$.</p>
                  <p><strong>Giải:</strong> Đặt $u=x,\\ dv=e^x dx$ ⇒ $du=dx,\\ v=e^x$. $\\int_0^1 xe^x dx=[xe^x]_0^1-\\int_0^1 e^x dx=e-(e-1)=1$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tính $\\displaystyle\\int_1^2 \\dfrac{1}{x}\\,dx$.</p>
                  <details><summary>Đáp án</summary><p>$[\\ln x]_1^2=\\ln 2$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tính $\\displaystyle\\int_0^1 (3x^2+1)\\,dx$.</p>
                  <details><summary>Đáp án</summary><p>$[x^3+x]_0^1=2$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tính diện tích hình phẳng giới hạn bởi $y=x^2$, trục $Ox$, $x=0$, $x=2$.</p>
                  <p><strong>Giải:</strong> $S=\\displaystyle\\int_0^2 x^2\\,dx=\\Big[\\dfrac{x^3}{3}\\Big]_0^2=\\dfrac{8}{3}$ (đvdt).</p>
                  <svg class="graph" viewBox="0 0 200 160" width="200" height="160" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="140" x2="190" y2="140" stroke="#94a3b8"/>
                    <line x1="30" y1="15" x2="30" y2="150" stroke="#94a3b8"/>
                    <path d="M30,140 L65,132 L100,110 L135,72 L170,20 L170,140 Z" fill="rgba(79,70,229,0.18)" stroke="none"/>
                    <polyline points="30,140 65,132 100,110 135,72 170,20" fill="none" stroke="#4f46e5" stroke-width="2"/>
                    <text x="172" y="152">x=2</text>
                    <text x="34" y="13">y</text>
                    <text x="100" y="100">S</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tính thể tích khối tròn xoay khi quay $y=\\sqrt{x}$ quanh $Ox$, từ $x=0$ đến $x=4$.</p>
                  <details><summary>Xem đáp án</summary><p>$V=\\pi\\displaystyle\\int_0^4 x\\,dx=\\pi\\Big[\\dfrac{x^2}{2}\\Big]_0^4=8\\pi$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (diện tích giữa hai đường)</div>
                  <p>Tính diện tích hình phẳng giới hạn bởi $y=x$ và $y=x^2$.</p>
                  <p><strong>Giải:</strong> Giao điểm $x=0,\\ x=1$; trên $(0;1)$ thì $x\\ge x^2$.</p>
                  <p>$S=\\displaystyle\\int_0^1 (x-x^2)\\,dx=\\Big[\\dfrac{x^2}{2}-\\dfrac{x^3}{3}\\Big]_0^1=\\dfrac{1}{2}-\\dfrac{1}{3}=\\dfrac{1}{6}$.</p>
                  <svg class="graph" viewBox="0 0 200 160" width="200" height="160" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="140" x2="190" y2="140" stroke="#94a3b8"/>
                    <line x1="30" y1="15" x2="30" y2="150" stroke="#94a3b8"/>
                    <path d="M30,140 L150,40 L120,84 L90,115 L60,134 Z" fill="rgba(79,70,229,0.18)" stroke="none"/>
                    <polyline points="30,140 150,40" fill="none" stroke="#dc2626" stroke-width="2"/>
                    <polyline points="30,140 60,134 90,115 120,84 150,40" fill="none" stroke="#4f46e5" stroke-width="2"/>
                    <text x="152" y="38" fill="#dc2626">y=x</text>
                    <text x="150" y="60" fill="#4f46e5">y=x²</text>
                    <text x="78" y="120">S=1/6</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Diện tích hình phẳng giới hạn $y=x^2$, $Ox$, $x=1$, $x=3$.</p>
                  <details><summary>Đáp án</summary><p>$S=\\displaystyle\\int_1^3 x^2 dx=\\Big[\\dfrac{x^3}{3}\\Big]_1^3=\\dfrac{27-1}{3}=\\dfrac{26}{3}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Thể tích khi quay $y=x$ quanh $Ox$ từ $0$ đến $3$.</p>
                  <details><summary>Đáp án</summary><p>$V=\\pi\\displaystyle\\int_0^3 x^2 dx=\\pi\\Big[\\dfrac{x^3}{3}\\Big]_0^3=9\\pi$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Viết phương trình mặt phẳng qua $A(1;2;3)$ có pháp tuyến $\\vec{n}=(2;-1;2)$.</p>
                  <p><strong>Giải:</strong> $2(x-1)-1(y-2)+2(z-3)=0 \\Leftrightarrow 2x-y+2z-6=0$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tính khoảng cách từ $M(1;1;1)$ đến $(P): x+2y+2z-9=0$.</p>
                  <details><summary>Xem đáp án</summary><p>$d=\\dfrac{|1+2+2-9|}{\\sqrt{1+4+4}}=\\dfrac{4}{3}$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (mặt phẳng qua 3 điểm)</div>
                  <p>Viết phương trình mặt phẳng qua $A(1;0;0)$, $B(0;2;0)$, $C(0;0;3)$.</p>
                  <p><strong>Giải:</strong> Dùng phương trình theo đoạn chắn: $\\dfrac{x}{1}+\\dfrac{y}{2}+\\dfrac{z}{3}=1 \\Leftrightarrow 6x+3y+2z-6=0$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Viết pt mặt phẳng qua $M(0;0;0)$ pháp tuyến $\\vec{n}=(1;1;1)$.</p>
                  <details><summary>Đáp án</summary><p>$x+y+z=0$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Khoảng cách từ gốc $O$ đến $(P): 2x-2y+z+6=0$.</p>
                  <details><summary>Đáp án</summary><p>$d=\\dfrac{|6|}{\\sqrt{4+4+1}}=\\dfrac{6}{3}=2$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Viết phương trình đường thẳng qua $A(1;0;-1)$ có vectơ chỉ phương $\\vec{u}=(2;1;3)$.</p>
                  <p><strong>Giải:</strong> Tham số: $x=1+2t,\\ y=t,\\ z=-1+3t$. Chính tắc: $\\dfrac{x-1}{2}=\\dfrac{y}{1}=\\dfrac{z+1}{3}$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Viết phương trình tham số đường thẳng qua $A(2;1;0)$ và $B(3;-1;2)$.</p>
                  <details><summary>Xem đáp án</summary><p>$\\vec{AB}=(1;-2;2)$; $x=2+t,\\ y=1-2t,\\ z=2t$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (điểm thuộc đường thẳng)</div>
                  <p>Đường thẳng $d: x=1+2t,\\ y=-t,\\ z=3+t$. Điểm $A(3;-1;4)$ có thuộc $d$ không?</p>
                  <p><strong>Giải:</strong> Từ $x$: $3=1+2t\\Rightarrow t=1$. Thay: $y=-1$ ✓, $z=4$ ✓. Vậy $A\\in d$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm một vectơ chỉ phương của $d:\\dfrac{x-1}{2}=\\dfrac{y}{-3}=\\dfrac{z+2}{1}$.</p>
                  <details><summary>Đáp án</summary><p>$\\vec{u}=(2;-3;1)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Viết pt tham số đường thẳng qua $O$ và $A(1;2;3)$.</p>
                  <details><summary>Đáp án</summary><p>$x=t,\\ y=2t,\\ z=3t$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tìm tâm và bán kính mặt cầu $x^2+y^2+z^2-2x+4y-4=0$.</p>
                  <p><strong>Giải:</strong> $a=1,\\ b=-2,\\ c=0,\\ d=-4$; tâm $I(1;-2;0)$, $R=\\sqrt{1+4+0-(-4)}=3$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Tìm tâm, bán kính mặt cầu $x^2+y^2+z^2-4x+6y-2z+5=0$.</p>
                  <details><summary>Xem đáp án</summary><p>Tâm $I(2;-3;1)$; $R=\\sqrt{4+9+1-5}=3$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (mặt cầu qua tâm & điểm)</div>
                  <p>Viết phương trình mặt cầu tâm $I(1;0;-2)$ đi qua $A(3;0;-2)$.</p>
                  <p><strong>Giải:</strong> $R=IA=\\sqrt{(3-1)^2+0+0}=2$. Vậy $(x-1)^2+y^2+(z+2)^2=4$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm tâm, bán kính của $(x+1)^2+(y-2)^2+z^2=9$.</p>
                  <details><summary>Đáp án</summary><p>Tâm $I(-1;2;0)$, $R=3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Mặt cầu tâm $O$ bán kính $5$ có phương trình?</p>
                  <details><summary>Đáp án</summary><p>$x^2+y^2+z^2=25$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Gieo một con xúc xắc cân đối. $A$: "số chấm chẵn", $B$: "số chấm $\\ge 3$". Tính $P(A\\mid B)$.</p>
                  <p><strong>Giải:</strong> $B=\\{3,4,5,6\\}$, $A\\cap B=\\{4,6\\}$. Vậy $P(A\\mid B)=\\dfrac{2}{4}=\\dfrac{1}{2}$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Rút ngẫu nhiên 1 lá bài. $A$: "lá Cơ", $B$: "lá màu đỏ". Tính $P(A\\mid B)$.</p>
                  <details><summary>Xem đáp án</summary><p>$B$ có 26 lá đỏ, $A\\cap B$ là 13 lá Cơ ⇒ $P(A\\mid B)=\\dfrac{13}{26}=\\dfrac{1}{2}$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (rút không hoàn lại)</div>
                  <p>Hộp có 3 bi đỏ, 2 bi xanh. Rút lần lượt 2 bi (không hoàn lại). Tính xác suất bi thứ hai đỏ, biết bi thứ nhất đỏ.</p>
                  <p><strong>Giải:</strong> Sau khi rút 1 bi đỏ, còn 2 đỏ + 2 xanh ⇒ $P=\\dfrac{2}{4}=\\dfrac{1}{2}$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Cho $P(A\\cap B)=0{,}3$, $P(A\\mid B)=0{,}6$. Tính $P(B)$.</p>
                  <details><summary>Đáp án</summary><p>$P(B)=\\dfrac{P(A\\cap B)}{P(A\\mid B)}=\\dfrac{0{,}3}{0{,}6}=0{,}5$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> $A,B$ độc lập, $P(A)=0{,}4$, $P(B)=0{,}5$. Tính $P(A\\cap B)$.</p>
                  <details><summary>Đáp án</summary><p>$P(A\\cap B)=P(A)P(B)=0{,}2$.</p></details>
                </div>
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
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu (xét nghiệm)</div>
                  <p>Tỉ lệ mắc bệnh $P(B)=1\\%$. Xét nghiệm: dương khi có bệnh $P(D\\mid B)=99\\%$, dương khi không bệnh $P(D\\mid \\bar B)=5\\%$. Một người có kết quả dương, tính $P(B\\mid D)$.</p>
                  <p><strong>Giải:</strong> $P(D)=0{,}01\\cdot0{,}99+0{,}99\\cdot0{,}05=0{,}0594$.</p>
                  <p>$P(B\\mid D)=\\dfrac{0{,}01\\cdot0{,}99}{0{,}0594}\\approx 0{,}167=16{,}7\\%$ (thấp bất ngờ — vì bệnh hiếm).</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập</div>
                  <p>Hộp 1: 3 đỏ, 7 xanh; Hộp 2: 6 đỏ, 4 xanh. Chọn ngẫu nhiên 1 hộp rồi rút 1 viên, được viên đỏ. Tính xác suất viên đó lấy từ Hộp 1.</p>
                  <details><summary>Xem đáp án</summary><p>$P(\\text{đỏ})=0{,}5\\cdot0{,}3+0{,}5\\cdot0{,}6=0{,}45$; $P(H_1\\mid \\text{đỏ})=\\dfrac{0{,}15}{0{,}45}=\\dfrac{1}{3}$.</p></details>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ 2 (sơ đồ cây)</div>
                  <p>Bài tập trên minh họa bằng sơ đồ cây (nhánh ghi xác suất):</p>
                  <svg class="graph" viewBox="0 0 250 160" width="250" height="160" xmlns="http://www.w3.org/2000/svg">
                    <line x1="40" y1="80" x2="95" y2="45" stroke="#4f46e5"/>
                    <line x1="40" y1="80" x2="95" y2="115" stroke="#4f46e5"/>
                    <line x1="112" y1="45" x2="195" y2="25" stroke="#94a3b8"/>
                    <line x1="112" y1="45" x2="195" y2="62" stroke="#94a3b8"/>
                    <line x1="112" y1="115" x2="195" y2="100" stroke="#94a3b8"/>
                    <line x1="112" y1="115" x2="195" y2="138" stroke="#94a3b8"/>
                    <text x="20" y="83">Chọn</text>
                    <text x="100" y="44" font-weight="bold">H₁</text>
                    <text x="100" y="119" font-weight="bold">H₂</text>
                    <text x="60" y="56" fill="#4f46e5">0,5</text>
                    <text x="60" y="105" fill="#4f46e5">0,5</text>
                    <text x="200" y="27">Đỏ (0,3)</text>
                    <text x="200" y="64">Xanh</text>
                    <text x="200" y="102">Đỏ (0,6)</text>
                    <text x="200" y="140">Xanh</text>
                  </svg>
                  <p>$P(\\text{đỏ})=0{,}5\\cdot0{,}3+0{,}5\\cdot0{,}6=0{,}45$ (tổng tích các nhánh dẫn tới "Đỏ").</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Bệnh hiếm $P(B)=2\\%$, xét nghiệm đúng dương $90\\%$, dương giả $10\\%$. Tính $P(\\text{dương})$.</p>
                  <details><summary>Đáp án</summary><p>$P(D)=0{,}02\\cdot0{,}9+0{,}98\\cdot0{,}1=0{,}018+0{,}098=0{,}116$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Với số liệu Bài 1, tính $P(B\\mid \\text{dương})$.</p>
                  <details><summary>Đáp án</summary><p>$P(B\\mid D)=\\dfrac{0{,}018}{0{,}116}\\approx 0{,}155=15{,}5\\%$.</p></details>
                </div>
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
          id: 't-ly-c1', title: 'Chương 1 · Vật lí nhiệt',
          lessons: [
            {
              id: 'l-ly-noinang', title: 'Nội năng & Định luật I Nhiệt động lực học', level: 'CO_BAN',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> <em>Nội năng</em> $U$ của một vật là tổng động năng (chuyển động nhiệt) và thế năng tương tác của các phân tử cấu tạo nên vật. Đơn vị: jun (J).</div>
                <h2>Cốt lõi</h2>
                <p>Nội năng thay đổi qua hai cách: <strong>thực hiện công</strong> và <strong>truyền nhiệt</strong>.</p>
                <p><strong>Định luật I Nhiệt động lực học:</strong> $\\Delta U = A + Q$</p>
                <ul>
                  <li>$Q>0$: hệ <em>nhận</em> nhiệt; $Q<0$: hệ <em>tỏa</em> nhiệt.</li>
                  <li>$A>0$: hệ <em>nhận</em> công; $A<0$: hệ <em>sinh</em> công.</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Quá trình đẳng nhiệt của khí lí tưởng: $\\Delta U=0 \\Rightarrow Q=-A$ (nhiệt nhận vào bằng công hệ sinh ra).</p>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ</div>
                  <p>Truyền cho khí nhiệt lượng $Q=100$ J, khí sinh công $40$ J. Tính $\\Delta U$.</p>
                  <p><strong>Giải:</strong> Khí sinh công ⇒ $A=-40$ J. $\\Delta U=A+Q=-40+100=60$ J.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Hệ nhận công $50$ J và tỏa nhiệt $30$ J. Tính $\\Delta U$.</p>
                  <details><summary>Đáp án</summary><p>$A=+50,\\ Q=-30 \\Rightarrow \\Delta U=50-30=20$ J.</p></details>
                </div>
              `,
            },
            {
              id: 'l-ly-nhietluong', title: 'Nhiệt lượng & nhiệt dung riêng', level: 'CO_BAN',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> <em>Nhiệt dung riêng</em> $c$ là nhiệt lượng cần truyền cho 1 kg chất để tăng 1 °C (hay 1 K). Đơn vị: J/(kg·K).</div>
                <h2>Cốt lõi</h2>
                <p>Nhiệt lượng thu vào hay tỏa ra: $Q = mc\\,\\Delta t$, với $m$ (kg), $\\Delta t$ độ thay đổi nhiệt độ.</p>
                <p>Nước có $c \\approx 4200$ J/(kg·K).</p>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Đun $2$ kg nước từ $20$ °C lên $100$ °C. Tính nhiệt lượng cần ($c=4200$).</p>
                  <p><strong>Giải:</strong> $Q=mc\\Delta t=2\\cdot4200\\cdot80=672000$ J $=672$ kJ.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Cần bao nhiêu nhiệt lượng để $0{,}5$ kg nước tăng thêm $10$ °C?</p>
                  <details><summary>Đáp án</summary><p>$Q=0{,}5\\cdot4200\\cdot10=21000$ J $=21$ kJ.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-ly-c2', title: 'Chương 2 · Khí lí tưởng',
          lessons: [
            {
              id: 'l-ly-dinhluatkhi', title: 'Các định luật chất khí & phương trình trạng thái', level: 'CO_BAN',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> <em>Khí lí tưởng</em> là khí mà các phân tử được coi là chất điểm, chỉ tương tác khi va chạm. Nhiệt độ phải tính theo thang Kelvin: $T(K)=t(°C)+273$.</div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Đẳng nhiệt</strong> (Boyle, $T$ const): $pV=\\text{const}\\Rightarrow p_1V_1=p_2V_2$.</li>
                  <li><strong>Đẳng tích</strong> ($V$ const): $\\dfrac{p}{T}=\\text{const}$.</li>
                  <li><strong>Đẳng áp</strong> ($p$ const): $\\dfrac{V}{T}=\\text{const}$.</li>
                  <li><strong>Phương trình trạng thái:</strong> $\\dfrac{p_1V_1}{T_1}=\\dfrac{p_2V_2}{T_2}$.</li>
                </ul>
                <p>Đường đẳng nhiệt trong hệ $(V,p)$ là một nhánh hypebol:</p>
                <svg class="graph" viewBox="0 0 200 150" width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                  <line x1="25" y1="130" x2="195" y2="130" stroke="#94a3b8"/>
                  <line x1="30" y1="15" x2="30" y2="135" stroke="#94a3b8"/>
                  <polyline points="65,30 82,63 100,80 135,97 170,107" fill="none" stroke="#4f46e5" stroke-width="2"/>
                  <text x="184" y="126">V</text>
                  <text x="34" y="22">p</text>
                  <text x="120" y="55">T = const</text>
                </svg>
                <div class="vd"><div class="vd-title">📝 Ví dụ (đẳng nhiệt)</div>
                  <p>Khí có $p_1=1$ atm, $V_1=2$ L. Nén đẳng nhiệt còn $V_2=1$ L. Tính $p_2$.</p>
                  <p><strong>Giải:</strong> $p_2=\\dfrac{p_1V_1}{V_2}=\\dfrac{1\\cdot2}{1}=2$ atm.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập (đẳng tích)</div>
                  <p>Khí ở $p_1=2$ atm, $T_1=300$ K. Đun đẳng tích tới $T_2=600$ K. Tính $p_2$.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{p}{T}$ const ⇒ $p_2=p_1\\dfrac{T_2}{T_1}=2\\cdot2=4$ atm.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-ly-c3', title: 'Chương 3 · Từ trường',
          lessons: [
            {
              id: 'l-ly-luctu', title: 'Cảm ứng từ & Lực từ', level: 'CO_BAN',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> <em>Cảm ứng từ</em> $\\vec{B}$ đặc trưng cho độ mạnh và hướng của từ trường tại một điểm. Đơn vị: tesla (T).</div>
                <h2>Cốt lõi</h2>
                <p>Lực từ tác dụng lên đoạn dây dài $l$ mang dòng $I$ đặt trong từ trường $B$:</p>
                <p>$F = B\\,I\\,l\\,\\sin\\theta$, với $\\theta$ là góc giữa dây dẫn và $\\vec{B}$.</p>
                <p>Khi dây vuông góc với $\\vec{B}$ ($\\theta=90^\\circ$): $F=BIl$ (lớn nhất).</p>
                <h2>Nâng cao</h2>
                <p>Lực Lorentz lên hạt điện tích $q$ chuyển động với vận tốc $v$: $f=|q|\\,v\\,B\\,\\sin\\alpha$.</p>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Dây dài $l=0{,}5$ m, $I=2$ A, đặt vuông góc trong $B=0{,}1$ T. Tính lực từ.</p>
                  <p><strong>Giải:</strong> $F=BIl=0{,}1\\cdot2\\cdot0{,}5=0{,}1$ N.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Dây $l=1$ m, $I=5$ A, $B=0{,}2$ T, hợp góc $30^\\circ$. Tính lực từ.</p>
                  <details><summary>Đáp án</summary><p>$F=BIl\\sin30^\\circ=0{,}2\\cdot5\\cdot1\\cdot0{,}5=0{,}5$ N.</p></details>
                </div>
              `,
            },
            {
              id: 'l-ly-camung', title: 'Cảm ứng điện từ', level: 'NANG_CAO',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> <em>Từ thông</em> $\\Phi$ qua diện tích $S$: $\\Phi=NBS\\cos\\alpha$ (đơn vị vêbe, Wb), $\\alpha$ là góc giữa $\\vec{B}$ và pháp tuyến mặt.</div>
                <h2>Cốt lõi</h2>
                <p><strong>Định luật Faraday:</strong> suất điện động cảm ứng $e=-\\dfrac{\\Delta\\Phi}{\\Delta t}$ (V). Độ lớn $|e|=\\left|\\dfrac{\\Delta\\Phi}{\\Delta t}\\right|$.</p>
                <p><strong>Định luật Len-xơ:</strong> dòng cảm ứng có chiều chống lại sự biến thiên từ thông sinh ra nó (dấu trừ).</p>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Từ thông qua khung biến thiên từ $0{,}02$ Wb về $0$ trong $0{,}1$ s. Tính suất điện động.</p>
                  <p><strong>Giải:</strong> $|e|=\\dfrac{0{,}02}{0{,}1}=0{,}2$ V.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Khung $N=10$ vòng, $B=0{,}2$ T, $S=0{,}01$ m², $\\alpha=0$. Tính từ thông.</p>
                  <details><summary>Đáp án</summary><p>$\\Phi=NBS=10\\cdot0{,}2\\cdot0{,}01=0{,}02$ Wb.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-ly-c4', title: 'Chương 4 · Vật lí hạt nhân',
          lessons: [
            {
              id: 'l-ly-cautao', title: 'Cấu tạo hạt nhân & Năng lượng liên kết', level: 'NANG_CAO',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> Hạt nhân $^{A}_{Z}X$ gồm $Z$ proton và $N=A-Z$ neutron ($A$ là số khối). <em>Độ hụt khối</em> $\\Delta m$ là phần khối lượng "mất đi" khi các nuclôn liên kết.</div>
                <h2>Cốt lõi</h2>
                <p>$\\Delta m = Z\\,m_p+(A-Z)\\,m_n-m_{hn}$.</p>
                <p><strong>Năng lượng liên kết:</strong> $W_{lk}=\\Delta m\\,c^2$. Năng lượng liên kết riêng $\\dfrac{W_{lk}}{A}$ càng lớn thì hạt nhân càng bền vững.</p>
                <h2>Nâng cao</h2>
                <p>Hệ thức Einstein $E=mc^2$; $1$ u $\\approx 931{,}5$ MeV/$c^2$.</p>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Một hạt nhân có độ hụt khối $\\Delta m=0{,}03$ u. Tính năng lượng liên kết (theo MeV).</p>
                  <p><strong>Giải:</strong> $W_{lk}=0{,}03\\cdot931{,}5\\approx 27{,}9$ MeV.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Hạt nhân $^{4}_{2}He$ có bao nhiêu proton, neutron?</p>
                  <details><summary>Đáp án</summary><p>$Z=2$ proton; $N=A-Z=4-2=2$ neutron.</p></details>
                </div>
              `,
            },
            {
              id: 'l-ly-phongxa', title: 'Phóng xạ & Định luật phóng xạ', level: 'NANG_CAO',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> <em>Phóng xạ</em> là quá trình hạt nhân không bền tự phân rã, phát ra tia ($\\alpha,\\beta,\\gamma$). <em>Chu kì bán rã</em> $T$ là thời gian để một nửa số hạt nhân phân rã.</div>
                <h2>Cốt lõi</h2>
                <p>Định luật phóng xạ: $N=N_0\\,2^{-t/T}=N_0\\,e^{-\\lambda t}$, với hằng số phóng xạ $\\lambda=\\dfrac{\\ln 2}{T}$.</p>
                <p>Khối lượng còn lại: $m=m_0\\,2^{-t/T}$.</p>
                <svg class="graph" viewBox="0 0 200 150" width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                  <line x1="25" y1="120" x2="195" y2="120" stroke="#94a3b8"/>
                  <line x1="30" y1="12" x2="30" y2="125" stroke="#94a3b8"/>
                  <polyline points="30,20 70,70 110,95 150,107 190,113" fill="none" stroke="#4f46e5" stroke-width="2"/>
                  <text x="184" y="118">t</text>
                  <text x="34" y="20">N</text>
                  <text x="60" y="135">T</text>
                  <text x="100" y="135">2T</text>
                  <text x="140" y="135">3T</text>
                </svg>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Sau 2 chu kì bán rã, số hạt nhân còn lại bằng bao nhiêu phần ban đầu?</p>
                  <p><strong>Giải:</strong> $N=N_0\\,2^{-2}=\\dfrac{N_0}{4}$ ⇒ còn $25\\%$.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Sau $3T$, còn lại bao nhiêu phần trăm khối lượng ban đầu?</p>
                  <details><summary>Đáp án</summary><p>$m=m_0\\,2^{-3}=\\dfrac{m_0}{8}=12{,}5\\%$.</p></details>
                </div>
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
