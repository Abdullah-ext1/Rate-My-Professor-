import React from 'react';

const ProfCard = ({ initials, name, subject, rating, reviews, tags, rank, onRateClick, onReviewsClick, onEditClick }) => (
  <div onClick={onReviewsClick} className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 cursor-pointer hover:border-border2 transition-colors relative">
    {rank !== undefined && rank !== null && (
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-bg3 border border-border rounded-full flex justify-center items-center font-bold font-syne text-sm shadow-sm" 
           style={{ color: rank === 1 ? '#FBBF24' : rank === 2 ? '#9CA3AF' : rank === 3 ? '#D97706' : '#9B99B0' }}>
        #{rank}
      </div>
    )}

    <div className="flex items-center gap-2.5 mb-2.5 mt-1">
      <div className="w-9 h-9 rounded-2.5 bg-opacity-20 bg-primary flex items-center justify-center text-xs font-semibold text-primary-mid flex-shrink-0 font-syne">{initials}</div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-text font-syne flex items-center gap-2">
          {name}
          {onEditClick && (
            <div 
              className="p-1 px-1.5 bg-bg3 rounded-full cursor-pointer text-text3 hover:text-primary-mid transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); onEditClick(); }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          )}
        </div>
        <div className="text-xs text-text3 mt-0.5">{subject}</div>
      </div>
      <div className="text-right mr-4 mt-1">
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
    <button onClick={(e) => { e.stopPropagation(); onRateClick(); }} className="w-full mt-1 bg-border text-text font-semibold rounded-2xl py-2 text-xs hover:bg-border2 transition-colors cursor-pointer border border-transparent">
      Rate Professor
    </button>
  </div>
);

export default ProfCard;
