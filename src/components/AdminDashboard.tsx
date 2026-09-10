import React, { useState, useMemo } from 'react';
import { StudentRecord } from '../types/contest';
import {
  downloadWordReport,
  downloadTextReport,
  downloadCSVReport
} from '../utils/exporter';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Sliders,
  Mail,
  FileText,
  FileDown,
  Users,
  Award,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Copy,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface AdminDashboardProps {
  participants: StudentRecord[];
  isTestAccessOpen: boolean;
  onToggleTestAccess: () => void;
  cutoffMarks: number;
  onUpdateCutoff: (newCutoff: number) => void;
  adminEmail: string;
  onResetData: () => void;
  onDeleteParticipant: (idOrEmail: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  participants,
  isTestAccessOpen,
  onToggleTestAccess,
  cutoffMarks,
  onUpdateCutoff,
  adminEmail,
  onResetData,
  onDeleteParticipant
}) => {
  const [activeTab, setActiveTab] = useState<'qualified' | 'all'>('qualified');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<StudentRecord | null>(null);
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState(false);

  // Email draft state
  const [emailSubject, setEmailSubject] = useState(
    "Congratulations! You've Qualified for Round 2 of Code Colosseum - GFG Chapter"
  );
  const [emailBody, setEmailBody] = useState(
    `Dear Code Colosseum Participant,

Congratulations! On behalf of the GeeksforGeeks Student Chapter VIT-AP, we are pleased to inform you that you have cleared the Round 1 DSA assessment of Code Colosseum.

Your consistent performance has met the qualifying cutoff threshold of ${cutoffMarks}/25 marks.

Next Steps:
- Round 2 (Algorithmic Battleground) will commence on Saturday at 4:00 PM IST.
- A technical briefing call will be scheduled 30 minutes prior.
- Ensure your development environment and HackerRank / GFG handles are active.

Keep honing your problem-solving craft!

Best regards,
GeeksforGeeks Student Chapter Core Team
VIT-AP University`
  );

  // Filter submitted participants
  const submittedParticipants = useMemo(
    () => participants.filter((p) => p.status === 'submitted'),
    [participants]
  );

  // Sort participants by score descending
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      // submitted first, then by score
      if (a.status === 'submitted' && b.status !== 'submitted') return -1;
      if (b.status === 'submitted' && a.status !== 'submitted') return 1;
      return (b.score || 0) - (a.score || 0);
    });
  }, [participants]);

  // Qualified participants (score >= cutoff)
  const qualifiedList = useMemo(() => {
    return sortedParticipants.filter(
      (p) => p.status === 'submitted' && (p.score || 0) >= cutoffMarks
    );
  }, [sortedParticipants, cutoffMarks]);

  // Search filtered
  const filteredList = useMemo(() => {
    const list = activeTab === 'qualified' ? qualifiedList : sortedParticipants;
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.registrationNumber.toLowerCase().includes(q)
    );
  }, [activeTab, qualifiedList, sortedParticipants, searchQuery]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = participants.length;
    const completed = submittedParticipants.length;
    const inProgress = participants.filter((p) => p.status === 'in-progress').length;
    const qualifiedCount = qualifiedList.length;
    const passRate = completed > 0 ? ((qualifiedCount / completed) * 100).toFixed(1) : '0';
    const highestScore = completed > 0 ? Math.max(...submittedParticipants.map((p) => p.score || 0)) : 0;
    const avgScore =
      completed > 0
        ? (submittedParticipants.reduce((acc, p) => acc + (p.score || 0), 0) / completed).toFixed(1)
        : '0';

    return { total, completed, inProgress, qualifiedCount, passRate, highestScore, avgScore };
  }, [participants, submittedParticipants, qualifiedList]);

  // Copy qualified candidate emails
  const handleCopyQualifiedEmails = () => {
    const emails = qualifiedList.map((p) => p.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  // Copy email body
  const handleCopyBody = () => {
    navigator.clipboard.writeText(emailBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2500);
  };

  // Open in Mail client
  const handleOpenMailClient = () => {
    const bcc = qualifiedList.map((p) => p.email).join(',');
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  };

  const handleSimulateSend = () => {
    setEmailSentAlert(true);
    setTimeout(() => {
      setEmailSentAlert(false);
      setShowEmailModal(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Contest Administrator Control Room
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Code Colosseum &bull; Assessment Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Authenticated Admin: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{adminEmail}</span>
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onResetData}
            type="button"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 bg-white hover:bg-red-50 dark:bg-zinc-900 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer flex items-center gap-1.5"
            title="Clear all recorded test submissions"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Contest Records</span>
          </button>
        </div>
      </div>

      {/* Control Station: Test Access Toggle & Cutoff Controller */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Real-time Access Gatekeeper */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Live Test Access Control
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isTestAccessOpen
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}
              >
                {isTestAccessOpen ? 'OPEN TO ALL' : 'ACCESS LOCKED'}
              </span>
            </div>

            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              {isTestAccessOpen ? 'Students can start the test' : 'Access is currently blocked'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Toggle this control to allow or block participants from initiating the 40-minute DSA assessment.
            </p>
          </div>

          <button
            id="toggle-test-access-btn"
            onClick={onToggleTestAccess}
            type="button"
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              isTestAccessOpen
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#2F8D46] hover:bg-[#257338] text-white'
            }`}
          >
            {isTestAccessOpen ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Lock Test Access Now</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Open Access to Students</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Real-time Cutoff Controller */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Round 2 Qualifying Cutoff
              </span>
              <span className="text-xs font-mono font-bold text-[#2F8D46] dark:text-[#4ade80]">
                {cutoffMarks} / 25 Marks
              </span>
            </div>

            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Dynamic Cutoff Filter
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Adjusting this threshold immediately recalculates qualified candidates and updates all reports.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                id="cutoff-slider"
                type="range"
                min="1"
                max="25"
                value={cutoffMarks}
                onChange={(e) => onUpdateCutoff(Number(e.target.value))}
                className="flex-1 accent-[#2F8D46] cursor-pointer"
              />
              <div className="w-12 text-center py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-mono font-bold text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700">
                {cutoffMarks}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              <span>Min: 1</span>
              <span>Default: 15 (60%)</span>
              <span>Max: 25</span>
            </div>
          </div>
        </div>

        {/* 3. Export Center (Word & Text download as demanded) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Report & Export Center
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                VERIFIED FORMAT
              </span>
            </div>

            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Download Official Reports
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Download clean Word (.doc) and formatted Text (.txt) reports with zero gibberish.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="download-word-btn"
              onClick={() => downloadWordReport(participants, cutoffMarks)}
              type="button"
              className="px-3 py-2.5 rounded-xl bg-[#2F8D46] hover:bg-[#257338] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Download clean formatted Microsoft Word (.doc) document"
            >
              <FileDown className="w-4 h-4" />
              <span>Word (.doc)</span>
            </button>

            <button
              id="download-text-btn"
              onClick={() => downloadTextReport(participants, cutoffMarks)}
              type="button"
              className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Download structured Plain Text (.txt) document"
            >
              <FileText className="w-4 h-4" />
              <span>Text (.txt)</span>
            </button>

            <button
              id="download-csv-btn"
              onClick={() => downloadCSVReport(participants, cutoffMarks)}
              type="button"
              className="col-span-2 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Download CSV for Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Total Logged In
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono mt-1">
            {stats.total}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">VIT-AP Students</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Completed
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono mt-1">
            {stats.completed}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Submitted tests</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            In Progress
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
            {stats.inProgress}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Active timer</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            Qualified (Round 2)
          </div>
          <div className="text-2xl font-black text-[#2F8D46] dark:text-[#4ade80] font-mono mt-1">
            {stats.qualifiedCount}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Score &ge; {cutoffMarks}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Pass Rate
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono mt-1">
            {stats.passRate}%
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Of submissions</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Highest Score
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono mt-1">
            {stats.highestScore} <span className="text-xs text-zinc-400 font-normal">/25</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Avg: {stats.avgScore}</div>
        </div>
      </div>

      {/* Main Tabbed Lists: Qualified Candidates vs All Participants */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 w-fit">
            <button
              id="tab-qualified-btn"
              onClick={() => setActiveTab('qualified')}
              type="button"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qualified'
                  ? 'bg-white dark:bg-zinc-900 text-[#2F8D46] dark:text-[#4ade80] shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Qualified for Round 2</span>
              <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {qualifiedList.length}
              </span>
            </button>

            <button
              id="tab-all-btn"
              onClick={() => setActiveTab('all')}
              type="button"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Participants</span>
              <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                {participants.length}
              </span>
            </button>
          </div>

          {/* Right: Search & Draft Congratulations CTA */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, reg no, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2F8D46]/40"
              />
            </div>

            {activeTab === 'qualified' && (
              <button
                id="draft-congrats-email-btn"
                onClick={() => setShowEmailModal(true)}
                disabled={qualifiedList.length === 0}
                type="button"
                className="px-4 py-2 rounded-xl bg-[#2F8D46] hover:bg-[#257338] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>Draft Congratulations Email ({qualifiedList.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content 1: Qualified List */}
        {activeTab === 'qualified' && (
          <div>
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Students scoring &ge; <strong>{cutoffMarks} marks</strong> are automatically shortlisted here.
                </span>
              </div>
              <button
                onClick={handleCopyQualifiedEmails}
                type="button"
                className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedEmails ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmails ? 'Copied Emails!' : 'Copy All Qualified Emails (BCC)'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-4 text-center w-12">#</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Reg Number</th>
                    <th className="py-3 px-4">College Email ID</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">MCQ (20)</th>
                    <th className="py-3 px-4 text-center">Short (5)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredList.length > 0 ? (
                    filteredList.map((p, idx) => (
                      <tr
                        key={p.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-zinc-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                          {p.fullName}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-300">
                          {p.registrationNumber}
                        </td>
                        <td className="py-3 px-4 text-zinc-600 dark:text-zinc-300 font-mono">
                          {p.email}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-sm text-[#2F8D46] dark:text-[#4ade80]">
                          {p.score} <span className="text-[10px] font-normal text-zinc-400">/25</span>
                        </td>
                        <td className="py-3 px-4 text-center text-zinc-700 dark:text-zinc-300">
                          {p.mcqScore ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-center text-zinc-700 dark:text-zinc-300">
                          {p.shortScore ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            QUALIFIED
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setParticipantToDelete(p)}
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-800 transition-colors cursor-pointer"
                            title={`Delete record for ${p.fullName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-zinc-400">
                        {qualifiedList.length === 0
                          ? `No participants have scored >= ${cutoffMarks} marks yet.`
                          : 'No matching qualified students found for this search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 2: All Participants */}
        {activeTab === 'all' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Reg Number</th>
                  <th className="py-3 px-4">College Email ID</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Result Status</th>
                  <th className="py-3 px-4 text-center">Time Spent</th>
                  <th className="py-3 px-4 text-center">Submission Status</th>
                  <th className="py-3 px-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredList.length > 0 ? (
                  filteredList.map((p, idx) => {
                    const isPassed = p.status === 'submitted' && (p.score || 0) >= cutoffMarks;

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-zinc-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                          {p.fullName}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-300">
                          {p.registrationNumber}
                        </td>
                        <td className="py-3 px-4 text-zinc-600 dark:text-zinc-300 font-mono">
                          {p.email}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-sm">
                          {p.status === 'submitted' ? (
                            <span
                              className={
                                isPassed
                                  ? 'text-[#2F8D46] dark:text-[#4ade80] font-black'
                                  : 'text-zinc-700 dark:text-zinc-300'
                              }
                            >
                              {p.score}{' '}
                              <span className="text-[10px] font-normal text-zinc-400">/25</span>
                            </span>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {p.status === 'submitted' ? (
                            isPassed ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                QUALIFIED
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                                BELOW CUTOFF
                              </span>
                            )
                          ) : (
                            <span className="text-zinc-400 text-[11px]">&mdash;</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-zinc-500 dark:text-zinc-400">
                          {p.timeTakenSeconds
                            ? `${Math.floor(p.timeTakenSeconds / 60)}m ${p.timeTakenSeconds % 60}s`
                            : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {p.status === 'submitted' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          ) : p.status === 'in-progress' ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                              <Clock className="w-3.5 h-3.5" /> In Progress
                            </span>
                          ) : (
                            <span className="text-zinc-400">Registered</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setParticipantToDelete(p)}
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-800 transition-colors cursor-pointer"
                            title={`Delete record for ${p.fullName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-zinc-400">
                      No participants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Confirm Delete Individual Participant Log */}
      {participantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Delete Participant Record
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Permanently remove this student's login and logs
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Student:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{participantToDelete.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Registration No:</span>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{participantToDelete.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">College Email:</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">{participantToDelete.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Login Status:</span>
                <span className="capitalize font-semibold text-zinc-800 dark:text-zinc-200">{participantToDelete.status}</span>
              </div>
              {participantToDelete.status === 'submitted' && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Contest Score:</span>
                  <span className="font-bold text-[#2F8D46]">{participantToDelete.score} / 25</span>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete this participant's logs? Once deleted, the student's entry is wiped, allowing them to re-register and re-enter if required.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setParticipantToDelete(null)}
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteParticipant(participantToDelete.email);
                  setParticipantToDelete(null);
                }}
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Log</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Draft Congratulations Email to Qualified Students */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#2F8D46]" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Draft Congratulations Mail (Round 2 Qualified)
                </h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                type="button"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {emailSentAlert && (
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulation email notification sent to {qualifiedList.length} qualified students!</span>
              </div>
            )}

            {/* Recipient Chips */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Recipients (Qualified Candidates: {qualifiedList.length})
                </label>
                <button
                  onClick={handleCopyQualifiedEmails}
                  type="button"
                  className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedEmails ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmails ? 'Copied!' : 'Copy All (BCC)'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 max-h-24 overflow-y-auto flex flex-wrap gap-1.5 text-[11px]">
                {qualifiedList.map((p) => (
                  <span
                    key={p.email}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 font-mono text-zinc-700 dark:text-zinc-300"
                  >
                    {p.email}
                  </span>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2F8D46]"
              />
            </div>

            {/* Email Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Email Message Body
                </label>
                <button
                  onClick={handleCopyBody}
                  type="button"
                  className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedBody ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBody ? 'Copied Body!' : 'Copy Text'}</span>
                </button>
              </div>
              <textarea
                rows={9}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full p-3.5 rounded-xl text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F8D46] leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setShowEmailModal(false)}
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenMailClient}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Open in default email app (Gmail / Thunderbird / Outlook) with all emails in BCC"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Gmail / Mail App</span>
                </button>

                <button
                  onClick={handleSimulateSend}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#2F8D46] hover:bg-[#257338] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
