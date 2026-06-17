/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { useMascotStore } from '../../store/mascotStore';

export default function MascotSpeechBubble() {
  const message = useMascotStore((state) => state.message);
  const mode = useMascotStore((state) => state.mode);
  
  // Progression metrics for display
  const sizeLevel = useMascotStore((state) => state.sizeLevel);
  const fitnessStage = useMascotStore((state) => state.bodyFitnessStage);
  const fitnessPoints = useMascotStore((state) => state.bodyFitnessPoints);
  const quizAnswers = useMascotStore((state) => state.totalQuizQuestionsAnswered);
  const quizzesPassed = useMascotStore((state) => state.totalQuizzesPassed);
  
  const [showStats, setShowStats] = useState(false);

  // Return stage label
  const getStageLabel = (stage: number) => {
    switch (stage) {
      case 4: return "🏆 Super Learner Eagle";
      case 3: return "⚡ Fit Concept Master";
      case 2: return "🌟 Proud Active Flyer";
      case 1:
      default:
        return "🥚 Beginner Mascot";
    }
  };

  const getNextStageProgress = () => {
    if (fitnessPoints >= 20) return 100;
    if (fitnessPoints >= 10) return ((fitnessPoints - 10) / 10) * 100;
    if (fitnessPoints >= 5) return ((fitnessPoints - 5) / 5) * 100;
    return (fitnessPoints / 5) * 100;
  };

  const nextThreshold = fitnessPoints >= 20 ? 20 : fitnessPoints >= 10 ? 20 : fitnessPoints >= 5 ? 10 : 5;

  return (
    <div className="absolute bottom-full right-0 mb-3 w-56 sm:w-64 z-50 pointer-events-auto select-none font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-lg p-3 sm:p-4 text-xs relative"
          id="mascot-bubble"
        >
          {/* Bubble Tail */}
          <div className="absolute top-full right-10 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
          <div className="absolute top-full right-10 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-slate-100 -z-10"></div>

          {/* Header Role info */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 select-none">
            <span className="font-bold text-red-650 flex items-center gap-1 uppercase tracking-wider text-[9px]">
              <Lucide.MessageCircleCode className="w-3 h-3 text-red-500" />
              Trobeez Companion
            </span>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-[10px] text-slate-400 hover:text-red-600 transition-colors flex items-center gap-0.5 font-medium px-1 py-0.5 rounded-sm hover:bg-slate-50"
              title="Show companion progression stats"
            >
              <Lucide.Sparkles className="w-2.5 h-2.5 text-yellow-500" />
              {showStats ? "Hide Stats" : "Show Stats"}
            </button>
          </div>

          {/* Main Bubble Speech Message */}
          <div className="text-slate-700 leading-relaxed font-medium">
            {message || "Hey! I'm here to back you up in your learning journey! Let's do this! 🦅"}
          </div>

          {/* Expanding stats panel */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-slate-100 mt-2 pt-2 text-[11px] text-slate-600 space-y-2 select-none"
              >
                {/* Stage Info */}
                <div className="bg-slate-50 rounded-lg p-2 font-medium">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Current Fitness Stage</div>
                  <div className="text-slate-800 text-xs font-semibold">{getStageLabel(fitnessStage)}</div>
                  
                  {/* Progress slide towards next fitness stage */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full transition-all duration-500"
                      style={{ width: `${getNextStageProgress()}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 mt-0.5">
                    <span>{fitnessPoints} pts</span>
                    <span>Next: {nextThreshold} pts</span>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-1.5 font-medium">
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <div className="text-[9px] text-slate-400">Scale Factor</div>
                    <div className="text-slate-800 font-semibold">{sizeLevel.toFixed(2)}x</div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <div className="text-[9px] text-slate-400">Quizzes Passed</div>
                    <div className="text-slate-800 font-semibold">{quizzesPassed}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase justify-center mt-1">
                  <Lucide.Flame className="w-3 h-3 text-amber-500" />
                  <span>Answering drills buff physical stats!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
