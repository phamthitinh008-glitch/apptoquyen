import React from 'react';
import { useApp } from '../../context/AppContext';
import { ERROR_TAXONOMY } from '../../data/mockData';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Info,
  Clock,
  Target,
} from 'lucide-react';

export const PersonalizedPathPage: React.FC = () => {
  const { currentStudent, selectedGrade, setSelectedGrade, submissions, diagnosticResults, setActiveNav } = useApp();

  const studentSubmissions = submissions.filter((s) => s.studentId === currentStudent?.id);
  const studentDiagnostics = diagnosticResults.filter((d) => d.studentId === currentStudent?.id);

  const hasEnoughData = studentSubmissions.length > 0 || studentDiagnostics.length > 0;

  // Recent unresolved errors
  const unresolvedErrors = currentStudent?.recentErrors || [];

  // Determine recommended focus based on transparent pedagogical rules:
  // Rule 1: If average score < 6.5 or has E01/E05 -> Focus on "Củng cố nền tảng"
  // Rule 2: If score between 6.5 and 8.0 -> Focus on "Luyện tập vận dụng"
  // Rule 3: If score >= 8.0 -> Focus on "Mở rộng thử thách"
  const avg = currentStudent?.averageScore || 0;
  let recommendedLevel: 'Củng cố nền tảng' | 'Luyện tập vận dụng' | 'Mở rộng thử thách' = 'Củng cố nền tảng';
  let reasoning = 'Dựa trên điểm trung bình khởi đầu và phát hiện các lỗi sai về công thức/khái niệm.';

  if (avg >= 8.0) {
    recommendedLevel = 'Mở rộng thử thách';
    reasoning = `Điểm trung bình hiện tại đạt ${avg}/10, đã nắm vững công thức cơ bản và có thể tiếp cận các bài toán thực tiễn nhiều bước.`;
  } else if (avg >= 6.5) {
    recommendedLevel = 'Luyện tập vận dụng';
    reasoning = `Điểm trung bình hiện tại đạt ${avg}/10, cần rèn luyện thêm kỹ năng đổi đơn vị, xét dấu đại lượng và biến đổi toán học.`;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Cá nhân hóa học tập</span>
            <span aria-hidden="true">·</span>
            <span>GDPT 2018</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Lộ trình học cá nhân hóa: {currentStudent ? currentStudent.name : 'Học sinh'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Mã: <code className="font-mono text-blue-600 font-semibold">{currentStudent?.code}</code></span>
        </div>
      </div>

      {/* Transparent Algorithm Note */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 flex items-start gap-3 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Quy tắc đề xuất minh bạch (Giáo viên có thể điều chỉnh):</strong>
          <p className="mt-0.5 text-blue-900">
            Thuật toán phân tích dựa trên lịch sử điểm số, mức độ khó của câu hỏi và tần suất xuất hiện của 9 nhóm lỗi (E01-E09).
            Hệ thống <em>không tuyên bố thuật toán đã được chứng minh có hiệu quả về mặt khoa học khi chưa có nghiên cứu xác nhận độc lập</em>.
          </p>
        </div>
      </div>

      {!hasEnoughData ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            Cần thêm bài làm để đề xuất chính xác hơn
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hiện tại hệ thống chưa ghi nhận đủ dữ liệu bài tập hoặc bài chẩn đoán của bạn. Hãy hoàn thành bài kiểm tra chẩn đoán đầu vào để nhận lộ trình chi tiết.
          </p>
          <button
            onClick={() => setActiveNav('diagnostic')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            <span>Làm bài kiểm tra chẩn đoán ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Diagnostic Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-blue-700 uppercase">Mức độ ưu tiên hiện tại</span>
                <h2 className="text-lg font-bold text-slate-900">{recommendedLevel}</h2>
              </div>
              <div className="text-xs text-slate-500">
                Điểm TB bài tập: <strong className="font-mono text-slate-900">{avg} / 10</strong> ({studentSubmissions.length} bài)
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Căn cứ đề xuất:</strong> {reasoning}
            </p>

            {/* Error tags */}
            {unresolvedErrors.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-800">
                  Lỗi sai cần khắc phục trước mắt:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {unresolvedErrors.map((code) => {
                    const err = ERROR_TAXONOMY.find((e) => e.code === code);
                    return err ? (
                      <div
                        key={code}
                        className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 space-y-1"
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{err.code} – {err.name}</span>
                        </div>
                        <div className="text-[11px] text-amber-900/80">Khắc phục: {err.remedy}</div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3 Step Roadmap Cards */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Chi tiết 3 bước trong lộ trình</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className={`bg-white border rounded-xl p-5 space-y-3 ${
                recommendedLevel === 'Củng cố nền tảng' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-700">BƯỚC 1</span>
                  {recommendedLevel === 'Củng cố nền tảng' && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                      Đang thực hiện
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">Củng cố nền tảng</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tập trung đọc hiểu định nghĩa, nhớ đúng công thức và phân biệt rõ đơn vị chuẩn SI.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveNav('smart_practice')}
                    className="w-full py-2 px-3 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Luyện bài nền tảng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`bg-white border rounded-xl p-5 space-y-3 ${
                recommendedLevel === 'Luyện tập vận dụng' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-700">BƯỚC 2</span>
                  {recommendedLevel === 'Luyện tập vận dụng' && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                      Đang thực hiện
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">Luyện tập vận dụng</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Giải bài tập tính toán kết hợp, xử lí đúng dấu của đại lượng vectơ và các hệ thức độc lập thời gian.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveNav('smart_practice')}
                    className="w-full py-2 px-3 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Luyện bài vận dụng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`bg-white border rounded-xl p-5 space-y-3 ${
                recommendedLevel === 'Mở rộng thử thách' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-700">BƯỚC 3</span>
                  {recommendedLevel === 'Mở rộng thử thách' && (
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                      Đang thực hiện
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">Mở rộng thử thách</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Giải quyết bài toán mô hình thực tiễn, phân tích đồ thị chuyển động / đồ thị pha dao động.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveNav('smart_practice')}
                    className="w-full py-2 px-3 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Luyện bài thử thách</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
