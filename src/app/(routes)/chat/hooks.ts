"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Message, MessageType } from "@/types/chat";
import { socketService } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    socketService.connect("http://localhost:3000");
    socketService.onMessage("chat_message", (data: unknown) => {
      const newMessage = data as Message;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const sendMessage = (
    content: string,
    type: MessageType = MessageType.TEXT
  ) => {
    if (user) {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        content,
        type,
        user,
        createdAt: new Date(),
      };
      socketService.sendMessage("send_message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  return { messages, sendMessage };
};

export const useLogout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return { handleLogout };
};
