import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * ProtectedRoute Component Guard
 * Intercepts unauthenticated page views and routes traffic cleanly back to the authentication portal
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const location = useLocation();

  // Trigger a token verification check if the app is initialized or refreshed
  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  // Render a clean glassmorphic loading screen while checking the validation tokens
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#04060C] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Verifying Security Matrix...
        </span>
      </div>
    );
  }

  // If the verification check finishes and the user is not authenticated, bounce them to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Pass-through safely if the user possesses a validated cryptographic session token
  return children;
}