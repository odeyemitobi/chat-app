'use client';

import { useAuthPage } from './hooks';

export default function AuthPage() {
  const {
    authMode,
    identifier,
    email,
    username,
    password,
    error,
    setIdentifier,
    setEmail,
    setUsername,
    setPassword,
    handleSubmit,
    toggleAuthMode
  } = useAuthPage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center text-white">
          <h2 className="text-3xl font-bold">
            {authMode === 'login' ? 'Welcome Back' : 'Join Sync'}
          </h2>
          <p className="text-sm text-blue-100 mt-2">
            {authMode === 'login' ? 'Log in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 animate-shake" role="alert">
              <p className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {authMode === 'register' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-400"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-blue-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="Choose a username"
                aria-label="Username"
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400"
              >
                {authMode === 'register' ? (
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                ) : (
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                )}
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <input
              type="text"
              value={authMode === 'register' ? email : identifier}
              onChange={(e) => 
                authMode === 'register' 
                  ? setEmail(e.target.value) 
                  : setIdentifier(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 text-blue-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder={
                authMode === 'register' 
                  ? "Enter your email" 
                  : "Username or email"
              }
              aria-label={authMode === 'register' ? "Email" : "Username or Email"}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-blue-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            {authMode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          <div className="text-center text-sm text-gray-500">
            {authMode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
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
                Already have an account?{' '}
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