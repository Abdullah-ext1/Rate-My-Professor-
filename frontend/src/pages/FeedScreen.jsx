import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const TopNav = ({ onNavClick }) => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
    <div className="flex items-center gap-2">
      <div className="text-base font-bold text-text font-syne tracking-tight">
        campus<span className="text-primary-mid">.</span>
      </div>
      <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">Rizvi</div>
    </div>
    <div className="flex items-center gap-3">
      <div 
        onClick={() => onNavClick('profile')}
        className="w-8 h-8 rounded-full bg-primary-mid/10 border border-primary-mid/30 flex items-center justify-center cursor-pointer hover:bg-primary-mid/20 transition-colors overflow-hidden"
      >
        <span className="text-xs font-bold text-primary-mid font-syne">ME</span>
      </div>
      <div 
        onClick={() => onNavClick('notifications')}
        className="w-7 h-7 rounded-full bg-bg2 border border-border flex items-center justify-center relative cursor-pointer hover:bg-bg3 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#9B99B0" strokeWidth="1.5">
          <path d="M8 1a5 5 0 015 5v3l1.5 2H1.5L3 9V6a5 5 0 015-5z" />
          <path d="M6.5 13a1.5 1.5 0 003 0" />
        </svg>
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent-red border border-bg"></div>
      </div>
    </div>
  </div>
);

const HorizontalTabs = ({ tabs, activeTab, setActiveTab }) => (
  <div className="fixed top-12 left-0 right-0 flex gap-0 border-b border-border bg-bg overflow-x-auto scrollbar-hide flex-shrink-0 px-4 z-30">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-3.5 py-2 text-xs cursor-pointer border-b-2 whitespace-nowrap transition-colors ${
          activeTab === tab
            ? 'border-primary text-primary-mid font-medium'
            : 'border-transparent text-text3 hover:text-text2'
        }`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
);

const ScrollArea = ({ children }) => (
  <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 scrollbar-hide bg-bg pt-20">
    {children}
  </div>
);

const ComposeBox = ({ onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('confession');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handlePost = () => {
    if (content.trim() || title.trim()) {
      onPost(title, content, category);
      setTitle('');
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <div className={`bg-bg2 border border-border rounded-3xl p-3 transition-all ${isExpanded ? 'shadow-lg' : ''}`}>
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded-full bg-opacity-20 bg-primary border border-opacity-30 border-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">👻</div>
        
        {!isExpanded ? (
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-xs bg-bg3 border border-border2 rounded-2xl px-3 py-2 cursor-text text-text3 hover:border-border transition-colors"
          >
            Post anonymously...
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2.5 bg-bg3 border border-border2 rounded-2xl p-2.5">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="text-sm font-semibold text-text bg-transparent border-none focus:outline-none placeholder:text-text3"
              autoFocus
            />
            <hr className="border-border2" />
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's down there?"
              rows={3}
              className="text-xs text-text bg-transparent border-none focus:outline-none placeholder:text-text3 resize-none w-full" 
            />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-3 mt-3 ml-9">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {['confession', 'question', 'rant', 'attendance'].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors capitalize whitespace-nowrap ${
                  category === cat 
                    ? 'bg-opacity-20 bg-primary border-opacity-50 border-primary text-primary-mid font-medium' 
                    : 'bg-transparent border-border2 text-text3 hover:bg-bg'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => setIsExpanded(false)} 
              className="text-xs text-text3 hover:text-text px-3 py-1.5 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handlePost} 
              className="bg-primary text-white rounded-2xl px-4 py-1.5 text-xs font-semibold cursor-pointer hover:bg-primary-dark transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AttendanceMini = () => (
  <div className="bg-bg2 border border-border rounded-3xl p-3">
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-xs font-medium text-text">Your attendance</span>
      <span className="text-xs text-primary-mid cursor-pointer hover:underline">See all</span>
    </div>
    <div className="flex flex-col gap-1.75">
      {[
        { subject: 'Data Struct.', percent: 84, color: 'bg-accent-teal' },
        { subject: 'OS', percent: 76, color: 'bg-accent-amber' },
        { subject: 'DBMS', percent: 63, color: 'bg-accent-red' },
      ].map(item => (
        <div key={item.subject} className="flex items-center gap-2">
          <span className="text-xs text-text3 w-16 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{item.subject}</span>
          <div className="flex-1 h-1 bg-bg3 rounded overflow-hidden">
            <div className={`h-full rounded ${item.color}`} style={{ width: `${item.percent}%` }}></div>
          </div>
          <span className="text-xs font-medium min-w-7 text-right" style={{ color: item.color.split('-')[2] === 'teal' ? '#1D9E75' : item.color.split('-')[2] === 'amber' ? '#EF9F27' : '#E24B4A' }}>
            {item.percent}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

const PostCard = ({ id, handle, isLiked = false, likes, comments, onClick, onDelete, title, content, time = '14m', category = 'confession' }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const currentUserRole = 'admin'; // Mocking role to allow admin/mod to delete

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
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

  return (
    <div onClick={handleCardClick} className="bg-bg2 border border-border rounded-3xl p-3 cursor-pointer hover:border-border2 transition-colors relative">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 rounded-full bg-opacity-15 bg-red-500 flex items-center justify-center text-xs flex-shrink-0">👻</div>
        <span className="text-xs font-medium text-text">{handle}</span>
        <span className="text-xs px-1.5 py-0.5 rounded-2xl bg-opacity-15 bg-red-500 border border-opacity-20 border-red-500 text-red-400 font-medium capitalize">{category}</span>
        <span className="text-xs text-text3 ml-auto">{time}</span>
        
        {/* Mod/Admin Delete Button */}
        {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
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
      {(title || !content) && (
        <div className="text-sm font-bold text-text mb-1">
          {title || "I have 61% attendance in OS and the exam is in 3 weeks. I have attended 0 classes this month."}
        </div>
      )}
      <div className="text-sm leading-relaxed text-text mb-2.5">
        {content || "I am not okay."}
      </div>
      <div className="flex gap-3.5">
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



const FeedScreen = ({ onNavClick }) => {
  const [activeHTab, setActiveHTab] = useState('All');
  const [postToDelete, setPostToDelete] = useState(null);
  
  const [posts, setPosts] = useState([
    {
      id: 1,
      handle: "Anonymous panda",
      title: "I have 61% attendance in OS and the exam is in 3 weeks. I have attended 0 classes this month.",
      content: "I am not okay.",
      likes: 47,
      comments: 12,
      isLiked: true,
      time: "14m",
      category: "confession"
    },
    {
      id: 2,
      handle: "Anonymous butterfly",
      title: "DBMS Notes?",
      content: "Does anyone have the notes for yesterday's DBMS lecture?",
      likes: 89,
      comments: 28,
      isLiked: false,
      time: "2h",
      category: "question"
    },
    {
      id: 3,
      handle: "Anonymous lion",
      title: "Library Wifi",
      content: "The wifi in the library has been down for 3 days now. This is ridiculous.",
      likes: 134,
      comments: 41,
      isLiked: false,
      time: "5h",
      category: "rant"
    }
  ]);

  const handleCreatePost = (newTitle, newContent, newCategory) => {
    const newPost = {
      id: Date.now(),
      handle: "Anonymous you",
      title: newTitle,
      content: newContent,
      likes: 0,
      comments: 0,
      isLiked: false,
      time: "Just now",
      category: newCategory
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (id) => {
    setPostToDelete(id);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <TopNav onNavClick={onNavClick} />
      <HorizontalTabs
        tabs={['All', 'Confessions', 'Attendance', 'Questions', 'Rants']}
        activeTab={activeHTab}
        setActiveTab={setActiveHTab}
      />
      <ScrollArea>
        <ComposeBox onPost={handleCreatePost} />
        <AttendanceMini />
        {posts.map(post => (
          <PostCard
            key={post.id}
            id={post.id}
            onDelete={handleDeletePost}
            onClick={() => onNavClick('post')}
            handle={post.handle}
            title={post.title}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            isLiked={post.isLiked}
            time={post.time}
            category={post.category}
          />
        ))}
      </ScrollArea>
      <ConfirmModal 
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => {
          setPosts(posts.filter(p => p.id !== postToDelete));
          setPostToDelete(null);
        }}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
};

export default FeedScreen;
