import { useEffect } from 'react';

export const useInfiniteScrollTrigger = ({
  targetRef,
  enabled,
  onLoadMore,
  root = null,
  rootMargin = '800px',
  threshold = 0
}) => {
  useEffect(() => {
    if (!enabled || !targetRef?.current) return;

    // Use closest scrollable parent as root if no root is explicitly provided
    let actualRoot = root;
    if (!actualRoot) {
        let parent = targetRef.current.parentElement;
        while (parent && parent !== document.body) {
            const overflowY = window.getComputedStyle(parent).overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
                actualRoot = parent;
                break;
            }
            parent = parent.parentElement;
        }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: actualRoot,
        rootMargin,
        threshold
      }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [enabled, onLoadMore, root, rootMargin, targetRef, threshold]);
};
