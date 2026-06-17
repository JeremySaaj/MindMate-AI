/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Teacher Feature Registration configuration and sidebar navigation layout mappings

import { FeatureConfig } from '../../core/registry';
import { TeacherDashboard } from './Dashboard';
import { CourseManagement } from './CourseManagement';
import { TeacherAnalytics } from './Analytics';

export const config: FeatureConfig = {
  id: 'teacher',
  name: 'Teacher Workspace',
  navItems: [
    {
      label: 'Instructor Dashboard',
      path: '/teacher/dashboard',
      icon: 'LayoutDashboard',
      roles: ['teacher'],
      order: 1
    },
    {
      label: 'Manage Courses',
      path: '/teacher/courses',
      icon: 'PenTool',
      roles: ['teacher'],
      order: 2
    },
    {
      label: 'Learning Analytics',
      path: '/teacher/analytics',
      icon: 'BarChart2',
      roles: ['teacher'],
      order: 3
    }
  ],
  routes: [
    {
      path: '/teacher/dashboard',
      component: TeacherDashboard,
      roles: ['teacher']
    },
    {
      path: '/teacher/courses',
      component: CourseManagement,
      roles: ['teacher']
    },
    {
      path: '/teacher/analytics',
      component: TeacherAnalytics,
      roles: ['teacher']
    }
  ]
};
