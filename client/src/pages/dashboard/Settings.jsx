import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Shield, Bell, Save, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateProfile } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  
  // Local form state instantiated directly from the global auth store
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    role: user?.role || 'Developer',
    notifications: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      return toast.error('Display signature name cannot be blank.');
    }

    setIsSaving(true);
    try {
      // Simulating network persistence delay for state update verification
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (updateProfile) {
        updateProfile({ fullName: formData.fullName, role: formData.role });
      }
      
      toast.success('Workspace profile updated successfully.');
    } catch (error) {
      toast.error('Failed to commit profile configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* View Header Meta Grid */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your engineer profile signature and localized node clusters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Navigation Sidebar Sub-Tabs Quick Glance */}
        <div className="space-y-2 bg-[#090D1A]/40 border border-slate-800/60 p-3 rounded-2xl">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-left">
            <User className="w-4 h-4" />
            <span>Profile Configuration</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-300 border border-transparent text-left cursor-not-allowed" disabled>
            <Shield className="w-4 h-4" />
            <span>Security Keys (IAM)</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-300 border border-transparent text-left cursor-not-allowed" disabled>
            <Bell className="w-4 h-4" />
            <span>Webhooks & Alerts</span>
          </button>
        </div>

        {/* Primary Settings Form Panel Block */}
        <div className="md:col-span-2 bg-[#090D1A] border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800/60 bg-slate-950/20 flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Identity Target Specs</h3>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
            
            {/* Full Name Input Field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">Full Signature Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-[#060912] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none transition-all focus:ring-1 focus:ring-indigo-500/20 font-sans"
                placeholder="John Doe"
              />
            </div>

            {/* Email Field (Disabled Read-Only Baseline Anchor) */}
            <div className="space-y-2 opacity-60">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">Account Email Endpoint</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full bg-[#04060C] border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed outline-none font-mono"
              />
            </div>

            {/* Team Dev Role Field Selection Dropdown */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">Cluster Role Privilege</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-[#060912] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none transition-all focus:ring-1 focus:ring-indigo-500/20 font-sans"
              >
                <option value="Developer">Developer</option>
                <option value="Lead Engineer">Lead Engineer</option>
                <option value="Systems Architect">Systems Architect</option>
                <option value="DevOps Specialist">DevOps Specialist</option>
              </select>
            </div>

            {/* Checkbox Slider Block */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-semibold text-slate-300">Live Telemetry Streams</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Toggle instant background notification pings via system socket hooks.</p>
              </div>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-slate-800 bg-[#060912] text-indigo-600 focus:ring-indigo-500/20 accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Form Action Submit Footer */}
            <div className="pt-4 border-t border-slate-800/60 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/10"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving Specs...' : 'Save Configuration'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}