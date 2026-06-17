/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Student Home "My Courses" View.
// Implements requirements STU-COURSE-01 to STU-COURSE-08.

import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { MockDatabase } from '../../core/mockDb';
import { Course, MaterialProgress } from '../../core/types';

interface MyCoursesProps {
  onNavigate: (path: string) => void;
}

export function MyCourses({ onNavigate }: MyCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgresses, setCourseProgresses] = useState<Record<string, number>>({});
  const [nextTopics, setNextTopics] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    const allCourses = MockDatabase.getCourses().filter(c => c.publishStatus === 'published');
    const allMaterials = MockDatabase.getMaterials().filter(m => m.publishStatus === 'published');
    const studentId = 'u1'; // Active student alex
    const progressRecords = MockDatabase.getMaterialProgress(studentId);

    const progressMap: Record<string, number> = {};
    const nextTopicMap: Record<string, string> = {};

    allCourses.forEach(course => {
      // Find all published materials for this course
      const courseMaterials = allMaterials.filter(m => m.courseId === course.id);
      const totalItems = courseMaterials.length;
      
      if (totalItems === 0) {
        progressMap[course.id] = 0;
        nextTopicMap[course.id] = 'No topics uploaded';
        return;
      }

      // Count materials with level 3 completed
      const completedCount = courseMaterials.filter(m => {
        const p = progressRecords.find(record => record.materialId === m.id);
        return p ? p.highestLevelPassed === 3 : false;
      }).length;

      const percentage = Math.round((completedCount / totalItems) * 100);
      progressMap[course.id] = percentage;

      // Find next unfinished topic
      const nextUnfinished = courseMaterials.find(m => {
        const p = progressRecords.find(record => record.materialId === m.id);
        return !p || p.highestLevelPassed < 3;
      });

      nextTopicMap[course.id] = nextUnfinished 
        ? nextUnfinished.title 
        : 'All materials finished! 🎉';
    });

    setCourses(allCourses);
    setCourseProgresses(progressMap);
    setNextTopics(nextTopicMap);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-black rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-semibold">
              <Lucide.Sparkles className="w-3.5 h-3.5" />
              Active learning journey
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back, Alex!</h1>
            <p className="text-rose-100 text-sm font-medium">Continue studying where you left off. Try breaking down concepts using our adaptive AI tutor!</p>
          </div>
        </div>
      </div>

      {/* Course List Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lucide.BookOpen className="w-5 h-5 text-red-650" />
          <h2 className="text-xl font-bold tracking-tight text-slate-850">Your Enrolled Courses</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const progress = courseProgresses[course.id] || 0;
            const nextTopic = nextTopics[course.id] || '';
            const isCompleted = progress === 100;

            return (
              <div 
                key={course.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-350 transition-all flex flex-col justify-between p-6 hover:shadow-md hover:-translate-y-0.5"
                id={`course-card-${course.id}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Instructor</span>
                      <span className="text-sm font-semibold text-slate-600 flex items-center gap-1">
                        <Lucide.UserCheck className="w-4 h-4 text-slate-400" />
                        {course.teacherName}
                      </span>
                    </div>
                    {isCompleted ? (
                      <span className="bg-emerald-55 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                        <Lucide.CheckCircle className="w-3.5 h-3.5" />
                        Complete
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-700 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border border-red-100/50">
                        In Progress
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{course.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{course.synopsis}</p>
                  </div>

                  {/* Course Progress Section */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">Course Progress</span>
                      <span className="text-slate-950 font-black">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                      <div 
                        className="h-full bg-red-650 rounded-full transition-all duration-500 shadow-xs" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Next Lesson Indicator */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-xs flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0 border border-red-100/30">
                      <Lucide.Bookmark className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next study target</div>
                      <div className="text-slate-700 font-semibold truncate" title={nextTopic}>{nextTopic}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate(`/student/course/${course.id}`)}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-65 bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-50'
                        : 'bg-black text-white hover:bg-red-700 shadow-md shadow-red-100'
                    }`}
                    id={`continue-learning-${course.id}`}
                  >
                    <span>{isCompleted ? 'Review Course Material' : 'Continue Learning'}</span>
                    <Lucide.ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
