import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-1">Create organization</h3>
      <p className="text-xs text-slate-400 mb-6">Initialize your sovereign team cluster environment</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Organization Handle</label>
          <input 
            type="text" 
            placeholder="e.g. acme-labs" 
            disabled
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none cursor-not-allowed" 
          />
        </div>

        <button 
          disabled
          className="w-full py-3 px-4 bg-slate-800 text-sm font-semibold text-slate-500 rounded-xl border border-slate-700/30 cursor-not-allowed"
        >
          Registration Locked until API Integration
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
        <p className="text-xs text-slate-400">
          Already verified?{' '}
          <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign inside active session
          </Link>
        </p>
      </div>
    </div>
  );
}