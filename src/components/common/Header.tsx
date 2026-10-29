import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Menu, ShieldAlert, Sparkles, User, School, KeyRound, X } from 'lucide-react';

export const Header: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const {
    currentRole,
    setCurrentRole,
    currentStudent,
    setCurrentStudent,
    students,
    classes,
    loginStudentByCode,
    aiServerStatus,
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCodeInput.trim()) return;
    const ok = loginStudentByCode(studentCodeInput);
    if (ok) {
      setIsLoginModalOpen(false);
      setStudentCodeInput('');
      setLoginError('');
    } else {
      setLoginError('Mã học sinh hoặc mã lớp không tồn tại. Hãy thử: HS10-001 hoặc PHY10-TP01');
    }
  };

  return (
    <>
      {/* Required Demo Mode Banner */}
      {currentRole === 'demo' && (
        <div className="bg-amber-500 text-slate-950 font-semibold text-xs py-2 px-4 text-center tracking-wide shadow-sm flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>CHẾ ĐỘ MINH HỌA – DỮ LIỆU GIẢ LẬP, KHÔNG PHẢI KẾT QUẢ THỬ NGHIỆM THỰC TẾ.</span>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu & School Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600 hidden sm:block" />
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">THPT số 1 Tuy Phước</span>
                <span className="hidden md:inline"> · Tỉnh Gia Lai · Năm học 2026-2027</span>
              </div>
            </div>
          </div>

          {/* Right: AI Engine Status + Role Switcher */}
          <div className="flex items-center gap-3">
            {/* AI Status Badge */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                aiServerStatus?.hasGeminiKey
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
              title={
                aiServerStatus?.hasGeminiKey
                  ? 'Đã kích hoạt Gemini 3.8 Flash'
                  : 'Sử dụng bộ quy tắc sư phạm GDPT 2018 (Sẵn sàng kết nối Gemini API)'
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiServerStatus?.hasGeminiKey ? 'Gemini 3.8 Flash AI' : 'Physics Socratic Engine'}</span>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => handleRoleChange('teacher')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentRole === 'teacher'
                    ? 'bg-white text-blue-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Giáo viên
              </button>
              <button
                onClick={() => handleRoleChange('student')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentRole === 'student'
                    ? 'bg-white text-blue-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Học sinh
              </button>
              <button
                onClick={() => handleRoleChange('demo')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentRole === 'demo'
                    ? 'bg-amber-400 text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demo
              </button>
            </div>

            {/* Student Switcher / Login affordance */}
            {currentRole === 'student' && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-700 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                title="Đổi học sinh hoặc nhập mã tham gia"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[120px] truncate">{currentStudent ? currentStudent.name : 'Vào lớp'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modal: Student Login by Code */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Vào lớp học / Chọn tài khoản học sinh</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Nhập mã định danh học sinh (vd: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">HS10-001</code>) hoặc mã tham gia lớp học (vd: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">PHY10-TP01</code>).
            </p>

            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã học sinh hoặc mã lớp:
                </label>
                <input
                  type="text"
                  value={studentCodeInput}
                  onChange={(e) => setStudentCodeInput(e.target.value)}
                  placeholder="Ví dụ: HS10-001"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  autoFocus
                />
                {loginError && <p className="text-xs text-rose-600 mt-1">{loginError}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Xác nhận vào lớp
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700 mb-2">Chọn nhanh học sinh theo lớp:</div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {classes.map((cls) => {
                  const firstStu = students.find((s) => s.classId === cls.id);
                  const clsStudents = students.filter((s) => s.classId === cls.id);

                  return (
                    <div key={cls.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                        <span>{cls.name}</span>
                        <span className="font-mono text-blue-600 font-bold">{cls.studentCount} HS</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Mã vào lớp: <code className="font-mono text-slate-700">{cls.code}</code></span>
                        {firstStu && (
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentStudent(firstStu);
                              setCurrentRole('student');
                              setIsLoginModalOpen(false);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Đăng nhập dạng {firstStu.name} →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
