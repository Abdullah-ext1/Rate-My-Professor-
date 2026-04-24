import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import api from "../context/api.js";
import { motion, AnimatePresence } from 'framer-motion';
import { DEPARTMENTS } from '../utils/departments.js';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [year, setYear] = useState(user?.year || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.put('/auth/profile', {
        name,
        username,
        department,
        year
      });
      // The frontend should update its state and close the modal regardless of 'success' nesting if it reaches here okay.
      onUpdate(response.data?.data || response.data);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update profile';
      setError(msg);
      toast.error(msg);
      console.log("Error while changing the details", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full sm:w-[400px] bg-bg border border-border rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-text font-syne">Edit Profile</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg2 flex items-center justify-center text-text3 hover:text-text">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="text-accent-amber text-xs bg-accent-amber/10 p-2 rounded-lg">{error}</div>}
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text3 font-bold uppercase tracking-wider ml-1">Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-bg2 border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid transition-colors"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-text3 font-bold uppercase tracking-wider ml-1">Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-text3">@</span>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full bg-bg2 border border-border rounded-2xl pl-8 pr-4 py-3 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid transition-colors"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-text3 font-bold uppercase tracking-wider ml-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-bg2 border border-border rounded-2xl px-4 py-3 text-sm text-text outline-none focus:border-primary-mid transition-colors appearance-none"
              >
                <option value="">Select department...</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-text3 font-bold uppercase tracking-wider ml-1">Year</label>
              <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
                className="bg-bg2 border border-border rounded-2xl px-4 py-3 text-sm text-text outline-none focus:border-primary-mid transition-colors appearance-none"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year+</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full mt-4 bg-primary text-white rounded-2xl py-3.5 text-sm font-semibold cursor-pointer transition-all active:scale-95 ${isSubmitting ? 'opacity-70' : 'hover:bg-primary-dark shadow-md hover:shadow-primary/30'}`}
            >
              {isSubmitting ? 'Updating...' : 'Save Details'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

const ProfileScreen = ({ onNavClick, currentUserRole }) => {
  const {user, setUser} = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  // Try to use the globally captured deferred prompt first
  const [deferredPrompt, setDeferredPrompt] = useState(window._deferredPrompt || null);

  useEffect(() => {
    // If it hasn't fired yet, listen for it just in case
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window._deferredPrompt = e;
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      window._deferredPrompt = null;
      toast.success('App installed successfully!');
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone;
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isStandalone) {
      toast.success('App is already installed on this device.');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        window._deferredPrompt = null;
        toast.success('Install started. Check your home screen in a moment.');
      } else {
        toast('Install cancelled for now.');
      }
      return;
    }

    if (isIOS) {
      toast('On iPhone/iPad: tap Share → Add to Home Screen.');
      return;
    }

    if (!window.isSecureContext) {
      toast.error('Install is available only on HTTPS or localhost.');
      return;
    }

    toast('Install prompt is not available yet. Reload once, then try again in Chrome/Edge.');
  };

  const showInitials = !user?.avatar || avatarError;

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
        {/* Edit Profile Modal */}
        <EditProfileModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onUpdate={(updatedData) => {
            setUser({ ...user, ...updatedData });
          }}
        />

        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center py-6 border-b border-border mb-6">
          <div className="w-24 h-24 rounded-full bg-primary-mid/10 border-4 border-bg2 outline outline-2 outline-primary-mid/30 flex items-center justify-center mb-4 shadow-lg overflow-hidden relative group cursor-pointer">
            {showInitials ? (
              <span className="text-2xl font-bold text-primary-mid font-syne">{getInitials(user?.name)}</span>
            ) : (
              <img 
                src={user?.avatar} 
                className="w-full h-full object-cover rounded-full" 
                onError={() => setAvatarError(true)}
              />
            )}
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
            <span className="text-2xl font-bold text-text mb-1 tracking-tight">{user?.postsCount || 0}</span>
            <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Posts</span>
          </div>
          <div className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-text mb-1 tracking-tight">
              {user?.karma >= 1000 ? (user?.karma / 1000).toFixed(1) + 'k' : (user?.karma || 0)}
            </span>
            <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Karma</span>
          </div>
          <div className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-text mb-1 tracking-tight">{user?.repliesCount || 0}</span>
            <span className="text-[10px] text-text3 uppercase font-medium tracking-wider">Replies</span>
          </div>
        </div>

        {/* Settings & Options */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-text3 uppercase tracking-wider mb-2 ml-2">Settings</h3>
          
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-3 p-4 rounded-2xl hover:bg-bg2 transition-colors text-text group cursor-pointer w-full text-left bg-primary/10 border border-primary/20 mb-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold block text-primary font-syne">Install RateProfessor App</span>
              <span className="text-xs text-text3">Get the native app experience</span>
            </div>
          </button>

          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-3 p-4 rounded-2xl hover:bg-bg2 transition-colors text-text group cursor-pointer w-full text-left"
          >
            <div className="w-8 h-8 rounded-full bg-bg3 flex items-center justify-center text-text3 group-hover:text-primary-mid group-hover:bg-primary-mid/10 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
              </svg>
            </div>
            <span className="text-sm font-semibold flex-1">Edit Profile</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text3 group-hover:text-text transition-colors">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {(user?.role === 'admin' || user?.role === 'moderator') && (
            <button 
              onClick={() => onNavClick('admin')}
              className="w-full flex items-center justify-between p-4 hover:bg-hover active:bg-divider transition-colors"
            >
              <div className="flex items-center gap-3 text-red-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-sm font-medium">{user.role === 'admin' ? 'Admin Dashboard' : 'Moderator Dashboard'}</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="text-text3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          <button 
            onClick={() => onNavClick('privacy')}
            className="flex items-center gap-3 p-4 rounded-2xl hover:bg-bg3 transition-colors active:scale-95 text-text group cursor-pointer w-full text-left mt-2"
          >
            <div className="w-8 h-8 rounded-full bg-slate-500/10 text-slate-500 flex items-center justify-center group-hover:bg-slate-500/20 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-sm font-semibold flex-1">Privacy & Safety</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text3 group-hover:text-text transition-colors">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <button 
            onClick={async () => {
              await api.post('/auth/logout');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('chatUsername');
              window.location.href = '/login';
            }}
            className="flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/10 transition-colors text-red-500 group cursor-pointer w-full text-left mt-2"
          >
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

        {/* Made with Love Section */}
        <div className="my-8 flex flex-col items-center justify-center pt-6 border-t border-border/40">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-[11px] font-medium text-text3 tracking-wide flex items-center justify-center gap-1 bg-bg2 px-4 py-2 rounded-full border border-border/80 shadow-sm text-center flex-wrap"
          >
            <span>Made with <span className="text-red-500 animate-pulse px-0.5">❤</span> by{' '}
            <a href="https://www.linkedin.com/in/ammarfrfr/" target="_blank" rel="noopener noreferrer" className="text-primary-mid font-bold hover:underline">Ammar</a>
            {' '}&{' '}
            <a href="https://www.linkedin.com/in/abdullah-khan-6747252b5/" target="_blank" rel="noopener noreferrer" className="text-primary-mid font-bold hover:underline">Abdullah</a>
            </span>
            <span className="hidden sm:inline"> | </span>
            <span>Marketed by{' '}
            <a href="https://www.linkedin.com/in/arfat-naik/" target="_blank" rel="noopener noreferrer" className="text-primary-mid font-bold hover:underline">Arfat</a>
            {' '}&{' '}
            <a href="https://www.linkedin.com/in/mohammedzaidshaikh10/" target="_blank" rel="noopener noreferrer" className="text-primary-mid font-bold hover:underline">Zaid</a>
            </span>
          </motion.div>
        </div>

      </div>
    </div>
  );
};


export default ProfileScreen;