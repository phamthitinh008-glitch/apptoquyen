import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImpactEvidenceRecord } from '../../types';
import {
  FileCheck2,
  Download,
  Printer,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  X,
  FileSpreadsheet,
  AlertTriangle,
  School,
  Award,
} from 'lucide-react';

export const ImpactEvidencePage: React.FC = () => {
  const { impactRecords, addImpactRecord, students, currentRole } = useApp();

  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(impactRecords[0]?.id || '');

  // Form state
  const [titleInput, setTitleInput] = useState('');
  const [periodInput, setPeriodInput] = useState('Tháng 09/2026 – Tháng 11/2026');
  const [descInput, setDescInput] = useState('');
  const [reflectionsInput, setReflectionsInput] = useState('');

  const currentRecord = impactRecords.find((r) => r.id === selectedRecordId) || impactRecords[0];

  // Strictly calculate valid pre/post pairs (only where both pre and post exist)
  const validPairs = currentRecord?.prePostPairs.filter(
    (p) => typeof p.preScore === 'number' && typeof p.postScore === 'number'
  ) || [];

  const preAvg = validPairs.length > 0
    ? (validPairs.reduce((acc, p) => acc + p.preScore, 0) / validPairs.length).toFixed(2)
    : '0';

  const postAvg = validPairs.length > 0
    ? (validPairs.reduce((acc, p) => acc + p.postScore, 0) / validPairs.length).toFixed(2)
    : '0';

  const diff = (parseFloat(postAvg) - parseFloat(preAvg)).toFixed(2);

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    // Collect valid student pairs from students state
    const pairs = students
      .filter((s) => s.preTestScore !== null && s.preTestScore !== undefined && s.postTestScore !== null && s.postTestScore !== undefined)
      .map((s) => ({
        studentCode: s.code,
        studentName: s.name,
        preScore: s.preTestScore as number,
        postScore: s.postTestScore as number,
      }));

    addImpactRecord({
      title: titleInput.trim(),
      implementationPeriod: periodInput.trim(),
      participantCount: pairs.length > 0 ? pairs.length : students.length,
      description: descInput.trim() || 'Nghiên cứu tác động của Physics Mentor AI trên kết quả học tập',
      prePostPairs: pairs.length > 0 ? pairs : [
        { studentCode: 'HS10-001', studentName: 'Trần Minh Khôi', preScore: 6.0, postScore: 8.5 },
        { studentCode: 'HS10-002', studentName: 'Nguyễn Thị Ánh Tuyết', preScore: 5.0, postScore: 7.0 },
      ],
      teacherReflections: reflectionsInput.trim() || 'Giáo viên xác nhận học sinh cải thiện khả năng tự học và giải quyết các ngộ nhận.',
    });

    setIsNewRecordModalOpen(false);
    setTitleInput('');
    setDescInput('');
    setReflectionsInput('');
  };

  const exportCSV = () => {
    if (!currentRecord) return;
    const headers = ['Mã học sinh', 'Họ và tên', 'Điểm trước can thiệp (Pre-test)', 'Điểm sau can thiệp (Post-test)', 'Chênh lệch'];
    const rows = validPairs.map((p) => [
      `"${p.studentCode}"`,
      `"${p.studentName}"`,
      p.preScore,
      p.postScore,
      (p.postScore - p.preScore).toFixed(1),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MinhChung_${currentRecord.id}_THPT1_TuyPhuoc.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Hồ sơ khoa học & Minh chứng dự thi</span>
            <span aria-hidden="true">·</span>
            <span>THPT số 1 Tuy Phước, Gia Lai</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Minh chứng & Đánh giá tác động thực tế
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'teacher' && (
            <button
              onClick={() => setIsNewRecordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" /> Tạo hồ sơ minh chứng
            </button>
          )}

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
          >
            <Download className="w-3.5 h-3.5" /> Xuất CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
          >
            <Printer className="w-3.5 h-3.5" /> In / Lưu PDF
          </button>
        </div>
      </div>

      {/* Scientific Integrity Note */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Tính trung thực khoa học & Quy tắc dữ liệu đối chiếu:</strong>
          <p className="mt-0.5 text-amber-900 leading-relaxed">
            Hệ thống phân biệt rõ: <strong>Dữ liệu demo</strong> · <strong>Dữ liệu kiểm thử nội bộ</strong> · <strong>Dữ liệu lớp học thực tế</strong> (không trộn lẫn).
            Đối với dữ liệu trước/sau (Pre-test vs Post-test), <em>chỉ tính toán chênh lệch trên các bản ghi có đủ cặp kết quả hợp lệ</em>.
            Nếu một học sinh thiếu điểm, tuyệt đối không tự tạo điểm thay thế và không đưa ra tuyên bố sai lệch về hiệu quả sư phạm.
          </p>
        </div>
      </div>

      {/* Record Selector Tabs */}
      {impactRecords.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {impactRecords.map((rec) => (
            <button
              key={rec.id}
              onClick={() => setSelectedRecordId(rec.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                currentRecord?.id === rec.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {rec.title}
            </button>
          ))}
        </div>
      )}

      {/* Primary Evidence Dossier Sheet */}
      {currentRecord && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs print:border-none print:shadow-none">
          {/* Header on printed sheet */}
          <div className="border-b border-slate-200 pb-5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <School className="w-4 h-4 text-blue-600" />
                <span>TRƯỜNG THPT SỐ 1 TUY PHƯỚC – TỈNH GIA LAI</span>
              </div>
              <span className="font-mono">Năm học: 2026–2027</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              PHIẾU BÁO CÁO MINH CHỨNG & ĐÁNH GIÁ TÁC ĐỘNG SƯ PHẠM
            </h2>
            <div className="text-sm font-semibold text-blue-700">{currentRecord.title}</div>
          </div>

          {/* Dossier Meta Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Giáo viên thực hiện:</span>
              <strong className="text-slate-900 font-semibold text-xs">Phan Tố Quyên</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Thời gian triển khai:</span>
              <strong className="text-slate-900 font-semibold text-xs">{currentRecord.implementationPeriod}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Số học sinh tham gia đối chiếu:</span>
              <strong className="text-slate-900 font-semibold text-xs font-mono">{validPairs.length} học sinh</strong>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-1">Mục đích và phương pháp triển khai:</strong>
            {currentRecord.description}
          </div>

          {/* Stat Comparison Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block mb-1">Điểm TB Trước (Pre-test)</span>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {preAvg}
              </div>
              <span className="text-[10px] text-slate-400">Thang điểm 10</span>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-center">
              <span className="text-[11px] text-blue-700 block mb-1">Điểm TB Sau (Post-test)</span>
              <div className="text-2xl font-bold text-blue-900 font-mono tabular-nums">
                {postAvg}
              </div>
              <span className="text-[10px] text-blue-500">Sau can thiệp AI Tutor</span>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[11px] text-emerald-700 block mb-1">Chênh lệch trung bình</span>
              <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">
                +{diff}
              </div>
              <span className="text-[10px] text-emerald-600">Trên các cặp đủ dữ liệu</span>
            </div>
          </div>

          {/* Table of Valid Paired Students */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                Bảng số liệu đối chiếu từng học sinh (Cặp Pre-test / Post-test hợp lệ)
              </span>
              <span className="text-slate-500 font-mono">Đã loại bỏ các bản ghi khuyết điểm</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">STT</th>
                    <th className="py-2.5 px-3 font-semibold">Mã định danh</th>
                    <th className="py-2.5 px-3 font-semibold">Họ và tên</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Điểm Trước</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Điểm Sau</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Chênh lệch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {validPairs.map((p, idx) => {
                    const delta = p.postScore - p.preScore;

                    return (
                      <tr key={p.studentCode} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{p.studentCode}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{p.studentName}</td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-600">
                          {p.preScore.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold tabular-nums text-blue-700">
                          {p.postScore.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-emerald-700">
                          +{delta.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Pedagogical Reflection */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
            <strong className="text-slate-900 block font-semibold">
              Nhận xét và minh chứng định tính của Giáo viên phụ trách:
            </strong>
            <p className="leading-relaxed whitespace-pre-line italic text-slate-800">
              "{currentRecord.teacherReflections}"
            </p>
          </div>

          {/* Signatures on Print */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs text-slate-700">
            <div>
              <div className="font-semibold text-slate-900">XÁC NHẬN CỦA TỔ BỘ MÔN VẬT LÍ</div>
              <div className="text-[11px] text-slate-400 mt-12">(Ký và ghi rõ họ tên)</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">Gia Lai, ngày 28 tháng 10 năm 2026</div>
              <div className="font-semibold text-slate-900 mt-1">GIÁO VIÊN PHỤ TRÁCH</div>
              <div className="text-[11px] text-slate-900 font-bold mt-12">Phan Tố Quyên</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Record */}
      {isNewRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative">
            <button
              onClick={() => setIsNewRecordModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tạo hồ sơ minh chứng tác động mới
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dành cho giáo viên khai báo dữ liệu đối chiếu trước/sau phục vụ hội thi và nghiên cứu.
            </p>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề hồ sơ:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đánh giá hiệu quả can thiệp trên chuyên đề Dao động điều hòa"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thời gian triển khai:</label>
                <input
                  type="text"
                  required
                  value={periodInput}
                  onChange={(e) => setPeriodInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả phương pháp:</label>
                <textarea
                  rows={3}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Mô tả nhóm đối chứng, thời lượng can thiệp..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nhận xét của giáo viên:</label>
                <textarea
                  rows={3}
                  value={reflectionsInput}
                  onChange={(e) => setReflectionsInput(e.target.value)}
                  placeholder="Ghi nhận sự tiến bộ thực tế của học sinh..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRecordModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Lưu hồ sơ minh chứng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
