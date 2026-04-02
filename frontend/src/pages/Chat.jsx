import { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessages from '../components/ChatMessages';
import ChatComposer from '../components/ChatComposer';
import OnlineUsers from '../components/OnlineUsers';
import '../styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'announcement', icon: '⭐', label: 'announcement · rizvi mod', text: 'Mid-sem exams start April 14. Timetable is live on the portal. No late entry after 10 mins. All the best', meta: '9:00 AM · pinned' },
    { id: 2, type: 'message', sender: 'anonymous wolf', college: 'saboo siddik', collegeCls: 'ct-saboo', initials: 'AW', avatarCls: 'av-pk', text: 'anyone else\'s placement cell completely asleep this semester or just ours 💀', time: '9:12 AM', reactions: [{ emoji: '💀', count: 14, active: true }, { emoji: '😭', count: 6 }] },
    { id: 3, type: 'message', sender: 'anonymous tiger', college: 'sfit', collegeCls: 'ct-sfit', initials: 'AT', avatarCls: 'av-t', text: 'bro same. 3 companies announced in january and then radio silence since', time: '9:14 AM' },
    { id: 4, type: 'message', sender: 'anonymous raven', college: 'rizvi', collegeCls: 'ct-rizvi', initials: 'AR', avatarCls: 'av-p', text: 'we had a session last week. 2 companies came but both wanted 8.5+ cgpa only lol. rest of us just sat there', time: '9:15 AM', reactions: [{ emoji: '💀', count: 9 }] },
    { id: 5, type: 'message', sender: 'anonymous fox', college: 'vit', collegeCls: 'ct-vit', initials: 'AF', avatarCls: 'av-a', text: 'anyone from rizvi using that campus app? the bunk tracker is actually carrying me this semester', time: '9:18 AM' },
    { id: 6, type: 'message', sender: 'anonymous moth', college: 'saboo siddik', collegeCls: 'ct-saboo', initials: 'AM', avatarCls: 'av-pk', text: 'wait what app?? someone drop a link rn 👀', time: '9:19 AM' },
    { id: 7, type: 'message', sender: 'you', college: 'rizvi', collegeCls: 'ct-rizvi', initials: 'ME', avatarCls: 'av-me', text: 'it\'s campus — anonymous feed, rate your profs, track bunks. built by students from rizvi actually. coming to more colleges soon', time: '9:21 AM', isMine: true, reactions: [{ emoji: '🔥', count: 22 }, { emoji: '👀', count: 11 }] },
    { id: 8, type: 'message', sender: 'anonymous tiger', college: 'sfit', collegeCls: 'ct-sfit', initials: 'AT', avatarCls: 'av-t', text: 'bro we NEED this for sfit. our prof rating situation is dire', time: '9:22 AM' },
    { id: 9, type: 'message', sender: 'anonymous bear', college: 'dj sanghvi', collegeCls: 'ct-djsc', initials: 'AB', avatarCls: 'av-b', text: 'same, anonymously roasting profs is a human right at this point', time: '9:23 AM', reactions: [{ emoji: '😭', count: 31 }, { emoji: '💯', count: 18, active: true }] },
  ]);

  const [selectedCollege, setSelectedCollege] = useState('all');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const onlineUsers = [
    { initials: 'AR', name: 'anon raven', college: 'rizvi', collegeCls: 'ct-rizvi' },
    { initials: 'AT', name: 'anon tiger', college: 'sfit', collegeCls: 'ct-sfit' },
    { initials: 'AF', name: 'anon fox', college: 'vit', collegeCls: 'ct-vit' },
    { initials: 'AW', name: 'anon wolf', college: 'saboo', collegeCls: 'ct-saboo' },
    { initials: 'AB', name: 'anon bear', college: 'djsc', collegeCls: 'ct-djsc' },
    { initials: 'AM', name: 'anon moth', college: 'saboo', collegeCls: 'ct-saboo' },
  ];

  const handleSendMessage = (messageText) => {
    console.log('Message sent:', messageText);
    // Simulate typing indicator
    setTimeout(() => {
      const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
      setTypingUser(randomUser);
      setIsTyping(true);
    }, 800);
    
    setTimeout(() => {
      setIsTyping(false);
      setTypingUser(null);
    }, 2200);
  };

  const handleCollegeFilter = (college) => {
    setSelectedCollege(college);
    console.log('Filtering by college:', college);
    // You'll implement the filter logic here
  };

  return (
    <div className="chat-container">
      <ChatSidebar />
      <div className="chat-main">
        <div className="chat-topbar">
          <div className="topbar-left">
            <div className="chat-icon">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#AFA9EC" strokeWidth="1.5">
                <path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z"/>
              </svg>
            </div>
            <div>
              <div className="page-title">Global Chat</div>
              <div className="chat-sub">all colleges · anonymous · real time</div>
            </div>
          </div>
          <div className="topbar-right">
            <select className="college-filter" onChange={(e) => handleCollegeFilter(e.target.value)}>
              <option value="all">All colleges</option>
              <option value="rizvi">Rizvi</option>
              <option value="sfit">SFIT</option>
              <option value="vit">VIT</option>
              <option value="saboo">Saboo Siddik</option>
              <option value="djsc">DJ Sanghvi</option>
            </select>
            <div className="online-pill">
              <div className="online-dot"></div>
              <span>247 online</span>
            </div>
          </div>
        </div>

        <div className="chat-layout">
          <ChatMessages messages={messages} selectedCollege={selectedCollege} isTyping={isTyping} typingUser={typingUser} />
          <OnlineUsers users={onlineUsers} />
        </div>

        <ChatComposer onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;
