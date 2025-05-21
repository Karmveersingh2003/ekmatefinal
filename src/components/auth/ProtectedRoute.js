import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = () => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure currentUser is loaded
    const timer = setTimeout(() => {
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser]);

  // Show loading indicator while checking authentication
  if (loading || checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect admin users to admin panel
  if (currentUser && currentUser.role === 'admin') {
    console.log('Admin user attempting to access user dashboard, redirecting to admin panel');
    return <Navigate to="/admin" replace />;
  }

  // Render child routes if authenticated and not an admin
  return <Outlet />;
};

export default ProtectedRoute;
