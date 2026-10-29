import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Question, ErrorCode } from '../../types';
import { ERROR_TAXONOMY } from '../../data/mockData';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  Check,
  X,
} from 'lucide-react';

export const DiagnosticTestPage: React.FC = () => {
  const {
    selectedGrade,
    setSelectedGrade,
    questions,
    saveDiagnosticResult,
    currentStudent,
    setActiveNav,
  } = useApp();

  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(15 * 60); // 15 mins

  // Filter verified diagnostic questions for this grade
  const gradeQuestions = questions.filter(
    (q) => q.grade === selectedGrade && q.status === 'approved'
  );

  const handleStartTest = () => {
    setAnswers({});
    setTestFinished(false);
    setTimeRemaining(15 * 60);
    setTestStarted(true);
  };

  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  // Evaluation algorithm
  const evaluateTest = () => {
    let scoreTotal = 0;
    const detectedErrors: ErrorCode[] = [];
    const masteredList: string[] = [];
    const strugglingList: string[] = [];

    gradeQuestions.forEach((q) => {
      const studentAns = (answers[q.id] || '').trim();
      let isCorrect = false;

      if (q.type === 'multiple_choice') {
        isCorrect = studentAns.toUpperCase() === q.correctAnswer.toUpperCase();
      } else if (q.type === 'numeric_fill') {
        const numVal = parseFloat(studentAns.replace(',', '.'));
        if (q.numericAnswer !== undefined && !isNaN(numVal)) {
          const tol = q.tolerance || 0.1;
          isCorrect = Math.abs(numVal - q.numericAnswer) <= tol;
        } else {
          isCorrect = studentAns === q.correctAnswer;
        }
      }

      if (isCorrect) {
        scoreTotal += 10 / gradeQuestions.length;
        masteredList.push(q.objective);
      } else {
        strugglingList.push(q.objective);
        if (q.associatedError) {
          detectedErrors.push(q.associatedError);
        }
      }
    });

    const finalScore = Math.round(scoreTotal * 10) / 10;
    const answeredCount = Object.keys(answers).length;
    let confidenceLevel: 'Cao' | 'Trung bình' | 'Cần thêm bài làm' = 'Cần thêm bài làm';
    if (answeredCount >= 4) confidenceLevel = 'Cao';
    else if (answeredCount >= 2) confidenceLevel = 'Trung bình';

    let recommendedPath: 'foundation' | 'application' | 'challenge' = 'foundation';
    if (finalScore >= 8.0) recommendedPath = 'challenge';
    else if (finalScore >= 5.5) recommendedPath = 'application';

    saveDiagnosticResult({
      studentId: currentStudent?.id || 'guest',
      grade: selectedGrade,
      score: finalScore,
      totalQuestions: gradeQuestions.length,
      masteredTopics: Array.from(new Set(masteredList)),
      strugglingTopics: Array.from(new Set(strugglingList)),
      detectedErrors: Array.from(new Set(detectedErrors)),
      confidenceLevel,
      recommendedPath,
    });

    setTestFinished(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Khảo thí sư phạm</span>
            <span aria-hidden="true">·</span>
            <span>Chẩn đoán năng lực khởi đầu</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Kiểm tra chẩn đoán năng lực Vật lí {selectedGrade}
          </h1>
        </div>

        {/* Grade switch */}
        {!testStarted && (
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedGrade(10)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                selectedGrade === 10 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chẩn đoán Lớp 10
            </button>
            <button
              onClick={() => setSelectedGrade(11)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                selectedGrade === 11 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chẩn đoán Lớp 11
            </button>
          </div>
        )}
      </div>

      {!testStarted && !testFinished && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Mục đích của bài kiểm tra chẩn đoán
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Bài kiểm tra gồm {gradeQuestions.length} câu hỏi nhằm phát hiện sớm các khoảng trống kiến thức và những ngộ nhận (misconceptions) thường gặp. Hệ thống <strong>không dùng bài kiểm tra này để xếp loại năng lực cố định</strong> mà dùng để gợi ý lộ trình luyện tập phù hợp nhất cho bạn.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 mb-6">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Thời lượng đề xuất: <strong>15 phút</strong></span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chấm tự động trắc nghiệm & điền số chuẩn SI</span>
              </div>
            </div>

            <button
              onClick={handleStartTest}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              <span>Bắt đầu làm bài chẩn đoán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Taking the test */}
      {testStarted && !testFinished && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-900">
              Đang làm bài chẩn đoán Vật lí {selectedGrade} ({gradeQuestions.length} câu)
            </span>
            <span className="text-slate-600">
              Học sinh: <strong>{currentStudent?.name || 'Khách trải nghiệm'}</strong>
            </span>
          </div>

          <div className="space-y-5">
            {gradeQuestions.map((q, idx) => (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">
                    Câu {idx + 1} · {q.cognitiveLevel}
                  </span>
                  <span>{q.objective}</span>
                </div>

                <div className="text-sm font-medium text-slate-900 leading-relaxed">
                  {q.text}
                </div>

                {/* Multiple choice options */}
                {q.type === 'multiple_choice' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt) => {
                      const letter = opt.charAt(0);
                      const isSelected = answers[q.id] === letter;

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerChange(q.id, letter)}
                          className={`text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Numeric Fill Option */}
                {q.type === 'numeric_fill' && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhập kết quả số của bạn ({q.unit ? `đơn vị: ${q.unit}` : 'không có đơn vị'}):
                    </label>
                    <div className="flex items-center gap-2 max-w-xs">
                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder={`Ví dụ: ${q.correctAnswer}`}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      {q.unit && (
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-2 rounded-lg border border-slate-200">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={() => setTestStarted(false)}
              className="px-4 py-2 text-xs border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={evaluateTest}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Nộp bài & Xem chẩn đoán
            </button>
          </div>
        </div>
      )}

      {/* Test Results and Diagnostic Feedback */}
      {testFinished && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-emerald-700">HOÀN THÀNH CHẨN ĐOÁN</span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Báo cáo chẩn đoán năng lực khởi đầu
                </h2>
              </div>
              <button
                onClick={handleStartTest}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Làm lại bài
              </button>
            </div>

            {/* Diagnostic Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Strengths */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Nội dung đã nắm vững</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                  {gradeQuestions
                    .filter((q) => {
                      const ans = answers[q.id];
                      return q.type === 'multiple_choice' ? ans === q.correctAnswer : ans === q.correctAnswer;
                    })
                    .map((q) => (
                      <li key={q.id}>{q.objective}</li>
                    ))}
                  {gradeQuestions.filter((q) => answers[q.id] === q.correctAnswer).length === 0 && (
                    <li className="text-slate-500 italic">Cần làm quen thêm với các dạng bài toán cơ bản.</li>
                  )}
                </ul>
              </div>

              {/* Areas for Growth & Misconceptions */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Nội dung có dấu hiệu chưa hiểu / Cần ôn tập</span>
                </div>
                <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
                  {gradeQuestions
                    .filter((q) => answers[q.id] !== q.correctAnswer)
                    .map((q) => {
                      const errDef = ERROR_TAXONOMY.find((e) => e.code === q.associatedError);
                      return (
                        <li key={q.id}>
                          {q.objective}
                          {errDef && (
                            <span className="text-[11px] text-amber-800 block ml-4">
                              → Dấu hiệu: {errDef.code} - {errDef.name} ({errDef.remedy})
                            </span>
                          )}
                        </li>
                      );
                    })}
                  {gradeQuestions.filter((q) => answers[q.id] !== q.correctAnswer).length === 0 && (
                    <li className="text-emerald-700 italic">Xuất sắc! Bạn đã trả lời đúng tất cả các câu hỏi chẩn đoán.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Confidence & Pedagogical Note */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
              <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">
                  Khuyến nghị sư phạm & Lộ trình tiếp theo:
                </strong>
                Hệ thống đề xuất bạn bắt đầu với <strong>Lộ trình học cá nhân</strong> hoặc trò chuyện trực tiếp với <strong>Gia sư Physics AI</strong> để được giàn giáo từng bước giải quyết các lỗi sai vừa phát hiện.
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveNav('learning_path')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
              >
                <span>Xem lộ trình cá nhân đề xuất</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveNav('tutor')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
              >
                <span>Mở Gia sư Physics AI để giải thích lỗi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
