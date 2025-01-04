import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUserLogin } from '../services/api';
import { validateEmail, validatePassword } from '../utils/validation';
import '../css/Signup.css';

const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await checkUserLogin({ email, password, rememberMe });
      navigate('/home');
    } catch (err) {
      setError(
        typeof err === 'string'
          ? err
          : 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-header">Login</h1>
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
      <div className="remember-me-container">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="rememberMe">Remember Me</label>
      </div>
      <button className="signup-button" onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging In...' : 'Login'}
      </button>
      <p className="navigation-text" onClick={onSwitchToSignup}>
        I don't have an account
      </p>
      <p className="navigation-text" onClick={() => navigate('/forgot-password')}>
        I forgot my password
      </p>
      {error && <p className="signup-error-text">{error}</p>}
    </div>
  );
};

export default Login;
