import * as React from 'react';

export function useInView(ref: React.MutableRefObject<HTMLElement> | React.MutableRefObject<null>): boolean {
  const [isInView, setIsInView] = React.useState<boolean>(false);

  React.useEffect((): () => void => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        setIsInView(entry.isIntersecting),
      {
        root: null,
        rootMargin: '0%',
        threshold: 0.1
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