/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Global Router and Layout Orchestrator
// Coordinates view states, manages user authorization, and triggers landing pages.

import { useState, useEffect } from 'react';
import { Shell } from './core/layout';
import { UserRole } from './core/types';
import { getFeatures } from './core/registry';

// Public feature views imported directly to prevent any load failures
import { LandingPage } from './features/landing/LandingPage';
import { SignInPage } from './features/auth/SignInPage';

// Authorized feature views
import { MyCourses } from './features/student/MyCourses';
import { CourseContent } from './features/student/CourseContent';
import { MaterialViewer } from './features/student/MaterialViewer';
import { AIBreakdown } from './features/student/AIBreakdown';

import { TeacherDashboard } from './features/teacher/Dashboard';
import { CourseManagement } from './features/teacher/CourseManagement';
import { TeacherAnalytics } from './features/teacher/Analytics';
import { ExampleView } from './features/example/ExampleView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [role, setRole] = useState<UserRole>('student');

  useEffect(() => {
    // Read session active parameters on startup
    const savedRole = localStorage.getItem('mindmate_active_role') as UserRole;
    if (savedRole) {
      setRole(savedRole);
    }

    const savedPath = localStorage.getItem('mindmate_active_path');
    if (savedPath) {
      setCurrentPath(savedPath);
    } else {
      // Direct defaults
      setCurrentPath('/');
    }

    // Register active features so they load cleanly
    getFeatures();
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    localStorage.setItem('mindmate_active_path', path);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('mindmate_active_role', newRole);
  };

  // Memory router resolver helper
  const resolver = (path: string) => {
    if (path === '/' || path === '') return { view: 'landing', params: {} };
    if (path === '/signin') return { view: 'signin', params: {} };
    if (path === '/student/courses') return { view: 'student-courses', params: {} };
    
    let match = path.match(/^\/student\/course\/([^/]+)$/);
    if (match) return { view: 'student-course', params: { courseId: match[1] } };

    match = path.match(/^\/student\/material\/([^/]+)$/);
    if (match) return { view: 'student-material', params: { materialId: match[1] } };

    match = path.match(/^\/student\/breakdown\/([^/]+)$/);
    if (match) return { view: 'student-breakdown', params: { materialId: match[1] } };

    if (path === '/teacher/dashboard') return { view: 'teacher-dashboard', params: {} };
    if (path === '/teacher/courses') return { view: 'teacher-courses', params: {} };
    if (path === '/teacher/analytics') return { view: 'teacher-analytics', params: {} };
    if (path === '/example') return { view: 'example', params: {} };

    return { view: 'notfound', params: {} };
  };

  const { view, params } = resolver(currentPath);

  // 1. Render Public focused views without application layout shell (TCH-ANA-09)
  if (view === 'landing') {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (view === 'signin') {
    return <SignInPage onNavigate={handleNavigate} onRoleChange={handleRoleChange} />;
  }

  // 2. Render authorized dashboards wrapped safely inside Layout Shell structure
  return (
    <Shell
      currentRole={role}
      onRoleChange={handleRoleChange}
      currentView={currentPath}
      onNavigate={handleNavigate}
    >
      {view === 'student-courses' && (
        <MyCourses onNavigate={handleNavigate} />
      )}
      {view === 'student-course' && (
        <CourseContent courseId={params.courseId || ''} onNavigate={handleNavigate} />
      )}
      {view === 'student-material' && (
        <MaterialViewer materialId={params.materialId || ''} onNavigate={handleNavigate} />
      )}
      {view === 'student-breakdown' && (
        <AIBreakdown materialId={params.materialId || ''} onNavigate={handleNavigate} />
      )}
      {view === 'teacher-dashboard' && (
        <TeacherDashboard onNavigate={handleNavigate} />
      )}
      {view === 'teacher-courses' && (
        <CourseManagement />
      )}
      {view === 'teacher-analytics' && (
        <TeacherAnalytics />
      )}
      {view === 'example' && (
        <ExampleView />
      )}
      {view === 'notfound' && (
        <div className="text-center py-24 space-y-4">
          <h2 className="text-xl font-bold">Concept Page Not Found</h2>
          <button 
            onClick={() => handleNavigate('/')} 
            className="px-4 py-2 bg-red-650 text-white rounded-xl text-xs font-bold"
          >
            Go to Landing page
          </button>
        </div>
      )}
    </Shell>
  );
}
