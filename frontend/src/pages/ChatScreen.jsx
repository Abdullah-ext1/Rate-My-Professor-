import { useState, useRef, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { io } from 'socket.io-client';
import api from '../context/api.js';
import { useAuth } from '../context/AuthContext';


const ChatScreen = ({ onNavClick }) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Mock current user role for testing UI 
  const currentUserRole = 'admin'; 
  const [activeMessageId, setActiveMessageId] = useState(null);
  
  const [confirmAction, setConfirmAction] = useState({ isOpen: false, action: null, targetId: null, title: '', message: '', confirmText: '', confirmColor: 'bg-red-500' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages', { withCredentials: true })
      setMessages(res.data.data.reverse())
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }
  fetchMessages()

  socketRef.current = io('http://localhost:9000', {
    withCredentials: true
  })

  socketRef.current.on('message', (newMessage) => {
    setMessages(prev => [...prev, newMessage])
  })

  return () => {
    socketRef.current.disconnect()
  }
}, [])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
    socketRef.current.emit('sendMessage', { content: input })
    setInput('')
    }
  };

  const handleConfirmAction = () => {
    const { action, targetId } = confirmAction;
    if (action === 'delete') {
      setMessages(messages.filter(m => m.id !== targetId));
    } else if (action === 'suspend') {
      alert('Suspended user for 15 days');
    } else if (action === 'ban') {
      alert('User permanently banned');
    } else if (action === 'mod') {
      setMessages(prev => prev.map(m => 
        m.id === targetId 
          ? {...m, senderDetails: {...(m.senderDetails || {}), role: 'moderator'}}
          : m
      ));
    } else if (action === 'remove_mod') {
      setMessages(prev => prev.map(m => 
        m.id === targetId 
          ? {...m, senderDetails: {...(m.senderDetails || {}), role: 'user'}}
          : m
      ));
    }
    setActiveMessageId(null);
  };

  const openConfirm = (action, targetId, title, message, confirmText, confirmColor = 'bg-red-500') => {
    setConfirmAction({ isOpen: true, action, targetId, title, message, confirmText, confirmColor });
  };

  const getActionTitle = (type) => {
    switch (type) {
      case 'delete': return 'Delete Message';
      case 'suspend': return 'Suspend User';
      case 'mod': return 'Make Moderator';
      case 'remove_mod': return 'Remove Moderator Role';
      case 'ban': return 'Ban User';
      default: return 'Confirm Action';
    }
  };

  const getActionMessage = (type) => {
    switch (type) {
      case 'delete': return 'Are you sure you want to delete this message?';
      case 'suspend': return 'Are you sure you want to suspend this user for 15 days? They will not be able to interact with the platform during this time.';
      case 'mod': return 'Are you sure you want to promote this user to Moderator? They will have additional permissions.';
      case 'remove_mod': return 'Are you sure you want to remove this user\'s Moderator privileges? They will return to a standard user role.';
      case 'ban': return 'Are you sure you want to permanently ban this user? This action cannot be undone.';
      default: return 'Are you sure you want to proceed?';
    }
  };

  const openConfirmModal = (actionType, messageId) => {
    const title = getActionTitle(actionType);
    const message = getActionMessage(actionType);
    const confirmText = actionType === 'delete' ? 'Delete' : actionType === 'suspend' ? 'Suspend' : actionType === 'ban' ? 'Ban User' : 'Confirm';
    const confirmColor = actionType === 'delete' ? 'bg-red-500' : actionType === 'suspend' ? 'bg-accent-amber' : 'bg-primary';

    setConfirmAction({ isOpen: true, action: actionType, targetId: messageId, title, message, confirmText, confirmColor });
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

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 rounded-2 bg-opacity-25 bg-primary flex items-center justify-center text-xs font-semibold text-primary-mid flex-shrink-0 font-syne">
              {msg.sender === 'me' ? 'ME' : 'RZ'}
            </div>
            <div className={`flex-1 flex flex-col relative ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveMessageId(activeMessageId === msg.id ? null : msg.id)}>
                <span className="text-xs font-medium text-text2">{msg.sender === 'me' ? 'you' : 'Anonymous'}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-lg border border-opacity-30 border-primary bg-opacity-10 bg-primary text-primary-mid font-medium">{msg.sender === 'me' ? 'rizvi' : 'rizvi'}</span>
                <span className="text-xs text-text3">9:{21 + messages.indexOf(msg)} AM</span>
                {msg.sender !== 'me' && (currentUserRole === 'admin' || currentUserRole === 'moderator') && (
                   <span className="text-text3 text-xs ml-1 px-1 hover:text-text transition-colors">•••</span>
                )}
              </div>
              <div className={`text-xs mt-1.5 px-3 py-2 rounded-2.5 ${msg.sender === 'me' ? 'bg-opacity-15 bg-primary border border-opacity-30 border-primary text-text' : 'bg-bg2 border border-border text-text'}`}>
                {msg.content}
              </div>

              {/* Moderation Dropdown */}
              {activeMessageId === msg.id && msg.sender !== 'me' && (
                <div className="absolute top-6 left-0 z-50 bg-bg2 border border-border rounded-xl shadow-lg p-1 w-40 flex flex-col gap-1">
                   <button 
                     onClick={() => openConfirm('delete', msg.id, "Delete Message", "Are you sure you want to delete this message?", "Delete")}
                     className="text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                   >
                     Delete Message
                   </button>
                   {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
                     <button 
                       onClick={() => openConfirm('suspend', null, "Suspend User", "Are you sure you want to suspend this user for 15 days?", "Suspend", 'bg-accent-amber')}
                       className="text-left px-3 py-2 text-xs font-medium text-accent-amber hover:bg-accent-amber/10 rounded-lg transition-colors cursor-pointer"
                     >
                       Suspend (15 days)
                     </button>
                   )}
                   {currentUserRole === 'admin' && msg.senderDetails?.role !== 'admin' && (
                     <>
                       {msg.senderDetails?.role !== 'moderator' ? (
                         <button 
                           onClick={() => {
                             setActiveMessageId(null);
                             openConfirmModal('mod', msg.id);
                           }}
                           className="w-full text-left px-3 py-1.5 text-xs text-blue-400 hover:bg-hover active:bg-divider transition-colors flex items-center gap-2"
                         >
                           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                           </svg>
                           Make Moderator
                         </button>
                       ) : (
                         <button 
                           onClick={() => {
                             setActiveMessageId(null);
                             openConfirmModal('remove_mod', msg.id);
                           }}
                           className="w-full text-left px-3 py-1.5 text-xs text-orange-400 hover:bg-hover active:bg-divider transition-colors flex items-center gap-2"
                         >
                           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                             <circle cx="12" cy="12" r="10"></circle>
                             <line x1="15" y1="9" x2="9" y2="15"></line>
                             <line x1="9" y1="9" x2="15" y2="15"></line>
                           </svg>
                           Remove Moderator
                         </button>
                       )}
                       <button 
                         onClick={() => openConfirm('ban', null, "Ban User", "Are you sure you want to permanently ban this user?", "Ban User")}
                         className="text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                       >
                         Ban User
                       </button>
                     </>
                   )}
                </div>
              )}
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

      <ConfirmModal 
        isOpen={confirmAction.isOpen}
        onClose={() => { setConfirmAction({ ...confirmAction, isOpen: false }); setActiveMessageId(null); }}
        onConfirm={handleConfirmAction}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmText={confirmAction.confirmText}
        confirmColor={confirmAction.confirmColor}
      />
    </div>
  );
};

export default ChatScreen;
