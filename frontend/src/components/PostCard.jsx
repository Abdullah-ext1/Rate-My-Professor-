import '../styles/PostCard.css';

const PostCard = ({ post }) => {
  const handleLike = () => {
    console.log('Liked post:', post._id);
  };

  const timeAgo = (date) => {
    const now = Date.now()
    const past = new Date(date).getTime()

    const diff = now - past // in milliseconds

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="post-card">
      <div className="post-top">
        <div className="post-avatar" style={{ background: 'rgba(212,83,126,0.15)' }}>
          <img src={post.avatar} />
        </div>
        <span className="post-handle">{post.owner}</span>
        <span className={`post-tag ${post.tagClass}`}>{post.tags}</span>
        <span className="post-time">{timeAgo(post.createdAt)}</span>
      </div>
      <div className="post-body">{post.content}</div>
      <div className="post-actions">
        <button className="action-btn" onClick={handleLike}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 14s-6-4-6-8a4 4 0 018 0 4 4 0 018 0c0 4-6 8-6 8z" />
          </svg>
          <span>{post.comments}</span>
        </button>
        <button className="action-btn">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z" />
          </svg>
          {post.replies} replies
        </button>
        {post.views && (
          <button className="action-btn">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <circle cx="8" cy="8" r="2.5" />
            </svg>
            {post.views} views
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;


// { id: 2, avatar: '🦋', handle: 'Anonymous butterfly', tag: 'attendance', tagClass: 'tag-attendance', time: '32 min ago', body: 'DS lab attendance taken today at 9:05am sharp. Sir was checking faces — proxy not possible. 3 people got marked absent who were literally sitting there lol', likes: 89, replies: 28 },