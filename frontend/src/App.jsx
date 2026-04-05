import React, { useState } from 'react';
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

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedPost, setSelectedPost] = useState(null);

  const handleNavClick = (screen, data = null) => {
    if (screen === 'post' && data) {
      setSelectedPost(data);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <div className="animate-fade-in"><LoginScreen onLogin={() => handleNavClick('feed')} /></div>;
      case 'feed':
        return <div className="animate-fade-in"><FeedScreen onNavClick={handleNavClick} /></div>;
      case 'professors':
        return <div className="animate-fade-in"><ProfessorsScreen onNavClick={handleNavClick} /></div>;
      case 'announcement':
        return <div className="animate-fade-in"><AnnouncementScreen onNavClick={handleNavClick} /></div>;
      case 'pyqs':
        return <div className="animate-fade-in"><PYQsScreen onNavClick={handleNavClick} /></div>;
      case 'chat':
        return <div className="animate-fade-in"><ChatScreen onNavClick={handleNavClick} /></div>;
      case 'post':
        return <div className="animate-fade-in"><PostScreen onNavClick={handleNavClick} postData={selectedPost} /></div>;
      case 'notifications':
        return <div className="animate-fade-in"><NotificationScreen onNavClick={handleNavClick} /></div>;
      case 'leaderboard':
        return <div className="animate-fade-in"><LeaderboardScreen onNavClick={handleNavClick} /></div>;
      case 'rate-professor':
        return <div className="animate-fade-in"><RateProfessorScreen onNavClick={handleNavClick} /></div>;
      case 'moderator-dashboard':
        return <div className="animate-fade-in"><ModeratorDashboard onNavClick={handleNavClick} /></div>;
      case 'profile':
        return <div className="animate-fade-in"><ProfileScreen onNavClick={handleNavClick} onBack={() => handleNavClick('chat')} currentUserRole="admin" /></div>;
      case 'admin':
        return <div className="animate-fade-in"><AdminScreen onNavClick={handleNavClick} onBack={() => handleNavClick('profile')} /></div>;
      default:
        return <div className="animate-fade-in"><FeedScreen onNavClick={handleNavClick} /></div>;
    }
  };

  return (
    <div className="w-full h-screen bg-bg overflow-hidden flex flex-col">
      {/* Scrollable Content - bottom padding for footer */}
      <div className="flex-1 overflow-y-auto mb-16 w-full">
        {renderScreen()}
      </div>

      {/* Fixed Footer - Only shown when not on login screen */}
      {currentScreen !== 'login' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border animate-slide-up">
          <div className="flex justify-around items-center h-16 px-2">
            {['feed', 'professors', 'announcement', 'vault', 'chat'].map(screen => (
              <button
                key={screen}
                onClick={() => handleNavClick(screen === 'vault' ? 'pyqs' : screen)}
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
}

export default App;
