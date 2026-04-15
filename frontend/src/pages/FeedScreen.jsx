import { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { PostCardSkeleton } from '../components/Skeleton';
import HorizontalTabs from '../components/HorizontalTabs';
import ComposeBox from '../components/ComposeBox';
import PostCard from '../components/PostCard';
import FeedTopNav from '../components/FeedTopNav';
import { useAuth } from '../context/AuthContext';

import api from '../context/api';

const ScrollArea = ({ children }) => (
  <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 scrollbar-hide bg-bg pt-20">
    {children}
  </div>
);

const FeedScreen = ({ onNavClick }) => {
  const [activeHTab, setActiveHTab] = useState('All');
  const [postToDelete, setPostToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulate fetching posts from a backend
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/posts")
        setPosts(response.data.data)
      } catch (error) {
        console.log("Error fetching posts", error)
      } finally {
        setIsLoading(false)
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (newTitle, newContent, newCategory) => {
    try {
      const response = await api.post("/posts", {
        title: newTitle,
        content: newContent,
        tags: newCategory
      });
      setPosts([response.data.data, ...posts]);
    } catch (error) {
        console.log("Error while creating the post", error);
    }};

  const handleDeletePost = (id) => {
    setPostToDelete(id);
  };

  const getFilteredPosts = () => {
    if (activeHTab === 'All') return posts;
    
    const tabToTagMap = {
      'Confessions': 'confession',
      'Attendance': 'attendance',
      'Questions': 'question',
      'Rants': 'rant',
      'Other': 'other'
    };
    
    return posts.filter(post => post.tags && post.tags.toLowerCase() === tabToTagMap[activeHTab]);
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
    <FeedTopNav onNavClick={onNavClick} />
  
      <HorizontalTabs
        tabs={['All', 'Confessions', 'Attendance', 'Questions', 'Rants', 'Other']}
        activeTab={activeHTab}
        setActiveTab={setActiveHTab}
      />
      <ScrollArea>
        <ComposeBox onPost={handleCreatePost} />
        {isLoading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>

        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard
              key={post._id}
              id={post._id}
              onDelete={handleDeletePost}
              handleId={post.owner._id}
              onClick={(post) => onNavClick(`post/${post.id}`)}
              handle={post.owner.name}
              title={post.title}
              content={post.content}
              likes={post.likes.length}
              comments={post.comments.length}
              isLiked={post.likes.some(like => like === user._id || like._id === user._id)}
              time={post.createdAt}
              category={post.tags}
            />
          ))
        ) : (
          <div className="text-center text-text3 text-sm py-10 opacity-70">
            No posts found in this category.
          </div>
        )}
      </ScrollArea>
      <ConfirmModal 
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={async () => {
          try {
            await api.delete(`/posts/${postToDelete}`);
            setPosts(posts.filter(post => post._id !== postToDelete));
          } catch (error) {
            console.log("Error deleting post", error);
          } finally {
            setPostToDelete(null);
          }
        }}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />

    </div>
  );
};

export default FeedScreen;
