'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/types/chat";
import { UserStorage } from "@/lib/userStorage";
import { 
  validateUsername, 
  validateEmail, 
  validatePassword,
  hashPassword 
} from "@/lib/validation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Loader from '@/components/UI/Loader';

interface StoredUser extends User {
  hashedPassword: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  register: () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [, setStoredUser] = useLocalStorage<User | null>("currentUser", null);

  // Check for existing logged-in user on mount
  useEffect(() => {
    try {
      const storedCurrentUser = localStorage.getItem("currentUser");
      if (storedCurrentUser) {
        const parsedUser = JSON.parse(storedCurrentUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (identifier: string, password: string): boolean => {
    const hashedPassword = hashPassword(password);
    const foundUser = UserStorage.findUser(identifier, hashedPassword);

    if (foundUser) {
      const { hashedPassword, ...safeUserData } = foundUser;
      setUser(safeUserData);
      setStoredUser(safeUserData);
      return true;
    }
    return false;
  };

  const register = (
    username: string,
    email: string,
    password: string
  ): boolean => {
    if (
      !validateUsername(username) ||
      !validateEmail(email) ||
      !validatePassword(password)
    ) {
      return false;
    }

    const hashedPassword = hashPassword(password);

    const newUser: StoredUser = {
      id: `user_${Date.now().toString()}`,
      username,
      email,
      avatar: '',
      hashedPassword,
      createdAt: new Date().toISOString()
    };

    const userAdded = UserStorage.addUser(newUser);
    
    if (userAdded) {
      const { hashedPassword, ...safeUserData } = newUser;
      setUser(safeUserData);
      setStoredUser(safeUserData);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
    localStorage.removeItem("currentUser");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);