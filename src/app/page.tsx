'use client';

import { useAuth } from '@/context/AuthContext';
import AuthPage from './(routes)/auth/page';
import ChatPage from './(routes)/chat/page';
import { useEffect, useState } from 'react';
import Loader from '@/components/UI/Loader';

export default function Page() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loader />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return <ChatPage />;
}