import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instructions for Physics Mentor AI
const PHYSICS_MENTOR_SYSTEM_INSTRUCTION = `
Bạn là "Physics Mentor - Trợ lý học tập Vật lí" thuộc nền tảng PHYSICS MENTOR AI, giáo viên phụ trách Phan Tố Quyên, Trường THPT số 1 Tuy Phước, Gia Lai.
Đối tượng học sinh: Lớp 10 và Lớp 11 THPT theo Chương trình GDPT 2018.

QUY TẮC SƯ PHẠM CỐT LÕI (BẮT BUỘC):
1. Phương châm: "Hiểu đúng bản chất – Tự tin giải bài – Tiến bộ mỗi ngày."
2. TUYỆT ĐỐI KHÔNG ĐƯA NGAY ĐÁP ÁN CUỐI CÙNG hoặc giải hộ bài toán ngay từ đầu.
3. Hướng dẫn học sinh bằng phương pháp gợi mở (Socratic scaffolding) theo 7 bước:
   - Bước 1: Xác định học sinh hỏi về khái niệm hay bài tập tính toán.
   - Bước 2: Tóm tắt dữ kiện đề bài, đại lượng đã biết, đại lượng cần tìm kèm đơn vị chuẩn SI.
   - Bước 3: Hỏi học sinh đã suy nghĩ hoặc thử giải đến bước nào.
   - Bước 4: Cung cấp tối đa 3 tầng gợi ý:
     + Gợi ý 1: Nhắc lại kiến thức/định luật liên quan.
     + Gợi ý 2: Hướng dẫn học sinh lựa chọn công thức phù hợp.
     + Gợi ý 3: Hướng dẫn thay số, kiểm tra chiều/dấu và đơn vị.
   - Bước 5: Khuyến khích học sinh tự tính toán và nhập kết quả.
   - Bước 6: Phân tích kết quả của học sinh, nếu sai hãy chỉ ra mã lỗi (E01 đến E09):
     + E01: Chọn sai công thức
     + E02: Thay số sai
     + E03: Nhầm hoặc thiếu đơn vị
     + E04: Nhầm dấu hoặc chiều của đại lượng
     + E05: Nhầm định nghĩa hoặc khái niệm
     + E06: Sai phép biến đổi toán học
     + E07: Thiếu bước lập luận quan trọng
     + E08: Hiểu sai hiện tượng Vật lí
     + E09: Chưa đủ thông tin để kết luận
   - Bước 7: Chỉ đưa ra lời giải hoàn chỉnh khi học sinh đã tự thử giải hoặc yêu cầu xem để đối chiếu sau khi nộp bài.

Đối với bài kiểm tra đang diễn ra hoặc chưa nộp: Tuyệt đối không tiết lộ đáp số hay lời giải.
Giọng điệu: Thân thiện, tôn trọng, khích lệ tư duy khoa học, không phán xét, dùng Tiếng Việt chuẩn mực.
`;

// API: Check server and AI status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-flash',
    school: 'THPT số 1 Tuy Phước - Gia Lai',
    teacher: 'Phan Tố Quyên',
    year: '2026-2027',
  });
});

// API: Socratic Physics Mentor Chat
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { message, history, context, currentStep = 1, isExamMode = false } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống' });
    }

    if (isExamMode) {
      return res.json({
        reply: 'Bài kiểm tra đang trong thời gian làm bài chính thức. Theo quy định học thuật, Physics Mentor AI chỉ có thể hướng dẫn bạn đọc kỹ đề bài và ôn lại các định nghĩa cơ bản, không được cung cấp công thức chuyên biệt hay giải hộ. Chúc bạn tự tin vận dụng kiến thức!',
        detectedError: null,
        suggestedHintLevel: 0,
      });
    }

    // If Gemini API is available, try Gemini 3.8 Flash
    if (ai) {
      try {
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        // Add conversation history if present
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.sender === 'student') {
              contents.push({ role: 'user', parts: [{ text: item.text }] });
            } else if (item.sender === 'mentor') {
              contents.push({ role: 'model', parts: [{ text: item.text }] });
            }
          }
        }

        // Context augmentation
        let promptText = message;
        if (context) {
          promptText = `[Ngữ cảnh chuyên đề: ${context.topic || 'Vật lí THPT'}, Khối: ${context.grade || '10/11'}. Bài tập/Mục tiêu: ${context.problem || 'Tự do'}. Tầng gợi ý yêu cầu: ${currentStep}/3]\n\nHọc sinh: ${message}`;
        }
        contents.push({ role: 'user', parts: [{ text: promptText }] });

        // Timeout promise after 6 seconds to prevent hanging requests
        const callPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: PHYSICS_MENTOR_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout')), 6000)
        );

        const response: any = await Promise.race([callPromise, timeoutPromise]);
        const replyText = response.text || 'Gia sư đang phân tích bài toán của bạn, hãy kiên nhẫn một chút nhé!';

        // Identify if any error code E01-E09 was cited in response
        let detectedError: string | null = null;
        const errorMatch = replyText.match(/\b(E0[1-9])\b/);
        if (errorMatch) {
          detectedError = errorMatch[1];
        }

        return res.json({
          reply: replyText,
          detectedError,
          usedGemini: true,
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed (e.g. 503 spike). Falling back to Socratic rule engine:', geminiError.message);
        // Fall through to pedagogical rule engine below!
      }
    }

    // Graceful pedagogical fallback rule-engine when API key is not yet set
    const lower = message.toLowerCase();
    let reply = '';
    let detectedError: string | null = null;

    if (lower.includes('gia tốc') || lower.includes('vận tốc') || lower.includes('quãng đường') || lower.includes('chuyển động')) {
      if (currentStep === 1) {
        reply = `**Gia sư Physics Mentor:** Chào bạn! Với chuyển động thẳng biến đổi đều (Lớp 10), trước hết ta cần xác định rõ:\n1. Vật chuyển động nhanh dần đều hay chậm dần đều?\n2. Vận tốc ban đầu $v_0$ bằng bao nhiêu? (Nếu đề bài ghi "bắt đầu chuyển động từ trạng thái nghỉ" thì $v_0 = 0$).\n3. Đề bài đã cho những đại lượng nào ($v_0, a, t, s$) và yêu cầu tìm đại lượng nào?\n\nBạn hãy cho thầy/cô biết các dữ kiện bạn đã tóm tắt được nhé!`;
      } else if (currentStep === 2) {
        reply = `**Gia sư Physics Mentor:** Tốt lắm! Nhắc lại công thức cốt lõi:\n- Vận tốc tức thời: $v = v_0 + at$\n- Quãng đường đi được: $s = v_0 t + \\frac{1}{2}at^2$\n- Hệ thức độc lập thời gian: $v^2 - v_0^2 = 2as$\n\nĐể tìm vận tốc sau thời gian $t$, bạn sẽ áp dụng công thức nào?`;
      } else {
        reply = `**Gia sư Physics Mentor:** Hãy chú ý kiểm tra:\n- Đơn vị gia tốc: $\\text{m/s}^2$\n- Đơn vị vận tốc: $\\text{m/s}$\n- Đơn vị quãng đường: $\\text{m}$\nBạn hãy thử thay số vào công thức và bấm máy tính, rồi gửi kết quả cho Gia sư kiểm tra nhé!`;
      }
    } else if (lower.includes('chu kì') || lower.includes('tần số') || lower.includes('dao động') || lower.includes('tần số góc')) {
      if (currentStep === 1) {
        reply = `**Gia sư Physics Mentor:** Trong dao động điều hòa (Lớp 11), ta cần phân biệt rõ:\n- Tần số $f$ (Hz): Số dao động toàn phần trong 1 giây.\n- Chu kì $T$ (s): Thời gian thực hiện 1 dao động toàn phần.\n- Tần số góc $\\omega$ (rad/s): Tốc độ biến thiên pha dao động.\n\nĐề bài của bạn đang cho đại lượng nào trước?`;
      } else if (currentStep === 2) {
        reply = `**Gia sư Physics Mentor:** Đúng rồi! Mối liên hệ toán học giữa các đại lượng là:\n- $T = \\frac{1}{f} = \\frac{2\\pi}{\\omega}$\n- $\\omega = 2\\pi f = \\frac{2\\pi}{T}$\n\nKhi biết tần số $f$, để tính $T$ và $\\omega$ bạn sẽ áp dụng công thức nào?`;
      } else {
        reply = `**Gia sư Physics Mentor:** Lưu ý:\n- Đơn vị chu kì là giây (s)\n- Đơn vị tần số góc là $\\text{rad/s}$ (có thể để dạng có chứa $\\pi$ như $4\\pi\\text{ rad/s}$ hoặc đổi ra số thập phân $\\approx 12,57\\text{ rad/s}$).\nBạn hãy tính thử xem ra bao nhiêu nào!`;
      }
    } else {
      reply = `**Gia sư Physics Mentor:** Chào em! Em đang muốn tìm hiểu sâu về khái niệm hay muốn cùng thầy/cô giải quyết một bài tập Vật lí cụ thể? Hãy chia sẻ đề bài hoặc điều em đang băn khoăn nhé! Chúng ta sẽ cùng nhau phân tích từng bước.`;
    }

    return res.json({
      reply,
      detectedError,
      usedGemini: false,
    });
  } catch (error: any) {
    console.error('Error in tutor chat:', error);
    res.status(500).json({
      error: 'Không thể kết nối đến trợ lý AI vào lúc này. Vui lòng thử lại.',
      details: error.message,
    });
  }
});

// API: Teacher AI Assessment Generator
app.post('/api/teacher/generate-questions', async (req, res) => {
  try {
    const { grade, topic, objective, difficulty, count = 3, questionType = 'trac_nghiem' } = req.body;

    if (ai) {
      try {
        const prompt = `
Bạn là chuyên gia khảo thí và biên soạn đề kiểm tra Vật lí THPT (Chương trình GDPT 2018).
Hãy tạo ${count} câu hỏi kiểm tra Vật lí với các thông số sau:
- Khối lớp: ${grade || '10'}
- Chủ đề: ${topic || 'Chuyển động biến đổi đều'}
- Mục tiêu kiến thức: ${objective || 'Vận dụng định luật và công thức tính toán'}
- Mức độ nhận thức: ${difficulty || 'Thông hiểu / Vận dụng'}
- Định dạng: ${questionType}

Yêu cầu xuất ra định dạng JSON chính xác theo cấu trúc:
[
  {
    "id": "gen-1",
    "question": "Nội dung câu hỏi rõ ràng, số liệu chuẩn xác...",
    "type": "multiple_choice",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A",
    "numericAnswer": 10,
    "unit": "m/s",
    "solution": "Hướng dẫn giải chi tiết từng bước...",
    "objective": "Mục tiêu đánh giá cụ thể...",
    "difficulty": "Vận dụng",
    "commonError": "E01 - Nhầm công thức vận tốc với quãng đường",
    "status": "pending_approval"
  }
]
`;
        const callPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.5,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout')), 6000)
        );

        const response: any = await Promise.race([callPromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || '[]');
        return res.json({ questions: parsed, generatedByAI: true });
      } catch (genErr: any) {
        console.warn('Teacher question generation API failed, using pedagogical pool:', genErr.message);
      }
    }

    // High-quality pedagogical fallback question generator
    const samplePool = [
      {
        id: `gen-${Date.now()}-1`,
        question: `Một đoàn tàu bắt đầu rời ga chuyển động thẳng nhanh dần đều với gia tốc a = 0,4 m/s². Tính vận tốc của đoàn tàu sau khi chạy được 20 giây.`,
        type: 'multiple_choice',
        options: ['A. 8 m/s', 'B. 4 m/s', 'C. 16 m/s', 'D. 10 m/s'],
        correctAnswer: 'A',
        numericAnswer: 8,
        unit: 'm/s',
        solution: 'Áp dụng công thức vận tốc: v = v0 + at. Vì tàu bắt đầu rời ga nên v0 = 0. Do đó: v = 0 + 0,4 * 20 = 8 m/s.',
        objective: 'Vận dụng công thức vận tốc trong chuyển động biến đổi đều',
        difficulty: 'Thông hiểu',
        commonError: 'E02 - Quên dữ kiện bắt đầu rời ga (v0 = 0)',
        status: 'pending_approval',
      },
      {
        id: `gen-${Date.now()}-2`,
        question: `Một chất điểm dao động điều hòa với phương trình x = 5*cos(10*pi*t + pi/3) (cm). Biên độ dao động và tần số dao động của chất điểm là:`,
        type: 'multiple_choice',
        options: ['A. A = 5 cm; f = 5 Hz', 'B. A = 5 cm; f = 10 Hz', 'C. A = 10 cm; f = 5 Hz', 'D. A = 5 cm; f = 2,5 Hz'],
        correctAnswer: 'A',
        numericAnswer: 5,
        unit: 'Hz',
        solution: 'Từ phương trình: Biên độ A = 5 cm. Tần số góc omega = 10*pi rad/s. Tần số f = omega / (2*pi) = 10*pi / (2*pi) = 5 Hz.',
        objective: 'Nhận diện các đại lượng đặc trưng của dao động điều hòa từ phương trình',
        difficulty: 'Nhận biết',
        commonError: 'E06 - Nhầm lẫn giữa tần số f và tần số góc omega',
        status: 'pending_approval',
      },
    ];

    return res.json({ questions: samplePool, generatedByAI: false });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Lỗi khi tạo câu hỏi bằng AI', details: error.message });
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Physics Mentor AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
