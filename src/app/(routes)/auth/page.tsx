"use client";

import React from "react";
import { useAuthPage } from "./hooks";
import AnimatedBackground from "@/components/UI/Animated-Bg";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { BiLockAlt } from "react-icons/bi";
import { FaEyeSlash, FaEye } from "react-icons/fa";

export default function AuthPage() {
  const {
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
    toggleAuthMode,
  } = useAuthPage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="w-full max-w-md bg-white/90 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center text-white">
          <h2 className="text-3xl font-bold">
            {authMode === "login" ? "Welcome Back" : "Join Sync"}
          </h2>
          <p className="text-sm text-blue-100 mt-2">
            {authMode === "login"
              ? "Log in to your account"
              : "Create a new account"}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div
              className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 animate-shake"
              role="alert"
            >
              <p className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {authMode === "register" && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRegUser size={20} color="#9ca3af" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 text-blue-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="Choose a username"
                aria-label="Username"
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {authMode === "register" ? (
                <MdOutlineEmail size={20} color="#9ca3af" />
              ) : (
                <FaRegUser size={20} color="#9ca3af" />
              )}
            </div>
            <input
              type="text"
              value={authMode === "register" ? email : identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                authMode === "register"
                  ? setEmail(e.target.value)
                  : setIdentifier(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 text-blue-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder={
                authMode === "register"
                  ? "Enter your email"
                  : "Username or email"
              }
              aria-label={
                authMode === "register" ? "Email" : "Username or Email"
              }
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BiLockAlt size={20} color="#9ca3af" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full pl-10 pr-12 py-3 text-blue-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter your password"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            {authMode === "login" ? "Log In" : "Create Account"}
          </button>

          <div className="text-center text-sm text-gray-500">
            {authMode === "login" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={toggleAuthMode}
                >
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={toggleAuthMode}
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
