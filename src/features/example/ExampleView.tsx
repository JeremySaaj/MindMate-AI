/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Example Feature UI Screen
// Serves as an interactive blueprint for developers on how to design beautiful modular pages inside Mind Mate.

import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';

export function ExampleView() {
  const [healthStatus, setHealthStatus] = useState<'loading' | 'healthy' | 'error'>('loading');
  const [latency, setLatency] = useState<number | null>(null);
  const [tab, setTab] = useState<'status' | 'template'>('status');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setHealthStatus('loading');
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const end = performance.now();
      if (res.ok) {
        setHealthStatus('healthy');
        setLatency(Math.round(end - start));
      } else {
        setHealthStatus('error');
      }
    } catch {
      setHealthStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Integration Dashboard</h1>
          <p className="text-slate-500 mt-1">Verify backend status, explore shared components, and clone clean hackathon templates.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('status')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all flex items-center gap-2 ${
              tab === 'status'
                ? 'bg-red-650 border-red-650 text-white shadow-md shadow-red-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Lucide.HeartPulse className="w-4 h-4" />
            Core Health Status
          </button>
          <button
            onClick={() => setTab('template')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all flex items-center gap-2 ${
              tab === 'template'
                ? 'bg-red-650 border-red-650 text-white shadow-md shadow-red-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Lucide.Code className="w-4 h-4" />
            Developer Template
          </button>
        </div>
      </div>

      {tab === 'status' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Express Server Connection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                  <Lucide.Server className="w-5 h-5" />
                </div>
                {healthStatus === 'healthy' ? (
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </span>
                ) : healthStatus === 'loading' ? (
                  <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    Resolving...
                  </span>
                ) : (
                  <span className="bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    Unavailable
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900">Backend Express Server</h3>
              <p className="text-slate-500 text-sm mt-1.5">
                Checks connectivity to port 3000 custom route proxies. Important for Gemini server side requests.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Latency</span>
              <span className="font-semibold text-slate-800">{latency ? `${latency} ms` : '--'}</span>
            </div>
          </div>

          {/* Card 2: Automatic Discovery Engine */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <Lucide.FolderTree className="w-5 h-5" />
                </div>
                <span className="bg-red-50 text-red-750 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                  Active Seam
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Auto-Discovery Module</h3>
              <p className="text-slate-500 text-sm mt-1.5">
                Features in <code>/src/features/</code> are dynamically resolved on boot without updating central routers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Eager Loading</span>
              <span className="font-semibold text-emerald-600">Vite Glob Enabled</span>
            </div>
          </div>

          {/* Card 3: Google GenAI Capability */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <Lucide.Sparkles className="w-5 h-5" />
                </div>
                <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                  Ready
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gemini 3.5 LLM Engine</h3>
              <p className="text-slate-500 text-sm mt-1.5">
                Server-side routing is complete and prepared for adaptive study breakdowns, ELI5 logic, and analytics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Model Reference</span>
              <span className="font-semibold text-slate-800">gemini-3.5-flash</span>
            </div>
          </div>

          {/* Technical Details panel */}
          <div className="col-span-1 md:col-span-3 bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-lg mt-4">
            <h3 className="text-base font-bold flex items-center gap-2 mb-4 font-mono text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              CORE WORKSPACE TELEMETRY
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">LOCAL TIME</span>
                <span className="text-slate-200 font-medium">2026-06-06 01:05Z</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">PLATFORM INGRESS</span>
                <span className="text-slate-200 font-medium">Port 3000 Only</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">HOT RELOADING (HMR)</span>
                <span className="text-amber-400 font-medium">Disabled (System Safe)</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">DB ENGINE</span>
                <span className="text-slate-200 font-medium">Mock DB (Local Engine)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl">
          <h3 className="text-xl font-bold text-slate-900 mb-2">How to build new features cleanly</h3>
          <p className="text-slate-600 mb-6 font-medium">
            Mind Mate is designed so each teammate owns precisely one folder under <code>src/features/</code>. No edits to core layouts are necessary.
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Copy the Example folder</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Create a new folder (e.g. <code>src/features/profile</code>). Copy files from <code>src/features/example</code> to seed your structure.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Customize feature configurations</h4>
                <p className="text-xs text-slate-500 mt-1">
                  In your custom <code>index.ts</code>, modify the feature ID, define navigation buttons, setup matching page routes, and specify which roles (student/teacher) can utilize them.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Commit with Confidence</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Since your files are fully self-contained inside your features folder, there is a 0% potential of experiencing Git merge conflicts during pull requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
