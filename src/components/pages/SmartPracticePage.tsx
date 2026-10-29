import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Question, ErrorCode } from '../../types';
import { ERROR_TAXONOMY } from '../../data/mockData';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calculator,
  RotateCcw,
  HelpCircle,
  Award,
} from 'lucide-react';

export const SmartPracticePage: React.FC = () => {
  const { selectedGrade, setSelectedGrade, questions, setActiveNav } = useApp();

  const [activeTier, setActiveTier] = useState<'foundation' | 'application' | 'challenge'>('foundation');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [detectedError, setDetectedError] = useState<ErrorCode | null>(null);
  const [customExplanation, setCustomExplanation] = useState<string>('');

  // Filter questions by grade and tier
  const tierQuestions = questions.filter(
    (q) => q.grade === selectedGrade && q.difficultyTier === activeTier && q.status === 'approved'
  );

  const currentQ: Question | undefined = tierQuestions[activeQuestionIndex] || tierQuestions[0];

  const handleTierChange = (tier: 'foundation' | 'application' | 'challenge') => {
    setActiveTier(tier);
    setActiveQuestionIndex(0);
    setUserAnswer('');
    setSubmitted(false);
    setDetectedError(null);
    setCustomExplanation('');
  };

  const checkAnswer = () => {
    if (!currentQ || !userAnswer.trim()) return;

    const trimmed = userAnswer.trim();
    let correct = false;
    let errCode: ErrorCode | null = null;
    let explanation = '';

    if (currentQ.type === 'multiple_choice') {
      correct = trimmed.toUpperCase() === currentQ.correctAnswer.toUpperCase();
      if (!correct) {
        errCode = currentQ.associatedError || 'E01';
      }
    } else if (currentQ.type === 'numeric_fill') {
      const num = parseFloat(trimmed.replace(',', '.'));
      if (currentQ.numericAnswer !== undefined && !isNaN(num)) {
        const tol = currentQ.tolerance || 0.1;
        correct = Math.abs(num - currentQ.numericAnswer) <= tol;

        if (!correct) {
          // Special diagnostic check for Sample Problem 1 (Grade 10)
          if (currentQ.id === 'q-10-01' || currentQ.id === 'q-10-02') {
            // Did student confuse v and s?
            // For v (target 10): did student enter 25 (s)?
            if (currentQ.id === 'q-10-01' && Math.abs(num - 25) <= 0.1) {
              errCode = 'E01';
              explanation = 'Bạn đã tính ra 25 m – đây là quãng đường s = v0*t + 1/2*a*t², không phải vận tốc tức thời v = v0 + at!';
            } else if (currentQ.id === 'q-10-02' && Math.abs(num - 10) <= 0.1) {
              errCode = 'E01';
              explanation = 'Bạn đã tính ra 10 m/s – đây là vận tốc tức thời v = v0 + at, không phải quãng đường s = v0*t + 1/2*a*t²!';
            } else if (currentQ.id === 'q-10-02' && Math.abs(num - 50) <= 0.1) {
              errCode = 'E01';
              explanation = 'Bạn đã dùng công thức chuyển động thẳng đều s = v*t (hoặc quên hệ số 1/2 trong 1/2*a*t²)!';
            } else {
              errCode = 'E02';
              explanation = 'Kết quả số chưa chính xác. Hãy kiểm tra lại phép nhân và thay số vào công thức.';
            }
          } else if (currentQ.id === 'q-11-01' || currentQ.id === 'q-11-02') {
            // Special diagnostic check for Sample Problem 2 (Grade 11)
            // Did student confuse T (0.5s) and omega (4pi ≈ 12.57) or invert?
            if (currentQ.id === 'q-11-01' && Math.abs(num - 2) <= 0.1) {
              errCode = 'E06';
              explanation = 'Bạn đã lấy T = f = 2s! Lưu ý chu kì là nghịch đảo của tần số: T = 1/f = 1/2 = 0,5 s.';
            } else if (currentQ.id === 'q-11-02' && (Math.abs(num - 4) <= 0.1 || Math.abs(num - 2) <= 0.1)) {
              errCode = 'E05';
              explanation = 'Tần số góc omega = 2*pi*f = 2 * pi * 2 = 4pi ≈ 12,57 rad/s. Bạn hãy chú ý nhân thêm số pi (3,1416).';
            } else {
              errCode = 'E05';
              explanation = 'Hãy xem lại mối liên hệ giữa chu kì T, tần số f và tần số góc omega.';
            }
          } else {
            errCode = currentQ.associatedError || 'E02';
          }
        }
      } else {
        correct = trimmed === currentQ.correctAnswer;
        if (!correct) errCode = currentQ.associatedError || 'E02';
      }
    }

    setIsCorrect(correct);
    setDetectedError(errCode);
    setCustomExplanation(explanation);
    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (activeQuestionIndex < tierQuestions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      setUserAnswer('');
      setSubmitted(false);
      setDetectedError(null);
      setCustomExplanation('');
    }
  };

  const resetCurrentQuestion = () => {
    setUserAnswer('');
    setSubmitted(false);
    setDetectedError(null);
    setCustomExplanation('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Luyện tập thông minh theo cấp độ</span>
            <span aria-hidden="true">·</span>
            <span>GDPT 2018</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Luyện tập thông minh Vật lí {selectedGrade}
          </h1>
        </div>

        {/* Grade switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => {
              setSelectedGrade(10);
              setActiveQuestionIndex(0);
              setSubmitted(false);
            }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedGrade === 10 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lớp 10 (Động học)
          </button>
          <button
            onClick={() => {
              setSelectedGrade(11);
              setActiveQuestionIndex(0);
              setSubmitted(false);
            }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedGrade === 11 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lớp 11 (Dao động)
          </button>
        </div>
      </div>

      {/* 3 Activity Tiers Filter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleTierChange('foundation')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeTier === 'foundation'
              ? 'bg-blue-50/60 border-blue-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            Cấp độ 1
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1">Củng cố nền tảng</div>
          <p className="text-xs text-slate-500">
            Ôn khái niệm, đại lượng, công thức cốt lõi và câu hỏi đơn giản.
          </p>
        </button>

        <button
          onClick={() => handleTierChange('application')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeTier === 'application'
              ? 'bg-indigo-50/60 border-indigo-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            Cấp độ 2
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1">Luyện tập vận dụng</div>
          <p className="text-xs text-slate-500">
            Giải bài tập cơ bản, biến đổi công thức và xử lí đại lượng có dấu/chiều.
          </p>
        </button>

        <button
          onClick={() => handleTierChange('challenge')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeTier === 'challenge'
              ? 'bg-purple-50/60 border-purple-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            Cấp độ 3
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1">Mở rộng thử thách</div>
          <p className="text-xs text-slate-500">
            Giải quyết tình huống thực tiễn và bài tập yêu cầu lập luận nhiều bước.
          </p>
        </button>
      </div>

      {/* Interactive Exercise Card */}
      {!currentQ ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
          Chưa có câu hỏi trong cấp độ này cho Khối {selectedGrade}. Hãy chọn cấp độ khác.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          {/* Question Header & Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-700">
              Câu {activeQuestionIndex + 1} / {tierQuestions.length} · Mức độ: {currentQ.cognitiveLevel}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-mono">Mục tiêu: {currentQ.objective}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-sm font-semibold text-slate-900 leading-relaxed">
            {currentQ.text}
          </div>

          {/* Interactive Input based on type */}
          {!submitted ? (
            <div className="space-y-4 pt-2">
              {currentQ.type === 'multiple_choice' && currentQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQ.options.map((opt) => {
                    const letter = opt.charAt(0);
                    const isSelected = userAnswer === letter;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setUserAnswer(letter)}
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

              {currentQ.type === 'numeric_fill' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Nhập kết quả số của bạn {currentQ.unit && `(Đơn vị: ${currentQ.unit})`}:
                  </label>
                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Ví dụ: 10 hoặc 25"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    {currentQ.unit && (
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 shrink-0">
                        {currentQ.unit}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveNav('tutor')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Chưa biết cách làm? Hỏi Gia sư Physics AI</span>
                </button>

                <button
                  type="button"
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Kiểm tra đáp án
                </button>
              </div>
            </div>
          ) : (
            /* Submission Feedback with Error Classification */
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Chính xác tuyệt vời!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                        <span>Chưa chính xác!</span>
                      </>
                    )}
                  </div>
                  <span className="font-mono text-xs font-semibold">
                    Bạn chọn: {userAnswer} {currentQ.unit || ''}
                  </span>
                </div>

                {customExplanation && (
                  <p className="font-medium text-rose-900 pt-1">{customExplanation}</p>
                )}

                {/* If error detected, show specific remedy */}
                {detectedError && (
                  <div className="p-3 bg-white/80 rounded-lg border border-rose-200 space-y-1 text-slate-800 mt-2">
                    {(() => {
                      const err = ERROR_TAXONOMY.find((e) => e.code === detectedError);
                      return err ? (
                        <>
                          <div className="font-bold text-rose-800">
                            Phát hiện lỗi: {err.code} – {err.name}
                          </div>
                          <div className="text-[11px] text-slate-600">{err.description}</div>
                          <div className="text-[11px] text-emerald-800 font-medium">
                            💡 Khắc phục: {err.remedy}
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Step-by-step verified solution */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Lời giải chi tiết được kiểm chứng sư phạm:</span>
                </div>
                <div className="space-y-1 text-slate-700 pl-5 list-decimal font-mono text-[11px]">
                  {currentQ.solutionSteps.map((step, sIdx) => (
                    <div key={sIdx}>• {step}</div>
                  ))}
                </div>
                <div className="pt-2 text-slate-900 font-semibold">
                  Đáp số chuẩn: <span className="font-mono text-blue-700">{currentQ.correctAnswer} {currentQ.unit || ''}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetCurrentQuestion}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Làm lại câu này
                </button>

                {activeQuestionIndex < tierQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveNav('learning_path')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <span>Xem lộ trình cá nhân hóa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
