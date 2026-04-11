import React from 'react';

const AttendanceCard = ({ status = 'safe', subject, prof, percent, attended, total, canBunk, onChange }) => {
  const statusStyles = {
    safe: { border: 'border-l-4 border-l-accent-teal', percentColor: 'text-accent-teal', barColor: 'bg-accent-teal' },
    warn: { border: 'border-l-4 border-l-accent-amber', percentColor: 'text-accent-amber', barColor: 'bg-accent-amber' },
    danger: { border: 'border-l-4 border-l-accent-red', percentColor: 'text-accent-red', barColor: 'bg-accent-red' },
  };
  const style = statusStyles[status];

  return (
    <div className={`bg-bg2 border border-border rounded-3xl p-3 ${style.border}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-sm font-medium text-text">{subject}</div>
          <div className="text-xs text-text3 mt-0.5">{prof}</div>
        </div>
        <div className={`text-2xl font-bold ${style.percentColor} font-syne`}>{percent}%</div>
      </div>
      <div className="h-1 bg-bg3 rounded overflow-hidden mb-1.75">
        <div className={`h-full ${style.barColor}`} style={{ width: `${percent}%` }}></div>
      </div>
      <div className="flex justify-between text-xs text-text3 mb-2.5">
        <span>{attended} / {total} classes</span>
        <span className={status === 'danger' ? 'text-accent-red font-medium' : status === 'warn' ? 'text-accent-amber font-medium' : 'text-accent-teal font-medium'}>
          {canBunk === 'Cannot bunk' ? canBunk : `Can bunk ${canBunk} more`}
        </span>
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => onChange('attend')} className="flex-1 text-xs py-1.5 rounded-2xl bg-opacity-12 bg-accent-teal border border-opacity-30 border-accent-teal text-accent-teal font-medium cursor-pointer hover:bg-opacity-20 transition-colors">Attended</button>
        <button onClick={() => onChange('bunk')} className="flex-1 text-xs py-1.5 rounded-2xl bg-bg3 border border-border text-text3 font-medium cursor-pointer hover:bg-opacity-80 transition-colors">Bunked</button>
        <button onClick={() => onChange('bulk')} className="flex-1 text-xs py-1.5 rounded-2xl bg-bg3 border border-border text-text3 font-medium cursor-pointer hover:bg-opacity-80 transition-colors">Edit Bulk</button>
      </div>
    </div>
  );
};

export default AttendanceCard;
