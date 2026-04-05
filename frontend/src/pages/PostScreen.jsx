import React, { useState, useRef } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const PostScreen = ({ onNavClick, postData }) => {
  const [liked, setLiked] = useState(postData?.isLiked || false);
  const [likeCount, setLikeCount] = useState(postData?.likes || 47);
  
  // Mock user role setup
  const currentUserRole = 'admin'; // Testing admin logic

  // Comment functionality state
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const inputRef = useRef(null);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Anonymous unicorn',
      avatar: '🦄',
      bgColor: 'bg-accent-teal',
      time: '10m',
      content: "Bro just solve the last 3 years PYQs. He repeats at least 60% of the questions. Don't waste time on notes.",
      likes: 24,
      replies: [
        {
          id: 2,
          author: 'Anonymous panda',
          isOp: true,
          avatar: '👻',
          bgColor: 'bg-red-500',
          time: '5m',
          content: "Where can I find the updated PYQs? The library app is down right now",
          likes: 5
        }
      ]
    },
    {
      id: 3,
      author: 'Anonymous lion',
      avatar: '🦁',
      bgColor: 'bg-accent-amber',
      time: '12m',
      content: 'OS is cooked bro 🙏 GL spreading to you',
      likes: 10,
      replies: []
    }
  ]);

  const handleReplyClick = (commentId, authorName) => {
    setReplyingTo({ id: commentId, name: authorName });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: 'Anonymous you',
      isMe: true,
      avatar: '🙋',
      bgColor: 'bg-primary',
      time: 'Just now',
      content: commentText.trim(),
      likes: 0,
      replies: []
    };

    if (replyingTo) {
      setComments(comments.map(c => {
        if (c.id === replyingTo.id) {
          return { ...c, replies: [...c.replies, newComment] };
        }
        return c;
      }));
      setReplyingTo(null);
    } else {
      setComments([...comments, newComment]);
    }
    
    setCommentText('');
  };

  const toggleCommentLike = (commentId) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.isLiked;
        return { ...c, isLiked, likes: isLiked ? c.likes + 1 : c.likes - 1 };
      }
      return c;
    }));
  };

  const toggleReplyLike = (commentId, replyId) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === replyId) {
              const isLiked = !r.isLiked;
              return { ...r, isLiked, likes: isLiked ? r.likes + 1 : r.likes - 1 };
            }
            return r;
          })
        };
      }
      return c;
    }));
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: window.location.href, title: 'Check out this post' }).catch(err => console.log('Share failed', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, type: '', commentId: null, replyId: null });

  const handleDeleteReply = (commentId, replyId) => {
    setDeleteConfig({ isOpen: true, type: 'reply', commentId, replyId });
  };

  const handleDeleteComment = (commentId) => {
    setDeleteConfig({ isOpen: true, type: 'comment', commentId, replyId: null });
  };

  const handleDeletePost = () => {
    setDeleteConfig({ isOpen: true, type: 'post', commentId: null, replyId: null });
  };

  const confirmDelete = () => {
    if (deleteConfig.type === 'reply') {
      setComments(comments.map(c => {
        if (c.id === deleteConfig.commentId) {
          return { ...c, replies: c.replies.filter(r => r.id !== deleteConfig.replyId) };
        }
        return c;
      }));
    } else if (deleteConfig.type === 'comment') {
      setComments(comments.filter(c => c.id !== deleteConfig.commentId));
    } else if (deleteConfig.type === 'post') {
      onNavClick('feed');
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative min-h-full">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-bg border-b border-border z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavClick('feed')} className="text-text3 hover:text-text transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-text">Post</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pt-14 pb-24 scrollbar-hide bg-bg">
        {/* Main Post Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-opacity-15 bg-red-500 flex items-center justify-center text-sm flex-shrink-0">👻</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text">Anonymous panda</span>
              <span className="text-xs text-text3">14m ago</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-2xl bg-opacity-15 bg-red-500 border border-opacity-20 border-red-500 text-red-400 font-medium ml-2">confession</span>
          </div>

          {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
            <button 
              onClick={handleDeletePost} 
              className="p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              title="Delete Post"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>

        {/* Post Content */}
        <h1 className="text-lg font-bold text-text mb-2 tracking-tight">I think I am going to fail OS</h1>
        <p className="text-sm leading-relaxed text-text mt-2 mb-4">
          I have 61% attendance in OS and the exam is in 3 weeks. I have attended 0 classes this month. I am not okay. 
          The professor hasn't uploaded any notes and I heard the previous year papers were extremely tough. Has anyone passed his class by just studying the night before?
        </p>

        {/* Action Bar */}
        <div className="flex items-center justify-start flex-wrap gap-2 py-3 border-border mb-4">
          {/* Like Pill */}
          <button onClick={toggleLike} className="flex items-center gap-2 bg-bg2 hover:bg-bg3 border border-border2 rounded-full px-4 h-[36px] transition-colors text-text">
            <svg viewBox="0 0 24 24" fill={liked ? '#ED93B1' : 'none'} stroke={liked ? '#ED93B1' : 'currentColor'} strokeWidth="2" width="18" height="18" className={liked ? 'text-red-400' : 'text-text3'}>
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-sm font-semibold">{likeCount}</span>
          </button>

          {/* Comments Pill */}
          <button className="flex items-center justify-center gap-2 bg-bg2 hover:bg-bg3 border border-border2 rounded-full px-4 h-[36px] transition-colors text-text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18" className="text-text">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">51</span>
          </button>

          {/* Share Pill */}
          <button onClick={handleShare} className="flex items-center justify-center gap-2 bg-bg2 hover:bg-bg3 border border-border2 rounded-full px-4 h-[36px] transition-colors text-text cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18" className="text-text">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-sm font-medium text-text">Share</span>
          </button>
        </div>

        {/* Join the conversation box */}
        <div onClick={() => inputRef.current?.focus()} className="border border-border2 rounded-full py-2 px-4 mb-4 flex items-center cursor-pointer hover:bg-bg2 transition-colors">
            <span className="text-text3 text-sm">Join the conversation</span>
        </div>

        {/* Comments Section */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-bold text-text mb-2 hidden">Comments</div>
          
          {comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-3">
              {/* Top-Level Comment */}
              <div className="flex gap-3">
                <div className={`w-7 h-7 rounded-full bg-opacity-20 ${comment.bgColor} flex items-center justify-center text-xs flex-shrink-0 mt-0.5`}>{comment.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-text2 flex items-center gap-1">
                      {comment.author} 
                      {comment.isOp && <span className="px-1 py-0.5 rounded-sm bg-primary bg-opacity-20 text-[10px] text-primary-mid scale-90">OP</span>}
                      {comment.isMe && <span className="px-1 py-0.5 rounded-sm bg-primary bg-opacity-20 text-[10px] text-primary-mid scale-90">ME</span>}
                    </span>
                    <span className="text-xs text-text3">{comment.time}</span>
                  </div>
                  <p className="text-sm text-text mb-2">{comment.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <div onClick={() => toggleCommentLike(comment.id)} className={`flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors ${comment.isLiked ? 'text-red-400' : 'text-text3 hover:text-white'}`}>
                      <svg viewBox="0 0 24 24" fill={comment.isLiked ? '#ED93B1' : 'none'} stroke={comment.isLiked ? '#ED93B1' : 'currentColor'} strokeWidth="2" width="14" height="14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{comment.likes}</span>
                    </div>
                    <span onClick={() => handleReplyClick(comment.id, comment.author)} className="text-xs font-medium text-text3 cursor-pointer hover:text-white flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-4-4 4-4M5 10h11a4 4 0 110 8h-1" />
                      </svg>
                      Reply
                    </span>
                    {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
                      <span onClick={() => handleDeleteComment(comment.id)} className="text-xs font-medium text-red-500/70 hover:text-red-500 cursor-pointer ml-auto">
                        Delete
                      </span>
                    )}
                  </div>                  {/* Replies (Nested) */}
                  {comment.replies && comment.replies.length > 0 && comment.replies.map((reply) => (
                    <div key={reply.id} className="mt-3 flex gap-3 border-l-2 border-border pl-3 pt-1">
                      <div className={`w-6 h-6 rounded-full bg-opacity-15 ${reply.bgColor} flex items-center justify-center text-xs flex-shrink-0 mt-0.5`}>{reply.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-text2 flex items-center gap-1">
                            {reply.author} 
                            {reply.isOp && <span className="px-1 py-0.5 rounded-sm bg-primary bg-opacity-20 text-[10px] text-primary-mid scale-90">OP</span>}
                            {reply.isMe && <span className="px-1 py-0.5 rounded-sm bg-primary bg-opacity-20 text-[10px] text-primary-mid scale-90">ME</span>}
                          </span>
                          <span className="text-xs text-text3">{reply.time}</span>
                        </div>
                        <p className="text-sm text-text mb-2">{reply.content}</p>
                          <div className="flex items-center gap-4">
                            <div onClick={() => toggleReplyLike(comment.id, reply.id)} className={`flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors ${reply.isLiked ? 'text-red-400' : 'text-text3 hover:text-white'}`}>
                              <svg viewBox="0 0 24 24" fill={reply.isLiked ? '#ED93B1' : 'none'} stroke={reply.isLiked ? '#ED93B1' : 'currentColor'} strokeWidth="2" width="14" height="14">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            <span>{reply.likes}</span>
                          </div>
                          {/* Allow replying to the main thread even from a nested reply */}
                          <span onClick={() => handleReplyClick(comment.id, reply.author)} className="text-xs font-medium text-text3 cursor-pointer hover:text-white flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-4-4 4-4M5 10h11a4 4 0 110 8h-1" />
                            </svg>
                            Reply
                          </span>
                          {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
                            <span onClick={() => handleDeleteReply(comment.id, reply.id)} className="text-xs font-medium text-red-500/70 hover:text-red-500 cursor-pointer ml-auto">
                              Delete
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Box Fixed at Bottom */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-bg border-t border-border px-3.5 py-2 flex-shrink-0 flex flex-col gap-1">
        {replyingTo && (
          <div className="flex items-center justify-between px-3 py-1 bg-opacity-10 bg-primary rounded-t-lg mx-1">
             <span className="text-xs text-primary-mid">Replying to <span className="font-semibold">{replyingTo.name}</span></span>
             <button onClick={handleCancelReply} className="text-xs text-text3 hover:text-white pb-0.5">✕</button>
          </div>
        )}
        <div className="bg-bg2 border border-border2 rounded-3xl px-3 py-2.5 flex items-end gap-2.5">
          <div className="w-7 h-7 rounded-full bg-opacity-20 bg-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">🙋</div>
          <textarea
            ref={inputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
            className="flex-1 bg-transparent border-none text-sm text-text placeholder-text3 outline-none resize-none min-h-6 max-h-20 font-dm py-0.5"
            rows="1"
          />
          <button 
            onClick={handlePostComment}
            disabled={!commentText.trim()}
            className="text-sm font-semibold text-primary-mid cursor-pointer hover:text-white transition-colors mb-0.5 pr-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteConfig.type === 'post' ? 'Post' : deleteConfig.type === 'comment' ? 'Comment' : 'Reply'}`}
        message={`Are you sure you want to delete this ${deleteConfig.type}? This action cannot be undone.`}
      />
    </div>
  );
};

export default PostScreen;