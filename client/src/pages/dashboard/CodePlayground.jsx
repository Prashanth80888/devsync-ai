import React, { useEffect, useState } from 'react';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { useProjectStore } from '../../store/projectStore';
import { Terminal, Save, Sparkles, Loader2, Code, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript (Node.js)' },
  { value: 'typescript', label: 'TypeScript (TSX)' },
  { value: 'python', label: 'Python (3.x)' },
  { value: 'go', label: 'Go (Golang)' },
  { value: 'rust', label: 'Rust (Cargo)' }
];

export default function CodePlayground() {
  const { selectedProjectId } = useProjectStore();
  const { 
    playgrounds, 
    currentSandbox, 
    isLoading, 
    isAnalyzing, 
    fetchProjectPlaygrounds, 
    setCurrentSandbox, 
    saveSandboxSnippet, 
    analyzeCurrentCode 
  } = usePlaygroundStore();

  const [codeBuffer, setCodeBuffer] = useState('');
  const [sandboxTitle, setSandboxTitle] = useState('');
  const [targetLang, setTargetLang] = useState('javascript');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Sync internal UI text arrays whenever the active tracking node changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectPlaygrounds(selectedProjectId);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (currentSandbox) {
      setCodeBuffer(currentSandbox.code || '');
      setSandboxTitle(currentSandbox.title || '');
      setTargetLang(currentSandbox.language || 'javascript');
      setIsCreatingNew(false);
    } else {
      clearWorkspace();
    }
  }, [currentSandbox]);

  const clearWorkspace = () => {
    setCodeBuffer('');
    setSandboxTitle('');
    setTargetLang('javascript');
    setIsCreatingNew(true);
  };

  const handleCommitSave = async () => {
    if (!sandboxTitle.trim()) return toast.error('Sandbox identifier title label required.');
    if (!selectedProjectId) return toast.error('No active scope project container chosen.');

    const payload = {
      id: isCreatingNew ? undefined : currentSandbox?.id,
      title: sandboxTitle,
      code: codeBuffer,
      language: targetLang,
      projectId: selectedProjectId
    };

    toast.loading('Committing code updates to disk...', { id: 'save-code' });
    const res = await saveSandboxSnippet(payload);
    
    if (res.success) {
      toast.success('Snippet synchronized successfully!', { id: 'save-code' });
    } else {
      toast.error(res.message || 'Error executing persistence framework.', { id: 'save-code' });
    }
  };

  const triggerGeminiAudit = async () => {
    if (!currentSandbox?.id || isCreatingNew) {
      return toast.error('Please save your active workspace code snippet before compiling an AI analysis.');
    }

    toast.loading('Gemini static inspector scanning architecture patterns...', { id: 'ai-audit' });
    const res = await analyzeCurrentCode(currentSandbox.id);

    if (res.success) {
      toast.success('Deep security audit blueprint rendered below!', { id: 'ai-audit' });
    } else {
      toast.error(res.message || 'AI compiler engine encountered an anomaly.', { id: 'ai-audit' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      {/* LEFT SIDEBAR: SNIPPET INDEX PANEL */}
      <div className="lg:col-span-1 bg-[#070B14]/40 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md flex flex-col justify-between">
        <div className="space-y-4 flex-grow overflow-y-auto">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase">Sandboxes</span>
            <button 
              onClick={clearWorkspace}
              className="text-[10px] bg-indigo-950/40 border border-indigo-900/50 hover:bg-indigo-600 px-2 py-1 rounded text-indigo-400 hover:text-white font-mono transition-colors cursor-pointer"
            >
              + Create New
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-slate-500 font-mono text-[11px] uppercase tracking-wider animate-pulse">
              Hydrating sandbox arrays...
            </div>
          ) : playgrounds.length === 0 ? (
            <div className="text-center py-8 text-slate-600 italic text-xs">
              No sandboxes mapped to this project yet.
            </div>
          ) : (
            <div className="space-y-2">
              {playgrounds.map((sandbox) => (
                <div
                  key={sandbox.id}
                  onClick={() => setCurrentSandbox(sandbox)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all group ${
                    currentSandbox?.id === sandbox.id
                      ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md'
                      : 'bg-[#0F1424]/40 border-slate-800/60 hover:border-slate-700/60'
                  }`}
                >
                  <h4 className="text-xs font-semibold text-white tracking-tight truncate group-hover:text-indigo-400 transition-colors">
                    {sandbox.title}
                  </h4>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-slate-500">
                    <span className="bg-slate-900/80 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase">
                      {sandbox.language}
                    </span>
                    <span>
                      {new Date(sandbox.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800/40 text-[10px] text-slate-500 font-mono flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-500" />
          <span>Active Context Monitor Connected</span>
        </div>
      </div>

      {/* RIGHT WORKSPACE: CODE EDITOR & AI REVIEW SPLIT-PANE CONTAINER */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
        
        {/* PANEL 1: COLLABORATIVE INPUT CANVAS */}
        <div className="bg-[#070B14]/90 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          {/* Editor Header Tools Layout Bar */}
          <div className="p-4 bg-slate-900/30 border-b border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-grow w-full sm:w-auto">
              <input
                type="text"
                placeholder="Name your sandbox environment..."
                value={sandboxTitle}
                onChange={(e) => setSandboxTitle(e.target.value)}
                className="bg-transparent text-sm font-bold text-white focus:outline-none w-full border-b border-dashed border-slate-800 hover:border-slate-600 focus:border-indigo-500 pb-0.5 placeholder-slate-600 transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-[#0F1424] border border-slate-800 text-slate-300 text-[11px] font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <button
                onClick={handleCommitSave}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold"
                title="Save workspace parameters"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>

          {/* Interactive Core Code Arena Text Input */}
          <div className="flex-grow relative font-mono text-xs p-4 bg-[#03060C] overflow-hidden">
            <div className="absolute left-3 top-4 text-slate-700 text-right select-none pr-2 border-r border-slate-900 text-[11px] font-bold leading-relaxed w-6 hidden sm:block">
              {Array.from({ length: Math.max(codeBuffer.split('\n').length, 12) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={codeBuffer}
              onChange={(e) => setCodeBuffer(e.target.value)}
              placeholder={`// Write or dump clean code snippet implementations right here...\nfunction initializeGateway() {\n  console.log("DevSync Operational System Online");\n}`}
              className="w-full h-full bg-transparent text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none resize-none leading-relaxed sm:pl-8 overflow-y-auto"
              spellCheck="false"
            />
          </div>
        </div>

        {/* PANEL 2: GEMINI AUTOMATED STATIC AUDITOR REPORT WINDOW */}
        <div className="bg-[#0D1222]/30 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="p-4 bg-slate-900/20 border-b border-slate-800/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Gemini Review Monitor</span>
            </div>

            <button
              onClick={triggerGeminiAudit}
              disabled={isAnalyzing || isCreatingNew}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 text-white disabled:text-slate-600 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/15 disabled:shadow-none border border-indigo-500/30 disabled:border-slate-800/80 cursor-pointer disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling Audit...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Analyze Script
                </>
              )}
            </button>
          </div>

          {/* AI Code Review Markdown Content Stream Output */}
          <div className="flex-grow p-5 overflow-y-auto text-slate-300 font-sans text-xs leading-relaxed space-y-4 bg-black/10 select-text">
            {isCreatingNew ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 p-6 space-y-2">
                <Cpu className="w-8 h-8 text-slate-800 animate-pulse" />
                <p className="font-mono text-[11px] uppercase tracking-wider">Unsaved Environment Canvas</p>
                <p className="text-xs font-sans max-w-xs leading-normal">Save this canvas session to connect the deep static code analysis inspector pipeline.</p>
              </div>
            ) : !currentSandbox?.aiReviewCache ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6 space-y-2">
                <CheckCircle className="w-7 h-7 text-slate-800" />
                <p className="font-mono text-[11px] uppercase tracking-wider">Static Buffer Idle</p>
                <p className="text-xs max-w-xs leading-normal">Click the action engine button above to run security analysis and optimization metrics.</p>
              </div>
            ) : (
              <div className="space-y-4 whitespace-pre-wrap font-sans text-slate-300 bg-slate-950/40 border border-slate-900 p-4 rounded-xl shadow-inner">
                {currentSandbox.aiReviewCache}
              </div>
            )}
          </div>
          
          {currentSandbox?.lastAnalyzedAt && !isCreatingNew && (
            <div className="p-3 bg-black/20 border-t border-slate-900 text-[9px] text-slate-500 font-mono text-right">
              Last static validation cycle processed: {new Date(currentSandbox.lastAnalyzedAt).toLocaleTimeString()}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}