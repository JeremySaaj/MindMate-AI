/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MascotMode =
  | "active"
  | "idleSleeping"
  | "idleEating"
  | "quizWorkout"
  | "stressed"
  | "congratulating"
  | "supportive";

export interface MascotProgressionState {
  bodyFitnessStage: number;
  bodyFitnessPoints: number;
  sizeLevel: number;
  eatingGrowthPoints: number;
  glowLevel: number;
  totalQuizzesPassed: number;
  totalQuizQuestionsAnswered: number;
  totalIdleEatingSessions: number;
}

export interface MascotState extends MascotProgressionState {
  mode: MascotMode;
  idleSeconds: number;
  activeSeconds: number;
  isMinimized: boolean;
  message: string;
  stressMessageShown: boolean;
  isQuizActive: boolean;
}
