import React from 'react';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

// Route Guards
import OrganizationGuard from './components/OrganizationGuard';

// Core Structural Layout Components
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// View Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import HomeDashboard from './pages/dashboard/HomeDashboard';
import SetupWorkspace from './pages/dashboard/SetupWorkspace';

// ==================================================
// ROOT APPLICATION COMPONENT
// ==================================================

export default function App() {

  // ==================================================
  // APPLICATION ROUTING MATRIX
  // ==================================================

  const router = createBrowserRouter([

    // ==================================================
    // PRIVATE PROTECTED DASHBOARD ROUTES
    // ==================================================

    {
      path: '/',

      element: <OrganizationGuard />,

      children: [
        {
          path: '',
          element: <DashboardLayout />,

          children: [

            // Dashboard Home
            {
              path: '',
              element: <HomeDashboard />
            },

            // Kanban
            {
              path: 'kanban',
              element: (
                <div className="text-slate-300 font-medium p-6">
                  Kanban Board View Placeholder
                </div>
              )
            },

            // Team Chat
            {
              path: 'chat',
              element: (
                <div className="text-slate-300 font-medium p-6">
                  Real-time Messaging Channel Placeholder
                </div>
              )
            },

            // Teams
            {
              path: 'teams',
              element: (
                <div className="text-slate-300 font-medium p-6">
                  Organization Management Cluster Placeholder
                </div>
              )
            }

          ]
        }
      ]
    },

    // ==================================================
    // WORKSPACE INITIALIZATION
    // ==================================================

    {
      path: '/setup-workspace',
      element: <SetupWorkspace />
    },

    // ==================================================
    // AUTHENTICATION ROUTES
    // ==================================================

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

    // ==================================================
    // FALLBACK ROUTE
    // ==================================================

    {
      path: '*',
      element: <Navigate to="/" replace />
    }

  ]);

  // ==================================================
  // APPLICATION RENDER
  // ==================================================

  return (
    <>

      {/* Global Toast Notification System */}
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

      {/* Global Router Renderer */}
      <RouterProvider router={router} />

    </>
  );
}