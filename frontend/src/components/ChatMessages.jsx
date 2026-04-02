import '../styles/ChatMessages.css';

const ChatMessages = ({ messages, selectedCollege, isTyping, typingUser }) => {
  const getAvatarClass = (initials) => {
    const map = {
      'AR': 'av-p', 'AT': 'av-t', 'AF': 'av-a', 'AM': 'av-pk', 'AB': 'av-b', 'AW': 'av-pk', 'ME': 'av-me'
    };
    return map[initials] || 'av-p';
  };

  const filteredMessages = selectedCollege === 'all' 
    ? messages 
    : messages.filter(msg => msg.type === 'announcement' || msg.isMine || msg.college?.toLowerCase().includes(selectedCollege));

  return (
    <div className="chat-messages">
      <div className="day-divider"><span>today</span></div>

      {filteredMessages.map((msg) => (
        <div key={msg.id}>
          {msg.type === 'announcement' && (
            <div className="announcement-msg">
              <div className="ann-icon">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L9.5 6H14L10.5 8.5L12 13L8 10.5L4 13L5.5 8.5L2 6H6.5L8 2Z" fill="#AFA9EC"/>
                </svg>
              </div>
              <div className="ann-body">
                <div className="ann-label">{msg.label}</div>
                <div className="ann-text">{msg.text}</div>
                <div className="ann-meta">{msg.meta}</div>
              </div>
            </div>
          )}

          {msg.type === 'message' && (
            <div className={`msg-group ${msg.isMine ? 'mine' : ''}`}>
              <div className={`msg-av ${msg.avatarCls}`}>{msg.initials}</div>
              <div className="msg-content">
                <div className="msg-meta">
                  <span className="msg-sender">{msg.sender}</span>
                  <span className={`college-tag ${msg.collegeCls}`}>{msg.college}</span>
                  <span className="msg-time">{msg.time}</span>
                </div>
                <div className="msg-bubble">{msg.text}</div>
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="msg-reactions">
                    {msg.reactions.map((reaction, idx) => (
                      <span key={idx} className={`reaction ${reaction.active ? 'active' : ''}`}>
                        {reaction.emoji} {reaction.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="typing-row">
          <div className={`typing-av ${getAvatarClass(typingUser?.initials || 'AW')}`}>
            {typingUser?.initials || 'AW'}
          </div>
          <div className="typing-dots">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
          <span className="typing-text">{typingUser?.name || 'anonymous wolf'} is typing...</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
