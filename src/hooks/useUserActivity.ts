/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { useMascotStore } from '../store/mascotStore';
import { MascotMode } from '../types/mascot';

const ACTIVE_MESSAGES = [
  "You're doing great. Keep going! 🦅✨",
  "Learning is a superpower. You got this! 📚⚡",
  "Step by step, you are mastering this course! 🏆",
  "Keep up the awesome momentum! 🌟"
];

const STRESS_MESSAGES = [
  "Let's take a short break! Resting helps your brain learn better. ☕",
  "You've been active for a while. A quick pause might help! 🧘",
  "Tiny break? Your brain deserves it. 🧠💨"
];

export function useUserActivity(enabled: boolean = true) {
  const store = useMascotStore();
  const lastActivityTimeRef = useRef<number>(Date.now());
  const idleTickRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      lastActivityTimeRef.current = Date.now();
      
      const currentMode = useMascotStore.getState().mode;
      const isQuiz = useMascotStore.getState().isQuizActive;

      // When activity happens, if sleeping/eating/stressed, reset back to active
      if (currentMode === 'idleSleeping' || currentMode === 'idleEating' || currentMode === 'stressed') {
        const nextMode = isQuiz ? 'quizWorkout' : 'active';
        useMascotStore.setState({
          mode: nextMode,
          idleSeconds: 0,
          message: isQuiz ? "Quiz time! I'm training with you! 🏋️‍♂️🦅" : ACTIVE_MESSAGES[Math.floor(Math.random() * ACTIVE_MESSAGES.length)]
        });
      }
    };

    // Global event listeners for active tracking
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Main 1-second ticks manager
    const interval = setInterval(() => {
      const state = useMascotStore.getState();
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTimeRef.current;

      let nextIdle = state.idleSeconds;
      let nextActive = state.activeSeconds;
      let nextMode = state.mode;
      let nextMessage = state.message;
      let nextStressShown = state.stressMessageShown;

      if (timeSinceLastActivity < 1100) {
        // User is active
        nextIdle = 0;
        nextActive += 1;

        // If user returned to activity, reset went-idle conditions
        if (state.idleSeconds > 0) {
          nextIdle = 0;
        }

        // Apply Priority Logic for active state
        if (state.mode === 'congratulating' || state.mode === 'supportive') {
          // Let temporary overlay modes finish their course (handled by separate timer logic or timeout)
        } else if (state.isQuizActive) {
          nextMode = 'quizWorkout';
          if (state.mode !== 'quizWorkout') {
            nextMessage = "Quiz time! I'm training with you! 🏋️‍♂️🦅";
          }
        } else if (nextActive > 30) {
          if (!nextStressShown) {
            nextMode = 'stressed';
            nextMessage = STRESS_MESSAGES[Math.floor(Math.random() * STRESS_MESSAGES.length)];
            nextStressShown = true;
          }
        } else {
          // Default active state
          if (state.mode !== 'active' && state.mode !== 'stressed') {
            nextMode = 'active';
            nextMessage = ACTIVE_MESSAGES[Math.floor(Math.random() * ACTIVE_MESSAGES.length)];
          }
        }
      } else {
        // User is idle
        nextIdle += 1;
        nextActive = 0;

        // Reset stress message shown trigger only after user has gone idle
        if (nextStressShown && nextIdle > 1) {
          nextStressShown = false;
        }

        // Apply Priority Logic for idle states
        if (state.mode === 'congratulating' || state.mode === 'supportive') {
          // Wait for pass/fail animation to finish
        } else if (state.isQuizActive) {
          // Quiz mode stays active even if user stops typing
          nextMode = 'quizWorkout';
        } else if (nextIdle >= 15) {
          nextMode = 'idleEating';
          if (state.mode !== 'idleEating') {
            nextMessage = "Nom nom… brain-food break! 🍎🥜";
            state.incrementEatingSession();
          }

          // Gaining eating growth points every 10 seconds of idle eating (roughly on ticks of 10)
          const chewSecs = nextIdle - 15;
          if (chewSecs > 0 && chewSecs % 10 === 0) {
            state.addEatingPoints(1);
          }
        } else if (nextIdle >= 10) {
          nextMode = 'idleSleeping';
          if (state.mode !== 'idleSleeping') {
            nextMessage = "Zzz… I’ll wait while you think. 😴💤";
          }
        }
      }

      // Handle automatic fade-back from temporary congratulating/supportive triggers
      if (state.mode === 'congratulating' || state.mode === 'supportive') {
        // Timer countdown for feedback
        if (idleTickRef.current === 0) {
          idleTickRef.current = Date.now();
        } else if (Date.now() - idleTickRef.current > 5000) {
          idleTickRef.current = 0;
          nextMode = state.isQuizActive ? 'quizWorkout' : 'active';
          nextMessage = state.isQuizActive 
            ? "Quiz time! I'm training with you! 🏋️‍♂️🦅" 
            : ACTIVE_MESSAGES[Math.floor(Math.random() * ACTIVE_MESSAGES.length)];
        }
      } else {
        idleTickRef.current = 0;
      }

      // Commit second updates
      useMascotStore.setState({
        idleSeconds: nextIdle,
        activeSeconds: nextActive,
        mode: nextMode,
        message: nextMessage,
        stressMessageShown: nextStressShown
      });

    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInterval(interval);
    };
  }, [enabled]);
}
