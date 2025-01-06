import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkUserVerificationStatus } from '../services/api';

const HomePage = () => {
  const { id } = useSelector((state) => state.user); // Ensure user state is consistent
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [isVerified, setIsVerified] = useState(null); // Verification status
  const hasCheckedVerification = useRef(false); // Ref to prevent duplicate API calls

  useEffect(() => {
    const verifyUserStatus = async () => {
      if (hasCheckedVerification.current) return; // Skip if already checked

      hasCheckedVerification.current = true; // Mark as checked

      try {
        // Call API to check if user is verified
        const verified = await checkUserVerificationStatus(id);

        // Update verification status
        setIsVerified(verified);
      } catch (error) {
        console.error('Error checking verification status:', error);

        // Redirect to login if the user doesn't exist or an error occurs
        navigate('/login');
      } finally {
        // Stop the loading spinner
        setIsLoading(false);
      }
    };

    if (id) {
      verifyUserStatus();
    } else {
      // If no user ID is available, redirect to the login page
      navigate('/login');
    }
  }, [id, navigate]);

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>; // Display loading spinner while checking
  }

  if (isVerified === false) {
    // If not verified, display warning and redirect button
    return (
      <div className="verification-warning">
        <p className="warning-text">
          Your email is not verified. Please verify your account to access the home page.
        </p>
        <button
          className="verify-now-button"
          onClick={() => navigate('/verify-account')}
        >
          Verify Now
        </button>
      </div>
    );
  }

  // Render home page content if the user is verified
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>You have successfully logged in!</p>
    </div>
  );
};

export default HomePage;
