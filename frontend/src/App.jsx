import React, { useState } from 'react';
import StatusBar from './components/StatusBar';
import LoginScreen from './pages/LoginScreen';
import FeedScreen from './pages/FeedScreen';
import ProfessorsScreen from './pages/ProfessorsScreen';
import AttendanceScreen from './pages/AttendanceScreen';
import PYQsScreen from './pages/PYQsScreen';
import ChatScreen from './pages/ChatScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={() => setCurrentScreen('feed')} />;
      case 'feed':
        return <FeedScreen onNavClick={setCurrentScreen} />;
      case 'professors':
        return <ProfessorsScreen onNavClick={setCurrentScreen} />;
      case 'attendance':
        return <AttendanceScreen onNavClick={setCurrentScreen} />;
      case 'pyqs':
        return <PYQsScreen onNavClick={setCurrentScreen} />;
      case 'chat':
        return <ChatScreen onNavClick={setCurrentScreen} />;
      default:
        return <FeedScreen onNavClick={setCurrentScreen} />;
    }
  };

  return (
    <div className="w-full h-screen bg-bg overflow-hidden flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <StatusBar />
      </div>

      {/* Scrollable Content - with top padding for header and bottom padding for footer */}
      <div className="flex-1 overflow-y-auto mt-12 mb-16 w-full">
        {renderScreen()}
      </div>

      {/* Fixed Footer - Only shown when not on login screen */}
      {currentScreen !== 'login' && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="bg-bg border-t border-border flex justify-around items-center h-16 px-2">
            {['feed', 'professors', 'attendance', 'pyqs', 'chat'].map(screen => (
              <button
                key={screen}
                onClick={() => setCurrentScreen(screen)}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors ${
                  currentScreen === screen
                    ? 'text-primary-mid'
                    : 'text-text3 hover:text-text2'
                }`}
              >
                <div className="text-lg mb-0.5">
                  {screen === 'feed' && '📰'}
                  {screen === 'professors' && '👨‍🏫'}
                  {screen === 'attendance' && '✓'}
                  {screen === 'pyqs' && '📚'}
                  {screen === 'chat' && '💬'}
                </div>
                <span className="text-xs font-medium capitalize">{screen}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
