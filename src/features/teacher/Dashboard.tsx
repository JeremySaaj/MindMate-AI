/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Teacher Dashboard Overview page
// Implements requirements TCH-DASH-01 to TCH-DASH-03.

import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { MockDatabase } from '../../core/mockDb';
import { Course, TopicPerformanceDetail } from '../../core/types';

interface TeacherDashboardProps {
  onNavigate: (path: string) => void;
}

export function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const [coursesCount, setCoursesCount] = useState(0);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [strugglingCount, setStrugglingCount] = useState(0);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [strugglingTopics, setStrugglingTopics] = useState<TopicPerformanceDetail[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    const allCourses = MockDatabase.getCourses();
    const allMaterials = MockDatabase.getMaterials();
    const perfs = MockDatabase.getTopicPerformances();
    const events = MockDatabase.getAnalyticsEvents();

    setCoursesCount(allCourses.length);
    setMaterialsCount(allMaterials.length);
    
    const quizAttempts = events.filter(e => e.eventType === 'quiz_attempt');
    setTotalAttempts(quizAttempts.length);

    const struggling = perfs.filter(p => p.status === 'Needs Attention' || p.status === 'Below Average');
    setStrugglingCount(struggling.length);
    setStrugglingTopics(struggling.slice(0, 3));

    setCourses(allCourses);
  };

  const stats = [
    { label: 'Active Courses', value: coursesCount, icon: <Lucide.BookOpen className="w-5 h-5 text-red-600" />, bg: 'bg-red-50 border-red-100/30' },
    { label: 'Uploaded Materials', value: materialsCount, icon: <Lucide.FileText className="w-5 h-5 text-slate-800" />, bg: 'bg-slate-100 border-slate-200/30' },
    { label: 'Student Quiz Attempts', value: totalAttempts, icon: <Lucide.Award className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100/30' },
    { label: 'Topics Needing Review', value: strugglingCount, icon: <Lucide.AlertCircle className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50 border-rose-100/50' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Instructor Control Room</h1>
          <p className="text-slate-500 mt-1">Manage core curriculums, organize modules, and monitor active learning gaps.</p>
        </div>
        <button
          onClick={() => onNavigate('/teacher/courses')}
          className="bg-red-650 text-white font-bold px-5 py-3 rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-md shadow-red-100 self-start md:self-center text-sm"
          id="quick-create-course"
        >
          <Lucide.Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{st.label}</span>
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">{st.value}</span>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${st.bg}`}>
              {st.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course Index List Left side */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-50">
            <h3 className="font-bold text-slate-850 tracking-tight text-base flex items-center gap-2">
              <Lucide.BookOpen className="w-5 h-5 text-red-600" />
              Active Lesson Programs
            </h3>
            <button onClick={() => onNavigate('/teacher/courses')} className="text-xs font-bold text-red-600 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3.5">
            {courses.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-405 font-mono">No courses created yet.</div>
            ) : (
              courses.map((course) => (
                <div 
                  key={course.id}
                  className="p-4 rounded-xl border border-slate-150 border-slate-200/60 hover:border-slate-300 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-slate-905 text-sm sm:text-base leading-snug truncate">{course.title}</h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">{course.synopsis}</p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold uppercase py-0.5 px-2 rounded-full border ${
                        course.publishStatus === 'published'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-150'
                      }`}>
                        {course.publishStatus}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('/teacher/courses')}
                    className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-colors flex-shrink-0"
                    title="Edit Curriculums"
                  >
                    <Lucide.Expand className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Learning Gaps Monitor Right side */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs flex flex-col justify-between space-y-4">
          <div className="space-y-4 flex-1">
            <div className="pb-2 border-b border-slate-50">
              <h3 className="font-bold text-slate-850 tracking-tight text-base flex items-center gap-2">
                <Lucide.AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />
                Critical Concepts to Address
              </h3>
            </div>

            <div className="space-y-3">
              {strugglingTopics.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                    <Lucide.Check className="w-5 h-5 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-450 font-bold uppercase">All topics perform perfectly! 🎉</p>
                </div>
              ) : (
                strugglingTopics.map((topic, idx) => (
                  <div key={idx} className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 flex-shrink-0 mt-0.5 border border-rose-100">
                      <Lucide.Flame className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 leading-tight truncate">{topic.topicTitle}</h4>
                      <p className="text-[10px] text-slate-450 font-medium">Failed in <span className="font-extrabold text-rose-600">{topic.failureRate}%</span> of quiz validations.</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex justify-end">
            <button
              onClick={() => onNavigate('/teacher/analytics')}
              className="px-4.5 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-3xs"
              id="view-gap-recommendations"
            >
              <Lucide.TrendingDown className="w-4 h-4 text-rose-500" />
              Generate AI Advice
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
