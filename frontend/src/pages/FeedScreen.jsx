import { useCallback, useMemo, useRef, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { PostCardSkeleton } from '../components/Skeleton';
import HorizontalTabs from '../components/HorizontalTabs';
import ComposeBox from '../components/ComposeBox';
import PostCard from '../components/PostCard';
import FeedTopNav from '../components/FeedTopNav';
import AttendanceMini from '../components/AttendanceMini';
import { useAuth } from '../context/AuthContext';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInfiniteScrollTrigger } from '../utils/useInfiniteScrollTrigger';

import api from '../context/api';

const PAGE_SIZE = 10;

const ScrollArea = ({ children }) => (
  <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 scrollbar-hide bg-bg pt-20">
    {children}
  </div>
);

const FeedScreen = ({ onNavClick }) => {
  const [activeHTab, setActiveHTab] = useState('All');
  const [postToDelete, setPostToDelete] = useState(null);
  const { user } = useAuth();
  const loadMoreRef = useRef(null);

  const queryClient = useQueryClient();

  const {
    data,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts', PAGE_SIZE],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get('/posts', {
        withCredentials: true,
        params: {
          page: pageParam,
          limit: PAGE_SIZE
        }
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => lastPage?.pagination?.hasMore ? lastPage.pagination.nextPage : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });

  const posts = useMemo(
    () => data?.pages?.flatMap((page) => page?.items || []) || [],
    [data]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useInfiniteScrollTrigger({
    targetRef: loadMoreRef,
    enabled: hasNextPage && !isLoading,
    onLoadMore: handleLoadMore,
    rootMargin: '450px'
  });

  const handleCreatePost = async (newTitle, newContent, newCategory) => {
    try {
      const response = await api.post("/posts", {
        title: newTitle,
        content: newContent,
        tags: newCategory
      });
      queryClient.setQueryData(['posts', PAGE_SIZE], oldData => {
        if (!oldData?.pages?.length) return oldData;

        const firstPage = oldData.pages[0] || { items: [], pagination: { page: 1, limit: PAGE_SIZE, total: 0, hasMore: false, nextPage: null } };
        const updatedFirstPage = {
          ...firstPage,
          items: [response.data.data, ...(firstPage.items || [])],
          pagination: {
            ...(firstPage.pagination || {}),
            total: (firstPage.pagination?.total || 0) + 1
          }
        };

        return {
          ...oldData,
          pages: [updatedFirstPage, ...oldData.pages.slice(1)]
        };
      });
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
        <AttendanceMini onNavClick={onNavClick} />
        {isLoading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
          ) : isError ? (
            <div className="text-center text-red-500 text-sm py-10">
              Something went wrong. Please try again.
            </div>


        ) : filteredPosts.length > 0 ? (
          <>
            {filteredPosts.map(post => (
              <PostCard
                key={post._id}
                id={post._id}
                onDelete={handleDeletePost}
                handleId={post.owner?._id}
                onClick={(post) => onNavClick(`post/${post.id}`)}
                handle={post.owner?.name}
                title={post.title}
                content={post.content}
                likes={post.likes?.length || 0}
                comments={post.comments?.length || 0}
                isLiked={(post.likes || []).some(like => like === user?._id || like?._id === user?._id)}
                time={post.createdAt}
                category={post.tags}
              />
            ))}

            <div ref={loadMoreRef} className="h-2" />

            {isFetchingNextPage && (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            )}

            {!hasNextPage && posts.length > 0 && (
              <div className="text-center text-text3 text-xs py-4 opacity-70">
                You&apos;ve reached the end.
              </div>
            )}
          </>
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
            queryClient.setQueryData(['posts', PAGE_SIZE], oldData => {
              if (!oldData?.pages?.length) return oldData;

              const updatedPages = oldData.pages.map((page) => ({
                ...page,
                items: (page.items || []).filter((post) => post._id !== postToDelete)
              }));

              return {
                ...oldData,
                pages: updatedPages
              };
            });
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
