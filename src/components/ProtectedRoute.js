import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { id, email } = useSelector((state) => state.user);

  // Check if user is logged in
  if (!id || !email) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
