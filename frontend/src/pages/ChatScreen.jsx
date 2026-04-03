import { useState, useRef, useEffect } from 'react';



const ChatScreen = ({ onNavClick }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'prof', content: 'Anyone know if Prof Patil is taking DS extra lectures this week?' },
    { id: 2, sender: 'other', content: 'Yes! Fri 4pm in lab 3. He announced it last class.' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'me', content: input }]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
        <div>
          <div className="text-sm font-semibold text-text font-syne">Campus chat</div>
          <div className="text-xs text-text3 mt-0.5">All colleges · anonymous</div>
        </div>
        <div className="flex items-center gap-1 bg-opacity-10 bg-accent-teal border border-opacity-20 border-accent-teal rounded-full px-2.5 py-1.5">
          <div className="w-1 h-1 rounded-full bg-accent-teal animate-pulse"></div>
          <span className="text-xs text-accent-teal font-medium">847 online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 scrollbar-hide bg-bg pt-16 pb-20">
        <div className="flex items-center gap-2 my-1.5">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-text3 px-2">Today</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <div className="bg-opacity-8 bg-primary border border-opacity-25 border-primary border-l-4 border-l-primary rounded-2.5 px-3 py-2.5 flex gap-2.5">
          <div className="text-sm flex-shrink-0">📢</div>
          <div>
            <div className="text-xs font-medium text-primary-mid uppercase tracking-wide">Announcement</div>
            <div className="text-xs text-text mt-1 leading-relaxed">End semester exams start April 14. Timetable uploaded on college portal.</div>
            <div className="text-xs text-text3 mt-2">College moderator · 9:00 AM</div>
          </div>
        </div>

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 rounded-2 bg-opacity-25 bg-primary flex items-center justify-center text-xs font-semibold text-primary-mid flex-shrink-0 font-syne">
              {msg.sender === 'me' ? 'ME' : 'RZ'}
            </div>
            <div className={`flex-1 flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text2">{msg.sender === 'me' ? 'you' : 'Anonymous'}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-lg border border-opacity-30 border-primary bg-opacity-10 bg-primary text-primary-mid font-medium">{msg.sender === 'me' ? 'rizvi' : 'rizvi'}</span>
                <span className="text-xs text-text3">9:{21 + messages.indexOf(msg)} AM</span>
              </div>
              <div className={`text-xs mt-1.5 px-3 py-2 rounded-2.5 ${msg.sender === 'me' ? 'bg-opacity-15 bg-primary border border-opacity-30 border-primary text-text' : 'bg-bg2 border border-border text-text'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 bg-bg border-t border-border px-3.5 py-2 flex-shrink-0">
        <div className="bg-bg2 border border-border2 rounded-3xl px-3 py-2.5 flex items-end gap-2.5">
          <div className="w-6.5 h-6.5 rounded-2 bg-opacity-30 bg-primary flex items-center justify-center text-xs font-semibold text-primary-mid flex-shrink-0 font-syne">ME</div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message anonymously..."
            className="flex-1 bg-transparent border-none text-xs text-text placeholder-text3 outline-none resize-none min-h-5 max-h-20 font-dm"
            rows="1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-2 bg-primary flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors disabled:opacity-35 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" width="14" height="14">
              <path d="M14 2L2 8l4 2 2 4 6-12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
