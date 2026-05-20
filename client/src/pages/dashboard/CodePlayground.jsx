import React, { useEffect, useState } from 'react';
import { usePlaygroundStore } from "../../store/playgroundStore";
import { useProjectStore } from "../../store/projectStore";
import { Terminal, Save, Sparkles, Loader2, Code, Cpu, CheckCircle, PlusCircle } from 'lucide-react';
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
    analyzeCurrentCode,

    // ==================================================
    // REAL-TIME SOCKET ACTIONS
    // ==================================================

    listenToSandboxSocket,
    broadcastCodeChange,
    leaveSandboxSocket

  } = usePlaygroundStore();

  // ==================================================
  // LOCAL COMPONENT STATE
  // ==================================================

  const [codeBuffer, setCodeBuffer] = useState('');
  const [sandboxTitle, setSandboxTitle] = useState('');
  const [targetLang, setTargetLang] = useState('javascript');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // ==================================================
  // FETCH PROJECT PLAYGROUNDS
  // ==================================================

  useEffect(() => {

    if (selectedProjectId) {
      fetchProjectPlaygrounds(selectedProjectId);
    }

  }, [selectedProjectId]);

  // ==================================================
  // SYNC ACTIVE SANDBOX
  // ==================================================

  useEffect(() => {

    if (currentSandbox && !isCreatingNew) {

      setCodeBuffer(currentSandbox.code || '');

      setSandboxTitle(currentSandbox.title || '');

      setTargetLang(
        currentSandbox.language || 'javascript'
      );
    }

  }, [currentSandbox, isCreatingNew]);

  // ==================================================
  // REAL-TIME SOCKET ROOM MANAGEMENT
  // ==================================================

  useEffect(() => {

    if (
      currentSandbox?.id &&
      !isCreatingNew
    ) {

      // Join socket room
      listenToSandboxSocket(
        currentSandbox.id
      );
    }

    // Cleanup
    return () => {

      if (currentSandbox?.id) {

        leaveSandboxSocket(
          currentSandbox.id
        );
      }
    };

  }, [currentSandbox?.id, isCreatingNew]);

  // ==================================================
  // CREATE NEW SANDBOX
  // ==================================================

  const handleCreateNewClick = () => {

    setIsCreatingNew(true);

    setCurrentSandbox(null);

    setCodeBuffer('');

    setSandboxTitle('');

    setTargetLang('javascript');

    toast.success(
      'New environment canvas ready!'
    );
  };

  // ==================================================
  // SELECT EXISTING SANDBOX
  // ==================================================

  const handleSelectSandbox = (
    sandbox
  ) => {

    setIsCreatingNew(false);

    setCurrentSandbox(sandbox);
  };

  // ==================================================
  // SAVE SANDBOX
  // ==================================================

  const handleCommitSave = async () => {

    if (!sandboxTitle.trim()) {

      return toast.error(
        'Please enter a valid title for this sandbox.'
      );
    }

    if (!selectedProjectId) {

      return toast.error(
        'No active project found. Please select a project first.'
      );
    }

    const payload = {

      id: isCreatingNew
        ? undefined
        : currentSandbox?.id,

      title: sandboxTitle.trim(),

      code: codeBuffer,

      language: targetLang,

      projectId: selectedProjectId
    };

    const loadingToastId =
      toast.loading(
        'Saving your sandbox changes...'
      );

    try {

      const res =
        await saveSandboxSnippet(
          payload
        );

      if (res.success) {

        toast.success(
          'Workspace synchronized perfectly!',
          { id: loadingToastId }
        );

        setIsCreatingNew(false);

        await fetchProjectPlaygrounds(
          selectedProjectId
        );

      } else {

        toast.error(
          res.message ||
          'Error processing save framework.',
          { id: loadingToastId }
        );
      }

    } catch (err) {

      console.error(err);

      toast.error(
        'Network transport error during save.',
        { id: loadingToastId }
      );
    }
  };

  // ==================================================
  // GEMINI ANALYSIS
  // ==================================================

  const triggerGeminiAudit = async () => {

    if (
      isCreatingNew ||
      !currentSandbox?.id
    ) {

      return toast.error(
        'Please save this code canvas before running a Gemini static analysis cycle.'
      );
    }

    const auditToastId =
      toast.loading(
        'Gemini static inspector analyzing code patterns...'
      );

    try {

      const res =
        await analyzeCurrentCode(
          currentSandbox.id
        );

      if (res.success) {

        toast.success(
          'Deep security audit completed successfully!',
          { id: auditToastId }
        );

      } else {

        toast.error(
          res.message ||
          'AI engine encountered an unexpected anomaly.',
          { id: auditToastId }
        );
      }

    } catch (err) {

      console.error(err);

      toast.error(
        'AI pipeline execution failure.',
        { id: auditToastId }
      );
    }
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] text-slate-200">

      {/* ==================================================
          LEFT SIDEBAR
      ================================================== */}

      <div className="lg:col-span-1 bg-[#070B14]/40 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md flex flex-col justify-between">

        <div className="space-y-4 flex-grow overflow-y-auto">

          <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">

            <span className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase">
              Sandboxes
            </span>

            <button
              onClick={handleCreateNewClick}

              className="text-[11px] bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 px-2.5 py-1 rounded-xl text-indigo-300 hover:text-white font-mono transition-all flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3 h-3" />

              New
            </button>

          </div>

          {isLoading ? (

            <div className="text-center py-8 text-slate-500 font-mono text-[11px] uppercase tracking-wider animate-pulse">

              Syncing file index...

            </div>

          ) : playgrounds.length === 0 && isCreatingNew === false ? (

            <div className="text-center py-8 text-slate-600 italic text-xs">

              No sandboxes built yet. Click "+ New" to begin.

            </div>

          ) : (

            <div className="space-y-2">

              {isCreatingNew && (

                <div className="p-3 rounded-xl border bg-indigo-950/40 border-dashed border-indigo-500/60 animate-pulse">

                  <h4 className="text-xs font-semibold text-indigo-300 italic truncate">

                    {sandboxTitle.trim() || 'Untitled Sandbox*'}

                  </h4>

                  <span className="text-[9px] font-mono bg-indigo-900/60 px-1.5 py-0.5 rounded text-white uppercase mt-2 inline-block">

                    {targetLang}

                  </span>

                </div>
              )}

              {playgrounds.map((sandbox) => (

                <button
                  key={sandbox.id}
                  onClick={() => handleSelectSandbox(sandbox)}

                  className={`w-full p-3 rounded-xl border text-left transition-all group block ${
                    currentSandbox?.id === sandbox.id && !isCreatingNew
                      ? 'bg-indigo-950/30 border-indigo-500/80 shadow-md shadow-indigo-500/5'
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

                      {new Date(
                        sandbox.updatedAt
                      ).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric'
                        }
                      )}

                    </span>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>

        <div className="pt-4 border-t border-slate-800/40 text-[10px] text-slate-500 font-mono flex items-center gap-2">

          <Terminal className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />

          <span>DevSync Engine Connected</span>

        </div>

      </div>

      {/* ==================================================
          RIGHT PANEL
      ================================================== */}

      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5 h-full">

        {/* ==================================================
            CODE EDITOR
        ================================================== */}

        <div className="bg-[#070B14]/90 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden shadow-2xl">

          <div className="p-4 bg-slate-900/30 border-b border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">

            <div className="flex-grow w-full sm:w-auto">

              <input
                type="text"
                placeholder="Name your sandbox environment..."
                value={sandboxTitle}
                onChange={(e) =>
                  setSandboxTitle(
                    e.target.value
                  )
                }

                className="bg-transparent text-sm font-bold text-white focus:outline-none w-full border-b border-dashed border-slate-800 focus:border-indigo-500 pb-0.5 placeholder-slate-600 transition-colors"
              />

            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">

              <select
                value={targetLang}
                onChange={(e) =>
                  setTargetLang(
                    e.target.value
                  )
                }

                className="bg-[#0F1424] border border-slate-800 text-slate-300 text-[11px] font-mono rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >

                {LANGUAGE_OPTIONS.map(
                  (opt) => (

                    <option
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </option>

                  )
                )}

              </select>

              <button
                onClick={handleCommitSave}

                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/40 text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold"
              >

                <Save className="w-3.5 h-3.5" />

                Save

              </button>

            </div>

          </div>

          {/* ==================================================
              TEXTAREA
          ================================================== */}

          <div className="flex-grow relative font-mono text-xs p-4 bg-[#03060C] overflow-hidden">

            <textarea
              value={codeBuffer}

              onChange={(e) => {

                const updatedCode =
                  e.target.value;

                setCodeBuffer(updatedCode);

                // REAL-TIME BROADCAST
                if (
                  currentSandbox?.id &&
                  !isCreatingNew
                ) {

                  broadcastCodeChange(
                    currentSandbox.id,
                    updatedCode
                  );
                }
              }}

              placeholder={`// Write or paste code implementations here...\nfunction runAudit() {\n  console.log("Ready for Gemini analysis");\n}`}

              className="w-full h-full bg-transparent text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto"

              spellCheck="false"
            />

          </div>

        </div>

        {/* ==================================================
            GEMINI PANEL
        ================================================== */}

        <div className="bg-[#0D1222]/30 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md shadow-2xl">

          <div className="p-4 bg-slate-900/20 border-b border-slate-800/60 flex justify-between items-center">

            <div className="flex items-center gap-2">

              <Code className="w-4 h-4 text-indigo-400" />

              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">

                Gemini Insights

              </span>

            </div>

            <button
              onClick={triggerGeminiAudit}

              disabled={
                isAnalyzing ||
                isCreatingNew ||
                !currentSandbox
              }

              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900/60 text-white disabled:text-slate-600 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-2 border border-indigo-500/30 disabled:border-slate-800/50 cursor-pointer disabled:cursor-not-allowed"
            >

              {isAnalyzing ? (

                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Auditing...
                </>

              ) : (

                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze Script
                </>

              )}

            </button>

          </div>

          <div className="flex-grow p-5 overflow-y-auto text-slate-300 font-sans text-xs leading-relaxed space-y-4 bg-black/10 select-text">

            {isCreatingNew || !currentSandbox ? (

              <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 p-6 space-y-2">

                <Cpu className="w-8 h-8 text-slate-700 animate-pulse" />

                <p className="font-mono text-[11px] uppercase tracking-wider">

                  Unsaved Environment

                </p>

                <p className="text-xs text-slate-500 max-w-xs leading-normal">

                  Save this active workspace session first to activate Gemini analysis.

                </p>

              </div>

            ) : !currentSandbox?.aiReviewCache ? (

              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6 space-y-2">

                <CheckCircle className="w-7 h-7 text-slate-700" />

                <p className="font-mono text-[11px] uppercase tracking-wider">

                  Static Buffer Idle

                </p>

                <p className="text-xs text-slate-500 max-w-xs leading-normal">

                  Click "Analyze Script" above to run automated code reviews and optimization metrics.

                </p>

              </div>

            ) : (

              <div className="space-y-4 whitespace-pre-wrap font-mono text-[11px] text-emerald-400 bg-slate-950/80 border border-slate-900 p-4 rounded-xl shadow-inner leading-relaxed">

                {currentSandbox.aiReviewCache}

              </div>

            )}

          </div>

          {currentSandbox?.lastAnalyzedAt && !isCreatingNew && (

            <div className="p-3 bg-black/20 border-t border-slate-900 text-[9px] text-slate-500 font-mono text-right">

              Last static validation cycle processed:
              {' '}
              {new Date(
                currentSandbox.lastAnalyzedAt
              ).toLocaleTimeString()}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}