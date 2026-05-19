import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { useActivityStore } from '../../store/activityStore';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { Plus, Folder, Users, Layers, Calendar, BarChart2, X, Activity, Terminal, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper component to resolve systemic action labels to high-fidelity visual indicators
const ActivityIndicatorIcon = ({ actionType }) => {
  switch (actionType) {
    case 'TASK_CREATED':
    case 'TASK_UPDATED':
      return <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20"><Layers className="w-3.5 h-3.5" /></div>;
    case 'PROJECT_LAUNCHED':
      return <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20"><Folder className="w-3.5 h-3.5" /></div>;
    case 'MEMBER_JOINED':
      return <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20"><Users className="w-3.5 h-3.5" /></div>;
    default:
      return <div className="p-1.5 bg-slate-500/10 text-slate-400 rounded-lg border border-slate-500/20"><Terminal className="w-3.5 h-3.5" /></div>;
  }
};

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, teams, fetchProjects, fetchTeams, createNewProject, isLoading } = useProjectStore();
  const { activities, fetchWorkspaceActivities, isFeedLoading } = useActivityStore();
  const { metrics, fetchSummaryMetrics } = useAnalyticsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', teamId: '' });

  // Load foundational data layers and telemetry models across the multi-tenant space
  useEffect(() => {
    fetchProjects();
    fetchTeams();
    fetchWorkspaceActivities();
    fetchSummaryMetrics();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return toast.error('Project identifier title required.');

    const result = await createNewProject(newProject.name, newProject.description, newProject.teamId);
    if (result.success) {
      toast.success('Enterprise Project asset generated!');
      setNewProject({ name: '', description: '', teamId: '' });
      setIsModalOpen(false);
      // Synchronize database records across all tracking states simultaneously
      fetchWorkspaceActivities();
      fetchSummaryMetrics();
      fetchProjects();
    } else {
      toast.error(result.message);
    }
  };

  // Safe structural fallbacks for computed statistics summaries
  const totalProjectsCount = metrics?.summary?.totalProjects ?? projects.length;
  const totalTeamsCount = metrics?.summary?.totalTeams ?? teams.length;
  const totalTasksCount = metrics?.summary?.totalTasks ?? 0;
  const engineeringVelocity = metrics?.summary?.projectVelocity ?? 0;

  return (
    <div className="space-y-8">
      {/* Upper Welcome and Overview Action Panel Banner Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0D1222]/40 border border-slate-800/50 p-6 rounded-2xl gap-4 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {user?.fullName || 'Engineer'}</h1>
          <p className="text-xs text-slate-400 mt-1">Here is a production analytics summary of your current workspace operations.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors duration-150 flex items-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer border border-indigo-500/30"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Analytics Counter Dashboard Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Projects', value: totalProjectsCount, desc: 'Active developments', icon: Folder, color: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/10', target: '/dashboard' },
          { title: 'Allocated Teams', value: totalTeamsCount, desc: 'Cross-functional groups', icon: Users, color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10', target: '/dashboard' },
          { title: 'Open Backlog Tasks', value: totalTasksCount, desc: 'Pending production steps', icon: Layers, color: 'text-amber-400 bg-amber-500/5 border-amber-500/10', target: '/dashboard/tasks' },
          { title: 'Sprint Velocity Index', value: `${engineeringVelocity}%`, desc: 'Closed deployment logs', icon: BarChart2, color: 'text-pink-400 bg-pink-500/5 border-pink-500/10', target: '/dashboard/analytics' }
        ].map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.target)}
            className={`bg-[#0D1222]/60 border p-5 rounded-2xl flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-700/50 cursor-pointer group`}
          >
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">{stat.title}</span>
              <span className="text-3xl font-bold text-white block tracking-tight group-hover:text-white transition-colors">{stat.value}</span>
              <span className="text-[11px] text-slate-500 block">{stat.desc}</span>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/40 group-hover:border-slate-700/60 transition-colors">
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Lower Workspace Layout Split Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Modern Project Card Listings View Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Folder className="w-4 h-4 text-indigo-400" /> Monitored Corporate Projects
          </h2>
          
          {isLoading ? (
            <div className="h-48 border border-dashed border-slate-800/80 rounded-2xl flex items-center justify-center text-xs text-slate-500 uppercase tracking-widest font-mono">
              Loading core repositories...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center space-y-3 bg-[#0D1222]/20">
              <p className="text-sm text-slate-400">No projects located inside this workspace cluster yet.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Launch your primary project hub
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => navigate('/dashboard/tasks')}
                  className="bg-[#0D1222]/50 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 hover:bg-[#0F152A]/40 transition-all duration-200 group relative overflow-hidden cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors truncate pr-2">
                        {project.name}
                      </h4>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {project.team?.name || 'Shared'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[2rem]">
                      {project.description || 'No contextual description was applied to this project hub asset.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/60 flex justify-between items-center text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 bg-indigo-500/5 text-indigo-400 px-2 py-1 border border-indigo-500/10 rounded-lg group-hover:bg-indigo-500/10 transition-colors">
                      <Layers className="w-3.5 h-3.5" /> {project._count?.tasks || 0} Open Tasks
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-400 group-hover:text-indigo-400 transition-colors">
                      Launch Board <ArrowRight className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Column Panel: High-Fidelity Real-Time Audit Feed Widget */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-400" /> Platform Operations Feed
          </h2>
          <div className="bg-[#0D1222]/40 border border-slate-800/60 rounded-2xl p-4 min-h-[300px]">
            {isFeedLoading ? (
              <div className="text-center text-xs text-slate-600 font-mono py-12 uppercase tracking-wider">Syncing tracking logs...</div>
            ) : activities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12 italic">No operations recorded yet inside this workspace.</p>
            ) : (
              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800/60">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 relative group">
                    <div className="relative z-10 bg-[#070B14]">
                      <ActivityIndicatorIcon actionType={act.actionType} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-xs text-slate-300 leading-normal font-medium">
                        <span className="text-white font-semibold">{act.user?.fullName || 'System Event'}</span> {act.description}
                      </p>
                      <span className="text-[9px] font-mono text-slate-500 block mt-1 uppercase">
                        {new Date(act.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Glassmorphic Sliding Creator Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#04060C]/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="w-full max-w-lg bg-[#0F1424] border border-slate-800/90 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Folder className="w-4 h-4 text-indigo-500" /> Setup Workspace Project Hub
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800/50">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Project Display Name</label>
                <input
                  type="text"
                  placeholder="e.g., Core API Refactor Engine"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Scope Description (Optional)</label>
                <textarea
                  placeholder="Summarize the core execution requirements..."
                  rows="3"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Assign Operations Squad (Optional)</label>
                <select
                  value={newProject.teamId}
                  onChange={(e) => setNewProject({ ...newProject, teamId: e.target.value })}
                  className="w-full bg-[#0D1222] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                >
                  <option value="">Retain as open corporate global resource</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end gap-3 bg-slate-900/10 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer border border-indigo-500/30"
                >
                  Initialize Project Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}