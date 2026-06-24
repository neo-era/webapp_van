/**
 * AI.gs — Giáo viên AI & sinh nháp nội dung bằng Claude API.
 * Khóa API lưu ở Script Properties: CLAUDE_API_KEY (KHÔNG hardcode).
 */

const AI_MODELS = {
  fast: 'claude-haiku-4-5-20251001',  // hỏi đáp thường
  smart: 'claude-sonnet-4-6',          // sinh nội dung / chấm bài
};
const AI_DAILY_LIMIT = 40; // số lượt hỏi/HS/ngày

function getClaudeKey_() {
  const k = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  if (!k) throw new Error('Chưa cấu hình CLAUDE_API_KEY trong Script Properties');
  return k;
}

/** Gọi Claude Messages API. opts: {model, system, messages, maxTokens} */
function callClaude_(opts) {
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': getClaudeKey_(), 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({
      model: opts.model || AI_MODELS.fast,
      max_tokens: opts.maxTokens || 1024,
      system: opts.system || '',
      messages: opts.messages,
    }),
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  const data = JSON.parse(res.getContentText());
  if (code !== 200) throw new Error('Lỗi AI (' + code + '): ' + ((data.error && data.error.message) || ''));
  const text = (data.content || []).map(function (c) { return c.text || ''; }).join('');
  const tokens = data.usage ? (data.usage.input_tokens + data.usage.output_tokens) : 0;
  return { text: text, tokens: tokens, model: opts.model || AI_MODELS.fast };
}

/** Đếm số lượt hỏi của học sinh trong hôm nay (giới hạn chi phí). */
function aiCountToday_(studentId) {
  const today = todayStr();
  return getRows('AIChats').filter(function (c) {
    return String(c.studentId) === String(studentId) && c.role === 'USER' &&
      String(c.createdAt).slice(0, 10) === today;
  }).length;
}

/** Học sinh hỏi giáo viên AI (gắn ngữ cảnh bài giảng nếu có). */
function aiChat(req) {
  const user = requireAuth(req.token);
  const message = String(req.message || '').trim();
  if (!message) return jsonError('Vui lòng nhập câu hỏi');
  if (aiCountToday_(user.userId) >= AI_DAILY_LIMIT) {
    return jsonError('Bạn đã đạt giới hạn ' + AI_DAILY_LIMIT + ' lượt hỏi hôm nay. Hãy quay lại ngày mai nhé!');
  }

  // Ngữ cảnh bài giảng (nếu có)
  let context = '';
  if (req.lessonId) {
    const l = getRows('Lessons').find(function (x) { return String(x.lessonId) === String(req.lessonId) && x.status === 'PUBLISHED'; });
    if (l) context = '\n\nNội dung bài giảng học sinh đang xem (bám sát khi trả lời):\n' + l.contentMd;
  }

  const system = 'Bạn là giáo viên AI thân thiện cho học sinh THPT Việt Nam, theo Chương trình GDPT 2018. ' +
    'Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, có ví dụ. Dùng cú pháp LaTeX ($...$) cho công thức. ' +
    'TUYỆT ĐỐI KHÔNG làm hộ hay tiết lộ đáp án bài kiểm tra/bài thi đang diễn ra — chỉ gợi ý hướng tư duy. ' +
    'Chỉ trả lời trong phạm vi học tập.' + context;

  const result = callClaude_({ model: AI_MODELS.fast, system: system, messages: [{ role: 'user', content: message }], maxTokens: 1024 });

  // Ghi log (kiểm soát chi phí + lịch sử)
  appendRow('AIChats', { msgId: genId('m'), studentId: user.userId, context: req.lessonId || '', role: 'USER', content: message, model: result.model, tokens: 0, createdAt: now() });
  appendRow('AIChats', { msgId: genId('m'), studentId: user.userId, context: req.lessonId || '', role: 'ASSISTANT', content: result.text, model: result.model, tokens: result.tokens, createdAt: now() });

  return jsonOk({ reply: result.text, remaining: AI_DAILY_LIMIT - aiCountToday_(user.userId) });
}

/** Giáo viên: sinh nháp bài giảng bằng AI → lưu trạng thái DRAFT. */
function generateLesson(req) {
  const user = requireTeacher(req.token);
  if (!req.topicId || !req.title) return jsonError('Thiếu chủ đề hoặc tiêu đề bài giảng');
  const subjectName = (getRows('Subjects').find(function (s) { return String(s.subjectCode) === String(req.subjectCode); }) || {}).name || req.subjectCode;
  const levelLabel = req.level === 'NANG_CAO' ? 'nâng cao' : (req.level === 'CHUYEN' ? 'chuyên (trường chuyên)' : 'cơ bản');

  const system = 'Bạn là chuyên gia biên soạn bài giảng THPT theo Chương trình GDPT 2018 của Việt Nam. ' +
    'Viết bài giảng bằng tiếng Việt, định dạng Markdown, công thức dùng LaTeX ($...$). ' +
    'Bố cục gồm 2 phần rõ ràng: "## Cốt lõi" (kiến thức trọng tâm, dễ hiểu) và "## Nâng cao" (mở rộng, mẹo, lỗi thường gặp). ' +
    'Trình bày súc tích, có gạch đầu dòng và ví dụ. Chỉ trả về nội dung Markdown, không lời dẫn.';
  const prompt = 'Soạn bài giảng môn ' + subjectName + ' lớp ' + (req.grade || 12) +
    ', mức độ ' + levelLabel + ', tiêu đề: "' + req.title + '".';

  const result = callClaude_({ model: AI_MODELS.smart, system: system, messages: [{ role: 'user', content: prompt }], maxTokens: 2048 });

  const lesson = {
    lessonId: genId('l'), subjectCode: req.subjectCode || '', grade: req.grade || 12, topicId: req.topicId,
    title: req.title, level: req.level || 'CO_BAN', skill: req.skill || '', contentMd: result.text,
    order: Number(req.order) || 0, status: 'DRAFT', source: 'AI', createdBy: user.userId, updatedAt: now(),
  };
  appendRow('Lessons', lesson);
  return jsonOk(cleanLesson(lesson, true));
}

/** Trích mảng JSON từ text (bỏ ```json fences nếu có). */
function extractJsonArray_(text) {
  const a = text.indexOf('['), b = text.lastIndexOf(']');
  if (a < 0 || b <= a) return null;
  return parseJsonSafe_(text.slice(a, b + 1), null);
}

/** Giáo viên: sinh nháp câu hỏi trắc nghiệm bằng AI → lưu DRAFT. */
function generateQuestions(req) {
  const user = requireTeacher(req.token);
  if (!req.topicId) return jsonError('Thiếu chủ đề');
  const count = Math.max(1, Math.min(Number(req.count) || 5, 10));
  const diff = ['NB', 'TH', 'VD', 'VDC'].indexOf(req.difficulty) >= 0 ? req.difficulty : 'TH';
  const subjectName = (getRows('Subjects').find(function (s) { return String(s.subjectCode) === String(req.subjectCode); }) || {}).name || req.subjectCode;
  const topic = (getRows('Topics').find(function (t) { return String(t.topicId) === String(req.topicId); }) || {}).title || '';

  const system = 'Bạn tạo câu hỏi trắc nghiệm THPT theo Chương trình GDPT 2018 (Việt Nam). ' +
    'Trả về DUY NHẤT một mảng JSON hợp lệ, KHÔNG kèm chữ nào khác, mỗi phần tử dạng: ' +
    '{"stem": "đề bài (LaTeX $...$ nếu có công thức)", "options": ["A","B","C","D"], "answer": 0, "explanation": "lời giải ngắn"}. ' +
    '"answer" là chỉ số (0-3) của đáp án đúng.';
  const prompt = 'Tạo ' + count + ' câu hỏi trắc nghiệm môn ' + subjectName + ' lớp ' + (req.grade || 12) +
    ' về chủ đề "' + topic + '", độ khó ' + diff + '.';

  const result = callClaude_({ model: AI_MODELS.smart, system: system, messages: [{ role: 'user', content: prompt }], maxTokens: 2048 });
  const arr = extractJsonArray_(result.text);
  if (!Array.isArray(arr) || !arr.length) return jsonError('AI trả về không đúng định dạng, vui lòng thử lại');

  let n = 0;
  arr.forEach(function (it) {
    if (!it || !it.stem || !Array.isArray(it.options)) return;
    appendRow('Questions', {
      questionId: genId('q'), subjectCode: req.subjectCode || '', grade: req.grade || 12, topicId: req.topicId,
      type: 'MCQ', difficulty: diff, level: req.level || 'CO_BAN', stem: String(it.stem),
      options: JSON.stringify(it.options), answer: String(it.answer == null ? 0 : it.answer),
      explanation: it.explanation || '', status: 'DRAFT', source: 'AI',
    });
    n++;
  });
  return jsonOk({ created: n });
}

/** AI chấm bài Writing theo tiêu chí IELTS/TOEIC + góp ý. */
function gradeWriting(req) {
  const user = requireAuth(req.token);
  const essay = String(req.essay || '').trim();
  if (!essay) return jsonError('Chưa có bài viết để chấm');
  if (essay.length < 30) return jsonError('Bài viết quá ngắn để chấm');
  if (aiCountToday_(user.userId) >= AI_DAILY_LIMIT) return jsonError('Đã đạt giới hạn lượt AI hôm nay');

  const exam = req.exam === 'TOEIC' ? 'TOEIC' : 'IELTS';
  const criteria = exam === 'IELTS'
    ? 'Chấm theo 4 tiêu chí IELTS Writing (Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy), mỗi tiêu chí cho band 0-9 (bước 0.5) và band tổng.'
    : 'Đánh giá theo thang TOEIC Writing, ước lượng mức điểm và nhận xét.';
  const system = 'Bạn là giám khảo chấm thi ' + exam + ' Writing giàu kinh nghiệm. Trả lời bằng tiếng Việt, ngắn gọn, theo bố cục Markdown. ' +
    criteria + ' Sau đó liệt kê: **3 điểm mạnh**, **3 điểm cần cải thiện**, và **1 câu viết lại mẫu** tốt hơn.';
  const prompt = 'Đề bài: ' + (req.prompt || '(không nêu)') + '\n\nBài làm của học sinh:\n"""\n' + essay + '\n"""';

  const result = callClaude_({ model: AI_MODELS.smart, system: system, messages: [{ role: 'user', content: prompt }], maxTokens: 1400 });
  appendRow('AIChats', { msgId: genId('m'), studentId: user.userId, context: 'writing', role: 'USER', content: essay.slice(0, 800), model: result.model, tokens: 0, createdAt: now() });
  appendRow('AIChats', { msgId: genId('m'), studentId: user.userId, context: 'writing', role: 'ASSISTANT', content: result.text, model: result.model, tokens: result.tokens, createdAt: now() });
  return jsonOk({ feedback: result.text });
}

/** Kiểm tra cấu hình khóa AI (cho phép test nhanh). */
function aiStatus(req) {
  requireAuth(req.token);
  const has = !!PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  return jsonOk({ configured: has });
}

/**
 * Chạy 1 lần trong trình Apps Script để CẤP QUYỀN gọi API ngoài (UrlFetchApp).
 * Cần cho Giáo viên AI. (Không cần khóa API để chạy hàm này.)
 */
function _authorizeAI() {
  const code = UrlFetchApp.fetch('https://www.anthropic.com', { muteHttpExceptions: true }).getResponseCode();
  Logger.log('Đã cấp quyền gọi API ngoài. HTTP ' + code);
}
