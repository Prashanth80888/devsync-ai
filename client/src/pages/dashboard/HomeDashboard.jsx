import React from 'react';
import { Activity, Layout, Terminal, Code } from 'lucide-react';

export default function HomeDashboard() {
  const stats = [
    { title: 'Connected Nodes', value: 'Active API Core', icon: <Terminal className="text-indigo-400 w-5 h-5" /> },
    { title: 'Project Trackers', value: '0 Verified', icon: <Layout className="text-purple-400 w-5 h-5" /> },
    { title: 'AI Code Evaluations', value: 'Ready/Standby', icon: <Code className="text-emerald-400 w-5 h-5" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper Layout Heading Block */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">System Architecture Control Overview</h2>
        <p className="text-sm text-slate-400 mt-1">Real-time status view across initialized frontend layout route slots.</p>
      </div>

      {/* Grid Layout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0F1424]/40 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 tracking-wider block mb-1">{stat.title}</span>
              <span className="text-lg font-bold text-slate-200">{stat.value}</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Technical Execution Status Notice Card */}
      <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6 flex items-start space-x-4">
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-200">System Gateway State Notice</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
            You are viewing the initial frontend single-page execution engine built with React Router DOM. All route shells, layout nodes, dynamic link states, and sidebar modules have been configured to follow modern engineering standards.
          </p>
        </div>
      </div>
    </div>
  );
}