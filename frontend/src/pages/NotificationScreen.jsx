import { useState, useEffect } from 'react';
import { NotificationSkeleton } from '../components/Skeleton';
import api from '../context/api.js';
import { timeAgo } from '../utils/timeAgo';

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

const NotificationItem = ({ type, userId, senderId, content, createdAt, isRead, postId, onNavClick }) => {
  const getIcon = () => {
    if (type === 'like') {
      return (
        <div className="w-8 h-8 rounded-full bg-opacity-15 bg-accent-red flex items-center justify-center text-accent-red flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      );
    } else if (type === 'comment') {
      return (
        <div className="w-8 h-8 rounded-full bg-opacity-15 bg-primary flex items-center justify-center text-primary-mid flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
      );
    } else if (type === 'announcement') {
      return (
        <div className="w-8 h-8 rounded-full bg-opacity-15 bg-accent-teal flex items-center justify-center text-accent-teal flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      )
    } else if (type === 'pyqApproved') {
      return (
        <div className="w-8 h-8 rounded-full bg-opacity-15 bg-green-500 flex items-center justify-center text-green-500 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      );
    } else if (type === 'pyqRejected') {
      return (
        <div className="w-8 h-8 rounded-full bg-opacity-15 bg-red-500 flex items-center justify-center text-red-500 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div
      onClick={() => {
        if (postId) {
          onNavClick(`post/${postId}`);
        }
      }}
      className={`flex gap-3 p-4 border-b border-border ${!isRead ? 'bg-bg2' : 'bg-transparent'} hover:bg-bg3 cursor-pointer transition-colors`}
    >
      {getIcon()}
      <div className="flex-1">
        <div className="text-sm text-text mb-1">
          {type === 'like' && <><span className="font-bold">{senderId?.name || "Someone"}</span> liked your post.</>}
          {type === 'comment' && <><span className="font-bold">{senderId?.name || "Someone"}</span> commented on your post.</>}
          {type === 'announcement' && <><span className="font-bold">{senderId?.name || "Admin"}</span> posted an announcement.</>}
          {(type === 'pyqApproved' || type === 'pyqRejected') && <span>{content}</span>}
        </div>
        {type !== 'pyqApproved' && type !== 'pyqRejected' && (
          <div className="text-sm text-text3 line-clamp-1">"{content}"</div>
        )}
        <div className="text-xs text-text3 mt-1.5">{timeAgo(createdAt)}</div>
      </div>
    </div>
  );
};

const NotificationScreen = ({ onNavClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchNotifications = async () => {
      try {
        const notification = await api.get("/notifications/", { withCredentials: true })
        console.log(notification.data.data);

        setNotifications(notification.data.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    }
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
              <NotificationItem key={notif._id} {...notif} onNavClick={onNavClick} />
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
