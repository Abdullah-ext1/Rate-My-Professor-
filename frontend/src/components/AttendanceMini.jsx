import React from 'react';

const AttendanceMini = () => (
  <div className="bg-bg2 border border-border rounded-3xl p-3">
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-xs font-medium text-text">Your attendance</span>
      <span className="text-xs text-primary-mid cursor-pointer hover:underline">See all</span>
    </div>
    <div className="flex flex-col gap-1.75">
      {[
        { subject: 'Data Struct.', percent: 84, color: 'bg-accent-teal' },
        { subject: 'OS', percent: 76, color: 'bg-accent-amber' },
        { subject: 'DBMS', percent: 63, color: 'bg-accent-red' },
      ].map(item => (
        <div key={item.subject} className="flex items-center gap-2">
          <span className="text-xs text-text3 w-16 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{item.subject}</span>
          <div className="flex-1 h-1 bg-bg3 rounded overflow-hidden">
            <div className={`h-full rounded ${item.color}`} style={{ width: `${item.percent}%` }}></div>
          </div>
          <span className="text-xs font-medium min-w-7 text-right" style={{ color: item.color.split('-')[2] === 'teal' ? '#1D9E75' : item.color.split('-')[2] === 'amber' ? '#EF9F27' : '#E24B4A' }}>
            {item.percent}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AttendanceMini;
