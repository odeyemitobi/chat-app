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

export const validateMessage = (message: string): boolean => {
  // Message validation rules
  const minLength = 1;
  const maxLength = 500;

  return (
    message.trim().length >= minLength && message.trim().length <= maxLength
  );
};
