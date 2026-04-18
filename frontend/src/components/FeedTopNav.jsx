import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../context/api';

const FeedTopNav = ({ onNavClick }) => {
  const { user } = useAuth();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const res = await api.get('/notifications/unread', { withCredentials: true });
      return res.data.data;
    },
    staleTime: 60 * 1000, // 1 min (optional, since it's lightweight we can fetch often)
    refetchInterval: 30 * 1000 // auto poll every 30s so the dot appears transparently behind the scenes
  });
  
  return (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
    <div className="flex items-center gap-2">
      <div className="text-base font-bold text-text font-syne tracking-tight">
        campus<span className="text-primary-mid">.</span>
      </div>
      <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">{user?.college?.name}</div>
    </div>
    <div className="flex items-center gap-3">
      {(user?.role === 'admin' || user?.role === 'moderator') && (
        <div 
          onClick={() => onNavClick('admin')}
          className="px-2 py-1 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center cursor-pointer hover:bg-red-500/20 transition-colors"
        >
          <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase">Mod</span>
        </div>
      )}
      <div 
        onClick={() => onNavClick('profile')}
        className="w-8 h-8 rounded-full bg-primary-mid/10 border border-primary-mid/30 flex items-center justify-center cursor-pointer hover:bg-primary-mid/20 transition-colors overflow-hidden"
      >
        <span className="text-xs font-bold text-primary-mid font-syne">{user?.name?.charAt(0).toUpperCase()}</span>
      </div>
      <div 
        onClick={() => onNavClick('notifications')}
        className="w-7 h-7 rounded-full bg-bg2 border border-border flex items-center justify-center relative cursor-pointer hover:bg-bg3 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#9B99B0" strokeWidth="1.5">
          <path d="M8 1a5 5 0 015 5v3l1.5 2H1.5L3 9V6a5 5 0 015-5z" />
          <path d="M6.5 13a1.5 1.5 0 003 0" />
        </svg>
        {unreadCount > 0 && (
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-red border-2 border-bg"></div>
        )}
      </div>
    </div>
  </div>
  );
};

export default FeedTopNav;
