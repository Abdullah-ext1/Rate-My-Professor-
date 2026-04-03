import { useState } from 'react';
import ProfessorReviewsScreen from './ProfessorReviewsScreen';

const TopNav = ({ onNavClick }) => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
    <div className="flex items-center gap-2">
      <div className="text-base font-bold text-text font-syne tracking-tight">
        campus<span className="text-primary-mid">.</span>
      </div>
      <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">CS dept</div>
    </div>
    <div 
      onClick={() => onNavClick('leaderboard')}
      className="w-7 h-7 rounded-full bg-bg2 border border-border flex items-center justify-center relative cursor-pointer hover:bg-bg3 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B99B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M7 4h10M6 4c-1.1 0-2 .9-2 2s.9 2 2 2h0c0 4 3 7 6 7s6-3 6-7h0c1.1 0 2-.9 2-2s-.9-2-2-2H6z" />
      </svg>
    </div>
  </div>
);

const HorizontalTabs = ({ activeTab, setActiveTab }) => (
  <div className="fixed top-12 left-0 right-0 flex gap-0 border-b border-border bg-bg overflow-x-auto scrollbar-hide flex-shrink-0 px-4 z-30">
    {['Professors', 'Attendance'].map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab.toLowerCase())}
        className={`px-3.5 py-2 text-xs cursor-pointer border-b-2 whitespace-nowrap transition-colors ${
          activeTab === tab.toLowerCase()
            ? 'border-primary text-primary-mid font-medium'
            : 'border-transparent text-text3 hover:text-text2'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const ScrollArea = ({ children }) => (
  <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 scrollbar-hide bg-bg pt-20">
    {children}
  </div>
);

const SearchBar = () => (
  <div className="flex items-center gap-2 bg-bg2 border border-border rounded-2.5 px-3 py-2 mb-1">
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text3">
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3 3" />
    </svg>
    <input placeholder="Search professor..." className="flex-1 bg-transparent border-none text-xs text-text placeholder-text3 outline-none" />
  </div>
);

const ProfCard = ({ initials, name, subject, rating, reviews, tags, rank, onRateClick, onReviewsClick }) => (
  <div onClick={onReviewsClick} className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 cursor-pointer hover:border-border2 transition-colors relative">
    <div className="absolute -top-2 -right-2 w-7 h-7 bg-bg3 border border-border rounded-full flex justify-center items-center font-bold font-syne text-sm shadow-sm"
         style={{ color: rank === 1 ? '#FBBF24' : rank === 2 ? '#9CA3AF' : rank === 3 ? '#D97706' : '#9B99B0' }}>
      #{rank}
    </div>
    <div className="flex items-center gap-2.5 mb-2.5">
      <div className="w-9 h-9 rounded-2.5 bg-opacity-20 bg-primary flex items-center justify-center text-xs font-semibold text-primary-mid flex-shrink-0 font-syne">{initials}</div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-text font-syne">{name}</div>
        <div className="text-xs text-text3 mt-0.5">{subject}</div>
      </div>
      <div className="text-right mr-4">
        <div className="text-xl font-bold text-accent-teal font-syne">{rating}</div>
        <div className="text-xs text-text3 mt-0.5">{reviews} reviews</div>
      </div>
    </div>
    <div className="flex gap-1.5 flex-wrap mb-2">
      {tags.map(tag => (
        <span key={tag} className="text-xs px-2 py-0.5 rounded-2xl border border-opacity-20 border-accent-teal bg-opacity-10 bg-accent-teal text-accent-teal font-medium">
          {tag}
        </span>
      ))}
    </div>
    <div className="text-xs text-text2 leading-relaxed italic px-2.5 py-2 bg-bg3 rounded-2xl mb-2">"Missed 12 classes, still got signed. Study last 5 years PYQs."</div>
    <button onClick={(e) => { e.stopPropagation(); onRateClick(); }} className="w-full mt-1 bg-border text-text font-semibold rounded-2xl py-2 text-xs hover:bg-border2 transition-colors cursor-pointer border border-transparent">
      Rate Professor
    </button>
  </div>
);

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
      </div>
    </div>
  );
};



const ProfessorsScreen = ({ onNavClick }) => {
  const [activeTab, setActiveTab] = useState('professors');
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  const professors = [
    { initials: "AP", name: "Prof. A. Patil", subject: "Data Structures", rating: 4.7, reviews: 29, tags: ['Best in dept', 'Fair marking'], department: "CS" },
    { initials: "VM", name: "Prof. V. Mehta", subject: "Database Management", rating: 4.2, reviews: 38, tags: ['Lenient attendance', 'Clear teaching', 'Tough exams'], department: "CS" },
    { initials: "SR", name: "Prof. S. Rao", subject: "Operating Systems", rating: 2.9, reviews: 51, tags: ['Very strict', 'Marks internally'], department: "CS" },
  ];

  // Sort them by rating highest to lowest
  const sortedProfessors = [...professors].sort((a, b) => b.rating - a.rating);

  if (selectedProfessor) {
    const prof = professors.find(p => p.name === selectedProfessor);
    return <ProfessorReviewsScreen professor={prof} onBack={() => setSelectedProfessor(null)} />;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <TopNav onNavClick={onNavClick} />
      <HorizontalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollArea>
        {activeTab === 'professors' ? (
          <>
            <SearchBar />
            {sortedProfessors.map((prof, idx) => (
              <ProfCard 
                key={prof.name}
                rank={idx + 1}
                initials={prof.initials} 
                name={prof.name} 
                subject={prof.subject} 
                rating={prof.rating.toFixed(1)} 
                reviews={prof.reviews} 
                tags={prof.tags}
                onReviewsClick={() => setSelectedProfessor(prof.name)}
                onRateClick={() => onNavClick('rate-professor')}
              />
            ))}
          </>
        ) : (
          <>
            <div className="bg-opacity-12 bg-primary border border-opacity-20 border-primary rounded-3xl px-3.5 py-3 flex gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-2.5 bg-opacity-30 bg-primary flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#AFA9EC" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M8 5v3l2 2" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-medium text-primary-mid">You can bunk 4 more classes</div>
                <div className="text-xs text-text3 mt-0.5">across all subjects this semester</div>
              </div>
            </div>
            <AttendanceCard status="safe" subject="Data Structures" prof="Prof. Patil" percent={84} attended={21} total={25} canBunk="3" onChange={() => {}} />
            <AttendanceCard status="warn" subject="Operating Systems" prof="Prof. Rao" percent={76} attended={19} total={25} canBunk="1" onChange={() => {}} />
            <AttendanceCard status="danger" subject="Database Management" prof="Prof. Mehta" percent={63} attended={15} total={24} canBunk="Cannot bunk" onChange={() => {}} />
          </>
        )}
      </ScrollArea>
    </div>
  );
};

export default ProfessorsScreen;
