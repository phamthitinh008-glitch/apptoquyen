export type UserRole = 'teacher' | 'student' | 'demo';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  grade?: 10 | 11;
  classId?: string;
  studentCode?: string;
  school: string;
  isDemoUser?: boolean;
}

export type ErrorCode = 
  | 'E01' // Chọn sai công thức
  | 'E02' // Thay số sai
  | 'E03' // Nhầm hoặc thiếu đơn vị
  | 'E04' // Nhầm dấu hoặc chiều của đại lượng
  | 'E05' // Nhầm định nghĩa hoặc khái niệm
  | 'E06' // Sai phép biến đổi toán học
  | 'E07' // Thiếu bước lập luận quan trọng
  | 'E08' // Hiểu sai hiện tượng Vật lí
  | 'E09'; // Chưa đủ thông tin để kết luận

export interface ErrorDefinition {
  code: ErrorCode;
  name: string;
  description: string;
  remedy: string;
  example: string;
}

export interface Question {
  id: string;
  topicId: string;
  grade: 10 | 11;
  text: string;
  type: 'multiple_choice' | 'numeric_fill' | 'step_reasoning';
  options?: string[];
  correctAnswer: string;
  numericAnswer?: number;
  tolerance?: number;
  unit?: string;
  targetFormula?: string;
  solutionSteps: string[];
  cognitiveLevel: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  difficultyTier: 'foundation' | 'application' | 'challenge'; // Củng cố nền tảng, Vận dụng, Thử thách
  objective: string;
  associatedError?: ErrorCode;
  isVerified: boolean;
  status?: 'approved' | 'pending_approval';
}

export interface TopicLesson {
  id: string;
  grade: 10 | 11;
  topicCode: string;
  title: string;
  objective: string;
  coreConcepts: string[];
  keyFormulas: {
    name: string;
    latex: string;
    explanation: string;
    units: string;
  }[];
  commonErrors: {
    code: ErrorCode;
    description: string;
  }[];
  workedExample: {
    problem: string;
    solution: string;
  };
  isHidden?: boolean;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: 10 | 11;
  code: string;
  academicYear: string;
  teacherName: string;
  studentCount: number;
  studentIds: string[];
  isDemoData: boolean;
}

export interface StudentRecord {
  id: string;
  code: string;
  name: string;
  classId: string;
  grade: 10 | 11;
  completedAssignments: number;
  averageScore: number;
  recentErrors: ErrorCode[];
  isDemoData: boolean;
  preTestScore?: number | null;
  postTestScore?: number | null;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  topicId: string;
  grade: 10 | 11;
  deadline: string;
  questionIds: string[];
  totalQuestions: number;
  isExamMode: boolean; // if true, AI tutor cannot reveal hints/answers during test
  allowImmediateFeedback: boolean;
  isDemoData: boolean;
  createdAt: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  score: number;
  totalScore: number;
  answers: {
    questionId: string;
    studentAnswer: string;
    isCorrect: boolean;
    detectedError?: ErrorCode;
    teacherAdjustedError?: ErrorCode;
  }[];
  isDemoData: boolean;
}

export interface DiagnosticAssessment {
  id: string;
  grade: 10 | 11;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

export interface DiagnosticResult {
  id: string;
  studentId: string;
  grade: 10 | 11;
  score: number;
  totalQuestions: number;
  completedAt: string;
  masteredTopics: string[];
  strugglingTopics: string[];
  detectedErrors: ErrorCode[];
  confidenceLevel: 'Cao' | 'Trung bình' | 'Cần thêm bài làm';
  recommendedPath: 'foundation' | 'application' | 'challenge';
}

export interface TutorChatMessage {
  id: string;
  sender: 'student' | 'mentor';
  text: string;
  timestamp: string;
  hintLevel?: number; // 1, 2, 3
  detectedError?: ErrorCode | null;
  formulaCheck?: {
    isCorrect: boolean;
    feedback: string;
  };
}

export interface ImpactEvidenceRecord {
  id: string;
  title: string;
  implementationPeriod: string;
  participantCount: number;
  description: string;
  prePostPairs: {
    studentCode: string;
    studentName: string;
    preScore: number;
    postScore: number;
  }[];
  teacherReflections: string;
  attachmentName?: string;
  isDemoData: boolean;
  createdAt: string;
}
