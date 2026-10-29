import React from 'react';
import { useApp, NavPage } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  GraduationCap,
  Sparkles,
  BookOpen,
  AlertCircle,
  FileCheck2,
  ShieldAlert,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  teacherOnly?: boolean;
  studentOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: '1. Trang chủ', icon: Home },
  { id: 'teacher_overview', label: '2. Tổng quan giáo viên', icon: LayoutDashboard, teacherOnly: true },
  { id: 'classes', label: '3. Quản lý lớp học', icon: Users, teacherOnly: true },
  { id: 'diagnostic', label: '4. Kiểm tra chẩn đoán', icon: CheckCircle2 },
  { id: 'tutor', label: '5. Gia sư Physics AI', icon: BrainCircuit },
  { id: 'smart_practice', label: '6. Luyện tập thông minh', icon: Sparkles },
  { id: 'learning_path', label: '7. Lộ trình học cá nhân', icon: GraduationCap },
  { id: 'curriculum', label: '8. Kho học liệu & bài tập', icon: BookOpen },
  { id: 'misconceptions', label: '9. Phân tích lỗi sai', icon: AlertCircle },
  { id: 'impact_evidence', label: '10. Báo cáo & minh chứng', icon: FileCheck2 },
  { id: 'ai_safety', label: '11. Cài đặt & an toàn AI', icon: ShieldAlert },
];

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeNav, setActiveNav, currentRole, selectedGrade, setSelectedGrade } = useApp();

  const handleNavClick = (id: NavPage) => {
    setActiveNav(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#111D47] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Atom Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(90 12 12)" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-[#111D47]" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white leading-tight">
                PHYSICS MENTOR AI
              </div>
              <div className="text-[11px] text-blue-200 font-medium">Gia sư Vật lí thông minh</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Đóng menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Grade Selector & Info */}
        <div className="px-4 py-3 bg-white/5 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">Khối chương trình GDPT:</span>
            <div className="flex gap-1 bg-black/30 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setSelectedGrade(10)}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedGrade === 10 ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lớp 10
              </button>
              <button
                onClick={() => setSelectedGrade(11)}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedGrade === 11 ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lớp 11
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            GV: <strong className="text-white">Phan Tố Quyên</strong> · THPT số 1 Tuy Phước, Gia Lai
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            if (item.teacherOnly && currentRole === 'student') return null;
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-900/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* School & Slogan Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-xs">
          <div className="text-[11px] text-teal-300 font-medium mb-1">
            "Hiểu đúng bản chất – Tự tin giải bài – Tiến bộ mỗi ngày."
          </div>
          <div className="text-[10px] text-slate-400">
            Năm học 2026–2027 · GDPT 2018
          </div>
        </div>
      </aside>
    </>
  );
};
