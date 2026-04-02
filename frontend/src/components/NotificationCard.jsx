import '../styles/NotificationCard.css';

const NotificationCard = ({ notification }) => {
  return (
    <div className={`notif-card ${notification.unread ? 'unread' : ''}`}>
      <div className={notification.iconClass}>{notification.icon}</div>
      <div className="notif-body">
        <div className="notif-text">{notification.text}</div>
        <div className="notif-time">{notification.time}</div>
      </div>
      {notification.unread && <div className="unread-dot"></div>}
    </div>
  );
};

export default NotificationCard;
