import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

const ProtectedRoute = ({ children }) => {
  const id = Cookies.get('userId');
  const email = Cookies.get('userEmail');

  // Check if user is logged in
  if (!id || !email) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
