/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Student Material Viewer Page
// Implements requirements STU-MAT-01 to STU-MAT-07.

import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { MockDatabase } from '../../core/mockDb';
import { Material, Module } from '../../core/types';

interface MaterialViewerProps {
  materialId: string;
  onNavigate: (path: string) => void;
}

export function MaterialViewer({ materialId, onNavigate }: MaterialViewerProps) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterial();
  }, [materialId]);

  const loadMaterial = () => {
    setLoading(true);
    const mats = MockDatabase.getMaterials();
    const currMat = mats.find(m => m.id === materialId && m.publishStatus === 'published');
    if (!currMat) {
      setLoading(false);
      return;
    }

    setMaterial(currMat);

    const mods = MockDatabase.getModules();
    const currMod = mods.find(m => m.id === currMat.moduleId);
    if (currMod) {
      setModule(currMod);
    }
    setLoading(false);

    // Track a visit event
    MockDatabase.addAnalyticsEvent({
      eventType: 'material_visit',
      courseId: currMat.courseId,
      moduleId: currMat.moduleId,
      materialId: currMat.id,
      studentId: 'u1'
    });
  };

  const handleBreakdownClick = () => {
    if (!material) return;
    onNavigate(`/student/breakdown/${material.id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Lucide.Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <span className="text-slate-400 font-semibold text-sm">Retrieving Lecture Data...</span>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="text-center py-12">
        <Lucide.AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3 animate-pulse" />
        <h2 className="text-lg font-bold text-slate-800">Material Unavailable</h2>
        <p className="text-slate-500 text-sm mt-1">This document has either been set to draft or removed by the instructor.</p>
        <button onClick={() => onNavigate('/student/courses')} className="mt-4 text-red-600 font-bold hover:underline">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back to modules button */}
      <button 
        onClick={() => onNavigate(`/student/course/${material.courseId}`)}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 group transition-colors focus:outline-hidden"
        id="back-to-modules-btn"
      >
        <Lucide.ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Modules
      </button>

      {/* Info header and Break down trigger */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              {material.fileType} Lesson
            </span>
            <span className="text-xs font-semibold text-slate-400 truncate max-w-sm sm:max-w-md">
              Part of {module ? module.title : 'Current Module'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{material.title}</h1>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Lucide.Files className="w-4 h-4" />
            Estimated count: {material.pageCount} pages of academic reference
          </div>
        </div>

        {/* Big Load Bear innovation key */}
        <button
          onClick={handleBreakdownClick}
          className="bg-red-650 text-white font-bold py-3.5 px-6 rounded-2xl hover:bg-black hover:shadow-red-150 shadow-md shadow-red-100 transition-all flex items-center justify-center gap-2.5 flex-shrink-0 group hover:-translate-y-0.5"
          id="breakdown-with-ai-btn"
        >
          <Lucide.Sparkles className="w-5 h-5 text-red-100 animate-pulse group-hover:rotate-12 transition-transform" />
          <div className="text-left">
            <span className="text-[10px] font-bold block opacity-75 uppercase">Adaptive Study View</span>
            <span className="text-sm font-extrabold block">Break Down with AI</span>
          </div>
          <Lucide.ChevronRight className="w-4 h-4 text-red-200" />
        </button>
      </div>

      {/* Main Material text content displaying original lesson nodes */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs max-w-4xl mx-auto overflow-hidden">
        {/* Mock top document toolbar to look extremely realistic */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/60 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Lucide.FileText className="w-4 h-4 text-slate-450" />
            Original Lecture File Text
          </span>
          <span>Security Grounded</span>
        </div>

        <div className="p-6 sm:p-10 text-slate-800 leading-relaxed font-normal whitespace-pre-line text-sm sm:text-base max-h-[60vh] overflow-y-auto font-sans pr-4 sm:pr-8">
          {material.fileContent}
        </div>

        {/* Floating AI Call Assist banner */}
        <div className="bg-slate-50 border-t border-slate-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100/50 flex items-center justify-center text-red-600">
              <Lucide.Zap className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-800">Struggling with academic paragraphs?</div>
              <p className="text-slate-400 font-medium">Use Gemini to generate customized analogies, level-adaptations, or flashcards instantly.</p>
            </div>
          </div>
          <button
            onClick={handleBreakdownClick}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-white hover:bg-slate-100/50 border border-slate-200 rounded-xl py-2 px-4 shadow-3xs transition-all flex items-center gap-1"
          >
            Generate AI Outline
            <Lucide.ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
