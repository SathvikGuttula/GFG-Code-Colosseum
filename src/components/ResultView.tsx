import React, { useEffect } from 'react';
import { EvaluationResult } from '../types/contest';
import { Trophy, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Award, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultViewProps {
  result: EvaluationResult;
  onReturnToLobby: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onReturnToLobby
}) => {
  const [showDetailedReview, setShowDetailedReview] = React.useState(false);

  // Trigger celebration confetti if qualified
  useEffect(() => {
    if (result.isQualified) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // graceful ignore
      }
    }
  }, [result.isQualified]);

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Result Status Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden transition-all ${
          result.isQualified
            ? 'bg-gradient-to-r from-emerald-800 via-green-800 to-emerald-900'
            : 'bg-gradient-to-r from-zinc-800 via-zinc-900 to-stone-900'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assessment Completed & Verified</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {result.isQualified ? '🎉 Congratulations, You Qualified!' : 'Thank You for Participating!'}
            </h1>

            <p className="text-sm text-zinc-200 max-w-lg">
              {result.isQualified
                ? `You have scored ${result.score} / ${result.totalQuestions} marks, crossing the Round 2 qualifying cutoff of ${result.cutoffMarks}. You will receive official next-round communication via your college email.`
                : `You scored ${result.score} / ${result.totalQuestions} marks. The current qualifying cutoff set by the admin is ${result.cutoffMarks} marks. Keep up your DSA journey with GeeksforGeeks!`}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-medium text-emerald-100">
              <span className="bg-black/30 px-3 py-1.5 rounded-xl font-mono">
                {result.studentName} ({result.registrationNumber})
              </span>
              <span className="bg-black/30 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Time: {formatSeconds(result.timeSpentSeconds)}
              </span>
            </div>
          </div>

          {/* Big Score Card Badge */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[150px]">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200 block mb-1">
              Your Final Score
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono leading-none">
              {result.score}
              <span className="text-xl text-emerald-200 font-normal"> / 25</span>
            </div>
            <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
              {result.percentage.toFixed(0)}% Accuracy
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            MCQ Section Score
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
            {result.mcqScore} <span className="text-sm font-normal text-zinc-400">/ 20</span>
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
            Mix of Easy, Medium, Hard MCQs
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            Short Answer Score
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
            {result.shortScore} <span className="text-sm font-normal text-zinc-400">/ 5</span>
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
            Direct answer evaluation
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            Qualification Cutoff
          </div>
          <div className="text-2xl font-black font-mono flex items-center gap-2">
            <span className="text-zinc-900 dark:text-white">{result.cutoffMarks}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                result.isQualified
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              {result.isQualified ? 'PASSED' : 'BELOW CUTOFF'}
            </span>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Configurable live by Admin
          </div>
        </div>
      </div>

      {/* Accordion: Toggle Detailed Answers & Explanations */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs mb-8">
        <div
          onClick={() => setShowDetailedReview(!showDetailedReview)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#2F8D46]" />
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Detailed Question-by-Question Review & Explanations
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Inspect your responses, correct answers, and algorithm complexities.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {showDetailedReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showDetailedReview && (
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            {result.detailedResults.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-4 rounded-xl border transition-all ${
                  item.isCorrect
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-zinc-500 dark:text-zinc-400">
                      Q{idx + 1}.
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {item.topic}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md font-mono text-zinc-500 dark:text-zinc-400">
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold">
                    {item.isCorrect ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="text-red-700 dark:text-red-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                  {item.questionText}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-zinc-500 dark:text-zinc-400 block font-medium">
                      Your Answer:
                    </span>
                    <span
                      className={`font-semibold ${
                        item.isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {item.studentAnswer || '(No answer provided)'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-zinc-500 dark:text-zinc-400 block font-medium">
                      Correct Answer:
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {item.correctAnswer}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-zinc-600 dark:text-zinc-300 bg-white/60 dark:bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60">
                  <strong className="text-zinc-800 dark:text-zinc-200">Explanation: </strong>
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onReturnToLobby}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Contest Overview</span>
        </button>
      </div>
    </div>
  );
};
