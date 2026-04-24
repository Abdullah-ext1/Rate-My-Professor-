import React from 'react';

const AttendanceFlexCard = ({ subjects = [], compact = false }) => {
  const normalizedSubjects = subjects.map((s) => ({
    present: Number(s.present ?? s.attended ?? 0),
    total: Number(s.total ?? 0),
    name: s.name ?? s.subject ?? 'Subject',
    _id: s._id,
  }));

  const overall = normalizedSubjects.length > 0
    ? Math.round(normalizedSubjects.reduce((acc, s) => acc + (s.total > 0 ? (s.present / s.total) * 100 : 0), 0) / normalizedSubjects.length)
    : 0;

  const getGrade = (p) => {
    if (p >= 90) return { label: 'GOAT 🐐', color: '#1D9E75' };
    if (p >= 75) return { label: 'Consistent 🔥', color: '#1D9E75' };
    if (p >= 60) return { label: 'Risky 😬', color: '#EF9F27' };
    return { label: 'Danger Zone 💀', color: '#E24B4A' };
  };

  const grade = getGrade(overall);

  // SVG circular progress
  const radius = compact ? 32 : 44;
  const stroke = compact ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overall / 100) * circumference;

  const getBarColor = (p) => {
    if (p >= 75) return '#1D9E75';
    if (p >= 60) return '#EF9F27';
    return '#E24B4A';
  };

  if (compact) {
    // Compact version for chat messages
    return (
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-[#1a1830] via-[#16151F] to-[#0E0D14] p-3 min-w-[220px] max-w-[280px]">
        {/* Glow */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-accent-teal/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          {/* Mini ring */}
          <div className="relative flex-shrink-0">
            <svg width={radius * 2 + stroke * 2} height={radius * 2 + stroke * 2} className="transform -rotate-90">
              <circle
                cx={radius + stroke} cy={radius + stroke} r={radius}
                fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke}
              />
              <circle
                cx={radius + stroke} cy={radius + stroke} r={radius}
                fill="none" stroke={getBarColor(overall)} strokeWidth={stroke}
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white font-syne">{overall}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] text-text3 font-medium uppercase tracking-wider">Attendance Flex</span>
            <span className="text-xs font-semibold" style={{ color: grade.color }}>{grade.label}</span>
            <span className="text-[10px] text-text3">{normalizedSubjects.length} subjects tracked</span>
          </div>
        </div>
      </div>
    );
  }

  // Full version for feed posts
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-[#1c1a35] via-[#16151F] to-[#0f0e18] p-5">
      {/* Decorative glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-accent-teal/8 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#AFA9EC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-primary-mid uppercase tracking-widest">Attendance Flex</span>
  <span className="ml-auto text-[10px] text-text3 bg-bg3/50 px-2 py-0.5 rounded-full border border-border">📚 {normalizedSubjects.length} subjects</span>
      </div>

      {/* Center ring + grade */}
      <div className="relative z-10 flex flex-col items-center mb-5">
        <div className="relative">
          <svg width={radius * 2 + stroke * 2} height={radius * 2 + stroke * 2} className="transform -rotate-90 drop-shadow-lg">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={getBarColor(overall)} stopOpacity="1" />
                <stop offset="100%" stopColor="#534AB7" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <circle
              cx={radius + stroke} cy={radius + stroke} r={radius}
              fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke}
            />
            <circle
              cx={radius + stroke} cy={radius + stroke} r={radius}
              fill="none" stroke="url(#ringGrad)" strokeWidth={stroke}
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white font-syne leading-none">{overall}<span className="text-lg text-primary-mid">%</span></span>
          </div>
        </div>
        <div className="mt-2 px-3 py-1 rounded-full border text-xs font-semibold"
          style={{ borderColor: grade.color + '40', backgroundColor: grade.color + '15', color: grade.color }}
        >
          {grade.label}
        </div>
      </div>

      {/* Subject bars */}
      <div className="relative z-10 flex flex-col gap-2">
        {normalizedSubjects.slice(0, 5).map((sub, i) => {
          const perc = sub.total > 0 ? Math.round((sub.present / sub.total) * 100) : 0;
          const barColor = getBarColor(perc);
          return (
            <div key={sub._id || i} className="flex items-center gap-2.5">
              <span className="text-[11px] text-text3 w-20 truncate font-medium">{sub.name || 'Subject'}</span>
              <div className="flex-1 h-[5px] bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${perc}%`, backgroundColor: barColor }}
                />
              </div>
              <span className="text-[11px] font-bold min-w-[32px] text-right" style={{ color: barColor }}>{perc}%</span>
            </div>
          );
        })}
        {normalizedSubjects.length > 5 && (
          <span className="text-[10px] text-text3 text-center mt-1">+{normalizedSubjects.length - 5} more subjects</span>
        )}
      </div>
    </div>
  );
};

export default AttendanceFlexCard;
