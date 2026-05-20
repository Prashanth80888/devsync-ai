import React from 'react';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

// ==================================================
// ROUTE GUARDS
// ==================================================

import ProtectedRoute from './components/auth/ProtectedRoute';

// ==================================================
// LAYOUT COMPONENTS
// ==================================================

import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// ==================================================
// AUTH PAGES
// ==================================================

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SetupWorkspace from './pages/dashboard/SetupWorkspace';

// ==================================================
// DASHBOARD PAGES
// ==================================================

import HomeDashboard from './pages/dashboard/HomeDashboard';
import KanbanBoard from './pages/dashboard/KanbanBoard';
import AnalyticsDashboard from './pages/dashboard/AnalyticsDashboard';
import SettingsWorkspace from './pages/dashboard/SettingsWorkspace';

// ==================================================
// ROOT APPLICATION COMPONENT
// ==================================================

export default function App() {

  // ==================================================
  // APPLICATION ROUTING MATRIX
  // ==================================================

  const router = createBrowserRouter([

    // ==================================================
    // PUBLIC AUTHENTICATION ROUTES
    // ==================================================

    {
      path: '/auth',

      element: <AuthLayout />,

      children: [

        // ==================================================
        // LOGIN
        // ==================================================

        {
          path: 'login',
          element: <Login />
        },

        // ==================================================
        // REGISTER
        // ==================================================

        {
          path: 'register',
          element: <Register />
        }

      ]
    },

    // ==================================================
    // ORGANIZATION WORKSPACE SETUP
    // ==================================================

    {
      path: '/setup-workspace',

      element: (
        <ProtectedRoute>
          <SetupWorkspace />
        </ProtectedRoute>
      )
    },

    // ==================================================
    // PROTECTED DASHBOARD ROUTES
    // ==================================================

    {
      path: '/',

      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),

      children: [

        // ==================================================
        // HOME DASHBOARD
        // ==================================================

        {
          path: '',
          element: <HomeDashboard />
        },

        // ==================================================
        // KANBAN BOARD
        // ==================================================

        {
          path: 'kanban',
          element: <KanbanBoard />
        },

        // ==================================================
        // ANALYTICS DASHBOARD
        // ==================================================

        {
          path: 'analytics',
          element: <AnalyticsDashboard />
        },

        // ==================================================
        // SETTINGS WORKSPACE
        // ==================================================

        {
          path: 'settings',
          element: <SettingsWorkspace />
        },

        // ==================================================
        // TEAM CHAT
        // ==================================================

        {
          path: 'chat',
          element: (
            <div className="text-slate-300 font-medium p-6">
              Real-time Messaging Channel Placeholder
            </div>
          )
        },

        // ==================================================
        // ORGANIZATIONS / TEAMS
        // ==================================================

        {
          path: 'teams',
          element: (
            <div className="text-slate-300 font-medium p-6">
              Organization Management Cluster Placeholder
            </div>
          )
        }

      ]
    },

    // ==================================================
    // FALLBACK REDIRECT
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

      {/* ==================================================
          GLOBAL TOAST NOTIFICATION SYSTEM
      ================================================== */}

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

      {/* ==================================================
          GLOBAL ROUTER RENDERER
      ================================================== */}

      <RouterProvider router={router} />

    </>
  );
}