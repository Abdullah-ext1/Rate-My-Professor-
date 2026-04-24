const ChatInput = ({ input, setInput, isSending, handleSend, replyingTo, setReplyingTo, inputRef }) => (
  <div className="fixed bottom-16 left-0 right-0 z-30 bg-bg border-t border-border px-3.5 py-2 flex-shrink-0">
    {replyingTo && (
      <div className="flex items-center justify-between bg-bg2 border border-border2 rounded-t-2xl px-4 py-2.5 mb-[-10px] pb-4 shadow-lg shadow-black/10">
        <div className="flex flex-col overflow-hidden border-l-2 border-primary pl-2">
          <span className="text-[10px] text-primary-mid font-semibold tracking-wide">
            Replying to {replyingTo.senderName}
          </span>
          <span className="text-xs text-text3 truncate max-w-[250px] mt-0.5">
            {replyingTo.content?.includes('attendance') ? 'Attendance Flex Stats' : replyingTo.content}
          </span>
        </div>
        <button
          onClick={() => setReplyingTo(null)}
          className="text-text3 hover:text-white bg-bg3/50 hover:bg-bg3 p-1.5 rounded-full transition-colors ml-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    )}

    <div className={`bg-bg2 border border-border2 rounded-3xl px-3 py-2.5 flex items-end gap-2.5 relative z-10 ${replyingTo ? 'rounded-tl-none rounded-tr-none' : ''}`}>
      <div className="w-6.5 h-6.5 rounded-full bg-opacity-30 bg-primary flex items-center justify-center text-[10px] font-bold text-primary-mid flex-shrink-0 font-syne">
        ME
      </div>
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
);

export default ChatInput;
