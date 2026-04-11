import React from 'react';

const FeedTopNav = ({ onNavClick }) => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
    <div className="flex items-center gap-2">
      <div className="text-base font-bold text-text font-syne tracking-tight">
        campus<span className="text-primary-mid">.</span>
      </div>
      <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">Rizvi</div>
    </div>
    <div className="flex items-center gap-3">
      <div 
        onClick={() => onNavClick('profile')}
        className="w-8 h-8 rounded-full bg-primary-mid/10 border border-primary-mid/30 flex items-center justify-center cursor-pointer hover:bg-primary-mid/20 transition-colors overflow-hidden"
      >
        <span className="text-xs font-bold text-primary-mid font-syne">ME</span>
      </div>
      <div 
        onClick={() => onNavClick('notifications')}
        className="w-7 h-7 rounded-full bg-bg2 border border-border flex items-center justify-center relative cursor-pointer hover:bg-bg3 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#9B99B0" strokeWidth="1.5">
          <path d="M8 1a5 5 0 015 5v3l1.5 2H1.5L3 9V6a5 5 0 015-5z" />
          <path d="M6.5 13a1.5 1.5 0 003 0" />
        </svg>
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent-red border border-bg"></div>
      </div>
    </div>
  </div>
);

export default FeedTopNav;
