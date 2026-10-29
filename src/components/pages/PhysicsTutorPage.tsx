import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TutorChatMessage, ErrorCode } from '../../types';
import { ERROR_TAXONOMY } from '../../data/mockData';
import {
  BrainCircuit,
  Send,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const PhysicsTutorPage: React.FC = () => {
  const { selectedGrade, setSelectedGrade, currentStudent, currentRole } = useApp();

  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'mentor',
      text: `Xin chào ${currentStudent ? currentStudent.name : 'bạn'}! Thầy/cô là **Physics Mentor – Trợ lý học tập Vật lí** thuộc THPT số 1 Tuy Phước.\n\nPhương châm của chúng ta: **"Hiểu đúng bản chất – Tự tin giải bài – Tiến bộ mỗi ngày."**\n\nThầy/cô sẽ đồng hành cùng em theo từng bước gợi mở (Socratic) chứ không làm hộ bài. Em đang muốn hỏi về **khái niệm/định luật** hay muốn cùng thầy/cô giải quyết một **bài tập tính toán** cụ thể?`,
      timestamp: '14:00',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTopic, setActiveTopic] = useState<'k10_motion' | 'k11_oscillation' | 'custom'>('k10_motion');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  // Quick problem loader
  const loadSampleProblem = (type: 'k10' | 'k11') => {
    if (type === 'k10') {
      setSelectedGrade(10);
      setActiveTopic('k10_motion');
      const prompt = 'Thưa thầy/cô, em có bài tập Lớp 10 này: "Một vật bắt đầu chuyển động từ trạng thái nghỉ với gia tốc a = 2 m/s². Sau 5 giây, hãy tính vận tốc và quãng đường vật đi được." Em nên bắt đầu từ đâu ạ?';
      handleSendMessage(prompt);
    } else {
      setSelectedGrade(11);
      setActiveTopic('k11_oscillation');
      const prompt = 'Thưa thầy/cô, em có bài tập Lớp 11 này: "Một vật dao động điều hòa với tần số f = 2 Hz. Tính chu kì T và tần số góc ω của dao động." Em xin được hướng dẫn ạ!';
      handleSendMessage(prompt);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSubmitting) return;

    const userMsg: TutorChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          currentStep,
          isExamMode: false,
          context: {
            grade: selectedGrade,
            topic: activeTopic === 'k10_motion' ? 'Chuyển động thẳng biến đổi đều' : 'Dao động điều hòa',
          },
        }),
      });

      const data = await response.json();
      const mentorMsg: TutorChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: data.reply || 'Gia sư đã ghi nhận bài làm của em.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hintLevel: currentStep,
        detectedError: data.detectedError as ErrorCode | null,
      };

      setMessages((prev) => [...prev, mentorMsg]);
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } catch (err) {
      console.error('Lỗi kết nối gia sư:', err);
      // Client pedagogical fallback
      const fallbackMsg: TutorChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: `**Physics Mentor:** Hãy chú ý đọc kỹ các dữ kiện đề bài đã cho.\n1. Tóm tắt các đại lượng: $v_0, a, t$ hoặc $f, \\omega, T$.\n2. Kiểm tra xem vật chuyển động nhanh dần đều hay chậm dần đều.\n3. Đơn vị đã chuyển về hệ SI chưa?\nEm hãy thử viết công thức em định áp dụng ra đây nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetChat = () => {
    setCurrentStep(1);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'mentor',
        text: 'Cuộc trò chuyện đã được làm mới. Em muốn cùng thầy/cô tìm hiểu bài toán nào tiếp theo?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
            <span className="font-semibold text-blue-700">Physics Mentor AI</span>
            <span aria-hidden="true">·</span>
            <span>Phương pháp gợi mở Socratic THPT</span>
            <span aria-hidden="true">·</span>
            <span>Khối {selectedGrade}</span>
          </div>
          <h1 className="text-base font-bold text-slate-900">
            Gia sư Physics – Trợ lý học tập Vật lí
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Problem Loaders */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => loadSampleProblem('k10')}
              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              Mẫu Lớp 10 (Chuyển động)
            </button>
            <button
              onClick={() => loadSampleProblem('k11')}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
            >
              Mẫu Lớp 11 (Dao động)
            </button>
          </div>

          <button
            onClick={handleResetChat}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Socratic Step Indicator */}
      <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shrink-0 flex items-center justify-between text-xs overflow-x-auto">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">Tiến trình giàn giáo sư phạm:</span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${currentStep >= 1 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
              1. Khái niệm / Tóm tắt
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${currentStep >= 2 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
              2. Chọn công thức
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${currentStep >= 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
              3. Thay số & Kiểm tra đơn vị
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 hidden md:block">
          Quy tắc: Không tiết lộ đáp án bài kiểm tra
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isMentor = m.sender === 'mentor';
          const errDef = m.detectedError ? ERROR_TAXONOMY.find((e) => e.code === m.detectedError) : null;

          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isMentor ? 'justify-start' : 'justify-end'}`}
            >
              {isMentor && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <BrainCircuit className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                isMentor
                  ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
                  : 'bg-blue-600 text-white rounded-tr-sm'
              }`}>
                {/* Message Header */}
                <div className="flex items-center justify-between text-[11px] pb-1 border-b border-black/5 opacity-80">
                  <span className="font-semibold">
                    {isMentor ? 'Physics Mentor (Gia sư AI)' : (currentStudent?.name || 'Học sinh')}
                  </span>
                  <span>{m.timestamp}</span>
                </div>

                {/* Body Text */}
                <div className="whitespace-pre-line text-xs font-normal">
                  {m.text}
                </div>

                {/* Error Tag Notification if detected */}
                {errDef && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Nhận diện lỗi: {errDef.code} – {errDef.name}</span>
                    </div>
                    <div>{errDef.description}</div>
                    <div className="text-amber-800 font-medium">→ Hướng khắc phục: {errDef.remedy}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSubmitting && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <BrainCircuit className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 rounded-tl-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Gia sư đang phân tích bài toán và chuẩn bị gợi ý cho bạn...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Formula & Concept Suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs shrink-0">
        <span className="text-[11px] text-slate-500 font-semibold shrink-0">Hỏi nhanh:</span>
        <button
          onClick={() => handleSendMessage('Vật bắt đầu chuyển động từ trạng thái nghỉ thì vận tốc ban đầu v0 bằng bao nhiêu?')}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg shrink-0 text-[11px]"
        >
          v0 khi nghỉ = ?
        </button>
        <button
          onClick={() => handleSendMessage('Làm sao phân biệt nhanh dần đều và chậm dần đều qua dấu của a và v?')}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg shrink-0 text-[11px]"
        >
          Dấu của a và v
        </button>
        <button
          onClick={() => handleSendMessage('Đơn vị của tần số f và tần số góc omega khác nhau như thế nào?')}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg shrink-0 text-[11px]"
        >
          Đơn vị f và ω
        </button>
        <button
          onClick={() => handleSendMessage('Thầy/cô cho em xin một bài tập tương tự để em tự luyện tập lại ạ!')}
          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium rounded-lg shrink-0 text-[11px] border border-emerald-200"
        >
          Cho bài tập tương tự
        </button>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2 shrink-0 shadow-xs"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Nhập câu hỏi, bước giải hoặc kết quả em đã tính ra để Gia sư kiểm tra..."
          disabled={isSubmitting}
          className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={isSubmitting || !inputMessage.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs"
          aria-label="Gửi tin nhắn"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
