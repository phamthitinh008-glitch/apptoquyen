import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Trash2,
  RotateCcw,
  KeyRound,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AISafetyPage: React.FC = () => {
  const { wipeStudentData, resetToDemoDefaults, aiServerStatus, currentRole } = useApp();

  const [wipeNotice, setWipeNotice] = useState('');
  const [resetNotice, setResetNotice] = useState('');

  const handleWipe = () => {
    if (confirm('CẢNH BÁO AN TOÀN DỮ LIỆU: Thao tác này sẽ xóa toàn bộ bài nộp và chẩn đoán nhạy cảm của học sinh khỏi trình duyệt. Bạn có chắc chắn muốn thực hiện?')) {
      wipeStudentData();
      setWipeNotice('Đã xóa và ẩn danh hóa toàn bộ lịch sử nộp bài của học sinh thành công.');
      setTimeout(() => setWipeNotice(''), 5000);
    }
  };

  const handleReset = () => {
    if (confirm('Khôi phục toàn bộ cấu hình, lớp học và các chuyên đề mẫu ban đầu?')) {
      resetToDemoDefaults();
      setResetNotice('Đã khôi phục dữ liệu mẫu chuẩn hóa GDPT 2018 thành công.');
      setTimeout(() => setResetNotice(''), 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Đạo đức AI & Bảo vệ quyền riêng tư</span>
            <span aria-hidden="true">·</span>
            <span>GDPT 2018</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Cài đặt, An toàn dữ liệu & Chuẩn mực đạo đức AI
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tuân thủ quy định bảo vệ học sinh THPT</span>
        </div>
      </div>

      {/* AI Ethics & Safety Principles */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>Chính sách bảo vệ học sinh THPT (Lớp 10 & 11)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 block font-semibold">1. Thu thập dữ liệu tối thiểu</strong>
            <p className="text-slate-600 leading-relaxed">
              Hệ thống chỉ sử dụng mã định danh nội bộ (vd: <code className="font-mono text-blue-700">HS10-001</code>). Tuyệt đối không yêu cầu CCCD, số điện thoại hay thông tin tài khoản cá nhân.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 block font-semibold">2. Bảo vệ dữ liệu trước dịch vụ AI</strong>
            <p className="text-slate-600 leading-relaxed">
              Khi kết nối với mô hình ngôn ngữ lớn (Gemini 3.8 Flash), các thông tin cá nhân đều được lọc bỏ. Chỉ có ngữ cảnh bài toán Vật lí và các bước giải ẩn danh được gửi đi.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 block font-semibold">3. Khóa đáp án bài kiểm tra đang diễn ra</strong>
            <p className="text-slate-600 leading-relaxed">
              Trong chế độ kiểm tra tính điểm chính thức, Gia sư AI có cơ chế khóa giải pháp (Solution Lock), tuyệt đối không cung cấp kết quả tính toán trước khi học sinh nộp bài.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 block font-semibold">4. Chống thay đổi chỉ dẫn (Prompt Injection Defense)</strong>
            <p className="text-slate-600 leading-relaxed">
              Hệ thống có bộ lọc ngăn chặn các câu lệnh cố ý điều hướng AI bỏ qua quy tắc Socratic hoặc vi phạm nguyên tắc sư phạm.
            </p>
          </div>
        </div>
      </div>

      {/* Backend & AI Connection Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Trạng thái máy chủ AI & Kết nối</span>
        </h2>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Mô hình AI chỉ định:</span>
            <span className="font-mono font-semibold text-blue-700">
              {aiServerStatus?.model || 'gemini-3.8-flash'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Đơn vị triển khai:</span>
            <span className="font-semibold text-slate-800">
              THPT số 1 Tuy Phước · GV Phan Tố Quyên
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Cơ chế phản hồi AI:</span>
            <span className="font-medium text-emerald-700">
              {aiServerStatus?.hasGeminiKey
                ? 'Đã kích hoạt Gemini 3.8 Flash (Server-side @google/genai)'
                : 'Đang chạy Bộ quy tắc sư phạm Socratic nội bộ (Sẵn sàng kết nối Gemini)'}
            </span>
          </div>
        </div>
      </div>

      {/* Data Management & Erasure Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Quản trị dữ liệu & Quyền được lãng quên</span>
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          Theo quy định bảo vệ dữ liệu học sinh, nhà trường hoặc giáo viên có quyền yêu cầu xóa hoàn toàn dữ liệu bài nộp và lịch sử chẩn đoán của học sinh sau khi kết thúc đợt đánh giá.
        </p>

        {wipeNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg font-medium">
            {wipeNotice}
          </div>
        )}

        {resetNotice && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-lg font-medium">
            {resetNotice}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleWipe}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Xóa & Ẩn danh hóa dữ liệu học sinh</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Khôi phục dữ liệu mẫu ban đầu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
