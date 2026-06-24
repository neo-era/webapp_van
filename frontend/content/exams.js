/* ============================================================
   exams.js — ĐỀ KIỂM TRA (tĩnh). Tự chấm tại trình duyệt → tức thì.

   CÁCH THÊM ĐỀ / CÂU HỎI:
   - Thêm object vào EXAMS[<mã môn>]:
       { examId:'ma-de', title:'Tên đề', durationMin:15, questions:[ ... ] }
   - Mỗi câu (trắc nghiệm 1 đáp án):
       { stem:'Đề bài (LaTeX $...$)', options:['A','B','C','D'], answer:<chỉ số đúng 0..3>,
         explanation:'Lời giải ngắn' }
   ============================================================ */

const EXAMS = {
  TOAN: [
    {
      examId: 'toan-c1', title: 'Đạo hàm & Khảo sát hàm số', durationMin: 15,
      questions: [
        { stem: 'Hàm số $y=x^3-3x$ đồng biến trên khoảng nào?',
          options: ['$(-1;1)$', '$(-\\infty;-1)$ và $(1;+\\infty)$', '$(0;+\\infty)$', '$\\mathbb{R}$'],
          answer: 1, explanation: '$y\'=3x^2-3>0 \\Leftrightarrow x<-1$ hoặc $x>1$.' },
        { stem: 'Số điểm cực trị của hàm $y=x^4-2x^2$ là?',
          options: ['$0$', '$1$', '$2$', '$3$'],
          answer: 3, explanation: '$y\'=4x^3-4x=4x(x-1)(x+1)$ có 3 nghiệm ⇒ 3 cực trị.' },
        { stem: 'Giá trị lớn nhất của $y=-x^2+4x$ trên $\\mathbb{R}$ là?',
          options: ['$2$', '$4$', '$0$', '$8$'],
          answer: 1, explanation: '$y\'=-2x+4=0 \\Leftrightarrow x=2$, $y(2)=4$.' },
        { stem: 'Tiệm cận ngang của đồ thị $y=\\dfrac{2x+1}{x-1}$ là?',
          options: ['$x=1$', '$y=2$', '$y=1$', '$x=2$'],
          answer: 1, explanation: '$\\lim\\limits_{x\\to\\pm\\infty}y=\\dfrac{2}{1}=2$.' },
        { stem: 'Đạo hàm của $y=\\ln x$ là?',
          options: ['$x$', '$\\dfrac{1}{x}$', '$\\dfrac{1}{x^2}$', '$\\ln x$'],
          answer: 1, explanation: '$(\\ln x)\'=\\dfrac{1}{x}$.' },
      ],
    },
    {
      examId: 'toan-tp-xs', title: 'Tích phân & Xác suất', durationMin: 15,
      questions: [
        { stem: 'Tính $\\displaystyle\\int_0^1 2x\\,dx$.',
          options: ['$1$', '$2$', '$\\dfrac{1}{2}$', '$0$'],
          answer: 0, explanation: '$[x^2]_0^1=1$.' },
        { stem: 'Họ nguyên hàm của $f(x)=x^2$ là?',
          options: ['$x^3+C$', '$\\dfrac{x^3}{3}+C$', '$2x+C$', '$3x^2+C$'],
          answer: 1, explanation: '$\\int x^2dx=\\dfrac{x^3}{3}+C$.' },
        { stem: 'Thể tích khối tròn xoay khi quay $y=\\sqrt{x}$ quanh $Ox$ từ $0$ đến $4$ là?',
          options: ['$4\\pi$', '$8\\pi$', '$16\\pi$', '$2\\pi$'],
          answer: 1, explanation: '$V=\\pi\\int_0^4 x\\,dx=8\\pi$.' },
        { stem: 'Cho $P(A\\cap B)=0{,}2$, $P(B)=0{,}5$. Tính $P(A\\mid B)$.',
          options: ['$0{,}1$', '$0{,}4$', '$0{,}25$', '$0{,}7$'],
          answer: 1, explanation: '$P(A\\mid B)=\\dfrac{0{,}2}{0{,}5}=0{,}4$.' },
        { stem: 'Tính $\\displaystyle\\int_0^{\\pi}\\sin x\\,dx$.',
          options: ['$0$', '$1$', '$2$', '$-2$'],
          answer: 2, explanation: '$[-\\cos x]_0^{\\pi}=1+1=2$.' },
      ],
    },
    {
      examId: 'kt45-1', title: 'Kiểm tra 45′ #1 — Đạo hàm & Khảo sát hàm số', durationMin: 45,
      questions: [
        { stem: 'Hàm số $y=x^3-3x^2$ đồng biến trên khoảng nào?', options: ['$(0;2)$', '$(-\\infty;0)$ và $(2;+\\infty)$', '$(2;+\\infty)$', '$\\mathbb{R}$'], answer: 1, explanation: '$y\'=3x^2-6x=3x(x-2)>0\\Leftrightarrow x<0$ hoặc $x>2$.' },
        { stem: 'Giá trị cực đại của $y=-x^2+2x$ là?', options: ['$1$', '$2$', '$0$', '$-1$'], answer: 0, explanation: '$y\'=-2x+2=0\\Rightarrow x=1,\\ y(1)=1$.' },
        { stem: 'Số điểm cực trị của $y=x^3+x$ là?', options: ['$0$', '$1$', '$2$', '$3$'], answer: 0, explanation: '$y\'=3x^2+1>0\\ \\forall x$ ⇒ không có cực trị.' },
        { stem: 'GTNN của $y=x^2-4x+5$ trên $\\mathbb{R}$ là?', options: ['$1$', '$5$', '$0$', '$-1$'], answer: 0, explanation: '$y=(x-2)^2+1\\ge 1$.' },
        { stem: 'Tiệm cận đứng của $y=\\dfrac{x+1}{x-2}$ là?', options: ['$x=2$', '$y=2$', '$x=-1$', '$y=1$'], answer: 0, explanation: 'Mẫu $=0\\Leftrightarrow x=2$.' },
        { stem: 'Hàm $y=x^4-2x^2+1$ có mấy điểm cực trị?', options: ['$0$', '$1$', '$2$', '$3$'], answer: 3, explanation: '$y\'=4x^3-4x=4x(x-1)(x+1)$ có 3 nghiệm.' },
        { stem: 'Tiệm cận ngang của $y=\\dfrac{2x-3}{x+1}$ là?', options: ['$y=2$', '$x=-1$', '$y=-3$', '$x=2$'], answer: 0, explanation: '$\\lim\\limits_{x\\to\\pm\\infty}y=2$.' },
        { stem: 'Hàm số $y=x^3$ đồng biến trên?', options: ['$(0;+\\infty)$', '$\\mathbb{R}$', '$(-\\infty;0)$', 'không khoảng nào'], answer: 1, explanation: '$y\'=3x^2\\ge 0$, bằng 0 tại 1 điểm ⇒ đồng biến trên $\\mathbb{R}$.' },
        { stem: 'Đạo hàm của $y=e^x$ là?', options: ['$x e^{x-1}$', '$e^x$', '$\\dfrac{1}{x}$', '$x$'], answer: 1, explanation: '$(e^x)\'=e^x$.' },
        { stem: 'GTLN của $y=x^3-3x$ trên $[0;2]$ là?', options: ['$0$', '$-2$', '$2$', '$6$'], answer: 2, explanation: '$y\'=3x^2-3=0\\Rightarrow x=1$; $y(0)=0, y(1)=-2, y(2)=2$.' },
      ],
    },
    {
      examId: 'kt45-2', title: 'Kiểm tra 45′ #2 — Nguyên hàm & Tích phân', durationMin: 45,
      questions: [
        { stem: 'Họ nguyên hàm $\\displaystyle\\int x^3\\,dx$ bằng?', options: ['$\\dfrac{x^4}{4}+C$', '$3x^2+C$', '$x^4+C$', '$4x^3+C$'], answer: 0, explanation: '$\\int x^n dx=\\dfrac{x^{n+1}}{n+1}+C$.' },
        { stem: 'Tính $\\displaystyle\\int_0^1 x^2\\,dx$.', options: ['$\\dfrac{1}{3}$', '$1$', '$\\dfrac{1}{2}$', '$3$'], answer: 0, explanation: '$[x^3/3]_0^1=1/3$.' },
        { stem: '$\\displaystyle\\int \\dfrac{1}{x}\\,dx$ bằng?', options: ['$\\ln|x|+C$', '$-\\dfrac{1}{x^2}+C$', '$x+C$', '$\\dfrac{1}{x^2}$'], answer: 0, explanation: '$\\int\\frac{1}{x}dx=\\ln|x|+C$.' },
        { stem: 'Tính $\\displaystyle\\int_0^{\\pi}\\sin x\\,dx$.', options: ['$0$', '$1$', '$2$', '$-1$'], answer: 2, explanation: '$[-\\cos x]_0^\\pi=2$.' },
        { stem: '$\\displaystyle\\int e^x\\,dx$ bằng?', options: ['$e^x+C$', '$xe^{x-1}$', '$\\ln x+C$', '$e^x$'], answer: 0, explanation: '$\\int e^x dx=e^x+C$.' },
        { stem: 'Tính $\\displaystyle\\int_1^2 2x\\,dx$.', options: ['$3$', '$4$', '$1$', '$2$'], answer: 0, explanation: '$[x^2]_1^2=3$.' },
        { stem: 'Diện tích hình phẳng giới hạn $y=x^2$, $Ox$, $x=0$, $x=3$ là?', options: ['$9$', '$3$', '$27$', '$6$'], answer: 0, explanation: '$\\int_0^3 x^2 dx=9$.' },
        { stem: '$\\displaystyle\\int \\cos x\\,dx$ bằng?', options: ['$\\sin x+C$', '$-\\sin x+C$', '$\\cos x$', '$-\\cos x+C$'], answer: 0, explanation: '$\\int\\cos x dx=\\sin x+C$.' },
        { stem: 'Thể tích khối tròn xoay quay $y=x$ quanh $Ox$ từ $0$ đến $1$ là?', options: ['$\\dfrac{\\pi}{3}$', '$\\pi$', '$\\dfrac{\\pi}{2}$', '$\\dfrac{2\\pi}{3}$'], answer: 0, explanation: '$V=\\pi\\int_0^1 x^2 dx=\\dfrac{\\pi}{3}$.' },
        { stem: 'Tính $\\displaystyle\\int_0^1 (2x+1)\\,dx$.', options: ['$2$', '$1$', '$3$', '$0$'], answer: 0, explanation: '$[x^2+x]_0^1=2$.' },
      ],
    },
    {
      examId: 'kt45-3', title: 'Kiểm tra 45′ #3 — Vectơ & tọa độ Oxyz', durationMin: 45,
      questions: [
        { stem: 'Cho $A(1;2;3)$, $B(3;0;1)$. Tọa độ $\\vec{AB}$ là?', options: ['$(2;-2;-2)$', '$(-2;2;2)$', '$(4;2;4)$', '$(2;2;2)$'], answer: 0, explanation: '$\\vec{AB}=B-A=(2;-2;-2)$.' },
        { stem: 'Độ dài của $\\vec{u}=(2;1;2)$ là?', options: ['$3$', '$5$', '$9$', '$\\sqrt{5}$'], answer: 0, explanation: '$|\\vec{u}|=\\sqrt{4+1+4}=3$.' },
        { stem: 'Trung điểm của $A(0;0;0)$ và $B(2;4;6)$ là?', options: ['$(1;2;3)$', '$(2;4;6)$', '$(1;1;1)$', '$(0;2;3)$'], answer: 0, explanation: 'Trung điểm $=\\left(\\tfrac{0+2}{2};\\tfrac{0+4}{2};\\tfrac{0+6}{2}\\right)$.' },
        { stem: 'Tích vô hướng $\\vec{u}\\cdot\\vec{v}$ với $\\vec{u}=(1;2;3)$, $\\vec{v}=(2;0;-1)$ là?', options: ['$-1$', '$5$', '$1$', '$2$'], answer: 0, explanation: '$2+0-3=-1$.' },
        { stem: 'Vectơ nào vuông góc với $\\vec{u}=(2;1;2)$?', options: ['$(1;-2;0)$', '$(1;1;1)$', '$(0;0;1)$', '$(1;0;1)$'], answer: 0, explanation: '$(2)(1)+(1)(-2)+(2)(0)=0$.' },
        { stem: 'Trọng tâm tam giác $A(1;1;1)$, $B(2;2;2)$, $C(3;3;3)$ là?', options: ['$(2;2;2)$', '$(6;6;6)$', '$(1;1;1)$', '$(3;3;3)$'], answer: 0, explanation: '$G=\\left(\\tfrac{1+2+3}{3};\\dots\\right)=(2;2;2)$.' },
        { stem: 'Góc giữa $\\vec{u}=(1;0;0)$ và $\\vec{v}=(0;1;0)$ là?', options: ['$90^\\circ$', '$0^\\circ$', '$45^\\circ$', '$180^\\circ$'], answer: 0, explanation: '$\\vec{u}\\cdot\\vec{v}=0$.' },
        { stem: 'Điểm nào nằm trên trục $Ox$?', options: ['$(3;0;0)$', '$(0;3;0)$', '$(0;0;3)$', '$(1;1;1)$'], answer: 0, explanation: 'Trên $Ox$: $y=z=0$.' },
        { stem: 'Điểm đối xứng của $A(2;-1;0)$ qua gốc $O$ là?', options: ['$(-2;1;0)$', '$(2;1;0)$', '$(-2;-1;0)$', '$(2;-1;0)$'], answer: 0, explanation: 'Đổi dấu các tọa độ.' },
        { stem: 'Hai vectơ $\\vec{u}=(1;1;1)$, $\\vec{v}=(2;2;2)$ có quan hệ gì?', options: ['Cùng phương ($\\vec{v}=2\\vec{u}$)', 'Vuông góc', 'Không cùng phương', 'Bằng nhau'], answer: 0, explanation: '$\\vec{v}=2\\vec{u}$.' },
      ],
    },
    {
      examId: 'kt45-4', title: 'Kiểm tra 45′ #4 — Mặt phẳng, đường thẳng, mặt cầu', durationMin: 45,
      questions: [
        { stem: 'Vectơ pháp tuyến của mặt phẳng $2x-3y+z-1=0$ là?', options: ['$(2;-3;1)$', '$(2;3;1)$', '$(2;-3;-1)$', '$(-1;2;-3)$'], answer: 0, explanation: 'Hệ số của $x,y,z$.' },
        { stem: 'Khoảng cách từ $O$ đến mặt phẳng $x+y+z-3=0$ là?', options: ['$\\sqrt{3}$', '$3$', '$1$', '$\\sqrt{2}$'], answer: 0, explanation: '$d=\\dfrac{|-3|}{\\sqrt{3}}=\\sqrt{3}$.' },
        { stem: 'Bán kính mặt cầu $(x-1)^2+(y+2)^2+z^2=9$ là?', options: ['$3$', '$9$', '$\\sqrt{3}$', '$1$'], answer: 0, explanation: '$R=\\sqrt{9}=3$.' },
        { stem: 'Tâm mặt cầu $x^2+y^2+z^2-2x-4y+1=0$ là?', options: ['$(1;2;0)$', '$(-1;-2;0)$', '$(2;4;0)$', '$(1;2;1)$'], answer: 0, explanation: '$I(a;b;c)$ với $a=1,b=2,c=0$.' },
        { stem: 'Vectơ chỉ phương của $d:\\dfrac{x-1}{2}=\\dfrac{y}{-1}=\\dfrac{z+2}{3}$ là?', options: ['$(2;-1;3)$', '$(1;0;-2)$', '$(2;1;3)$', '$(-2;1;3)$'], answer: 0, explanation: 'Mẫu số là tọa độ VTCP.' },
        { stem: 'Mặt phẳng qua $O$ với pháp tuyến $(1;2;2)$ có phương trình?', options: ['$x+2y+2z=0$', '$x+2y+2z-1=0$', '$2x+y+2z=0$', '$x+y+z=0$'], answer: 0, explanation: 'Qua $O$ ⇒ $D=0$.' },
        { stem: 'Điểm $M(1;1;1)$ có thuộc mặt phẳng $x+y+z-3=0$ không?', options: ['Có', 'Không', 'Không xác định', 'Chỉ khi đổi dấu'], answer: 0, explanation: '$1+1+1-3=0$.' },
        { stem: 'Khoảng cách từ $M(1;0;0)$ đến mặt phẳng $2x+2y+z+4=0$ là?', options: ['$2$', '$6$', '$3$', '$1$'], answer: 0, explanation: '$\\dfrac{|2+0+0+4|}{\\sqrt{4+4+1}}=\\dfrac{6}{3}=2$.' },
        { stem: 'Bán kính mặt cầu $x^2+y^2+z^2=16$ là?', options: ['$4$', '$16$', '$8$', '$2$'], answer: 0, explanation: '$R=\\sqrt{16}=4$.' },
        { stem: 'Vectơ pháp tuyến của mặt phẳng $3x-4z+5=0$ là?', options: ['$(3;0;-4)$', '$(3;-4;0)$', '$(3;-4;5)$', '$(3;0;4)$'], answer: 0, explanation: 'Thiếu $y$ ⇒ hệ số $y=0$.' },
      ],
    },
    {
      examId: 'kt45-5', title: 'Kiểm tra 45′ #5 — Xác suất có điều kiện & Thống kê', durationMin: 45,
      questions: [
        { stem: 'Cho $P(A\\cap B)=0{,}2$, $P(B)=0{,}4$. Tính $P(A\\mid B)$.', options: ['$0{,}5$', '$0{,}8$', '$0{,}08$', '$0{,}2$'], answer: 0, explanation: '$\\dfrac{0{,}2}{0{,}4}=0{,}5$.' },
        { stem: '$A,B$ độc lập, $P(A)=0{,}3$, $P(B)=0{,}5$. Tính $P(A\\cap B)$.', options: ['$0{,}15$', '$0{,}8$', '$0{,}2$', '$0{,}5$'], answer: 0, explanation: '$P(A)P(B)=0{,}15$.' },
        { stem: 'Khoảng biến thiên của mẫu $2,5,9,12$ là?', options: ['$10$', '$7$', '$2$', '$12$'], answer: 0, explanation: '$12-2=10$.' },
        { stem: 'Gieo một xúc xắc. Xác suất "số chẵn" biết "số $\\ge 3$" là?', options: ['$\\dfrac{1}{2}$', '$\\dfrac{1}{3}$', '$\\dfrac{1}{4}$', '$\\dfrac{2}{3}$'], answer: 0, explanation: '$B=\\{3,4,5,6\\}, A\\cap B=\\{4,6\\}\\Rightarrow 2/4$.' },
        { stem: 'Phương sai và độ lệch chuẩn đo đại lượng nào?', options: ['Độ phân tán của dữ liệu', 'Giá trị trung bình', 'Giá trị lớn nhất', 'Trung vị'], answer: 0, explanation: 'Đo mức độ phân tán quanh trung bình.' },
        { stem: 'Phương sai của mẫu $4,4,4,4$ là?', options: ['$0$', '$4$', '$16$', '$1$'], answer: 0, explanation: 'Mọi giá trị bằng trung bình ⇒ phương sai $=0$.' },
        { stem: 'Cho $P(A\\cap B)=0{,}1$, $P(A\\mid B)=0{,}5$. Tính $P(B)$.', options: ['$0{,}2$', '$0{,}05$', '$0{,}5$', '$0{,}6$'], answer: 0, explanation: '$P(B)=\\dfrac{0{,}1}{0{,}5}=0{,}2$.' },
        { stem: 'Khoảng tứ phân vị $\\Delta_Q$ của mẫu $1,3,5,7,9$ là?', options: ['$6$', '$4$', '$8$', '$2$'], answer: 0, explanation: '$Q_1=2, Q_3=8 \\Rightarrow \\Delta_Q=6$.' },
        { stem: 'Nếu $P(A\\mid B)=P(A)$ thì hai biến cố $A,B$?', options: ['Độc lập', 'Xung khắc', 'Đối nhau', 'Bằng nhau'], answer: 0, explanation: 'Định nghĩa biến cố độc lập.' },
        { stem: 'Độ lệch chuẩn $s$ bằng?', options: ['Căn bậc hai của phương sai', 'Bình phương phương sai', 'Trung bình', 'Phương sai'], answer: 0, explanation: '$s=\\sqrt{s^2}$.' },
      ],
    },
  ],

  TOEIC: [
    {
      examId: 'toeic-reading', title: 'TOEIC Reading – Mini test', durationMin: 10,
      questions: [
        { stem: 'The report must be submitted ____ Friday.',
          options: ['in', 'on', 'at', 'by'], answer: 3, explanation: '"by Friday" = hạn chót đến thứ Sáu.' },
        { stem: 'She is responsible ____ marketing.',
          options: ['for', 'to', 'with', 'of'], answer: 0, explanation: 'be responsible <strong>for</strong> something.' },
        { stem: 'We look forward to ____ from you.',
          options: ['hear', 'hearing', 'heard', 'hears'], answer: 1, explanation: 'look forward to + V-ing.' },
      ],
    },
  ],

  IELTS: [],
};

const Exams = {
  list(code) { return EXAMS[code] || []; },
  get(examId) {
    for (const code in EXAMS) {
      const e = EXAMS[code].find((x) => x.examId === examId);
      if (e) {
        // gán id cho từng câu để chấm
        return Object.assign({}, e, { questions: e.questions.map((q, i) => Object.assign({ questionId: examId + '-' + i, type: 'MCQ' }, q)) });
      }
    }
    return null;
  },
};
