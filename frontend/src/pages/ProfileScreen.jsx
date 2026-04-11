import { useAuth } from "../context/AuthContext";
import api from "../context/api.js"

const ProfileScreen = ({ onNavClick, currentUserRole }) => {
  
  const {user} = useAuth();
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative min-h-screen">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-bg border-b border-border z-40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => onNavClick('feed')} className="text-text3 hover:text-text transition-colors p-1 rounded-full hover:bg-bg2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-text">Profile</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pt-20 pb-24 scrollbar-hide bg-bg">
        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center py-6 border-b border-border mb-6">
          <div className="w-24 h-24 rounded-full bg-primary-mid/10 border-4 border-bg2 outline outline-2 outline-primary-mid/30 flex items-center justify-center mb-4 shadow-lg overflow-hidden relative group cursor-pointer">
            <img src={user?.avatar} className="w-full h-full object-cover rounded-full" />
            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-text mb-1">{user?.name}</h2>
          <p className="text-sm text-text3 font-medium">{user?.username}</p>
          
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/20 text-xs font-semibold uppercase tracking-wide">
              {user?.role}
            </span>
            <span className="px-3 py-1 rounded-full bg-primary-mid/10 text-primary-mid border border-primary-mid/20 text-xs font-semibold uppercase tracking-wide">
              {user?.college?.name}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-text mb-1 tracking-tight">42</span>
            <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Posts</span>
          </div>
          <div className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-text mb-1 tracking-tight">18k</span>
            <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Karma</span>
          </div>
          <div className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-text mb-1 tracking-tight">156</span>
            <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Replies</span>
          </div>
        </div>

        {/* Settings & Options */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-text3 uppercase tracking-wider mb-2 ml-2">Settings</h3>
          
          {[
            { icon: 'M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2M21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', label: 'Friends & Followers' },
            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Privacy & Safety' },
            { icon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', label: 'Display' }
          ].map((item, i) => (
            <button key={i} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-bg2 transition-colors text-text group cursor-pointer w-full text-left">
              <div className="w-8 h-8 rounded-full bg-bg3 flex items-center justify-center text-text3 group-hover:text-primary-mid group-hover:bg-primary-mid/10 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </div>
              <span className="text-sm font-semibold flex-1">{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text3 group-hover:text-text transition-colors">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}

          {user?.role === 'admin' && (
            <button 
              onClick={() => onNavClick('admin')}
              className="w-full flex items-center justify-between p-4 hover:bg-hover active:bg-divider transition-colors"
            >
              <div className="flex items-center gap-3 text-red-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-sm font-medium">Admin Dashboard</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="text-text3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          <button 
            onClick={async () => {
              await api.post('/auth/logout');
              window.location.href = '/login';
            }}

            className="flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/10 transition-colors text-red-500 group cursor-pointer w-full text-left mt-2">
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <span className="text-sm font-semibold flex-1">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;