import { useEffect, useRef } from 'react';

export const useChatScroll = <T>(dependency: T[]) => {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [dependency]);

  return chatRef;
};