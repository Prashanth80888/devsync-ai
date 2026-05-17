import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Core structural layout components
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// View components mapping to the workspace routes
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HomeDashboard from './pages/dashboard/HomeDashboard';

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
    // High-performance fallback path boundary handler for unmatched strings
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}