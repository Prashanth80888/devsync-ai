import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleFormSubmissionPlaceholder = (e) => {
    e.preventDefault();
    // Redirect cleanly to operational dashboard area until core API setup executes
    navigate('/');
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-1">Welcome back</h3>
      <p className="text-xs text-slate-400 mb-6">Enter your account credentials to access your workspaces</p>

      <form onSubmit={handleFormSubmissionPlaceholder} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            disabled
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors cursor-not-allowed" 
            value="demo.engineer@devsync.ai"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Account Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            disabled
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors cursor-not-allowed" 
            value="password123"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 text-sm font-semibold text-white rounded-xl transition-all duration-150 shadow-lg shadow-indigo-600/10 mt-2 cursor-pointer"
        >
          Bypass to Live Dashboard (Demo)
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
        <p className="text-xs text-slate-400">
          New to the platform?{' '}
          <Link to="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Create an organization account
          </Link>
        </p>
      </div>
    </div>
  );
}