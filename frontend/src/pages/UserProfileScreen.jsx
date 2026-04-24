import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UserProfileScreen = ({ onNavClick }) => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();

  const { data: profileUser, isLoading, isError } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const res = await api.get(`/auth/user/${userId}`, { withCredentials: true });
      return res.data?.data;
    },
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

  const isSelf = useMemo(() => profileUser?._id === currentUser?._id, [profileUser?._id, currentUser?._id]);

  const handleReportUser = async () => {
    if (window.confirm("Are you sure you want to report this user to the moderators?")) {
      try {
        await api.post(`/auth/report/${userId}`, {}, { withCredentials: true });
        toast.success("User reported successfully.");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to report user.");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-bg border-b border-border z-40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => onNavClick('feed')} className="text-text3 hover:text-text transition-colors p-1 rounded-full hover:bg-bg2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-text">{isSelf ? 'Your Profile' : 'Profile'}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pt-20 pb-24 scrollbar-hide bg-bg">
        {isLoading ? (
          <div className="text-text3 text-sm text-center py-12">Loading profile...</div>
        ) : isError || !profileUser ? (
          <div className="text-red-400 text-sm text-center py-12">Could not load profile.</div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-6 border-b border-border mb-6">
              <div className="w-24 h-24 rounded-full bg-primary-mid/10 border-4 border-bg2 outline outline-2 outline-primary-mid/30 flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                <img src={profileUser?.avatar} className="w-full h-full object-cover rounded-full" />
              </div>
              <h2 className="text-xl font-bold text-text mb-1">{profileUser?.name}</h2>
              <p className="text-sm text-text3 font-medium">@{profileUser?.username || 'anonymous'}</p>

              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/20 text-xs font-semibold uppercase tracking-wide">
                  {profileUser?.role}
                </span>
                {profileUser?.college?.name && (
                  <span className="px-3 py-1 rounded-full bg-primary-mid/10 text-primary-mid border border-primary-mid/20 text-xs font-semibold uppercase tracking-wide">
                    {profileUser.college.name}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-text mb-1 tracking-tight">{profileUser?.postsCount || 0}</span>
                <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Posts</span>
              </div>
              <div className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-text mb-1 tracking-tight">{profileUser?.karma || 0}</span>
                <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Karma</span>
              </div>
              <div className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-text mb-1 tracking-tight">{profileUser?.repliesCount || 0}</span>
                <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Replies</span>
              </div>
            </div>

            {!isSelf && (
              <div className="flex flex-col gap-2 mt-4">
                <button 
                  onClick={handleReportUser}
                  className="flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/10 transition-colors text-red-500 group cursor-pointer w-full text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold flex-1">Report User</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfileScreen;
