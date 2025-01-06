import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';

export function useResizeObserver(callback: (entry: ResizeObserverEntry) => void) {
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const debouncedCallback = debounce((entries: ResizeObserverEntry[]) => {
      if (entries[0]) {
        callback(entries[0]);
      }
    }, 100);

    observerRef.current = new ResizeObserver(debouncedCallback);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      debouncedCallback.cancel();
    };
  }, [callback]);

  const observe = (element: HTMLElement | null) => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    if (element && observerRef.current) {
      observerRef.current.observe(element);
      elementRef.current = element;
    }
  };

  return observe;
}