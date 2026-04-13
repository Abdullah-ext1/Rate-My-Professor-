import { useState, useRef, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import api from '../context/api';
import { useParams } from 'react-router-dom';
import { timeAgo } from '../utils/timeAgo';

const PostScreen = ({ onNavClick, postData }) => {
  const { user } = useAuth();
  const { id } = useParams();
  const currentUserRole = user?.role;

  const [post, setPost] = useState(null)
  const [liked, setLiked] = useState(post?.isLiked || false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [comments, setComments] = useState([]);
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, type: '', commentId: null, replyId: null });
  const inputRef = useRef(null);

  useEffect(() => {                  // ← add here
    const fetchPost = async () => {
      try {
      const response = await api.get(`/posts/${id}`);
      const data = response.data.data;
      setPost(data);
      // Handle both ObjectId strings and direct comparisons
      const userLiked = data.likes?.some(like => like === user._id || like._id === user._id);
      setLiked(userLiked || false);
      setLikeCount(data.likes?.length || 0);
      const commentResponse = await api.get(`/comments/${id}`);
      const commentsData = commentResponse.data.data.map(comment => ({
        ...comment,
        isLiked: comment.commentLike?.some(like => like === user._id || like._id === user._id),
        replies: comment.replies?.map(reply => ({
          ...reply,
          isLiked: reply.commentLike?.some(like => like === user._id || like._id === user._id)
        }))
      }));
      setComments(commentsData);

    } catch (error) {
        console.log("Error fetching post", error);
      }
    };
    fetchPost();
  }, [id]); // why the id is here ? its because when we navigate to a different post, the component doesn't unmount but the id changes, so we need to refetch the post data whenever the id changes. If we left the dependency array empty, it would only fetch the post data once when the component mounts and would not update if we navigate to another post.


  const toggleLike = async () => {
    try {
      await api.patch(`/posts/${id}/like`);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.log("Error liking post", error);
    }
  };

  const handleReplyClick = (commentId, authorName) => {
    setReplyingTo({ id: commentId, name: authorName });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      if (replyingTo) {
        await api.post(`/comments/${replyingTo.id}/reply`, { content: commentText });
      } else {
        await api.post(`/comments/${id}`, { content: commentText });
      }
      // refetch comments after posting
      const response = await api.get(`/comments/${id}`);
      const commentsData = response.data.data.map(comment => ({
        ...comment,
        isLiked: comment.commentLike?.some(like => like === user._id || like._id === user._id),
        replies: comment.replies?.map(reply => ({
          ...reply,
          isLiked: reply.commentLike?.some(like => like === user._id || like._id === user._id)
        }))
      }));
      setComments(commentsData);
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      console.log("Error posting comment", error);
    }
  };
  const toggleCommentLike = async (commentId) => {
    try {
      // Optimistic update
      setComments(comments.map(comment => {
        if (comment._id === commentId) {
          const isCurrentlyLiked = comment.isLiked;
          const updatedLikeCount = isCurrentlyLiked
            ? (comment.commentLike?.length || 1) - 1
            : (comment.commentLike?.length || 0) + 1;
          
          return {
            ...comment,
            isLiked: !isCurrentlyLiked,
            commentLike: Array(updatedLikeCount).fill('user') // placeholder to update length
          };
        }
        return comment;
      }));
      await api.patch(`/comments/${commentId}/like`);
    } catch (error) {
      console.log("Error liking comment", error);
    }
  };

  const toggleReplyLike = async (commentId, replyId) => {
    try {
      // Optimistic update
      setComments(prev =>
        prev.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply._id === replyId) {
                  const isCurrentlyLiked = reply.isLiked;
                  const updatedLikeCount = isCurrentlyLiked
                    ? (reply.commentLike?.length || 1) - 1
                    : (reply.commentLike?.length || 0) + 1;

                  return {
                    ...reply,
                    isLiked: !isCurrentlyLiked,
                    commentLike: Array(updatedLikeCount).fill('user') // placeholder to update length
                  };
                }
                return reply;
              })
            };
          }
          return comment;
        })
      );
      await api.patch(`/comments/${replyId}/like`);
    } catch (error) {
      console.log("Error liking reply", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: window.location.href, title: 'Check out this post' }).catch(err => console.log('Share failed', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const confirmDelete = () => {
    if (deleteConfig.type === 'reply') {
      setComments(comments.map(c => {
        if (c._id === deleteConfig.commentId) {
          return { ...c, replies: c.replies.filter(r => r._id !== deleteConfig.replyId) };
        }
        return c;
      }));
    } else if (deleteConfig.type === 'comment') {
      setComments(comments.filter(c => c._id !== deleteConfig.commentId));
    } else if (deleteConfig.type === 'post') {
      onNavClick('feed');
    }
  };

  const getCategoryStyles = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'confession': return 'bg-red-500/15 border-red-500/20 text-red-500';
      case 'question': return 'bg-blue-500/15 border-blue-500/20 text-blue-500';
      case 'rant': return 'bg-orange-500/15 border-orange-500/20 text-orange-500';
      case 'attendance': return 'bg-emerald-500/15 border-emerald-500/20 text-emerald-500';
      case 'other': return 'bg-slate-500/15 border-slate-500/20 text-slate-500';
      default: return 'bg-primary/15 border-primary/20 text-primary-mid';
    }
  };

  const getAvatarStyles = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'confession': return 'bg-red-500/15';
      case 'question': return 'bg-blue-500/15';
      case 'rant': return 'bg-orange-500/15';
      case 'attendance': return 'bg-emerald-500/15';
      case 'other': return 'bg-slate-500/15';
      default: return 'bg-primary/15';
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
        {/* Post Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${getAvatarStyles(post?.tags)}`}>👻</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text">{post?.owner.name}</span>
              <span className="text-xs text-text3">{timeAgo(post?.createdAt)} ago</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-2xl border font-medium ml-2 capitalize ${getCategoryStyles(post?.tags)}`}>
              {post?.tags}
            </span>
          </div>
          {(currentUserRole === 'admin' || currentUserRole === 'moderator' || handleId == user._id) && (
            <button
              onClick={() => setDeleteConfig({ isOpen: true, type: 'post', commentId: null, replyId: null })}
              className="p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>

        {/* Post Content */}
        <h1 className="text-lg font-bold text-text mb-2 tracking-tight">{post?.title}</h1>
        <p className="text-sm leading-relaxed text-text mt-2 mb-4">{post?.content}</p>

        {/* Action Bar */}
        <div className="flex items-center justify-start flex-wrap gap-2 py-3 border-border mb-4">
          <button onClick={toggleLike} className="flex items-center gap-2 bg-bg2 hover:bg-bg3 border border-border2 rounded-full px-4 h-[36px] transition-colors text-text">
            <svg viewBox="0 0 24 24" fill={liked ? '#ED93B1' : 'none'} stroke={liked ? '#ED93B1' : 'currentColor'} strokeWidth="2" width="18" height="18">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-sm font-semibold">{likeCount}</span>
          </button>

          <button className="flex items-center justify-center gap-2 bg-bg2 hover:bg-bg3 border border-border2 rounded-full px-4 h-[36px] transition-colors text-text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">{post?.comments?.length}</span>
          </button>

          <button onClick={handleShare} className="flex items-center justify-center gap-2 bg-bg2 hover:bg-bg3 border border-border2 rounded-full px-4 h-[36px] transition-colors text-text cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-sm font-medium text-text">Share</span>
          </button>
        </div>

        {/* Join conversation */}
        <div onClick={() => inputRef.current?.focus()} className="border border-border2 rounded-full py-2 px-4 mb-4 flex items-center cursor-pointer hover:bg-bg2 transition-colors">
          <span className="text-text3 text-sm">Join the conversation</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className={`w-7 h-7 rounded-full bg-opacity-20 ${comment.bgColor} flex items-center justify-center text-xs flex-shrink-0 mt-0.5`}>{comment.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-text2 flex items-center gap-1">
                      {comment.user.name}
                      {comment.isMe && <span className="px-1 py-0.5 rounded-sm bg-primary bg-opacity-20 text-[10px] text-primary-mid scale-90">ME</span>}
                    </span>
                    <span className="text-xs text-text3">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-text mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <div onClick={() => toggleCommentLike(comment._id)} className={`flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors ${comment.isLiked ? 'text-red-400' : 'text-text3 hover:text-white'}`}>
                      <svg viewBox="0 0 24 24" fill={comment.isLiked ? '#ED93B1' : 'none'} stroke={comment.isLiked ? '#ED93B1' : 'currentColor'} strokeWidth="2" width="14" height="14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{comment.commentLike?.length}</span>
                    </div>
                    <span onClick={() => handleReplyClick(comment._id, comment.author)} className="text-xs font-medium text-text3 cursor-pointer hover:text-white flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-4-4 4-4M5 10h11a4 4 0 110 8h-1" />
                      </svg>
                      Reply
                    </span>
                    {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
                      <span onClick={() => setDeleteConfig({ isOpen: true, type: 'comment', commentId: comment._id, replyId: null })} className="text-xs font-medium text-red-500/70 hover:text-red-500 cursor-pointer ml-auto">
                        Delete
                      </span>
                    )}
                  </div>

                  {/* Replies */}
                  {comment.replies?.map((reply) => (
                    <div key={reply._id} className="mt-3 flex gap-3 border-l-2 border-border pl-3 pt-1">
                      <div className={`w-6 h-6 rounded-full bg-opacity-15 ${reply.bgColor} flex items-center justify-center text-xs flex-shrink-0 mt-0.5`}>{reply.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-text2 flex items-center gap-1">
                            {reply.user.name}
                            {reply.isMe && <span className="px-1 py-0.5 rounded-sm bg-primary bg-opacity-20 text-[10px] text-primary-mid scale-90">ME</span>}
                          </span>
                          <span className="text-xs text-text3">{timeAgo(reply.createdAt)}</span>
                        </div>
                        <p className="text-sm text-text mb-2">{reply.content}</p>
                        <div className="flex items-center gap-4">
                          <div onClick={() => toggleReplyLike(comment._id, reply._id)} className={`flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors ${reply.isLiked ? 'text-red-400' : 'text-text3 hover:text-white'}`}>
                            <svg viewBox="0 0 24 24" fill={reply.isLiked ? '#ED93B1' : 'none'} stroke={reply.isLiked ? '#ED93B1' : 'currentColor'} strokeWidth="2" width="14" height="14">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{reply.commentLike?.length || 0}</span>
                          </div>
                          <span onClick={() => handleReplyClick(comment._id, reply.author)} className="text-xs font-medium text-text3 cursor-pointer hover:text-white flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-4-4 4-4M5 10h11a4 4 0 110 8h-1" />
                            </svg>
                            Reply
                          </span>
                          {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
                            <span onClick={() => setDeleteConfig({ isOpen: true, type: 'reply', commentId: comment._id, replyId: reply._id })} className="text-xs font-medium text-red-500/70 hover:text-red-500 cursor-pointer ml-auto">
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

      {/* Comment Input */}
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