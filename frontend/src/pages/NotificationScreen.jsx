import { useCallback, useMemo, useRef, useState } from 'react';
import { NotificationSkeleton } from '../components/Skeleton';
import api from '../context/api.js';
import { timeAgo } from '../utils/timeAgo';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInfiniteScrollTrigger } from '../utils/useInfiniteScrollTrigger';
import { enableNotificationSound, isNotificationSoundEnabled, requestSystemNotificationPermission } from '../utils/notificationSound';
import { registerPushNotifications } from '../utils/pushSubscription';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10;

const TopNav = ({ onNavClick, alertsEnabled, onEnableAlerts }) => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center gap-3 flex-shrink-0 border-b border-border z-30">
    <button onClick={() => onNavClick('feed')} className="w-8 h-8 rounded-full bg-bg2 flex items-center justify-center cursor-pointer hover:bg-bg3 transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2E1EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="text-base font-bold text-text">Notifications</div>
    <button
      onClick={onEnableAlerts}
      className={`ml-auto text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
        alertsEnabled
          ? 'bg-primary/15 border-primary/30 text-primary-mid'
          : 'bg-bg2 border-border text-text3 hover:text-text'
      }`}
    >
      {alertsEnabled ? 'Alerts On' : 'Enable Alerts'}
    </button>
  </div>
);

const NotificationItem = ({ type, senderId, content, createdAt, isRead, postId, onNavClick }) => {
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

    return (
      <div className="w-8 h-8 rounded-full bg-opacity-15 bg-primary flex items-center justify-center text-primary-mid flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
    );
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
          {type === 'like' && (
            <>
              <span className="font-bold">{senderId?.name || "Someone"}</span>{' '}
              {content?.toLowerCase().includes('review') ? 'found your review helpful.' : 'liked your post.'}
            </>
          )}
          {type === 'comment' && <><span className="font-bold">{senderId?.name || "Someone"}</span> commented on your post.</>}
          {type === 'announcement' && <><span className="font-bold">{senderId?.name || "Admin"}</span> posted an announcement.</>}
          {(type === 'pyqApproved' || type === 'pyqRejected') && <span>{content}</span>}
          {type === 'other' && <span>{content}</span>}
        </div>
        {type !== 'pyqApproved' && type !== 'pyqRejected' && type !== 'other' && (
          <div className="text-sm text-text3 line-clamp-1">"{content}"</div>
        )}
        <div className="text-xs text-text3 mt-1.5">{timeAgo(createdAt)}</div>
      </div>
    </div>
  );
};

const NotificationScreen = ({ onNavClick }) => {
  const loadMoreRef = useRef(null);
  const [alertsEnabled, setAlertsEnabled] = useState(isNotificationSoundEnabled());

  const handleEnableAlerts = useCallback(async () => {
    const enabled = await enableNotificationSound();
    setAlertsEnabled(enabled);

    if (enabled) {
      const notificationGranted = await requestSystemNotificationPermission();
      if (notificationGranted) {
        await registerPushNotifications();
        toast.success('Alerts enabled (sound + system notifications)');
      } else {
        toast.success('Sound alerts enabled');
      }
    } else {
      toast('Alerts disabled');
    }
  }, []);

  const {
    data,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['notifications', PAGE_SIZE],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get('/notifications/', {
        withCredentials: true,
        params: {
          page: pageParam,
          limit: PAGE_SIZE
        }
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => lastPage?.pagination?.hasMore ? lastPage.pagination.nextPage : undefined,
    initialPageParam: 1
  });

  const notificationsData = useMemo(
    () => data?.pages?.flatMap((page) => page?.items || []) || [],
    [data]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useInfiniteScrollTrigger({
    targetRef: loadMoreRef,
    enabled: hasNextPage && !isLoading,
    onLoadMore: handleLoadMore,
    rootMargin: '300px'
  });

  return (
    <div className="flex flex-col h-full bg-bg">
  <TopNav onNavClick={onNavClick} alertsEnabled={alertsEnabled} onEnableAlerts={handleEnableAlerts} />
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
          ) : isError ? (
            <div className="text-center text-red-500 text-sm py-10">
              Something went wrong. Please try again.
            </div>
          ) : (
            <>
              {notificationsData.map(notif => (
                <NotificationItem key={notif._id} {...notif} onNavClick={onNavClick} />
              ))}

              <div ref={loadMoreRef} className="h-2" />

              {isFetchingNextPage && (
                <>
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                </>
              )}
            </>
          )}
          {!isLoading && !hasNextPage && (
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
