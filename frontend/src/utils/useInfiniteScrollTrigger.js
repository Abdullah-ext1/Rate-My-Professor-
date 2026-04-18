import { useEffect } from 'react';

export const useInfiniteScrollTrigger = ({
  targetRef,
  enabled,
  onLoadMore,
  root = null,
  rootMargin = '300px',
  threshold = 0
}) => {
  useEffect(() => {
    if (!enabled || !targetRef?.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root,
        rootMargin,
        threshold
      }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [enabled, onLoadMore, root, rootMargin, targetRef, threshold]);
};
