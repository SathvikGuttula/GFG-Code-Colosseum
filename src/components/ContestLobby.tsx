import React, { useEffect, useState } from 'react';
import { StudentRecord } from '../types/contest';
import { Lock, Unlock, Clock, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, BookOpen, Shuffle } from 'lucide-react';

interface ContestLobbyProps {
  student: StudentRecord;
  isTestAccessOpen: boolean;
  onStartTest: () => void;
  cutoffMarks: number;
}

export const ContestLobby: React.FC<ContestLobbyProps> = ({
  student,
  isTestAccessOpen,
  onStartTest,
  cutoffMarks
}) => {
  const [dots, setDots] = useState('');

  // Animate waiting dots if test is locked
  useEffect(() => {
    if (isTestAccessOpen) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [isTestAccessOpen]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none text-white font-mono text-9xl font-black">
          {'{ }'}
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official GeeksforGeeks Contest Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Welcome, {student.fullName}!
          </h1>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-emerald-100 font-medium">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <span className="text-emerald-300">Registration No:</span>
              <span className="font-mono font-bold text-white">{student.registrationNumber}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <span className="text-emerald-300">College Email:</span>
              <span className="font-mono text-white">{student.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Access Gatekeeper Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                isTestAccessOpen
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
              }`}
            >
              {isTestAccessOpen ? (
                <Unlock className="w-7 h-7 animate-bounce" />
              ) : (
                <Lock className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Assessment Access Status
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isTestAccessOpen
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {isTestAccessOpen ? 'ACCESS OPEN' : 'LOCKED BY ADMIN'}
                </span>
              </div>

              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {isTestAccessOpen
                  ? 'Assessment is Live! You can begin now.'
                  : `Waiting for Admin to Open Access${dots}`}
              </h2>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
                {isTestAccessOpen
                  ? 'Admin access has been granted. Click the button on the right to initiate your 40-minute DSA assessment session.'
                  : 'The test administrator has not released the test yet. Once the contest is announced live, this button will unlock automatically.'}
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="shrink-0 w-full sm:w-auto">
            {isTestAccessOpen ? (
              <button
                id="start-assessment-btn"
                onClick={onStartTest}
                type="button"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2F8D46] hover:bg-[#257338] text-white font-extrabold text-base tracking-wide shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/40"
              >
                <Clock className="w-5 h-5" />
                <span>Start Assessment (40 Mins)</span>
              </button>
            ) : (
              <button
                id="locked-assessment-btn"
                disabled
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700"
              >
                <Lock className="w-4 h-4" />
                <span>Access Locked</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rules & Instructions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-2.5 mb-4 text-[#2F8D46] dark:text-[#38b757]">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Assessment Structure
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Total 25 Questions:</strong> 20 Multiple Choice Questions (Easy, Medium, Hard) and 5 Short Answer Questions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Randomized Fair Testing:</strong> All participants answer the exact same questions, but in an individually jumbled sequence to prevent collusion.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Short Answer Fields:</strong> Provide concise answers (one or two words / Big-O notation like <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">O(1)</code> or <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">Bellman Ford</code>).
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-2.5 mb-4 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Duration & Qualification
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>40-Minute Countdown:</strong> Timer begins immediately upon clicking Start and stays visible on top throughout the quiz.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Shuffle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Side Navigation Palette:</strong> Easily jump between questions 1–25, mark for review, and inspect unanswered items.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Round 2 Qualification:</strong> The admin has configured a cutoff of <strong>{cutoffMarks} / 25 Marks</strong>. Qualified candidates will receive formal invitation emails.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
