import '../styles/OnlineUsers.css';

const OnlineUsers = ({ users }) => {
  const getAvatarClass = (initials) => {
    const map = {
      'AR': 'av-p', 'AT': 'av-t', 'AF': 'av-a', 'AM': 'av-pk', 'AB': 'av-b', 'AW': 'av-pk'
    };
    return map[initials] || 'av-p';
  };

  return (
    <div className="online-users-panel">
      <div>
        <div className="panel-title">online now</div>
        <div className="online-users-list">
          {users.map((user, idx) => (
            <div key={idx} className="online-user">
              <div className={`ou-av ${getAvatarClass(user.initials)}`}>
                {user.initials}
                <div className="ou-badge"></div>
              </div>
              <span className="ou-name">{user.name}</span>
              <span className={`ou-college college-tag ${user.collegeCls}`}>{user.college}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="users-footer">
        <div className="users-footer-text">everyone is anonymous across all colleges</div>
      </div>
    </div>
  );
};

export default OnlineUsers;
