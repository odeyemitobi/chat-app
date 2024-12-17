'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatBox from '@/components/ChatInterface/ChatBox';
import { Message, MessageType } from '@/types/chat';
import { socketService } from '@/lib/socket';

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Initialize socket connection
    socketService.connect('http://localhost:3000');

    // Listen for incoming messages
    socketService.onMessage('chat_message', (data: unknown) => {
      const newMessage = data as Message;
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleSendMessage = (content: string, type: MessageType = MessageType.TEXT) => {
    if (user) {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        content,
        type,
        user,
        createdAt: new Date()
      };

      // Send message via socket
      socketService.sendMessage('send_message', newMessage);

      // Optimistically add message to local state
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  if (!user) {
    return <div>Please log in to access the chat</div>;
  }

  return (
    <div className="h-screen">
      <ChatBox 
        user={user} 
        messages={messages} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
}