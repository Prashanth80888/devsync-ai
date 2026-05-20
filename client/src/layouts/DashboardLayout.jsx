import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FolderKanban, 
  LogOut, 
  Cpu, 
  Settings,
  BarChart2
} from 'lucide-react';

import toast from 'react-hot-toast';

export default function DashboardLayout() {

  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  // ==================================================
  // NAVIGATION ROUTES
  // ==================================================

  const navItems = [

    {
      to: '/',
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: 'Overview',
      exact: true
    },

    {
      to: '/kanban',
      icon: <FolderKanban className="w-4 h-4" />,
      label: 'Kanban Boards',
      exact: false
    },

    {
      to: '/analytics',
      icon: <BarChart2 className="w-4 h-4" />,
      label: 'Telemetry Analytics',
      exact: false
    },

    {
      to: '/settings',
      icon: <Settings className="w-4 h-4" />,
      label: 'Settings',
      exact: false
    },

    {
      to: '/teams',
      icon: <Users className="w-4 h-4" />,
      label: 'Organizations',
      exact: false
    },

    {
      to: '/chat',
      icon: <MessageSquare className="w-4 h-4" />,
      label: 'Team Chat',
      exact: false
    }

  ];

  // ==================================================
  // LOGOUT HANDLER
  // ==================================================

  const handleLogoutClick = () => {

    try {

      if (logout) {
        logout();
      }

      toast.success(
        'Secure session terminated successfully.'
      );

      navigate('/auth/login');

    } catch (error) {

      toast.error(
        'Error terminating auth session.'
      );
    }
  };

  // ==================================================
  // COMPONENT RENDER
  // ==================================================

  return (

    <div className="min-h-screen bg-[#070A13] text-slate-100 flex overflow-hidden">

      {/* ==================================================
          SIDEBAR NAVIGATION
      ================================================== */}

      <aside className="w-64 bg-[#090D1A] border-r border-slate-800/80 flex flex-col shrink-0 justify-between">

        <div className="flex flex-col flex-1">

          {/* Logo */}
          <div className="p-6 border-b border-slate-800/60 flex items-center space-x-3">

            <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-600/10">
              <Cpu className="w-5 h-5" />
            </div>

            <span className="font-bold text-base tracking-tight text-white">
              DevSync AI
            </span>

          </div>

          {/* User Profile */}
          <div className="p-4 mx-3 my-4 bg-[#0E1324]/60 border border-slate-800/40 rounded-xl flex items-center gap-3">

            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-xs font-bold shrink-0">

              {user?.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : 'E'}

            </div>

            <div className="min-w-0 flex-1">

              <h4 className="text-xs font-bold text-slate-200 truncate">
                {user?.fullName || 'Active Engineer'}
              </h4>

              <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">
                {user?.role || 'Developer'}
              </span>

            </div>

          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1.5">

            {navItems.map((item) => (

              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}

                className={({ isActive }) =>

                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group border ${
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border-transparent'
                  }`
                }
              >

                {item.icon}

                <span>{item.label}</span>

              </NavLink>

            ))}

          </nav>

        </div>

        {/* ==================================================
            FOOTER LOGOUT
        ================================================== */}

        <div className="p-4 border-t border-slate-800/60 bg-[#060912]">

          <button
            onClick={handleLogoutClick}

            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-150 cursor-pointer group"
          >

            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />

            <span>Sign Out Session</span>

          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN CONTENT AREA
      ================================================== */}

      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Header */}
        <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-8 bg-[#090D1A]/40 backdrop-blur-md shrink-0">

          <div className="text-xs text-slate-400 font-mono tracking-wider flex items-center gap-2">

            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

            WORKSPACE // PRODUCTION_ACTIVE

          </div>

          <div className="flex items-center space-x-4">

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold flex items-center justify-center text-white border border-slate-700 shadow-sm shadow-indigo-500/20">

              {user?.fullName
                ? user.fullName.substring(0, 2).toUpperCase()
                : 'DS'}

            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="p-8 flex-1 overflow-y-auto bg-gradient-to-b from-[#070A13] to-[#04060A]">

          <Outlet />

        </main>

      </div>

    </div>
  );
}