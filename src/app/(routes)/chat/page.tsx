'use client';

import { useAuth } from '@/context/AuthContext';
import ChatBox from '@/components/ChatInterface/ChatBox';
import Loader from '@/components/UI/Loader';
import { useChatMessages, useLogout } from './hooks';

export default function ChatPage() {
  const { user } = useAuth();
  const { messages, sendMessage } = useChatMessages();
  const { handleLogout } = useLogout();

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100">
      <ChatBox 
        user={user} 
        messages={messages} 
        onSendMessage={sendMessage}
        onLogout={handleLogout}
      />
    </div>
  );
}