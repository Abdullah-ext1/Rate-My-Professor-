import { useState } from 'react';

const TopNav = () => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
    <div className="flex items-center gap-2">
      <div className="text-base font-bold text-text font-syne tracking-tight">
        campus<span className="text-primary-mid">.</span>
      </div>
      <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">CS dept</div>
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

const ProfCard = ({ initials, name, subject, rating, reviews, tags }) => (
  <div className="bg-bg2 border border-border rounded-3xl p-3.5 cursor-pointer hover:border-border2 transition-colors">
    <div className="flex items-center gap-2.5 mb-2.5">
      <div className="w-9 h-9 rounded-2.5 bg-opacity-20 bg-primary flex items-center justify-center text-xs font-semibold text-primary-mid flex-shrink-0 font-syne">{initials}</div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-text font-syne">{name}</div>
        <div className="text-xs text-text3 mt-0.5">{subject}</div>
      </div>
      <div className="text-right">
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
    <div className="text-xs text-text2 leading-relaxed italic px-2.5 py-2 bg-bg3 rounded-2xl">"Missed 12 classes, still got signed. Study last 5 years PYQs."</div>
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

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <TopNav />
      <HorizontalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollArea>
        {activeTab === 'professors' ? (
          <>
            <SearchBar />
            <ProfCard initials="VM" name="Prof. V. Mehta" subject="Database Management" rating="4.2" reviews="38" tags={['Lenient attendance', 'Clear teaching', 'Tough exams']} />
            <ProfCard initials="SR" name="Prof. S. Rao" subject="Operating Systems" rating="2.9" reviews="51" tags={['Very strict', 'Marks internally']} />
            <ProfCard initials="AP" name="Prof. A. Patil" subject="Data Structures" rating="4.7" reviews="29" tags={['Best in dept', 'Fair marking']} />
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
