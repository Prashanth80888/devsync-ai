import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function SetupWorkspace() {
  const navigate = useNavigate();
  const { user, createOrganization, isLoading, isAuthenticated } = useAuthStore();
  const [orgName, setOrgName] = useState('');

  // Protect against unauthenticated views or users who already possess active workspaces
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user && user.orgId) return <Navigate to="/" replace />;

  const handleWorkspaceSubmission = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) {
      return toast.error('Please input an enterprise workspace name.');
    }

    const output = await createOrganization(orgName);
    if (output.success) {
      toast.success('Your corporate cluster workspace has successfully spun up!');
      navigate('/');
    } else {
      toast.error(output.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A13] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative localized space backdrop radial lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0D1222]/80 backdrop-blur-xl border border-slate-800/80 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm tracking-tighter">D</div>
          <span className="text-sm font-semibold tracking-wider uppercase text-slate-200">DevSync AI</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Initialize your engineering workspace</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          DevSync relies on isolated organization environments to securely anchor tasks, chat logs, and repository connections.
        </p>

        <form onSubmit={handleWorkspaceSubmission} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
              Organization / Company Name
            </label>
            <input 
              type="text" 
              placeholder="e.g., Acme Dev Studio" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              disabled={isLoading}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50" 
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 disabled:bg-indigo-800/50 disabled:text-slate-400 text-sm font-semibold text-white rounded-xl transition-all duration-150 shadow-lg shadow-indigo-600/10 cursor-pointer flex justify-center items-center"
          >
            {isLoading ? 'Allocating Cloud Workspace...' : 'Launch Workspace Cluster'}
          </button>
        </form>
      </div>
    </div>
  );
}