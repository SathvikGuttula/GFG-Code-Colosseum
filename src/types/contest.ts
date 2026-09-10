export type QuestionType = 'mcq' | 'short';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: number;
  originalIndex: number; // 1 to 25
  type: QuestionType;
  difficulty: DifficultyLevel;
  topic: string;
  question: string;
  codeSnippet?: string;
  options?: string[]; // exactly 4 for MCQs
  correctAnswer: string;
  acceptableAnswers?: string[]; // for short answers: normalized equivalents
  explanation: string;
}

export interface StudentAnswer {
  questionId: number;
  answer: string; // selected option or typed short answer
  markedForReview: boolean;
}

export interface StudentRecord {
  id: string; // unique id / email
  fullName: string;
  email: string;
  registrationNumber: string;
  loginTime: string;
  testStartTime?: string;
  submissionTime?: string;
  timeTakenSeconds?: number;
  status: 'registered' | 'in-progress' | 'submitted';
  answers: Record<number, StudentAnswer>;
  score?: number;
  mcqScore?: number;
  shortScore?: number;
  isQualified?: boolean;
}

export interface ContestConfig {
  contestTitle: string;
  chapterName: string;
  durationMinutes: number;
  isTestAccessOpen: boolean;
  cutoffMarks: number;
  totalQuestions: number;
  adminWhitelist: string[];
}

export interface DetailedQuestionResult {
  questionId: number;
  questionNumber: number;
  questionText: string;
  topic: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface EvaluationResult {
  studentEmail: string;
  studentName: string;
  registrationNumber: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  isQualified: boolean;
  cutoffMarks: number;
  mcqScore: number;
  shortScore: number;
  timeSpentSeconds: number;
  detailedResults: DetailedQuestionResult[];
}
