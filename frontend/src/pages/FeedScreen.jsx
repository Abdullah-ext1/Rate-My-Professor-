import { useState } from 'react';

const TopNav = () => (
  <div className="fixed top-12 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
    <div className="flex items-center gap-2">
      <div className="text-base font-bold text-text font-syne tracking-tight">
        campus<span className="text-primary-mid">.</span>
      </div>
      <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">Rizvi</div>
    </div>
    <div className="w-7 h-7 rounded-full bg-bg2 border border-border flex items-center justify-center relative cursor-pointer">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#9B99B0" strokeWidth="1.5">
        <path d="M8 1a5 5 0 015 5v3l1.5 2H1.5L3 9V6a5 5 0 015-5z" />
        <path d="M6.5 13a1.5 1.5 0 003 0" />
      </svg>
      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent-red border border-bg"></div>
    </div>
  </div>
);

const HorizontalTabs = ({ tabs, activeTab, setActiveTab }) => (
  <div className="fixed top-20 left-0 right-0 flex gap-0 border-b border-border bg-bg overflow-x-auto scrollbar-hide flex-shrink-0 px-4 z-30">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-3.5 py-2 text-xs cursor-pointer border-b-2 whitespace-nowrap transition-colors ${
          activeTab === tab
            ? 'border-primary text-primary-mid font-medium'
            : 'border-transparent text-text3 hover:text-text2'
        }`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
);

const ScrollArea = ({ children }) => (
  <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 scrollbar-hide bg-bg pt-24">
    {children}
  </div>
);

const ComposeBox = () => (
  <div className="bg-bg2 border border-border rounded-3xl p-3">
    <div className="flex items-center gap-2 mb-2.5">
      <div className="w-7 h-7 rounded-full bg-opacity-20 bg-primary border border-opacity-30 border-primary flex items-center justify-center text-xs flex-shrink-0">👻</div>
      <div className="flex-1 text-xs text-text3 bg-bg3 border border-border2 rounded-2xl px-2.5 py-2 cursor-pointer">Post anonymously...</div>
      <button className="bg-primary text-white rounded-2xl px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-primary-dark transition-colors">Post</button>
    </div>
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
      <button className="text-xs px-2.5 py-1 rounded-full bg-opacity-20 bg-primary border border-opacity-50 border-primary text-primary-mid font-medium cursor-pointer">Confession</button>
      <button className="text-xs px-2.5 py-1 rounded-full bg-transparent border border-border2 text-text3 cursor-pointer hover:bg-bg3 transition-colors">Question</button>
      <button className="text-xs px-2.5 py-1 rounded-full bg-transparent border border-border2 text-text3 cursor-pointer hover:bg-bg3 transition-colors">Rant</button>
      <button className="text-xs px-2.5 py-1 rounded-full bg-transparent border border-border2 text-text3 cursor-pointer hover:bg-bg3 transition-colors">Attendance</button>
    </div>
  </div>
);

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

const PostCard = ({ handle, isLiked = false, likes, comments }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-bg2 border border-border rounded-3xl p-3 cursor-pointer hover:border-border2 transition-colors">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 rounded-full bg-opacity-15 bg-red-500 flex items-center justify-center text-xs flex-shrink-0">👻</div>
        <span className="text-xs font-medium text-text">{handle}</span>
        <span className="text-xs px-1.5 py-0.5 rounded-2xl bg-opacity-15 bg-red-500 border border-opacity-20 border-red-500 text-red-400 font-medium">confession</span>
        <span className="text-xs text-text3 ml-auto">14m</span>
      </div>
      <div className="text-sm leading-relaxed text-text mb-2.5">I have 61% attendance in OS and the exam is in 3 weeks. I have attended 0 classes this month. I am not okay.</div>
      <div className="flex gap-3.5">
        <button onClick={toggleLike} className="flex items-center gap-1 text-xs text-text3 hover:text-red-400 transition-colors group">
          <svg viewBox="0 0 16 16" fill={liked ? '#ED93B1' : 'none'} stroke={liked ? '#ED93B1' : 'currentColor'} strokeWidth="1.5" width="13" height="13">
            <path d="M8 14s-6-4-6-8a4 4 0 018 0 4 4 0 018 0c0 4-6 8-6 8z" />
          </svg>
          <span>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1 text-xs text-text3 hover:text-primary-mid transition-colors">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
            <path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z" />
          </svg>
          <span>{comments}</span>
        </button>
      </div>
    </div>
  );
};



const FeedScreen = ({ onNavClick }) => {
  const [activeHTab, setActiveHTab] = useState('All');

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <TopNav />
      <HorizontalTabs
        tabs={['All', 'Confessions', 'Attendance', 'Questions', 'Rants']}
        activeTab={activeHTab}
        setActiveTab={setActiveHTab}
      />
      <ScrollArea>
        <ComposeBox />
        <AttendanceMini />
        <PostCard handle="Anonymous panda" likes={47} comments={12} isLiked={true} />
        <PostCard handle="Anonymous butterfly" likes={89} comments={28} />
        <PostCard handle="Anonymous lion" likes={134} comments={41} />
      </ScrollArea>
    </div>
  );
};

export default FeedScreen;
