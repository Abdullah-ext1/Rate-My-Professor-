import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../context/api';
import AttendanceFlexCard from '../components/AttendanceFlexCard';

const ShareModal = ({ isOpen, onClose, onShare, subjects }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center transition-opacity" onClick={onClose}>
      <div 
        className="bg-gradient-to-b from-[#1a1930] to-[#0E0D14] w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 border border-primary/15 shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar for mobile */}
        <div className="w-10 h-1 bg-border2 rounded-full mx-auto mb-5 sm:hidden" />
        
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-accent-teal/15 border border-accent-teal/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-text font-syne">Flex in Global Chat</h3>
            <p className="text-xs text-text3 mt-0.5">Show off your attendance stats 💪</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-full bg-bg3 flex items-center justify-center hover:bg-bg4 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E5C72" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview */}
        <div className="mb-5">
          <span className="text-[10px] text-text3 uppercase tracking-widest font-semibold mb-2 block ml-1">Preview</span>
          <AttendanceFlexCard subjects={subjects} compact />
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-xl bg-accent-teal/8 border border-accent-teal/15">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span className="text-[11px] text-accent-teal">Your stats will be shared anonymously in Global Chat</span>
        </div>

        {/* Share button */}
        <button 
          onClick={onShare}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-teal to-[#15B886] text-white text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-accent-teal/25 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          Send to Global Chat 💬
        </button>
      </div>
    </div>
  );
};

const AttendanceScreen = ({ onNavClick }) => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get('/attendance');
        const mapped = (response.data.data || []).map(att => ({
          ...att,
          name: att.subject,
          present: att.classAttended,
          total: att.totalClasses
        }));
        setSubjects(mapped);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setIsLoading(false);
        setTimeout(() => setAnimateIn(true), 100);
      }
    };
    fetchAttendance();
  }, []);

  const overall = subjects.length > 0
    ? Math.round(subjects.reduce((acc, s) => acc + ((s.present || 0) / (s.total || 1)) * 100, 0) / subjects.length)
    : 0;

  const getGrade = (p) => {
    if (p >= 90) return { label: 'GOAT 🐐', color: '#1D9E75', bg: 'rgba(29,158,117,0.1)' };
    if (p >= 75) return { label: 'Consistent 🔥', color: '#1D9E75', bg: 'rgba(29,158,117,0.1)' };
    if (p >= 60) return { label: 'Risky 😬', color: '#EF9F27', bg: 'rgba(239,159,39,0.1)' };
    return { label: 'Danger Zone 💀', color: '#E24B4A', bg: 'rgba(226,75,74,0.1)' };
  };

  const handleMarkAttendance = async (id, status) => {
    try {
      await api.patch(`/attendance/${id}`, { attended: status === "attend" });
      setSubjects(prev =>
        prev.map(sub => {
          if (sub._id === id) {
            return {
              ...sub,
              present: status === "attend" ? (sub.present || 0) + 1 : (sub.present || 0),
              total: (sub.total || 0) + 1
            };
          }
          return sub;
        })
      );
      showToast(`Marked ${status === "attend" ? "Present" : "Absent"}!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to mark attendance.');
    }
  };

  const getBarColor = (p) => {
    if (p >= 75) return '#1D9E75';
    if (p >= 60) return '#EF9F27';
    return '#E24B4A';
  };

  const grade = getGrade(overall);

  // SVG ring params
  const radius = 56;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = animateIn ? circumference - (overall / 100) * circumference : circumference;

  const handleShare = async () => {
    try {
      const grade = getGrade(overall);
      const flexMessage = `My attendance stats: ${overall}% overall across ${subjects.length} subjects! ${grade.label}`;
      const senderName = localStorage.getItem('chatUsername') || "Anonymous";
      
      // We directly send it via our api or we can use socket, but simplest to tell the backend to send a message
      await api.post('/messages', { content: flexMessage, senderName });
      
      showToast('💬 Stats flexed to Global Chat!');
      setTimeout(() => onNavClick('chat'), 1000);
    } catch (err) {
      console.error(err);
      showToast('Failed to share.');
    }
    setShareModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-bg relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-[200] bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light px-4 py-2 rounded-full text-xs font-bold shadow-lg whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 bg-bg/80 backdrop-blur-xl px-5 py-3 flex items-center justify-between border-b border-border z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavClick('feed')} className="w-9 h-9 rounded-xl bg-bg2 border border-border flex items-center justify-center hover:bg-bg3 transition-all duration-200 active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AFA9EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="text-base font-bold text-text font-syne">Attendance</div>
            <div className="text-[10px] text-text3 -mt-0.5">{subjects.length} subjects tracked</div>
          </div>
        </div>
      </div>      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 bg-bg pt-[76px] pb-24 scrollbar-hide">
        
        {/* Hero ring card */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-[#1c1a35] via-[#16151F] to-[#0f0e18] p-6 mb-6">
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-accent-teal/8 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-[#6C5CE7]/6 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated ring */}
            <div className="relative mb-3">
              <svg width={(radius + stroke) * 2} height={(radius + stroke) * 2} className="transform -rotate-90 drop-shadow-lg">
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={getBarColor(overall)} />
                    <stop offset="50%" stopColor="#534AB7" />
                    <stop offset="100%" stopColor={getBarColor(overall)} stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Track */}
                <circle
                  cx={radius + stroke} cy={radius + stroke} r={radius}
                  fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke}
                />
                {/* Progress */}
                <circle
                  cx={radius + stroke} cy={radius + stroke} r={radius}
                  fill="none" stroke="url(#progressGrad)" strokeWidth={stroke}
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  strokeLinecap="round"
                  filter="url(#glow)"
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white font-syne leading-none tracking-tight">
                  {overall}<span className="text-xl text-primary-mid">%</span>
                </span>
                <span className="text-[10px] text-text3 mt-1 uppercase tracking-widest font-medium">Overall</span>
              </div>
            </div>

            {/* Grade badge */}
            <div 
              className="px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide"
              style={{ borderColor: grade.color + '30', backgroundColor: grade.bg, color: grade.color }}
            >
              {grade.label}
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-text font-syne">{subjects.length}</span>
                <span className="text-[10px] text-text3 mt-0.5">Subjects</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-text font-syne">
                  {subjects.reduce((acc, s) => acc + (s.present || 0), 0)}
                </span>
                <span className="text-[10px] text-text3 mt-0.5">Attended</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-text font-syne">
                  {subjects.reduce((acc, s) => acc + (s.total || 0), 0)}
                </span>
                <span className="text-[10px] text-text3 mt-0.5">Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject list */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-text font-syne flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AFA9EC" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Your Subjects
          </h3>
          <span className="text-[10px] text-text3 bg-bg2 border border-border px-2 py-1 rounded-lg">{subjects.length} total</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {isLoading ? (
            <>
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-bg2 border border-border rounded-2xl p-4 animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="h-4 w-28 bg-bg3 rounded" />
                    <div className="h-4 w-10 bg-bg3 rounded" />
                  </div>
                  <div className="h-1.5 w-full bg-bg3 rounded-full" />
                  <div className="mt-2.5 h-3 w-20 bg-bg3 rounded" />
                </div>
              ))}
            </>
          ) : subjects.length === 0 ? (
            <div className="text-center py-14 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-bg2 border border-border flex items-center justify-center text-3xl mb-4">📚</div>
              <p className="text-text2 text-sm font-medium mb-1">No subjects yet</p>
              <p className="text-text3 text-xs mb-5">Start tracking your attendance to see stats here</p>
              <button 
                onClick={() => onNavClick('professors', 'attendance')}
                className="px-5 py-2.5 bg-primary/15 border border-primary/25 text-primary-mid text-sm rounded-xl font-medium hover:bg-primary/25 transition-colors cursor-pointer"
              >
                + Add Subject
              </button>
            </div>
          ) : (
            subjects.map((sub, idx) => {
              const perc = Math.round(((sub.present || 0) / (sub.total || 1)) * 100);
              const barColor = getBarColor(perc);
              const canBunk = sub.total > 0 ? Math.floor(((sub.present || 0) - 0.75 * (sub.total || 1)) / 0.75) : 0;
              
              return (
                <div 
                  key={sub._id || idx} 
                  className="group bg-bg2 border border-border hover:border-primary/15 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* Left accent bar */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-all duration-300"
                    style={{ backgroundColor: barColor }}
                  />

                  <div className="flex justify-between items-start mb-3 pl-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text text-sm group-hover:text-white transition-colors">{sub.name || 'Subject'}</span>
                      <span className="text-[10px] text-text3 mt-0.5">{sub.present || 0} / {sub.total || 0} classes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-xl font-extrabold font-syne"
                        style={{ color: barColor }}
                      >
                        {perc}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-[5px] bg-white/[0.04] rounded-full overflow-hidden mb-2.5 ml-2">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: animateIn ? `${perc}%` : '0%', 
                        backgroundColor: barColor,
                        boxShadow: `0 0 8px ${barColor}40`,
                        transitionDelay: `${idx * 100}ms`
                      }}
                    />
                  </div>

                  {/* Bunk info */}
                  <div className="flex justify-between items-center ml-2">
                    <span 
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                      style={{ 
                        backgroundColor: canBunk > 0 ? 'rgba(29,158,117,0.1)' : 'rgba(226,75,74,0.1)',
                        color: canBunk > 0 ? '#1D9E75' : '#E24B4A'
                      }}
                    >
                      {canBunk > 0 ? `Can bunk ${canBunk} more` : canBunk === 0 ? 'Cannot bunk' : `Attend ${Math.abs(canBunk)} more`}
                    </span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleMarkAttendance(sub._id, 'attend')}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-accent-teal/10 border border-accent-teal/20 text-accent-teal font-medium hover:bg-accent-teal/20 active:scale-95 transition-all cursor-pointer"
                      >
                        ✓ Present
                      </button>
                      <button 
                        onClick={() => handleMarkAttendance(sub._id, 'bunk')}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-bg3 border border-border text-text3 font-medium hover:bg-bg4 active:scale-95 transition-all cursor-pointer"
                      >
                        ✗ Absent
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleShare}
        subjects={subjects}
      />
    </div>
  );
};

export default AttendanceScreen;
