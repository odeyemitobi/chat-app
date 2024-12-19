import { useState, useRef, useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { Message, MessageType } from '@/types/chat';
import { validateMessage } from '@/lib/validation';

interface UseChatBoxReturn {
  message: string;
  showEmojiPicker: boolean;
  isTyping: boolean;
  messageInputRef: RefObject<HTMLInputElement | null>;
  chatContainerRef: RefObject<HTMLDivElement>;
  messageRefs: RefObject<Map<string, HTMLDivElement>>;
  setMessage: (message: string) => void;
  setShowEmojiPicker: (show: boolean) => void;
  handleSendMessage: () => void;
  handleEmojiClick: (emoji: string) => void;
  handleTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useChatBox = (
  messages: Message[],
  onSendMessage: (content: string, type?: MessageType) => void
): UseChatBoxReturn => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(document.createElement('div'));
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    gsap.from(chatContainerRef.current, {
      duration: 0.5,
      opacity: 0,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    messages.forEach((msg) => {
      const messageEl = messageRefs.current.get(msg.id);
      if (messageEl) {
        gsap.from(messageEl, {
          duration: 0.3,
          scale: 0.8,
          opacity: 0,
          ease: "back.out(1.7)",
        });
      }
    });
  }, [messages]);

  const handleSendMessage = () => {
    if (validateMessage(message)) {
      gsap.to(messageInputRef.current, {
        duration: 0.2,
        scale: 0.95,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });

      onSendMessage(message, MessageType.TEXT);
      setMessage("");
      messageInputRef.current?.focus();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    if (messageInputRef.current) {
      const start = messageInputRef.current.selectionStart || 0;
      const end = messageInputRef.current.selectionEnd || 0;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMessage);
      
      const newCursorPosition = start + emoji.length;
      setTimeout(() => {
        if (messageInputRef.current) {
          messageInputRef.current.focus();
          messageInputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    } else {
      setMessage((prev) => prev + emoji);
    }
    gsap.to(".emoji-picker-wrapper", {
      duration: 0.2,
      scale: 0.9,
      opacity: 0,
      onComplete: () => setShowEmojiPicker(false),
    });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  return {
    message,
    showEmojiPicker,
    isTyping,
    messageInputRef,
    chatContainerRef,
    messageRefs,
    setMessage,
    setShowEmojiPicker,
    handleSendMessage,
    handleEmojiClick,
    handleTyping,
  };
};

// Separate hook for chat scroll functionality
export const useChatAnimation = () => {
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(chatContainerRef.current, {
      duration: 0.5,
      opacity: 0,
      ease: "power3.out",
    });
  }, []);

  return {
    messageRefs,
    chatContainerRef,
  };
};