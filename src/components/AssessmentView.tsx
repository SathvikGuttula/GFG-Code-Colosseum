import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Question, StudentAnswer } from '../types/contest';
import {
  Clock,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  HelpCircle,
  Sparkles,
  X,
  RotateCcw,
  Maximize2,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import {
  isBrowserFullscreenActive,
  enterBrowserFullscreen,
  exitBrowserFullscreen
} from '../utils/fullscreen';

interface AssessmentViewProps {
  questions: Question[];
  studentName: string;
  registrationNumber: string;
  durationMinutes?: number;
  initialAnswers?: Record<number, StudentAnswer>;
  onSubmitAssessment: (
    answers: Record<number, StudentAnswer>,
    timeSpentSeconds: number,
    fullscreenViolations?: number
  ) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  questions,
  studentName,
  registrationNumber,
  durationMinutes = 40,
  initialAnswers = {},
  onSubmitAssessment
}) => {
  const totalSeconds = durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, StudentAnswer>>(initialAnswers);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [hasTimeExpired, setHasTimeExpired] = useState<boolean>(false);

  // Fullscreen & Proctoring state
  const [isInFullscreen, setIsInFullscreen] = useState<boolean>(() => isBrowserFullscreenActive());
  const [fullscreenViolations, setFullscreenViolations] = useState<number>(0);
  const [hasInitiatedFullscreen, setHasInitiatedFullscreen] = useState<boolean>(() => isBrowserFullscreenActive());

  const handleReEnterFullscreen = async () => {
    const success = await enterBrowserFullscreen();
    if (success || isBrowserFullscreenActive()) {
      setIsInFullscreen(true);
      setHasInitiatedFullscreen(true);
    } else {
      alert(
        "Could not enter full screen mode.\n\n" +
        "Tip: If you have Chrome DevTools Device Toolbar (the phone icon / responsive mode) active, please disable it (Ctrl+Shift+M) so Chrome allows full screen."
      );
    }
  };

  // Monitor fullscreen & tab visibility changes
  useEffect(() => {
    const checkFullscreen = () => {
      const active = isBrowserFullscreenActive();
      setIsInFullscreen(active);
      if (active) {
        setHasInitiatedFullscreen(true);
      } else if (hasInitiatedFullscreen && !showSubmitModal) {
        setFullscreenViolations((prev) => prev + 1);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab switch detected!
        setIsInFullscreen(false);
        setFullscreenViolations((prev) => prev + 1);
      } else {
        checkFullscreen();
      }
    };

    const handleWindowBlur = () => {
      if (!isBrowserFullscreenActive()) {
        setIsInFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('MSFullscreenChange', checkFullscreen);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    // Initial check
    checkFullscreen();

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('mozfullscreenchange', checkFullscreen);
      document.removeEventListener('MSFullscreenChange', checkFullscreen);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [hasInitiatedFullscreen, showSubmitModal]);

  const currentQuestion: Question = questions[currentIndex] || questions[0];

  // Auto-submit when time reaches zero
  const triggerAutoSubmit = useCallback(() => {
    setHasTimeExpired(true);
    exitBrowserFullscreen();
    const timeSpent = totalSeconds - secondsRemaining;
    onSubmitAssessment(answers, Math.max(timeSpent, 1), fullscreenViolations);
  }, [totalSeconds, secondsRemaining, answers, fullscreenViolations, onSubmitAssessment]);

  // Countdown timer effect
  useEffect(() => {
    if (secondsRemaining <= 0) {
      triggerAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, triggerAutoSubmit]);

  // Format timer as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Stats for palette and submission modal
  const stats = useMemo(() => {
    let attempted = 0;
    let marked = 0;

    questions.forEach((q) => {
      const ansObj = answers[q.id];
      if (ansObj && ansObj.answer.trim().length > 0) {
        attempted++;
      }
      if (ansObj && ansObj.markedForReview) {
        marked++;
      }
    });

    const unattempted = questions.length - attempted;
    return { attempted, unattempted, marked, total: questions.length };
  }, [questions, answers]);

  // Handle MCQ selection
  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        answer: option,
        markedForReview: prev[currentQuestion.id]?.markedForReview || false
      }
    }));
  };

  // Handle Short Answer input
  const handleShortAnswerChange = (val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        answer: val,
        markedForReview: prev[currentQuestion.id]?.markedForReview || false
      }
    }));
  };

  // Toggle Mark for Review
  const toggleMarkForReview = () => {
    setAnswers((prev) => {
      const existing = prev[currentQuestion.id];
      return {
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          answer: existing ? existing.answer : '',
          markedForReview: existing ? !existing.markedForReview : true
        }
      };
    });
  };

  // Clear current response
  const handleClearResponse = () => {
    setAnswers((prev) => {
      const existing = prev[currentQuestion.id];
      if (!existing) return prev;
      return {
        ...prev,
        [currentQuestion.id]: {
          ...existing,
          answer: ''
        }
      };
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Confirm final submission
  const handleFinalSubmit = () => {
    setShowSubmitModal(false);
    exitBrowserFullscreen();
    const timeSpent = totalSeconds - secondsRemaining;
    onSubmitAssessment(answers, Math.max(timeSpent, 1), fullscreenViolations);
  };

  const currentAnswer = answers[currentQuestion.id]?.answer || '';
  const isMarked = answers[currentQuestion.id]?.markedForReview || false;

  // Question badge color
  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800'
  };

  // Timer urgency color
  const isUrgent = secondsRemaining < 300; // < 5 mins
  const isWarning = secondsRemaining < 600 && !isUrgent; // < 10 mins

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Sticky Assessment Sub-Header with Timer and Progress */}
      <div className="sticky top-16 z-30 w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white">
              Question {currentIndex + 1}
              <span className="text-zinc-400 font-normal"> / {questions.length}</span>
            </span>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {currentQuestion.type === 'mcq' ? 'MCQ' : 'Short Answer'}
              </span>
              <span className="text-xs font-medium text-zinc-400">&bull;</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {studentName} ({registrationNumber})
              </span>
            </div>
          </div>

          {/* Center / Right: Countdown Timer and Submit Button */}
          <div className="flex items-center gap-3">
            {/* Visual Timer Display */}
            <div
              id="assessment-timer"
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl font-mono font-bold text-sm sm:text-base border transition-colors ${
                isUrgent
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse'
                  : isWarning
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-[#2F8D46] dark:text-[#4ade80] border-emerald-300 dark:border-emerald-800'
              }`}
              title="Time Remaining"
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Submit Assessment Button */}
            <button
              id="open-submit-modal-btn"
              onClick={() => setShowSubmitModal(true)}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F8D46] hover:bg-[#257338] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F8D46]/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
            {/* Question Badges & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    difficultyColors[currentQuestion.difficulty]
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {currentQuestion.topic}
                </span>
              </div>

              {/* Mark for review toggle */}
              <button
                id="mark-for-review-btn"
                onClick={toggleMarkForReview}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isMarked
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
                <span className="text-[#2F8D46] dark:text-[#4ade80] mr-2">
                  Q{currentIndex + 1}.
                </span>
                {currentQuestion.question}
              </h2>

              {currentQuestion.codeSnippet && (
                <div className="p-4 rounded-xl bg-zinc-900 text-emerald-300 font-mono text-xs overflow-x-auto border border-zinc-800">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options / Answer Input Area */}
            <div className="mt-8 space-y-3">
              {currentQuestion.type === 'mcq' && currentQuestion.options ? (
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = currentAnswer === option;
                    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

                    return (
                      <label
                        key={idx}
                        id={`question-option-${idx}`}
                        onClick={() => handleSelectOption(option)}
                        className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#2F8D46] text-[#166534] dark:text-emerald-200 font-semibold shadow-xs ring-1 ring-[#2F8D46]'
                            : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#2F8D46] text-white'
                              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                          }`}
                        >
                          {optionLetter}
                        </div>
                        <span className="text-sm sm:text-base leading-snug">{option}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                /* Short Answer Type Question */
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span>
                      <strong>Short Answer Question:</strong> Type your answer in the field below. Keep it concise (1 to 2 words, or Big-O notation like <code className="font-mono bg-white dark:bg-zinc-800 px-1 py-0.5 rounded">O(1)</code>).
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor="short-answer-input"
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
                    >
                      Your Answer:
                    </label>
                    <input
                      id="short-answer-input"
                      type="text"
                      autoComplete="off"
                      placeholder="Type your answer here (e.g., O(1), Queue, Bellman Ford)"
                      value={currentAnswer}
                      onChange={(e) => handleShortAnswerChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 focus:border-[#2F8D46] dark:focus:border-[#2F8D46] text-zinc-900 dark:text-white font-medium text-base focus:outline-none focus:ring-2 focus:ring-[#2F8D46]/20 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer for Current Question */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                id="prev-question-btn"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                type="button"
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                id="clear-response-btn"
                onClick={handleClearResponse}
                disabled={!currentAnswer}
                type="button"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  id="next-question-btn"
                  onClick={handleNext}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#2F8D46] hover:bg-[#257338] text-white shadow-sm transition-all cursor-pointer"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="final-submit-trigger-btn"
                  onClick={() => setShowSubmitModal(true)}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#2F8D46] hover:bg-[#257338] text-white shadow-sm transition-all cursor-pointer"
                >
                  <span>Review & Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Number Buttons (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs sticky top-32">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                Question Palette (25)
              </h3>
              <span className="text-xs font-bold text-[#2F8D46] dark:text-[#4ade80]">
                {stats.attempted} / {stats.total} Answered
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#2F8D46]" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-zinc-200 dark:bg-zinc-700" />
                <span>Unattempted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500" />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md ring-2 ring-emerald-500 bg-white dark:bg-zinc-800" />
                <span>Current Question</span>
              </div>
            </div>

            {/* Grid of 25 Question Buttons (1, 2, 3... 25) */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const ansObj = answers[q.id];
                const isAnswered = ansObj && ansObj.answer.trim().length > 0;
                const isMarkedReview = ansObj && ansObj.markedForReview;
                const isCurrent = idx === currentIndex;

                let btnStyle =
                  'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';

                if (isAnswered) {
                  btnStyle =
                    'bg-[#2F8D46] text-white border-emerald-600 font-bold';
                }

                if (isMarkedReview) {
                  btnStyle =
                    'bg-amber-500 text-white border-amber-600 font-bold';
                }

                if (isCurrent) {
                  btnStyle += ' ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-zinc-900 scale-105';
                }

                return (
                  <button
                    key={q.id}
                    id={`palette-question-btn-${idx + 1}`}
                    onClick={() => setCurrentIndex(idx)}
                    type="button"
                    className={`h-10 rounded-xl flex items-center justify-center font-mono text-xs font-semibold border transition-all cursor-pointer hover:opacity-90 ${btnStyle}`}
                    title={`Go to Question ${idx + 1} (${q.type.toUpperCase()})`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Overview Summary Box */}
            <div className="mt-5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Attempted:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{stats.attempted}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Remaining:</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{stats.unattempted}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Marked for Review:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{stats.marked}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal as required */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#2F8D46]" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Confirm Submission
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                type="button"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to finish your assessment? Here is your current attempt summary:
            </p>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <div className="text-xl font-extrabold text-[#2F8D46] dark:text-[#4ade80]">
                  {stats.attempted}
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  Attempted
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <div className="text-xl font-extrabold text-zinc-700 dark:text-zinc-200">
                  {stats.unattempted}
                </div>
                <div className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                  Unfinished
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                  {stats.marked}
                </div>
                <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                  Marked
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span>
                Remaining Time: <strong>{formatTime(secondsRemaining)}</strong>. Once submitted, your score will be computed immediately.
              </span>
            </div>

            {/* Buttons: Go Back vs Confirm */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="modal-go-back-btn"
                onClick={() => setShowSubmitModal(false)}
                type="button"
                className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Go Back to Test
              </button>

              <button
                id="modal-confirm-submit-btn"
                onClick={handleFinalSubmit}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-[#2F8D46] hover:bg-[#257338] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Required Blocking Modal */}
      {!isInFullscreen && (
        <div
          id="fullscreen-blocker-modal"
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
        >
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 border-2 border-emerald-600/70 dark:border-emerald-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/20 animate-bounce">
              <Maximize2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <ShieldAlert className="w-3.5 h-3.5" />
                Fullscreen Mode Required
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                Assessment Locked
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Code Colosseum requires full screen mode throughout the assessment for contest integrity. Exiting full screen temporarily pauses and locks the test.
              </p>
            </div>

            {fullscreenViolations > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  Exits Detected: <strong>{fullscreenViolations}</strong> (Logged for Admin Review)
                </span>
              </div>
            )}

            <button
              id="enable-fullscreen-btn"
              type="button"
              onClick={handleReEnterFullscreen}
              className="w-full py-4 px-6 rounded-2xl bg-[#2F8D46] hover:bg-[#257338] text-white font-extrabold text-base shadow-xl shadow-emerald-700/30 hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 active:scale-[0.98]"
            >
              <Maximize2 className="w-5 h-5" />
              <span>Enable Full Screen & Resume Test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
