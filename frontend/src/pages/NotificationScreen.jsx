import React, { useState, useEffect } from 'react';
import { NotificationSkeleton } from '../components/Skeleton';

const TopNav = ({ onNavClick }) => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center gap-3 flex-shrink-0 border-b border-border z-30">
    <button onClick={() => onNavClick('feed')} className="w-8 h-8 rounded-full bg-bg2 flex items-center justify-center cursor-pointer hover:bg-bg3 transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2E1EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="text-base font-bold text-text">Notifications</div>
  </div>
);

const NotificationItem = ({ type, user, content, time, isRead }) => {
  const getIcon = () => {
    if (type === 'like') {
      return (
        <div className="w-8 h-8 rounded-full bg-opacity-15 bg-accent-red flex items-center justify-center text-accent-red flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      );
    } else if (type === 'comment') {
      return (
        <div className="w-8 h-8 rounded-full bg-opacity-15 bg-primary flex items-center justify-center text-primary-mid flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
      );
    }
  };

  return (
    <div className={`flex gap-3 p-4 border-b border-border ${!isRead ? 'bg-bg2' : 'bg-transparent'} hover:bg-bg3 cursor-pointer transition-colors`}>
      {getIcon()}
      <div className="flex-1">
        <div className="text-sm text-text mb-1">
          <span className="font-bold">{user}</span> {type === 'like' ? 'liked your post.' : 'commented on your post.'}
        </div>
        <div className="text-sm text-text3 line-clamp-1">"{content}"</div>
        <div className="text-xs text-text3 mt-1.5">{time}</div>
      </div>
    </div>
  );
};

const NotificationScreen = ({ onNavClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setNotifications([
        {
          id: 1,
          type: 'like',
          user: 'Anonymous panda',
          content: 'I have 61% attendance in OS and the exam is in...',
          time: '14m ago',
          isRead: false
        },
        {
          id: 2,
          type: 'comment',
          user: 'Anonymous butterfly',
          content: 'Library Wifi. The wifi in the library has been...',
          time: '2h ago',
          isRead: false
        },
        {
          id: 3,
          type: 'like',
          user: 'Anonymous lion',
          content: 'Does anyone have the notes for yesterday\'s DBMS lecture?',
          time: '5h ago',
          isRead: true
        }
      ]);
      
      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="flex flex-col h-full bg-bg">
      <TopNav onNavClick={onNavClick} />
      <div className="flex-1 overflow-y-auto pt-[60px] pb-6">
        <div className="flex flex-col">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : (
            notifications.map(notif => (
              <NotificationItem key={notif.id} {...notif} />
            ))
          )}
          {!isLoading && (
            <div className="text-center text-xs text-text3 py-6">
              No more notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationScreen;
