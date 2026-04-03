import '../styles/ChatSidebar.css';

const ChatSidebar = ({ activeView = 'chat' }) => {
  const navItems = [
    { id: 'feed', label: 'Feed', badge: '12', icon: 'feed' },
    { id: 'professors', label: 'Professors', icon: 'professors' },
    { id: 'attendance', label: 'Attendance', icon: 'attendance' },
    { id: 'pyq', label: 'PYQs', icon: 'pyq' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
    { id: 'announcements', label: 'Announcements', icon: 'announcements' },
    { id: 'notifications', label: 'Notifications', badge: '3', icon: 'notifications' },
    { id: 'chat', label: 'Global Chat', badge: '5', icon: 'chat' },
  ];

  const renderIcon = (iconType) => {
    const icons = {
      feed: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h8M2 12h10"/></svg>,
      professors: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>,
      attendance: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 8l2 2 4-4"/></svg>,
      pyq: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M6 6h4M6 9h4M6 12h2"/></svg>,
      leaderboard: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 14h12M4 10v4M8 6v8M12 8v6"/><circle cx="4" cy="10" r="0.5" fill="currentColor"/><circle cx="8" cy="6" r="0.5" fill="currentColor"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/></svg>,
      announcements: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1c3.3 0 6 1.3 6 3v5c0 1.7-2.7 3-6 3s-6-1.3-6-3V4c0-1.7 2.7-3 6-3z"/><path d="M2 9c0 1.7 2.7 3 6 3v3c-3.3 0-6-1.3-6-3"/></svg>,
      notifications: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1a5 5 0 015 5v3l1.5 2H1.5L3 9V6a5 5 0 015-5z"/><path d="M6.5 13a1.5 1.5 0 003 0"/></svg>,
      chat: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z"/></svg>,
    };
    return icons[iconType];
  };

  const handleNavClick = (id) => {
    window.location.href = `/${id}`;
  };

  return (
    <div className="chat-sidebar">
      <div className="logo">campus<span>.</span></div>
      
      <div className="college-badge">
        <span className="college-dot"></span>
        <span className="college-name">Rizvi Engineering</span>
      </div>

      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeView === item.id ? 'active' : ''}`}
          onClick={() => handleNavClick(item.id)}
          style={{ cursor: 'pointer' }}
        >
          {renderIcon(item.icon)}
          {item.label}
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="user-row">
          <div className="avatar">AX</div>
          <div>
            <div className="user-name">Anonymous fox</div>
            <div className="user-role">SY · Computer Sci</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
