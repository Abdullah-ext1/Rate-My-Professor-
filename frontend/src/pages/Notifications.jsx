import { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import NotificationCard from '../components/NotificationCard';
import '../styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: '❤️',
      iconClass: 'notif-icon like',
      text: 'Someone liked your post about OS attendance',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      icon: '💬',
      iconClass: 'notif-icon comment',
      text: 'Someone replied to your comment on the DBMS notes post',
      time: '18 min ago',
      unread: true,
    },
    {
      id: 3,
      icon: '↩️',
      iconClass: 'notif-icon reply',
      text: 'Someone liked your comment on the WiFi rant post',
      time: '1 hr ago',
      unread: true,
    },
    {
      id: 4,
      icon: '❤️',
      iconClass: 'notif-icon like',
      text: 'Someone liked your confession post',
      time: '3 hrs ago',
      unread: false,
    },
    {
      id: 5,
      icon: '💬',
      iconClass: 'notif-icon comment',
      text: 'Someone replied to your question about the exam pattern',
      time: 'Yesterday',
      unread: false,
    },
  ]);

  return (
    <div className="app-layout">
      <ChatSidebar activeView="notifications" />
      <div className="main">
        <div className="topbar">
          <div className="page-title">Notifications</div>
          <button className="post-btn">Mark all read</button>
        </div>

        <div className="notif-content">
          {notifications.map((notif) => (
            <NotificationCard key={notif.id} notification={notif} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
