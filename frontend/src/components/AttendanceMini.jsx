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

  const getBarColorClass = (p) => {
    if (p >= 75) return 'bg-accent-teal';
    if (p >= 60) return 'bg-accent-amber';
    return 'bg-accent-red';
  };

  const getTextColorHex = (p) => {
    if (p >= 75) return '#1D9E75';
    if (p >= 60) return '#EF9F27';
    return '#E24B4A';
  };

  const topSubjects = subjects.slice(0, 3);

  // If we don't have dynamic subjects yet or loading failed, we can fallback to the old static ones or just show what we have.
  const displaySubjects = topSubjects.length > 0 ? topSubjects.map(item => ({
    subject: item.subject || 'Subject',
    percent: item.totalClasses > 0 ? Math.round(((item.classAttended || 0) / item.totalClasses) * 100) : 0,
  })) : [];

  return (
    <div className="bg-bg2 border border-border rounded-3xl p-3 cursor-pointer" onClick={() => onNavClick && onNavClick('attendance')}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-medium text-text">Your attendance</span>
        <span className="text-xs text-primary-mid cursor-pointer hover:underline">See all</span>
      </div>
      <div className="flex flex-col gap-1.75">
        {displaySubjects.length > 0 ? (
          displaySubjects.map(item => {
             const colorClass = getBarColorClass(item.percent);
             return (
              <div key={item.subject} className="flex items-center gap-2">
                <span className="text-xs text-text3 w-16 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{item.subject}</span>
                <div className="flex-1 h-1 bg-bg3 rounded overflow-hidden">
                  <div className={`h-full rounded ${colorClass} transition-all duration-700 ease-out`} style={{ width: loaded ? `${item.percent}%` : '0%' }}></div>
                </div>
                <span className="text-xs font-medium min-w-7 text-right" style={{ color: getTextColorHex(item.percent) }}>
                  {item.percent}%
                </span>
              </div>
            );
          })
        ) : (
          loaded && <span className="text-[10px] text-text3">No subjects tracked yet</span>
        )}
      </div>
    </div>
  );
};

export default AttendanceMini;
