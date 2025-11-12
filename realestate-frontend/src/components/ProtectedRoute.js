import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple placeholder route protection for now
const ProtectedRoute = ({ children }) => {
  // You can replace this with real auth check later
  const isAdminLoggedIn = true; // temporary

  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
