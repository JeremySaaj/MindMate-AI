/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Teacher Course Management View
// Implements requirements TCH-COURSE-01 to TCH-COURSE-07 fully.

import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { MockDatabase } from '../../core/mockDb';
import { Course, Module, Material, ModuleQuiz } from '../../core/types';

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Child schemas mapped specifically to active editing course
  const [modules, setModules] = useState<Module[]>([]);
  const [materialsByModule, setMaterialsByModule] = useState<Record<string, Material[]>>({});
  const [quizzesByModule, setQuizzesByModule] = useState<Record<string, ModuleQuiz | null>>({});

  // Forms management: Creating Course
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSynopsis, setNewSynopsis] = useState('');

  // Forms management: Creating Module
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModTitle, setNewModTitle] = useState('');

  // Forms management: Creating Material
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [targetModId, setTargetModId] = useState('');
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatFileType, setNewMatFileType] = useState<'pdf' | 'docx' | 'video' | 'text'>('pdf');
  const [newMatContent, setNewMatContent] = useState('');
  const [newMatPages, setNewMatPages] = useState(1);

  useEffect(() => {
    loadAllCourses();
  }, []);

  const loadAllCourses = () => {
    const list = MockDatabase.getCourses();
    setCourses(list);
    
    if (selectedCourse) {
      // Refresh selected course too
      const freshSelected = list.find(c => c.id === selectedCourse.id);
      if (freshSelected) {
        setSelectedCourse(freshSelected);
        loadCourseAssets(freshSelected.id);
      }
    }
  };

  const loadCourseAssets = (cId: string) => {
    const allModules = MockDatabase.getModules().filter(m => m.courseId === cId);
    const allMaterials = MockDatabase.getMaterials().filter(mat => mat.courseId === cId);
    const allQuizzes = MockDatabase.getQuizzes().filter(q => q.courseId === cId);

    const matsMap: Record<string, Material[]> = {};
    const quizMap: Record<string, ModuleQuiz | null> = {};

    allModules.forEach(m => {
      matsMap[m.id] = allMaterials.filter(mat => mat.moduleId === m.id);
      quizMap[m.id] = allQuizzes.find(q => q.moduleId === m.id) || null;
    });

    setModules(allModules.sort((a,b) => a.order - b.order));
    setMaterialsByModule(matsMap);
    setQuizzesByModule(quizMap);
  };

  // Form submitted: Add Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSynopsis.trim()) return;

    const list = MockDatabase.getCourses();
    const newCourse: Course = {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      title: newTitle,
      synopsis: newSynopsis,
      teacherId: 'u2', // Dr Sarah Jenkins
      teacherName: 'Dr. Sarah Jenkins',
      publishStatus: 'draft' // Starts in draft to demonstrate publish workflow
    };

    list.push(newCourse);
    MockDatabase.saveCourses(list);
    
    // Clear & Refresh
    setNewTitle('');
    setNewSynopsis('');
    setShowAddCourse(false);
    loadAllCourses();
    setSelectedCourse(newCourse);
  };

  // Toggles Published Status
  const handlePublishCourse = (courseId: string) => {
    const list = MockDatabase.getCourses();
    const idx = list.findIndex(c => c.id === courseId);
    if (idx !== -1) {
      const active = list[idx];
      active.publishStatus = active.publishStatus === 'published' ? 'draft' : 'published';
      MockDatabase.saveCourses(list);
      loadAllCourses();
    }
  };

  // Form submitted: Add Module
  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newModTitle.trim()) return;

    const list = MockDatabase.getModules();
    const newMod: Module = {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      courseId: selectedCourse.id,
      title: `Module ${modules.length + 1}: ${newModTitle}`,
      order: modules.length + 1,
      publishStatus: 'published'
    };

    list.push(newMod);
    MockDatabase.saveModules(list);

    setNewModTitle('');
    setShowAddModule(false);
    loadCourseAssets(selectedCourse.id);
  };

  // Form submitted: Add Material
  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !targetModId || !newMatTitle.trim() || !newMatContent.trim()) return;

    const list = MockDatabase.getMaterials();
    const siblingMaterials = materialsByModule[targetModId] || [];

    const newMaterial: Material = {
      id: 'mat_' + Math.random().toString(36).substr(2, 9),
      moduleId: targetModId,
      courseId: selectedCourse.id,
      title: newMatTitle,
      fileType: newMatFileType,
      fileContent: newMatContent,
      pageCount: newMatPages,
      publishStatus: 'published',
      order: siblingMaterials.length + 1
    };

    list.push(newMaterial);
    MockDatabase.saveMaterials(list);

    // Clear
    setNewMatTitle('');
    setNewMatContent('');
    setNewMatPages(1);
    setShowAddMaterial(false);
    loadCourseAssets(selectedCourse.id);
  };

  // Form submitted: Create Module validation Quiz
  const handlePublishQuiz = (moduleId: string) => {
    if (!selectedCourse) return;
    const allQuizzes = MockDatabase.getQuizzes();
    
    // Seed standard 2 MCQ questions for this validation quiz
    const newQuiz: ModuleQuiz = {
      id: 'q_' + Math.random().toString(36).substr(2, 9),
      moduleId,
      courseId: selectedCourse.id,
      questions: [
        {
          questionText: 'Which of the following describes the core goal of structural learning optimization?',
          options: ['Maximizing computation steps', 'Minimizing the loss coordinates value', 'Multiplying biases constants', 'Deleting edge validation vectors'],
          correctOptionIndex: 1
        },
        {
          questionText: 'What parameter calibrates the step size taken during optimization calculations?',
          options: ['Hidden layer activation', 'The learning rate alpha', 'Recursive loss biases', 'Continuous derivatives gradients'],
          correctOptionIndex: 1
        }
      ],
      publishStatus: 'published'
    };

    allQuizzes.push(newQuiz);
    MockDatabase.saveQuizzes(allQuizzes);
    loadCourseAssets(selectedCourse.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Curriculum Studio</h1>
          <p className="text-slate-500 mt-1">Deploy study materials, build validation checkpoints, and toggle published limits of courses.</p>
        </div>
        <button
          onClick={() => setShowAddCourse(true)}
          className="px-5 py-3/12 py-3 bg-red-650 text-white rounded-xl text-sm font-bold hover:bg-black shadow-md shadow-red-100 flex items-center justify-center gap-2 self-start sm:self-center"
          id="trigger-add-course"
        >
          <Lucide.Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Course Navigation Pane */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-850 text-sm tracking-tight">Active Registries</h3>
            <p className="text-[10px] text-slate-400 font-medium font-sans">Select a course schema to manage details</p>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {courses.map((course) => {
              const works = selectedCourse?.id === course.id;
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    loadCourseAssets(course.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    works
                      ? 'bg-red-50 border-red-200 text-slate-900 shadow-3xs'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-655 hover:text-slate-905'
                  }`}
                  id={`course-nav-btn-${course.id}`}
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-xs truncate leading-snug">{course.title}</h4>
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full inline-block ${
                      course.publishStatus === 'published'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {course.publishStatus}
                    </span>
                  </div>
                  <Lucide.ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Modules and editing nodes details */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs min-h-[40vh] space-y-6">
          {!selectedCourse ? (
            <div className="py-24 text-center space-y-3">
              <Lucide.BookOpenCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-base">No Program Selected</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-tight">Choose one of the active registries on the left navigator to inject modules, upload documents, or publish final quizzes.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Course detail summary and publish toggles (TCH-COURSE-05/06) */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450">Active Editor</span>
                  <h3 className="text-lg font-black text-slate-900 truncate tracking-tight leading-tight">{selectedCourse.title}</h3>
                  <p className="text-xs text-slate-450 leading-tight truncate">{selectedCourse.synopsis}</p>
                </div>
                
                <div className="flex gap-2 flex-shrink-0 self-start sm:self-center">
                  <button
                    onClick={() => handlePublishCourse(selectedCourse.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedCourse.publishStatus === 'published'
                        ? 'bg-emerald-55 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 shadow-3xs'
                        : 'bg-red-650 text-white hover:bg-black border-red-650 shadow-3xs'
                    }`}
                    id="publish-course-toggle"
                  >
                    {selectedCourse.publishStatus === 'published' ? 'Unpublish Course' : 'Publish Course'}
                  </button>
                </div>
              </div>

              {/* Modules and course creation list (TCH-COURSE-03) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-850 text-sm flex items-center gap-2">
                    <Lucide.Grid className="w-4 h-4 text-red-600" />
                    Chapter Curriculum Map
                  </h3>
                  <button
                    onClick={() => setShowAddModule(true)}
                    className="p-1 px-3 text-[10px] font-bold text-red-655 bg-red-50 border border-red-105 hover:bg-red-100 rounded-lg transition-all"
                    id="add-module-btn"
                  >
                    + Add Chapter Module
                  </button>
                </div>

                <div className="space-y-4">
                  {modules.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center space-y-2">
                      <Lucide.FolderPlus className="w-8 h-8 text-slate-350" />
                      <div className="text-center">
                        <h4 className="font-bold text-slate-700 text-sm">No Chapter Modules</h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-tight mt-0.5">Chapters hold reading materials and completion validation checks for students.</p>
                      </div>
                    </div>
                  ) : (
                    modules.map((m) => {
                      const mats = materialsByModule[m.id] || [];
                      const quizObj = quizzesByModule[m.id];

                      return (
                        <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-3s">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-850 text-sm sm:text-base leading-snug">{m.title}</h4>
                            <div className="flex gap-2">
                              {/* Trigger Add Material Form */}
                              <button
                                onClick={() => {
                                  setTargetModId(m.id);
                                  setShowAddMaterial(true);
                                }}
                                className="text-[10px] font-bold py-1 px-2.5 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all rounded-lg text-slate-650"
                                id={`add-material-${m.id}`}
                              >
                                + Add Material File
                              </button>
                              
                              {!quizObj && (
                                <button
                                  onClick={() => handlePublishQuiz(m.id)}
                                  className="text-[10px] font-bold py-1 px-2.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-100 rounded-lg transition-all"
                                  id={`add-quiz-${m.id}`}
                                >
                                  + Publish Quiz Check
                                </button>
                              )}
                            </div>
                          </div>

                          {/* List Materials inside this Module and edit them */}
                          <div className="space-y-2 pl-2 border-l-2 border-red-100">
                            {mats.length === 0 ? (
                              <div className="text-xs text-slate-400 font-medium py-1">No files created for this section. Add PDF reference or write core lecture text.</div>
                            ) : (
                              mats.map((mat) => (
                                <div key={mat.id} className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-150- border-slate-200/50 text-xs flex justify-between items-center group">
                                  <div className="flex items-center gap-2">
                                    <Lucide.FileCode className="w-4 h-4 text-slate-400" />
                                    <span className="font-bold text-slate-800 truncate pr-4 max-w-xs">{mat.title}</span>
                                    <span className="text-[9px] uppercase font-bold text-slate-400 bg-white border px-1.5 rounded-md">{mat.fileType}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400">{mat.pageCount} pages</span>
                                </div>
                              ))
                            )}

                            {quizObj && (
                              <div className="bg-red-50/30 p-2.5 rounded-lg border border-red-100/30 text-xs flex justify-between items-center">
                                <span className="font-bold text-red-750 flex items-center gap-1">
                                  <Lucide.Award className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                                  Validation checkpoint quiz: {quizObj.questions.length} questions live
                                </span>
                                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">published</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Course (TCH-COURSE-01/02) */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateCourse} className="bg-white rounded-3xl w-full max-w-md border border-slate-205 shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">Create New Course Schema</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Course title</label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Generative Models"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold"
                  required
                  id="new-course-title"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Synopsis / Short description</label>
                <textarea
                  placeholder="Provide a syllabus summary explaining key concepts..."
                  value={newSynopsis}
                  rows={3}
                  onChange={(e) => setNewSynopsis(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold"
                  required
                  id="new-course-synopsis"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-50">
              <button
                type="button"
                onClick={() => setShowAddCourse(false)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold hover:bg-slate-50 text-slate-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-650 text-white rounded-xl text-xs font-bold hover:bg-black shadow-xs"
                id="submit-new-course"
              >
                Create Schema
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Module (TCH-COURSE-03) */}
      {showAddModule && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateModule} className="bg-white rounded-3xl w-full max-w-sm border border-slate-205 shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">Add Chapter Module</h3>
            
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Chapter title</label>
              <input
                type="text"
                placeholder="e.g. Backpropagation gradients optimization"
                value={newModTitle}
                onChange={(e) => setNewModTitle(e.target.value)}
                className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold"
                required
                id="new-module-title-input"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-50">
              <button
                type="button"
                onClick={() => setShowAddModule(false)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold hover:bg-slate-50 text-slate-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-650 text-white rounded-xl text-xs font-bold hover:bg-black shadow-xs"
                id="submit-new-module"
              >
                Add Module
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Material Workspace (TCH-COURSE-03/04) */}
      {showAddMaterial && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateMaterial} className="bg-white rounded-3xl w-full max-w-lg border border-slate-205 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">Add Lesson Material File</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Material Title</label>
                <input
                  type="text"
                  placeholder="e.g. Multi-layer Perceptron architectures deep study"
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold"
                  required
                  id="new-material-title-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Document Type</label>
                  <select
                    value={newMatFileType}
                    onChange={(e) => setNewMatFileType(e.target.value as any)}
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold"
                    id="new-material-type"
                  >
                    <option value="pdf">PDF File</option>
                    <option value="docx">DOCX File</option>
                    <option value="video">Video URL Lecture</option>
                    <option value="text">Written Text Lesson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Estimated Page count</label>
                  <input
                    type="number"
                    min={1}
                    value={newMatPages}
                    onChange={(e) => setNewMatPages(parseInt(e.target.value) || 1)}
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold font-mono"
                    required
                    id="new-material-pages"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Lesson lecture notes / Core content</label>
                <p className="text-[10px] text-slate-400 font-medium font-sans pb-1">This text is directly used by the AI adaptive model to generate explanations, so keep it rigorous and detailed.</p>
                <textarea
                  placeholder="Paste or write detailed lesson textbook content notes here..."
                  value={newMatContent}
                  rows={5}
                  onChange={(e) => setNewMatContent(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold pr-2"
                  required
                  id="new-material-content"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-50">
              <button
                type="button"
                onClick={() => setShowAddMaterial(false)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold hover:bg-slate-50 text-slate-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-655 text-white rounded-xl text-xs font-bold hover:bg-black shadow-xs"
                id="submit-new-material"
              >
                Upload File Material
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
