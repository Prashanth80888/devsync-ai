import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { BarChart2, PieChart, Layers, CheckCircle2, TrendingUp, ShieldAlert, Zap, RefreshCw } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { metrics, isMetricsLoading, fetchSummaryMetrics } = useAnalyticsStore();

  useEffect(() => {
    fetchSummaryMetrics();
  }, []);

  if (isMetricsLoading || !metrics) {
    return (
      <div className="h-96 border border-dashed border-slate-800/80 rounded-2xl flex flex-col items-center justify-center space-y-4">
        <div className="w-6 h-6 border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Aggregating Enterprise Data Vectors...</span>
      </div>
    );
  }

  const { summary, statusDistribution, priorityDistribution } = metrics;

  return (
    <div className="space-y-8">
      {/* Upper Analytics Header Action Segment */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0D1222]/40 border border-slate-800/50 p-6 rounded-2xl gap-4 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Performance & Insights</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time analytical computations for cross-functional sprint operational flows.</p>
        </div>
        <button
          onClick={fetchSummaryMetrics}
          className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors duration-150 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Force Metrics Sync
        </button>
      </div>

      {/* Numerical Data Summary Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects Monitored', value: summary.totalProjects, icon: Layers, tint: 'text-indigo-400 bg-indigo-500/5' },
          { label: 'Total Allocated Squads', value: summary.totalTeams, icon: Zap, tint: 'text-emerald-400 bg-emerald-500/5' },
          { label: 'Total Task Documents', value: summary.totalTasks, icon: PieChart, tint: 'text-amber-400 bg-amber-500/5' },
          { label: 'Sprint Velocity Index', value: `${summary.projectVelocity}%`, icon: TrendingUp, tint: 'text-pink-400 bg-pink-500/5' }
        ].map((card, i) => (
          <div key={i} className="bg-[#0D1222]/60 border border-slate-800/60 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">{card.label}</span>
              <span className="text-3xl font-bold text-white tracking-tight block">{card.value}</span>
            </div>
            <div className={`p-3 rounded-xl border border-slate-800/50 ${card.tint}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Structural Visual Metrics Grid Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Layout Item 1: Workflow Lifecycle Lanes Distribution (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-[#0D1222]/40 border border-slate-800/60 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-1 mb-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" /> Operational Stage Task Densities
            </h3>
            <p className="text-xs text-slate-500">Volumetric assessment of tickets mapped across available status lanes.</p>
          </div>

          <div className="space-y-5">
            {[
              { statusId: 'TODO', label: 'Backlog Inventory', value: statusDistribution.TODO, color: 'bg-slate-600' },
              { statusId: 'IN_PROGRESS', label: 'Active Implementation', value: statusDistribution.IN_PROGRESS, color: 'bg-indigo-500' },
              { statusId: 'REVIEW', label: 'Quality Assurance Phase', value: statusDistribution.REVIEW, color: 'bg-amber-500' },
              { statusId: 'DONE', label: 'Production Completed', value: statusDistribution.DONE, color: 'bg-emerald-500' }
            ].map((bar, i) => {
              const maxRatio = summary.totalTasks > 0 ? Math.round((bar.value / summary.totalTasks) * 100) : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{bar.label}</span>
                    <span className="text-slate-400 font-mono">{bar.value} ticket{bar.value !== 1 ? 's' : ''} ({maxRatio}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 border border-slate-800/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${bar.color}`} 
                      style={{ width: `${maxRatio}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Layout Item 2: Premium Visual Velocity Circular Metric and Priority Tags */}
        <div className="bg-[#0D1222]/40 border border-slate-800/60 p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-pink-400" /> Risk & Priority Distribution
            </h3>
            <p className="text-xs text-slate-500">Urgency mapping within current backlogs.</p>
          </div>

          {/* Visual Priority Tag Distributions Bars Stack */}
          <div className="space-y-4">
            {[
              { label: 'High Severity Allocation', count: priorityDistribution.HIGH, ratio: summary.totalTasks > 0 ? Math.round((priorityDistribution.HIGH / summary.totalTasks) * 100) : 0, barTint: 'bg-rose-500', textTint: 'text-rose-400' },
              { label: 'Medium Routine Tasks', count: priorityDistribution.MEDIUM, ratio: summary.totalTasks > 0 ? Math.round((priorityDistribution.MEDIUM / summary.totalTasks) * 100) : 0, barTint: 'bg-indigo-500', textTint: 'text-indigo-400' },
              { label: 'Low Lifecycle Backlog', count: priorityDistribution.LOW, ratio: summary.totalTasks > 0 ? Math.round((priorityDistribution.LOW / summary.totalTasks) * 100) : 0, barTint: 'bg-slate-500', textTint: 'text-slate-400' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/40 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-slate-300 block truncate">{item.label}</span>
                  <span className={`text-[10px] font-mono font-bold mt-0.5 block ${item.textTint}`}>{item.count} Active Logs</span>
                </div>
                <div className="text-right font-mono font-bold text-sm text-white bg-slate-950 px-2 py-1 border border-slate-800 rounded-lg">
                  {item.ratio}%
                </div>
              </div>
            ))}
          </div>

          {/* Micro Velocity Completion Indicator Meter Line */}
          <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> System Velocity Engine Healthy</span>
            <span className="font-mono text-white bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">Online</span>
          </div>
        </div>

      </div>
    </div>
  );
}