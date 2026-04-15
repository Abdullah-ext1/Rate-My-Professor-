import React from 'react';
import { useEffect, useState } from 'react';
import api from '../context/api';

const AttendanceMini = ({ onNavClick }) => {
  const [subjects, setSubjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/attendance');
        setSubjects(res.data.data || []);
      } catch {
        // silent
      } finally {
        setLoaded(true);
      }
    };
    fetch();
  }, []);

  const overall = subjects.length > 0
    ? Math.round(subjects.reduce((acc, s) => acc + ((s.present || 0) / (s.total || 1)) * 100, 0) / subjects.length)
    : 0;

  const getBarColor = (p) => {
    if (p >= 75) return '#1D9E75';
    if (p >= 60) return '#EF9F27';
    return '#E24B4A';
  };

  const radius = 20;
  const stroke = 3;
  const circumference = 2 * Math.PI * radius;
  const offset = loaded ? circumference - (overall / 100) * circumference : circumference;

  const topSubjects = subjects.slice(0, 3);

  return (
    <div 
      className="relative overflow-hidden bg-gradient-to-br from-[#1a1830] to-[#16151F] border border-primary/10 rounded-3xl p-3.5 cursor-pointer hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
      onClick={() => onNavClick && onNavClick('attendance')}
    >
      {/* Subtle glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/8 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/12 transition-colors duration-500" />

      <div className="relative z-10 flex items-center gap-3">
        {/* Mini circular progress */}
        <div className="relative flex-shrink-0">
          <svg width={(radius + stroke) * 2} height={(radius + stroke) * 2} className="transform -rotate-90">
            <circle
              cx={radius + stroke} cy={radius + stroke} r={radius}
              fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke}
            />
            <circle
              cx={radius + stroke} cy={radius + stroke} r={radius}
              fill="none" stroke={getBarColor(overall)} strokeWidth={stroke}
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-bold text-white font-syne">{overall}%</span>
          </div>
        </div>

        {/* Subject bars */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text flex items-center gap-1.5">
              📊 Attendance
            </span>
            <span className="text-[10px] text-primary-mid font-medium group-hover:underline">See all →</span>
          </div>
          <div className="flex flex-col gap-[5px]">
            {topSubjects.map((item, i) => {
              const perc = Math.round(((item.present || 0) / (item.total || 1)) * 100);
              const color = getBarColor(perc);
              return (
                <div key={item._id || i} className="flex items-center gap-2">
                  <span className="text-[10px] text-text3 w-14 flex-shrink-0 truncate font-medium">{item.name || 'Subject'}</span>
                  <div className="flex-1 h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: loaded ? `${perc}%` : '0%', backgroundColor: color, transitionDelay: `${i * 100}ms` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold min-w-[28px] text-right" style={{ color }}>{perc}%</span>
                </div>
              );
            })}
            {subjects.length === 0 && loaded && (
              <span className="text-[10px] text-text3">No subjects tracked yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMini;
