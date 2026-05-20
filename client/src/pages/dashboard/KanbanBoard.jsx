import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { useSocketSync } from '../../hooks/useSocketSync'; // <-- IMMUTABLE SOCKET SYNC INJECTION
import { Plus, CheckCircle2, Circle, Clock, AlertTriangle, User, Layers, ArrowRight, X, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// STATUS_LANES calibrated precisely to align with schema.prisma enums
const STATUS_LANES = [
  { id: 'TODO', title: 'To Do', color: 'border-t-slate-500 bg-slate-500/5 text-slate-400' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-t-indigo-500 bg-indigo-500/5 text-indigo-400' },
  { id: 'IN_REVIEW', title: 'Review Phase', color: 'border-t-amber-500 bg-amber-500/5 text-amber-400' },
  { id: 'DONE', title: 'Completed', color: 'border-t-emerald-500 bg-emerald-500/5 text-emerald-400' }
];

const PRIORITY_BADGES = {
  LOW: 'bg-slate-900 border-slate-800 text-slate-400',
  MEDIUM: 'bg-indigo-950/40 border-indigo-900/60 text-indigo-400',
  HIGH: 'bg-rose-950/40 border-rose-900/60 text-rose-400',
  URGENT: 'bg-red-950/60 border-red-900 text-red-400'
};

export default function KanbanBoard() {
  const { projects, fetchProjects } = useProjectStore();
  const { 
    tasks, 
    selectedProjectId, 
    setSelectedProjectId, 
    fetchProjectTasks, 
    createNewTask, 
    updateTaskStatus, 
    analyzeTaskWithAI,        // <-- ADDED FROM TASK STORE ACTION
    isAiAnalyzing = {},       // <-- ADDED ISOLATED CARD INDEX
    isLoading 
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });

  // EXECUTE SUBSCRIPTION ENGINE LIFECYCLE FOR THE BOARD ACTIVE CANVAS ROOM
  useSocketSync();

  useEffect(() => {
    fetchProjects().then(() => {
      const currentProjects = useProjectStore.getState().projects;
      if (currentProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(currentProjects[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedProjectId) fetchProjectTasks(selectedProjectId);
  }, [selectedProjectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Task title parameter missing.');

    const result = await createNewTask({ ...formData, projectId: selectedProjectId });
    if (result.success) {
      toast.success('Task deployed onto project canvas.');
      setFormData({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });
      setIsModalOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  const promoteTaskStatus = async (taskId, currentStatus) => {
    const laneSequence = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
    const currentIndex = laneSequence.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === laneSequence.length - 1) return;

    const nextStatus = laneSequence[currentIndex + 1];
    const res = await updateTaskStatus(taskId, { status: nextStatus });
    if (res.success) toast.success(`Task shifted to ${nextStatus.replace('_', ' ')}`);
  };

  // AI TRIGGER HANDLER
  const triggerAiBlueprint = async (taskId) => {
    toast.loading('DevSync AI Agent calculating roadmap specs...', { id: taskId });
    const res = await analyzeTaskWithAI(taskId);
    if (res.success) {
      toast.success('Architecture breakdown applied to canvas!', { id: taskId });
    } else {
      toast.error(res.message || 'Error executing AI pipeline.', { id: taskId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Switcher Sub-Header Bar Control Hub */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0D1222]/40 border border-slate-800/60 p-5 rounded-2xl backdrop-blur-md">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Active Project Scope Context</label>
          {projects.length === 0 ? (
            <span className="text-sm text-slate-400 block font-medium">Please construct a project in the main hub first.</span>
          ) : (
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-white font-bold text-lg focus:outline-none cursor-pointer border-b border-dashed border-slate-700 pb-0.5 hover:border-indigo-400 transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0F1424] text-slate-300 font-normal text-sm">{p.name}</option>
              ))}
            </select>
          )}
        </div>

        {selectedProjectId && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold px-4 py-2.5 rounded-xl text-white transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/15 cursor-pointer border border-indigo-500/30"
          >
            <Plus className="w-4 h-4" /> Log Task Blueprint
          </button>
        )}
      </div>

      {/* Main Kanban Columns Lane Grid Container */}
      {isLoading ? (
        <div className="h-64 border border-dashed border-slate-800/80 rounded-2xl flex items-center justify-center text-xs text-slate-500 font-mono tracking-widest uppercase">
          Reallocating Task Arrays...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {STATUS_LANES.map((lane) => {
            const laneTasks = tasks.filter((t) => t.status === lane.id);
            return (
              <div key={lane.id} className={`border border-slate-800/70 rounded-2xl p-4 bg-[#070B14]/40 border-t-2 ${lane.color} flex flex-col min-h-[450px]`}>
                {/* Column header title info node */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800/40">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">{lane.title}</span>
                  <span className="text-[10px] font-bold bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800 text-slate-400 font-mono">{laneTasks.length}</span>
                </div>

                {/* Vertical listing of task items mapped under lane statuses */}
                <div className="space-y-3 flex-grow overflow-y-auto max-h-[500px] pr-1">
                  {laneTasks.length === 0 ? (
                    <div className="h-24 rounded-xl border border-dashed border-slate-800/40 flex items-center justify-center text-[11px] text-slate-600 italic">
                      Lane empty
                    </div>
                  ) : (
                    laneTasks.map((task) => (
                      <div key={task.id} className="bg-[#0F1424]/90 border border-slate-800/80 p-4 rounded-xl hover:border-slate-700/60 transition-all group flex flex-col justify-between relative shadow-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center gap-2">
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.MEDIUM}`}>
                              {task.priority}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              {/* DEVSYNC AI ACTION TRIGGER BUTTON */}
                              <button
                                onClick={() => triggerAiBlueprint(task.id)}
                                disabled={isAiAnalyzing[task.id]}
                                className="p-1 bg-indigo-950/40 border border-indigo-900/60 hover:bg-indigo-600 rounded-md text-indigo-400 hover:text-white transition-colors cursor-pointer flex items-center disabled:opacity-50"
                                title="Run DevSync AI Roadmap Blueprint Analysis"
                              >
                                {isAiAnalyzing[task.id] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3 h-3" />
                                )}
                              </button>

                              {lane.id !== 'DONE' && (
                                <button
                                  onClick={() => promoteTaskStatus(task.id, task.status)}
                                  title="Promote task to next workflow column step"
                                  className="opacity-0 group-hover:opacity-100 p-1 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-md transition-all cursor-pointer"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <h4 className="text-sm font-semibold text-white tracking-tight leading-snug group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                          {task.description && (
                            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap bg-black/10 p-2 rounded-lg border border-slate-900/60 font-sans mt-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Card metadata line footer node item block */}
                        <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {new Date(task.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </span>
                          
                          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-md text-[10px]">
                            <User className="w-3 h-3 text-indigo-400" />
                            <span className="text-slate-400 font-sans truncate max-w-[65px]">{task.assignee?.fullName || 'Unassigned'}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern High-Fidelity Creation Drawer Dialog Modal Context */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#04060C]/75 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="w-full max-w-md bg-[#0F1424] border border-slate-800/90 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
              <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Catalog Epic Task Item
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-800/40">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Summary Context Label</label>
                <input
                  type="text"
                  placeholder="e.g., Integrate multi-tenant route guards"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Scope Execution Specs</label>
                <textarea
                  placeholder="Elaborate actionable tasks or environment specs..."
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Priority Target</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-[#0D1222] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                  >
                    <option value="LOW">Low Allocation</option>
                    <option value="MEDIUM">Medium Standard</option>
                    <option value="HIGH">High Urgency</option>
                    <option value="URGENT">Critical Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Initial Lane</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#0D1222] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                  >
                    <option value="TODO">To Do Backlog</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">Review Phase</option>
                    <option value="DONE">Completed Done</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end gap-3 bg-slate-900/10 -mx-5 -mb-5 p-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer border border-indigo-500/30"
                >
                  Deploy Task Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}