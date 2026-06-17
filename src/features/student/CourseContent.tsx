/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Student Course Content View
// Implements requirements STU-CONTENT-01 to STU-CONTENT-09.

import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { MockDatabase } from '../../core/mockDb';
import { Course, Module, Material, ModuleQuiz, MaterialProgress } from '../../core/types';

interface CourseContentProps {
  courseId: string;
  onNavigate: (path: string) => void;
}

export function CourseContent({ courseId, onNavigate }: CourseContentProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [materialsByModule, setMaterialsByModule] = useState<Record<string, Material[]>>({});
  const [quizzesByModule, setQuizzesByModule] = useState<Record<string, ModuleQuiz | null>>({});
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  
  // Progress states
  const [progresses, setProgresses] = useState<Record<string, MaterialProgress>>({});
  const [overallProgress, setOverallProgress] = useState(0);

  // Module quiz interactive state
  const [activeQuiz, setActiveQuiz] = useState<ModuleQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  const loadCourseDetails = () => {
    const allCourses = MockDatabase.getCourses();
    const currCourse = allCourses.find(c => c.id === courseId);
    if (!currCourse) return;

    setCourse(currCourse);

    // Filter published modules, materials, quizzes
    const courseModules = MockDatabase.getModules()
      .filter(m => m.courseId === courseId && m.publishStatus === 'published')
      .sort((a, b) => a.order - b.order);

    const courseMaterials = MockDatabase.getMaterials()
      .filter(mat => mat.courseId === courseId && mat.publishStatus === 'published');

    const courseQuizzes = MockDatabase.getQuizzes()
      .filter(q => q.courseId === courseId && q.publishStatus === 'published');

    const studentId = 'u1'; // Alex Johnson
    const progressRecords = MockDatabase.getMaterialProgress(studentId);

    // Map materials and quizzes to modules
    const matsMap: Record<string, Material[]> = {};
    const quizMap: Record<string, ModuleQuiz | null> = {};
    const progMap: Record<string, MaterialProgress> = {};

    courseModules.forEach(m => {
      matsMap[m.id] = courseMaterials.filter(mat => mat.moduleId === m.id).sort((a, b) => a.order - b.order);
      quizMap[m.id] = courseQuizzes.find(q => q.moduleId === m.id) || null;
    });

    progressRecords.forEach(p => {
      progMap[p.materialId] = p;
    });

    setModules(courseModules);
    setMaterialsByModule(matsMap);
    setQuizzesByModule(quizMap);
    setProgresses(progMap);

    // Auto expand first module
    if (courseModules.length > 0) {
      setOpenModuleId(courseModules[0].id);
    }

    // Calculate overall progress percentage
    const publishedMaterials = courseMaterials;
    if (publishedMaterials.length > 0) {
      const completedCount = publishedMaterials.filter(m => {
        const p = progMap[m.id];
        return p ? p.highestLevelPassed === 3 : false;
      }).length;
      setOverallProgress(Math.round((completedCount / publishedMaterials.length) * 100));
    }
  };

  const handleToggleModule = (moduleId: string) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
  };

  const handleStartQuiz = (quiz: ModuleQuiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizScore(null);
    setQuizFinished(false);
  };

  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizFinished(true);

    // Log this quiz attempt event
    MockDatabase.addAnalyticsEvent({
      eventType: 'quiz_attempt',
      courseId,
      moduleId: activeQuiz.moduleId,
      materialId: 'module_quiz_final',
      studentId: 'u1',
      value: { score, passed: score === activeQuiz.questions.length }
    });
  };

  if (!course) {
    return (
      <div className="text-center py-12">
        <Lucide.AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3 animate-bounce" />
        <h2 className="text-lg font-bold text-slate-800">Course Not Found</h2>
        <button onClick={() => onNavigate('/student/courses')} className="mt-4 text-red-650 font-bold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back to courses */}
      <button 
        onClick={() => onNavigate('/student/courses')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-850 group transition-colors"
        id="back-to-courses-btn"
      >
        <Lucide.ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Back to My Courses
      </button>

      {/* Header Info Block */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-650 bg-red-50 px-2.5 py-0.5 rounded-md">Course</span>
            <span className="text-xs font-medium text-slate-400">Led by {course.teacherName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{course.title}</h1>
        </div>

        {/* Progress Circle Indicator */}
        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex-shrink-0">
          <div className="relative w-12 h-12 rounded-full border-4 border-slate-200/50 flex items-center justify-center font-black text-sm text-slate-800 shadow-3xs">
            {overallProgress}%
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Overall Success</span>
            <span className="text-xs text-slate-500 font-semibold">Adaptive modules finished</span>
          </div>
        </div>
      </div>

      {/* Main Container Column: Modules Accordions */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800 tracking-tight">Structured Course Outline</h2>
        
        <div className="space-y-3">
          {modules.map((m) => {
            const isOpen = openModuleId === m.id;
            const mats = materialsByModule[m.id] || [];
            const quiz = quizzesByModule[m.id];

            return (
              <div 
                key={m.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden transition-all"
                id={`module-item-${m.id}`}
              >
                {/* Header line triggered to expand accordion */}
                <button
                  onClick={() => handleToggleModule(m.id)}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50/50 flex items-center justify-between transition-colors focus:outline-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-xs select-none border border-red-100/20">
                      M{m.order}
                    </div>
                    <span className="font-bold text-slate-800 tracking-tight text-base sm:text-lg">{m.title}</span>
                  </div>
                  {isOpen ? (
                    <Lucide.ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Lucide.ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {/* Expanded Details List */}
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/20 space-y-3.5">
                    {/* Materials Loop */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Lesson Files</span>
                      {mats.length === 0 ? (
                        <div className="text-xs text-slate-400 py-2">No lecture items uploaded to this module yet.</div>
                      ) : (
                        mats.map((material) => {
                          const progress = progresses[material.id];
                          const codeLevel = progress ? progress.highestLevelPassed : 0;
                          const isFinished = codeLevel === 3;

                          return (
                            <div
                              key={material.id}
                              onClick={() => onNavigate(`/student/material/${material.id}`)}
                              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs hover:border-slate-300 transition-all flex items-center justify-between cursor-pointer hover:shadow-2xs group"
                              id={`material-btn-${material.id}`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform flex-shrink-0 border border-amber-100/30">
                                  {material.fileType === 'pdf' ? (
                                    <Lucide.FileText className="w-4 h-4" />
                                  ) : (
                                    <Lucide.Bookmark className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <h4 className="font-bold text-slate-800 text-sm truncate pr-4 group-hover:text-red-650 transition-colors">{material.title}</h4>
                                  <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                                    <span>{material.fileType}</span>
                                    <span>•</span>
                                    <span>{material.pageCount} pages</span>
                                  </div>
                                </div>
                              </div>

                              {/* Completed Level Tick Marks */}
                              <div className="flex items-center gap-2">
                                {isFinished ? (
                                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 border border-emerald-100 shadow-3xs">
                                    <Lucide.Check className="w-3 h-3" />
                                    Mastered
                                  </span>
                                ) : codeLevel > 0 ? (
                                  <span className="bg-red-50 text-red-700 text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1">
                                    <Lucide.Sparkles className="w-3 h-3 animate-pulse text-red-600" />
                                    Level {codeLevel}/3
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-xs font-semibold px-2 hover:bg-slate-100 rounded-md py-1 transition-colors">Start study</span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Module final quiz section */}
                    {quiz && (
                      <div className="pt-4 border-t border-slate-100 mt-2">
                        <div className="bg-gradient-to-r from-red-50/50 to-slate-100/50 border border-red-100/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                              <Lucide.Award className="w-4 h-4 text-red-600 animate-pulse" />
                              Module Validation Quiz
                            </h4>
                            <p className="text-xs text-slate-500 leading-tight">Test your cumulative knowledge on Module {m.order} core concepts.</p>
                          </div>
                          <button
                            onClick={() => handleStartQuiz(quiz)}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-xs"
                            id="take-module-quiz-btn"
                          >
                            Start Module Quiz
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Module quiz overlay modal */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 relative flex flex-col justify-between">
            <button
              onClick={() => setActiveQuiz(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg"
            >
              <Lucide.X className="w-5 h-5" />
            </button>

            <div className="space-y-4 flex-1">
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-red-600">Validation Quiz</span>
                <h3 className="text-xl font-bold text-slate-900">Module Knowledge Check</h3>
              </div>

              {!quizFinished ? (
                <div className="space-y-6 pt-2">
                  {activeQuiz.questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 pb-4 border-b border-slate-50 last:border-0">
                      <h4 className="font-bold text-slate-850 text-sm leading-snug">
                        {qIdx + 1}. {q.questionText}
                      </h4>
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleAnswerSelect(qIdx, oIdx)}
                            className={`p-3 text-left rounded-xl text-xs font-semibold border transition-all ${
                              quizAnswers[qIdx] === oIdx
                                ? 'bg-red-50 border-red-500 text-red-800'
                                : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border-2 border-red-200 shadow-md">
                    <Lucide.Award className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-extrabold text-slate-900">Quiz Completed!</h4>
                    <p className="text-sm font-semibold text-slate-500">
                      You scored <span className="font-extrabold text-red-600">{quizScore}</span> / {activeQuiz.questions.length} correct answers.
                    </p>
                  </div>
                  {quizScore && quizScore >= activeQuiz.questions.length ? (
                    <div className="bg-emerald-50 text-emerald-700 py-3 px-4 rounded-xl text-xs font-bold border border-emerald-100 max-w-sm mx-auto">
                      🎉 Outstanding! Perfect score achieved. Good job!
                    </div>
                  ) : (
                    <div className="bg-amber-50 text-amber-705 text-amber-800 py-3 px-4 rounded-xl text-xs font-bold border border-amber-100 max-w-sm mx-auto">
                      Nice work. Review materials and retry to hit a full score.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end">
              {!quizFinished ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                  className={`px-6 py-3 rounded-xl font-bold text-xs text-white transition-all ${
                    Object.keys(quizAnswers).length === activeQuiz.questions.length
                      ? 'bg-red-600 hover:bg-red-700 cursor-pointer shadow-md shadow-red-100'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  id="submit-quiz-modal"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  id="close-quiz-modal"
                >
                  Finish & Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
