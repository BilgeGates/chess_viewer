import { useEffect, useRef, useState } from 'react';

/**
 * useIntersectionObserver - Hook for lazy rendering with Intersection Observer
 *
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin string
 * @returns {Object} - { ref, isVisible }
 */
export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '50px'
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once visible, keep it visible (don't re-hide)
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};

export default useIntersectionObserver;
