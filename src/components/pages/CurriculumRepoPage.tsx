import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopicLesson } from '../../types';
import {
  BookOpen,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';

export const CurriculumRepoPage: React.FC = () => {
  const {
    curriculum,
    selectedGrade,
    setSelectedGrade,
    currentRole,
    toggleHideLesson,
    deleteCurriculumLesson,
    addCurriculumLesson,
    setActiveNav,
  } = useApp();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new lesson
  const [newTitle, setNewTitle] = useState('');
  const [newTopicCode, setNewTopicCode] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newCoreConcepts, setNewCoreConcepts] = useState('');
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaLatex, setNewFormulaLatex] = useState('');
  const [newFormulaUnit, setNewFormulaUnit] = useState('');
  const [newExampleProblem, setNewExampleProblem] = useState('');
  const [newExampleSolution, setNewExampleSolution] = useState('');

  const gradeLessons = curriculum.filter((l) => l.grade === selectedGrade);
  const activeLesson = curriculum.find((l) => l.id === activeLessonId) || gradeLessons[0];

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopicCode.trim()) return;

    addCurriculumLesson({
      grade: selectedGrade,
      topicCode: newTopicCode.trim(),
      title: newTitle.trim(),
      objective: newObjective.trim() || 'Nắm vững kiến thức trọng tâm',
      coreConcepts: newCoreConcepts.split('\n').filter((c) => c.trim().length > 0),
      keyFormulas: [
        {
          name: newFormulaName.trim() || 'Công thức chuẩn',
          latex: newFormulaLatex.trim() || 'y = f(x)',
          explanation: 'Công thức ứng dụng',
          units: newFormulaUnit.trim() || 'SI',
        },
      ],
      commonErrors: [
        { code: 'E01', description: 'Chọn sai công thức khi chưa xác định đúng loại hiện tượng' },
        { code: 'E03', description: 'Không đổi đơn vị sang hệ SI' },
      ],
      workedExample: {
        problem: newExampleProblem.trim() || 'Bài toán mẫu minh họa...',
        solution: newExampleSolution.trim() || 'Hướng dẫn giải chi tiết...',
      },
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewTopicCode('');
    setNewObjective('');
    setNewCoreConcepts('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Học liệu chuẩn hóa GDPT 2018</span>
            <span aria-hidden="true">·</span>
            <span>Khối 10 & 11</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Kho học liệu & Ngân hàng chuyên đề Vật lí {selectedGrade}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Grade Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedGrade(10)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                selectedGrade === 10 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chương trình Lớp 10
            </button>
            <button
              onClick={() => setSelectedGrade(11)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                selectedGrade === 11 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chương trình Lớp 11
            </button>
          </div>

          {currentRole === 'teacher' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm bài học mới
            </button>
          )}
        </div>
      </div>

      {/* Main Two-column layout: Lesson List on left, Detailed Viewer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lesson List Sidebar (4 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-bold text-slate-700 mb-2">
            Danh mục bài học ({gradeLessons.length} chuyên đề)
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {gradeLessons.map((lesson) => {
              const isSelected = activeLesson?.id === lesson.id;

              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    lesson.isHidden ? 'opacity-60 bg-slate-50' : ''
                  } ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-blue-700 font-semibold">{lesson.topicCode}</span>
                    {lesson.isHidden && (
                      <span className="text-slate-400 font-medium">Đang ẩn</span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {lesson.objective}
                  </p>

                  {/* Teacher actions on hover */}
                  {currentRole === 'teacher' && (
                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-slate-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleHideLesson(lesson.id);
                        }}
                        className="hover:text-slate-700 p-1"
                        title={lesson.isHidden ? 'Hiện bài học' : 'Ẩn bài học'}
                      >
                        {lesson.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Bạn có chắc chắn muốn xóa bài: "${lesson.title}"?`)) {
                            deleteCurriculumLesson(lesson.id);
                          }
                        }}
                        className="hover:text-rose-600 p-1"
                        title="Xóa bài học"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Lesson Content (7 cols) */}
        <div className="lg:col-span-7">
          {!activeLesson ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
              Chọn một bài học từ danh sách bên trái để xem nội dung chi tiết.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              {/* Lesson Title & Objective */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs text-blue-600 font-mono font-semibold mb-1">
                  <span>{activeLesson.topicCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>Khối {activeLesson.grade}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">{activeLesson.title}</h2>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  <strong>Mục tiêu:</strong> {activeLesson.objective}
                </div>
              </div>

              {/* Core Concepts */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Kiến thức cốt lõi
                </h3>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside bg-slate-50/50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                  {activeLesson.coreConcepts.map((concept, idx) => (
                    <li key={idx}>{concept}</li>
                  ))}
                </ul>
              </div>

              {/* Formulas & Units */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Công thức & Đơn vị chuẩn SI
                </h3>
                <div className="space-y-2">
                  {activeLesson.keyFormulas.map((formula, fIdx) => (
                    <div key={fIdx} className="p-3 bg-blue-50/40 border border-blue-100 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-blue-950">{formula.name}</strong>
                        <span className="font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 font-semibold">
                          {formula.latex}
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px]">{formula.explanation}</div>
                      <div className="text-slate-500 text-[11px] font-mono">Đơn vị: {formula.units}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Errors & Misconceptions */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Các lỗi sai thường gặp (E01–E09)
                </h3>
                <div className="space-y-1.5">
                  {activeLesson.commonErrors.map((err, eIdx) => (
                    <div key={eIdx} className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg text-xs flex items-start gap-2 text-amber-950">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-mono text-amber-900">{err.code}:</strong> {err.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Worked Example */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4. Ví dụ mẫu & Hướng dẫn giải
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                  <div className="font-semibold text-slate-900">
                    Bài toán: {activeLesson.workedExample.problem}
                  </div>
                  <div className="text-slate-700 whitespace-pre-line font-mono text-[11px] bg-white p-3 rounded border border-slate-200">
                    {activeLesson.workedExample.solution}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveNav('tutor')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
                >
                  <span>Mở Gia sư AI cho bài học này</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Curriculum Lesson */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Thêm bài học mới vào Kho học liệu Lớp {selectedGrade}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập đầy đủ thông tin chuẩn hóa theo cấu trúc GDPT 2018.
            </p>

            <form onSubmit={handleCreateLesson} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã bài học:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: K10-C2-B02"
                    value={newTopicCode}
                    onChange={(e) => setNewTopicCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên bài học:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Lực ma sát và lực cản"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mục tiêu học tập:</label>
                <input
                  type="text"
                  placeholder="Mô tả mục tiêu năng lực..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kiến thức cốt lõi (mỗi ý một dòng):
                </label>
                <textarea
                  rows={3}
                  placeholder={`Lực ma sát trượt tỉ lệ với áp lực: F_mst = mu * N\nLực ma sát nghỉ giữ cho vật không bị trượt`}
                  value={newCoreConcepts}
                  onChange={(e) => setNewCoreConcepts(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên công thức:</label>
                  <input
                    type="text"
                    placeholder="Lực ma sát trượt"
                    value={newFormulaName}
                    onChange={(e) => setNewFormulaName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Công thức (LaTeX/Text):</label>
                  <input
                    type="text"
                    placeholder="F_mst = mu * N"
                    value={newFormulaLatex}
                    onChange={(e) => setNewFormulaLatex(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đơn vị:</label>
                  <input
                    type="text"
                    placeholder="N (Newton)"
                    value={newFormulaUnit}
                    onChange={(e) => setNewFormulaUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ví dụ mẫu:</label>
                <input
                  type="text"
                  placeholder="Kéo vật 10kg trên mặt sàn với hệ số ma sát mu = 0.1..."
                  value={newExampleProblem}
                  onChange={(e) => setNewExampleProblem(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lời giải mẫu:</label>
                <textarea
                  rows={2}
                  placeholder="Áp lực N = mg = 10 * 9.8 = 98 N => F_mst = 0.1 * 98 = 9.8 N"
                  value={newExampleSolution}
                  onChange={(e) => setNewExampleSolution(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Lưu bài học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
