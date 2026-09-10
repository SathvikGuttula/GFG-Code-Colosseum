import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StudentLogin } from './components/StudentLogin';
import { ContestLobby } from './components/ContestLobby';
import { AssessmentView } from './components/AssessmentView';
import { ResultView } from './components/ResultView';
import { AdminDashboard } from './components/AdminDashboard';
import {
  StudentRecord,
  StudentAnswer,
  EvaluationResult,
  DetailedQuestionResult,
  Question
} from './types/contest';
import {
  DSA_QUESTIONS,
  ADMIN_WHITELIST,
  DEFAULT_CUTOFF,
  CONTEST_DURATION_MINUTES
} from './data/dsaQuestions';
import { getShuffledQuestionsForStudent, isAnswerCorrect } from './utils/shuffler';

export default function App() {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('gfg_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('gfg_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('gfg_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Participants list state: Starts strictly empty for live contest
  const [participants, setParticipants] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gfg_colosseum_participants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If previous session had test mock data, purge it for contest day
          const isOldMockData = parsed.some((p) => p.email === 'ramesh.24bce2315@vitapstudent.ac.in');
          if (!isOldMockData) {
            return parsed;
          }
          localStorage.removeItem('gfg_colosseum_participants');
        }
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Sync participants to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gfg_colosseum_participants', JSON.stringify(participants));
    } catch (e) {
      // ignore
    }
  }, [participants]);

  // Cutoff state (default 15/25)
  const [cutoffMarks, setCutoffMarks] = useState<number>(() => {
    const saved = localStorage.getItem('gfg_colosseum_cutoff');
    return saved ? Number(saved) : DEFAULT_CUTOFF;
  });

  const handleUpdateCutoff = (newCutoff: number) => {
    setCutoffMarks(newCutoff);
    localStorage.setItem('gfg_colosseum_cutoff', String(newCutoff));
  };

  // Test Access Gatekeeper (Controlled live by Admin)
  const [isTestAccessOpen, setIsTestAccessOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('gfg_test_access_open');
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggleTestAccess = () => {
    setIsTestAccessOpen((prev) => {
      const next = !prev;
      localStorage.setItem('gfg_test_access_open', String(next));
      return next;
    });
  };

  // Current session state
  const [currentUser, setCurrentUser] = useState<StudentRecord | null>(() => {
    try {
      const saved = localStorage.getItem('gfg_colosseum_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('gfg_colosseum_is_admin');
    return saved === 'true';
  });

  const [lastEvaluation, setLastEvaluation] = useState<EvaluationResult | null>(null);

  // Update localStorage when current user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gfg_colosseum_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gfg_colosseum_current_user');
    }
    localStorage.setItem('gfg_colosseum_is_admin', String(isAdmin));
  }, [currentUser, isAdmin]);

  // Shuffled questions unique to current student
  const studentQuestions: Question[] = useMemo(() => {
    if (!currentUser) return DSA_QUESTIONS;
    // Uses deterministic student seed so refreshing does not scramble order mid-quiz
    return getShuffledQuestionsForStudent(DSA_QUESTIONS, currentUser.email);
  }, [currentUser]);

  // Login Handler (Students and Admins)
  const handleLogin = (
    fullName: string,
    email: string,
    registrationNumber: string,
    userIsAdmin: boolean
  ) => {
    if (userIsAdmin) {
      setIsAdmin(true);
      const adminRecord: StudentRecord = {
        id: email,
        fullName,
        email,
        registrationNumber: 'ADMIN',
        loginTime: new Date().toISOString(),
        status: 'registered',
        answers: {}
      };
      setCurrentUser(adminRecord);
      return;
    }

    setIsAdmin(false);

    // Check if student already exists in participants
    const existing = participants.find((p) => p.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      const newRecord: StudentRecord = {
        id: email,
        fullName,
        email,
        registrationNumber,
        loginTime: new Date().toISOString(),
        status: 'registered',
        answers: {}
      };
      setParticipants((prev) => [newRecord, ...prev]);
      setCurrentUser(newRecord);
    } else {
      setCurrentUser(existing);
    }
  };

  // Start Assessment Handler (from Lobby)
  const handleStartTest = () => {
    if (!currentUser) return;

    const updatedUser: StudentRecord = {
      ...currentUser,
      status: 'in-progress',
      testStartTime: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    setParticipants((prev) =>
      prev.map((p) => (p.email === currentUser.email ? updatedUser : p))
    );
  };

  // Submit Assessment & Evaluation Handler
  const handleSubmitAssessment = (
    answers: Record<number, StudentAnswer>,
    timeSpentSeconds: number
  ) => {
    if (!currentUser) return;

    let totalScore = 0;
    let mcqScore = 0;
    let shortScore = 0;

    const detailedResults: DetailedQuestionResult[] = studentQuestions.map((q, idx) => {
      const studentAnsObj = answers[q.id];
      const studentAns = studentAnsObj ? studentAnsObj.answer : '';
      const isCorrect = isAnswerCorrect(q, studentAns);

      if (isCorrect) {
        totalScore += 1;
        if (q.type === 'mcq') {
          mcqScore += 1;
        } else {
          shortScore += 1;
        }
      }

      return {
        questionId: q.id,
        questionNumber: idx + 1,
        questionText: q.question,
        topic: q.topic,
        difficulty: q.difficulty,
        type: q.type,
        studentAnswer: studentAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const isQualified = totalScore >= cutoffMarks;

    const evalResult: EvaluationResult = {
      studentEmail: currentUser.email,
      studentName: currentUser.fullName,
      registrationNumber: currentUser.registrationNumber,
      score: totalScore,
      totalQuestions: studentQuestions.length,
      percentage: (totalScore / studentQuestions.length) * 100,
      isQualified,
      cutoffMarks,
      mcqScore,
      shortScore,
      timeSpentSeconds,
      detailedResults
    };

    setLastEvaluation(evalResult);

    // Update student record
    const completedRecord: StudentRecord = {
      ...currentUser,
      status: 'submitted',
      submissionTime: new Date().toISOString(),
      timeTakenSeconds: timeSpentSeconds,
      score: totalScore,
      mcqScore,
      shortScore,
      isQualified,
      answers
    };

    setCurrentUser(completedRecord);
    setParticipants((prev) =>
      prev.map((p) => (p.email === currentUser.email ? completedRecord : p))
    );
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setLastEvaluation(null);
    localStorage.removeItem('gfg_colosseum_current_user');
    localStorage.removeItem('gfg_colosseum_is_admin');
  };

  // Delete individual participant record/log (Admin control)
  const handleDeleteParticipant = (emailOrId: string) => {
    setParticipants((prev) => prev.filter((p) => p.email !== emailOrId && p.id !== emailOrId));
  };

  // Reset all contest records (Admin control)
  const handleResetData = () => {
    if (confirm('Are you sure you want to clear all participant contest records? This action cannot be undone.')) {
      setParticipants([]);
      localStorage.removeItem('gfg_colosseum_participants');
    }
  };

  // Determine current active view
  const currentViewMode: 'login' | 'lobby' | 'assessment' | 'result' | 'admin' = useMemo(() => {
    if (!currentUser) return 'login';
    if (isAdmin) return 'admin';
    if (currentUser.status === 'submitted') return 'result';
    if (currentUser.status === 'in-progress') return 'assessment';
    return 'lobby';
  }, [currentUser, isAdmin]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] dark:bg-[#0a0f0c] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Main Navigation Bar */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* Dynamic Content Views */}
      <main className="flex-1">
        {currentViewMode === 'login' && (
          <StudentLogin onLogin={handleLogin} />
        )}

        {currentViewMode === 'admin' && (
          <AdminDashboard
            participants={participants}
            isTestAccessOpen={isTestAccessOpen}
            onToggleTestAccess={handleToggleTestAccess}
            cutoffMarks={cutoffMarks}
            onUpdateCutoff={handleUpdateCutoff}
            adminEmail={currentUser?.email || ADMIN_WHITELIST[0]}
            onResetData={handleResetData}
            onDeleteParticipant={handleDeleteParticipant}
          />
        )}

        {currentViewMode === 'lobby' && currentUser && (
          <ContestLobby
            student={currentUser}
            isTestAccessOpen={isTestAccessOpen}
            onStartTest={handleStartTest}
            cutoffMarks={cutoffMarks}
          />
        )}

        {currentViewMode === 'assessment' && currentUser && (
          <AssessmentView
            questions={studentQuestions}
            studentName={currentUser.fullName}
            registrationNumber={currentUser.registrationNumber}
            durationMinutes={CONTEST_DURATION_MINUTES}
            initialAnswers={currentUser.answers || {}}
            onSubmitAssessment={handleSubmitAssessment}
          />
        )}

        {currentViewMode === 'result' && currentUser && (
          <ResultView
            result={
              lastEvaluation || {
                studentEmail: currentUser.email,
                studentName: currentUser.fullName,
                registrationNumber: currentUser.registrationNumber,
                score: currentUser.score || 0,
                totalQuestions: DSA_QUESTIONS.length,
                percentage: ((currentUser.score || 0) / DSA_QUESTIONS.length) * 100,
                isQualified: (currentUser.score || 0) >= cutoffMarks,
                cutoffMarks,
                mcqScore: currentUser.mcqScore || 0,
                shortScore: currentUser.shortScore || 0,
                timeSpentSeconds: currentUser.timeTakenSeconds || 0,
                detailedResults: []
              }
            }
            onReturnToLobby={() => {
              const resetRecord: StudentRecord = { ...currentUser, status: 'registered' };
              setCurrentUser(resetRecord);
            }}
          />
        )}
      </main>

      {/* Production Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xs py-6 px-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2F8D46] dark:text-[#38b757]">GeeksforGeeks</span>
            <span>&bull; Student Chapter VIT-AP University</span>
          </div>
          <div>
            Code Colosseum &bull; DSA Assessment & Contest Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
