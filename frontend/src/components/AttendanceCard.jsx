import React from 'react';

const AttendanceCard = ({ status = 'safe', subject, prof, percent, attended, total, canBunk, onChange }) => {
  const getBarColor = (s) => {
    if (s === 'safe') return '#1D9E75';
    if (s === 'warn') return '#EF9F27';
    return '#E24B4A';
  };

  const barColor = getBarColor(status);

  const getBunkStyle = () => {
    if (status === 'danger') return { bg: 'rgba(226,75,74,0.1)', color: '#E24B4A' };
    if (status === 'warn') return { bg: 'rgba(239,159,39,0.1)', color: '#EF9F27' };
    return { bg: 'rgba(29,158,117,0.1)', color: '#1D9E75' };
  };

  const bunkStyle = getBunkStyle();

  return (
    <div className="group relative overflow-hidden bg-bg2 border border-border hover:border-primary/15 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      {/* Left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ backgroundColor: barColor }}
      />

      <div className="flex items-start justify-between mb-3 pl-2">
        <div>
          <div className="text-sm font-semibold text-text group-hover:text-white transition-colors">{subject}</div>
          <div className="text-[11px] text-text3 mt-0.5 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {prof}
          </div>
        </div>
        <div className="text-2xl font-extrabold font-syne" style={{ color: barColor }}>{percent}%</div>
      </div>

      {/* Progress bar */}
      <div className="h-[5px] bg-white/[0.04] rounded-full overflow-hidden mb-3 ml-2">
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${percent}%`, 
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}40`
          }}
        />
      </div>

      <div className="flex justify-between items-center mb-3 ml-2">
        <span className="text-[11px] text-text3 font-medium">{attended} / {total} classes</span>
        <span 
          className="text-[11px] font-medium px-2 py-0.5 rounded-md"
          style={{ backgroundColor: bunkStyle.bg, color: bunkStyle.color }}
        >
          {canBunk === 'Cannot bunk' ? canBunk : `Can bunk ${canBunk} more`}
        </span>
      </div>

      <div className="flex gap-1.5 ml-2">
        <button 
          onClick={() => onChange('attend')} 
          className="flex-1 text-[11px] py-2 rounded-xl bg-accent-teal/10 border border-accent-teal/20 text-accent-teal font-medium cursor-pointer hover:bg-accent-teal/20 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
          Present
        </button>
        <button 
          onClick={() => onChange('bunk')} 
          className="flex-1 text-[11px] py-2 rounded-xl bg-bg3 border border-border text-text3 font-medium cursor-pointer hover:bg-bg4 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          Absent
        </button>
        <button 
          onClick={() => onChange('bulk')}
          className="flex-1 text-[11px] py-2 rounded-xl bg-bg3 border border-border text-text3 font-medium cursor-pointer hover:bg-bg4 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          Edit
        </button>
        <button 
          onClick={() => onChange('flex')}
          className="flex-1 text-[11px] py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-medium cursor-pointer hover:bg-emerald-500/20 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
          Flex
        </button>
      </div>
    </div>
  );
};

export default AttendanceCard;
