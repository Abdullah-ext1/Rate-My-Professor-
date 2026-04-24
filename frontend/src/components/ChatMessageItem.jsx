import { useAuth } from '../context/AuthContext';

const AttendanceFlex = ({ content }) => {
  let cleanContent = content;
  let displayStats = 'Stats shared';

  if (cleanContent.includes('[ATTENDANCE_FLEX]')) {
    const [textPart, jsonPart] = cleanContent.split('[ATTENDANCE_FLEX]');
    cleanContent = textPart.trim();
    try {
      const flexData = JSON.parse(jsonPart || '{}');
      if (typeof flexData.percent === 'number') {
        displayStats = `${flexData.subject || 'Attendance'}: ${flexData.percent}%`;
      }
    } catch { /* fallback below */ }
  }

  if (displayStats === 'Stats shared') {
    const m = cleanContent.match(/(\d{1,3})%/);
    if (m) displayStats = `Attendance: ${m[1]}%`;
  }

  return (
    <div>
      <div className="mb-1.5">{cleanContent}</div>
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/15 bg-gradient-to-br from-[#1a1830] to-[#0E0D14] p-2.5 mt-1">
        <div className="absolute -top-4 -right-4 w-14 h-14 bg-primary/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[9px] text-text3 uppercase tracking-wider font-medium block">Attendance Flex</span>
          <span className="text-[10px] text-emerald-400 font-semibold">{displayStats}</span>
        </div>
      </div>
    </div>
  );
};

const ChatMessageItem = ({
  msg,
  index,
  messages,
  username,
  currentUserId,        // ← passed from ChatScreen as user._id.toString()
  activeMessageId,
  setActiveMessageId,
  setReplyingTo,
  openConfirm,
  openConfirmModal,
  inputRef,
}) => {
  const { user } = useAuth(); // only needed for role-based UI (admin/mod actions)

  // Resolve sender ID as string — safe against ObjectId vs string mismatch
  const senderId = msg.sender?._id
    ? String(msg.sender._id)
    : typeof msg.sender === 'string'
    ? msg.sender
    : null;

  const senderName = msg.sender?.name;
  const senderRole = msg.sender?.role;

  // College name — stored directly on the message document (msg.college is populated)
  const senderCollege = msg.college?.name;

  // ✅ Reliable: compare explicit string prop passed from parent
  const isOwnMessage = !!(currentUserId && senderId && currentUserId === senderId);

  const isSameSenderAsPrev = () => {
    if (index === 0) return false;
    const prev = messages[index - 1];
    const prevId = prev.sender?._id
      ? String(prev.sender._id)
      : typeof prev.sender === 'string'
      ? prev.sender
      : null;
    return prevId && senderId && prevId === senderId;
  };
  const sameSender = isSameSenderAsPrev();

  const isAttendance =
    msg.content?.includes('attendance') ||
    msg.content?.includes('Attendance') ||
    msg.content?.includes('[ATTENDANCE_FLEX]');

  const replyPreview = msg.replyTo?.content?.includes('attendance')
    ? 'Attendance Flex Stats'
    : msg.replyTo?.content;

  return (
    <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : ''} ${sameSender ? 'mt-0.5' : 'mt-2.5'}`}>
      {/* Avatar */}
      {sameSender ? (
        <div className="w-7 flex-shrink-0" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-opacity-25 bg-primary flex items-center justify-center text-[10px] font-bold text-primary-mid flex-shrink-0 font-syne">
          {isOwnMessage ? 'ME' : senderName?.substring(0, 2).toUpperCase() || 'U'}
        </div>
      )}

      {/* Bubble container */}
      <div className={`flex flex-col relative ${isOwnMessage ? 'items-end mr-1.5' : 'items-start ml-1.5'} max-w-[75%]`}>

        {/* Name / meta row */}
        {!sameSender && (
          <div className={`flex items-center gap-1.5 mb-0.5 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
            <span
              className={`text-xs font-medium text-text2 ${user?.role === 'admin' ? 'hover:text-primary-mid cursor-pointer' : ''}`}
              onClick={() => user?.role === 'admin' && senderId && window._navClick?.(`profile/${senderId}`)}
            >
              {msg.senderName && msg.senderName !== 'Anonymous'
                ? msg.senderName
                : isOwnMessage
                ? username || 'you'
                : 'Anonymous'}
            </span>

            {/* College tag — replaces admin/moderator role badge */}
            {senderCollege && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary-mid font-medium truncate max-w-[80px]">
                {senderCollege}
              </span>
            )}

            <span className="text-xs text-text3">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              onClick={() => setActiveMessageId(activeMessageId === msg._id ? null : msg._id)}
              className="text-text3 text-xs ml-1 px-1 hover:text-text transition-colors"
            >
              •••
            </button>
          </div>
        )}

        {/* Bubble */}
        <div className={`text-xs px-3 py-2 rounded-2xl ${
          isOwnMessage
            ? 'bg-primary/15 border border-primary/30 text-text rounded-tr-md'
            : 'bg-bg2 border border-border text-text rounded-tl-md'
        }`}>
          {/* Reply quote */}
          {msg.replyTo && (
            <div className="mb-1.5 p-2 rounded-lg bg-bg/50 border-l-2 border-primary/50 text-[11px] opacity-80">
              <div className="font-semibold text-primary-mid mb-0.5">
                {msg.replyTo.senderName || 'Anonymous'}
              </div>
              <div className="truncate text-text3 line-clamp-1">{replyPreview}</div>
            </div>
          )}

          {/* Content */}
          {isAttendance ? <AttendanceFlex content={msg.content} /> : msg.content}
        </div>

        {/* Moderation dropdown */}
        {activeMessageId === msg._id && (
          <div className={`absolute top-6 ${isOwnMessage ? 'right-0' : 'left-0'} z-50 bg-bg2 border border-border rounded-xl shadow-lg p-1 w-44 flex flex-col gap-1`}>
            <button
              onClick={() => {
                setActiveMessageId(null);
                setReplyingTo({
                  id: msg._id,
                  senderName: msg.senderName && msg.senderName !== 'Anonymous'
                    ? msg.senderName
                    : isOwnMessage ? (username || 'you') : 'Anonymous',
                  content: msg.content,
                });
                inputRef.current?.focus();
              }}
              className="text-left px-3 py-2 text-xs font-medium text-text hover:bg-hover rounded-lg transition-colors"
            >
              Reply
            </button>

            {!isOwnMessage && (
              <button
                onClick={() => { setActiveMessageId(null); openConfirm('report', msg._id, 'Report Message', 'Report this message?', 'Report', 'bg-red-500', senderId); }}
                className="text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Report Message
              </button>
            )}

            {(isOwnMessage || user?.role === 'admin' || user?.role === 'moderator') && (
              <button
                onClick={() => { setActiveMessageId(null); openConfirm('delete', msg._id, 'Delete Message', 'Delete this message?', 'Delete', 'bg-red-500', senderId); }}
                className="text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Delete Message
              </button>
            )}

            {!isOwnMessage && senderId && (user?.role === 'admin' || user?.role === 'moderator') && (
              <button
                onClick={() => { setActiveMessageId(null); openConfirm('suspend', msg._id, 'Suspend User', 'Suspend for 14 days?', 'Suspend', 'bg-accent-amber', senderId); }}
                className="text-left px-3 py-2 text-xs font-medium text-accent-amber hover:bg-accent-amber/10 rounded-lg transition-colors"
              >
                Suspend (14 days)
              </button>
            )}

            {!isOwnMessage && senderId && user?.role === 'admin' && senderRole !== 'admin' && (
              <>
                {senderRole !== 'moderator' ? (
                  <button
                    onClick={() => { setActiveMessageId(null); openConfirmModal('mod', msg._id, senderId); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-blue-400 hover:bg-hover transition-colors flex items-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Make Moderator
                  </button>
                ) : (
                  <button
                    onClick={() => { setActiveMessageId(null); openConfirmModal('remove_mod', msg._id, senderId); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-orange-400 hover:bg-hover transition-colors flex items-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    Remove Moderator
                  </button>
                )}
                <button
                  onClick={() => { setActiveMessageId(null); openConfirm('ban', msg._id, 'Ban User', 'Permanently ban this user?', 'Ban User', 'bg-red-500', senderId); }}
                  className="text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Ban User
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
