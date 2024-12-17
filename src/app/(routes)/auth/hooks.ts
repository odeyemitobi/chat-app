import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "@/lib/validation";

export const useAuthPage = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, login } = useAuth();
  const router = useRouter();

  // Check localStorage for existing user
  const [storedUser] = useLocalStorage("chatUser", null);

  // If user exists in localStorage, automatically redirect to chat
  useEffect(() => {
    if (storedUser) {
      router.push("/chat");
    }
  }, [storedUser, router]);

  const handleSubmit = async () => {
    setError("");

    if (authMode === "register") {
      if (!validateUsername(username)) {
        setError(
          "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
        );
        return false;
      }
      if (!validateEmail(email)) {
        setError("Invalid email address");
        return false;
      }
      if (!validatePassword(password)) {
        setError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
        );
        return false;
      }

      try {
        const success = await register(username, email, password);
        if (success) {
          router.push("/chat");
          return true;
        }
        setError("Registration failed. Please try again.");
        return false;
      } catch (err) {
        setError("Registration failed. Please try again.");
        console.error("Error registering user:", err);
        return false;
      }
    } else {
      // Login mode
      if (!validateUsername(username) && !validateEmail(email)) {
        setError("Please enter a valid username or email");
        return false;
      }
      if (!password) {
        setError("Please enter your password");
        return false;
      }

      try {
        const success = await login(username, email, password);
        if (success) {
          router.push("/chat");
          return true;
        }
        setError("Login failed. Please check your credentials and try again.");
        return false;
      } catch (err) {
        setError("Login failed. Please check your credentials and try again.");
        console.error("Error logging in:", err);
        return false;
      }
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  };

  return {
    authMode,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
    toggleAuthMode,
    storedUser,
  };
};
