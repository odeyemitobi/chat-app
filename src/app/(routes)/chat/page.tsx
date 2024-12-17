'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatBox from '@/components/ChatInterface/ChatBox';
import { Message, MessageType } from '@/types/chat';
import { socketService } from '@/lib/socket';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    socketService.connect('http://localhost:3000');
    socketService.onMessage('chat_message', (data: unknown) => {
      const newMessage = data as Message;
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });
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
      socketService.sendMessage('send_message', newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
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
        onLogout={handleLogout}
      />
    </div>
  );
}