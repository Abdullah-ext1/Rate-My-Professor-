import { useState, useRef, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { io } from 'socket.io-client';
import api from '../context/api.js';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ChatScreen = ({ onNavClick }) => {
  const { user } = useAuth();
  
  const queryClient = useQueryClient();
  const { data: messages = [], isSuccess } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      const res = await api.get('/messages', { withCredentials: true });
      return res.data.data.reverse();
    },
    staleTime: Infinity, // Prevent automatic refetches since sockets keep it updated
  });

  const [onlineCount, setOnlineCount] = useState(0);
  const socketRef = useRef(null);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const [username, setUsername] = useState('');
  const [hasEntered, setHasEntered] = useState(false);
  const [tempName, setTempName] = useState('');
  const [animKey, setAnimKey] = useState(0);

  const [activeMessageId, setActiveMessageId] = useState(null);
  
  const [confirmAction, setConfirmAction] = useState({ isOpen: false, action: null, targetId: null, targetSenderId: null, title: '', message: '', confirmText: '', confirmColor: 'bg-red-500' });

  useEffect(() => {
    const savedName = localStorage.getItem('chatUsername');
    if (savedName) {
      setUsername(savedName);
      setHasEntered(true);
    }
  }, []);

  const handleGenerateName = () => {
    try {
      const animals = ['panda', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'eagle', 'hawk', 'koala', 'dolphin'];
      const adjectives = ['mysterious', 'bold', 'sleepy', 'happy', 'clever', 'fast', 'brave', 'quiet'];
      
      let generatedName = '';
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 10) {
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        generatedName = `${randomAdjective} ${randomAnimal}`.toLowerCase();
        
        // Simple fast check: verify name is not already used in loaded messages
        const alreadyUsed = messages.some(msg => msg.senderName?.toLowerCase() === generatedName);
        if (!alreadyUsed) {
          isUnique = true;
        } else {
          generatedName = `${generatedName} ${Math.floor(Math.random() * 1000)}`;
          isUnique = true;
        }
        attempts++;
      }

      setTempName(generatedName);
      setAnimKey(prev => prev + 1);
    } catch (e) {
      setTempName(`user${Math.floor(Math.random() * 10000)}`);
      setAnimKey(prev => prev + 1);
    }
  };

  const handleEnterChat = () => {
    let desiredName = tempName.trim();
    if (desiredName) {
      const alreadyUsed = messages.some(msg => 
        msg.senderName?.toLowerCase() === desiredName.toLowerCase() && 
        msg.sender?._id !== user?._id
      );

      if (alreadyUsed) {
        desiredName = `${desiredName} ${Math.floor(Math.random() * 1000)}`;
      }

      setUsername(desiredName);
      localStorage.setItem('chatUsername', desiredName);
      setHasEntered(true);
    }
  };

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isSuccess && hasEntered) {
      setTimeout(() => scrollToBottom('auto'), 50);
    }
  }, [isSuccess, hasEntered]);

  useEffect(() => {
    // Only connect socket if token exists
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn("No token found, socket connection skipped");
      return;
    }

    const socketUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');
    console.log("Connecting to socket:", socketUrl);
    
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      auth: {
        token: token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    })

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    })

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    })

    socketRef.current.on('message', (newMessage) => {
      queryClient.setQueryData(['chatMessages'], (oldMessages = []) => [...oldMessages, newMessage]);
      if (hasEntered) {
        setTimeout(() => scrollToBottom('smooth'), 50);
      }
    })

    socketRef.current.on('messageDeleted', (deletedId) => {
      queryClient.setQueryData(['chatMessages'], (old = []) => old.filter((m) => m._id !== deletedId));
    });

    socketRef.current.on('onlineUsers', (users) => {
      console.log('Online users:', users);
      setOnlineCount(users.length)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [hasEntered])


  const handleSend = () => {
    if (isSending) return;
    if (!socketRef.current) {
      toast.error('Not connected to chat server yet. Please wait...');
      return;
    }
    if (input.trim()) {
      setIsSending(true);
      socketRef.current.emit('sendMessage', { 
        content: input, 
        senderName: username,
        replyTo: replyingTo?.id || null 
      });
      setInput('');
      setReplyingTo(null);
      // Reset sending state after a short delay to prevent rapid double-sends
      setTimeout(() => setIsSending(false), 500);
    }
  };

  const handleConfirmAction = async () => {
    const { action, targetId, targetSenderId } = confirmAction;
    try {
      if (action === 'delete') {
        await api.delete(`/messages/${targetId}`, { withCredentials: true });
        queryClient.setQueryData(['chatMessages'], (old = []) => old.filter(m => m._id !== targetId));
        toast.success('Message deleted');
      } else if (action === 'suspend') {
        await api.post(`/messages/${targetId}/suspend`, {}, { withCredentials: true });
        toast.success('User suspended for 14 days');
      } else if (action === 'ban') {
        await api.post(`/messages/${targetId}/ban`, {}, { withCredentials: true });
        toast.success('User permanently banned');
      } else if (action === 'mod') {
        await api.post(`/messages/${targetId}/promote-moderator`, {}, { withCredentials: true });
        toast.success('User promoted to moderator');
        queryClient.setQueryData(['chatMessages'], (old = []) => old.map(m =>
          ((m.sender?._id || m.sender) === targetSenderId)
            ? { ...m, sender: { ...m.sender, role: 'moderator' } }
            : m
        ));
      } else if (action === 'remove_mod') {
        await api.post(`/messages/${targetId}/demote-moderator`, {}, { withCredentials: true });
        toast.success('Moderator role removed');
        queryClient.setQueryData(['chatMessages'], (old = []) => old.map(m =>
          ((m.sender?._id || m.sender) === targetSenderId)
            ? { ...m, sender: { ...m.sender, role: 'user' } }
            : m
        ));
      } else if (action === 'report') {
        await api.post(`/messages/${targetId}/report`, {}, { withCredentials: true });
        toast.success('Message reported to moderators');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Action failed');
    }
    setConfirmAction((prev) => ({ ...prev, isOpen: false }));
    setActiveMessageId(null);
  };

  const openConfirm = (action, targetId, title, message, confirmText, confirmColor = 'bg-red-500', targetSenderId = null) => {
    setConfirmAction({ isOpen: true, action, targetId, targetSenderId, title, message, confirmText, confirmColor });
  };

  const getActionTitle = (type) => {
    switch (type) {
      case 'delete': return 'Delete Message';
      case 'suspend': return 'Suspend User';
      case 'mod': return 'Make Moderator';
      case 'remove_mod': return 'Remove Moderator Role';
      case 'ban': return 'Ban User';
      case 'report': return 'Report Message';
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
      case 'report': return 'Are you sure you want to report this message? Moderators will be notified.';
      default: return 'Are you sure you want to proceed?';
    }
  };

  const openConfirmModal = (actionType, messageId, senderId) => {
    const title = getActionTitle(actionType);
    const message = getActionMessage(actionType);
    const confirmText = actionType === 'delete' ? 'Delete' : actionType === 'suspend' ? 'Suspend' : actionType === 'ban' ? 'Ban User' : 'Confirm';
    const confirmColor = actionType === 'delete' ? 'bg-red-500' : actionType === 'suspend' ? 'bg-accent-amber' : 'bg-primary';

    setConfirmAction({ isOpen: true, action: actionType, targetId: messageId, targetSenderId: senderId, title, message, confirmText, confirmColor });
  };

  // Helper to check if current message is from the same sender as previous
  const isSameSenderAsPrev = (index) => {
    if (index === 0) return false;
    const prevMsg = messages[index - 1];
    const currMsg = messages[index];
    const prevSenderId = prevMsg.sender?._id || (typeof prevMsg.sender === 'string' ? prevMsg.sender : null);
    const currSenderId = currMsg.sender?._id || (typeof currMsg.sender === 'string' ? currMsg.sender : null);
    return prevSenderId && currSenderId && prevSenderId === currSenderId;
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      {!hasEntered && (
        <div className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center p-6 text-center h-[100dvh] overflow-hidden overscroll-none touch-none">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl mb-6">👻</div>
          <h1 className="text-2xl font-bold text-text mb-2 font-syne">Enter Campus Chat</h1>
          <p className="text-sm text-text3 mb-8 max-w-[260px]">Choose an anonymous identity to join the conversation.</p>
          
          <div className="w-full max-w-xs flex flex-col gap-4">
            <motion.div
              key={animKey}
              initial={animKey === 0 ? false : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <input 
                type="text" 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)} 
                placeholder="sleepy panda" 
                className="w-full bg-bg2 border border-border focus:border-primary/50 transition-colors rounded-xl px-4 py-3.5 text-sm text-text outline-none text-center font-medium" 
              />
            </motion.div>
            <button 
              onClick={handleGenerateName} 
              className="text-primary-mid text-[11px] font-bold uppercase tracking-wider mb-2 hover:underline opacity-80"
            >
              Generate Random Name ✨
            </button>
            <button 
              onClick={handleEnterChat} 
              disabled={!tempName.trim()} 
              className="w-full bg-primary text-white font-semibold rounded-xl py-3.5 disabled:opacity-50 transition-opacity mt-2"
            >
              Join Chat
            </button>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
        <div>
          <div className="text-sm font-semibold text-text font-syne">Campus chat</div>
          <div className="text-xs text-text3 mt-0.5">All colleges · anonymous</div>
        </div>
        <div className="flex items-center gap-1 bg-opacity-10 bg-accent-teal border border-opacity-20 border-accent-teal rounded-full px-2.5 py-1.5">
          <div className="w-1 h-1 rounded-full bg-accent-teal animate-pulse"></div>
          <span className="text-xs text-accent-teal font-medium">{onlineCount} online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col scrollbar-hide bg-bg pt-16 pb-20">
        <div className="flex items-center gap-2 my-1.5">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-text3 px-2">Today</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {messages.map((msg, index) => {
          const senderId = msg.sender?._id || (typeof msg.sender === 'string' ? msg.sender : null);
          const senderName = msg.sender?.name;
          const senderRole = msg.sender?.role;
          const isOwnMessage = senderId === user?._id;
          const sameSender = isSameSenderAsPrev(index);

          return (
          <div key={msg._id} className={`flex ${isOwnMessage ? 'flex-row-reverse' : ''} ${sameSender ? 'mt-0.5' : 'mt-2.5'}`}>
            {/* Avatar — hide for consecutive same-sender messages */}
            {sameSender ? (
              <div className="w-7 flex-shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-opacity-25 bg-primary flex items-center justify-center text-[10px] font-bold text-primary-mid flex-shrink-0 font-syne">
                {isOwnMessage ? 'ME' : senderName?.substring(0, 2).toUpperCase() || 'U'}
              </div>
            )}
            <div className={`flex flex-col relative ${isOwnMessage ? 'items-end mr-1.5' : 'items-start ml-1.5'} ${isOwnMessage ? 'max-w-[75%]' : 'max-w-[75%]'}`}>
              {/* Name/meta — hide for consecutive same-sender messages */}
              {!sameSender && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`text-xs font-medium text-text2 ${user?.role === 'admin' ? 'hover:text-primary-mid cursor-pointer' : ''}`}
                    onClick={() => user?.role === 'admin' && senderId && onNavClick(`profile/${senderId}`)}
                  >
                    {msg.senderName && msg.senderName !== 'Anonymous' ? msg.senderName : (isOwnMessage ? (username || 'you') : 'Anonymous')}
                  </span>
                  {(senderRole === 'admin' || senderRole === 'moderator') && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md border border-opacity-30 uppercase font-bold tracking-wide
                      ${senderRole === 'admin' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-blue-500 bg-blue-500/10 text-blue-400'}`}
                    >
                      {senderRole}
                    </span>
                  )}
                  <span className="text-xs text-text3">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  <button
                    onClick={() => setActiveMessageId(activeMessageId === msg._id ? null : msg._id)}
                    className="text-text3 text-xs ml-1 px-1 hover:text-text transition-colors"
                  >
                    •••
                  </button>
                </div>
              )}
              <div className={`text-xs px-3 py-2 rounded-2xl ${isOwnMessage ? 'bg-opacity-15 bg-primary border border-opacity-30 border-primary text-text rounded-tr-md' : 'bg-bg2 border border-border text-text rounded-tl-md'}`}>
                {msg.replyTo && (
                  <div className="mb-1.5 p-2 rounded-lg bg-bg/50 border-l-2 border-primary/50 text-[11px] opacity-80">
                    <div className="font-semibold text-primary-mid mb-0.5">
                      {msg.replyTo.senderName || 'Anonymous'}
                    </div>
                    <div className="truncate text-text3 line-clamp-1">
                      {msg.replyTo.content?.includes('attendance') ? 'Attendance Flex Stats' : msg.replyTo.content}
                    </div>
                  </div>
                )}
                {(() => {
                  if (msg.content?.includes('attendance') || msg.content?.includes('Attendance') || msg.content?.includes('[ATTENDANCE_FLEX]')) {
                    let cleanContent = msg.content;
                    let displayStats = "Stats shared";

                    if (cleanContent.includes('[ATTENDANCE_FLEX]')) {
                      const [textPart, jsonPart] = cleanContent.split('[ATTENDANCE_FLEX]');
                      cleanContent = textPart.trim();
                      try {
                        const flexData = JSON.parse(jsonPart || '{}');
                        if (typeof flexData.percent === 'number') {
                          displayStats = `${flexData.subject || 'Attendance'}: ${flexData.percent}%`;
                        }
                      } catch {
                        // Fallback to regex parsing below
                      }
                    }

                    if (displayStats === 'Stats shared') {
                      const percentMatch = cleanContent.match(/(\d{1,3})%/);
                      if (percentMatch) {
                        displayStats = `Attendance: ${percentMatch[1]}%`;
                      }
                    }

                    return (
                      <div>
                        <div className="mb-1.5">{cleanContent}</div>
                        <div className="relative overflow-hidden rounded-xl border border-emerald-500/15 bg-gradient-to-br from-[#1a1830] to-[#0E0D14] p-2.5 mt-1">
                          <div className="absolute -top-4 -right-4 w-14 h-14 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                          <div className="relative z-10 flex items-center gap-2">
                            <div>
                              <span className="text-[9px] text-text3 uppercase tracking-wider font-medium block">Attendance Flex</span>
                              <span className="text-[10px] text-emerald-400 font-semibold">{displayStats}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return msg.content;
                })()}
              </div>

              {/* Moderation Dropdown */}
              {activeMessageId === msg._id && (
                <div className="absolute top-6 left-0 z-50 bg-bg2 border border-border rounded-xl shadow-lg p-1 w-40 flex flex-col gap-1">
                   <button 
                     onClick={() => {
                       setActiveMessageId(null);
                       setReplyingTo({
                         id: msg._id,
                         senderName: msg.senderName && msg.senderName !== 'Anonymous' ? msg.senderName : (isOwnMessage ? (username || 'you') : 'Anonymous'),
                         content: msg.content
                       });
                       inputRef.current?.focus();
                     }}
                     className="text-left px-3 py-2 text-xs font-medium text-text hover:bg-hover rounded-lg transition-colors"
                   >
                     Reply
                   </button>
                   {!isOwnMessage && (
                     <button 
                       onClick={() => {
                         setActiveMessageId(null);
                         openConfirm('report', msg._id, "Report Message", "Are you sure you want to report this message?", "Report", 'bg-red-500', senderId);
                       }}
                       className="text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                     >
                       Report Message
                     </button>
                   )}
                   {(isOwnMessage || (user?.role === 'admin' || user?.role === 'moderator')) && (
                     <button 
                       onClick={() => {
                         setActiveMessageId(null);
                         openConfirm('delete', msg._id, "Delete Message", "Are you sure you want to delete this message?", "Delete", 'bg-red-500', senderId);
                       }}
                       className="text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                     >
                       Delete Message
                     </button>
                   )}
                   {!isOwnMessage && senderId && (user?.role === 'admin' || user?.role === 'moderator') && (
                     <button 
                       onClick={() => {
                         setActiveMessageId(null);
                         openConfirm('suspend', msg._id, "Suspend User", "Are you sure you want to suspend this user for 14 days?", "Suspend", 'bg-accent-amber', senderId);
                       }}
                       className="text-left px-3 py-2 text-xs font-medium text-accent-amber hover:bg-accent-amber/10 rounded-lg transition-colors cursor-pointer"
                     >
                       Suspend (14 days)
                     </button>
                   )}
                   {!isOwnMessage && senderId && user?.role === 'admin' && senderRole !== 'admin' && (
                     <>
                       {senderRole !== 'moderator' ? (
                         <button 
                           onClick={() => {
                             setActiveMessageId(null);
                             openConfirmModal('mod', msg._id, senderId);
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
                             openConfirmModal('remove_mod', msg._id, senderId);
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
                         onClick={() => {
                           setActiveMessageId(null);
                           openConfirm('ban', msg._id, "Ban User", "Are you sure you want to permanently ban this user?", "Ban User", 'bg-red-500', senderId);
                         }}
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
        )})}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 bg-bg border-t border-border px-3.5 py-2 flex-shrink-0">
        {replyingTo && (
          <div className="flex items-center justify-between bg-bg2 border border-border2 rounded-t-2xl px-4 py-2.5 mb-[-10px] pb-4 shadow-lg shadow-black/10">
            <div className="flex flex-col overflow-hidden border-l-2 border-primary pl-2">
              <span className="text-[10px] text-primary-mid font-semibold tracking-wide">Replying to {replyingTo.senderName}</span>
              <span className="text-xs text-text3 truncate max-w-[250px] mt-0.5">{replyingTo.content?.includes('attendance') ? 'Attendance Flex Stats' : replyingTo.content}</span>
            </div>
            <button onClick={() => setReplyingTo(null)} className="text-text3 hover:text-white bg-bg3/50 hover:bg-bg3 p-1.5 rounded-full transition-colors ml-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
        <div className={`bg-bg2 border border-border2 rounded-3xl px-3 py-2.5 flex items-end gap-2.5 relative z-10 ${replyingTo ? 'rounded-tl-none rounded-tr-none' : ''}`}>
          <div className="w-6.5 h-6.5 rounded-full bg-opacity-30 bg-primary flex items-center justify-center text-[10px] font-bold text-primary-mid flex-shrink-0 font-syne">ME</div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) handleSend();
              }
            }}
            placeholder="Message anonymously..."
            className="flex-1 bg-transparent border-none text-xs text-text placeholder-text3 outline-none resize-none min-h-5 max-h-20 font-dm"
            rows="1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors disabled:opacity-35 disabled:cursor-not-allowed flex-shrink-0"
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
