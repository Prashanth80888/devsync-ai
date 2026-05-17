import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#070A13] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Structural ambient styling mesh */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        {/* Branding header shared across login & register views */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl shadow-indigo-500/10 mb-4">
            <Cpu className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">DevSync AI</h2>
          <p className="text-sm text-slate-400 mt-1">The AI-powered workspace for engineering teams</p>
        </div>

        {/* Dynamic child view mounting injection node */}
        <div className="bg-[#0F1424]/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <Outlet />
        </div>

        {/* Global bottom-anchored semantic references */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors duration-150 font-mono">
            ← Back to System Dashboard Placeholder
          </Link>
        </div>
      </div>
    </div>
  );
}