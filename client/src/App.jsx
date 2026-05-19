import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

// Core structural layout components
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// View components mapping to the workspace routes
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HomeDashboard from './pages/dashboard/HomeDashboard';

export default function App() {

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
          element: (
            <div className="text-slate-300 font-medium">
              Kanban Board View Placeholder
            </div>
          )
        },

        {
          path: 'chat',
          element: (
            <div className="text-slate-300 font-medium">
              Real-time Messaging Channel Placeholder
            </div>
          )
        },

        {
          path: 'teams',
          element: (
            <div className="text-slate-300 font-medium">
              Organization Management Cluster Placeholder
            </div>
          )
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

  return (
    <>

      {/* Toast Notification Container */}
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