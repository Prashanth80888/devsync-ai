import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function OrganizationGuard() {
  const { user, isAuthenticated } = useAuthStore();

  // 1. Kick unauthenticated sessions completely back to the login module shell
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. Intercept users who lack an assigned workspace organization, routing them to setup parameters
  if (user && !user.orgId) {
    return <Navigate to="/setup-workspace" replace />;
  }

  // 3. Render downstream child components safely if the user belongs to an organization
  return <Outlet />;
}