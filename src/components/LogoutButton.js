import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import '../css/LogoutButton.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await logout();

      // Clear localStorage
      localStorage.clear();

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
