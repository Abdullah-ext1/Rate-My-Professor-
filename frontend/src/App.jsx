import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StatusBar from './components/StatusBar';
import LoginScreen from './pages/LoginScreen';
import FeedScreen from './pages/FeedScreen';
import ProfessorsScreen from './pages/ProfessorsScreen';
import AnnouncementScreen from './pages/AnnouncementScreen';
import PYQsScreen from './pages/PYQsScreen';
import ChatScreen from './pages/ChatScreen';
import PostScreen from './pages/PostScreen';
import ProfileScreen from './pages/ProfileScreen';
import AdminScreen from './pages/AdminScreen';
import NotificationScreen from './pages/NotificationScreen';
import LeaderboardScreen from './pages/LeaderboardScreen';
import RateProfessorScreen from './pages/RateProfessorScreen';

// Main App Layout Component (handles navigation and footer)
const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPost, setSelectedPost] = useState(null);

  const handleNavClick = (screen, data = null) => {
    if (screen === 'post' && data) {
      setSelectedPost(data);
    }
    navigate(`/${screen}`);
  };

  const currentScreen = location.pathname.slice(1) || 'feed';

  return (
    <div className="w-full h-screen bg-bg overflow-hidden flex flex-col">
      {/* Scrollable Content - bottom padding for footer */}
      <div className="flex-1 overflow-y-auto mb-16 w-full">
        <Routes>
          <Route path="/login" element={<div className="animate-fade-in"><LoginScreen onLogin={() => navigate('/feed')} /></div>} />
          <Route path="/feed" element={<div className="animate-fade-in"><FeedScreen onNavClick={handleNavClick} /></div>} />
          <Route path="/professors" element={<div className="animate-fade-in"><ProfessorsScreen onNavClick={handleNavClick} /></div>} />
          <Route path="/announcement" element={<div className="animate-fade-in"><AnnouncementScreen onNavClick={handleNavClick} /></div>} />
          <Route path="/pyqs" element={<div className="animate-fade-in"><PYQsScreen onNavClick={handleNavClick} /></div>} />
          <Route path="/chat" element={<div className="animate-fade-in"><ChatScreen onNavClick={handleNavClick} /></div>} />
          <Route path="/post" element={<div className="animate-fade-in"><PostScreen onNavClick={handleNavClick} postData={selectedPost} /></div>} />
          <Route path="/notifications" element={<div className="animate-fade-in"><NotificationScreen onNavClick={handleNavClick} /></div>} />
          <Route path="/leaderboard" element={<div className="animate-fade-in"><LeaderboardScreen onNavClick={handleNavClick} /></div>} />
          <Route path="/rate-professor" element={<div className="animate-fade-in"><RateProfessorScreen onNavClick={handleNavClick} /></div>} />
          <Route path="/profile" element={<div className="animate-fade-in"><ProfileScreen onNavClick={handleNavClick} onBack={() => navigate('/chat')} currentUserRole="admin" /></div>} />
          <Route path="/admin" element={<div className="animate-fade-in"><AdminScreen onNavClick={handleNavClick} onBack={() => navigate('/profile')} /></div>} />
          <Route path="/" element={<div className="animate-fade-in"><FeedScreen onNavClick={handleNavClick} /></div>} />
        </Routes>
      </div>

      {/* Fixed Footer - Only shown when not on login screen */}
      {currentScreen !== 'login' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border animate-slide-up">
          <div className="flex justify-around items-center h-16 px-2">
            {['feed', 'professors', 'announcement', 'vault', 'chat'].map(screen => (
              <button
                key={screen}
                onClick={() => navigate(`/${screen === 'vault' ? 'pyqs' : screen}`)}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors relative group ${
                  (currentScreen === screen || (currentScreen === 'pyqs' && screen === 'vault'))
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
                      <path strokeLineCap="round" strokeLinejoin="round" d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-4H7V4h8v14z" />
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
