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
  const [user, setUser] = useState<User | null>(null);
  const [, setStoredUser] = useLocalStorage<User | null>("currentUser", null);

  // Check for existing logged-in user on mount
  useEffect(() => {
    const storedCurrentUser = localStorage.getItem("currentUser");
    if (storedCurrentUser) {
      setUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  const login = (identifier: string, password: string): boolean => {
    const hashedPassword = hashPassword(password);
    const foundUser = UserStorage.findUser(identifier, hashedPassword);

    if (foundUser) {
      // Remove sensitive data before setting user
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
    // Validate inputs
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
      hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Attempt to add user to storage
    const userAdded = UserStorage.addUser(newUser);
    
    if (userAdded) {
      // Remove sensitive data before setting user
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);