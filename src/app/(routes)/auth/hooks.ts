import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const useAuthPage = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = () => {
    setError("");

    if (authMode === "register") {
      const success = register(username, email, password);
      if (success) {
        router.push("/chat");
      } else {
        setError("Registration failed. Please check your details.");
      }
    } else {
      const success = login(identifier, password);
      if (success) {
        router.push("/chat");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    // Reset form
    setIdentifier("");
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
  };

  return {
    authMode,
    identifier,
    email,
    username,
    password,
    error,
    showPassword,
    setIdentifier,
    setEmail,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit,
    toggleAuthMode
  };
};
