// src/utils/validation.js
import validator from 'validator';

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    return { isValid: false, error: 'Invalid email address' };
  }
  return { isValid: true, error: null };
};

/**
 * Validates a password.
 * @param {string} password - The password to validate.
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,30}$/;
  if (!validator.matches(password, passwordPattern)) {
    return {
      isValid: false,
      error:
        'Password must be 8-30 characters long, contain at least one uppercase letter, and one special character.',
    };
  }
  return { isValid: true, error: null };
};


/**
 * Validates a verification code.
 * @param {string} code - The verification code to validate.
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validateVerificationCode = (code) => {
  const codePattern = /^\d{6}$/; // Must be exactly 6 digits
  if (!validator.matches(code, codePattern)) {
    return {
      isValid: false,
      error: 'Verification code must be exactly 6 numeric digits.',
    };
  }
  return { isValid: true, error: null };
};