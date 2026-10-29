import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassRoom, Assignment } from '../../types';
import {
  Users,
  Plus,
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  UserPlus,
  X,
  FileText,
} from 'lucide-react';

export const ClassManagementPage: React.FC<{ onOpenAIGenerator: () => void }> = ({ onOpenAIGenerator }) => {
  const { classes, addClass, addStudentsToClass, students, assignments, createAssignment, submissions } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Form states for creating class
  const [classNameInput, setClassNameInput] = useState('');
  const [gradeInput, setGradeInput] = useState<10 | 11>(10);
  const [classCodeInput, setClassCodeInput] = useState('');

  // Form states for adding students (CSV or line-by-line)
  const [csvTextInput, setCsvTextInput] = useState('');

  // Form states for assignment
  const [asgTitle, setAsgTitle] = useState('');
  const [asgGrade, setAsgGrade] = useState<10 | 11>(10);
  const [asgDeadline, setAsgDeadline] = useState('2026-11-15');
  const [asgIsExam, setAsgIsExam] = useState(false);

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === currentClass?.id);

  // Submissions for this class
  const classSubmissions = submissions.filter((sub) => {
    const stu = students.find((s) => s.id === sub.studentId);
    return stu?.classId === currentClass?.id;
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim() || !classCodeInput.trim()) return;

    addClass({
      name: classNameInput.trim(),
      grade: gradeInput,
      code: classCodeInput.trim().toUpperCase(),
      academicYear: '2026-2027',
      teacherName: 'Phan Tố Quyên',
    });

    setClassNameInput('');
    setClassCodeInput('');
    setIsCreateClassModalOpen(false);
  };

  const handleImportStudents = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvTextInput.trim() || !currentClass) return;

    // Parse CSV lines: "Tên, Mã" or "Mã, Tên"
    const lines = csvTextInput.split('\n');
    const parsedList: { name: string; code: string }[] = [];

    lines.forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        // If first part starts with HS or numbers, it's code; else first is name
        if (parts[0].toUpperCase().startsWith('HS') || parts[0].toUpperCase().startsWith('STU')) {
          parsedList.push({ code: parts[0], name: parts[1] });
        } else {
          parsedList.push({ name: parts[0], code: parts[1] });
        }
      } else if (parts.length === 1 && parts[0]) {
        parsedList.push({
          name: parts[0],
          code: `HS${currentClass.grade}-${Math.floor(100 + Math.random() * 900)}`,
        });
      }
    });

    if (parsedList.length > 0) {
      addStudentsToClass(currentClass.id, parsedList);
      setCsvTextInput('');
      setIsAddStudentModalOpen(false);
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim() || !currentClass) return;

    createAssignment({
      classId: currentClass.id,
      title: asgTitle.trim(),
      topicId: asgGrade === 10 ? 'g10-cd1' : 'g11-cd1',
      grade: asgGrade,
      deadline: asgDeadline,
      questionIds: asgGrade === 10 ? ['q-10-01', 'q-10-02', 'q-10-03', 'q-10-04'] : ['q-11-01', 'q-11-02', 'q-11-03', 'q-11-04'],
      totalQuestions: 4,
      isExamMode: asgIsExam,
      allowImmediateFeedback: !asgIsExam,
    });

    setAsgTitle('');
    setIsAssignModalOpen(false);
  };

  const exportClassCSV = () => {
    if (!currentClass) return;
    const headers = ['Mã học sinh', 'Họ và tên', 'Lớp', 'Số bài đã nộp', 'Điểm trung bình', 'Lỗi sai thường gặp'];
    const rows = classStudents.map((s) => [
      `"${s.code}"`,
      `"${s.name}"`,
      `"${currentClass.name}"`,
      s.completedAssignments,
      s.averageScore,
      `"${s.recentErrors.join(', ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BangDiem_${currentClass.code}_2026_2027.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Quản trị giảng dạy</span>
            <span aria-hidden="true">·</span>
            <span>Năm học 2026–2027</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Quản lý lớp học & Giao bài tập</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateClassModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tạo lớp mới
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Giao bài cho lớp
          </button>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {classes.map((cls) => {
          const isSelected = cls.id === currentClass?.id;
          const count = students.filter((s) => s.classId === cls.id).length;

          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{cls.name}</span>
                <span className={`text-[11px] font-normal ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                  ({count} HS)
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Class Details Card */}
      {currentClass && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentClass.name}</h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Mã vào lớp: <code className="font-mono font-semibold text-blue-600">{currentClass.code}</code> · Giáo viên: {currentClass.teacherName} · Khối: {currentClass.grade}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddStudentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" /> Thêm học sinh / Nhập CSV
              </button>
              <button
                onClick={exportClassCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Xuất bảng điểm CSV"
              >
                <Download className="w-3.5 h-3.5" /> Xuất CSV
              </button>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span>Danh sách học sinh trong lớp ({classStudents.length})</span>
              <span>Tổng số bài nộp: {classSubmissions.length}</span>
            </div>

            {classStudents.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                Lớp chưa có học sinh nào. Bấm "Thêm học sinh / Nhập CSV" để thêm danh sách.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Mã định danh</th>
                      <th className="py-2.5 px-3 font-semibold">Họ và tên</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Số bài đã nộp</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Điểm TB</th>
                      <th className="py-2.5 px-3 font-semibold">Lỗi sai gần đây</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono text-slate-600 font-medium">{s.code}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{s.name}</td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums">{s.completedAssignments}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold tabular-nums text-slate-800">
                          {s.completedAssignments > 0 ? `${s.averageScore} / 10` : '—'}
                        </td>
                        <td className="py-2.5 px-3">
                          {s.recentErrors.length > 0 ? (
                            <div className="flex items-center gap-1">
                              {s.recentErrors.map((code) => (
                                <span key={code} className="font-mono bg-amber-50 text-amber-800 px-1 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                                  {code}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Không ghi nhận</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`text-[11px] font-medium ${
                              s.completedAssignments > 0 ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {s.completedAssignments > 0 ? 'Đang học' : 'Chưa nộp bài'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Class */}
      {isCreateClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsCreateClassModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-1">Tạo lớp học mới</h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập thông tin lớp học phụ trách tại THPT số 1 Tuy Phước.
            </p>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên lớp học:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lớp 10A2 (THPT số 1 Tuy Phước)"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
                <select
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value) as 10 | 11)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>Lớp 10 (Chương trình GDPT 2018)</option>
                  <option value={11}>Lớp 11 (Chương trình GDPT 2018)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã tham gia lớp học:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: PHY10-TP03"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateClassModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Tạo lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Students / Import CSV */}
      {isAddStudentModalOpen && currentClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative">
            <button
              onClick={() => setIsAddStudentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Thêm học sinh vào {currentClass.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập danh sách theo định dạng: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">Họ và tên, Mã định danh</code> (mỗi học sinh một dòng) hoặc copy từ Excel.
            </p>

            <form onSubmit={handleImportStudents} className="space-y-4 text-xs">
              <div>
                <textarea
                  rows={6}
                  required
                  placeholder={`Nguyễn Văn An, HS10-011\nTrần Thị Bích, HS10-012\nLê Quang Dũng, HS10-013`}
                  value={csvTextInput}
                  onChange={(e) => setCsvTextInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Hỗ trợ cả trường hợp chỉ dán họ tên.</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentModalOpen(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    Nhập danh sách
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Assignment */}
      {isAssignModalOpen && currentClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Giao bài cho {currentClass.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cài đặt tên bài, hạn nộp và chế độ khóa gợi ý AI trong khi kiểm tra.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề bài kiểm tra / bài tập:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bài kiểm tra tuần: Chuyển động biến đổi đều"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khối:</label>
                  <select
                    value={asgGrade}
                    onChange={(e) => setAsgGrade(Number(e.target.value) as 10 | 11)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>Lớp 10</option>
                    <option value={11}>Lớp 11</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hạn hoàn thành:</label>
                  <input
                    type="date"
                    required
                    value={asgDeadline}
                    onChange={(e) => setAsgDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={asgIsExam}
                    onChange={(e) => setAsgIsExam(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Chế độ bài kiểm tra tính điểm chính thức
                    </span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                      Khi bật, Gia sư AI sẽ tuân thủ nghiêm ngặt quy tắc không tiết lộ công thức hoặc giải hộ trước khi học sinh nộp bài.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Giao bài ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
