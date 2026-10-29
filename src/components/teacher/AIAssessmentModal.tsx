import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Question } from '../../types';
import { Sparkles, Check, Edit2, X, AlertCircle, ArrowRight } from 'lucide-react';

export const AIAssessmentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { selectedGrade, approveQuestion, curriculum } = useApp();

  const [grade, setGrade] = useState<10 | 11>(selectedGrade);
  const [topic, setTopic] = useState('Chuyển động thẳng biến đổi đều');
  const [objective, setObjective] = useState('Vận dụng công thức vận tốc và quãng đường');
  const [difficulty, setDifficulty] = useState('Vận dụng');
  const [count, setCount] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<Question[]>([]);
  const [approvedCount, setApprovedCount] = useState(0);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/teacher/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          topic,
          objective,
          difficulty,
          count,
          questionType: 'multiple_choice',
        }),
      });

      const data = await response.json();
      if (Array.isArray(data.questions)) {
        const formatted: Question[] = data.questions.map((q: any, idx: number) => ({
          id: `ai-gen-${Date.now()}-${idx}`,
          topicId: grade === 10 ? 'g10-cd1' : 'g11-cd1',
          grade,
          text: q.question,
          type: 'multiple_choice',
          options: q.options || ['A. ...', 'B. ...', 'C. ...', 'D. ...'],
          correctAnswer: q.correctAnswer || 'A',
          numericAnswer: q.numericAnswer,
          unit: q.unit || 'm/s',
          solutionSteps: [q.solution || 'Giải chi tiết từng bước'],
          cognitiveLevel: (difficulty as any) || 'Vận dụng',
          difficultyTier: difficulty === 'Nhận biết' ? 'foundation' : difficulty === 'Vận dụng cao' ? 'challenge' : 'application',
          objective: q.objective || objective,
          associatedError: q.commonError?.startsWith('E') ? q.commonError.slice(0, 3) : 'E01',
          isVerified: false,
          status: 'pending_approval',
        }));

        setGeneratedDrafts(formatted);
      }
    } catch (err) {
      console.error('Lỗi sinh câu hỏi:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = (question: Question) => {
    approveQuestion(question);
    setGeneratedDrafts((prev) =>
      prev.map((q) => (q.id === question.id ? { ...q, status: 'approved', isVerified: true } : q))
    );
    setApprovedCount((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Tạo bản nháp câu hỏi bằng AI & Phê duyệt sư phạm
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          AI hỗ trợ biên soạn bản nháp câu hỏi dựa trên Chương trình GDPT 2018.
          <strong> Giáo viên bắt buộc phải kiểm duyệt và phê duyệt trước khi đưa vào ngân hàng đề chính thức.</strong>
        </p>

        {/* Input Parameters */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value) as 10 | 11)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value={10}>Vật lí 10 (Động học & Động lực học)</option>
              <option value={11}>Vật lí 11 (Dao động & Sóng cơ)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chủ đề bài học:</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Chuyển động thẳng biến đổi đều..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mục tiêu đánh giá:</label>
            <input
              type="text"
              required
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Vận dụng công thức vận tốc..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mức độ nhận thức:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="Nhận biết">Nhận biết</option>
              <option value="Thông hiểu">Thông hiểu</option>
              <option value="Vận dụng">Vận dụng</option>
              <option value="Vận dụng cao">Vận dụng cao</option>
            </select>
          </div>

          <div className="sm:col-span-2 pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'AI đang biên soạn và kiểm tra số liệu...' : 'Biên soạn bản nháp câu hỏi'}</span>
            </button>
          </div>
        </form>

        {/* Generated Drafts for Teacher Approval */}
        {generatedDrafts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900">
                Bản nháp AI biên soạn ({generatedDrafts.length} câu)
              </span>
              <span className="text-emerald-700 font-semibold font-mono">
                Đã duyệt: {approvedCount} / {generatedDrafts.length}
              </span>
            </div>

            <div className="space-y-4">
              {generatedDrafts.map((draft, idx) => (
                <div
                  key={draft.id}
                  className={`p-4 rounded-xl border space-y-3 text-xs transition-all ${
                    draft.status === 'approved'
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Bản nháp #{idx + 1} · {draft.cognitiveLevel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        draft.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {draft.status === 'approved' ? 'Đã phê duyệt vào ngân hàng' : 'Chờ giáo viên duyệt'}
                    </span>
                  </div>

                  <p className="text-slate-900 font-medium leading-relaxed">{draft.text}</p>

                  {draft.options && (
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {draft.options.map((opt) => (
                        <div
                          key={opt}
                          className={`p-2 rounded border ${
                            opt.startsWith(draft.correctAnswer)
                              ? 'bg-blue-50 border-blue-300 font-bold text-blue-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] space-y-1">
                    <div className="text-slate-800">
                      <strong>Đáp án:</strong> {draft.correctAnswer} {draft.numericAnswer && `(${draft.numericAnswer} ${draft.unit || ''})`}
                    </div>
                    <div className="text-slate-600">
                      <strong>Giải thích:</strong> {draft.solutionSteps.join(' ')}
                    </div>
                  </div>

                  {draft.status !== 'approved' && (
                    <div className="pt-1 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(draft)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Phê duyệt & Đưa vào đề
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
