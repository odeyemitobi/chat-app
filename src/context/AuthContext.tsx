// src/context/AuthContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "@/types/chat";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { validateUsername } from "@/lib/validation";

interface AuthContextType {
  user: User | null;
  login: (username: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [storedUser, setStoredUser] = useLocalStorage<User | null>(
    "chatUser",
    null
  );
  const [user, setUser] = useState<User | null>(storedUser);

  const login = (username: string): boolean => {
    if (!validateUsername(username)) {
      return false;
    }

    const newUser: User = {
      id: `user_${Date.now().toString()}`,
      username,
    };

    setUser(newUser);
    setStoredUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
