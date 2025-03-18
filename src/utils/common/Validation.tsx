const isEmpty = (inputValue: string): boolean => {
  return inputValue.trim().length === 0;
};

const isValidEmail = (inputValue: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(inputValue.trim());
};

export { isEmpty, isValidEmail };
