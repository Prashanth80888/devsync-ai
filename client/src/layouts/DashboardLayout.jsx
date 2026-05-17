import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, FolderKanban, LogOut, Cpu } from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
    { to: '/kanban', icon: <FolderKanban className="w-4 h-4" />, label: 'Kanban Boards' },
    { to: '/chat', icon: <MessageSquare className="w-4 h-4" />, label: 'Team Chat' },
    { to: '/teams', icon: <Users className="w-4 h-4" />, label: 'Organizations' },
  ];

  const handleLogoutPlaceholder = () => {
    // Structural target for token purging clear scripts later
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 flex overflow-hidden">
      
      {/* Global Fixed Sidebar Navigation Shell */}
      <aside className="w-64 bg-[#090D1A] border-r border-slate-800/80 flex flex-col shrink-0">
        {/* Workspace Branding Element */}
        <div className="p-6 border-b border-slate-800/60 flex items-center space-x-3">
          <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">DevSync AI</span>
        </div>

        {/* Navigation Routes System */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Session Profile Footbar Area */}
        <div className="p-4 border-t border-slate-800/60 bg-[#060912]">
          <button 
            onClick={handleLogoutPlaceholder}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Baseline</span>
          </button>
        </div>
      </aside>

      {/* Main Execution View Canvas Wrapper */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Global Dashboard Subheader Meta Panel */}
        <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-8 bg-[#090D1A]/40 backdrop-blur-md">
          <div className="text-xs text-slate-400 font-mono tracking-wider">
            WORKSPACE // PRODUCTION_ACTIVE
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold flex items-center justify-center text-white border border-slate-700">
              DS
            </div>
          </div>
        </header>

        {/* Mounted Child Target Route Page Grid */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}