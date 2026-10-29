import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BrainCircuit,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Users,
  Award,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveNav, setCurrentRole, setSelectedGrade, classes, curriculum, questions } = useApp();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#111D47] via-[#1a2c6b] to-[#2563EB] text-white rounded-2xl p-6 md:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>Nền tảng EdTech Vật lí THPT · GDPT 2018</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 text-balance">
            PHYSICS MENTOR AI – Gia sư Vật lí thông minh
          </h1>

          <p className="text-base sm:text-lg text-blue-100 font-medium mb-4 italic">
            "Hiểu đúng bản chất – Tự tin giải bài – Tiến bộ mỗi ngày."
          </p>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
            Hệ thống hỗ trợ học sinh THPT (Lớp 10 & 11) tiếp cận bài toán Vật lí theo phương pháp gợi mở
            Socratic (không đưa ngay đáp án, hướng dẫn tư duy từng bước). Hỗ trợ giáo viên cá nhân hóa học tập,
            quản lý lớp học và theo dõi 9 nhóm lỗi sai điển hình.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setActiveNav('tutor')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-900/40"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Trải nghiệm Gia sư AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveNav('diagnostic')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all backdrop-blur-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kiểm tra chẩn đoán đầu vào</span>
            </button>

            <button
              onClick={() => setActiveNav('teacher_overview')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Giao diện giáo viên</span>
            </button>
          </div>
        </div>

        {/* Info card footer */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-blue-100">
          <div>
            <span className="text-slate-400 block text-[11px]">Giáo viên phụ trách:</span>
            <strong className="text-white text-sm">Phan Tố Quyên</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Đơn vị công tác:</span>
            <strong className="text-white text-sm">THPT số 1 Tuy Phước, Gia Lai</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Niên khóa & Đối tượng:</span>
            <strong className="text-white text-sm">2026–2027 · Lớp 10 & 11</strong>
          </div>
        </div>
      </section>

      {/* Socratic Philosophy Statement */}
      <section className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950 mb-1">
              Triết lý sư phạm: "Không đưa ngay đáp án – Giúp học sinh tự tìm ra đáp án"
            </h3>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Physics Mentor AI tuân thủ phương pháp giàn giáo sư phạm (scaffolding) với quy trình 7 bước và tối đa 3 tầng gợi ý:
              <strong> Tầng 1:</strong> Nhắc lại kiến thức/khái niệm cốt lõi ·
              <strong> Tầng 2:</strong> Hướng dẫn chọn công thức đúng ·
              <strong> Tầng 3:</strong> Hướng dẫn thay số, xét dấu và kiểm tra đơn vị chuẩn SI.
              Hệ thống tuyệt đối không làm hộ bài kiểm tra đang diễn ra.
            </p>
          </div>
        </div>
      </section>

      {/* Two Core P0 Modules Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hai chuyên đề chuẩn hóa P0 (GDPT 2018)</h2>
            <p className="text-xs text-slate-500">Tích hợp đầy đủ ngân hàng câu hỏi, công thức chuẩn và bộ quy tắc kiểm tra tự động</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Module 1: Grade 10 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span className="font-semibold text-blue-700">VẬT LÍ 10</span>
                <span>Chuyên đề 1 · Động học</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Chuyển động thẳng biến đổi đều
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Nắm vững mối liên hệ giữa vận tốc, gia tốc, thời gian và quãng đường. Phân biệt chuyển động nhanh dần đều và chậm dần đều.
              </p>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs space-y-1 mb-4 font-mono">
                <div className="text-slate-800">• v = v0 + at</div>
                <div className="text-slate-800">• s = v0*t + 1/2*a*t²</div>
                <div className="text-slate-800">• v² - v0² = 2as</div>
              </div>

              <div className="text-xs text-slate-500 mb-4">
                <strong>Bài toán mẫu P0:</strong> Vật bắt đầu từ trạng thái nghỉ (v0 = 0), a = 2 m/s², t = 5 s.
                <span className="block text-emerald-700 font-medium mt-1">Đáp số chuẩn: v = 10 m/s; s = 25 m.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedGrade(10);
                  setActiveNav('smart_practice');
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Luyện tập chuyên đề 10 <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelectedGrade(10);
                  setActiveNav('tutor');
                }}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1 bg-slate-100 rounded-lg"
              >
                Hỏi Gia sư AI
              </button>
            </div>
          </div>

          {/* Module 2: Grade 11 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span className="font-semibold text-indigo-700">VẬT LÍ 11</span>
                <span>Chuyên đề 2 · Dao động</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Dao động điều hòa & Các đại lượng đặc trưng
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Hiểu rõ chu kì T, tần số f, tần số góc ω, pha dao động và phương trình li độ, vận tốc, gia tốc.
              </p>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs space-y-1 mb-4 font-mono">
                <div className="text-slate-800">• x = A*cos(ωt + φ)</div>
                <div className="text-slate-800">• T = 1/f = 2π / ω</div>
                <div className="text-slate-800">• ω = 2πf = 2π / T</div>
              </div>

              <div className="text-xs text-slate-500 mb-4">
                <strong>Bài toán mẫu P0:</strong> Vật dao động với tần số f = 2 Hz.
                <span className="block text-indigo-700 font-medium mt-1">Đáp số chuẩn: T = 0,5 s; ω = 4π rad/s (≈ 12,57 rad/s).</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedGrade(11);
                  setActiveNav('smart_practice');
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Luyện tập chuyên đề 11 <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelectedGrade(11);
                  setActiveNav('tutor');
                }}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1 bg-slate-100 rounded-lg"
              >
                Hỏi Gia sư AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 User Modes & Privacy Ethics */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Phân quyền 3 chế độ người dùng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4 text-blue-600" />
              <span>A. Giáo viên</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-3">
              Quản lý lớp học, tạo đề thi AI, phê duyệt câu hỏi, xem kết quả thực tế, phát hiện lỗi sai E01-E09, điều chỉnh lộ trình và xuất minh chứng dự thi.
            </p>
            <button
              onClick={() => {
                setCurrentRole('teacher');
                setActiveNav('teacher_overview');
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Chuyển sang Giáo viên →
            </button>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-sm">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>B. Học sinh</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-3">
              Vào lớp bằng mã tham gia, làm bài kiểm tra chẩn đoán, học theo lộ trình cá nhân hóa, trò chuyện với Gia sư AI và theo dõi sự tiến bộ của chính mình.
            </p>
            <button
              onClick={() => {
                setCurrentRole('student');
                setActiveNav('learning_path');
              }}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Chuyển sang Học sinh →
            </button>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>C. Khách demo</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-3">
              Trải nghiệm dữ liệu giả lập có gắn nhãn cảnh báo bắt buộc, không truy cập dữ liệu học sinh thật, an toàn tuyệt đối cho kiểm thử và tham quan.
            </p>
            <button
              onClick={() => {
                setCurrentRole('demo');
                setActiveNav('impact_evidence');
              }}
              className="text-amber-700 font-semibold hover:underline"
            >
              Xem chế độ Demo →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
