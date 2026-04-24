import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import api from "../context/api.js";
import { timeAgo } from '../utils/timeAgo';
import AttendanceFlexCard from './AttendanceFlexCard';
import toast from 'react-hot-toast';

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

const PostCard = ({ id, handle, handleId, isLiked = false, likes, comments, onClick, onDelete, onUserClick, title, content, time, category, }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  // Sync local state when parent re-fetches updated data from cache
  useEffect(() => { setLiked(isLiked); }, [isLiked]);
  useEffect(() => { setLikeCount(likes); }, [likes]);

  const currentUserRole = user?.role; // Mocking role to allow admin/mod to delete

  const getCategoryStyles = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'confession': return 'bg-red-500/15 border-red-500/20 text-red-500';
      case 'question': return 'bg-blue-500/15 border-blue-500/20 text-blue-500';
      case 'rant': return 'bg-orange-500/15 border-orange-500/20 text-orange-500';
      case 'attendance': return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]';
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

  const getAvatarContent = (cat) => {
    if (cat?.toLowerCase() === 'attendance') return '📊';
    return getInitials(handle);
  };


  const toggleLike = async (e) => {
    e.stopPropagation();
    // Optimistic update — feels instant
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    try {
      await api.patch(`/posts/${id}/like`);
      if (newLiked) toast.success('Post liked!', { id: 'like-post', duration: 2000 });
      // Sync React Query cache so other screens (PostScreen, feed) see correct state
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      // Revert on error
      setLiked(!newLiked);
      setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
      console.log('Error while liking the post', error);
    }
  };

  const handleCardClick = () => {
    if (onClick && typeof onClick === 'function') {
      onClick({ id, handle, isLiked: liked, likes: likeCount, comments, title, content, time, category });
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && typeof onDelete === 'function') {
      onDelete(id);
    }
  };

  // Check if this is an attendance flex post
  let isAttendanceFlex = false;
  let flexData = null;
  let displayContent = content || "I am not okay.";

  if (content?.includes('[ATTENDANCE_FLEX]')) {
    isAttendanceFlex = true;
    const parts = content.split('[ATTENDANCE_FLEX]');
    displayContent = parts[0].trim();
    try {
      flexData = JSON.parse(parts[1]);
    } catch (e) {
      console.error("Failed to parse flex data", e);
    }
  } else if (category?.toLowerCase() === 'attendance' && (title?.toLowerCase().includes('flex') || content?.toLowerCase().includes('attendance'))) {
    // Legacy support for older posts
    isAttendanceFlex = true;
  }

  return (
    <div onClick={handleCardClick} className={`bg-bg2 border border-border rounded-3xl p-3 cursor-pointer hover:border-border2 hover:-translate-y-[2px] transition-all duration-300 ease-out relative overflow-hidden ${isAttendanceFlex ? 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.06)]' : 'shadow-sm hover:shadow-md'}`}>
      {isAttendanceFlex && (
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none -z-0" />
      )}
      <div className="relative z-10 flex items-center gap-1.5 mb-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${getAvatarStyles(category)}`}>{getAvatarContent(category)}</div>
        <span
          className="text-xs font-medium text-text hover:text-primary-mid transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (handleId && typeof onUserClick === 'function') {
              onUserClick(handleId);
            }
          }}
        >
          {handle}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded-2xl border font-medium capitalize ${getCategoryStyles(category)}`}>{category}</span>
        <span className="text-xs text-text3 ml-auto">{timeAgo(time)}</span>
        
        {/* Mod/Admin Delete Button */}
        {(currentUserRole === 'admin' || currentUserRole === 'moderator' || handleId == user._id) && (
          <button 
            onClick={handleDelete} 
            className="ml-2 p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            title="Delete Post"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        )}
      </div>

      {/* Title */}
      {(title || !content) && (
        <div className="relative z-10 text-sm font-bold text-text mb-1">
          {title || "I have 61% attendance in OS and the exam is in 3 weeks. I have attended 0 classes this month."}
        </div>
      )}

      {/* Attendance flex card or normal content */}
      {isAttendanceFlex ? (
        <div className="relative z-10 mb-2.5">
          <div className="text-sm leading-relaxed text-text mb-2 whitespace-pre-wrap">{displayContent}</div>
          {/* Inline flex visual */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-bg via-emerald-950/20 to-[#0E0D14] p-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div>
                  <span className="text-[10px] text-text3 uppercase tracking-wider font-bold block">Attendance Flex</span>
                  {flexData ? (
                    <span className="text-xs text-emerald-400 font-bold tracking-wide">
                      {flexData.subject} • {flexData.percent}% • Bunk: {flexData.canBunk}
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold tracking-wide">Dynamic Stats Shared</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 text-sm leading-relaxed text-text mb-2.5">
          {displayContent || "I am not okay."}
        </div>
      )}

      <div className="relative z-10 flex gap-3.5">
        <button onClick={toggleLike} className="flex items-center gap-1 text-xs text-text3 hover:text-red-400 transition-colors group">
          <svg viewBox="0 0 16 16" fill={liked ? '#ED93B1' : 'none'} stroke={liked ? '#ED93B1' : 'currentColor'} strokeWidth="1.5" width="13" height="13">
            <path d="M8 14s-6-4-6-8a4 4 0 018 0 4 4 0 018 0c0 4-6 8-6 8z" />
          </svg>
          <span>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1 text-xs text-text3 hover:text-primary-mid transition-colors">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
            <path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z" />
          </svg>
          <span>{comments}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
