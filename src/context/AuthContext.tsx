"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "@/types/chat";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "@/lib/validation";

interface EnhancedUser extends User {
  hashedPassword: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  register: () => false,
  logout: () => {},
});

const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [storedUser, setStoredUser] = useLocalStorage<EnhancedUser | null>(
    "chatUser",
    null
  );
  const [user, setUser] = useState<User | null>(storedUser);

  const login = (
    username: string,
    email: string,
    password: string
  ): boolean => {
    // Validate input
    const isValidInput =
      (validateUsername(username) || validateEmail(email)) &&
      validatePassword(password);

    if (!isValidInput) {
      return false;
    }

    // Try to retrieve user from localStorage directly
    const storedUserItem = localStorage.getItem('chatUser');
    const storedUser: EnhancedUser | null = storedUserItem 
      ? JSON.parse(storedUserItem) 
      : null;

    // If a user is stored, verify credentials
    if (storedUser) {
      const hashedPassword = hashPassword(password);
      
      // Check if login credentials match stored user
      const isEmailMatch = email === storedUser.email;
      const isUsernameMatch = username === storedUser.username;
      const isPasswordMatch = hashedPassword === storedUser.hashedPassword;

      if ((isEmailMatch || isUsernameMatch) && isPasswordMatch) {
        setUser(storedUser);
        return true;
      }

      // If credentials don't match, return false
      return false;
    }

    // No stored user, so treat this as a registration
    return register(username, email, password);
  };

  const register = (
    username: string,
    email: string,
    password: string
  ): boolean => {
    // Validate registration inputs
    const isValidRegistration =
      validateUsername(username) &&
      validateEmail(email) &&
      validatePassword(password);

    if (!isValidRegistration) {
      return false;
    }

    // Check if a user already exists
    if (storedUser) {
      return false;
    }

    const hashedPassword = hashPassword(password);

    const newUser: EnhancedUser = {
      id: `user_${Date.now().toString()}`,
      username,
      email,
      hashedPassword,
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
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);