import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ClassRoom,
  StudentRecord,
  TopicLesson,
  Question,
  Assignment,
  StudentSubmission,
  ImpactEvidenceRecord,
  DiagnosticResult,
  ErrorCode,
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_CURRICULUM_LESSONS,
  INITIAL_QUESTIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_IMPACT_EVIDENCE,
} from '../data/mockData';

export type NavPage =
  | 'home'
  | 'teacher_overview'
  | 'classes'
  | 'diagnostic'
  | 'tutor'
  | 'smart_practice'
  | 'learning_path'
  | 'curriculum'
  | 'misconceptions'
  | 'impact_evidence'
  | 'ai_safety';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeNav: NavPage;
  setActiveNav: (page: NavPage) => void;
  selectedGrade: 10 | 11;
  setSelectedGrade: (grade: 10 | 11) => void;
  currentStudent: StudentRecord | null;
  setCurrentStudent: (student: StudentRecord | null) => void;
  classes: ClassRoom[];
  students: StudentRecord[];
  curriculum: TopicLesson[];
  questions: Question[];
  assignments: Assignment[];
  submissions: StudentSubmission[];
  impactRecords: ImpactEvidenceRecord[];
  diagnosticResults: DiagnosticResult[];
  aiServerStatus: { hasGeminiKey: boolean; model: string; teacher: string; school: string } | null;
  
  // Actions
  loginStudentByCode: (code: string) => boolean;
  addClass: (newClass: Omit<ClassRoom, 'id' | 'isDemoData' | 'studentIds' | 'studentCount'>) => void;
  addStudentsToClass: (classId: string, studentList: { name: string; code: string }[]) => void;
  createAssignment: (asg: Omit<Assignment, 'id' | 'createdAt' | 'isDemoData'>) => void;
  submitAssignment: (sub: Omit<StudentSubmission, 'id' | 'submittedAt'>) => void;
  saveDiagnosticResult: (result: Omit<DiagnosticResult, 'id' | 'completedAt'>) => void;
  approveQuestion: (question: Question) => void;
  addCurriculumLesson: (lesson: Omit<TopicLesson, 'id'>) => void;
  updateCurriculumLesson: (lesson: TopicLesson) => void;
  toggleHideLesson: (id: string) => void;
  deleteCurriculumLesson: (id: string) => void;
  updateTeacherMisconception: (subId: string, questionId: string, newErrorCode: ErrorCode) => void;
  addImpactRecord: (record: Omit<ImpactEvidenceRecord, 'id' | 'createdAt' | 'isDemoData'>) => void;
  wipeStudentData: () => void;
  resetToDemoDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys (v2 with Grade 10: 51 students, Grade 11: 45 students, Grade 11: 38 students)
  const STORAGE_PREFIX = 'physmentor_v2_';

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_PREFIX + 'role') as UserRole) || 'teacher';
  });

  const [activeNav, setActiveNavState] = useState<NavPage>(() => {
    return (localStorage.getItem(STORAGE_PREFIX + 'nav') as NavPage) || 'home';
  });

  const [selectedGrade, setSelectedGrade] = useState<10 | 11>(10);

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentStudent, setCurrentStudent] = useState<StudentRecord | null>(() => {
    return INITIAL_STUDENTS[0] || null;
  });

  const [curriculum, setCurriculum] = useState<TopicLesson[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'curriculum');
    return saved ? JSON.parse(saved) : INITIAL_CURRICULUM_LESSONS;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [impactRecords, setImpactRecords] = useState<ImpactEvidenceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'impact');
    return saved ? JSON.parse(saved) : INITIAL_IMPACT_EVIDENCE;
  });

  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'diagnostics');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiServerStatus, setAiServerStatus] = useState<{
    hasGeminiKey: boolean;
    model: string;
    teacher: string;
    school: string;
  } | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'nav', activeNav);
  }, [activeNav]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'curriculum', JSON.stringify(curriculum));
  }, [curriculum]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'impact', JSON.stringify(impactRecords));
  }, [impactRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'diagnostics', JSON.stringify(diagnosticResults));
  }, [diagnosticResults]);

  // Check backend Gemini API status
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setAiServerStatus(data);
      })
      .catch((err) => {
        console.warn('Backend server not responding or offline:', err);
      });
  }, []);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'student' && !currentStudent && students.length > 0) {
      setCurrentStudent(students[0]);
    }
  };

  const setActiveNav = (page: NavPage) => {
    setActiveNavState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginStudentByCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = students.find((s) => s.code.toUpperCase() === cleanCode);
    if (found) {
      setCurrentStudent(found);
      setCurrentRoleState('student');
      return true;
    }
    // Check if entered a class code
    const foundClass = classes.find((c) => c.code.toUpperCase() === cleanCode);
    if (foundClass) {
      const classStudents = students.filter((s) => s.classId === foundClass.id);
      if (classStudents.length > 0) {
        setCurrentStudent(classStudents[0]);
        setCurrentRoleState('student');
        return true;
      }
    }
    return false;
  };

  const addClass = (newClass: Omit<ClassRoom, 'id' | 'isDemoData' | 'studentIds' | 'studentCount'>) => {
    const id = `cls-${Date.now()}`;
    const created: ClassRoom = {
      ...newClass,
      id,
      studentCount: 0,
      studentIds: [],
      isDemoData: currentRole === 'demo',
    };
    setClasses((prev) => [...prev, created]);
  };

  const addStudentsToClass = (classId: string, studentList: { name: string; code: string }[]) => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) return;

    const newStudentRecords: StudentRecord[] = studentList.map((item, idx) => ({
      id: `stu-${Date.now()}-${idx}`,
      code: item.code.trim(),
      name: item.name.trim(),
      classId,
      grade: targetClass.grade,
      completedAssignments: 0,
      averageScore: 0,
      recentErrors: [],
      isDemoData: currentRole === 'demo',
    }));

    setStudents((prev) => [...prev, ...newStudentRecords]);
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              studentCount: c.studentCount + newStudentRecords.length,
              studentIds: [...c.studentIds, ...newStudentRecords.map((s) => s.id)],
            }
          : c
      )
    );
  };

  const createAssignment = (asg: Omit<Assignment, 'id' | 'createdAt' | 'isDemoData'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isDemoData: currentRole === 'demo',
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const submitAssignment = (sub: Omit<StudentSubmission, 'id' | 'submittedAt'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newSub: StudentSubmission = {
      ...sub,
      id: `sub-${Date.now()}`,
      submittedAt: dateStr,
    };
    setSubmissions((prev) => [newSub, ...prev]);

    // Update student's completed count, average score, and recent errors
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === sub.studentId) {
          const studentSubs = [...submissions.filter((x) => x.studentId === s.id), newSub];
          const avg = studentSubs.reduce((acc, curr) => acc + curr.score, 0) / studentSubs.length;
          const detectedErrList = newSub.answers
            .filter((a) => !a.isCorrect && a.detectedError)
            .map((a) => a.detectedError as ErrorCode);

          return {
            ...s,
            completedAssignments: studentSubs.length,
            averageScore: Math.round(avg * 10) / 10,
            recentErrors: Array.from(new Set([...detectedErrList, ...s.recentErrors])).slice(0, 4),
          };
        }
        return s;
      })
    );
  };

  const saveDiagnosticResult = (result: Omit<DiagnosticResult, 'id' | 'completedAt'>) => {
    const now = new Date();
    const completedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newDiag: DiagnosticResult = {
      ...result,
      id: `diag-${Date.now()}`,
      completedAt,
    };
    setDiagnosticResults((prev) => [newDiag, ...prev]);

    // Update student record
    if (result.studentId) {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === result.studentId) {
            return {
              ...s,
              preTestScore: s.preTestScore ?? result.score,
              recentErrors: Array.from(new Set([...result.detectedErrors, ...s.recentErrors])).slice(0, 4),
            };
          }
          return s;
        })
      );
    }
  };

  const approveQuestion = (question: Question) => {
    const approvedQ: Question = {
      ...question,
      status: 'approved',
      isVerified: true,
    };
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === question.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = approvedQ;
        return next;
      }
      return [approvedQ, ...prev];
    });
  };

  const addCurriculumLesson = (lesson: Omit<TopicLesson, 'id'>) => {
    const newLesson: TopicLesson = {
      ...lesson,
      id: `lesson-${Date.now()}`,
    };
    setCurriculum((prev) => [...prev, newLesson]);
  };

  const updateCurriculumLesson = (lesson: TopicLesson) => {
    setCurriculum((prev) => prev.map((l) => (l.id === lesson.id ? lesson : l)));
  };

  const toggleHideLesson = (id: string) => {
    setCurriculum((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isHidden: !l.isHidden } : l))
    );
  };

  const deleteCurriculumLesson = (id: string) => {
    setCurriculum((prev) => prev.filter((l) => l.id !== id));
  };

  const updateTeacherMisconception = (subId: string, questionId: string, newErrorCode: ErrorCode) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          return {
            ...sub,
            answers: sub.answers.map((ans) =>
              ans.questionId === questionId ? { ...ans, teacherAdjustedError: newErrorCode } : ans
            ),
          };
        }
        return sub;
      })
    );
  };

  const addImpactRecord = (record: Omit<ImpactEvidenceRecord, 'id' | 'createdAt' | 'isDemoData'>) => {
    const newRec: ImpactEvidenceRecord = {
      ...record,
      id: `ev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isDemoData: currentRole === 'demo',
    };
    setImpactRecords((prev) => [newRec, ...prev]);
  };

  const wipeStudentData = () => {
    // Keep curriculum and teacher questions, wipe sensitive submissions and diagnostic data
    setSubmissions([]);
    setDiagnosticResults([]);
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        completedAssignments: 0,
        averageScore: 0,
        recentErrors: [],
        preTestScore: null,
        postTestScore: null,
      }))
    );
  };

  const resetToDemoDefaults = () => {
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setCurrentStudent(INITIAL_STUDENTS[0]);
    setCurriculum(INITIAL_CURRICULUM_LESSONS);
    setQuestions(INITIAL_QUESTIONS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setImpactRecords(INITIAL_IMPACT_EVIDENCE);
    setDiagnosticResults([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeNav,
        setActiveNav,
        selectedGrade,
        setSelectedGrade,
        currentStudent,
        setCurrentStudent,
        classes,
        students,
        curriculum,
        questions,
        assignments,
        submissions,
        impactRecords,
        diagnosticResults,
        aiServerStatus,
        loginStudentByCode,
        addClass,
        addStudentsToClass,
        createAssignment,
        submitAssignment,
        saveDiagnosticResult,
        approveQuestion,
        addCurriculumLesson,
        updateCurriculumLesson,
        toggleHideLesson,
        deleteCurriculumLesson,
        updateTeacherMisconception,
        addImpactRecord,
        wipeStudentData,
        resetToDemoDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
