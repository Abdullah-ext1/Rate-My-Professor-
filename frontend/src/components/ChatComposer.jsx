import { useState } from 'react';
import '../styles/ChatComposer.css';

const ChatComposer = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-composer">
      <div className="composer-wrap">
        <div className="composer-top">
          <div className="composer-av">ME</div>
          <textarea
            className="composer-input"
            placeholder="say something to the world..."
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="composer-bottom">
          <div className="composer-hint">
            you appear as <span>anonymous fox</span> from <span>rizvi</span> · enter to send
          </div>
          <div className="composer-actions">
            <button className="emoji-btn" title="emoji">☺</button>
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2L5 8L2 14L14 8Z" fill="white"/>
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComposer;
