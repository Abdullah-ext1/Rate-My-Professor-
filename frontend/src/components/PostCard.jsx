import '../styles/PostCard.css';

const PostCard = ({ post }) => {
  const handleLike = () => {
    console.log('Liked post:', post.id);
  };

  return (
    <div className="post-card">
      <div className="post-top">
        <div className="post-avatar" style={{ background: 'rgba(212,83,126,0.15)' }}>
          {post.avatar}
        </div>
        <span className="post-handle">{post.handle}</span>
        <span className={`post-tag ${post.tagClass}`}>{post.tag}</span>
        <span className="post-time">{post.time}</span>
      </div>
      <div className="post-body">{post.body}</div>
      <div className="post-actions">
        <button className="action-btn" onClick={handleLike}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 14s-6-4-6-8a4 4 0 018 0 4 4 0 018 0c0 4-6 8-6 8z" />
          </svg>
          <span>{post.likes}</span>
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
