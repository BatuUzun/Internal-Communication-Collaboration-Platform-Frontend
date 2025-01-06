import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  sendVerificationCode,
  validateCode,
  checkUserVerificationStatus,
} from '../services/api';
import { RequestType } from '../utils/enum';
import { validateVerificationCode } from '../utils/validation';
import '../css/VerifyAccount.css';

const VerifyAccount = () => {
  const { id, email } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // For initial loading and other API calls
  const [isVerifyingCode, setIsVerifyingCode] = useState(false); // Specific loading state for validateCode
  const [message, setMessage] = useState('');
  const [isMessageError, setIsMessageError] = useState(false);
  const [buttonText, setButtonText] = useState('Send Email');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isRedirectVisible, setIsRedirectVisible] = useState(false);
  const [isVerificationSuccessful, setIsVerificationSuccessful] = useState(false);

  // Ref to prevent duplicate API calls
  const hasCheckedVerification = useRef(false);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (hasCheckedVerification.current) return; // Skip if already checked

      hasCheckedVerification.current = true; // Mark as checked
      try {
        console.log('Checking verification status...');
        const isVerified = await checkUserVerificationStatus(id);
        if (isVerified) {
          navigate('/home'); // Navigate to home if already verified
        } else {
          console.log('User not verified, displaying VerifyAccount content...');
          setIsLoading(false); // Show content if not verified
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        if (error?.status === 404) {
          navigate('/login'); // Navigate to login if the user does not exist
        } else {
          setIsLoading(false); // Show content in case of other errors
        }
      }
    };

    if (id) {
      setIsLoading(true); // Ensure loading state is reset on navigation
      checkVerificationStatus();
    } else {
      navigate('/login'); // Navigate to login if no user ID is present
    }
  }, [id, navigate]);

  useEffect(() => {
    let timer;
    if (remainingSeconds > 0) {
      timer = setTimeout(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0) {
      setIsButtonDisabled(false); // Re-enable the button when the timer ends
    }
    return () => clearTimeout(timer);
  }, [remainingSeconds]);

  const handleSendEmail = async () => {
    if (!id) {
      setMessage('User ID is missing. Unable to send the verification email.');
      setIsMessageError(true);
      return;
    }

    setMessage('');
    setIsLoading(true);
    setIsButtonDisabled(true);
    setRemainingSeconds(60);

    try {
      await sendVerificationCode({ userId: id, requestType: RequestType.VERIFY });
      setMessage('Verification email has been sent successfully.');
      setIsMessageError(false);
      setButtonText('Resend');
    } catch (error) {
      setMessage('Failed to send the verification email. Please try again.');
      setIsMessageError(true);
      setIsButtonDisabled(false);
      setRemainingSeconds(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (event) => {
    setVerificationCode(event.target.value);
    setVerificationError('');
  };

  const handleVerifyCode = async () => {
    const { isValid, error } = validateVerificationCode(verificationCode);
    if (!isValid) {
      setVerificationError(error);
      return;
    }

    try {
      setIsVerifyingCode(true); // Start loading for validate code
      await validateCode({
        userId: id,
        verificationCode,
        requestType: RequestType.VERIFY,
      });

      setMessage('Verification successful! Redirecting in 5 seconds...');
      setIsMessageError(false);
      setIsRedirectVisible(true);
      setIsVerificationSuccessful(true); // Mark as successful to disable button

      setTimeout(() => {
        navigate('/home');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data || 'Verification failed. Please try again.');
      setIsMessageError(true);
      setIsRedirectVisible(false);
      setIsVerificationSuccessful(false);
    } finally {
      setIsVerifyingCode(false); // End loading for validate code
    }
  };

  const handleImmediateRedirect = () => {
    navigate('/home');
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="verify-account-container">
      <h1>Verify Your Account</h1>
      {email ? (
        <>
          {!isVerificationSuccessful && (
            <>
              <p>
                To continue using your account, you must verify your email address. A verification email
                is going to be sent to: <strong>{email}</strong>.
              </p>
              <p>If you want to verify your account, click on the "Send Email" button.</p>
              <button
                className="resend-verification-button"
                onClick={handleSendEmail}
                disabled={isLoading || isButtonDisabled}
              >
                {isLoading ? 'Sending...' : buttonText}
              </button>
              {isButtonDisabled && (
                <p>Wait {remainingSeconds} second{remainingSeconds > 1 ? 's' : ''} before sending again.</p>
              )}
            </>
          )}
          {message && (
            <p className={isMessageError ? 'error-text' : 'success-text'}>
              {message}
            </p>
          )}
          {buttonText === 'Resend' && (
            <div className="verification-code-container">
              <label htmlFor="verification-code">Enter Verification Code:</label>
              <input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="Enter the code"
                className="verification-code-input"
                disabled={isVerificationSuccessful}
              />
              {verificationError && <p className="error-text">{verificationError}</p>}
              <button
                className="verify-button"
                onClick={handleVerifyCode}
                disabled={
                  isVerifyingCode || 
                  isVerificationSuccessful || 
                  !verificationCode || 
                  verificationCode.length !== 6
                }
              >
                {isVerifyingCode ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          )}
          {isRedirectVisible && (
            <div className="redirect-container">
              <p>If you want to skip waiting, click the button below to proceed:</p>
              <button className="redirect-button" onClick={handleImmediateRedirect}>
                Redirect Now
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default VerifyAccount;
