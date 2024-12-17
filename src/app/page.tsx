'use client';

import { useAuth } from '@/context/AuthContext';
import AuthPage from './(routes)/auth/page';
import ChatPage from './(routes)/chat/page';

export default function Page() {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return <ChatPage />;
}