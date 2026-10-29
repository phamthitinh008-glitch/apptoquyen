import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ERROR_TAXONOMY } from '../../data/mockData';
import { ErrorCode } from '../../types';
import {
  Users,
  GraduationCap,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';

export const TeacherDashboard: React.FC<{ onOpenAIGenerator: () => void }> = ({ onOpenAIGenerator }) => {
  const { classes, students, assignments, submissions, setActiveNav, selectedGrade } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  // Filter students and submissions
  const filteredStudents = selectedClassId === 'all'
    ? students
    : students.filter((s) => s.classId === selectedClassId);

  const filteredSubmissions = selectedClassId === 'all'
    ? submissions
    : submissions.filter((sub) => {
        const student = students.find((s) => s.id === sub.studentId);
        return student?.classId === selectedClassId;
      });

  const totalClasses = classes.length;
  const totalStudents = filteredStudents.length;
  const totalSubmissions = filteredSubmissions.length;

  const avgScore = totalSubmissions > 0
    ? (filteredSubmissions.reduce((acc, curr) => acc + curr.score, 0) / totalSubmissions).toFixed(1)
    : null;

  // Students needing extra pedagogical support (score < 6.5 or has >= 2 recent errors)
  const studentsNeedingSupport = filteredStudents.filter(
    (s) => s.completedAssignments > 0 && (s.averageScore < 6.5 || s.recentErrors.length >= 2)
  );

  // Error distribution E01 - E09 calculation strictly from submissions
  const errorCounts: Record<ErrorCode, number> = {
    E01: 0,
    E02: 0,
    E03: 0,
    E04: 0,
    E05: 0,
    E06: 0,
    E07: 0,
    E08: 0,
    E09: 0,
  };

  filteredSubmissions.forEach((sub) => {
    sub.answers.forEach((ans) => {
      const err = ans.teacherAdjustedError || ans.detectedError;
      if (err && errorCounts[err] !== undefined) {
        errorCounts[err] += 1;
      }
    });
  });

  const totalErrorsRecorded = Object.values(errorCounts).reduce((a, b) => a + b, 0);

  // Top misconceptions
  const topErrors = (Object.keys(errorCounts) as ErrorCode[])
    .map((code) => ({
      code,
      count: errorCounts[code],
      def: ERROR_TAXONOMY.find((e) => e.code === code),
    }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Bảng điều khiển giáo viên</span>
            <span aria-hidden="true">·</span>
            <span>THPT số 1 Tuy Phước</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">GV Phan Tố Quyên</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Tổng quan học tập & Chẩn đoán sư phạm
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Class Filter Selector */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả các lớp ({classes.length})</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenAIGenerator}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo đề AI</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Classes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Số lớp quản lý</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalClasses}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Lớp 10 & Lớp 11</div>
        </div>

        {/* Total Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Học sinh tham gia</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalStudents}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalSubmissions} lượt nộp bài thực tế
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Điểm kiểm tra TB</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {avgScore ? `${avgScore} / 10` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {avgScore ? 'Tính từ các bài đã nộp' : 'Chưa có bài nộp'}
          </div>
        </div>

        {/* Needs Support */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Cần can thiệp sư phạm</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {studentsNeedingSupport.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Có lỗi sai E01–E09 lặp lại</div>
        </div>
      </div>

      {/* Check empty state condition */}
      {totalSubmissions === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Chưa có kết quả học tập. Hãy giao bài kiểm tra đầu tiên để bắt đầu theo dõi.
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Số liệu thống kê và biểu đồ phân tích lỗi sai sẽ tự động cập nhật khi học sinh thực hiện bài kiểm tra hoặc luyện tập.
          </p>
          <button
            onClick={() => setActiveNav('classes')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" /> Giao bài kiểm tra mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Error Distribution Bar Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Phân bố lỗi sai Vật lí (Hệ thống E01 – E09)
                </h3>
                <p className="text-xs text-slate-500">
                  Tổng hợp {totalErrorsRecorded} trường hợp nhận diện qua bài làm học sinh
                </p>
              </div>
              <button
                onClick={() => setActiveNav('misconceptions')}
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Chi tiết & Điều chỉnh →
              </button>
            </div>

            {/* Error Bars */}
            <div className="space-y-3 pt-2">
              {ERROR_TAXONOMY.map((err) => {
                const count = errorCounts[err.code];
                const pct = totalErrorsRecorded > 0 ? Math.round((count / totalErrorsRecorded) * 100) : 0;

                return (
                  <div key={err.code} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {err.code}: {err.name}
                      </span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {count} lần ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action List: Students Needing Support */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Học sinh cần hỗ trợ riêng</h3>
              <p className="text-xs text-slate-500">Căn cứ vào điểm TB và lỗi sai chưa khắc phục</p>
            </div>

            {studentsNeedingSupport.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Không có học sinh nào ở mức cần can thiệp khẩn cấp.
              </div>
            ) : (
              <div className="space-y-2.5">
                {studentsNeedingSupport.map((stu) => (
                  <div
                    key={stu.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{stu.name}</strong>
                      <span className="font-mono font-semibold text-slate-700 tabular-nums">
                        {stu.averageScore} điểm
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Mã: {stu.code} · Lớp {stu.grade}
                    </div>
                    {stu.recentErrors.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium pt-1">
                        <span>Lỗi cần chú ý:</span>
                        {stu.recentErrors.map((code) => (
                          <span key={code} className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-[10px]">
                            {code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setActiveNav('classes')}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
              >
                Giao bài củng cố cho nhóm học sinh →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Assignments List */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Bài tập & Bài kiểm tra đã giao</h3>
            <p className="text-xs text-slate-500">Theo dõi tiến độ hoàn thành theo từng lớp</p>
          </div>
          <button
            onClick={() => setActiveNav('classes')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Quản lý giao bài →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Tên bài</th>
                <th className="py-2.5 px-3 font-semibold">Lớp</th>
                <th className="py-2.5 px-3 font-semibold">Hạn nộp</th>
                <th className="py-2.5 px-3 font-semibold">Chế độ</th>
                <th className="py-2.5 px-3 font-semibold text-right">Đã nộp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((asg) => {
                const asgClass = classes.find((c) => c.id === asg.classId);
                const subCount = submissions.filter((s) => s.assignmentId === asg.id).length;

                return (
                  <tr key={asg.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">{asg.title}</td>
                    <td className="py-2.5 px-3 text-slate-600">{asgClass ? asgClass.name : 'Chung'}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">{asg.deadline}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[11px] font-medium ${
                          asg.isExamMode ? 'text-rose-600' : 'text-blue-600'
                        }`}
                      >
                        {asg.isExamMode ? 'Kiểm tra (Khóa AI)' : 'Luyện tập'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-slate-800">
                      {subCount} bài
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
