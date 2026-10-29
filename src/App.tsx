/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { HomePage } from './components/pages/HomePage';
import { TeacherDashboard } from './components/pages/TeacherDashboard';
import { ClassManagementPage } from './components/pages/ClassManagementPage';
import { DiagnosticTestPage } from './components/pages/DiagnosticTestPage';
import { PhysicsTutorPage } from './components/pages/PhysicsTutorPage';
import { SmartPracticePage } from './components/pages/SmartPracticePage';
import { PersonalizedPathPage } from './components/pages/PersonalizedPathPage';
import { CurriculumRepoPage } from './components/pages/CurriculumRepoPage';
import { MisconceptionsPage } from './components/pages/MisconceptionsPage';
import { ImpactEvidencePage } from './components/pages/ImpactEvidencePage';
import { AISafetyPage } from './components/pages/AISafetyPage';
import { AIAssessmentModal } from './components/teacher/AIAssessmentModal';

const AppContent: React.FC = () => {
  const { activeNav } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeNav) {
      case 'home':
        return <HomePage />;
      case 'teacher_overview':
        return <TeacherDashboard onOpenAIGenerator={() => setIsAIGeneratorOpen(true)} />;
      case 'classes':
        return <ClassManagementPage onOpenAIGenerator={() => setIsAIGeneratorOpen(true)} />;
      case 'diagnostic':
        return <DiagnosticTestPage />;
      case 'tutor':
        return <PhysicsTutorPage />;
      case 'smart_practice':
        return <SmartPracticePage />;
      case 'learning_path':
        return <PersonalizedPathPage />;
      case 'curriculum':
        return <CurriculumRepoPage />;
      case 'misconceptions':
        return <MisconceptionsPage />;
      case 'impact_evidence':
        return <ImpactEvidencePage />;
      case 'ai_safety':
        return <AISafetyPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1E293B] flex">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="max-w-4xl mx-auto space-y-1">
            <div className="font-medium text-slate-700">
              PHYSICS MENTOR AI – Gia sư Vật lí thông minh THPT (Lớp 10 & 11)
            </div>
            <div className="text-[11px] text-slate-400">
              Giáo viên phụ trách: <strong>Phan Tố Quyên</strong> · Trường THPT số 1 Tuy Phước, Tỉnh Gia Lai · Năm học 2026–2027
            </div>
            <div className="text-[11px] text-teal-700 italic pt-0.5">
              "Physics Mentor AI – Không đưa ngay đáp án, mà giúp học sinh tìm ra đáp án bằng chính tư duy của mình."
            </div>
          </div>
        </footer>
      </div>

      {/* Teacher AI Assessment Generator Modal */}
      <AIAssessmentModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
