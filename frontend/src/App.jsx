import { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoginScreen from './pages/LoginScreen';
import { AnimatePresence, motion } from 'framer-motion';
import {ProtectedRoute} from "./context/ProtectedRoute"
import api from './context/api';
import { useAuth } from './context/AuthContext';
import { isNotificationSoundEnabled, playNotificationSound, showSystemNotification, warmupAudioContext } from './utils/notificationSound';
import { io } from 'socket.io-client';
import { registerPushNotifications } from './utils/pushSubscription';

// Lazy load heavy pages for code-splitting
const FeedScreen = lazy(() => import('./pages/FeedScreen'));
const ProfessorsScreen = lazy(() => import('./pages/ProfessorsScreen'));
const AnnouncementScreen = lazy(() => import('./pages/AnnouncementScreen'));
const PYQsScreen = lazy(() => import('./pages/PYQsScreen'));
const ChatScreen = lazy(() => import('./pages/ChatScreen'));
const PostScreen = lazy(() => import('./pages/PostScreen'));
const ProfileScreen = lazy(() => import('./pages/ProfileScreen'));
const UserProfileScreen = lazy(() => import('./pages/UserProfileScreen'));
const AdminScreen = lazy(() => import('./pages/AdminScreen'));
const NotificationScreen = lazy(() => import('./pages/NotificationScreen'));
const LeaderboardScreen = lazy(() => import('./pages/LeaderboardScreen'));
const RateProfessorScreen = lazy(() => import('./pages/RateProfessorScreen'));
const OnBoardingScreen = lazy(() => import('./pages/OnBoardingScreen'));
const PrivacyPolicyScreen = lazy(() => import('./pages/PrivacyPolicyScreen'));
const ModeratorDashboard = lazy(() => import('./pages/ModeratorDashboard'));
const AttendanceScreen = lazy(() => import('./pages/AttendanceScreen'));



const LoadingScreen = () => (
  <div className="flex flex-col flex-1 bg-bg h-screen w-full items-center justify-center">
    <div className="w-full h-full" />
  </div>
);

const SuspenseLoader = () => <LoadingScreen />;

const RootRedirect = () => {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" />;
    if (!user.college && user.role !== 'admin') return <Navigate to="/onboarding" />;
    return <Navigate to="/feed" />;
};
// Main App Layout Component (handles navigation and footer)
const AppLayout = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPost, setSelectedPost] = useState(null);
  const previousUnreadRef = useRef(0);
  const notificationSocketRef = useRef(null);

  // Warm up AudioContext on first user interaction (required by modern browsers)
  useEffect(() => {
    const handleFirstInteraction = () => {
      warmupAudioContext();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);

  useEffect(() => {
    let timerId;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window._deferredPrompt = e; // Make accessible globally for ProfileScreen

      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      // Show after 5 seconds if not already installed
      if (!isStandalone) {
        timerId = setTimeout(() => {
          setShowPwaPrompt(true);
        }, 5000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback for iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isIOS && !isStandalone) {
      timerId = setTimeout(() => {
        setShowPwaPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const res = await api.get('/notifications/unread', { withCredentials: true });
      return Number(res.data?.data || 0);
    },
    enabled: !!user,
    staleTime: 10 * 1000,
    refetchInterval: 20 * 1000,
    refetchOnWindowFocus: true,
  });

  // Register push once on login — NOT inside the poll effect
  useEffect(() => {
    if (!user) return;
    registerPushNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) {
      previousUnreadRef.current = 0;
      return;
    }

    if (previousUnreadRef.current === 0) {
      previousUnreadRef.current = unreadCount;
      return;
    }

    if (unreadCount > previousUnreadRef.current && isNotificationSoundEnabled()) {
      playNotificationSound();
      showSystemNotification({
        title: 'campus.',
        body: 'You have a new notification.'
      });
    }

    previousUnreadRef.current = unreadCount;
  }, [unreadCount, user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user || !token || notificationSocketRef.current) return;

    const socketUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');
    const socket = io(socketUrl, {
      withCredentials: true,
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    notificationSocketRef.current = socket;

    socket.on('notification', (payload) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      if (isNotificationSoundEnabled()) {
        playNotificationSound();
      }

      showSystemNotification({
        title: 'campus.',
        body: payload?.content || 'You have a new notification.'
      });
    });

    return () => {
      socket.disconnect();
      notificationSocketRef.current = null;
    };
  }, [user, queryClient]);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        window._deferredPrompt = null;
      }
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        alert('To install this app on your iOS device, tap the "Share" button and then "Add to Home Screen".');
      }
    }
    setShowPwaPrompt(false);
  };

  const handleDismissPwa = () => {
    setShowPwaPrompt(false);
  };

  const handleNavClick = (screen, data = null) => {
    if (screen === 'post' && data) {
      setSelectedPost(data);
    }
    navigate(`/${screen}`, { state: { professor: data } });
  };

  const currentScreen = location.pathname.slice(1) || 'feed';

  return (
    <div className="w-full h-screen bg-bg overflow-hidden flex flex-col">
      {/* Scrollable Content - bottom padding for footer */}
      <div className="flex-1 overflow-y-auto mb-16 w-full">
        <Routes>
          <Route path="/login" element={
            <div className="animate-fade-in">
              <LoginScreen onLogin={() => navigate('/feed')} />
            </div>
          } />

          <Route path="/feed" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <FeedScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/professors" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <ProfessorsScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/announcement" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <AnnouncementScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/pyqs" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <PYQsScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <ChatScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/attendance" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <AttendanceScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/post/:id" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <PostScreen onNavClick={handleNavClick} postData={selectedPost} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <NotificationScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <LeaderboardScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/rate-professor" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <RateProfessorScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <ProfileScreen onNavClick={handleNavClick} onBack={() => navigate('/chat')} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <UserProfileScreen onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <AdminScreen onNavClick={handleNavClick} onBack={() => navigate('/profile')} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/moderator-dashboard" element={
            <ProtectedRoute>
              <Suspense fallback={<SuspenseLoader />}>
                <div className="animate-fade-in">
                  <ModeratorDashboard onNavClick={handleNavClick} />
                </div>
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/privacy" element={
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Suspense fallback={<SuspenseLoader />}>
                <PrivacyPolicyScreen onNavClick={handleNavClick} />
              </Suspense>
            </motion.div>
          } />
          
          <Route path="/onboarding" element={
            <Suspense fallback={<SuspenseLoader />}>
              <div className="animate-fade-in">
                <OnBoardingScreen />
              </div>
            </Suspense>
          } />
          <Route path="/" element={<RootRedirect/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {showPwaPrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slide-up">
          <div className="bg-bg2 border border-primary/30 rounded-2xl p-4 shadow-xl shadow-primary/10 flex items-center gap-4 relative">
            <button 
              onClick={handleDismissPwa}
              className="absolute top-2 right-2 text-text3 hover:text-text p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-text font-syne mb-0.5">Install App</h3>
              <p className="text-[10px] text-text3 mb-2 leading-tight">Get the native mobile experience for a better UI.</p>
              <button 
                onClick={handleInstallPwa}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-1.5 px-4 rounded-lg transition-colors w-max"
              >
                Install Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Footer - Only shown when not on login screen */}
      {currentScreen !== 'login' && currentScreen !== 'onboarding' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border animate-slide-up">
          <div className="flex justify-around items-center h-16 px-2">
            {['feed', 'professors', 'announcement', 'vault', 'chat'].map(screen => (
              <button
                key={screen}
                onClick={() => navigate(`/${screen === 'vault' ? 'pyqs' : screen}`)}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors relative group ${(currentScreen === screen || (currentScreen === 'pyqs' && screen === 'vault'))
                  ? 'text-primary-mid'
                  : 'text-text3 hover:text-text2'
                  }`}
              >
                <div className="w-6 h-6 mb-0.5 flex items-center justify-center">
                  {screen === 'feed' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                  {screen === 'professors' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )}
                  {screen === 'announcement' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-4H7V4h8v14z" />
                    </svg>
                  )}
                  {screen === 'vault' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  )}
                  {screen === 'chat' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-medium capitalize opacity-0 group-hover:opacity-100 transition-opacity">{screen}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component wraps everything in Router
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
