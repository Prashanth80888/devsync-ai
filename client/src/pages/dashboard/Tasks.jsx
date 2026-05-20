import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tasks() {
  // 1. STABLE SAMPLE TASK MATRIX DATA BLOCK
  const [tasks, setTasks] = useState([
    { id: 'task-1', title: 'Implement WebSocket Notification Hub', desc: 'Configure socket connection listeners to catch real-time cluster webhooks.', status: 'backlog', priority: 'high' },
    { id: 'task-2', title: 'Optimize Database Query Indexes', desc: 'Audit postgres execution query maps to reduce thread locking delay windows.', status: 'todo', priority: 'medium' },
    { id: 'task-3', title: 'Refactor Auth Token Storage Matrix', desc: 'Move active state session pointers down into secure token memory layouts.', status: 'in-progress', priority: 'high' },
    { id: 'task-4', title: 'Verify End-to-End Encryption Keys', desc: 'Run integration test runners across pipeline encryption layers.', status: 'done', priority: 'low' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeColumn, setActiveColumn] = useState(null);

  // Define our core development lifecycle columns
  const columns = [
    { id: 'backlog', name: 'Backlog Archive', icon: Clock, color: 'text-slate-400 bg-slate-500/10' },
    { id: 'todo', name: 'Ready Sprint', icon: AlertCircle, color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'in-progress', name: 'Active Execution', icon: MessageSquare, color: 'text-amber-400 bg-amber-500/10' },
    { id: 'done', name: 'Shipped Artifacts', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  // 2. NATIVE DRAG AND DROP MECHANICS CONTROLLERS
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setActiveColumn(columnId); // Visual highlights target lane drop areas
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    setActiveColumn(null);
    const droppedTaskId = e.dataTransfer.getData('text/plain');
    
    if (!droppedTaskId) return;

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === droppedTaskId ? { ...task, status: targetColumnId } : task
      )
    );
    toast.success('Task status pipeline synchronized.');
  };

  // 3. TASK CRUD ACTIONS INTERACTION METHODS
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return toast.error('Task title payload cannot be empty.');

    const freshTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      desc: 'No task description assigned yet. Click settings block to instantiate parameters.',
      status: 'backlog',
      priority: 'medium'
    };

    setTasks(prev => [...prev, freshTask]);
    setNewTaskTitle('');
    toast.success('Task logged to backlog node.');
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.error('Task item purged from active board cluster.');
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
      case 'medium': return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-120px)]">
      
      {/* Dynamic Module Heading Control Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Kanban Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">Drag, prioritize, and reallocate active product development tickets across runtime lanes.</p>
        </div>

        {/* Rapid Inline Backlog Creation Input Form */}
        <form onSubmit={handleCreateTask} className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Push a direct fast ticket title to backlog..."
            className="flex-1 bg-[#090D1A] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none transition-all focus:ring-1 focus:ring-indigo-500/10 font-sans"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-indigo-600/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Append</span>
          </button>
        </form>
      </div>

      {/* 4. FOUR-COLUMN INTERACTIVE LIFECYCLE GRID SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-h-0 overflow-x-auto pb-4">
        {columns.map((col) => {
          const filteredTasks = tasks.filter(t => t.status === col.id);
          const isTargeted = activeColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col bg-[#090D1A]/50 border rounded-2xl p-4 transition-all duration-200 min-w-[250px] max-h-full ${
                isTargeted 
                  ? 'border-indigo-500/40 bg-indigo-950/10 ring-1 ring-indigo-500/10 scale-[1.01]' 
                  : 'border-slate-800/60'
              }`}
            >
              {/* Lane Column Header Title Panel Area */}
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${col.color}`}>
                    <col.icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-300">{col.name}</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-950 text-slate-500 border border-slate-900 px-2 py-0.5 rounded-md">
                  {filteredTasks.length}
                </span>
              </div>

              {/* Scrollable Container Mapping Card Component Rows */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 select-none">
                {filteredTasks.length === 0 ? (
                  <div className="h-24 border border-dashed border-slate-900 rounded-xl flex items-center justify-center p-4 text-center">
                    <span className="text-[11px] text-slate-600 font-mono">Empty Node Queue</span>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-[#0A0E1A] border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl space-y-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg hover:shadow-black/20 group relative"
                    >
                      {/* Card Content Data Meta Elements */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-200 leading-snug tracking-tight group-hover:text-indigo-400 transition-colors">
                            {task.title}
                          </h4>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-rose-500/5 transition-all shrink-0 cursor-pointer"
                            title="Delete Task Entry"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                          {task.desc}
                        </p>
                      </div>

                      {/* Card Footbar Priority Configuration Indicators */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getPriorityBadgeColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <div className="text-[10px] font-mono text-slate-600 flex items-center gap-1">
                          <span className="uppercase">{task.id.split('-')[0]}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-slate-700" />
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

    </div>
  );
}