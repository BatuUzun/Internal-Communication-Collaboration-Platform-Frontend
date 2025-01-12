import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import { checkUserVerificationStatus } from '../services/api';
import LogoutButton from './LogoutButton'; // Import the reusable LogoutButton component

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [isVerified, setIsVerified] = useState(null); // Verification status
  const hasCheckedVerification = useRef(false); // Ref to prevent duplicate API calls

  // Fetch `id` and `email` from cookies
  const id = Cookies.get('userId');
  const email = Cookies.get('userEmail');

  useEffect(() => {
    const verifyUserStatus = async () => {
      if (hasCheckedVerification.current) return; // Skip if already checked

      hasCheckedVerification.current = true; // Mark as checked

      try {
        if (!id || !email) {
          // Redirect to login if cookies are missing
          navigate('/login');
          return;
        }

        // Call API to check if the user is verified
        const verified = await checkUserVerificationStatus(id);

        // Update verification status
        setIsVerified(verified);
      } catch (error) {
        console.error('Error checking verification status:', error);

        // Redirect to login if an error occurs
        navigate('/login');
      } finally {
        // Stop the loading spinner
        setIsLoading(false);
      }
    };

    verifyUserStatus();
  }, [id, email, navigate]);

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
      {/* Add the LogoutButton */}
      <LogoutButton />
    </div>
  );
};

export default HomePage;
