/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shared contracts and data structures for the MindMate AI-powered LMS

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  synopsis: string;
  teacherId: string;
  teacherName: string;
  publishStatus: 'draft' | 'published';
  progress?: number; // for current student
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  publishStatus: 'draft' | 'published';
}

export type MaterialType = 'pdf' | 'docx' | 'video' | 'text';

export interface Material {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  fileType: MaterialType;
  fileContent: string; // The original teacher material content
  pageCount: number;
  publishStatus: 'draft' | 'published';
  order: number;
}

export interface ModuleQuiz {
  id: string;
  moduleId: string;
  courseId: string;
  questions: QuizQuestion[];
  publishStatus: 'draft' | 'published';
}

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export interface TopicOutline {
  id: string;
  title: string;
  description: string;
}

export interface AILearningBreakdown {
  materialId: string;
  topics: TopicOutline[];
}

export interface TopicExplanation {
  materialId: string;
  topicId: string;
  level: 1 | 2 | 3; // 1: ELI5, 2: High School, 3: University
  explanation: string; // Markdown formatted
  flashcards: { front: string; back: string }[];
  quiz: QuizQuestion[];
}

export interface AIQuizAttempt {
  id: string;
  studentId: string;
  materialId: string;
  topicId: string;
  level: 1 | 2 | 3;
  score: number; // out of 5
  passed: boolean; // >= 4
  timestamp: string;
}

export interface MaterialProgress {
  id: string;
  studentId: string;
  materialId: string;
  courseId: string;
  highestLevelPassed: number; // 0: not started, 1, 2, 3: completed
  completed: boolean; // true if level 3 quiz passed
  completedTopics: string[]; // List of topicIds where quiz passed at current level
  timestamp?: string;
}

export interface AnalyticsSummary {
  activeCourses: number;
  uploadedMaterials: number;
  studentQuizAttempts: number;
  topicsNeedingReviewCount: number;
  topicsPerformance: TopicPerformanceDetail[];
  lowestScoreTopic: string;
  mostAiQuestionsTopic: string;
  totalAttempts: number;
}

export interface TopicPerformanceDetail {
  topicId: string;
  topicTitle: string;
  courseTitle: string;
  avgScore: number; // 0 to 5
  attempts: number;
  aiQuestions: number;
  failureRate: number; // percentage
  status: 'Needs Attention' | 'Below Average' | 'Fair' | 'Good';
}

export interface TeachingRecommendation {
  topicId: string;
  topicTitle: string;
  analysis: string; // AI summary of why students are struggling
  recommendations: string[]; // AI teaching advice items
  generatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'material_visit' | 'ai_help_request' | 'quiz_attempt' | 'adaptive_regen';
  courseId: string;
  moduleId: string;
  materialId: string;
  topicId?: string;
  studentId: string;
  value?: any; // e.g. score, selected level, help query
  timestamp: string;
}
