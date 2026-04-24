import { useState, useRef, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import ChatMessageItem from '../components/ChatMessageItem';
import ChatInput from '../components/ChatInput';
import { io } from 'socket.io-client';
import api from '../context/api.js';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ChatScreen = ({ onNavClick }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Expose onNavClick globally so ChatMessageItem can use it for admin profile nav
  useEffect(() => { window._navClick = onNavClick; }, [onNavClick]);

  const { data: messages = [], isSuccess } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      const res = await api.get('/messages', { withCredentials: true });
      return res.data.data.reverse();
    },
    staleTime: Infinity,
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
  const [confirmAction, setConfirmAction] = useState({
    isOpen: false, action: null, targetId: null, targetSenderId: null,
    title: '', message: '', confirmText: '', confirmColor: 'bg-red-500',
  });

  useEffect(() => {
    const saved = localStorage.getItem('chatUsername');
    if (saved) { setUsername(saved); setHasEntered(true); }
  }, []);

  const handleGenerateName = () => {
    const animals = ['panda', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'eagle', 'hawk', 'koala', 'dolphin'];
    const adjectives = ['mysterious', 'bold', 'sleepy', 'happy', 'clever', 'fast', 'brave', 'quiet'];
    let name = '';
    for (let i = 0; i < 10; i++) {
      const n = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`;
      const used = messages.some(m => m.senderName?.toLowerCase() === n);
      name = used ? `${n} ${Math.floor(Math.random() * 1000)}` : n;
      if (!used) break;
    }
    setTempName(name || `user${Math.floor(Math.random() * 9999)}`);
    setAnimKey(k => k + 1);
  };

  const handleEnterChat = () => {
    let name = tempName.trim();
    if (!name) return;
    const taken = messages.some(m => m.senderName?.toLowerCase() === name.toLowerCase() && m.sender?._id !== user?._id);
    if (taken) name = `${name} ${Math.floor(Math.random() * 1000)}`;
    setUsername(name);
    localStorage.setItem('chatUsername', name);
    setHasEntered(true);
  };

  const scrollToBottom = (behavior = 'smooth') =>
    messagesEndRef.current?.scrollIntoView({ behavior });

  useEffect(() => {
    if (isSuccess && hasEntered) setTimeout(() => scrollToBottom('auto'), 50);
  }, [isSuccess, hasEntered]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socketUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => console.log('Socket connected:', socketRef.current.id));
    socketRef.current.on('connect_error', err => console.error('Socket error:', err));

    socketRef.current.on('message', (msg) => {
      queryClient.setQueryData(['chatMessages'], (old = []) => [...old, msg]);
      if (hasEntered) setTimeout(() => scrollToBottom('smooth'), 50);
    });

    socketRef.current.on('messageDeleted', (id) => {
      queryClient.setQueryData(['chatMessages'], (old = []) => old.filter(m => m._id !== id));
    });

    socketRef.current.on('onlineUsers', (users) => setOnlineCount(users.length));

    return () => socketRef.current?.disconnect();
  }, [user, hasEntered]);

  const handleSend = () => {
    if (isSending || !socketRef.current || !input.trim()) return;
    setIsSending(true);
    socketRef.current.emit('sendMessage', {
      content: input,
      senderName: username,
      replyTo: replyingTo?.id || null,
    });
    setInput('');
    setReplyingTo(null);
    setTimeout(() => setIsSending(false), 500);
  };

  const openConfirm = (action, targetId, title, message, confirmText, confirmColor = 'bg-red-500', targetSenderId = null) =>
    setConfirmAction({ isOpen: true, action, targetId, targetSenderId, title, message, confirmText, confirmColor });

  const openConfirmModal = (actionType, messageId, senderId) => {
    const labels = {
      delete: ['Delete Message', 'Delete this message?', 'Delete', 'bg-red-500'],
      suspend: ['Suspend User', 'Suspend for 14 days?', 'Suspend', 'bg-accent-amber'],
      mod: ['Make Moderator', 'Promote to Moderator?', 'Confirm', 'bg-primary'],
      remove_mod: ['Remove Moderator', 'Remove moderator privileges?', 'Confirm', 'bg-primary'],
      ban: ['Ban User', 'Permanently ban this user?', 'Ban User', 'bg-red-500'],
      report: ['Report Message', 'Report this message?', 'Report', 'bg-red-500'],
    };
    const [title, message, confirmText, confirmColor] = labels[actionType] || ['Confirm', 'Proceed?', 'Confirm', 'bg-primary'];
    setConfirmAction({ isOpen: true, action: actionType, targetId: messageId, targetSenderId: senderId, title, message, confirmText, confirmColor });
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
          (m.sender?._id || m.sender)?.toString() === targetSenderId
            ? { ...m, sender: { ...m.sender, role: 'moderator' } }
            : m
        ));
      } else if (action === 'remove_mod') {
        await api.post(`/messages/${targetId}/demote-moderator`, {}, { withCredentials: true });
        toast.success('Moderator role removed');
        queryClient.setQueryData(['chatMessages'], (old = []) => old.map(m =>
          (m.sender?._id || m.sender)?.toString() === targetSenderId
            ? { ...m, sender: { ...m.sender, role: 'user' } }
            : m
        ));
      } else if (action === 'report') {
        await api.post(`/messages/${targetId}/report`, {}, { withCredentials: true });
        toast.success('Message reported');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed');
    }
    setConfirmAction(p => ({ ...p, isOpen: false }));
    setActiveMessageId(null);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      {/* Anonymous name entry gate */}
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
                onChange={e => setTempName(e.target.value)}
                placeholder="sleepy panda"
                className="w-full bg-bg2 border border-border focus:border-primary/50 transition-colors rounded-xl px-4 py-3.5 text-sm text-text outline-none text-center font-medium"
              />
            </motion.div>
            <button onClick={handleGenerateName} className="text-primary-mid text-[11px] font-bold uppercase tracking-wider mb-2 hover:underline opacity-80">
              Generate Random Name ✨
            </button>
            <button onClick={handleEnterChat} disabled={!tempName.trim()} className="w-full bg-primary text-white font-semibold rounded-xl py-3.5 disabled:opacity-50 transition-opacity mt-2">
              Join Chat
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
        <div>
          <div className="text-sm font-semibold text-text font-syne">Campus chat</div>
          <div className="text-xs text-text3 mt-0.5">All colleges · anonymous</div>
        </div>
        <div className="flex items-center gap-1 bg-opacity-10 bg-accent-teal border border-opacity-20 border-accent-teal rounded-full px-2.5 py-1.5">
          <div className="w-1 h-1 rounded-full bg-accent-teal animate-pulse" />
          <span className="text-xs text-accent-teal font-medium">{onlineCount} online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col scrollbar-hide bg-bg pt-16 pb-20">
        <div className="flex items-center gap-2 my-1.5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text3 px-2">Today</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {messages.map((msg, index) => (
          <ChatMessageItem
            key={msg._id}
            msg={msg}
            index={index}
            messages={messages}
            username={username}
            currentUserId={user?._id?.toString() || ''}
            activeMessageId={activeMessageId}
            setActiveMessageId={setActiveMessageId}
            setReplyingTo={setReplyingTo}
            openConfirm={openConfirm}
            openConfirmModal={openConfirmModal}
            inputRef={inputRef}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <ChatInput
        input={input}
        setInput={setInput}
        isSending={isSending}
        handleSend={handleSend}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        inputRef={inputRef}
      />

      <ConfirmModal
        isOpen={confirmAction.isOpen}
        onClose={() => { setConfirmAction(p => ({ ...p, isOpen: false })); setActiveMessageId(null); }}
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
