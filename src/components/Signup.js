import React, { useState } from 'react';
import { createUser } from '../services/api';
import { validateEmail, validatePassword } from '../utils/validation';
import '../css/Signup.css';

const Signup = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      setMessage(null); // Clear success message
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      setMessage(null); // Clear success message
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error);
      setMessage(null); // Clear success message
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setMessage(null); // Clear success message
      return;
    }

    setIsLoading(true);
    setError(null); // Clear error message
    setMessage(null);

    try {
      await createUser(email, password);
      setMessage({ type: 'success', text: 'User created successfully.' });
      setError(null); // Ensure no error message is shown
    } catch (err) {
      const errorMessage = err.includes('Email already exists')
        ? 'The email address is already taken. Please use a different email.'
        : 'An error occurred during signup.';
      setError(errorMessage);
      setMessage(null); // Clear success message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-header">Sign Up</h1>
      <input
        className="signup-input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="signup-input"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="signup-input"
        type="password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button className="signup-button" onClick={handleSignup} disabled={isLoading}>
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
      <p className="navigation-text" onClick={onSwitchToLogin}>
        I already have an account
      </p>
      {error && !message && <p className="signup-error-text">{error}</p>}
      {message && (
        <p className={`signup-message-text ${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default Signup;
