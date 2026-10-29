import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ERROR_TAXONOMY } from '../../data/mockData';
import { ErrorCode } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Save,
  HelpCircle,
  FileCheck2,
  Users,
  Search,
} from 'lucide-react';

export const MisconceptionsPage: React.FC = () => {
  const { submissions, students, updateTeacherMisconception, currentRole } = useApp();

  const [selectedErrorCode, setSelectedErrorCode] = useState<ErrorCode | 'all'>('all');
  const [editingItem, setEditingItem] = useState<{ subId: string; questionId: string } | null>(null);
  const [tempNewError, setTempNewError] = useState<ErrorCode>('E01');

  // Collect all student answer records that had misconceptions
  const flaggedAnswers: Array<{
    subId: string;
    studentName: string;
    submittedAt: string;
    questionId: string;
    studentAnswer: string;
    detectedError: ErrorCode;
    teacherAdjustedError?: ErrorCode;
  }> = [];

  submissions.forEach((sub) => {
    sub.answers.forEach((ans) => {
      const err = ans.teacherAdjustedError || ans.detectedError;
      if (err) {
        flaggedAnswers.push({
          subId: sub.id,
          studentName: sub.studentName,
          submittedAt: sub.submittedAt,
          questionId: ans.questionId,
          studentAnswer: ans.studentAnswer,
          detectedError: ans.detectedError || 'E01',
          teacherAdjustedError: ans.teacherAdjustedError,
        });
      }
    });
  });

  const filteredAnswers = selectedErrorCode === 'all'
    ? flaggedAnswers
    : flaggedAnswers.filter(
        (item) => (item.teacherAdjustedError || item.detectedError) === selectedErrorCode
      );

  const handleSaveCorrection = (subId: string, questionId: string) => {
    updateTeacherMisconception(subId, questionId, tempNewError);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Chẩn đoán sai lầm & can thiệp sư phạm</span>
            <span aria-hidden="true">·</span>
            <span>GDPT 2018</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Hệ thống phân tích 9 nhóm lỗi sai Vật lí (E01 – E09)
          </h1>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Tổng số lỗi đã nhận diện: <strong className="font-mono text-slate-900">{flaggedAnswers.length}</strong>
        </div>
      </div>

      {/* Safety & Pedagogical Ethics Note */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>Quy tắc sư phạm & Đạo đức AI:</strong>
          <p className="mt-0.5 text-emerald-900 leading-relaxed">
            Hệ thống lưu loại lỗi khi có căn cứ rõ ràng từ bài làm (công thức, đơn vị, dấu đại lượng).
            <strong> Tuyệt đối không dùng AI để suy đoán tâm lí, trí thông minh hoặc các thuộc tính nhạy cảm của học sinh.</strong>
            Giáo viên luôn có toàn quyền kiểm tra và sửa đổi phân loại mã lỗi nếu cần.
          </p>
        </div>
      </div>

      {/* Grid of the 9 Error Taxonomies */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Bảng định nghĩa chuẩn 9 nhóm lỗi Vật lí THPT</h2>
          {selectedErrorCode !== 'all' && (
            <button
              onClick={() => setSelectedErrorCode('all')}
              className="text-xs text-blue-600 hover:underline"
            >
              Hiện tất cả các lỗi
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {ERROR_TAXONOMY.map((err) => {
            const count = flaggedAnswers.filter(
              (a) => (a.teacherAdjustedError || a.detectedError) === err.code
            ).length;
            const isFilterActive = selectedErrorCode === err.code;

            return (
              <div
                key={err.code}
                onClick={() => setSelectedErrorCode(isFilterActive ? 'all' : err.code)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isFilterActive
                    ? 'bg-blue-50/70 border-blue-600 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                    {err.code}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px] tabular-nums">
                    {count} lần ghi nhận
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">{err.name}</h3>
                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{err.description}</p>
                <div className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                  <strong>Khắc phục:</strong> {err.remedy}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flagged Answers Table & Teacher Override Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Danh sách chi tiết các trường hợp ghi nhận lỗi
              {selectedErrorCode !== 'all' ? ` (Đang lọc: ${selectedErrorCode})` : ''}
            </h3>
            <p className="text-xs text-slate-500">
              Giáo viên có thể trực tiếp sửa lại phân loại nếu AI nhận diện chưa chuẩn xác
            </p>
          </div>
        </div>

        {filteredAnswers.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-lg">
            Không có câu trả lời nào thuộc nhóm lỗi này trong các bài nộp hiện tại.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Học sinh</th>
                  <th className="py-2.5 px-3 font-semibold">Thời gian</th>
                  <th className="py-2.5 px-3 font-semibold">Mã câu</th>
                  <th className="py-2.5 px-3 font-semibold">Đáp án học sinh</th>
                  <th className="py-2.5 px-3 font-semibold">Mã lỗi hiện tại</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Phê duyệt / Sửa lỗi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAnswers.map((item, idx) => {
                  const currentErr = item.teacherAdjustedError || item.detectedError;
                  const isEditing = editingItem?.subId === item.subId && editingItem?.questionId === item.questionId;

                  return (
                    <tr key={`${item.subId}-${item.questionId}-${idx}`} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-medium text-slate-900">{item.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{item.submittedAt}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-700">{item.questionId}</td>
                      <td className="py-2.5 px-3 font-mono text-rose-600 font-semibold">{item.studentAnswer}</td>
                      <td className="py-2.5 px-3">
                        {isEditing ? (
                          <select
                            value={tempNewError}
                            onChange={(e) => setTempNewError(e.target.value as ErrorCode)}
                            className="text-xs p-1 border border-blue-500 rounded font-mono"
                          >
                            {ERROR_TAXONOMY.map((e) => (
                              <option key={e.code} value={e.code}>
                                {e.code} - {e.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
                              {currentErr}
                            </span>
                            {item.teacherAdjustedError && (
                              <span className="text-[10px] text-blue-600 font-medium">(GV đã hiệu đính)</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {currentRole === 'teacher' ? (
                          isEditing ? (
                            <button
                              onClick={() => handleSaveCorrection(item.subId, item.questionId)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              <Save className="w-3 h-3" /> Lưu
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingItem({ subId: item.subId, questionId: item.questionId });
                                setTempNewError(currentErr);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                            >
                              <Edit2 className="w-3 h-3" /> Đổi mã lỗi
                            </button>
                          )
                        ) : (
                          <span className="text-slate-400 text-[11px]">Đã ghi nhận</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
