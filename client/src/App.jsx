import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Core structural layout components
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// View components mapping to the workspace routes
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HomeDashboard from './pages/dashboard/HomeDashboard';

export default function App() {
  const { checkAuthStatus, isLoading } = useAuthStore();

  // Root Initialization Lifecycle Trigger: Validates backend user records on entry refresh
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Declarative decoupled routing definition matrix
  const router = createBrowserRouter([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '',
          element: <HomeDashboard />
        },
        {
          path: 'kanban',
          element: <div className="text-slate-300 font-medium">Kanban Board View Placeholder</div>
        },
        {
          path: 'chat',
          element: <div className="text-slate-300 font-medium">Real-time Messaging Channel Placeholder</div>
        },
        {
          path: 'teams',
          element: <div className="text-slate-300 font-medium">Organization Management Cluster Placeholder</div>
        }
      ]
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'register',
          element: <Register />
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);

  // Industry practice: Render a clean system loading screen during token checks
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A13] flex flex-col items-center justify-center font-mono text-xs text-indigo-400 tracking-widest uppercase">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        Synchronizing Platform Cluster...
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification Container with a dark aesthetic that matches our UI */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F1424',
            color: '#F8FAFC',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            fontSize: '14px'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#0F1424'
            }
          }
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}