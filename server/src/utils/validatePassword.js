// utils/validatePassword.js

export function validatePassword(password) {
  // Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  return strongPasswordRegex.test(password);
}
