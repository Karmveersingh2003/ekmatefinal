import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const AdminRoute = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure currentUser is loaded
    const timer = setTimeout(() => {
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser]);

  // Show loading indicator while checking authentication and user role
  if (loading || checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('User not authenticated, redirecting to signin');
    // Not logged in, redirect to login page
    return <Navigate to="/signin" replace />;
  }

  // Check if user has admin role
  if (!currentUser || currentUser.role !== 'admin') {
    console.log('User not admin, redirecting to dashboard. User role:', currentUser?.role);
    // Not an admin, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Admin access granted, rendering admin panel');
  // User is authenticated and has admin role, render the protected route
  return <Outlet />;
};

export default AdminRoute;
