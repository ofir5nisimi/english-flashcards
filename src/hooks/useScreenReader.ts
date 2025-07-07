import { useRef, useCallback } from 'react';

export const useScreenReader = () => {
  const announceRef = useRef<HTMLDivElement | null>(null);

  // Create or get the announcement element
  const getAnnounceElement = useCallback(() => {
    if (!announceRef.current) {
      // Create a live region for announcements
      const announceElement = document.createElement('div');
      announceElement.setAttribute('aria-live', 'polite');
      announceElement.setAttribute('aria-atomic', 'true');
      announceElement.style.position = 'absolute';
      announceElement.style.left = '-10000px';
      announceElement.style.width = '1px';
      announceElement.style.height = '1px';
      announceElement.style.overflow = 'hidden';
      document.body.appendChild(announceElement);
      announceRef.current = announceElement;
    }
    return announceRef.current;
  }, []);

  // Announce message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const element = getAnnounceElement();
    element.setAttribute('aria-live', priority);
    
    // Clear the content first, then set the new message
    element.textContent = '';
    setTimeout(() => {
      element.textContent = message;
    }, 100);
  }, [getAnnounceElement]);

  // Announce with assertive priority (interrupts current announcements)
  const announceImmediate = useCallback((message: string) => {
    announce(message, 'assertive');
  }, [announce]);

  // Clean up on unmount
  const cleanup = useCallback(() => {
    if (announceRef.current && document.body.contains(announceRef.current)) {
      document.body.removeChild(announceRef.current);
      announceRef.current = null;
    }
  }, []);

  return {
    announce,
    announceImmediate,
    cleanup
  };
}; 