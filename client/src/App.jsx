import React from 'react';
import { Terminal, Cpu, CheckCircle } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#070A13] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glow Layer (Vercel/Linear Style) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-[#0F1424]/80 border border-slate-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10 transition-all duration-300 hover:border-slate-700/80">
        
        {/* Core Header Layout */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white bg-clip-text">
              DevSync AI
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
              Core Subsystem
            </p>
          </div>
        </div>

        {/* Status Messaging Section */}
        <div className="space-y-4 mb-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Tailwind v4 Engine Active
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                The native Vite compiler plugin configuration is operating successfully. JIT utilities are compiled.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>UI Workspace: Live at Port 3000</span>
          </div>
        </div>

        {/* Interactive Action Button for Layout Visual Verification */}
        <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-sm font-medium text-slate-100 rounded-xl transition-all duration-200 border border-slate-700/50 shadow-sm flex items-center justify-center space-x-2 cursor-pointer">
          <span>Awaiting Phase 1 Routing Setup</span>
        </button>
      </div>

      {/* Subtle Bottom Footer Info */}
      <p className="text-xs text-slate-600 font-mono mt-8 z-10">
        Enterprise Workspace Layer • Isolated Scope
      </p>
    </div>
  );
}

export default App;