import React, { useState, useEffect } from 'react';
import { LeaderboardItemSkeleton } from '../components/Skeleton';
import api from '../context/api.js';

import { useQuery } from '@tanstack/react-query';

const TopNav = ({ onNavClick }) => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center gap-3 flex-shrink-0 border-b border-border z-30">
    <button onClick={() => onNavClick('feed')} className="w-8 h-8 rounded-full bg-bg2 flex items-center justify-center cursor-pointer hover:bg-bg3 transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2E1EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="text-base font-bold text-text">Leaderboard</div>
  </div>
);

const LeaderboardItem = ({ rank, initials, name, subject, rating, reviews, onRateClick }) => {
  // Determine text color based on ranking
  const rankColor = 
    rank === 1 ? 'text-yellow-400' : 
    rank === 2 ? 'text-gray-300' : 
    rank === 3 ? 'text-amber-600' : 'text-text3';

  return (
    <div className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 flex items-center gap-3">
      <div className={`text-xl font-bold font-syne ${rankColor} w-6 text-center shadow-sm`}>
        #{rank}
      </div>
      <div className="w-10 h-10 rounded-full bg-opacity-20 bg-primary flex items-center justify-center text-sm font-bold text-primary-mid flex-shrink-0 font-syne">
        {initials}
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-text font-syne">{name}</div>
        <div className="text-xs text-text3 mt-0.5">{subject}</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center justify-center bg-bg w-10 h-10 rounded-lg border border-border2 shadow-sm">
          <span className="text-lg font-bold text-accent-teal font-syne">{rating}</span>
        </div>
        <div className="text-[10px] text-text3">{reviews} ratings</div>
      </div>
    </div>
  );
};

const LeaderboardScreen = ({ onNavClick }) => {
  const { data: professors = [], isLoading, isError, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await api.get("/leaderboard", { withCredentials: true })
      return res.data.data.map(item => ({
        id: item._id,
        name: item.professorDetails[0]?.name || 'Unknown',
        initials: (item.professorDetails[0]?.name || 'UN').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(),
        subject: item.professorDetails[0]?.subjects?.join(', ') || '',
        rating: item.averageRating.toFixed(1),
        reviews: item.totalRatings
      }))
    },
    staleTime: 5 * 60 * 1000
  });;

  return (
    <div className="flex flex-col h-full bg-bg">
      <TopNav onNavClick={onNavClick} />
      <div className="flex-1 overflow-y-auto pt-[60px] pb-6 px-4">
        
        <div className="bg-opacity-15 bg-primary border border-opacity-30 border-primary rounded-2xl p-4 mb-5 text-center cursor-pointer hover:bg-opacity-20 transition-colors" onClick={() => onNavClick('professors')}>
          <div className="text-sm font-bold text-primary-mid mb-1">Rate a Professor</div>
          <div className="text-xs text-primary-mid opacity-80">Help other students by leaving a review on the Professors page ➔</div>
        </div>

        <div className="flex flex-col">
          {isLoading ? (
            <>
              <LeaderboardItemSkeleton />
              <LeaderboardItemSkeleton />
              <LeaderboardItemSkeleton />
              <LeaderboardItemSkeleton />
            </>
          ) : (
            professors.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).map((prof, index) => (
              <LeaderboardItem 
                key={prof.id} 
                rank={index + 1}
                initials={prof.initials} 
                name={prof.name} 
                subject={prof.subject} 
                rating={prof.rating} 
                reviews={prof.reviews} 
                onRateClick={() => onNavClick('professors')}
              />
            ))
          )}
          {!isLoading && (
            <div className="text-center text-xs text-text3 py-4">
              Rankings are updated daily based on student feedback.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
