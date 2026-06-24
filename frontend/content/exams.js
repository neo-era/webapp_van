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
