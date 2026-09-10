import { StudentRecord } from '../types/contest';

/**
 * Generates and triggers download of an official Microsoft Word (.doc) report
 * containing summary stats, qualified candidates, and all participant records.
 */
export function downloadWordReport(
  participants: StudentRecord[],
  cutoffMarks: number,
  contestTitle: string = 'Code Colosseum',
  chapterName: string = 'GeeksforGeeks Student Chapter VIT-AP'
) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalRegistered = participants.length;
  const submittedParticipants = participants.filter((p) => p.status === 'submitted');
  const totalCompleted = submittedParticipants.length;
  
  // Sort submitted by score descending
  const sortedParticipants = [...submittedParticipants].sort((a, b) => (b.score || 0) - (a.score || 0));
  const qualifiedList = sortedParticipants.filter((p) => (p.score || 0) >= cutoffMarks);
  const passPercentage = totalCompleted > 0 ? ((qualifiedList.length / totalCompleted) * 100).toFixed(1) : '0';
  const highestScore = totalCompleted > 0 ? Math.max(...submittedParticipants.map((p) => p.score || 0)) : 0;
  const avgScore =
    totalCompleted > 0
      ? (submittedParticipants.reduce((acc, p) => acc + (p.score || 0), 0) / totalCompleted).toFixed(1)
      : '0';

  const qualifiedRows = qualifiedList
    .map(
      (p, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#f0fdf4' : '#ffffff'};">
      <td style="padding: 8px 12px; border: 1px solid #bbf7d0; text-align: center; font-weight: bold;">${idx + 1}</td>
      <td style="padding: 8px 12px; border: 1px solid #bbf7d0; font-weight: bold; color: #166534;">${p.fullName}</td>
      <td style="padding: 8px 12px; border: 1px solid #bbf7d0; font-family: monospace;">${p.registrationNumber}</td>
      <td style="padding: 8px 12px; border: 1px solid #bbf7d0;">${p.email}</td>
      <td style="padding: 8px 12px; border: 1px solid #bbf7d0; text-align: center; font-weight: bold; font-size: 14px; color: #15803d;">${p.score} / 25</td>
      <td style="padding: 8px 12px; border: 1px solid #bbf7d0; text-align: center;">${p.mcqScore ?? '-'}</td>
      <td style="padding: 8px 12px; border: 1px solid #bbf7d0; text-align: center;">${p.shortScore ?? '-'}</td>
      <td style="padding: 8px 12px; border: 1px solid #bbf7d0; text-align: center; font-weight: bold; color: #16a34a;">QUALIFIED</td>
    </tr>`
    )
    .join('');

  const allRows = sortedParticipants
    .map(
      (p, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'};">
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 600;">${p.fullName}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-family: monospace;">${p.registrationNumber}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${p.email}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${p.score ?? 0} / 25</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">
        ${(p.score || 0) >= cutoffMarks 
          ? '<span style="color: #15803d; font-weight: bold; background-color: #dcfce7; padding: 2px 8px; border-radius: 4px;">QUALIFIED</span>' 
          : '<span style="color: #64748b; background-color: #f1f5f9; padding: 2px 8px; border-radius: 4px;">NOT QUALIFIED</span>'}
      </td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-size: 11px; color: #64748b;">${p.submissionTime ? new Date(p.submissionTime).toLocaleTimeString() : '-'}</td>
    </tr>`
    )
    .join('');

  const wordContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${contestTitle} - Official Assessment & Qualification Report</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    line-height: 1.4;
    color: #1e293b;
    margin: 20px;
  }
  h1 {
    color: #15803d;
    font-size: 24pt;
    margin-bottom: 4px;
  }
  h2 {
    color: #166534;
    font-size: 16pt;
    border-bottom: 2px solid #22c55e;
    padding-bottom: 4px;
    margin-top: 24px;
  }
  .header-box {
    background-color: #f0fdf4;
    border: 2px solid #22c55e;
    padding: 16px;
    border-radius: 6px;
    margin-bottom: 24px;
  }
  .stat-grid {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  .stat-cell {
    border: 1px solid #86efac;
    padding: 10px;
    background-color: #ffffff;
    text-align: center;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
    margin-bottom: 24px;
  }
  .table th {
    background-color: #15803d;
    color: #ffffff;
    padding: 10px;
    font-size: 11pt;
    text-align: left;
    border: 1px solid #14532d;
  }
</style>
</head>
<body>
  <div class="header-box">
    <h1>GEEKSFORGEEKS STUDENT CHAPTER</h1>
    <h3 style="color: #14532d; margin-top: 0;">${contestTitle.toUpperCase()} - DSA ASSESSMENT REPORT</h3>
    <p style="margin: 0; color: #475569;"><strong>Institution:</strong> ${chapterName} &bull; <strong>Generated Date:</strong> ${dateStr}</p>
    <p style="margin: 4px 0 0 0; color: #166534;"><strong>Configured Passing Cutoff:</strong> ${cutoffMarks} / 25 Marks (${((cutoffMarks / 25) * 100).toFixed(0)}%)</p>
  </div>

  <h2>EXECUTIVE SUMMARY</h2>
  <table class="stat-grid">
    <tr>
      <td class="stat-cell"><strong>Total Registrations</strong><br><span style="font-size: 18pt; color: #0f172a; font-weight: bold;">${totalRegistered}</span></td>
      <td class="stat-cell"><strong>Completed Submissions</strong><br><span style="font-size: 18pt; color: #0f172a; font-weight: bold;">${totalCompleted}</span></td>
      <td class="stat-cell" style="background-color: #dcfce7;"><strong>Qualified Candidates</strong><br><span style="font-size: 18pt; color: #15803d; font-weight: bold;">${qualifiedList.length}</span></td>
      <td class="stat-cell"><strong>Qualification Rate</strong><br><span style="font-size: 18pt; color: #15803d; font-weight: bold;">${passPercentage}%</span></td>
      <td class="stat-cell"><strong>Highest Score</strong><br><span style="font-size: 18pt; color: #0f172a; font-weight: bold;">${highestScore} / 25</span></td>
      <td class="stat-cell"><strong>Average Score</strong><br><span style="font-size: 18pt; color: #0f172a; font-weight: bold;">${avgScore}</span></td>
    </tr>
  </table>

  <h2>QUALIFIED STUDENTS (ROUND 2 ADVANCEMENT) - [${qualifiedList.length} STUDENTS]</h2>
  <p style="color: #475569; font-size: 10pt;">Students who met or exceeded the qualifying cutoff threshold of <strong>${cutoffMarks} marks</strong>:</p>
  ${
    qualifiedList.length > 0
      ? `
  <table class="table">
    <thead>
      <tr>
        <th style="text-align: center; width: 40px;">#</th>
        <th>Full Name</th>
        <th>Registration No.</th>
        <th>College Mail ID</th>
        <th style="text-align: center;">Total Score</th>
        <th style="text-align: center;">MCQ (20)</th>
        <th style="text-align: center;">Short Ans (5)</th>
        <th style="text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${qualifiedRows}
    </tbody>
  </table>`
      : '<p style="color: #b91c1c; font-style: italic;">No students have met the cutoff score yet.</p>'
  }

  <h2>ALL PARTICIPANTS MASTER ASSESSMENT RECORD - [${sortedParticipants.length} SUBMISSIONS]</h2>
  <table class="table">
    <thead>
      <tr style="background-color: #334155;">
        <th style="text-align: center; width: 40px; background-color: #334155;">Rank</th>
        <th style="background-color: #334155;">Full Name</th>
        <th style="background-color: #334155;">Registration No.</th>
        <th style="background-color: #334155;">Email</th>
        <th style="text-align: center; background-color: #334155;">Score</th>
        <th style="text-align: center; background-color: #334155;">Result</th>
        <th style="text-align: center; background-color: #334155;">Submission Time</th>
      </tr>
    </thead>
    <tbody>
      ${allRows || '<tr><td colspan="7" style="text-align: center; padding: 12px;">No submissions recorded yet.</td></tr>'}
    </tbody>
  </table>

  <br><hr style="border: none; border-top: 1px solid #cbd5e1; margin-top: 30px;">
  <p style="font-size: 9pt; color: #94a3b8; text-align: center;">
    Report automatically generated by Code Colosseum GFG Assessment Engine. Verified by GeeksforGeeks Student Chapter.
  </p>
</body>
</html>
`;

  const blob = new Blob(['\ufeff', wordContent], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Code_Colosseum_GFG_Report_Cutoff_${cutoffMarks}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and triggers download of a crystal-clear, structured Plain Text (.txt) report.
 * Strictly avoids any gibberish and provides clean, aligned tabular formatting.
 */
export function downloadTextReport(
  participants: StudentRecord[],
  cutoffMarks: number,
  contestTitle: string = 'Code Colosseum'
) {
  const dateStr = new Date().toLocaleString();
  const submitted = participants.filter((p) => p.status === 'submitted');
  const sorted = [...submitted].sort((a, b) => (b.score || 0) - (a.score || 0));
  const qualified = sorted.filter((p) => (p.score || 0) >= cutoffMarks);

  let text = '';
  text += '========================================================================================\n';
  text += `                GEEKSFORGEEKS STUDENT CHAPTER - ${contestTitle.toUpperCase()}\n`;
  text += '                       OFFICIAL DSA ASSESSMENT REPORT\n';
  text += '========================================================================================\n';
  text += `Generated At         : ${dateStr}\n`;
  text += `Total Registrations  : ${participants.length}\n`;
  text += `Completed Submissions: ${submitted.length}\n`;
  text += `Active Cutoff Marks  : ${cutoffMarks} / 25\n`;
  text += `Total Qualified      : ${qualified.length} students\n`;
  text += `Pass Rate            : ${submitted.length > 0 ? ((qualified.length / submitted.length) * 100).toFixed(1) : 0}%\n`;
  text += '========================================================================================\n\n';

  text += '----------------------------------------------------------------------------------------\n';
  text += ` SECTION 1: QUALIFIED STUDENTS FOR ROUND 2 (Score >= ${cutoffMarks})\n`;
  text += '----------------------------------------------------------------------------------------\n';
  text += `${'#'.padEnd(4)} | ${'NAME'.padEnd(24)} | ${'REG NO.'.padEnd(14)} | ${'SCORE'.padEnd(8)} | ${'COLLEGE EMAIL'}\n`;
  text += '-----+--------------------------+----------------+----------+---------------------------\n';

  if (qualified.length === 0) {
    text += '  No students have crossed the cutoff threshold yet.\n';
  } else {
    qualified.forEach((p, idx) => {
      const rank = String(idx + 1).padEnd(4);
      const name = p.fullName.slice(0, 24).padEnd(24);
      const reg = p.registrationNumber.padEnd(14);
      const score = `${p.score}/25`.padEnd(8);
      text += `${rank} | ${name} | ${reg} | ${score} | ${p.email}\n`;
    });
  }

  text += '\n\n----------------------------------------------------------------------------------------\n';
  text += ' SECTION 2: ALL PARTICIPANTS MASTER RESULTS LIST\n';
  text += '----------------------------------------------------------------------------------------\n';
  text += `${'RANK'.padEnd(4)} | ${'NAME'.padEnd(24)} | ${'REG NO.'.padEnd(14)} | ${'SCORE'.padEnd(8)} | ${'STATUS'.padEnd(14)} | ${'EMAIL'}\n`;
  text += '-----+--------------------------+----------------+----------+----------------+----------\n';

  if (sorted.length === 0) {
    text += '  No completed assessments found.\n';
  } else {
    sorted.forEach((p, idx) => {
      const rank = String(idx + 1).padEnd(4);
      const name = p.fullName.slice(0, 24).padEnd(24);
      const reg = p.registrationNumber.padEnd(14);
      const score = `${p.score ?? 0}/25`.padEnd(8);
      const status = (p.score || 0) >= cutoffMarks ? 'QUALIFIED'.padEnd(14) : 'NOT QUALIFIED'.padEnd(14);
      text += `${rank} | ${name} | ${reg} | ${score} | ${status} | ${p.email}\n`;
    });
  }

  text += '\n========================================================================================\n';
  text += '                     END OF REPORT - GEEKSFORGEEKS CONTEST ENGINE\n';
  text += '========================================================================================\n';

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Code_Colosseum_Results_Cutoff_${cutoffMarks}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a standard CSV file for spreadsheet usage in Excel/Google Sheets
 */
export function downloadCSVReport(
  participants: StudentRecord[],
  cutoffMarks: number
) {
  const headers = ['Rank', 'Full Name', 'Registration Number', 'College Email', 'Total Score', 'MCQ Score', 'Short Answer Score', 'Qualification Status', 'Submission Time'];
  const submitted = participants.filter((p) => p.status === 'submitted');
  const sorted = [...submitted].sort((a, b) => (b.score || 0) - (a.score || 0));

  const rows = sorted.map((p, idx) => [
    idx + 1,
    `"${p.fullName.replace(/"/g, '""')}"`,
    `"${p.registrationNumber}"`,
    `"${p.email}"`,
    p.score ?? 0,
    p.mcqScore ?? 0,
    p.shortScore ?? 0,
    (p.score || 0) >= cutoffMarks ? 'QUALIFIED' : 'NOT QUALIFIED',
    p.submissionTime ? `"${new Date(p.submissionTime).toISOString()}"` : '""'
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Code_Colosseum_Students_Cutoff_${cutoffMarks}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
