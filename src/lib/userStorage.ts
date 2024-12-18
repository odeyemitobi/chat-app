// lib/userStorage.ts
import { User } from "@/types/chat";

interface StoredUser extends User {
  hashedPassword: string;
  createdAt: string;
}

export class UserStorage {
  private static USERS_KEY = "chatapp_users";

  // Get all stored users
  static getUsers(): StoredUser[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // Save a new user
  static addUser(user: StoredUser): boolean {
    const users = this.getUsers();

    // Check if user already exists
    const existingUserIndex = users.findIndex(
      (u) => u.email === user.email || u.username === user.username
    );

    if (existingUserIndex !== -1) {
      return false; // User already exists
    }

    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }

  // Find user by username or email
  static findUser(identifier: string, password: string): StoredUser | null {
    const users = this.getUsers();
    return (
      users.find(
        (user) =>
          (user.username === identifier || user.email === identifier) &&
          user.hashedPassword === password
      ) || null
    );
  }

  // Update user information
  static updateUser(userId: string, updatedUser: Partial<StoredUser>): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) return false;

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }

  // Delete a user (if needed)
  static deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter((u) => u.id !== userId);

    if (users.length === filteredUsers.length) return false;

    localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
    return true;
  }
}
