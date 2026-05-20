import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Shield, Key, Landmark, Save, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsWorkspace() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');

  const handleUpdateIdentity = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error('Identity name parameter cannot be empty.');

    const result = await updateProfile(fullName);
    if (result.success) {
      toast.success('Professional workspace profile updated!');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Settings Panel Overview Header */}
      <div className="bg-[#0D1222]/40 border border-slate-800/50 p-6 rounded-2xl backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Account Management</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your global profile attributes, access criteria, and audit system context properties.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Sidebar Indicator Elements (Static High-Fidelity Labels) */}
        <div className="space-y-2">
          {[
            { label: 'Profile Signature', active: true, icon: User },
            { label: 'Security & Scopes', active: false, icon: Shield },
            { label: 'Tenant Metadata', active: false, icon: Landmark }
          ].map((tab, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-colors ${
                tab.active 
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' 
                  : 'bg-slate-900/20 text-slate-400 border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </div>
          ))}
        </div>

        {/* Core Profile Update Configuration Form Area */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleUpdateIdentity} className="bg-[#0D1222]/40 border border-slate-800/60 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Identity Synchronization
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">Modify your visible professional identifier signature across engineering workflows.</p>
            
            <div className="space-y-1.5 pt-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name Node Label</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Staff Engineer Alexander"
                  required
                  disabled={isLoading}
                  className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors flex items-center gap-2 border border-indigo-500/30 cursor-pointer shadow-lg shadow-indigo-600/5"
                >
                  <Save className="w-3.5 h-3.5" /> {isLoading ? 'Saving...' : 'Commit Change'}
                </button>
              </div>
            </div>
          </form>

          {/* Cryptographic Access Auditing Information Panel */}
          <div className="bg-[#0D1222]/40 border border-slate-800/60 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Immutable Access Context
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">These structural multi-tenant access settings are bound by security policies and cannot be altered directly by engineers.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: 'Authorized Email Signatures', val: user?.email, icon: Key },
                { title: 'Operational Security Role', val: user?.role || 'DEVELOPER', icon: Shield },
                { title: 'Workspace Isolation UUID', val: user?.orgId || 'Root-Cluster-Global', icon: Landmark }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">{item.title}</span>
                  <div className="text-xs font-semibold text-slate-300 truncate font-mono bg-slate-950 px-2.5 py-1.5 border border-slate-800/40 rounded-lg flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /> {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}