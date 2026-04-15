import React, { useState } from 'react';
import api from '../context/api';

const ComposeBox = ({ onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('confession');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFlexOptions, setShowFlexOptions] = useState(false);
  const [subAttendances, setSubAttendances] = useState([]);
  const [isLoadingFlex, setIsLoadingFlex] = useState(false);
  const [selectedFlex, setSelectedFlex] = useState(null);

  const handlePost = () => {
    let finalContent = content;
    if (selectedFlex) {
      finalContent = `${content}\n\n[ATTENDANCE_FLEX]${JSON.stringify({
        subject: selectedFlex.subject,
        percent: selectedFlex.percent,
        canBunk: selectedFlex.canBunk
      })}`;
    }
    
    if (finalContent.trim() || title.trim()) {
      onPost(title, finalContent, category);
      setTitle('');
      setContent('');
      setIsExpanded(false);
      setShowFlexOptions(false);
      setSelectedFlex(null);
    }
  };

  const handleFetchAttendanceForFlex = async () => {
    if (showFlexOptions) {
      setShowFlexOptions(false);
      return;
    }
    
    setIsLoadingFlex(true);
    setShowFlexOptions(true);
    try {
      const res = await api.get('/attendance', { withCredentials: true });
      const mappedAtt = res.data.data.map((att) => {
        const percent = att.totalClasses > 0 ? Math.round((att.classAttended / att.totalClasses) * 100) : 0;
        return {
          id: att._id,
          subject: att.subject,
          percent,
          canBunk: att.bunkmeter > 0 ? att.bunkmeter.toString() : "0",
        };
      });
      setSubAttendances(mappedAtt);
    } catch (err) {
      console.error('Failed to fetch attendance for flex', err);
    } finally {
      setIsLoadingFlex(false);
    }
  };

  const insertFlex = (subjectRecord) => {
    setSelectedFlex(subjectRecord);
    setShowFlexOptions(false);
    setCategory('attendance');
  };

  return (
    <div className={`relative bg-bg2 border border-border rounded-3xl p-3 transition-all duration-300 ease-out z-10 overflow-hidden ${isExpanded ? 'shadow-lg bg-bg' : 'hover:-translate-y-[1px] hover:shadow-sm'} ${category === 'attendance' && isExpanded ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-gradient-to-br from-bg via-bg to-emerald-950/10' : ''}`}>
      {isExpanded && category === 'attendance' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none -z-10" />
      )}
      <div className="flex gap-2 relative z-10">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 transition-colors ${isExpanded && category === 'confession' ? 'bg-red-500/15 border-red-500/30' : 
           isExpanded && category === 'question' ? 'bg-blue-500/15 border-blue-500/30' : 
           isExpanded && category === 'rant' ? 'bg-orange-500/15 border-orange-500/30' : 
           isExpanded && category === 'attendance' ? 'bg-emerald-500/15 border-emerald-500/30' : 
           isExpanded && category === 'other' ? 'bg-slate-500/15 border-slate-500/30' : 
           'bg-primary/20 border-primary/30'}`}>👻</div>
        
        {!isExpanded ? (
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-xs bg-bg3 border border-border2 rounded-2xl px-3 py-2 cursor-text text-text3 hover:border-border transition-all duration-200"
          >
            Post anonymously...
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2.5 bg-bg3 border border-border2 rounded-2xl p-2.5">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handlePost();
                }
              }}
              placeholder="Title (optional)"
              className="text-sm font-semibold text-text bg-transparent border-none focus:outline-none placeholder:text-text3"
              autoFocus
            />
            <hr className="border-border2" />
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handlePost();
                }
              }}
              placeholder="What's down there?"
              rows={3}
              className="text-xs text-text bg-transparent border-none focus:outline-none placeholder:text-text3 resize-none w-full"
            />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-3 mt-3 ml-9 animate-fade-in-down duration-300">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {['confession', 'question', 'rant', 'attendance', 'other'].map(cat => {
              const isSelected = category === cat;
              let bgClass = 'bg-primary/20 border-primary/50 text-primary-mid';
              if (isSelected) {
                if (cat === 'confession') bgClass = 'bg-red-500/20 border-red-500/50 text-red-500';
                if (cat === 'question') bgClass = 'bg-blue-500/20 border-blue-500/50 text-blue-500';
                if (cat === 'rant') bgClass = 'bg-orange-500/20 border-orange-500/50 text-orange-500';
                if (cat === 'attendance') bgClass = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500';
                if (cat === 'other') bgClass = 'bg-slate-500/20 border-slate-500/50 text-slate-500';
              }
              
              return (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-300 capitalize whitespace-nowrap ${
                    isSelected 
                      ? `${bgClass} font-medium tracking-wide shadow-sm` 
                      : 'bg-transparent border-border2 text-text3 hover:bg-bg3 hover:border-border'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 justify-between items-center w-full">
            <button
              onClick={handleFetchAttendanceForFlex}
              className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium hover:bg-emerald-500/20 transition-colors"
            >
              + Bunk Meter 📊
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-xs text-text3 hover:text-text px-3 py-1.5 transition-colors cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handlePost} 
                className="bg-primary text-white rounded-2xl px-4 py-1.5 text-xs font-semibold cursor-pointer hover:bg-primary-dark transition-colors"
              >
                Post
              </button>
            </div>
          </div>
          
          {showFlexOptions && (
            <div className="mt-2 flex flex-col gap-2 bg-bg p-2 rounded-xl border border-border2">
              <div className="text-[10px] text-text3 uppercase font-bold tracking-wider mb-1">Select subject to flex</div>
              {isLoadingFlex ? (
                <div className="text-xs text-text3 p-2">Loading classes...</div>
              ) : subAttendances.length === 0 ? (
                <div className="text-xs text-text3 p-2">No tracked classes found.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {subAttendances.map(att => (
                    <button
                      key={att.id}
                      onClick={() => insertFlex(att)}
                      className="text-xs bg-bg2 hover:bg-bg3 border border-border px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>{att.subject}</span>
                      <span className="text-[10px] bg-primary/20 px-1 rounded text-primary-light">{att.percent}%</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComposeBox;
