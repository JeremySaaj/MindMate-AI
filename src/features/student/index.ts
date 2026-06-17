/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Student LMS Feature routes and sidebar nav registrations

import { FeatureConfig } from '../../core/registry';
import { MyCourses } from './MyCourses';
import { CourseContent } from './CourseContent';
import { MaterialViewer } from './MaterialViewer';
import { AIBreakdown } from './AIBreakdown';

export const config: FeatureConfig = {
  id: 'student',
  name: 'Student Portal',
  navItems: [
    {
      label: 'My Courses',
      path: '/student/courses',
      icon: 'BookOpen',
      roles: ['student'],
      order: 1
    }
  ],
  routes: [
    {
      path: '/student/courses',
      component: MyCourses,
      roles: ['student']
    },
    {
      path: '/student/course/:courseId',
      component: CourseContent,
      roles: ['student']
    },
    {
      path: '/student/material/:materialId',
      component: MaterialViewer,
      roles: ['student']
    },
    {
      path: '/student/breakdown/:materialId',
      component: AIBreakdown,
      roles: ['student']
    }
  ]
};
