import {useEffect, useState, MutableRefObject} from 'react';

export function useInView(ref: MutableRefObject<HTMLElement> | MutableRefObject<null>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        setIsInView(entry.isIntersecting),
      {
        root: null,
        rootMargin: '0%',
        threshold: 0
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isInView;
}