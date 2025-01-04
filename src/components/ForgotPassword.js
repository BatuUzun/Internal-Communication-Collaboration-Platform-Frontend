import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  validateEmail,
  validatePassword,
  validateVerificationCode,
} from '../utils/validation';
import { checkEmail, sendVerificationCode, validateCode, updatePassword } from '../services/api';
import '../css/ForgotPassword.css';
import { RequestType } from '../utils/enum';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleCheckEmail = async () => {
    setError(null);
    setMessage(null);

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }
 
    setIsLoading(true);

    try {
      const fetchedUserId = await checkEmail(email);
      if (fetchedUserId !== -1) {
        setMessage('Email is valid and exists in our system.');
        setUserId(fetchedUserId);
        setIsEmailValidated(true);

        await sendVerificationCode({ userId: fetchedUserId, requestType: RequestType.RESET });
        setMessage('A verification code has been sent to your email.');
      } else {
        setError('Email does not exist in our system. Please try again.');
      }
    } catch (err) {
      console.error('Error in handleCheckEmail:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateCode = async () => {
    setError(null);
    setMessage(null);

    const codeValidation = validateVerificationCode(verificationCode);
    if (!codeValidation.isValid) {
      setError(codeValidation.error);
      return;
    }

    setIsLoading(true);

    try {
      await validateCode({
        userId,
        verificationCode,
        requestType: RequestType.RESET,
      });

      setMessage('Verification code is valid.');
      setIsCodeValidated(true);
    } catch (err) {
      console.error('Error in handleValidateCode:', err);
      setError('Invalid or expired verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e, handler) => {
    if (e.keyCode === 13 || e.which === 13) {
      handler(); // Trigger the corresponding handler when Enter is pressed
    }
  };

  const handleUpdatePassword = async () => {
    setError(null);
    setMessage(null);

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword({ id: userId, newPassword });
      setMessage('Password updated successfully. You will be redirected to the login page in 5 seconds.');
      setIsPasswordChanged(true);

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      console.error('Error in handleUpdatePassword:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      {!isEmailValidated ? (
        <>
          <p>Enter your email address to check if it's valid and exists in our system.</p>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleCheckEmail)} // Handle Enter for email
            />
          </div>
          <button className="form-button" onClick={handleCheckEmail} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Check Email'}
          </button>
        </>
      ) : !isCodeValidated ? (
        <>
          <p>Enter the 6-digit verification code sent to your email.</p>
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleValidateCode)} // Handle Enter for verification code
            />
          </div>
          <button className="form-button" onClick={handleValidateCode} disabled={isLoading}>
            {isLoading ? 'Validating...' : 'Validate Code'}
          </button>
        </>
      ) : (
        <>
          {!isPasswordChanged && (
            <>
              <p>Enter your new password.</p>
              <div className="form-group">
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, handleUpdatePassword)} // Handle Enter for password
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, handleUpdatePassword)} // Handle Enter for confirm password
                />
              </div>
              <button className="form-button" onClick={handleUpdatePassword} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </>
          )}
        </>
      )}
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      {isPasswordChanged && (
        <button className="form-button" onClick={() => navigate('/login')}>
          Click here if you are not redirected
        </button>
      )}
    </div>
  );
};

export default ForgotPassword;
