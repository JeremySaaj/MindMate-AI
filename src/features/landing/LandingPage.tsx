/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Landing Page View
// Implements requirements LP-01 to LP-08, communicating core product values and flows elegantly.

import * as Lucide from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const steps = [
    {
      icon: <Lucide.UploadCloud className="w-6 h-6 text-red-600" />,
      title: "1. Upload Materials",
      description: "Teachers drop PDFs, documents, or lecture notes straight into the active course dashboard."
    },
    {
      icon: <Lucide.BrainCircuit className="w-6 h-6 text-red-700" />,
      title: "2. AI Course Breakdown",
      description: "Gemini analyzes original texts and outlines a logical, customized study pathway automatically."
    },
    {
      icon: <Lucide.Sparkles className="w-6 h-6 text-black" />,
      title: "3. Adaptive Learning Journey",
      description: "Students read concepts tailored to adaptive levels and unlock topics via mock quizzes."
    },
    {
      icon: <Lucide.AreaChart className="w-6 h-6 text-red-655" />,
      title: "4. Real-time Gap Analysis",
      description: "Teachers review class performance histograms and generate AI teaching solutions on the fly."
    }
  ];

  const features = [
    {
      icon: <Lucide.Fingerprint className="w-5 h-5 text-red-550" />,
      title: "AI Course Breakdown",
      description: "Automatically indexes any course document into a comprehensive topic modular hierarchy.",
      status: "MVP Ready"
    },
    {
      icon: <Lucide.Gauge className="w-5 h-5 text-red-600" />,
      title: "Multi-Level Explanations",
      description: "Toggle on-demand study explanations matching ELI5, High School, or University reading scales.",
      status: "MVP Ready"
    },
    {
      icon: <Lucide.UserCheck className="w-5 h-5 text-black" />,
      title: "Context-Aware AI Tutor",
      description: "Ask smart queries directly grounded in the specific paragraph of your uploaded lecture files.",
      status: "MVP Ready"
    },
    {
      icon: <Lucide.ShieldCheck className="w-5 h-5 text-red-750" />,
      title: "Quiz-Based Progression",
      description: "Demonstrate conceptual proficiency via question matching quizzes before progressing to advanced models.",
      status: "MVP Ready"
    },
    {
      icon: <Lucide.BarChart4 className="w-5 h-5 text-red-600" />,
      title: "Teacher Learning Analytics",
      description: "Isolate student struggles and view critical class learning gap alert summaries automatically.",
      status: "MVP Ready"
    },
    {
      icon: <Lucide.Compass className="w-5 h-5 text-slate-400" />,
      title: "Personal Learning Space",
      description: "Save customized annotations, create master study bundles, and organize personalized journals.",
      status: "Future Scope"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      {/* Landing Header */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-white shadow-2xs sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
            <Lucide.GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900" id="lp-logo">Mind Mate</span>
        </div>
        <button
          onClick={() => onNavigate('/signin')}
          className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-white border border-slate-200 rounded-xl hover:bg-black transition-all shadow-2xs"
          id="lp-signin-btn"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-750 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          <Lucide.Sparkles className="w-3.5 h-3.5 text-red-600" />
          AI-Powered Student Learning Journeys
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto" id="lp-hero-title">
          Turn Course Materials Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-black">Adaptive Learning Journeys</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Mind Mate parses documents, details topics into deep, multi-level explanations, guides study paths with adaptive testing, and logs gap maps for teachers.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('/signin')}
            className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 active:translate-y-0"
            id="lp-get-started"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Product Flow Section */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">How Mind Mate Inspires Learning</h2>
            <p className="text-slate-500 font-medium">A seamless full-stack feedback loop bridging study material and class performance analysis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((st, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100/80 shadow-3xs flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  {st.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Adaptive Classroom Capabilities</h2>
          <p className="text-slate-500 font-medium">Engineered for classrooms, optimized for personalized comprehension levels.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((fe, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    {fe.icon}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                    fe.status === 'MVP Ready' 
                      ? 'bg-red-50 text-red-700' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {fe.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{fe.title}</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{fe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Footer */}
      <section className="bg-black text-white rounded-3xl max-w-6xl mx-6 sm:mx-auto mb-20 p-12 text-center space-y-6 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-700/10 rounded-full blur-3xl"></div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to uplift student outcomes?</h2>
        <p className="text-rose-100 max-w-md mx-auto text-sm font-medium">
          Create an account right now. Build training metrics, deploy materials, or login as a student to see the AI breakdown.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('/signin')}
            className="px-8 py-3.5 bg-red-650 text-white font-bold rounded-2xl hover:bg-white hover:text-black transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            id="lp-foot-cta"
          >
            Launch Classroom Tool
          </button>
        </div>
      </section>
    </div>
  );
}
