export const validateUsername = (username: string): boolean => {
  // Username validation rules
  const minLength = 3;
  const maxLength = 20;
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  return (
    username.length >= minLength &&
    username.length <= maxLength &&
    usernameRegex.test(username)
  );
};

export const validateEmail = (email: string): boolean => {
  // Email validation rules
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return (
    email.trim().length > 0 && 
    email.length <= 100 &&
    emailRegex.test(email)
  );
};

export const validatePassword = (password: string): boolean => {
  // Password validation rules
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber
  );
};

export const validateMessage = (message: string): boolean => {
  // Message validation rules
  const minLength = 1;
  const maxLength = 500;

  return (
    message.trim().length >= minLength && message.trim().length <= maxLength
  );
};