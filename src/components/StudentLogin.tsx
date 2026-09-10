import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Code2, Clock, UserCheck } from 'lucide-react';
import { ADMIN_WHITELIST } from '../data/dsaQuestions';

interface StudentLoginProps {
  onLogin: (fullName: string, email: string, registrationNumber: string, isAdmin: boolean) => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Validates college mail id and checks admin whitelist
  const validateCollegeEmail = (emailStr: string): { isValid: boolean; regNo: string; isAdmin: boolean; errorMsg?: string } => {
    const trimmed = emailStr.trim().toLowerCase();

    // Check if it's in the admin whitelist
    const isWhitelistedAdmin = ADMIN_WHITELIST.some((w) => w.toLowerCase() === trimmed);
    if (isWhitelistedAdmin) {
      return { isValid: true, regNo: 'ADMIN', isAdmin: true };
    }

    // Must end with @vitapstudent.ac.in
    if (!trimmed.endsWith('@vitapstudent.ac.in')) {
      return {
        isValid: false,
        regNo: '',
        isAdmin: false,
        errorMsg: 'Only college emails ending with @vitapstudent.ac.in are allowed to participate.'
      };
    }

    // Must follow the format name.registrationno@vitapstudent.ac.in
    const localPart = trimmed.slice(0, -'@vitapstudent.ac.in'.length);
    const parts = localPart.split('.');

    if (parts.length < 2) {
      return {
        isValid: false,
        regNo: '',
        isAdmin: false,
        errorMsg: 'Email must follow the format name.registrationno@vitapstudent.ac.in (e.g. ramesh.24bce2315@vitapstudent.ac.in).'
      };
    }

    const regCandidate = parts[parts.length - 1];
    // Check if registration number contains letters and numbers (e.g. 24bce2315, 25bca7602, 23bce7190)
    const isValidRegNo =
      /^[0-9]{2}[a-zA-Z]{2,5}[0-9]{3,5}$/i.test(regCandidate) ||
      (/^[a-zA-Z0-9]{6,12}$/i.test(regCandidate) && /[0-9]/.test(regCandidate) && /[a-zA-Z]/.test(regCandidate));

    if (!isValidRegNo) {
      return {
        isValid: false,
        regNo: '',
        isAdmin: false,
        errorMsg: 'Invalid registration number in email. Expected format: name.registrationno@vitapstudent.ac.in (e.g. 24BCE2315).'
      };
    }

    return {
      isValid: true,
      regNo: regCandidate.toUpperCase(),
      isAdmin: false
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const validation = validateCollegeEmail(email);
    if (!validation.isValid) {
      setError(validation.errorMsg || 'Please enter a valid College Email ID.');
      return;
    }

    onLogin(fullName.trim(), email.trim().toLowerCase(), validation.regNo, validation.isAdmin);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Informational Showcase */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Code <span className="text-[#2F8D46] dark:text-[#38b757]">Colosseum</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
              The premier Data Structures & Algorithms assessment by GeeksforGeeks. Qualify for Round 2 and prove your algorithmic problem-solving mastery.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-2">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">25 Questions</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">20 MCQs + 5 Short Answers</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">40 Minutes</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Individual countdown timer</div>
            </div>
          </div>
        </div>

        {/* Right Form Container: Unified Login for Everyone */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2F8D46]" />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Contest Registration & Login
              </h2>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="student-fullname"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="student-fullname"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8D46] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="student-email"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  College Email ID
                </label>
                <input
                  id="student-email"
                  type="email"
                  required
                  placeholder="name.registrationno@vitapstudent.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8D46] focus:border-transparent transition-all"
                />
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Format: <span className="font-mono text-zinc-700 dark:text-zinc-300">name.registrationno@vitapstudent.ac.in</span>
                </p>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#2F8D46] hover:bg-[#257338] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F8D46]/50"
              >
                <span>Enter Code Colosseum</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
