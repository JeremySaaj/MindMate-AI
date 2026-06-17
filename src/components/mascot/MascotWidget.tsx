/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { useMascotStore } from '../../store/mascotStore';
import { useUserActivity } from '../../hooks/useUserActivity';
import ChibiEagleMascot from './ChibiEagleMascot';
import MascotSpeechBubble from './MascotSpeechBubble';

export default function MascotWidget() {
  const mode = useMascotStore((state) => state.mode);
  const isMinimized = useMascotStore((state) => state.isMinimized);
  const setMinimized = useMascotStore((state) => state.setMinimized);
  const resetMascotProgression = useMascotStore((state) => state.resetMascotProgression);
  
  // Start tracking user activity, idle ticks, and stress triggers
  useUserActivity(true);

  const [showDeveloperReset, setShowDeveloperReset] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-none font-sans" id="mascot-widget-wrapper">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          // Minimized State - Small round eagle action button
          <motion.button
            key="minimized-bubble"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setMinimized(false)}
            className="pointer-events-auto bg-gradient-to-tr from-red-600 to-red-500 text-white rounded-full p-3.5 sm:p-4 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center border-2 border-white select-none capitalize relative group"
            id="expand-mascot-button"
            title="Expand Trobeez Companion Mascot"
          >
            <Lucide.Bird className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            
            {/* Minimal Pulse Glow */}
            <span className="absolute -inset-0.5 rounded-full bg-red-400 opacity-60 animate-ping -z-10 group-hover:block hidden" />
            
            {/* Small reactive indicator badge */}
            {mode === 'congratulating' && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold text-slate-950 rounded-full animate-bounce">
                🎉
              </span>
            )}
            {mode === 'stressed' && (
              <span className="absolute -top-1 -right-1 bg-sky-400 text-[10px] w-4.5 h-4.5 flex items-center justify-center text-slate-950 rounded-full animate-pulse">
                😰
              </span>
            )}
          </motion.button>
        ) : (
          // Expanded State - Dynamic Box containing 3D canvas + bubble
          <motion.div
            key="expanded-widget"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="pointer-events-none w-[180px] h-[210px] sm:w-[220px] sm:h-[250px] flex flex-col relative"
            id="mascot-expanded-panel"
          >
            {/* Header controls inside expanded widget card */}
            <div className="absolute top-0 right-0 left-0 flex justify-between items-center z-30 select-none pointer-events-auto">
              
              {/* Reset progression trigger for sandbox testing */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowDeveloperReset(true)}
                  onMouseLeave={() => setShowDeveloperReset(false)}
                  onClick={() => {
                    const confirmReset = window.confirm("Reset your study mascot companion's size/fitness progress metrics back to eggs-level defaults?");
                    if (confirmReset) {
                      resetMascotProgression();
                    }
                  }}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-white/50 rounded-full transition-colors opacity-40 hover:opacity-100 bg-white/30 backdrop-blur-sm"
                  title="Developer Reset Mascot Statistics"
                >
                  <Lucide.RefreshCw className="w-3.5 h-3.5" />
                </button>
                {showDeveloperReset && (
                  <div className="absolute left-7 top-0 bg-slate-800 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-50">
                    Reset Progression
                  </div>
                )}
              </div>

              {/* Minimize action button */}
              <button
                onClick={() => setMinimized(true)}
                className="p-1.5 text-slate-500 hover:text-slate-700 bg-white/50 hover:bg-white/80 backdrop-blur-sm shadow-sm rounded-full transition-all duration-150"
                id="minimize-mascot-button"
                title="Minimize Companion"
              >
                <Lucide.Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Bubble attachment portal */}
            <MascotSpeechBubble />

            {/* Core Interactive 3D Model Render Area */}
            <div className="flex-1 w-full h-full overflow-visible relative mt-4">
              <ChibiEagleMascot mode={mode} />
            </div>

            {/* Mini Footer indicator of the Mascot state */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center justify-center select-none text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  mode === 'stressed' ? 'bg-amber-400 animate-ping' :
                  mode === 'idleSleeping' ? 'bg-indigo-400' :
                  mode === 'congratulating' ? 'bg-emerald-400 animate-bounce' :
                  'bg-red-400'
                }`} />
                {mode === 'idleEating' ? 'Eating Break' :
                 mode === 'idleSleeping' ? 'Zzz Sleeping' :
                 mode === 'congratulating' ? 'Victory Lap!' :
                 mode === 'supportive' ? 'Encouraging' :
                 mode === 'quizWorkout' ? 'Quiz Training' :
                 mode === 'stressed' ? 'Needs Break' :
                 'Companion Live'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
