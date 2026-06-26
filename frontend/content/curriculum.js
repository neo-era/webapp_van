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
      code: 'TOAN', name: 'Toán', name_en: 'Mathematics', grade: 12,
      topics: [
        {
          id: 't-toan-c1', title: 'Chương 1 · Ứng dụng đạo hàm để khảo sát và vẽ đồ thị',
          lessons: [
            {
              id: 'l-toan-dondieu', title: 'Tính đơn điệu của hàm số', title_en: 'Monotonicity of functions', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị hàm số ▸</button></div>
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
              html_en: `
                <div class="lesson-sim-cta">🔬 <strong>Tool:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Plot a function ▸</button></div>
                <h2>Core idea</h2>
                <p>Let $y=f(x)$ be differentiable on an interval $K$:</p>
                <ul>
                  <li>If $f'(x) > 0$ for all $x \\in K$, then the function is <strong>increasing</strong> on $K$.</li>
                  <li>If $f'(x) < 0$ for all $x \\in K$, then the function is <strong>decreasing</strong> on $K$.</li>
                </ul>
                <div class="luuy">
                  <strong>Note (made precise):</strong> A more general sufficient condition: if $f'(x)\\ge 0\\ \\forall x\\in K$ and $f'(x)=0$ only at <em>finitely many points</em>, the function is still increasing on $K$.
                  <em>Example:</em> $y=x^3$ has $y'=3x^2\\ge 0$ (zero only at $x=0$), so it is increasing on $\\mathbb{R}$.
                </div>
                <h3>Steps to study monotonicity</h3>
                <ol>
                  <li>Find the domain.</li>
                  <li>Compute $f'(x)$; solve $f'(x)=0$ and find where $f'(x)$ is undefined.</li>
                  <li>Build the variation table and conclude.</li>
                </ol>
                <h2>Advanced</h2>
                <p>Parameter problems: finding $m$ so the function is increasing on $\\mathbb{R}$ usually reduces to
                $f'(x) \\ge 0\\ \\forall x$ — analyze the sign of a quadratic ($a>0$ and $\\Delta \\le 0$).</p>
                <p>Parameter example: $y=x^3-3mx+1$ has $y'=3x^2-3m \\ge 0\\ \\forall x \\Leftrightarrow m \\le 0$.</p>

                <div class="vd">
                  <div class="vd-title">📝 Worked example</div>
                  <p>Study the monotonicity of $y=x^3-3x$.</p>
                  <p><strong>Solution:</strong> Domain: $\\mathbb{R}$. $y'=3x^2-3=3(x-1)(x+1)$; $y'=0 \\Leftrightarrow x=\\pm 1$.</p>
                  <table class="bbt">
                    <tr><td class="lbl">$x$</td><td>$-\\infty$</td><td>$-1$</td><td>$1$</td><td>$+\\infty$</td></tr>
                    <tr><td class="lbl">$y'$</td><td>$+$</td><td>$0\\ -\\ 0$</td><td></td><td>$+$</td></tr>
                    <tr><td class="lbl">$y$</td><td>↗</td><td>$2$ (max) ↘ $-2$ (min)</td><td></td><td>↗</td></tr>
                  </table>
                  <p>So the function is increasing on $(-\\infty;-1)$ and $(1;+\\infty)$; decreasing on $(-1;1)$.</p>
                </div>

                <div class="bt">
                  <div class="bt-title">✏️ Exercise</div>
                  <p>Find the monotonic intervals of $y=-x^3+3x^2-1$.</p>
                  <details><summary>Show answer</summary>
                    <p>$y'=-3x^2+6x=-3x(x-2)$; $y'=0 \\Leftrightarrow x=0$ or $x=2$. The function is <strong>increasing</strong> on $(0;2)$, <strong>decreasing</strong> on $(-\\infty;0)$ and $(2;+\\infty)$.</p>
                  </details>
                </div>

                <div class="vd">
                  <div class="vd-title">📝 Example 2 (rational function)</div>
                  <p>Study the monotonicity of $y=\\dfrac{x-2}{x+1}$.</p>
                  <p><strong>Solution:</strong> Domain $\\mathbb{R}\\setminus\\{-1\\}$. $y'=\\dfrac{(x+1)-(x-2)}{(x+1)^2}=\\dfrac{3}{(x+1)^2}>0$.</p>
                  <p>So the function is <strong>increasing</strong> on each interval $(-\\infty;-1)$ and $(-1;+\\infty)$ (it is not increasing on the union, since it is discontinuous at $x=-1$).</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Example 3 (parameter problem)</div>
                  <p>Find $m$ so that $y=x^3+3x^2+mx-1$ is increasing on $\\mathbb{R}$.</p>
                  <p><strong>Solution:</strong> $y'=3x^2+6x+m\\ge 0\\ \\forall x \\Leftrightarrow \\Delta'=9-3m\\le 0 \\Leftrightarrow m\\ge 3$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Practice exercises</div>
                  <p><strong>Problem 1.</strong> Study the monotonicity of $y=x^4-2x^2$.</p>
                  <details><summary>Answer</summary><p>$y'=4x^3-4x=4x(x-1)(x+1)$. Increasing on $(-1;0)$ and $(1;+\\infty)$; decreasing on $(-\\infty;-1)$ and $(0;1)$.</p></details>
                  <p style="margin-top:8px"><strong>Problem 2.</strong> Find $m$ so that $y=\\dfrac{mx+1}{x+2}$ is increasing on each interval of its domain.</p>
                  <details><summary>Answer</summary><p>$y'=\\dfrac{2m-1}{(x+2)^2}>0 \\Leftrightarrow 2m-1>0 \\Leftrightarrow m>\\dfrac{1}{2}$.</p></details>
                </div>
              `,
            },
            {
              id: 'l-toan-cuctri', title: 'Cực trị của hàm số', title_en: 'Extrema of functions', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị hàm số ▸</button></div>
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
              html_en: `
                <div class="lesson-sim-cta">🔬 <strong>Tool:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Plot a function ▸</button></div>
                <h2>Core idea</h2>
                <p>$x_0$ is an extremum point if $f'(x)$ <strong>changes sign</strong> as it passes through $x_0$:</p>
                <ul>
                  <li>$f'$ changes from $+$ to $-$: $x_0$ is a <strong>local maximum</strong>.</li>
                  <li>$f'$ changes from $-$ to $+$: $x_0$ is a <strong>local minimum</strong>.</li>
                </ul>
                <div class="luuy">
                  <strong>Note (common trap):</strong> $f'(x_0)=0$ is <em>necessary</em> but <em>not sufficient</em>. You must check that $f'$ <strong>changes sign</strong> across $x_0$.
                  <em>Counterexample:</em> $y=x^3$ has $y'(0)=0$ but $x=0$ is <strong>not</strong> an extremum (since $y'\\ge 0$ does not change sign).
                </div>
                <h2>Advanced</h2>
                <p>Second-derivative test: if $f'(x_0)=0$ and $f''(x_0)<0$ then $x_0$ is a local maximum; if $f''(x_0)>0$ then a local minimum. (If $f''(x_0)=0$, study the sign of $f'$.)</p>

                <div class="vd">
                  <div class="vd-title">📝 Worked example</div>
                  <p>Find the extrema of $y=x^3-3x^2+2$.</p>
                  <p><strong>Solution:</strong> $y'=3x^2-6x=3x(x-2)$; $y'=0 \\Leftrightarrow x=0$ or $x=2$.</p>
                  <ul>
                    <li>$x=0$: $y'$ changes $+ \\to -$ ⇒ <strong>local max</strong>, $y_{max}=2$.</li>
                    <li>$x=2$: $y'$ changes $- \\to +$ ⇒ <strong>local min</strong>, $y_{min}=-2$.</li>
                  </ul>
                </div>

                <div class="bt">
                  <div class="bt-title">✏️ Exercise</div>
                  <p>Find $m$ so that $y=x^3-3mx+1$ has two extrema.</p>
                  <details><summary>Show answer</summary>
                    <p>$y'=3x^2-3m$. Two extrema $\\Leftrightarrow y'=0$ has two distinct roots $\\Leftrightarrow m>0$.</p>
                  </details>
                </div>

                <div class="vd">
                  <div class="vd-title">📝 Example 2 (biquadratic)</div>
                  <p>Find the extrema of $y=x^4-2x^2$.</p>
                  <p><strong>Solution:</strong> $y'=4x^3-4x=4x(x-1)(x+1)$; $y'=0\\Leftrightarrow x=0,\\pm1$.</p>
                  <ul>
                    <li>$x=\\pm1$: local minima, $y_{min}=-1$.</li>
                    <li>$x=0$: local maximum, $y_{max}=0$.</li>
                  </ul>
                  <p>The graph is W-shaped — it has <strong>3 extrema</strong>.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📝 Example 3 (second-derivative test)</div>
                  <p>Consider $y=x^3-3x$: $y'=3x^2-3=0\\Leftrightarrow x=\\pm1$; $y''=6x$.</p>
                  <p>$y''(-1)=-6<0$ ⇒ $x=-1$ local max; $y''(1)=6>0$ ⇒ $x=1$ local min.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Practice exercises</div>
                  <p><strong>Problem 1.</strong> How many extrema does $y=x^4+2x^2$ have?</p>
                  <details><summary>Answer</summary><p>$y'=4x^3+4x=4x(x^2+1)=0\\Leftrightarrow x=0$. Only <strong>1 extremum</strong> (a local minimum at $x=0$).</p></details>
                  <p style="margin-top:8px"><strong>Problem 2.</strong> Find $m$ so that $y=x^4-2mx^2+1$ has 3 extrema.</p>
                  <details><summary>Answer</summary><p>$y'=4x^3-4mx=4x(x^2-m)$. Three extrema $\\Leftrightarrow x^2=m$ has two nonzero roots $\\Leftrightarrow m>0$.</p></details>
                </div>
              `,
            },
            {
              id: 'l-toan-gtln-gtnn', title: 'GTLN – GTNN của hàm số', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị hàm số ▸</button></div>
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
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị hàm số ▸</button></div>
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
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị hàm số ▸</button></div>
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
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị hàm số ▸</button></div>
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
        {
          id: 't-toan-hsg', title: '🏆 Chuyên đề · Bồi dưỡng HSG & Luyện thi THPT QG',
          lessons: [
            {
              id: 'l-toan-hsg-thamso', title: 'Hàm số chứa tham số: cực trị, tương giao, GTLN–GTNN', level: 'CHUYEN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị (có tham số a) ▸</button></div>
                <h2>Cốt lõi — kĩ thuật thi</h2>
                <ul>
                  <li><strong>Điều kiện có cực trị:</strong> hàm bậc ba $y=ax^3+bx^2+cx+d$ có 2 cực trị $\\Leftrightarrow y'=0$ có hai nghiệm phân biệt $\\Leftrightarrow \\Delta_{y'}>0$.</li>
                  <li><strong>Tương giao – số nghiệm:</strong> số nghiệm của $f(x)=m$ bằng số giao điểm của $y=f(x)$ và đường thẳng $y=m$. Với hàm bậc ba: 3 nghiệm phân biệt $\\Leftrightarrow y_{CĐ}\\cdot y_{CT}<0$.</li>
                  <li><strong>GTLN–GTNN trên đoạn $[a;b]$:</strong> so sánh $f$ tại các nghiệm của $f'=0$ thuộc $[a;b]$ và tại hai đầu mút.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Tìm $m$ để $y=x^3-3x^2+m$ cắt trục hoành tại 3 điểm phân biệt.</p>
                  <p><strong>Giải:</strong> $y_{CĐ}=y(0)=m$, $y_{CT}=y(2)=m-4$. Điều kiện: $m(m-4)<0 \\Leftrightarrow 0<m<4$.</p>
                  <p>2) GTLN–GTNN của $f(x)=x^3-3x+2$ trên $[0;2]$.</p>
                  <p><strong>Giải:</strong> $f'=3x^2-3=0\\Rightarrow x=1\\in[0;2]$. $f(0)=2, f(1)=0, f(2)=4$ ⇒ $\\max=4$ tại $x=2$, $\\min=0$ tại $x=1$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm $m$ để $y=x^3-3mx+1$ có hai điểm cực trị.</p>
                  <details><summary>Đáp án</summary><p>$y'=3x^2-3m=0$ có 2 nghiệm phân biệt $\\Leftrightarrow m>0$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm $m$ để phương trình $x^3-3x=m$ có 3 nghiệm phân biệt.</p>
                  <details><summary>Đáp án</summary><p>$g=x^3-3x$ có $g_{CĐ}=g(-1)=2$, $g_{CT}=g(1)=-2$ ⇒ $-2<m<2$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> GTNN của $f(x)=x^3-3x^2+1$ trên $[-1;1]$.</p>
                  <details><summary>Đáp án</summary><p>$f'=3x^2-6x=0\\Rightarrow x=0\\in[-1;1]$. $f(-1)=-3, f(0)=1, f(1)=-1$ ⇒ $\\min=-3$ tại $x=-1$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 3 — GTLN/GTNN trên đoạn):</strong>
                  <ol>
                    <li>Tính đạo hàm: $f'(x)=3x^2-6x$.</li>
                    <li>Giải $f'(x)=0 \\Leftrightarrow 3x(x-2)=0 \\Rightarrow x=0$ hoặc $x=2$; chỉ $x=0\\in[-1;1]$.</li>
                    <li>Tính giá trị tại các điểm "nghi ngờ" và hai đầu mút: $f(-1)=-3,\\ f(0)=1,\\ f(1)=-1$.</li>
                    <li>So sánh: $\\min_{[-1;1]} f = -3$ (tại $x=-1$), $\\max_{[-1;1]} f = 1$ (tại $x=0$).</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-toan-hsg-tichphan', title: 'Nguyên hàm – Tích phân nâng cao & ứng dụng', level: 'CHUYEN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị hàm số ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Đổi biến số</strong> và <strong>tích phân từng phần:</strong> $\\displaystyle\\int u\\,dv = uv - \\int v\\,du$.</li>
                  <li><strong>Diện tích hình phẳng:</strong> $S=\\displaystyle\\int_a^b |f(x)-g(x)|\\,dx$.</li>
                  <li><strong>Thể tích khối tròn xoay</strong> (quanh $Ox$): $V=\\pi\\displaystyle\\int_a^b f(x)^2\\,dx$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Tính $\\displaystyle\\int_0^1 x e^x\\,dx$.</p>
                  <p><strong>Giải:</strong> Từng phần: $=\\big[x e^x - e^x\\big]_0^1 = (e-e)-(0-1)=1$.</p>
                  <p>2) Diện tích hình phẳng giới hạn bởi $y=x^2$ và $y=x$.</p>
                  <p><strong>Giải:</strong> $S=\\displaystyle\\int_0^1 (x-x^2)\\,dx = \\Big[\\tfrac{x^2}{2}-\\tfrac{x^3}{3}\\Big]_0^1 = \\tfrac12-\\tfrac13=\\tfrac16$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tính $\\displaystyle\\int_0^1 (2x+1)\\,dx$.</p>
                  <details><summary>Đáp án</summary><p>$\\big[x^2+x\\big]_0^1 = 2$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm nguyên hàm $\\displaystyle\\int x\\cos x\\,dx$.</p>
                  <details><summary>Đáp án</summary><p>$x\\sin x + \\cos x + C$ (từng phần).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Thể tích khối tròn xoay khi quay $y=\\sqrt{x}$ quanh $Ox$ trên $[0;4]$.</p>
                  <details><summary>Đáp án</summary><p>$V=\\pi\\displaystyle\\int_0^4 x\\,dx = \\pi\\big[\\tfrac{x^2}{2}\\big]_0^4 = 8\\pi$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 3 — thể tích tròn xoay):</strong>
                  <ol>
                    <li>Công thức thể tích khi quay quanh $Ox$: $V=\\pi\\displaystyle\\int_a^b [f(x)]^2\\,dx$.</li>
                    <li>Với $f(x)=\\sqrt{x}$ ⇒ $[f(x)]^2 = x$.</li>
                    <li>Thay cận $a=0,\\ b=4$: $V=\\pi\\displaystyle\\int_0^4 x\\,dx$.</li>
                    <li>Tính tích phân: $V=\\pi\\Big[\\dfrac{x^2}{2}\\Big]_0^4 = \\pi\\Big(\\dfrac{16}{2}-0\\Big)=8\\pi$.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-toan-hsg-oxyz', title: 'Hình giải tích Oxyz: mặt phẳng, đường thẳng, mặt cầu', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Mặt phẳng:</strong> $ax+by+cz+d=0$ có vectơ pháp tuyến $\\vec{n}=(a;b;c)$.</li>
                  <li><strong>Khoảng cách</strong> từ $M(x_0;y_0;z_0)$ đến mặt phẳng: $d=\\dfrac{|ax_0+by_0+cz_0+d|}{\\sqrt{a^2+b^2+c^2}}$.</li>
                  <li><strong>Mặt cầu</strong> tâm $I(a;b;c)$ bán kính $R$: $(x-a)^2+(y-b)^2+(z-c)^2=R^2$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Khoảng cách từ $M(1;2;3)$ đến $(P): 2x-y+2z-1=0$.</p>
                  <p><strong>Giải:</strong> $d=\\dfrac{|2-2+6-1|}{\\sqrt{4+1+4}}=\\dfrac{5}{3}$.</p>
                  <p>2) Tìm tâm và bán kính mặt cầu $x^2+y^2+z^2-2x-4z+1=0$.</p>
                  <p><strong>Giải:</strong> $(x-1)^2+y^2+(z-2)^2 = 1+4-1=4 \\Rightarrow I(1;0;2), R=2$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Viết vectơ pháp tuyến của mặt phẳng $3x-2y+z-5=0$.</p>
                  <details><summary>Đáp án</summary><p>$\\vec{n}=(3;-2;1)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Khoảng cách từ gốc $O$ đến mặt phẳng $x+2y+2z-9=0$.</p>
                  <details><summary>Đáp án</summary><p>$d=\\dfrac{|-9|}{\\sqrt{1+4+4}}=\\dfrac{9}{3}=3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Bán kính mặt cầu $x^2+y^2+z^2-6x+8=0$.</p>
                  <details><summary>Đáp án</summary><p>$(x-3)^2+y^2+z^2=9-8=1 \\Rightarrow R=1$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 3 — tìm bán kính mặt cầu):</strong>
                  <ol>
                    <li>Nhóm các số hạng theo từng biến và hoàn chỉnh bình phương: $x^2-6x=(x-3)^2-9$.</li>
                    <li>Thay vào phương trình: $(x-3)^2-9+y^2+z^2+8=0$.</li>
                    <li>Chuyển vế: $(x-3)^2+y^2+z^2 = 1$.</li>
                    <li>So với dạng chuẩn $(x-a)^2+(y-b)^2+(z-c)^2=R^2$ ⇒ tâm $I(3;0;0)$, bán kính $R=\\sqrt{1}=1$.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-toan-hsg-xacsuat', title: 'Tổ hợp & Xác suất có điều kiện (Bayes)', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Tổ hợp:</strong> $C_n^k=\\dfrac{n!}{k!(n-k)!}$ — số cách chọn $k$ phần tử (không xét thứ tự).</li>
                  <li><strong>Xác suất có điều kiện:</strong> $P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$.</li>
                  <li><strong>Công thức Bayes:</strong> $P(A\\mid B)=\\dfrac{P(B\\mid A)\\,P(A)}{P(B)}$, với $P(B)$ tính theo công thức xác suất toàn phần.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Gieo hai con xúc xắc. Biết tổng số chấm bằng $8$, tính xác suất có ít nhất một mặt $5$.</p>
                  <p><strong>Giải:</strong> Tổng $8$: $\\{(2,6),(3,5),(4,4),(5,3),(6,2)\\}$ — 5 cách; có mặt 5: $\\{(3,5),(5,3)\\}$ — 2 cách ⇒ $P=\\dfrac{2}{5}$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tính $C_5^2$ — số cách chọn 2 trong 5 học sinh.</p>
                  <details><summary>Đáp án</summary><p>$C_5^2=\\dfrac{5!}{2!\\,3!}=10$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Hộp có 3 bi đỏ, 2 bi xanh. Lấy ngẫu nhiên 2 bi. Xác suất được 2 bi đỏ.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{C_3^2}{C_5^2}=\\dfrac{3}{10}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Hộp I (2 đỏ, 1 xanh), hộp II (1 đỏ, 2 xanh). Chọn ngẫu nhiên một hộp rồi lấy 1 bi. Xác suất lấy được bi đỏ.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac12\\cdot\\dfrac23+\\dfrac12\\cdot\\dfrac13=\\dfrac12$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 3 — công thức xác suất toàn phần):</strong>
                  <ol>
                    <li>Việc chọn hộp là ngẫu nhiên ⇒ $P(\\text{hộp I})=P(\\text{hộp II})=\\dfrac12$.</li>
                    <li>Xác suất lấy bi đỏ trong từng hộp: $P(\\text{đỏ}\\mid I)=\\dfrac23$, $P(\\text{đỏ}\\mid II)=\\dfrac13$.</li>
                    <li>Áp dụng công thức xác suất toàn phần: $P(\\text{đỏ})=P(I)P(\\text{đỏ}\\mid I)+P(II)P(\\text{đỏ}\\mid II)$.</li>
                    <li>$=\\dfrac12\\cdot\\dfrac23+\\dfrac12\\cdot\\dfrac13=\\dfrac13+\\dfrac16=\\dfrac12$.</li>
                  </ol>
                </div>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'LY', name: 'Vật lí', name_en: 'Physics', grade: 12,
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
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('boyle')">Định luật Boyle (nén khí) ▸</button></div>
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
        {
          id: 't-ly-hsg', title: '🏆 Chuyên đề · Bồi dưỡng HSG & Luyện thi THPT QG',
          lessons: [
            {
              id: 'l-ly-hsg-nhiet', title: 'Nhiệt động lực học & khí lí tưởng nâng cao', level: 'CHUYEN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('boyle')">Định luật Boyle (nén khí) ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Phương trình trạng thái khí lí tưởng:</strong> $\\dfrac{pV}{T}=\\text{const}$ (hay $pV=nRT$).</li>
                  <li><strong>Các đẳng quá trình:</strong> đẳng nhiệt $pV=\\text{const}$; đẳng tích $\\dfrac{p}{T}=\\text{const}$; đẳng áp $\\dfrac{V}{T}=\\text{const}$.</li>
                  <li><strong>Nguyên lí I nhiệt động lực học:</strong> $\\Delta U = A + Q$ (độ biến thiên nội năng = công nhận + nhiệt nhận).</li>
                  <li><strong>Nhiệt lượng:</strong> $Q=mc\\Delta t$; nhiệt nóng chảy $Q=\\lambda m$; nhiệt hóa hơi $Q=Lm$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Nén đẳng nhiệt khí từ $p_1=2$ atm, $V_1=3$ L về $V_2=1$ L. Tính $p_2$.</p>
                  <p><strong>Giải:</strong> $p_1V_1=p_2V_2 \\Rightarrow p_2=\\dfrac{2\\cdot3}{1}=6$ atm.</p>
                  <p>2) Nung nóng đẳng tích từ $T_1=300$ K, $p_1=1$ atm đến $T_2=600$ K. Tính $p_2$.</p>
                  <p><strong>Giải:</strong> $\\dfrac{p_1}{T_1}=\\dfrac{p_2}{T_2}\\Rightarrow p_2=1\\cdot\\dfrac{600}{300}=2$ atm.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Đẳng áp: $V_1=2$ L ở $T_1=300$ K. Tính $V_2$ ở $T_2=450$ K.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{V_1}{T_1}=\\dfrac{V_2}{T_2}\\Rightarrow V_2=2\\cdot\\dfrac{450}{300}=3$ L.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Nhiệt lượng để làm nóng chảy hoàn toàn $0{,}5$ kg nước đá ở $0^\\circ C$ ($\\lambda=3{,}4\\cdot10^5$ J/kg).</p>
                  <details><summary>Đáp án</summary><p>$Q=\\lambda m=3{,}4\\cdot10^5\\cdot0{,}5=1{,}7\\cdot10^5$ J.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Khí nhận nhiệt $Q=100$ J và sinh công $A'=40$ J. Độ biến thiên nội năng?</p>
                  <details><summary>Đáp án</summary><p>$\\Delta U=Q-A'=100-40=60$ J.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 1 — quá trình đẳng áp):</strong>
                  <ol>
                    <li>Quá trình đẳng áp (áp suất không đổi) ⇒ áp dụng định luật Charles: $\\dfrac{V}{T}=$ const.</li>
                    <li>Viết cho hai trạng thái: $\\dfrac{V_1}{T_1}=\\dfrac{V_2}{T_2}$.</li>
                    <li>Thay số: $\\dfrac{2}{300}=\\dfrac{V_2}{450}$.</li>
                    <li>Suy ra $V_2=\\dfrac{2\\cdot450}{300}=3$ L (lưu ý nhiệt độ luôn tính theo Kelvin).</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-ly-hsg-tutruong', title: 'Từ trường, lực từ & lực Lorentz', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Lực từ</strong> tác dụng lên dây dẫn: $F=BIl\\sin\\theta$ ($\\theta$ là góc giữa dây và $\\vec{B}$).</li>
                  <li><strong>Lực Lorentz</strong> lên hạt điện chuyển động: $f=|q|vB\\sin\\theta$.</li>
                  <li><strong>Cảm ứng từ của dòng điện thẳng dài:</strong> $B=2\\cdot10^{-7}\\dfrac{I}{r}$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Dây dài $l=0{,}1$ m mang $I=2$ A đặt vuông góc trong $B=0{,}5$ T. Lực từ?</p>
                  <p><strong>Giải:</strong> $F=BIl=0{,}5\\cdot2\\cdot0{,}1=0{,}1$ N.</p>
                  <p>2) Electron ($q=1{,}6\\cdot10^{-19}$ C) bay với $v=10^6$ m/s vuông góc $B=0{,}2$ T. Lực Lorentz?</p>
                  <p><strong>Giải:</strong> $f=qvB=1{,}6\\cdot10^{-19}\\cdot10^6\\cdot0{,}2=3{,}2\\cdot10^{-14}$ N.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Cảm ứng từ tại điểm cách dòng điện thẳng $I=5$ A một khoảng $r=0{,}1$ m.</p>
                  <details><summary>Đáp án</summary><p>$B=2\\cdot10^{-7}\\cdot\\dfrac{5}{0{,}1}=10^{-5}$ T.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Lực từ lên dây $l=0{,}5$ m, $I=3$ A đặt vuông góc trong $B=0{,}4$ T.</p>
                  <details><summary>Đáp án</summary><p>$F=0{,}4\\cdot3\\cdot0{,}5=0{,}6$ N.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Khi hạt chuyển động song song với $\\vec{B}$ ($\\theta=0$), lực Lorentz bằng bao nhiêu?</p>
                  <details><summary>Đáp án</summary><p>$f=qvB\\sin0=0$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 1 — cảm ứng từ của dòng điện thẳng):</strong>
                  <ol>
                    <li>Công thức cảm ứng từ của dòng điện thẳng dài: $B=2\\cdot10^{-7}\\cdot\\dfrac{I}{r}$.</li>
                    <li>Thay $I=5$ A, $r=0{,}1$ m: $B=2\\cdot10^{-7}\\cdot\\dfrac{5}{0{,}1}$.</li>
                    <li>Tính: $\\dfrac{5}{0{,}1}=50$ ⇒ $B=2\\cdot10^{-7}\\cdot50=10^{-5}$ T.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-ly-hsg-hatnhan', title: 'Vật lí hạt nhân: năng lượng liên kết & phản ứng', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Độ hụt khối & năng lượng liên kết:</strong> $\\Delta m = Zm_p+(A-Z)m_n - m_{hn}$; $E_{lk}=\\Delta m\\,c^2$. Quy đổi $1\\,u\\approx931{,}5$ MeV/$c^2$.</li>
                  <li><strong>Định luật phóng xạ:</strong> $N=N_0\\,2^{-t/T}$ (T là chu kì bán rã).</li>
                  <li><strong>Bảo toàn trong phản ứng hạt nhân:</strong> bảo toàn số khối $A$ và điện tích $Z$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Một hạt nhân có độ hụt khối $\\Delta m=0{,}1\\,u$. Tính năng lượng liên kết (MeV).</p>
                  <p><strong>Giải:</strong> $E_{lk}=0{,}1\\cdot931{,}5\\approx93{,}15$ MeV.</p>
                  <p>2) Sau thời gian $2T$, số hạt nhân phóng xạ còn lại chiếm bao nhiêu phần trăm?</p>
                  <p><strong>Giải:</strong> $N=N_0\\,2^{-2}=\\dfrac{N_0}{4}=25\\%$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Chu kì bán rã $T=8$ ngày. Sau $16$ ngày còn lại bao nhiêu phần trăm?</p>
                  <details><summary>Đáp án</summary><p>$16=2T \\Rightarrow N=N_0\\,2^{-2}=25\\%$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Trong phản ứng $^{14}_{7}N + ^{4}_{2}He \\to ^{17}_{8}O + X$, hạt $X$ là gì?</p>
                  <details><summary>Đáp án</summary><p>Bảo toàn: $A=14+4-17=1$, $Z=7+2-8=1$ ⇒ $X=^{1}_{1}H$ (proton).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Độ hụt khối $\\Delta m=0{,}2\\,u$. Năng lượng liên kết xấp xỉ?</p>
                  <details><summary>Đáp án</summary><p>$E=0{,}2\\cdot931{,}5\\approx186{,}3$ MeV.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 2 — bảo toàn trong phản ứng hạt nhân):</strong>
                  <ol>
                    <li>Trong mọi phản ứng hạt nhân, bảo toàn tổng số khối $A$ và tổng điện tích $Z$ ở hai vế.</li>
                    <li>Bảo toàn số khối: $A_X=(14+4)-17=1$.</li>
                    <li>Bảo toàn điện tích: $Z_X=(7+2)-8=1$.</li>
                    <li>Hạt có $A=1, Z=1$ chính là proton: $X={}^{1}_{1}H$.</li>
                  </ol>
                </div>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'HOA', name: 'Hóa học', name_en: 'Chemistry', grade: 12,
      topics: [
        {
          id: 't-hoa-c1', title: 'Chương 1 · Ester – Lipid',
          lessons: [
            {
              id: 'l-hoa-este', title: 'Ester: khái niệm, danh pháp, tính chất', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('molecule')">Xem mô hình phân tử ▸</button></div>
                <div class="luuy"><strong>Khái niệm:</strong> <em>Ester</em> là sản phẩm thay nhóm $-OH$ trong nhóm $-COOH$ của acid carboxylic bằng nhóm $-OR'$. Ester no, đơn chức, mạch hở có công thức $C_nH_{2n}O_2\\ (n\\ge2)$.</div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Danh pháp:</strong> tên gốc $R'$ + tên gốc acid (đuôi "-at"). VD: $CH_3COOC_2H_5$ là <em>ethyl acetate</em>.</li>
                  <li><strong>Điều chế (ester hóa):</strong> $RCOOH + R'OH \\xrightarrow{H_2SO_4,\\,t^\\circ} RCOOR' + H_2O$ (thuận nghịch).</li>
                  <li><strong>Thủy phân trong kiềm (xà phòng hóa):</strong> $RCOOR' + NaOH \\xrightarrow{t^\\circ} RCOONa + R'OH$ (một chiều).</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Ester thường có mùi thơm (hoa quả), nhẹ hơn nước, ít tan trong nước.</p>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Thủy phân $CH_3COOC_2H_5$ trong dung dịch $NaOH$.</p>
                  <p><strong>Giải:</strong> $CH_3COOC_2H_5 + NaOH \\to CH_3COONa + C_2H_5OH$.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Viết công thức phân tử của ester no, đơn chức, mạch hở có 3 nguyên tử C.</p>
                  <details><summary>Đáp án</summary><p>$C_3H_6O_2$ (ví dụ $HCOOC_2H_5$ hoặc $CH_3COOCH_3$).</p></details>
                </div>
              `,
            },
            {
              id: 'l-hoa-lipid', title: 'Lipid – Chất béo', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('reaction')">Mô phỏng phản ứng (xà phòng hóa) ▸</button></div>
                <div class="luuy"><strong>Khái niệm:</strong> <em>Chất béo</em> là trieste của glycerol với các acid béo (triglyceride).</div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li>Acid béo no: acid stearic $C_{17}H_{35}COOH$, palmitic $C_{15}H_{31}COOH$; không no: oleic $C_{17}H_{33}COOH$.</li>
                  <li><strong>Thủy phân trong kiềm</strong> tạo glycerol + muối của acid béo (xà phòng).</li>
                  <li>Chất béo no → rắn; chất béo không no → lỏng (dầu).</li>
                </ul>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Xà phòng hóa hoàn toàn chất béo tạo ra sản phẩm gì?</p>
                  <p><strong>Giải:</strong> Glycerol $C_3H_5(OH)_3$ và muối natri của acid béo (xà phòng).</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Phản ứng hydrogen hóa chất béo lỏng (không no) cho sản phẩm gì?</p>
                  <details><summary>Đáp án</summary><p>Chất béo rắn (no) — cơ sở sản xuất bơ nhân tạo, margarine.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-hoa-c2', title: 'Chương 2 · Carbohydrate',
          lessons: [
            {
              id: 'l-hoa-glucose', title: 'Carbohydrate & Glucose', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('molecule')">Xem mô hình phân tử ▸</button></div>
                <div class="luuy"><strong>Khái niệm:</strong> <em>Carbohydrate</em> (gluxit) là hợp chất hữu cơ tạp chức, công thức chung $C_n(H_2O)_m$. Phân loại: monosaccharide (glucose, fructose), disaccharide (saccharose), polysaccharide (tinh bột, cellulose).</div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li>Glucose & fructose: $C_6H_{12}O_6$. Saccharose: $C_{12}H_{22}O_{11}$. Tinh bột & cellulose: $(C_6H_{10}O_5)_n$.</li>
                  <li>Glucose có 1 nhóm $-CHO$ ⇒ phản ứng <strong>tráng bạc</strong> với $AgNO_3/NH_3$, tạo $Ag$.</li>
                  <li>Thủy phân tinh bột/cellulose/saccharose đều cho monosaccharide (glucose…).</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Glucose có 5 nhóm $-OH$ và 1 nhóm $-CHO$ (dạng mạch hở), thể hiện tính chất của poliol và aldehyde.</p>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Vì sao glucose tham gia phản ứng tráng bạc?</p>
                  <p><strong>Giải:</strong> Do có nhóm chức aldehyde $-CHO$ bị oxi hóa, khử $Ag^+$ thành $Ag$.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Viết công thức phân tử của glucose và saccharose.</p>
                  <details><summary>Đáp án</summary><p>Glucose $C_6H_{12}O_6$; saccharose $C_{12}H_{22}O_{11}$.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-hoa-c3', title: 'Chương 3 · Hợp chất chứa nitơ',
          lessons: [
            {
              id: 'l-hoa-amine', title: 'Amine', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('molecule')">Xem phân tử NH₃ ▸</button></div>
                <div class="luuy"><strong>Khái niệm:</strong> <em>Amine</em> sinh ra khi thay một hay nhiều nguyên tử H trong $NH_3$ bằng gốc hydrocarbon. Bậc của amine = số gốc gắn trực tiếp vào N (bậc 1, 2, 3).</div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Tính base:</strong> N còn cặp electron tự do nên amine có tính base. Methylamine $CH_3NH_2$ làm quỳ tím hóa xanh.</li>
                  <li>Aniline $C_6H_5NH_2$: base rất yếu (không đổi màu quỳ), phản ứng với nước brom tạo kết tủa trắng (2,4,6-tribromoaniline).</li>
                  <li>Phản ứng với acid: $CH_3NH_2 + HCl \\to CH_3NH_3Cl$.</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Amine no, đơn chức, mạch hở có công thức $C_nH_{2n+3}N$.</p>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>So sánh tính base: $CH_3NH_2$ và $C_6H_5NH_2$.</p>
                  <p><strong>Giải:</strong> $CH_3NH_2$ mạnh hơn (gốc đẩy e); aniline yếu hơn do gốc phenyl hút e.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Viết công thức phân tử amine no, đơn chức, mạch hở có 2 nguyên tử C.</p>
                  <details><summary>Đáp án</summary><p>$C_2H_7N$ (ví dụ $C_2H_5NH_2$ — ethylamine).</p></details>
                </div>
              `,
            },
            {
              id: 'l-hoa-aminoacid', title: 'Amino acid & Protein', level: 'NANG_CAO',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('molecule')">Xem mô hình phân tử ▸</button></div>
                <div class="luuy"><strong>Khái niệm:</strong> <em>Amino acid</em> là hợp chất tạp chức, phân tử chứa đồng thời nhóm amino $-NH_2$ và nhóm carboxyl $-COOH$. Đơn giản nhất: glycine $H_2N{-}CH_2{-}COOH$.</div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Tính lưỡng tính:</strong> phản ứng được cả với acid ($-NH_2$) và base ($-COOH$).</li>
                  <li><strong>Liên kết peptide</strong> $-CO{-}NH-$ hình thành khi các amino acid kết hợp; chuỗi nhiều amino acid tạo <strong>protein</strong>.</li>
                  <li><strong>Phản ứng màu biure:</strong> protein + $Cu(OH)_2$ → phức màu tím.</li>
                </ul>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Glycine phản ứng với $HCl$ và với $NaOH$ thể hiện tính chất gì?</p>
                  <p><strong>Giải:</strong> Với $HCl$: nhóm $-NH_2$ nhận $H^+$; với $NaOH$: nhóm $-COOH$ cho $H^+$ ⇒ tính <strong>lưỡng tính</strong>.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Dùng phản ứng nào để nhận biết protein?</p>
                  <details><summary>Đáp án</summary><p>Phản ứng màu biure với $Cu(OH)_2$ cho màu tím đặc trưng.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-hoa-c4', title: 'Chương 4 · Polymer & vật liệu',
          lessons: [
            {
              id: 'l-hoa-polymer', title: 'Polymer: trùng hợp & trùng ngưng', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('polymer')">Mô phỏng trùng hợp ▸</button></div>
                <div class="luuy"><strong>Khái niệm:</strong> <em>Polymer</em> là hợp chất có phân tử khối rất lớn, do nhiều đơn vị nhỏ (<em>mắt xích</em>, từ <em>monomer</em>) lặp lại liên kết với nhau.</div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Trùng hợp:</strong> monomer có liên kết bội. VD: $nCH_2{=}CH_2 \\xrightarrow{t^\\circ,p,xt} ({-}CH_2{-}CH_2{-})_n$ (polyethylene, PE).</li>
                  <li><strong>Trùng ngưng:</strong> monomer có $\\ge2$ nhóm chức, kèm loại ra phân tử nhỏ ($H_2O$). VD: tạo nylon-6,6, tơ lapsan.</li>
                  <li>Ứng dụng: chất dẻo (PE, PVC), tơ (nylon, capron), cao su.</li>
                </ul>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Viết sơ đồ trùng hợp tạo PVC.</p>
                  <p><strong>Giải:</strong> $nCH_2{=}CHCl \\to ({-}CH_2{-}CHCl{-})_n$ (poly(vinyl chloride)).</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Monomer dùng để điều chế polyethylene (PE) là gì?</p>
                  <details><summary>Đáp án</summary><p>Ethylene $CH_2{=}CH_2$.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-hoa-c5', title: 'Chương 5 · Đại cương kim loại',
          lessons: [
            {
              id: 'l-hoa-kimloai', title: 'Tính chất & dãy điện hóa kim loại', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('metalsalt')">Fe + CuSO₄ ▸</button> <button class="lesson-sim-btn" onclick="launchSim('electro')">Điện phân ▸</button></div>
                <div class="luuy"><strong>Khái niệm:</strong> Kim loại có tính chất hóa học đặc trưng là <em>tính khử</em>: nguyên tử kim loại nhường electron $M \\to M^{n+}+ne$.</div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li>Tác dụng với phi kim, dung dịch acid, dung dịch muối.</li>
                  <li><strong>Dãy hoạt động hóa học:</strong> K, Na, Ba, Ca, Mg, Al, Zn, Fe, Ni, Sn, Pb, (H), Cu, Ag, Au — tính khử giảm dần.</li>
                  <li>Kim loại đứng trước (mạnh hơn, trừ kim loại kiềm/kiềm thổ tan) đẩy kim loại sau ra khỏi dung dịch muối.</li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Ăn mòn kim loại: ăn mòn hóa học và ăn mòn điện hóa (phổ biến, có dòng điện).</p>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Nhúng đinh sắt vào dung dịch $CuSO_4$, hiện tượng?</p>
                  <p><strong>Giải:</strong> $Fe + CuSO_4 \\to FeSO_4 + Cu$ — Cu (đỏ) bám lên đinh, dung dịch nhạt màu xanh.</p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Trong các kim loại $Cu, Fe, Ag, Mg$, kim loại nào có tính khử mạnh nhất?</p>
                  <details><summary>Đáp án</summary><p>$Mg$ (đứng trước nhất trong dãy điện hóa).</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-hoa-hsg', title: '🏆 Chuyên đề · Bồi dưỡng HSG & Luyện thi THPT QG',
          lessons: [
            {
              id: 'l-hoa-hsg-ester', title: 'Ester – Lipid: bài toán thủy phân & xà phòng hóa', level: 'CHUYEN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('reaction')">Mô phỏng phản ứng ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Thủy phân ester trong môi trường kiềm (xà phòng hóa):</strong> $RCOOR' + NaOH \\to RCOONa + R'OH$ (tỉ lệ 1 : 1 với ester đơn chức).</li>
                  <li><strong>Phản ứng ester hóa:</strong> $RCOOH + R'OH \\rightleftharpoons RCOOR' + H_2O$ (thuận nghịch, xúc tác $H_2SO_4$ đặc).</li>
                  <li><strong>Chất béo (lipid)</strong> là trieste của glycerol với acid béo; xà phòng hóa tạo glycerol và muối (xà phòng).</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Xà phòng hóa hoàn toàn $8{,}8$ g etyl axetat $CH_3COOC_2H_5$ ($M=88$) bằng NaOH. Tính khối lượng muối $CH_3COONa$ ($M=82$).</p>
                  <p><strong>Giải:</strong> $n_{ester}=\\dfrac{8{,}8}{88}=0{,}1$ mol $\\Rightarrow n_{muối}=0{,}1 \\Rightarrow m=0{,}1\\cdot82=8{,}2$ g.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Xà phòng hóa hoàn toàn ester đơn chức cần $0{,}2$ mol NaOH. Số mol ester đã phản ứng?</p>
                  <details><summary>Đáp án</summary><p>$0{,}2$ mol (tỉ lệ 1 : 1).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Đốt cháy hoàn toàn ester no, đơn chức, mạch hở thì $n_{CO_2}$ và $n_{H_2O}$ quan hệ thế nào?</p>
                  <details><summary>Đáp án</summary><p>$n_{CO_2}=n_{H_2O}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Sản phẩm xà phòng hóa chất béo gồm những chất nào?</p>
                  <details><summary>Đáp án</summary><p>Glycerol và muối của acid béo (xà phòng).</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (ví dụ xà phòng hóa etyl axetat):</strong>
                  <ol>
                    <li>Tính số mol ester: $n=\\dfrac{m}{M}=\\dfrac{8{,}8}{88}=0{,}1$ mol.</li>
                    <li>Phương trình: $CH_3COOC_2H_5 + NaOH \\to CH_3COONa + C_2H_5OH$ (tỉ lệ $1:1:1$).</li>
                    <li>Theo tỉ lệ ⇒ $n_{muối}=n_{ester}=0{,}1$ mol.</li>
                    <li>Khối lượng muối: $m=n\\cdot M=0{,}1\\cdot82=8{,}2$ g.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-hoa-hsg-kimloai', title: 'Đại cương kim loại: dãy điện hóa, phản ứng & điện phân', level: 'CHUYEN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('electro')">Điện phân ▸</button> <button class="lesson-sim-btn" onclick="launchSim('metalsalt')">Fe + CuSO₄ ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Kim loại + acid</strong> (HCl, $H_2SO_4$ loãng): chỉ kim loại đứng trước H phản ứng, giải phóng $H_2$. VD $Fe+2HCl\\to FeCl_2+H_2$.</li>
                  <li><strong>Kim loại mạnh đẩy kim loại yếu khỏi muối:</strong> $Fe+CuSO_4\\to FeSO_4+Cu$.</li>
                  <li><strong>Điện phân:</strong> ở catot xảy ra sự khử (kim loại bám vào), ở anot xảy ra sự oxi hóa.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Cho $5{,}6$ g Fe ($M=56$) vào dung dịch $CuSO_4$ dư. Tính khối lượng Cu sinh ra và độ tăng khối lượng thanh kim loại.</p>
                  <p><strong>Giải:</strong> $n_{Fe}=0{,}1 \\Rightarrow n_{Cu}=0{,}1 \\Rightarrow m_{Cu}=0{,}1\\cdot64=6{,}4$ g. Khối lượng tăng $=6{,}4-5{,}6=0{,}8$ g.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Kim loại nào trong $Cu, Zn, Ag$ <em>không</em> tác dụng với dung dịch HCl?</p>
                  <details><summary>Đáp án</summary><p>$Cu$ và $Ag$ (đứng sau H trong dãy điện hóa).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Cho $0{,}2$ mol Zn vào $CuSO_4$ dư. Khối lượng Cu thu được?</p>
                  <details><summary>Đáp án</summary><p>$n_{Cu}=0{,}2 \\Rightarrow m=0{,}2\\cdot64=12{,}8$ g.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Cho $0{,}1$ mol Fe tác dụng HCl dư. Thể tích $H_2$ (đktc)?</p>
                  <details><summary>Đáp án</summary><p>$n_{H_2}=0{,}1 \\Rightarrow V=2{,}24$ lít.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 2 — kim loại đẩy kim loại khỏi muối):</strong>
                  <ol>
                    <li>Zn mạnh hơn Cu ⇒ phản ứng: $Zn + CuSO_4 \\to ZnSO_4 + Cu$ (tỉ lệ $1:1$).</li>
                    <li>Theo tỉ lệ: $n_{Cu}=n_{Zn}=0{,}2$ mol.</li>
                    <li>Khối lượng Cu: $m=n\\cdot M=0{,}2\\cdot64=12{,}8$ g.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-hoa-hsg-nito-polymer', title: 'Hợp chất chứa nitơ & Polymer: đếm – biện luận', level: 'CHUYEN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('polymer')">Mô phỏng trùng hợp ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Amino acid</strong> có cả nhóm $-NH_2$ (base) và $-COOH$ (acid) ⇒ tính lưỡng tính, tác dụng được với cả acid và base.</li>
                  <li><strong>Amine</strong> có tính base; bậc amine xác định theo số gốc hidrocarbon gắn vào N.</li>
                  <li><strong>Polymer:</strong> hệ số polime hóa $n=\\dfrac{M_{polymer}}{M_{monomer}}$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Polietilen (PE) $(-CH_2-CH_2-)_n$ điều chế từ etilen $C_2H_4$ ($M=28$). Nếu $M_{PE}=28000$, tính $n$.</p>
                  <p><strong>Giải:</strong> $n=\\dfrac{28000}{28}=1000$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Vì sao glyxin $H_2N\\text{-}CH_2\\text{-}COOH$ tác dụng được với cả HCl và NaOH?</p>
                  <details><summary>Đáp án</summary><p>Vì có nhóm $-NH_2$ (base) phản ứng với HCl và nhóm $-COOH$ (acid) phản ứng với NaOH ⇒ tính lưỡng tính.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tính số mắt xích của PVC có $M=62500$, biết monome vinyl clorua $C_2H_3Cl$ ($M=62{,}5$).</p>
                  <details><summary>Đáp án</summary><p>$n=\\dfrac{62500}{62{,}5}=1000$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Số đồng phân amine bậc một ứng với công thức $C_3H_9N$?</p>
                  <details><summary>Đáp án</summary><p>2 đồng phân: $CH_3CH_2CH_2NH_2$ và $(CH_3)_2CHNH_2$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 2 — số mắt xích polymer):</strong>
                  <ol>
                    <li>Hệ số polime hóa (số mắt xích): $n=\\dfrac{M_{polymer}}{M_{monomer}}$.</li>
                    <li>Monome là vinyl clorua $C_2H_3Cl$ có $M=24+3+35{,}5=62{,}5$.</li>
                    <li>Thay số: $n=\\dfrac{62500}{62{,}5}=1000$ mắt xích.</li>
                  </ol>
                </div>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'ANH', name: 'Tiếng Anh', name_en: 'English', grade: 12,
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
        {
          id: 't-anh-passive', title: 'Passive Voice (câu bị động)',
          lessons: [
            {
              id: 'l-anh-passive', title: 'Câu bị động', level: 'CO_BAN',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> Câu bị động nhấn mạnh <em>đối tượng chịu tác động</em> thay vì người thực hiện.</div>
                <h2>Form</h2>
                <p><strong>S + be + V3/ed (+ by O)</strong> — chia "be" theo thì của câu chủ động.</p>
                <ul>
                  <li>Hiện tại đơn: am/is/are + V3. Quá khứ đơn: was/were + V3.</li>
                  <li>Tương lai: will be + V3. Hiện tại hoàn thành: have/has been + V3.</li>
                </ul>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p>Active: <em>They build a house.</em> → Passive: <em>A house <strong>is built</strong> (by them).</em></p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Chuyển sang bị động: "She writes a letter."</p>
                  <details><summary>Đáp án</summary><p>"A letter <strong>is written</strong> (by her)."</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-anh-conditional', title: 'Conditional Sentences (câu điều kiện)',
          lessons: [
            {
              id: 'l-anh-conditional', title: 'Câu điều kiện loại 1, 2, 3', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Loại 1</strong> (có thật, tương lai): If + S + V(s), S + <em>will</em> + V. <br>Ex: <em>If it rains, I will stay home.</em></li>
                  <li><strong>Loại 2</strong> (không thật, hiện tại): If + S + V2/were, S + <em>would</em> + V. <br>Ex: <em>If I were you, I would study harder.</em></li>
                  <li><strong>Loại 3</strong> (không thật, quá khứ): If + S + had + V3, S + <em>would have</em> + V3. <br>Ex: <em>If she had studied, she would have passed.</em></li>
                </ul>
                <h2>Nâng cao</h2>
                <p>Trong câu điều kiện loại 2, với động từ "to be" dùng <strong>were</strong> cho mọi ngôi (I/he/she + were).</p>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Điền: "If I ____ (be) you, I would accept the offer."</p>
                  <details><summary>Đáp án</summary><p><strong>were</strong> (điều kiện loại 2).</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-anh-relative', title: 'Relative Clauses (mệnh đề quan hệ)',
          lessons: [
            {
              id: 'l-anh-relative', title: 'Mệnh đề quan hệ', level: 'NANG_CAO',
              html: `
                <div class="luuy"><strong>Khái niệm:</strong> Mệnh đề quan hệ bổ nghĩa cho danh từ đứng trước, nối bằng đại từ quan hệ.</div>
                <h2>Cốt lõi — Đại từ quan hệ</h2>
                <ul>
                  <li><strong>who</strong>: thay cho người (chủ ngữ). <em>The man <strong>who</strong> lives next door is a doctor.</em></li>
                  <li><strong>whom</strong>: người (tân ngữ); <strong>which</strong>: vật; <strong>that</strong>: cả người và vật.</li>
                  <li><strong>whose</strong>: sở hữu. <strong>where</strong>: nơi chốn. <strong>when</strong>: thời gian.</li>
                </ul>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div>
                  <p><em>This is the house <strong>where</strong> I was born.</em></p>
                </div>
                <div class="bt"><div class="bt-title">✏️ Bài tập</div>
                  <p>Điền đại từ quan hệ: "The book ____ I bought yesterday is interesting."</p>
                  <details><summary>Đáp án</summary><p><strong>which</strong> hoặc <strong>that</strong> (bổ nghĩa cho vật, làm tân ngữ).</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-anh-hsg', title: '🏆 Chuyên đề · Bồi dưỡng HSG & Luyện thi THPT QG',
          lessons: [
            {
              id: 'l-anh-hsg-grammar', title: 'Advanced grammar: inversion, subjunctive, reduced clauses', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Inversion (đảo ngữ):</strong> mở đầu bằng từ phủ định/giới hạn thì đảo trợ động từ lên trước chủ ngữ. <em>Not only did he study, but he also worked. / Never have I seen such a thing. / Hardly had I arrived when it rained.</em></li>
                  <li><strong>Subjunctive (giả định):</strong> sau suggest, recommend, insist, demand, essential, important + that + S + <strong>V (nguyên thể)</strong>. <em>I suggest that he go now. / It is essential that she be present.</em></li>
                  <li><strong>Reduced relative clauses (rút gọn mệnh đề quan hệ):</strong> chủ động → V-ing; bị động → V3. <em>The man who is standing = The man standing; The book which was written = The book written.</em></li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Đảo ngữ: "I had never seen such a beautiful sunset." → <strong>Never had I seen</strong> such a beautiful sunset.</p>
                  <p>Rút gọn: "The students who were chosen will join the contest." → The students <strong>chosen</strong> will join the contest.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Viết lại dùng đảo ngữ: "He had no sooner left than the phone rang."</p>
                  <details><summary>Đáp án</summary><p>No sooner had he left than the phone rang.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Chia đúng: "The teacher insists that every student ____ (be) on time."</p>
                  <details><summary>Đáp án</summary><p>be (subjunctive).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Rút gọn: "The woman who lives next door is a doctor."</p>
                  <details><summary>Đáp án</summary><p>The woman living next door is a doctor.</p></details>
                </div>
              `,
            },
            {
              id: 'l-anh-hsg-vocab', title: 'Word formation, collocations & phrasal verbs (THPT QG)', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Word formation:</strong> nhận diện vị trí cần danh từ / tính từ / trạng từ / động từ rồi chọn hậu tố phù hợp. <em>economy → economic → economical → economically.</em></li>
                  <li><strong>Collocations</strong> hay gặp: <em>make progress, take responsibility, pay attention, do research, meet a deadline.</em></li>
                  <li><strong>Phrasal verbs:</strong> <em>carry out, put off, look forward to, come up with, give up, take after.</em></li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Điền dạng đúng: "His speech was very ____ (persuade)." → <strong>persuasive</strong> (tính từ sau "very").</p>
                  <p>Phrasal verb: "We need to ____ a solution." → <strong>come up with</strong>.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Cho dạng đúng: "She handled the situation ____ (profession)."</p>
                  <details><summary>Đáp án</summary><p>professionally (trạng từ).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Điền collocation: "Students should ____ attention in class."</p>
                  <details><summary>Đáp án</summary><p>pay attention.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Điền phrasal verb: "The meeting was ____ until next week." (hoãn)</p>
                  <details><summary>Đáp án</summary><p>put off.</p></details>
                </div>
              `,
            },
            {
              id: 'l-anh-hsg-transform', title: 'Sentence transformation & reading skills', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi — dạng bài thi</h2>
                <ul>
                  <li><strong>Although / Despite:</strong> Despite + N/V-ing = Although + S + V. <em>Despite being tired = Although he was tired.</em></li>
                  <li><strong>So sánh nhất ↔ phủ định so sánh hơn:</strong> "the most beautiful I've ever seen" = "I've never seen a more beautiful one".</li>
                  <li><strong>Reading:</strong> skim lấy ý chính, scan tìm từ khóa; chú ý từ nối và đại từ thay thế để suy luận.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Viết lại: "Although it was raining, they went out." → <strong>Despite the rain</strong>, they went out.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Viết lại với "Despite": "Although he was ill, he came to school."</p>
                  <details><summary>Đáp án</summary><p>Despite his illness / Despite being ill, he came to school.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Viết lại: "This is the best film I have ever seen." (dùng "never")</p>
                  <details><summary>Đáp án</summary><p>I have never seen a better film (than this).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Tìm và sửa lỗi: "She is interested on learning English."</p>
                  <details><summary>Đáp án</summary><p>on → in ("interested in").</p></details>
                </div>
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

    /* ===================== LỚP 8 (GDPT 2018) ===================== */
    {
      code: 'TOAN8', name: 'Toán 8', name_en: 'Mathematics 8', grade: 8,
      topics: [
        {
          id: 't-toan8-hdt', title: 'Đại số · Hằng đẳng thức đáng nhớ',
          lessons: [
            {
              id: 'l-toan8-hdt', title: 'Bảy hằng đẳng thức đáng nhớ', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Bảy hằng đẳng thức đáng nhớ (với $A,B$ là các biểu thức tùy ý):</p>
                <ul>
                  <li>$(A+B)^2 = A^2 + 2AB + B^2$</li>
                  <li>$(A-B)^2 = A^2 - 2AB + B^2$</li>
                  <li>$A^2 - B^2 = (A-B)(A+B)$</li>
                  <li>$(A+B)^3 = A^3 + 3A^2B + 3AB^2 + B^3$</li>
                  <li>$(A-B)^3 = A^3 - 3A^2B + 3AB^2 - B^3$</li>
                  <li>$A^3 + B^3 = (A+B)(A^2 - AB + B^2)$</li>
                  <li>$A^3 - B^3 = (A-B)(A^2 + AB + B^2)$</li>
                </ul>
                <div class="luuy"><strong>Khái niệm:</strong> Hằng đẳng thức là đẳng thức <em>đúng với mọi giá trị</em> của biến. Dùng để khai triển nhanh và phân tích đa thức thành nhân tử.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tính nhanh $51^2$.</p>
                  <p><strong>Giải:</strong> $51^2 = (50+1)^2 = 50^2 + 2\\cdot50\\cdot1 + 1^2 = 2500 + 100 + 1 = 2601$.</p>
                  <p>Phân tích $x^2 - 9 = x^2 - 3^2 = (x-3)(x+3)$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Phân tích $x^3 - 8$ thành nhân tử.</p>
                  <details><summary>Đáp án</summary><p>$x^3 - 2^3 = (x-2)(x^2 + 2x + 4)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tính nhanh $99^2$.</p>
                  <details><summary>Đáp án</summary><p>$(100-1)^2 = 10000 - 200 + 1 = 9801$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Viết $4x^2 + 12x + 9$ dưới dạng bình phương của một tổng.</p>
                  <details><summary>Đáp án</summary><p>$(2x+3)^2$.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-ptbn', title: 'Đại số · Phương trình bậc nhất một ẩn',
          lessons: [
            {
              id: 'l-toan8-ptbn', title: 'Phương trình bậc nhất một ẩn $ax+b=0$', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Phương trình bậc nhất một ẩn có dạng $ax + b = 0$ với $a \\ne 0$. Nghiệm duy nhất: $x = -\\dfrac{b}{a}$.</p>
                <div class="luuy"><strong>Quy tắc:</strong> chuyển vế đổi dấu; nhân/chia hai vế cho cùng một số khác 0.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Giải $2x - 6 = 0$.</p>
                  <p><strong>Giải:</strong> $2x = 6 \\Leftrightarrow x = 3$.</p>
                  <p>Giải $3(x-1) = 2x + 4$: $3x - 3 = 2x + 4 \\Leftrightarrow x = 7$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Giải $5x + 2 = 3x - 4$.</p>
                  <details><summary>Đáp án</summary><p>$2x = -6 \\Leftrightarrow x = -3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Giải $4x - 3 = 2x + 7$.</p>
                  <details><summary>Đáp án</summary><p>$2x = 10 \\Leftrightarrow x = 5$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Giải $2(x - 3) = x + 1$.</p>
                  <details><summary>Đáp án</summary><p>$2x - 6 = x + 1 \\Leftrightarrow x = 7$.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-pythagore', title: 'Hình học · Định lí Pythagore & Tam giác đồng dạng',
          lessons: [
            {
              id: 'l-toan8-pythagore', title: 'Định lí Pythagore', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('geo')">Hình học động (tam giác) ▸</button></div>
                <h2>Cốt lõi</h2>
                <p>Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông:</p>
                <p style="text-align:center">$a^2 + b^2 = c^2$ &nbsp; (với $c$ là cạnh huyền).</p>
                <div class="luuy"><strong>Định lí đảo:</strong> nếu $a^2+b^2=c^2$ thì tam giác vuông tại đỉnh đối diện cạnh $c$.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tam giác vuông có hai cạnh góc vuông $3$ và $4$. Cạnh huyền?</p>
                  <p><strong>Giải:</strong> $c = \\sqrt{3^2+4^2} = \\sqrt{25} = 5$.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📐 Hình minh họa — tam giác vuông 3–4–5</div>
                  <svg class="graph" viewBox="0 0 200 150" width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="35,120 155,120 35,40" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
                    <rect x="35" y="108" width="12" height="12" fill="none" stroke="#4f46e5"/>
                    <text x="86" y="137" fill="#475569">a = 4</text>
                    <text x="8" y="86" fill="#475569">b = 3</text>
                    <text x="98" y="74" fill="#dc2626">c = 5</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Cạnh huyền $13$, một cạnh góc vuông $5$. Cạnh còn lại?</p>
                  <details><summary>Đáp án</summary><p>$\\sqrt{13^2-5^2}=\\sqrt{144}=12$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Hai cạnh góc vuông $6$ và $8$. Tính cạnh huyền.</p>
                  <details><summary>Đáp án</summary><p>$\\sqrt{6^2+8^2}=\\sqrt{100}=10$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Tam giác có ba cạnh $9, 12, 15$ có phải tam giác vuông không?</p>
                  <details><summary>Đáp án</summary><p>$9^2+12^2=81+144=225=15^2$ ⇒ vuông (định lí Pythagore đảo).</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-dathuc', title: 'Đại số · Đa thức nhiều biến & phép chia',
          lessons: [
            {
              id: 'l-toan8-dathuc', title: 'Đa thức nhiều biến — cộng, trừ, nhân, chia', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p><strong>Đơn thức</strong> là tích của số với các biến (mỗi biến lũy thừa số tự nhiên). <strong>Đa thức</strong> là tổng của những đơn thức. Đơn thức đồng dạng có cùng phần biến.</p>
                <ul>
                  <li>Cộng/trừ đa thức: thu gọn các đơn thức đồng dạng.</li>
                  <li>Nhân đơn thức với đa thức: $A(B+C)=AB+AC$.</li>
                  <li>Nhân hai đa thức: nhân từng hạng tử rồi thu gọn.</li>
                  <li>Chia đa thức cho đơn thức: chia từng hạng tử.</li>
                </ul>
                <div class="luuy"><strong>Lưu ý:</strong> $x^m\\cdot x^n = x^{m+n}$; $x^m : x^n = x^{m-n}$ (với $m\\ge n$).</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Nhân: $2x(3x-5) = 6x^2 - 10x$.</p>
                  <p>$(x+2)(x-3) = x^2 - 3x + 2x - 6 = x^2 - x - 6$.</p>
                  <p>Chia: $(6x^3 - 9x^2) : (3x) = 2x^2 - 3x$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Rút gọn $(2x+1)(x-4)$.</p>
                  <details><summary>Đáp án</summary><p>$2x^2 - 8x + x - 4 = 2x^2 - 7x - 4$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Nhân $3x^2(2x - 5)$.</p>
                  <details><summary>Đáp án</summary><p>$6x^3 - 15x^2$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Chia $(8x^4 - 12x^2) : (4x^2)$.</p>
                  <details><summary>Đáp án</summary><p>$2x^2 - 3$.</p></details>
                </div>
              `,
            },
            {
              id: 'l-toan8-ptnt', title: 'Phân tích đa thức thành nhân tử', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Phân tích đa thức thành nhân tử là viết đa thức thành tích của những đa thức. Bốn phương pháp chính:</p>
                <ul>
                  <li><strong>Đặt nhân tử chung:</strong> $ab + ac = a(b+c)$.</li>
                  <li><strong>Dùng hằng đẳng thức:</strong> $x^2 - 9 = (x-3)(x+3)$.</li>
                  <li><strong>Nhóm hạng tử:</strong> nhóm để xuất hiện nhân tử chung.</li>
                  <li><strong>Tách hạng tử:</strong> với tam thức $x^2+bx+c$, tách $bx$ thành hai số có tích $c$, tổng $b$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Đặt nhân tử chung: $5x^2 - 10x = 5x(x-2)$.</p>
                  <p>Nhóm: $x^2 + xy + 3x + 3y = x(x+y) + 3(x+y) = (x+y)(x+3)$.</p>
                  <p>Tách hạng tử: $x^2 + 5x + 6 = x^2 + 2x + 3x + 6 = (x+2)(x+3)$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Phân tích $x^2 - 5x + 6$.</p>
                  <details><summary>Đáp án</summary><p>$x^2 - 2x - 3x + 6 = (x-2)(x-3)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Phân tích $3x^2 - 6x$.</p>
                  <details><summary>Đáp án</summary><p>$3x(x - 2)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Phân tích $x^2 - 7x + 10$.</p>
                  <details><summary>Đáp án</summary><p>$(x-2)(x-5)$.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-phanthuc', title: 'Đại số · Phân thức đại số',
          lessons: [
            {
              id: 'l-toan8-phanthuc', title: 'Phân thức — điều kiện xác định, rút gọn, phép tính', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Phân thức đại số có dạng $\\dfrac{A}{B}$ với $A,B$ là đa thức và $B \\ne 0$.</p>
                <ul>
                  <li><strong>Điều kiện xác định (ĐKXĐ):</strong> mẫu $B \\ne 0$.</li>
                  <li><strong>Tính chất cơ bản:</strong> $\\dfrac{A}{B} = \\dfrac{A\\cdot M}{B\\cdot M}$ ($M\\ne0$) — dùng để rút gọn và quy đồng.</li>
                  <li><strong>Cộng/trừ:</strong> quy đồng mẫu rồi cộng/trừ tử.</li>
                  <li><strong>Nhân:</strong> $\\dfrac{A}{B}\\cdot\\dfrac{C}{D} = \\dfrac{AC}{BD}$. <strong>Chia:</strong> nhân với phân thức nghịch đảo.</li>
                </ul>
                <div class="luuy"><strong>Lưu ý:</strong> luôn tìm ĐKXĐ trước khi rút gọn; chỉ được rút gọn nhân tử chung của tử và mẫu.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Rút gọn $\\dfrac{x^2-4}{x^2+4x+4}$ (ĐKXĐ $x\\ne-2$): $\\dfrac{(x-2)(x+2)}{(x+2)^2} = \\dfrac{x-2}{x+2}$.</p>
                  <p>Cộng: $\\dfrac{1}{x} + \\dfrac{1}{x+1} = \\dfrac{(x+1)+x}{x(x+1)} = \\dfrac{2x+1}{x(x+1)}$ (ĐKXĐ $x\\ne0, x\\ne-1$).</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Rút gọn $\\dfrac{3x+6}{x^2-4}$ và nêu ĐKXĐ.</p>
                  <details><summary>Đáp án</summary><p>ĐKXĐ $x\\ne\\pm2$. $\\dfrac{3(x+2)}{(x-2)(x+2)} = \\dfrac{3}{x-2}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Rút gọn $\\dfrac{x^2-9}{x+3}$ (ĐKXĐ $x\\ne-3$).</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{(x-3)(x+3)}{x+3} = x-3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Tính $\\dfrac{2}{x} + \\dfrac{3}{x}$.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{5}{x}$ (ĐKXĐ $x\\ne0$).</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-hamso', title: 'Đại số · Hàm số bậc nhất & đồ thị',
          lessons: [
            {
              id: 'l-toan8-hamso', title: 'Hàm số bậc nhất $y = ax + b$ và đồ thị', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Công cụ:</strong> <button class="lesson-sim-btn" onclick="launchSim('graph')">Vẽ đồ thị hàm số ▸</button></div>
                <h2>Cốt lõi</h2>
                <p>Hàm số bậc nhất có dạng $y = ax + b$ với $a \\ne 0$.</p>
                <ul>
                  <li>Đồ thị là một <strong>đường thẳng</strong> cắt trục tung tại điểm $(0; b)$.</li>
                  <li>$a$ là <strong>hệ số góc</strong>: $a>0$ hàm đồng biến (đường thẳng đi lên), $a<0$ nghịch biến (đi xuống).</li>
                  <li>Cách vẽ: xác định hai điểm — thường lấy giao với hai trục — rồi nối lại.</li>
                </ul>
                <div class="luuy"><strong>Vị trí tương đối:</strong> hai đường thẳng $y=ax+b$ và $y=a'x+b'$ <em>song song</em> khi $a=a', b\\ne b'$; <em>cắt nhau</em> khi $a\\ne a'$; <em>trùng nhau</em> khi $a=a', b=b'$.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Hàm $y = 2x - 3$: hệ số góc $a=2>0$ ⇒ đồng biến; cắt $Oy$ tại $(0;-3)$, cắt $Ox$ tại $\\left(\\tfrac{3}{2};0\\right)$.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📈 Đồ thị $y = 2x - 3$</div>
                  <svg class="graph" viewBox="0 0 200 180" width="200" height="180" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="90" x2="190" y2="90" stroke="#94a3b8"/>
                    <line x1="100" y1="15" x2="100" y2="170" stroke="#94a3b8"/>
                    <polyline points="85,165 152,30" fill="none" stroke="#4f46e5" stroke-width="2"/>
                    <circle cx="100" cy="135" r="3" fill="#dc2626"/>
                    <circle cx="122" cy="90" r="3" fill="#16a34a"/>
                    <text x="104" y="148" fill="#dc2626">(0; -3)</text>
                    <text x="118" y="84" fill="#16a34a">(1,5; 0)</text>
                    <text x="180" y="86">x</text>
                    <text x="104" y="22">y</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Đường thẳng $y = -x + 5$ cắt trục tung tại điểm nào và đồng biến hay nghịch biến?</p>
                  <details><summary>Đáp án</summary><p>Cắt $Oy$ tại $(0;5)$; $a=-1<0$ ⇒ nghịch biến.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm giao điểm của $y = 2x - 3$ với trục hoành.</p>
                  <details><summary>Đáp án</summary><p>Cho $y=0 \\Rightarrow 2x-3=0 \\Rightarrow x=\\dfrac{3}{2}$, điểm $\\left(\\dfrac{3}{2};0\\right)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Hai đường thẳng $y = 3x + 1$ và $y = 3x - 2$ có vị trí tương đối nào?</p>
                  <details><summary>Đáp án</summary><p>Cùng $a=3$, khác $b$ ⇒ song song.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-lapphuongtrinh', title: 'Đại số · Giải bài toán bằng cách lập phương trình',
          lessons: [
            {
              id: 'l-toan8-lapphuongtrinh', title: 'Giải bài toán bằng cách lập phương trình', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <p>Các bước giải:</p>
                <ol>
                  <li>Chọn ẩn, đặt điều kiện cho ẩn và đơn vị.</li>
                  <li>Biểu diễn các đại lượng chưa biết qua ẩn.</li>
                  <li>Lập phương trình thể hiện mối liên hệ.</li>
                  <li>Giải phương trình, đối chiếu điều kiện và trả lời.</li>
                </ol>
                <div class="luuy"><strong>Dạng quen thuộc:</strong> toán chuyển động $s = v\\cdot t$; toán tổng–hiệu; toán năng suất/công việc.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Hai số có tổng $30$, số lớn hơn số bé $6$ đơn vị. Tìm hai số.</p>
                  <p><strong>Giải:</strong> Gọi số bé là $x$ ⇒ số lớn $x+6$. Ta có $x + (x+6) = 30 \\Leftrightarrow 2x = 24 \\Leftrightarrow x = 12$. Vậy hai số là $12$ và $18$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Một ô tô đi $150$ km trong $t$ giờ với vận tốc $50$ km/h. Tìm $t$.</p>
                  <details><summary>Đáp án</summary><p>$50t = 150 \\Leftrightarrow t = 3$ giờ.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Hai số có tổng $40$, số này gấp $3$ lần số kia. Tìm hai số.</p>
                  <details><summary>Đáp án</summary><p>Gọi số bé $x$: $x + 3x = 40 \\Rightarrow x = 10$. Hai số là $10$ và $30$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Một hình chữ nhật có chiều dài hơn chiều rộng $4$ m, chu vi $28$ m. Tìm chiều rộng.</p>
                  <details><summary>Đáp án</summary><p>Gọi chiều rộng $x$: $2(x + x+4) = 28 \\Rightarrow 2x+4 = 14 \\Rightarrow x = 5$ m.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-tugiac', title: 'Hình học · Tứ giác & các hình đặc biệt',
          lessons: [
            {
              id: 'l-toan8-tugiac', title: 'Tứ giác, hình thang, hình bình hành', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Tứ giác lồi:</strong> tổng bốn góc bằng $360^\\circ$.</li>
                  <li><strong>Hình thang:</strong> tứ giác có hai cạnh đối song song. Hình thang cân có hai góc kề một đáy bằng nhau và hai đường chéo bằng nhau.</li>
                  <li><strong>Hình bình hành:</strong> hai cặp cạnh đối song song. Tính chất: cạnh đối bằng nhau, góc đối bằng nhau, hai đường chéo cắt nhau tại trung điểm mỗi đường.</li>
                </ul>
                <div class="luuy"><strong>Diện tích:</strong> hình thang $S=\\dfrac{(a+b)h}{2}$; hình bình hành $S = a\\cdot h$ (cạnh nhân chiều cao tương ứng).</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Hình thang có hai đáy $6$ cm và $10$ cm, chiều cao $4$ cm. Diện tích?</p>
                  <p><strong>Giải:</strong> $S = \\dfrac{(6+10)\\cdot4}{2} = 32$ cm².</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📐 Hình thang (đáy $a$, $b$; chiều cao $h$)</div>
                  <svg class="graph" viewBox="0 0 200 130" width="200" height="130" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="55,30 150,30 180,110 20,110" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
                    <line x1="55" y1="30" x2="55" y2="110" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 3"/>
                    <text x="92" y="24" fill="#475569">a</text>
                    <text x="96" y="125" fill="#475569">b</text>
                    <text x="40" y="74" fill="#16a34a">h</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Một tứ giác có ba góc $80^\\circ, 100^\\circ, 90^\\circ$. Góc thứ tư?</p>
                  <details><summary>Đáp án</summary><p>$360^\\circ - (80+100+90)^\\circ = 90^\\circ$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Hình thang có hai đáy $5$ cm và $9$ cm, chiều cao $6$ cm. Diện tích?</p>
                  <details><summary>Đáp án</summary><p>$S = \\dfrac{(5+9)\\cdot6}{2} = 42$ cm².</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Hình bình hành có cạnh đáy $8$ cm, chiều cao tương ứng $5$ cm. Diện tích?</p>
                  <details><summary>Đáp án</summary><p>$S = a\\cdot h = 8\\cdot5 = 40$ cm².</p></details>
                </div>
              `,
            },
            {
              id: 'l-toan8-hcn-thoi-vuong', title: 'Hình chữ nhật, hình thoi, hình vuông', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Hình chữ nhật:</strong> hình bình hành có một góc vuông ⇒ bốn góc vuông, hai đường chéo bằng nhau và cắt nhau tại trung điểm. $S = a\\cdot b$.</li>
                  <li><strong>Hình thoi:</strong> hình bình hành có hai cạnh kề bằng nhau ⇒ bốn cạnh bằng nhau, hai đường chéo vuông góc và là phân giác các góc. $S = \\dfrac{d_1 d_2}{2}$.</li>
                  <li><strong>Hình vuông:</strong> vừa là hình chữ nhật vừa là hình thoi ⇒ bốn cạnh bằng, bốn góc vuông. $S = a^2$.</li>
                </ul>
                <div class="luuy"><strong>Dấu hiệu nhận biết hình vuông:</strong> hình chữ nhật có hai cạnh kề bằng nhau, hoặc hình thoi có một góc vuông.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Hình thoi có hai đường chéo $6$ cm và $8$ cm. Diện tích và độ dài cạnh?</p>
                  <p><strong>Giải:</strong> $S = \\dfrac{6\\cdot8}{2} = 24$ cm². Cạnh $= \\sqrt{3^2+4^2} = 5$ cm (nửa hai đường chéo là cạnh góc vuông).</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📐 Hình thoi & hai đường chéo vuông góc</div>
                  <svg class="graph" viewBox="0 0 180 140" width="180" height="140" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="90,15 165,70 90,125 15,70" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
                    <line x1="90" y1="15" x2="90" y2="125" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 3"/>
                    <line x1="15" y1="70" x2="165" y2="70" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 3"/>
                    <rect x="90" y="58" width="12" height="12" fill="none" stroke="#475569"/>
                    <text x="96" y="52" fill="#dc2626">d₁</text>
                    <text x="130" y="64" fill="#16a34a">d₂</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Hình vuông cạnh $5$ cm có diện tích bao nhiêu?</p>
                  <details><summary>Đáp án</summary><p>$S = 5^2 = 25$ cm².</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Hình thoi có hai đường chéo $10$ cm và $12$ cm. Diện tích?</p>
                  <details><summary>Đáp án</summary><p>$S = \\dfrac{10\\cdot12}{2} = 60$ cm².</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Hình chữ nhật có hai kích thước $4$ cm và $9$ cm. Diện tích và độ dài đường chéo?</p>
                  <details><summary>Đáp án</summary><p>$S = 36$ cm²; đường chéo $= \\sqrt{4^2+9^2} = \\sqrt{97} \\approx 9{,}85$ cm.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-thales', title: 'Hình học · Định lí Thalès & Tam giác đồng dạng',
          lessons: [
            {
              id: 'l-toan8-thales', title: 'Định lí Thalès trong tam giác', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('geo')">Hình học động (tam giác) ▸</button></div>
                <h2>Cốt lõi</h2>
                <p><strong>Định lí Thalès:</strong> nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.</p>
                <p style="text-align:center">Tam giác $ABC$, $DE \\parallel BC$ ($D\\in AB, E\\in AC$): $\\dfrac{AD}{AB} = \\dfrac{AE}{AC} = \\dfrac{DE}{BC}$.</p>
                <div class="luuy"><strong>Hệ quả & định lí đảo:</strong> nếu $\\dfrac{AD}{AB}=\\dfrac{AE}{AC}$ thì $DE \\parallel BC$. Đường trung bình của tam giác song song và bằng nửa cạnh thứ ba.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tam giác $ABC$ có $DE\\parallel BC$, $AD=3, DB=6, AE=4$. Tính $EC$.</p>
                  <p><strong>Giải:</strong> $\\dfrac{AD}{DB}=\\dfrac{AE}{EC} \\Rightarrow \\dfrac{3}{6}=\\dfrac{4}{EC} \\Rightarrow EC = 8$.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📐 Định lí Thalès — $DE \\parallel BC$</div>
                  <svg class="graph" viewBox="0 0 200 150" width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="90,20 20,120 160,120" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
                    <line x1="62" y1="60" x2="118" y2="60" stroke="#dc2626" stroke-width="2"/>
                    <text x="84" y="16" fill="#475569">A</text>
                    <text x="8" y="125" fill="#475569">B</text>
                    <text x="165" y="125" fill="#475569">C</text>
                    <text x="48" y="58" fill="#dc2626">D</text>
                    <text x="122" y="58" fill="#dc2626">E</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> $DE\\parallel BC$, $AD=2, AB=6, DE=4$. Tính $BC$.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{AD}{AB}=\\dfrac{DE}{BC} \\Rightarrow \\dfrac{2}{6}=\\dfrac{4}{BC} \\Rightarrow BC=12$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> $DE\\parallel BC$, $AD=4, DB=6, AE=6$. Tính $EC$.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{AD}{DB}=\\dfrac{AE}{EC} \\Rightarrow \\dfrac{4}{6}=\\dfrac{6}{EC} \\Rightarrow EC=9$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Đường trung bình của tam giác có cạnh đáy $14$ cm dài bao nhiêu?</p>
                  <details><summary>Đáp án</summary><p>Bằng nửa cạnh đáy: $14:2 = 7$ cm.</p></details>
                </div>
              `,
            },
            {
              id: 'l-toan8-dongdang', title: 'Hai tam giác đồng dạng', level: 'NANG_CAO',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('geo')">Hình học động (tam giác) ▸</button></div>
                <h2>Cốt lõi</h2>
                <p>Hai tam giác đồng dạng khi các góc tương ứng bằng nhau và các cạnh tương ứng tỉ lệ. Ba trường hợp đồng dạng:</p>
                <ul>
                  <li><strong>(c.c.c):</strong> ba cặp cạnh tương ứng tỉ lệ.</li>
                  <li><strong>(c.g.c):</strong> hai cặp cạnh tỉ lệ và góc xen giữa bằng nhau.</li>
                  <li><strong>(g.g):</strong> hai cặp góc bằng nhau.</li>
                </ul>
                <div class="luuy"><strong>Tỉ số:</strong> nếu tỉ số đồng dạng là $k$ thì tỉ số chu vi bằng $k$, tỉ số diện tích bằng $k^2$.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Hai tam giác đồng dạng tỉ số $k=\\dfrac{1}{2}$, tam giác lớn có diện tích $40$ cm². Diện tích tam giác nhỏ?</p>
                  <p><strong>Giải:</strong> Tỉ số diện tích $k^2 = \\dfrac{1}{4} \\Rightarrow S = 40\\cdot\\dfrac{1}{4} = 10$ cm².</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📐 Hai tam giác đồng dạng (tỉ số $k$)</div>
                  <svg class="graph" viewBox="0 0 240 130" width="240" height="130" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="20,110 80,110 30,45" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
                    <polygon points="120,110 230,110 138,25" fill="#fef9c3" stroke="#f59e0b" stroke-width="2"/>
                    <text x="38" y="125" fill="#4f46e5">△ABC</text>
                    <text x="158" y="125" fill="#f59e0b">△DEF</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tam giác $ABC \\sim DEF$ tỉ số $3$, chu vi $DEF$ là $12$ cm. Chu vi $ABC$?</p>
                  <details><summary>Đáp án</summary><p>Chu vi tỉ lệ theo $k=3$: $12\\cdot3 = 36$ cm.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Hai tam giác đồng dạng tỉ số $k=2$. Tỉ số diện tích của chúng?</p>
                  <details><summary>Đáp án</summary><p>$k^2 = 4$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> $ABC \\sim MNP$ với $AB=6, MN=9$. Nếu $BC=8$ thì $NP$ bằng bao nhiêu?</p>
                  <details><summary>Đáp án</summary><p>Tỉ số $\\dfrac{AB}{MN}=\\dfrac{6}{9}=\\dfrac{2}{3}=\\dfrac{BC}{NP} \\Rightarrow NP = 8\\cdot\\dfrac{3}{2} = 12$.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-thongke', title: 'Thống kê & Xác suất',
          lessons: [
            {
              id: 'l-toan8-thongke', title: 'Thu thập & biểu diễn dữ liệu', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Dữ liệu:</strong> phân loại định tính (màu sắc, giới tính…) và định lượng (chiều cao, điểm số…).</li>
                  <li><strong>Bảng tần số:</strong> liệt kê giá trị và số lần xuất hiện.</li>
                  <li><strong>Biểu đồ:</strong> biểu đồ cột (so sánh số lượng), biểu đồ đoạn thẳng (biến đổi theo thời gian), biểu đồ hình quạt tròn (tỉ lệ phần trăm của tổng thể).</li>
                </ul>
                <div class="luuy"><strong>Số đặc trưng:</strong> số trung bình cộng $\\bar{x}=\\dfrac{\\text{tổng các giá trị}}{\\text{số giá trị}}$; biểu đồ quạt: mỗi phần ứng với một phần trăm của $360^\\circ$.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Điểm kiểm tra: $6, 7, 8, 9, 10$. Số trung bình cộng?</p>
                  <p><strong>Giải:</strong> $\\bar{x} = \\dfrac{6+7+8+9+10}{5} = \\dfrac{40}{5} = 8$.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">📊 Biểu đồ cột (số HS theo loại)</div>
                  <svg class="graph" viewBox="0 0 200 130" width="200" height="130" xmlns="http://www.w3.org/2000/svg">
                    <line x1="25" y1="110" x2="190" y2="110" stroke="#94a3b8"/>
                    <line x1="25" y1="15" x2="25" y2="110" stroke="#94a3b8"/>
                    <rect x="40" y="70" width="22" height="40" fill="#4f46e5"/>
                    <rect x="75" y="50" width="22" height="60" fill="#4f46e5"/>
                    <rect x="110" y="35" width="22" height="75" fill="#4f46e5"/>
                    <rect x="145" y="80" width="22" height="30" fill="#4f46e5"/>
                    <text x="46" y="124">A</text>
                    <text x="81" y="124">B</text>
                    <text x="116" y="124">C</text>
                    <text x="151" y="124">D</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Trong biểu đồ quạt, một loại chiếm $25\\%$. Góc ở tâm tương ứng?</p>
                  <details><summary>Đáp án</summary><p>$25\\% \\times 360^\\circ = 90^\\circ$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Số cây trồng của 4 tổ: $5, 8, 7, 4$. Trung bình mỗi tổ?</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{5+8+7+4}{4} = \\dfrac{24}{4} = 6$ cây.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Một loại trong biểu đồ quạt ứng với góc $72^\\circ$. Loại đó chiếm bao nhiêu phần trăm?</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{72^\\circ}{360^\\circ}\\times100\\% = 20\\%$.</p></details>
                </div>
              `,
            },
            {
              id: 'l-toan8-xacsuat', title: 'Xác suất của biến cố', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Xác suất lí thuyết</strong> (kết quả đồng khả năng): $P = \\dfrac{\\text{số kết quả thuận lợi}}{\\text{số kết quả có thể}}$.</li>
                  <li><strong>Xác suất thực nghiệm:</strong> $\\dfrac{\\text{số lần biến cố xảy ra}}{\\text{số lần thực hiện}}$; khi số lần đủ lớn sẽ xấp xỉ xác suất lí thuyết.</li>
                  <li>Xác suất luôn nằm trong khoảng từ $0$ (không thể) đến $1$ (chắc chắn).</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tung một con xúc xắc cân đối. Xác suất xuất hiện mặt $6$ chấm?</p>
                  <p><strong>Giải:</strong> $P = \\dfrac{1}{6}$. Xác suất ra số chẵn $= \\dfrac{3}{6} = \\dfrac{1}{2}$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Một hộp có $3$ bi đỏ và $2$ bi xanh. Lấy ngẫu nhiên $1$ bi. Xác suất lấy được bi đỏ?</p>
                  <details><summary>Đáp án</summary><p>$P = \\dfrac{3}{5}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tung một đồng xu cân đối. Xác suất xuất hiện mặt ngửa?</p>
                  <details><summary>Đáp án</summary><p>$P = \\dfrac{1}{2}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Tung xúc xắc. Xác suất ra số lớn hơn $4$ (tức $5$ hoặc $6$)?</p>
                  <details><summary>Đáp án</summary><p>$P = \\dfrac{2}{6} = \\dfrac{1}{3}$.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-toan8-hsg', title: '🏆 Chuyên đề · Bồi dưỡng HSG & Olympic Toán 8',
          lessons: [
            {
              id: 'l-toan8-hsg-phantich', title: 'Phân tích đa thức & hằng đẳng thức nâng cao', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi — kĩ thuật thi HSG</h2>
                <ul>
                  <li><strong>Hằng đẳng thức mở rộng:</strong> $a^3+b^3+c^3-3abc = (a+b+c)(a^2+b^2+c^2-ab-bc-ca)$. Hệ quả: nếu $a+b+c=0$ thì $a^3+b^3+c^3=3abc$.</li>
                  <li><strong>Thêm – bớt hạng tử</strong> để tạo hằng đẳng thức (kĩ thuật Sophie Germain): $a^4+4b^4 = (a^2+2b^2)^2-(2ab)^2 = (a^2-2ab+2b^2)(a^2+2ab+2b^2)$.</li>
                  <li><strong>Nhẩm nghiệm hữu tỉ:</strong> nghiệm nguyên của đa thức hệ số nguyên là ước của hạng tử tự do; tìm được nghiệm $x=r$ thì tách được nhân tử $(x-r)$.</li>
                  <li><strong>Đặt ẩn phụ</strong> và <strong>hệ số bất định</strong> cho đa thức bậc cao.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Phân tích $x^4+4 = x^4+4x^2+4-4x^2 = (x^2+2)^2-(2x)^2 = (x^2-2x+2)(x^2+2x+2)$.</p>
                  <p>2) Phân tích $x^3-7x+6$: nhẩm $x=1$ là nghiệm ⇒ $(x-1)(x^2+x-6) = (x-1)(x-2)(x+3)$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Phân tích $x^4+x^2+1$.</p>
                  <details><summary>Đáp án</summary><p>$(x^2+1)^2-x^2 = (x^2-x+1)(x^2+x+1)$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Cho $a+b+c=0$. Tính $a^3+b^3+c^3$ theo $abc$.</p>
                  <details><summary>Đáp án</summary><p>$a^3+b^3+c^3 = 3abc$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Phân tích $x^3-3x^2+4$.</p>
                  <details><summary>Đáp án</summary><p>Nhẩm $x=-1$: $-1-3+4=0$ ⇒ $(x+1)(x^2-4x+4) = (x+1)(x-2)^2$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 3 — nhẩm nghiệm rồi tách nhân tử):</strong>
                  <ol>
                    <li>Thử các ước của hạng tử tự do $4$: với $x=-1$ ta có $(-1)^3-3(-1)^2+4=-1-3+4=0$ ⇒ $x=-1$ là nghiệm.</li>
                    <li>Suy ra đa thức chia hết cho $(x+1)$. Thực hiện chia: $x^3-3x^2+4=(x+1)(x^2-4x+4)$.</li>
                    <li>Nhận ra tam thức $x^2-4x+4=(x-2)^2$.</li>
                    <li>Kết quả: $x^3-3x^2+4=(x+1)(x-2)^2$.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-toan8-hsg-bdt', title: 'Bất đẳng thức AM–GM (Cauchy) & ứng dụng', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>AM–GM hai số</strong> ($a,b\\ge0$): $a+b \\ge 2\\sqrt{ab}$, dấu "=" khi $a=b$.</li>
                  <li><strong>AM–GM ba số</strong> ($a,b,c\\ge0$): $a+b+c \\ge 3\\sqrt[3]{abc}$.</li>
                  <li><strong>Hệ quả thường dùng:</strong> với $x>0$ thì $x+\\dfrac{1}{x}\\ge2$; $\\dfrac{a}{b}+\\dfrac{b}{a}\\ge2$.</li>
                  <li><strong>Cauchy–Schwarz dạng cộng mẫu (Engel):</strong> $\\dfrac{a^2}{x}+\\dfrac{b^2}{y} \\ge \\dfrac{(a+b)^2}{x+y}$ ($x,y>0$).</li>
                </ul>
                <div class="luuy"><strong>Chú ý:</strong> luôn kiểm tra điều kiện dương và chỉ ra điều kiện xảy ra dấu "=" mới được điểm tối đa.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Cho $a,b>0$. Chứng minh $(a+b)\\left(\\dfrac{1}{a}+\\dfrac{1}{b}\\right)\\ge4$.</p>
                  <p><strong>Giải:</strong> Khai triển $= 2 + \\dfrac{a}{b}+\\dfrac{b}{a} \\ge 2 + 2 = 4$ (AM–GM). Dấu "=" khi $a=b$.</p>
                  <p>2) Tìm GTNN của $f(x)=x+\\dfrac{4}{x}$ với $x>0$.</p>
                  <p><strong>Giải:</strong> $x+\\dfrac{4}{x}\\ge2\\sqrt{4}=4$, dấu "=" khi $x=2$. Vậy $\\min f = 4$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Cho $a,b,c>0$. Chứng minh $\\dfrac{a}{b}+\\dfrac{b}{c}+\\dfrac{c}{a}\\ge3$.</p>
                  <details><summary>Đáp án</summary><p>AM–GM ba số: $\\ge3\\sqrt[3]{\\dfrac{a}{b}\\cdot\\dfrac{b}{c}\\cdot\\dfrac{c}{a}}=3\\sqrt[3]{1}=3$. Dấu "=" khi $a=b=c$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm GTNN của $g(x)=x+\\dfrac{9}{x}$ với $x>0$.</p>
                  <details><summary>Đáp án</summary><p>$\\ge2\\sqrt9=6$, dấu "=" khi $x=3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Cho $x,y>0$ và $x+y=1$. Dùng Engel chứng minh $\\dfrac{1}{x}+\\dfrac{1}{y}\\ge4$.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{1^2}{x}+\\dfrac{1^2}{y}\\ge\\dfrac{(1+1)^2}{x+y}=\\dfrac{4}{1}=4$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 3 — dùng bất đẳng thức Engel):</strong>
                  <ol>
                    <li>Bất đẳng thức Cauchy–Schwarz dạng cộng mẫu (Engel): $\\dfrac{a^2}{x}+\\dfrac{b^2}{y}\\ge\\dfrac{(a+b)^2}{x+y}$.</li>
                    <li>Viết lại $\\dfrac1x=\\dfrac{1^2}{x}$ và $\\dfrac1y=\\dfrac{1^2}{y}$ rồi áp dụng: $\\dfrac1x+\\dfrac1y\\ge\\dfrac{(1+1)^2}{x+y}=\\dfrac{4}{x+y}$.</li>
                    <li>Thay điều kiện $x+y=1$: $\\dfrac1x+\\dfrac1y\\ge\\dfrac{4}{1}=4$.</li>
                    <li>Dấu "=" xảy ra khi $\\dfrac{1}{x}=\\dfrac{1}{y}$, tức $x=y=\\dfrac12$.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-toan8-hsg-sohoc', title: 'Số học: chia hết, đồng dư, nguyên lí Dirichlet', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Đồng dư:</strong> $a\\equiv b\\ (\\text{mod } m)$ nếu $a-b$ chia hết cho $m$; có thể cộng, trừ, nhân hai vế theo cùng modulo.</li>
                  <li><strong>Tích các số nguyên liên tiếp:</strong> tích $k$ số nguyên liên tiếp luôn chia hết cho $k!$ (vd tích 3 số liên tiếp chia hết cho $6$).</li>
                  <li><strong>Nguyên lí Dirichlet (chuồng – thỏ):</strong> nhốt nhiều hơn $n$ vật vào $n$ ngăn thì có ngăn chứa từ $2$ vật trở lên.</li>
                  <li><strong>Phương trình nghiệm nguyên:</strong> thường đưa về dạng tích $(\\,)\\cdot(\\,)=\\text{số}$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Chứng minh $n^3-n$ chia hết cho $6$ với mọi số nguyên $n$.</p>
                  <p><strong>Giải:</strong> $n^3-n=(n-1)n(n+1)$ là tích 3 số nguyên liên tiếp ⇒ chia hết cho cả $2$ và $3$ ⇒ chia hết cho $6$.</p>
                  <p>2) Tìm nghiệm nguyên dương của $xy=x+y$.</p>
                  <p><strong>Giải:</strong> $xy-x-y+1=1 \\Rightarrow (x-1)(y-1)=1 \\Rightarrow x-1=y-1=1 \\Rightarrow x=y=2$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm số dư khi chia $2^{100}$ cho $3$.</p>
                  <details><summary>Đáp án</summary><p>$2\\equiv-1\\ (\\text{mod }3)\\Rightarrow 2^{100}\\equiv(-1)^{100}=1$. Số dư là $1$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Chứng minh trong $3$ số nguyên bất kì luôn có hai số có hiệu chia hết cho $2$.</p>
                  <details><summary>Đáp án</summary><p>Mỗi số chẵn/lẻ ⇒ chỉ có 2 "ngăn" (số dư 0 hoặc 1 khi chia 2). Có 3 số ⇒ theo Dirichlet, hai số cùng tính chẵn lẻ ⇒ hiệu chia hết cho $2$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Tìm nghiệm nguyên dương của $(x-2)(y+1)=5$.</p>
                  <details><summary>Đáp án</summary><p>$5=1\\cdot5=5\\cdot1$ ⇒ $(x-2;y+1)\\in\\{(1;5),(5;1)\\}\\Rightarrow(x;y)\\in\\{(3;4),(7;0)\\}$. Nghiệm nguyên dương: $(3;4)$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 3 — phương trình nghiệm nguyên dạng tích):</strong>
                  <ol>
                    <li>Vì $x,y$ nguyên nên $(x-2)$ và $(y+1)$ là các ước nguyên của $5$.</li>
                    <li>Phân tích $5=1\\cdot5=5\\cdot1$ (chỉ xét ước dương vì cần $x,y$ nguyên dương).</li>
                    <li>TH1: $x-2=1, y+1=5 \\Rightarrow x=3, y=4$ (thỏa). TH2: $x-2=5, y+1=1 \\Rightarrow x=7, y=0$ (loại vì $y>0$).</li>
                    <li>Vậy nghiệm nguyên dương duy nhất là $(x;y)=(3;4)$.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-toan8-hsg-cuctri', title: 'Cực trị đại số (GTLN – GTNN)', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Đưa về bình phương:</strong> $A=(\\text{biểu thức})^2 + k \\ge k$ ⇒ GTNN $=k$; $B=-(\\,)^2+k \\le k$ ⇒ GTLN $=k$.</li>
                  <li><strong>Dùng AM–GM</strong> cho biểu thức có dạng tổng – tích các đại lượng dương.</li>
                  <li>Luôn chỉ rõ giá trị của biến tại đó đạt cực trị.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Tìm GTNN của $A=x^2-4x+7$.</p>
                  <p><strong>Giải:</strong> $A=(x-2)^2+3\\ge3$, dấu "=" khi $x=2$. Vậy $\\min A=3$.</p>
                  <p>2) Tìm GTLN của $B=-x^2+6x-5$.</p>
                  <p><strong>Giải:</strong> $B=-(x-3)^2+4\\le4$, dấu "=" khi $x=3$. Vậy $\\max B=4$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Tìm GTNN của $P=x^2+y^2-2x+4y+10$.</p>
                  <details><summary>Đáp án</summary><p>$P=(x-1)^2+(y+2)^2+5\\ge5$, dấu "=" khi $x=1, y=-2$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm GTLN của $Q=x(10-x)$.</p>
                  <details><summary>Đáp án</summary><p>$Q=-(x-5)^2+25\\le25$, dấu "=" khi $x=5$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Tìm GTNN của $R=x^2+2x+5$.</p>
                  <details><summary>Đáp án</summary><p>$R=(x+1)^2+4\\ge4$, dấu "=" khi $x=-1$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 3 — đưa về bình phương):</strong>
                  <ol>
                    <li>Tách để tạo hằng đẳng thức: $R=x^2+2x+5=(x^2+2x+1)+4$.</li>
                    <li>Viết gọn: $R=(x+1)^2+4$.</li>
                    <li>Vì $(x+1)^2\\ge0$ với mọi $x$ nên $R\\ge4$.</li>
                    <li>Dấu "=" xảy ra khi $(x+1)^2=0\\Leftrightarrow x=-1$. Vậy $\\min R=4$ tại $x=-1$.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-toan8-hsg-hinhhoc', title: 'Hình học nâng cao: phân giác, Ceva – Menelaus', level: 'CHUYEN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('geo')">Hình học động (tam giác) ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Tính chất đường phân giác:</strong> phân giác trong góc $A$ của $\\triangle ABC$ cắt $BC$ tại $D$ thì $\\dfrac{BD}{DC}=\\dfrac{AB}{AC}$.</li>
                  <li><strong>Định lí Ceva:</strong> ba đường $AD, BE, CF$ đồng quy $\\Leftrightarrow \\dfrac{BD}{DC}\\cdot\\dfrac{CE}{EA}\\cdot\\dfrac{AF}{FB}=1$.</li>
                  <li><strong>Định lí Menelaus:</strong> ba điểm thẳng hàng trên ba cạnh (kéo dài) $\\Leftrightarrow \\dfrac{BD}{DC}\\cdot\\dfrac{CE}{EA}\\cdot\\dfrac{AF}{FB}=1$ (theo đoạn thẳng có hướng).</li>
                  <li><strong>Bất đẳng thức tam giác:</strong> $|b-c|<a<b+c$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>$\\triangle ABC$ có $AB=6, AC=4, BC=5$, $AD$ là phân giác trong ($D\\in BC$). Tính $BD, DC$.</p>
                  <p><strong>Giải:</strong> $\\dfrac{BD}{DC}=\\dfrac{AB}{AC}=\\dfrac{6}{4}=\\dfrac{3}{2}$ và $BD+DC=5 \\Rightarrow BD=3, DC=2$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> $\\triangle ABC$ có $AB=8, AC=6, BC=7$, $AD$ phân giác trong. Tính $BD, DC$.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{BD}{DC}=\\dfrac{8}{6}=\\dfrac{4}{3}$, $BD+DC=7\\Rightarrow BD=4, DC=3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Một tam giác có hai cạnh $5$ và $9$. Cạnh thứ ba (số nguyên) nhận giá trị trong khoảng nào?</p>
                  <details><summary>Đáp án</summary><p>$|9-5|<a<9+5 \\Rightarrow 4<a<14$, tức $a\\in\\{5,6,\\dots,13\\}$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Phát biểu điều kiện Ceva để ba đường $AD, BE, CF$ đồng quy.</p>
                  <details><summary>Đáp án</summary><p>$\\dfrac{BD}{DC}\\cdot\\dfrac{CE}{EA}\\cdot\\dfrac{AF}{FB}=1$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 1 — tính chất đường phân giác):</strong>
                  <ol>
                    <li>Theo tính chất đường phân giác trong: $\\dfrac{BD}{DC}=\\dfrac{AB}{AC}=\\dfrac{8}{6}=\\dfrac{4}{3}$.</li>
                    <li>Đặt $BD=4k,\\ DC=3k$ ⇒ $BD+DC=7k$.</li>
                    <li>Mà $BD+DC=BC=7$ ⇒ $7k=7\\Rightarrow k=1$.</li>
                    <li>Vậy $BD=4,\\ DC=3$.</li>
                  </ol>
                </div>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'KHTN8', name: 'KHTN 8 (Lý–Hóa–Sinh)', name_en: 'Science 8 (Phys–Chem–Bio)', grade: 8,
      topics: [
        {
          id: 't-khtn8-hoa', title: 'Hóa học · Mol, bảo toàn khối lượng, nồng độ',
          lessons: [
            {
              id: 'l-khtn8-mol', title: 'Mol và tính toán hóa học', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Mol là lượng chất chứa $N_A \\approx 6{,}022\\cdot10^{23}$ hạt. Các công thức:</p>
                <ul>
                  <li>Số mol: $n = \\dfrac{m}{M}$ (m: khối lượng g, M: khối lượng mol g/mol).</li>
                  <li>Thể tích khí (đktc $0^\\circ C$, 1 atm): $V = 22{,}4\\,n$ (L).</li>
                  <li>Nồng độ phần trăm: $C\\% = \\dfrac{m_{ct}}{m_{dd}}\\cdot100\\%$.</li>
                  <li>Nồng độ mol: $C_M = \\dfrac{n}{V}$ (mol/L).</li>
                </ul>
                <div class="luuy"><strong>Định luật bảo toàn khối lượng:</strong> trong phản ứng hóa học, tổng khối lượng các chất sản phẩm bằng tổng khối lượng các chất tham gia.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tính số mol trong $8$ g NaOH ($M=40$).</p>
                  <p><strong>Giải:</strong> $n = 8/40 = 0{,}2$ mol.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Khối lượng của $0{,}5$ mol $H_2O$ ($M=18$)?</p>
                  <details><summary>Đáp án</summary><p>$m = 0{,}5\\cdot18 = 9$ g.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Số mol trong $11{,}2$ g sắt Fe ($M=56$)?</p>
                  <details><summary>Đáp án</summary><p>$n = 11{,}2/56 = 0{,}2$ mol.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Thể tích (đktc) của $0{,}25$ mol khí $O_2$?</p>
                  <details><summary>Đáp án</summary><p>$V = 22{,}4\\cdot0{,}25 = 5{,}6$ lít.</p></details>
                </div>
              `,
            },
            {
              id: 'l-khtn8-acid', title: 'Acid – Base – Oxide – Muối và thang pH', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Acid</strong>: phân tử có H liên kết gốc acid (HCl, $H_2SO_4$), làm quỳ tím hóa đỏ.</li>
                  <li><strong>Base</strong>: có nhóm $OH$ (NaOH, $Ca(OH)_2$), làm quỳ tím hóa xanh, phenolphtalein hóa hồng.</li>
                  <li><strong>Oxide</strong>: hợp chất của oxi với 1 nguyên tố (oxide acid như $CO_2$, oxide base như $Na_2O$).</li>
                  <li><strong>Muối</strong>: tạo từ kim loại (hoặc $NH_4^+$) và gốc acid (NaCl, $CaCO_3$).</li>
                </ul>
                <div class="luuy"><strong>Thang pH:</strong> pH < 7 môi trường acid, pH = 7 trung tính, pH > 7 môi trường base.</div>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div><p>Dung dịch có pH = 3 ⇒ môi trường acid; pH = 10 ⇒ môi trường base.</p></div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Chất nào làm quỳ tím hóa xanh: HCl hay NaOH?</p>
                  <details><summary>Đáp án</summary><p>NaOH (base).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Dung dịch có $pH = 2$ thuộc môi trường nào?</p>
                  <details><summary>Đáp án</summary><p>$pH < 7$ ⇒ môi trường acid.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> $CO_2$ và $Na_2O$ — chất nào là oxide acid, chất nào là oxide base?</p>
                  <details><summary>Đáp án</summary><p>$CO_2$ là oxide acid; $Na_2O$ là oxide base.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-khtn8-ly', title: 'Vật lí · Khối lượng riêng, áp suất, lực đẩy Archimedes',
          lessons: [
            {
              id: 'l-khtn8-apsuat', title: 'Áp suất – Khối lượng riêng – Lực đẩy Archimedes', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('arch')">Lực đẩy Archimedes (nổi/chìm) ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li>Khối lượng riêng: $D = \\dfrac{m}{V}$ (kg/m³).</li>
                  <li>Áp suất: $p = \\dfrac{F}{S}$ (Pa $= N/m^2$); $F$ là áp lực vuông góc, $S$ là diện tích bị ép.</li>
                  <li>Áp suất chất lỏng: $p = d\\cdot h$ ($d$ trọng lượng riêng, $h$ độ sâu).</li>
                  <li>Lực đẩy Archimedes: $F_A = d\\cdot V$ ($V$ thể tích phần chất lỏng bị vật chiếm chỗ).</li>
                </ul>
                <div class="luuy"><strong>Điều kiện nổi/chìm:</strong> vật nổi khi $F_A > P$, lơ lửng khi $F_A = P$, chìm khi $F_A < P$.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Lực $F=200$ N ép lên diện tích $S=0{,}5\\,m^2$. Áp suất?</p>
                  <p><strong>Giải:</strong> $p = 200/0{,}5 = 400$ Pa.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">🌊 Lực đẩy Archimedes — vật trong nước</div>
                  <svg class="graph" viewBox="0 0 180 140" width="180" height="140" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="40" width="140" height="85" fill="#dbeafe" stroke="#94a3b8"/>
                    <rect x="65" y="62" width="50" height="38" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
                    <line x1="90" y1="62" x2="90" y2="28" stroke="#16a34a" stroke-width="2"/>
                    <polygon points="90,24 86,34 94,34" fill="#16a34a"/>
                    <text x="96" y="36" fill="#16a34a">F_A</text>
                    <line x1="90" y1="100" x2="90" y2="132" stroke="#dc2626" stroke-width="2"/>
                    <polygon points="90,136 86,126 94,126" fill="#dc2626"/>
                    <text x="96" y="124" fill="#dc2626">P</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Vật thể tích $0{,}001\\,m^3$ chìm trong nước ($d=10000\\,N/m^3$). Lực đẩy Archimedes?</p>
                  <details><summary>Đáp án</summary><p>$F_A = 10000\\cdot0{,}001 = 10$ N.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Khối lượng riêng của vật có $m = 234$ g, $V = 30\\,cm^3$?</p>
                  <details><summary>Đáp án</summary><p>$D = 234/30 = 7{,}8$ g/cm³.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Áp suất nước ở độ sâu $5$ m ($d = 10000\\,N/m^3$)?</p>
                  <details><summary>Đáp án</summary><p>$p = d\\cdot h = 10000\\cdot5 = 50000$ Pa.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-khtn8-sinh', title: 'Sinh học · Cơ thể người',
          lessons: [
            {
              id: 'l-khtn8-tieuhoa', title: 'Hệ tiêu hóa, tuần hoàn, hô hấp ở người', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('heart')">Hệ tuần hoàn ▸</button> <button class="lesson-sim-btn" onclick="launchSim('digest')">Hệ tiêu hóa ▸</button> <button class="lesson-sim-btn" onclick="launchSim('lungs')">Hệ hô hấp ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Tiêu hóa:</strong> biến đổi thức ăn thành chất dinh dưỡng cơ thể hấp thụ. Ruột non là nơi hấp thụ chính.</li>
                  <li><strong>Tuần hoàn:</strong> tim 4 ngăn bơm máu; máu vận chuyển $O_2$, dinh dưỡng và thải $CO_2$, chất thải.</li>
                  <li><strong>Hô hấp:</strong> trao đổi khí ở phổi — lấy $O_2$, thải $CO_2$; đơn vị là phế nang.</li>
                </ul>
                <div class="luuy"><strong>Liên hệ:</strong> ba hệ phối hợp cung cấp $O_2$ và dinh dưỡng cho mọi tế bào, đào thải chất cặn bã.</div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Cơ quan nào hấp thụ chất dinh dưỡng chủ yếu?</p>
                  <details><summary>Đáp án</summary><p>Ruột non.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tim người có mấy ngăn?</p>
                  <details><summary>Đáp án</summary><p>4 ngăn (2 tâm nhĩ, 2 tâm thất).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Quá trình trao đổi khí ở phổi diễn ra tại đâu?</p>
                  <details><summary>Đáp án</summary><p>Tại các phế nang.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-khtn8-pthh', title: 'Hóa học · Phản ứng & phương trình hóa học, dung dịch',
          lessons: [
            {
              id: 'l-khtn8-pthh', title: 'Phản ứng hóa học & lập phương trình hóa học', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p><strong>Phản ứng hóa học</strong> là quá trình biến đổi chất này thành chất khác; liên kết giữa các nguyên tử thay đổi, còn số nguyên tử mỗi nguyên tố được bảo toàn.</p>
                <p><strong>Các bước lập phương trình hóa học:</strong></p>
                <ol>
                  <li>Viết sơ đồ phản ứng (công thức chất tham gia → sản phẩm).</li>
                  <li>Cân bằng số nguyên tử mỗi nguyên tố ở hai vế bằng cách thêm hệ số.</li>
                  <li>Viết phương trình hoàn chỉnh.</li>
                </ol>
                <div class="luuy"><strong>Lưu ý:</strong> chỉ được thêm hệ số (đặt trước công thức), <em>không</em> được sửa chỉ số trong công thức hóa học.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Cân bằng: $H_2 + O_2 \\rightarrow H_2O$.</p>
                  <p><strong>Giải:</strong> $2H_2 + O_2 \\rightarrow 2H_2O$ (4 H và 2 O ở mỗi vế).</p>
                  <p>$Fe + O_2 \\rightarrow Fe_2O_3$ ⇒ $4Fe + 3O_2 \\rightarrow 2Fe_2O_3$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Cân bằng $Na + O_2 \\rightarrow Na_2O$.</p>
                  <details><summary>Đáp án</summary><p>$4Na + O_2 \\rightarrow 2Na_2O$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Cân bằng $Al + O_2 \\rightarrow Al_2O_3$.</p>
                  <details><summary>Đáp án</summary><p>$4Al + 3O_2 \\rightarrow 2Al_2O_3$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Đốt $4$ g khí $H_2$ với $32$ g $O_2$ tạo nước. Khối lượng nước thu được (bảo toàn khối lượng)?</p>
                  <details><summary>Đáp án</summary><p>$m_{H_2O} = 4 + 32 = 36$ g.</p></details>
                </div>
              `,
            },
            {
              id: 'l-khtn8-dungdich', title: 'Dung dịch — độ tan, nồng độ, pha chế', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Dung dịch</strong> = chất tan + dung môi. Khối lượng dung dịch $m_{dd} = m_{ct} + m_{dm}$.</li>
                  <li><strong>Độ tan</strong> $S$: số gam chất tan tan tối đa trong $100$ g nước ở nhiệt độ xác định để tạo dung dịch bão hòa.</li>
                  <li><strong>Nồng độ phần trăm:</strong> $C\\% = \\dfrac{m_{ct}}{m_{dd}}\\cdot100\\%$.</li>
                  <li><strong>Nồng độ mol:</strong> $C_M = \\dfrac{n}{V}$ (mol/L).</li>
                </ul>
                <div class="luuy"><strong>Pha chế:</strong> muốn pha dung dịch có $C\\%$ cho trước, tính khối lượng chất tan và nước cần dùng từ công thức trên.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Hòa tan $20$ g đường vào $80$ g nước. Tính $C\\%$.</p>
                  <p><strong>Giải:</strong> $m_{dd} = 100$ g ⇒ $C\\% = \\dfrac{20}{100}\\cdot100\\% = 20\\%$.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Hòa tan $0{,}5$ mol NaCl vào nước được $250$ mL dung dịch. Tính $C_M$.</p>
                  <details><summary>Đáp án</summary><p>$C_M = \\dfrac{0{,}5}{0{,}25} = 2$ mol/L.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Hòa tan $15$ g muối vào $85$ g nước. Tính $C\\%$.</p>
                  <details><summary>Đáp án</summary><p>$m_{dd} = 100$ g ⇒ $C\\% = \\dfrac{15}{100}\\cdot100\\% = 15\\%$.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Cần bao nhiêu gam đường để pha $200$ g dung dịch đường $10\\%$?</p>
                  <details><summary>Đáp án</summary><p>$m_{ct} = \\dfrac{10\\cdot200}{100} = 20$ g.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-khtn8-moment', title: 'Vật lí · Tác dụng làm quay của lực — Đòn bẩy',
          lessons: [
            {
              id: 'l-khtn8-moment', title: 'Moment lực & đòn bẩy', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('lever')">Đòn bẩy cân bằng ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li>Lực tác dụng lên vật có trục quay làm vật <strong>quay</strong>. Tác dụng làm quay phụ thuộc độ lớn lực và khoảng cách từ trục quay đến giá của lực (cánh tay đòn).</li>
                  <li><strong>Moment lực:</strong> $M = F\\cdot d$ ($d$ là cánh tay đòn).</li>
                  <li><strong>Đòn bẩy cân bằng</strong> khi hai moment bằng nhau: $F_1\\cdot d_1 = F_2\\cdot d_2$.</li>
                </ul>
                <div class="luuy"><strong>Ứng dụng:</strong> dùng đòn bẩy để được lợi về lực — đặt vật ở phía cánh tay đòn ngắn, tác dụng lực ở phía cánh tay đòn dài.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Đòn bẩy cân bằng: vật $100$ N đặt cách trục $0{,}2$ m. Cần đặt lực bao nhiêu ở cách trục $0{,}5$ m?</p>
                  <p><strong>Giải:</strong> $F_1 d_1 = F_2 d_2 \\Rightarrow 100\\cdot0{,}2 = F_2\\cdot0{,}5 \\Rightarrow F_2 = 40$ N.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">⚖️ Đòn bẩy cân bằng — $F_1 d_1 = F_2 d_2$</div>
                  <svg class="graph" viewBox="0 0 220 120" width="220" height="120" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="70" x2="200" y2="70" stroke="#4f46e5" stroke-width="3"/>
                    <polygon points="110,70 100,98 120,98" fill="#475569"/>
                    <line x1="60" y1="70" x2="60" y2="38" stroke="#dc2626" stroke-width="2"/>
                    <polygon points="60,34 56,44 64,44" fill="#dc2626"/>
                    <text x="46" y="30" fill="#dc2626">F₁</text>
                    <line x1="170" y1="70" x2="170" y2="44" stroke="#16a34a" stroke-width="2"/>
                    <polygon points="170,40 166,50 174,50" fill="#16a34a"/>
                    <text x="160" y="36" fill="#16a34a">F₂</text>
                    <text x="80" y="88" fill="#475569">d₁</text>
                    <text x="135" y="88" fill="#475569">d₂</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Lực $30$ N có cánh tay đòn $0{,}4$ m. Moment lực?</p>
                  <details><summary>Đáp án</summary><p>$M = 30\\cdot0{,}4 = 12$ N·m.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Đòn bẩy cân bằng: vật $80$ N ở cách trục $0{,}3$ m. Lực cần đặt ở cách trục $0{,}6$ m?</p>
                  <details><summary>Đáp án</summary><p>$F_2 = \\dfrac{80\\cdot0{,}3}{0{,}6} = 40$ N.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Muốn lợi về lực, nên đặt vật ở phía cánh tay đòn dài hay ngắn?</p>
                  <details><summary>Đáp án</summary><p>Phía cánh tay đòn ngắn (tác dụng lực ở phía cánh tay đòn dài).</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-khtn8-dien', title: 'Vật lí · Điện',
          lessons: [
            {
              id: 'l-khtn8-dien', title: 'Dòng điện, cường độ dòng điện, hiệu điện thế', level: 'CO_BAN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('ohm')">Định luật Ohm (mạch điện) ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Dòng điện</strong> là dòng các hạt mang điện chuyển động có hướng. Nguồn điện (pin, ắc quy) duy trì dòng điện trong mạch kín.</li>
                  <li><strong>Cường độ dòng điện</strong> $I$ đo bằng <em>ampe kế</em> (mắc nối tiếp), đơn vị ampe (A).</li>
                  <li><strong>Hiệu điện thế</strong> $U$ đo bằng <em>vôn kế</em> (mắc song song với vật), đơn vị vôn (V).</li>
                  <li><strong>Tác dụng của dòng điện:</strong> nhiệt, phát sáng, từ, hóa học và sinh lí.</li>
                </ul>
                <div class="luuy"><strong>Mạch nối tiếp:</strong> cường độ dòng điện như nhau tại mọi điểm; hiệu điện thế bằng tổng. <strong>Mạch song song:</strong> hiệu điện thế giữa các nhánh bằng nhau; dòng điện mạch chính bằng tổng dòng các nhánh.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Hai bóng đèn mắc nối tiếp, dòng qua đèn 1 là $0{,}3$ A. Dòng qua đèn 2?</p>
                  <p><strong>Giải:</strong> Mạch nối tiếp ⇒ $I$ như nhau ⇒ $0{,}3$ A.</p>
                </div>
                <div class="vd">
                  <div class="vd-title">🔌 Mạch điện kín đơn giản</div>
                  <svg class="graph" viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
                    <rect x="35" y="28" width="130" height="62" fill="none" stroke="#475569" stroke-width="2"/>
                    <circle cx="100" cy="28" r="11" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
                    <line x1="92" y1="20" x2="108" y2="36" stroke="#f59e0b"/>
                    <line x1="108" y1="20" x2="92" y2="36" stroke="#f59e0b"/>
                    <text x="116" y="24" fill="#475569">Đèn</text>
                    <line x1="88" y1="90" x2="88" y2="78" stroke="#dc2626" stroke-width="4"/>
                    <line x1="100" y1="94" x2="100" y2="74" stroke="#dc2626" stroke-width="2"/>
                    <text x="106" y="108" fill="#dc2626">Nguồn (pin)</text>
                    <text x="38" y="108" fill="#475569">mạch kín</text>
                  </svg>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Mạch song song hai nhánh có dòng $0{,}2$ A và $0{,}5$ A. Dòng điện mạch chính?</p>
                  <details><summary>Đáp án</summary><p>$I = 0{,}2 + 0{,}5 = 0{,}7$ A.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Dụng cụ đo cường độ dòng điện tên là gì và mắc như thế nào?</p>
                  <details><summary>Đáp án</summary><p>Ampe kế, mắc nối tiếp với vật cần đo.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Trong mạch nối tiếp, hiệu điện thế hai đèn lần lượt là $3$ V và $6$ V. Hiệu điện thế toàn mạch?</p>
                  <details><summary>Đáp án</summary><p>$U = 3 + 6 = 9$ V.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-khtn8-nhiet', title: 'Vật lí · Nhiệt',
          lessons: [
            {
              id: 'l-khtn8-nhiet', title: 'Năng lượng nhiệt, truyền nhiệt & sự nở vì nhiệt', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Năng lượng nhiệt (nhiệt năng)</strong> của vật là tổng động năng của các phân tử cấu tạo nên vật; nhiệt độ càng cao thì phân tử chuyển động càng nhanh.</li>
                  <li><strong>Ba hình thức truyền nhiệt:</strong> dẫn nhiệt (chủ yếu ở chất rắn — kim loại dẫn nhiệt tốt), đối lưu (ở chất lỏng và chất khí), bức xạ nhiệt (truyền qua cả chân không, ví dụ nhiệt Mặt Trời).</li>
                  <li><strong>Sự nở vì nhiệt:</strong> hầu hết các chất nở ra khi nóng lên, co lại khi lạnh đi. Chất khí nở nhiều hơn chất lỏng, chất lỏng nở nhiều hơn chất rắn.</li>
                </ul>
                <div class="luuy"><strong>Ứng dụng & lưu ý:</strong> để khe hở ở đường ray, cầu thép; nung nóng vòng kim loại để lắp khít; nhiệt luôn truyền từ vật nóng hơn sang vật lạnh hơn cho đến khi cân bằng nhiệt.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ</div>
                  <p>Cầm thìa kim loại nhúng trong nước nóng thấy nóng tay — đó là hiện tượng <strong>dẫn nhiệt</strong>. Nước trong ấm sôi nóng đều nhờ <strong>đối lưu</strong>. Đứng gần lửa thấy nóng là do <strong>bức xạ nhiệt</strong>.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Hình thức truyền nhiệt nào xảy ra được trong chân không?</p>
                  <details><summary>Đáp án</summary><p>Bức xạ nhiệt.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Hình thức truyền nhiệt chủ yếu trong chất lỏng và chất khí là gì?</p>
                  <details><summary>Đáp án</summary><p>Đối lưu.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Chất nào nở vì nhiệt nhiều nhất: rắn, lỏng hay khí?</p>
                  <details><summary>Đáp án</summary><p>Chất khí.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-khtn8-cothenguoi2', title: 'Sinh học · Bài tiết, thần kinh, nội tiết, vận động',
          lessons: [
            {
              id: 'l-khtn8-vandong', title: 'Hệ vận động — xương và cơ', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Bộ xương</strong> nâng đỡ, bảo vệ cơ thể và là chỗ bám cho cơ. Xương gồm chất hữu cơ (đàn hồi) và chất khoáng (canxi — cứng chắc).</li>
                  <li><strong>Khớp:</strong> khớp động (vai, gối), khớp bán động (cột sống), khớp bất động (hộp sọ).</li>
                  <li><strong>Cơ</strong> bám vào xương; khi co làm xương cử động, tạo nên vận động.</li>
                </ul>
                <div class="luuy"><strong>Bảo vệ:</strong> ngồi học đúng tư thế, mang vác cân đối để tránh cong vẹo cột sống; bổ sung canxi và vitamin D cho xương chắc khỏe.</div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Khớp ở hộp sọ thuộc loại khớp nào?</p>
                  <details><summary>Đáp án</summary><p>Khớp bất động.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Khớp ở khuỷu tay, đầu gối thuộc loại khớp nào?</p>
                  <details><summary>Đáp án</summary><p>Khớp động.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Thành phần nào làm cho xương cứng chắc?</p>
                  <details><summary>Đáp án</summary><p>Chất khoáng (chủ yếu là canxi).</p></details>
                </div>
              `,
            },
            {
              id: 'l-khtn8-baitiet', title: 'Hệ bài tiết — thận và nước tiểu', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Bài tiết</strong> giúp loại bỏ chất thải và giữ ổn định môi trường trong cơ thể. Cơ quan bài tiết chính là thận; ngoài ra còn có da (mồ hôi) và phổi ($CO_2$).</li>
                  <li><strong>Đơn vị chức năng của thận</strong> là đơn vị thận (nephron) — nơi lọc máu tạo nước tiểu.</li>
                  <li>Đường dẫn: thận → ống dẫn nước tiểu → bóng đái → ống đái.</li>
                </ul>
                <div class="luuy"><strong>Giữ gìn:</strong> uống đủ nước, không nhịn tiểu, ăn uống hợp vệ sinh để bảo vệ thận và đường tiết niệu.</div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Đơn vị chức năng lọc máu của thận tên là gì?</p>
                  <details><summary>Đáp án</summary><p>Đơn vị thận (nephron).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Ngoài thận, cơ quan nào cũng tham gia bài tiết (qua mồ hôi, qua khí $CO_2$)?</p>
                  <details><summary>Đáp án</summary><p>Da (mồ hôi) và phổi ($CO_2$).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Nêu đúng thứ tự đường dẫn nước tiểu.</p>
                  <details><summary>Đáp án</summary><p>Thận → ống dẫn nước tiểu → bóng đái → ống đái.</p></details>
                </div>
              `,
            },
            {
              id: 'l-khtn8-thankinh', title: 'Hệ thần kinh & các giác quan', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Hệ thần kinh</strong> điều khiển, điều hòa và phối hợp hoạt động các cơ quan. Gồm <em>thần kinh trung ương</em> (não bộ và tủy sống) và <em>thần kinh ngoại biên</em> (các dây thần kinh, hạch).</li>
                  <li>Đơn vị cấu tạo là <strong>nơron</strong> (tế bào thần kinh).</li>
                  <li><strong>Giác quan:</strong> mắt (thị giác), tai (thính giác và giữ thăng bằng), mũi (khứu giác), lưỡi (vị giác), da (xúc giác).</li>
                </ul>
                <div class="luuy"><strong>Bảo vệ:</strong> ngủ đủ giấc, học tập – nghỉ ngơi hợp lí; giữ vệ sinh mắt, đeo kính đúng độ; tránh tiếng ồn lớn để bảo vệ tai.</div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Hệ thần kinh trung ương gồm những bộ phận nào?</p>
                  <details><summary>Đáp án</summary><p>Não bộ và tủy sống.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Đơn vị cấu tạo của hệ thần kinh tên là gì?</p>
                  <details><summary>Đáp án</summary><p>Nơron (tế bào thần kinh).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Cơ quan nào đảm nhận thị giác? Cơ quan nào vừa giúp nghe vừa giữ thăng bằng?</p>
                  <details><summary>Đáp án</summary><p>Mắt (thị giác); tai (thính giác và thăng bằng).</p></details>
                </div>
              `,
            },
            {
              id: 'l-khtn8-noitiet', title: 'Hệ nội tiết & da điều hòa thân nhiệt', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Tuyến nội tiết</strong> tiết ra <em>hormone</em> đổ thẳng vào máu để điều hòa các quá trình sống. Một số tuyến: tuyến yên, tuyến giáp, tuyến tụy, tuyến trên thận.</li>
                  <li>Ví dụ: tuyến tụy tiết <em>insulin</em> điều hòa lượng đường trong máu; tuyến giáp tiết hormone điều hòa trao đổi chất.</li>
                  <li><strong>Da & điều hòa thân nhiệt:</strong> khi nóng, mạch máu dưới da giãn và tuyến mồ hôi tiết mồ hôi để tỏa nhiệt; khi lạnh, mạch co lại và cơ run để sinh nhiệt, giữ thân nhiệt ổn định khoảng $37^\\circ C$.</li>
                </ul>
                <div class="luuy"><strong>Phân biệt:</strong> tuyến nội tiết đổ chất tiết vào máu (không có ống dẫn); tuyến ngoại tiết (mồ hôi, nước bọt) có ống dẫn ra ngoài.</div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Hormone nào điều hòa lượng đường trong máu, do tuyến tụy tiết ra?</p>
                  <details><summary>Đáp án</summary><p>Insulin.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Khi trời nóng, cơ thể tỏa nhiệt bằng cách nào?</p>
                  <details><summary>Đáp án</summary><p>Mạch máu dưới da giãn ra và tuyến mồ hôi tiết mồ hôi để tỏa nhiệt.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Phân biệt tuyến nội tiết và tuyến ngoại tiết.</p>
                  <details><summary>Đáp án</summary><p>Tuyến nội tiết đổ hormone thẳng vào máu (không ống dẫn); tuyến ngoại tiết có ống dẫn chất tiết ra ngoài (mồ hôi, nước bọt).</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-khtn8-hsg', title: '🏆 Chuyên đề · Bồi dưỡng HSG KHTN 8',
          lessons: [
            {
              id: 'l-khtn8-hsg-hoa', title: 'Hóa nâng cao: bài toán hỗn hợp, hiệu suất, biện luận', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi — phương pháp giải</h2>
                <ul>
                  <li><strong>Bảo toàn khối lượng & bảo toàn nguyên tố</strong> để lập phương trình nhanh.</li>
                  <li><strong>Hỗn hợp nhiều chất:</strong> đặt số mol mỗi chất là ẩn, lập hệ phương trình từ khối lượng và thể tích khí.</li>
                  <li><strong>Hiệu suất phản ứng:</strong> $H = \\dfrac{\\text{lượng thực tế}}{\\text{lượng lí thuyết}}\\cdot100\\%$.</li>
                  <li><strong>Biện luận theo hóa trị/khối lượng mol</strong> để xác định kim loại chưa biết.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Cho $13$ g kẽm Zn tác dụng hết với HCl dư: $Zn + 2HCl \\to ZnCl_2 + H_2$. Tính thể tích $H_2$ (đktc).</p>
                  <p><strong>Giải:</strong> $n_{Zn}=\\dfrac{13}{65}=0{,}2$ mol $\\Rightarrow n_{H_2}=0{,}2 \\Rightarrow V=0{,}2\\cdot22{,}4=4{,}48$ lít.</p>
                  <p>2) Nung $100$ g $CaCO_3$ ($M=100$) với hiệu suất $80\\%$: $CaCO_3 \\to CaO + CO_2$. Tính khối lượng CaO.</p>
                  <p><strong>Giải:</strong> $n=1$ mol ⇒ lí thuyết $1$ mol CaO $=56$ g; thực tế $56\\cdot0{,}8=44{,}8$ g.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Đốt cháy hoàn toàn $6{,}4$ g Cu trong $O_2$: $2Cu+O_2\\to2CuO$. Tính khối lượng CuO.</p>
                  <details><summary>Đáp án</summary><p>$n_{Cu}=6{,}4/64=0{,}1 \\Rightarrow n_{CuO}=0{,}1 \\Rightarrow m=0{,}1\\cdot80=8$ g.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Kim loại M hóa trị II, $0{,}1$ mol nặng $5{,}6$ g. Xác định M.</p>
                  <details><summary>Đáp án</summary><p>$M=\\dfrac{5{,}6}{0{,}1}=56 \\Rightarrow$ sắt (Fe).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Một phản ứng theo lí thuyết tạo $1$ mol sản phẩm nhưng thực tế chỉ thu $0{,}75$ mol. Tính hiệu suất.</p>
                  <details><summary>Đáp án</summary><p>$H=\\dfrac{0{,}75}{1}\\cdot100\\%=75\\%$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 1 — đốt cháy đồng):</strong>
                  <ol>
                    <li>Tính số mol Cu: $n_{Cu}=\\dfrac{6{,}4}{64}=0{,}1$ mol.</li>
                    <li>Phương trình $2Cu+O_2\\to 2CuO$ cho tỉ lệ $Cu:CuO=1:1$ ⇒ $n_{CuO}=0{,}1$ mol.</li>
                    <li>Khối lượng mol $CuO=64+16=80$.</li>
                    <li>Khối lượng CuO: $m=0{,}1\\cdot80=8$ g.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-khtn8-hsg-ly', title: 'Lý nâng cao: máy thủy lực, nhiệt lượng & cân bằng nhiệt', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Nguyên lí Pascal – máy thủy lực:</strong> $\\dfrac{F_1}{S_1}=\\dfrac{F_2}{S_2} \\Rightarrow F_2=F_1\\cdot\\dfrac{S_2}{S_1}$ (lợi về lực theo tỉ số tiết diện).</li>
                  <li><strong>Nhiệt lượng:</strong> $Q = m\\cdot c\\cdot\\Delta t$ ($c$ là nhiệt dung riêng, nước $c=4200$ J/kg·K).</li>
                  <li><strong>Phương trình cân bằng nhiệt:</strong> $Q_{\\text{tỏa}} = Q_{\\text{thu}}$.</li>
                  <li><strong>Công suất & hiệu suất:</strong> $P=\\dfrac{A}{t}$; $H=\\dfrac{A_{\\text{ích}}}{A_{\\text{toàn phần}}}\\cdot100\\%$.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>1) Máy thủy lực có $S_1=0{,}01\\,m^2$, $S_2=0{,}1\\,m^2$, lực tác dụng $F_1=100$ N. Tính $F_2$.</p>
                  <p><strong>Giải:</strong> $F_2=F_1\\cdot\\dfrac{S_2}{S_1}=100\\cdot\\dfrac{0{,}1}{0{,}01}=1000$ N.</p>
                  <p>2) Tính nhiệt lượng để đun $2$ kg nước từ $25^\\circ C$ lên $75^\\circ C$ ($c=4200$).</p>
                  <p><strong>Giải:</strong> $Q=m c\\,\\Delta t = 2\\cdot4200\\cdot50 = 420000$ J $=420$ kJ.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Đun $1{,}5$ kg nước tăng thêm $40^\\circ C$ ($c=4200$). Tính nhiệt lượng.</p>
                  <details><summary>Đáp án</summary><p>$Q=1{,}5\\cdot4200\\cdot40=252000$ J $=252$ kJ.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Máy thủy lực có tiết diện pittông lớn gấp $20$ lần pittông nhỏ. Tác dụng $F_1=50$ N thì nâng được lực bao nhiêu?</p>
                  <details><summary>Đáp án</summary><p>$F_2=50\\cdot20=1000$ N.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Một máy nâng cần công có ích $800$ J nhưng tiêu tốn $1000$ J. Tính hiệu suất.</p>
                  <details><summary>Đáp án</summary><p>$H=\\dfrac{800}{1000}\\cdot100\\%=80\\%$.</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 1 — nhiệt lượng thu vào):</strong>
                  <ol>
                    <li>Công thức nhiệt lượng: $Q=m\\cdot c\\cdot\\Delta t$.</li>
                    <li>Thay $m=1{,}5$ kg, $c=4200$ J/kg·K, $\\Delta t=40^\\circ C$.</li>
                    <li>$Q=1{,}5\\cdot4200\\cdot40=252000$ J $=252$ kJ.</li>
                  </ol>
                </div>
              `,
            },
            {
              id: 'l-khtn8-hsg-sinh', title: 'Sinh nâng cao: vận dụng sinh lí người', level: 'CHUYEN',
              html: `
                <div class="lesson-sim-cta">🔬 <strong>Mô phỏng minh hoạ:</strong> <button class="lesson-sim-btn" onclick="launchSim('heart')">Hệ tuần hoàn (lưu lượng tim) ▸</button></div>
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Lưu lượng tim:</strong> (thể tích tâm thu) × (nhịp tim) = lượng máu tim bơm mỗi phút.</li>
                  <li><strong>Cân bằng nội môi:</strong> cơ thể giữ ổn định nhiệt độ, đường huyết, pH máu nhờ phối hợp thần kinh – nội tiết.</li>
                  <li><strong>Miễn dịch:</strong> bạch cầu bảo vệ cơ thể; vaccine tạo miễn dịch chủ động.</li>
                  <li>Kĩ năng HSG: giải thích cơ chế và tính toán dựa trên số liệu sinh lí.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Tim đập $75$ lần/phút, mỗi lần bơm $70$ mL máu. Tính lượng máu tim bơm trong $1$ phút.</p>
                  <p><strong>Giải:</strong> $75\\times70 = 5250$ mL $\\approx 5{,}25$ lít/phút.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Nhịp tim $80$ lần/phút, thể tích tâm thu $60$ mL. Tính lưu lượng tim mỗi phút.</p>
                  <details><summary>Đáp án</summary><p>$80\\times60=4800$ mL $=4{,}8$ lít/phút.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Vì sao người mất nhiều máu lại nguy hiểm đến tính mạng?</p>
                  <details><summary>Đáp án</summary><p>Giảm lượng máu ⇒ giảm vận chuyển $O_2$ và dinh dưỡng tới tế bào, tụt huyết áp, có thể gây sốc và tử vong.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Tiêm vaccine giúp cơ thể tạo loại miễn dịch nào?</p>
                  <details><summary>Đáp án</summary><p>Miễn dịch chủ động (cơ thể tự sinh kháng thể nhờ kháng nguyên trong vaccine).</p></details>
                </div>
                <div class="luuy"><strong>💡 Lời giải chi tiết (Bài 1 — lưu lượng tim):</strong>
                  <ol>
                    <li>Lưu lượng tim mỗi phút = (thể tích tâm thu) × (nhịp tim).</li>
                    <li>Thay số: $60$ mL $\\times\\ 80$ lần/phút.</li>
                    <li>$=4800$ mL $=4{,}8$ lít/phút.</li>
                  </ol>
                </div>
              `,
            },
          ],
        },
      ],
    },

    {
      code: 'ANH8', name: 'Tiếng Anh 8', name_en: 'English 8', grade: 8,
      topics: [
        {
          id: 't-anh8-grammar', title: 'Grammar · Thì, so sánh, câu điều kiện',
          lessons: [
            {
              id: 'l-anh8-tenses', title: 'Các thì cơ bản & câu so sánh', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Present simple:</strong> thói quen — S + V(s/es). <em>She works every day.</em></li>
                  <li><strong>Present continuous:</strong> đang xảy ra — S + am/is/are + V-ing. <em>They are playing.</em></li>
                  <li><strong>Past simple:</strong> quá khứ — S + V2/ed. <em>We visited Hue last year.</em></li>
                  <li><strong>Present perfect:</strong> S + have/has + V3. <em>I have finished.</em></li>
                  <li><strong>So sánh hơn:</strong> tính từ ngắn + -er + than; dài: more + adj + than.</li>
                  <li><strong>So sánh nhất:</strong> the + adj-est / the most + adj.</li>
                </ul>
                <div class="luuy"><strong>Câu điều kiện loại 1:</strong> If + present simple, S + will + V. <em>If it rains, we will stay home.</em></div>
                <div class="vd"><div class="vd-title">📝 Ví dụ</div><p>"Tall" → taller → the tallest. "Beautiful" → more beautiful → the most beautiful.</p></div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Đổi sang so sánh hơn: "This book is (interesting) than that one."</p>
                  <details><summary>Đáp án</summary><p>more interesting.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Chia động từ: "She (watch) TV now."</p>
                  <details><summary>Đáp án</summary><p>is watching (present continuous).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> So sánh nhất: "Everest is the (high) mountain in the world."</p>
                  <details><summary>Đáp án</summary><p>the highest.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-anh8-vocab', title: 'Vocabulary · Chủ đề lớp 8',
          lessons: [
            {
              id: 'l-anh8-vocab', title: 'Từ vựng theo chủ đề (leisure, environment, science)', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Một số chủ đề từ vựng quan trọng lớp 8:</p>
                <ul>
                  <li><strong>Leisure activities:</strong> hang out, do DIY, make crafts, play games.</li>
                  <li><strong>Life in the countryside:</strong> harvest, herd, paddy field, peaceful.</li>
                  <li><strong>Environment:</strong> pollution, recycle, reduce, reuse, deforestation.</li>
                  <li><strong>Science & technology:</strong> invention, device, robot, explore.</li>
                </ul>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Từ trái nghĩa của "pollute the environment" theo hướng tích cực?</p>
                  <details><summary>Đáp án</summary><p>protect / clean up the environment.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Điền 3R về môi trường (reduce, ____, ____).</p>
                  <details><summary>Đáp án</summary><p>reuse, recycle.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Từ tiếng Anh chỉ "nạn phá rừng" là gì?</p>
                  <details><summary>Đáp án</summary><p>deforestation.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-anh8-modals-passive', title: 'Grammar · Modal verbs & câu bị động',
          lessons: [
            {
              id: 'l-anh8-modals', title: 'Modal verbs (must, have to, should, can…)', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Động từ khuyết thiếu (modals) + V (nguyên thể không "to"):</p>
                <ul>
                  <li><strong>can / could:</strong> khả năng, xin phép. <em>She can swim. Could you help me?</em></li>
                  <li><strong>must:</strong> bắt buộc (do người nói), <strong>mustn't:</strong> cấm. <em>You must wear a helmet. You mustn't smoke here.</em></li>
                  <li><strong>have to:</strong> bắt buộc do hoàn cảnh/quy định; <strong>don't have to:</strong> không cần thiết. <em>I have to study. You don't have to come.</em></li>
                  <li><strong>should / ought to:</strong> lời khuyên. <em>You should rest.</em></li>
                </ul>
                <div class="luuy"><strong>Phân biệt:</strong> <em>mustn't</em> = bị cấm (không được làm); <em>don't have to</em> = không bắt buộc (làm hay không tùy ý).</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ</div>
                  <p>It's raining. You <strong>should</strong> take an umbrella. — Students <strong>must</strong> be quiet in the library.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Điền modal chỉ lời khuyên: "You ____ see a doctor."</p>
                  <details><summary>Đáp án</summary><p>should (hoặc ought to).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Điền modal chỉ điều cấm: "You ____ smoke in the hospital."</p>
                  <details><summary>Đáp án</summary><p>mustn't.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Chọn đúng: "It's Sunday, so I ____ (don't have to / mustn't) go to school."</p>
                  <details><summary>Đáp án</summary><p>don't have to (không bắt buộc).</p></details>
                </div>
              `,
            },
            {
              id: 'l-anh8-passive', title: 'Câu bị động (Passive voice)', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <p>Câu bị động nhấn mạnh đối tượng chịu tác động: <strong>be + V3/V-ed</strong> (chia "be" theo thì).</p>
                <ul>
                  <li><strong>Hiện tại đơn:</strong> am/is/are + V3. <em>English is spoken here.</em></li>
                  <li><strong>Quá khứ đơn:</strong> was/were + V3. <em>The house was built in 1990.</em></li>
                  <li>Tác nhân (nếu cần) thêm <strong>by</strong> + ... <em>The cake was made by my mother.</em></li>
                </ul>
                <div class="luuy"><strong>Cách đổi:</strong> tân ngữ câu chủ động → chủ ngữ câu bị động; động từ → "be + V3"; chủ ngữ cũ → "by + ...".</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ</div>
                  <p>Active: They clean the room every day. → Passive: The room <strong>is cleaned</strong> every day.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Chuyển sang bị động: "Shakespeare wrote this play."</p>
                  <details><summary>Đáp án</summary><p>This play was written by Shakespeare.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Chuyển sang bị động: "They build houses every year."</p>
                  <details><summary>Đáp án</summary><p>Houses are built every year.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Chuyển sang bị động: "Someone stole my bike."</p>
                  <details><summary>Đáp án</summary><p>My bike was stolen.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-anh8-clauses-tenses', title: 'Grammar · Mệnh đề quan hệ, quá khứ tiếp diễn, tường thuật',
          lessons: [
            {
              id: 'l-anh8-relative', title: 'Mệnh đề quan hệ (Relative clauses)', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <p>Đại từ quan hệ nối mệnh đề bổ nghĩa cho danh từ:</p>
                <ul>
                  <li><strong>who</strong> — chỉ người. <em>The man who lives here is kind.</em></li>
                  <li><strong>which</strong> — chỉ vật. <em>The book which I read…</em></li>
                  <li><strong>that</strong> — chỉ người hoặc vật (thay who/which).</li>
                  <li><strong>whose</strong> — chỉ sở hữu. <em>The girl whose father is a doctor.</em></li>
                  <li><strong>where</strong> — chỉ nơi chốn; <strong>when</strong> — chỉ thời gian.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ</div>
                  <p>This is the school <strong>where</strong> I study. — That's the boy <strong>whose</strong> bike was stolen.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Điền đại từ quan hệ: "The woman ____ is talking to him is my teacher."</p>
                  <details><summary>Đáp án</summary><p>who (hoặc that).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Điền: "This is the house ____ I was born."</p>
                  <details><summary>Đáp án</summary><p>where (chỉ nơi chốn).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Điền: "I know a boy ____ sister is a famous singer."</p>
                  <details><summary>Đáp án</summary><p>whose (chỉ sở hữu).</p></details>
                </div>
              `,
            },
            {
              id: 'l-anh8-pastcont', title: 'Quá khứ tiếp diễn & câu tường thuật (intro)', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Quá khứ tiếp diễn:</strong> was/were + V-ing — hành động đang diễn ra tại một thời điểm trong quá khứ. Thường đi với <em>when/while</em>. <em>While I was cooking, the phone rang.</em></li>
                  <li><strong>Câu tường thuật (reported speech):</strong> thuật lại lời người khác, thường lùi một thì và đổi đại từ. <em>"I am tired," she said.</em> → She said (that) she <strong>was</strong> tired.</li>
                </ul>
                <div class="luuy"><strong>Lùi thì cơ bản:</strong> present simple → past simple; present continuous → past continuous; will → would; can → could.</div>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ</div>
                  <p>"I will call you," he said. → He said he <strong>would</strong> call me.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Đổi sang tường thuật: "I am hungry," Tom said.</p>
                  <details><summary>Đáp án</summary><p>Tom said (that) he was hungry.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Chia quá khứ tiếp diễn: "While she ____ (read), the lights went out."</p>
                  <details><summary>Đáp án</summary><p>was reading.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Đổi sang tường thuật: "I will help you," he said.</p>
                  <details><summary>Đáp án</summary><p>He said (that) he would help me.</p></details>
                </div>
              `,
            },
            {
              id: 'l-anh8-gerund', title: 'Gerunds & to-infinitives', level: 'NANG_CAO',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>V-ing (gerund)</strong> theo sau: enjoy, like, love, hate, avoid, finish, mind, practise. <em>I enjoy reading.</em></li>
                  <li><strong>to + V (to-infinitive)</strong> theo sau: want, decide, hope, plan, would like, need, agree. <em>She wants to go.</em></li>
                  <li>Một số động từ dùng được cả hai (like, love, start) với nghĩa gần nhau.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ</div>
                  <p>They <strong>decided to travel</strong> abroad. — He <strong>avoids eating</strong> fast food.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Chia đúng dạng: "I hope ____ (see) you soon."</p>
                  <details><summary>Đáp án</summary><p>to see.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Chia đúng dạng: "She enjoys ____ (read) books."</p>
                  <details><summary>Đáp án</summary><p>reading (sau enjoy dùng V-ing).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Chia đúng dạng: "They decided ____ (travel) to Da Nang."</p>
                  <details><summary>Đáp án</summary><p>to travel (sau decide dùng to-V).</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-anh8-vocab-units', title: 'Vocabulary · 12 chủ đề lớp 8 (Global Success)',
          lessons: [
            {
              id: 'l-anh8-vocab-units', title: 'Từ vựng theo 12 chủ đề chương trình', level: 'CO_BAN',
              html: `
                <h2>Cốt lõi</h2>
                <p>Các chủ đề từ vựng trọng tâm Tiếng Anh 8:</p>
                <ul>
                  <li><strong>1. Leisure activities:</strong> hang out, do DIY, make crafts, socialise.</li>
                  <li><strong>2. Life in the countryside:</strong> harvest, herd buffaloes, paddy field, peaceful.</li>
                  <li><strong>3. Teenagers:</strong> generation gap, hobby, confident, get changed.</li>
                  <li><strong>4. Ethnic groups of Viet Nam:</strong> ethnic minority, costume, terraced fields, stilt house.</li>
                  <li><strong>5. Customs and traditions:</strong> custom, tradition, table manners, worship.</li>
                  <li><strong>6. Lifestyles:</strong> healthy, modern, traditional, balanced diet.</li>
                  <li><strong>7. Environmental protection:</strong> pollution, recycle, reduce, reuse, deforestation.</li>
                  <li><strong>8. Shopping:</strong> shopping centre, customer, discount, online shopping.</li>
                  <li><strong>9. Natural disasters:</strong> earthquake, flood, drought, typhoon, erupt.</li>
                  <li><strong>10. Communication in the future:</strong> video call, smart device, instant message.</li>
                  <li><strong>11. Science and technology:</strong> invention, robot, device, explore.</li>
                  <li><strong>12. Life on other planets:</strong> planet, alien, spacecraft, gravity.</li>
                </ul>
                <div class="luuy"><strong>Synonym/Antonym thường gặp:</strong> big = large; happy = glad; expensive ↔ cheap; many ↔ few; protect ↔ destroy.</div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Từ chỉ thiên tai "động đất" trong tiếng Anh là gì?</p>
                  <details><summary>Đáp án</summary><p>earthquake.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Tìm synonym của "big" và antonym của "expensive".</p>
                  <details><summary>Đáp án</summary><p>big = large; expensive ↔ cheap.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Chủ đề Unit nói về "ethnic groups" liên quan đến từ nào: costume hay discount?</p>
                  <details><summary>Đáp án</summary><p>costume (trang phục) — thuộc chủ đề các dân tộc.</p></details>
                </div>
              `,
            },
          ],
        },
        {
          id: 't-anh8-hsg', title: '🏆 Chuyên đề · Bồi dưỡng HSG Tiếng Anh 8',
          lessons: [
            {
              id: 'l-anh8-hsg-grammar', title: 'Advanced grammar: conditionals, inversion, cleft', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Conditional type 2</strong> (giả định không có thật ở hiện tại): If + past simple, S + would/could + V. <em>If I were you, I would study harder.</em></li>
                  <li><strong>Conditional type 3</strong> (giả định trái với quá khứ): If + past perfect, S + would have + V3. <em>If I had known, I would have helped you.</em></li>
                  <li><strong>Mixed conditional:</strong> If + past perfect, S + would + V (kết quả ở hiện tại). <em>If I had studied medicine, I would be a doctor now.</em></li>
                  <li><strong>Đảo ngữ câu điều kiện:</strong> <em>Were I you…</em> (= If I were you), <em>Had I known…</em> (= If I had known).</li>
                  <li><strong>Cleft sentences</strong> (câu chẻ nhấn mạnh): <em>It was Lan that/who broke the vase.</em> / <em>What I need is a rest.</em></li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Đổi sang đảo ngữ: "If she had come earlier, she would have met him." → <strong>Had she come earlier</strong>, she would have met him.</p>
                  <p>Nhấn mạnh chủ ngữ: "Minh won the prize." → <strong>It was Minh who won the prize.</strong></p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Chia đúng: "If I ____ (be) rich, I would travel the world."</p>
                  <details><summary>Đáp án</summary><p>were (điều kiện loại 2).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Chia đúng: "If they had left earlier, they ____ (not miss) the train."</p>
                  <details><summary>Đáp án</summary><p>wouldn't have missed (điều kiện loại 3).</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Viết lại dùng đảo ngữ: "If I were the manager, I would change the plan."</p>
                  <details><summary>Đáp án</summary><p>Were I the manager, I would change the plan.</p></details>
                </div>
              `,
            },
            {
              id: 'l-anh8-hsg-wordform', title: 'Word formation, collocations & phrasal verbs', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi</h2>
                <ul>
                  <li><strong>Hậu tố tạo từ loại:</strong> danh từ <em>-tion, -ment, -ness, -ity</em>; tính từ <em>-ful, -less, -ous, -al</em>; trạng từ <em>-ly</em>; động từ <em>-ize, -en</em>.</li>
                  <li><strong>Tiền tố phủ định/đổi nghĩa:</strong> <em>un-, in-/im-/ir-, dis-, mis-, re-</em>. <em>care → careful → carefully → careless</em>.</li>
                  <li><strong>Collocations</strong> (cụm từ đi với nhau): <em>make a decision, do homework, heavy rain, take part in</em>.</li>
                  <li><strong>Phrasal verbs</strong> chủ đề lớp 8: <em>hang out, look after, give up, turn off, find out, set up</em>.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Điền dạng đúng: "Air ____ (pollute) is a serious problem." → <strong>pollution</strong> (danh từ).</p>
                  <p>Collocation: "We must ____ a decision soon." → <strong>make</strong> a decision.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Cho dạng đúng: "She solved the problem ____ (success)."</p>
                  <details><summary>Đáp án</summary><p>successfully (trạng từ).</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Điền phrasal verb: "Please ____ the lights before going out." (tắt)</p>
                  <details><summary>Đáp án</summary><p>turn off.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Chọn collocation đúng: "do / make homework"?</p>
                  <details><summary>Đáp án</summary><p>do homework.</p></details>
                </div>
              `,
            },
            {
              id: 'l-anh8-hsg-transform', title: 'Sentence transformation & error identification', level: 'CHUYEN',
              html: `
                <h2>Cốt lõi — dạng bài thi HSG</h2>
                <ul>
                  <li><strong>too … to / enough:</strong> "too short to reach" = "not tall enough to reach".</li>
                  <li><strong>since / for + present perfect:</strong> "started 2 hours ago" = "has + V3 … for 2 hours".</li>
                  <li><strong>so / such … that:</strong> "so + adj/adv + that"; "such + (a/an) + adj + noun + that".</li>
                  <li><strong>Error identification:</strong> thường lỗi về sự hòa hợp chủ ngữ – động từ, thì, giới từ, dạng từ.</li>
                </ul>
                <div class="vd">
                  <div class="vd-title">📝 Ví dụ giải mẫu</div>
                  <p>Viết lại: "He is too young to drive." → He <strong>isn't old enough to drive.</strong></p>
                  <p>Tìm lỗi: "She <u>have</u> lived here since 2019." → sửa <strong>have → has</strong>.</p>
                </div>
                <div class="bt">
                  <div class="bt-title">✏️ Bài tập tự luyện</div>
                  <p><strong>Bài 1.</strong> Viết lại với "for": "I started learning English 5 years ago."</p>
                  <details><summary>Đáp án</summary><p>I have learned/learnt English for 5 years.</p></details>
                  <p style="margin-top:8px"><strong>Bài 2.</strong> Viết lại với "such … that": "The film was so boring that we left."</p>
                  <details><summary>Đáp án</summary><p>It was such a boring film that we left.</p></details>
                  <p style="margin-top:8px"><strong>Bài 3.</strong> Tìm và sửa lỗi: "Each of the students have a book."</p>
                  <details><summary>Đáp án</summary><p>have → has ("Each of …" + động từ số ít).</p></details>
                </div>
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
