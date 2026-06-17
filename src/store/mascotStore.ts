/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { MascotMode, MascotState, MascotProgressionState } from '../types/mascot';

interface MascotActions {
  setMode: (mode: MascotMode) => void;
  setIdleSeconds: (seconds: number) => void;
  setActiveSeconds: (seconds: number) => void;
  setQuizActive: (active: boolean) => void;
  setMinimized: (min: boolean) => void;
  setMessage: (message: string) => void;
  setStressMessageShown: (shown: boolean) => void;
  recordQuizAnswer: () => void;
  completeQuiz: (score: number, totalQuestions: number) => void;
  startQuizWorkout: () => void;
  addEatingPoints: (points: number) => void;
  incrementEatingSession: () => void;
  updateGlow: (glow: number) => void;
  resetMascotProgression: () => void;
}

const DEFAULT_PROGRESSION: MascotProgressionState = {
  bodyFitnessStage: 1,
  bodyFitnessPoints: 0,
  sizeLevel: 1.0,
  eatingGrowthPoints: 0,
  glowLevel: 0,
  totalQuizzesPassed: 0,
  totalQuizQuestionsAnswered: 0,
  totalIdleEatingSessions: 0,
};

const getSavedProgression = (): MascotProgressionState => {
  try {
    const saved = localStorage.getItem('trobeez_mascot_progression');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        bodyFitnessStage: parsed.bodyFitnessStage ?? 1,
        bodyFitnessPoints: parsed.bodyFitnessPoints ?? 0,
        sizeLevel: parsed.sizeLevel ?? 1.0,
        eatingGrowthPoints: parsed.eatingGrowthPoints ?? 0,
        glowLevel: parsed.glowLevel ?? 0,
        totalQuizzesPassed: parsed.totalQuizzesPassed ?? 0,
        totalQuizQuestionsAnswered: parsed.totalQuizQuestionsAnswered ?? 0,
        totalIdleEatingSessions: parsed.totalIdleEatingSessions ?? 0,
      };
    }
  } catch (e) {
    console.error('Failed to load mascot progression from localStorage:', e);
  }
  return DEFAULT_PROGRESSION;
};

const saveProgression = (progression: MascotProgressionState) => {
  try {
    localStorage.setItem('trobeez_mascot_progression', JSON.stringify(progression));
  } catch (e) {
    console.error('Failed to save mascot progression to localStorage:', e);
  }
};

const calcFitnessStage = (points: number): number => {
  if (points >= 20) return 4;
  if (points >= 10) return 3;
  if (points >= 5) return 2;
  return 1;
};

export const useMascotStore = create<MascotState & MascotActions>((set, get) => {
  const initialProgression = getSavedProgression();

  return {
    ...initialProgression,
    mode: 'active',
    idleSeconds: 0,
    activeSeconds: 0,
    isMinimized: false,
    message: "Hey there! Ready to learn together? 🦅",
    stressMessageShown: false,
    isQuizActive: false,

    setMode: (mode) => set({ mode }),
    setIdleSeconds: (idleSeconds) => set({ idleSeconds }),
    setActiveSeconds: (activeSeconds) => set({ activeSeconds }),
    setQuizActive: (isQuizActive) => set({ isQuizActive }),
    setMinimized: (isMinimized) => set({ isMinimized }),
    setMessage: (message) => set({ message }),
    setStressMessageShown: (stressMessageShown) => set({ stressMessageShown }),

    recordQuizAnswer: () => {
      const current = get();
      const newPoints = current.bodyFitnessPoints + 1;
      const newStage = calcFitnessStage(newPoints);
      const newProgression: MascotProgressionState = {
        bodyFitnessStage: newStage,
        bodyFitnessPoints: newPoints,
        sizeLevel: current.sizeLevel,
        eatingGrowthPoints: current.eatingGrowthPoints,
        glowLevel: current.glowLevel,
        totalQuizzesPassed: current.totalQuizzesPassed,
        totalQuizQuestionsAnswered: current.totalQuizQuestionsAnswered + 1,
        totalIdleEatingSessions: current.totalIdleEatingSessions,
      };
      
      set(newProgression);
      saveProgression(newProgression);
    },

    completeQuiz: (score, totalQuestions) => {
      const current = get();
      const isPassed = score >= Math.min(4, totalQuestions); // Passing threshold
      const pointsEarned = isPassed ? 5 : 0;
      const newPoints = current.bodyFitnessPoints + pointsEarned;
      const newStage = calcFitnessStage(newPoints);
      
      const newProgression: MascotProgressionState = {
        bodyFitnessStage: newStage,
        bodyFitnessPoints: newPoints,
        sizeLevel: current.sizeLevel,
        eatingGrowthPoints: current.eatingGrowthPoints,
        glowLevel: isPassed ? Math.min(current.glowLevel + 0.1, 1) : current.glowLevel,
        totalQuizzesPassed: current.totalQuizzesPassed + (isPassed ? 1 : 0),
        totalQuizQuestionsAnswered: current.totalQuizQuestionsAnswered,
        totalIdleEatingSessions: current.totalIdleEatingSessions,
      };

      set({
        ...newProgression,
        mode: isPassed ? 'congratulating' : 'supportive',
        isQuizActive: false,
      });
      saveProgression(newProgression);
    },

    startQuizWorkout: () => {
      set({
        mode: 'quizWorkout',
        isQuizActive: true,
      });
    },

    addEatingPoints: (points) => {
      const current = get();
      const newEatingGrowthPoints = current.eatingGrowthPoints + points;
      const newSize = Math.min(1 + newEatingGrowthPoints * 0.03, 1.4);
      
      const newProgression: MascotProgressionState = {
        bodyFitnessStage: current.bodyFitnessStage,
        bodyFitnessPoints: current.bodyFitnessPoints,
        sizeLevel: newSize,
        eatingGrowthPoints: newEatingGrowthPoints,
        glowLevel: current.glowLevel,
        totalQuizzesPassed: current.totalQuizzesPassed,
        totalQuizQuestionsAnswered: current.totalQuizQuestionsAnswered,
        totalIdleEatingSessions: current.totalIdleEatingSessions,
      };

      set(newProgression);
      saveProgression(newProgression);
    },

    incrementEatingSession: () => {
      const current = get();
      const newProgression: MascotProgressionState = {
        bodyFitnessStage: current.bodyFitnessStage,
        bodyFitnessPoints: current.bodyFitnessPoints,
        sizeLevel: current.sizeLevel,
        eatingGrowthPoints: current.eatingGrowthPoints,
        glowLevel: current.glowLevel,
        totalQuizzesPassed: current.totalQuizzesPassed,
        totalQuizQuestionsAnswered: current.totalQuizQuestionsAnswered,
        totalIdleEatingSessions: current.totalIdleEatingSessions + 1,
      };

      set(newProgression);
      saveProgression(newProgression);
    },

    updateGlow: (glow) => {
      const current = get();
      const newProgression: MascotProgressionState = {
        bodyFitnessStage: current.bodyFitnessStage,
        bodyFitnessPoints: current.bodyFitnessPoints,
        sizeLevel: current.sizeLevel,
        eatingGrowthPoints: current.eatingGrowthPoints,
        glowLevel: Math.min(Math.max(glow, 0), 1),
        totalQuizzesPassed: current.totalQuizzesPassed,
        totalQuizQuestionsAnswered: current.totalQuizQuestionsAnswered,
        totalIdleEatingSessions: current.totalIdleEatingSessions,
      };

      set(newProgression);
      saveProgression(newProgression);
    },

    resetMascotProgression: () => {
      localStorage.removeItem('trobeez_mascot_progression');
      set({
        ...DEFAULT_PROGRESSION,
        mode: 'active',
        idleSeconds: 0,
        activeSeconds: 0,
        isMinimized: false,
        message: "Hey there! Ready to learn together? 🦅",
        stressMessageShown: false,
        isQuizActive: false,
      });
    },
  };
});
