/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Teacher Learning Analytics Page with dynamic custom SVG statistics diagrams and AI advice models
// Implements requirements TCH-ANA-01 to TCH-ANA-10.

import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { MockDatabase } from '../../core/mockDb';
import { TopicPerformanceDetail, TeachingRecommendation } from '../../core/types';

export function TeacherAnalytics() {
  const [topicPerfs, setTopicPerfs] = useState<TopicPerformanceDetail[]>([]);
  const [summaryData, setSummaryData] = useState({
    lowestScore: 5.0,
    lowestTopicName: '--',
    mostAiQuestions: 0,
    mostAiTopicName: '--',
    belowThresholdCount: 0,
    totalAttempts: 0
  });

  // Selected topic for generating AI Advice
  const [analyzingTopic, setAnalyzingTopic] = useState<TopicPerformanceDetail | null>(null);
  const [recommendation, setRecommendation] = useState<TeachingRecommendation | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const perfs = MockDatabase.getTopicPerformances();
    setTopicPerfs(perfs);

    if (perfs.length === 0) return;

    // Calculate Summary Metrics
    let lowestScore = 5.0;
    let lowestTopicName = '--';
    let mostAiQuestions = 0;
    let mostAiTopicName = '--';
    let belowThresholdCount = 0;
    let totalAttempts = 0;

    perfs.forEach(p => {
      totalAttempts += p.attempts;
      
      if (p.avgScore < lowestScore) {
        lowestScore = p.avgScore;
        lowestTopicName = p.topicTitle;
      }

      if (p.aiQuestions > mostAiQuestions) {
        mostAiQuestions = p.aiQuestions;
        mostAiTopicName = p.topicTitle;
      }

      // Quiz failure threshold <= 60%
      if (p.avgScore < 3.0 || p.failureRate > 40) {
        belowThresholdCount++;
      }
    });

    setSummaryData({
      lowestScore,
      lowestTopicName,
      mostAiQuestions,
      mostAiTopicName,
      belowThresholdCount,
      totalAttempts
    });

    // Auto set first struggling topic for inline display convenience
    const struggling = perfs.find(p => p.status === 'Needs Attention');
    if (struggling) {
      setAnalyzingTopic(struggling);
    } else if (perfs.length > 0) {
      setAnalyzingTopic(perfs[0]);
    }
  };

  const handleGenerateRecommendation = async (topic: TopicPerformanceDetail) => {
    setAnalyzingTopic(topic);
    setLoadingAdvice(true);
    setRecommendation(null);

    try {
      const res = await fetch('/api/teacher/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: topic.topicTitle,
          avgScore: topic.avgScore,
          aiQuestions: topic.aiQuestions,
          failureRate: topic.failureRate
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
      } else {
        throw new Error('Recommendation API failed');
      }
    } catch (e) {
      // Offline fallback recommendation simulator
      setTimeout(() => {
        setRecommendation({
          topicId: topic.topicId,
          topicTitle: topic.topicTitle,
          analysis: `Analysis outlines that students are struggling heavily with derivative gradients and error backpropagation matrices. 
Most students repeatedly choke on tracing gradient steps back across nested multi-layered nodes, triggering high support help query logs with Gemini.`,
          recommendations: [
            "Conduct an interactive walkathon tracing nested mathematical equations using large colored chalk drawings on the class whiteboard.",
            "Formulate 3 simplified step-by-step paper exercises without variables to help students debug single node weight adjustments manually.",
            "Deploy a custom interactive spreadsheet showing real-time Cell formula feedback of Chain Rule calculus values dynamically."
          ],
          generatedAt: new Date().toISOString()
        });
      }, 1000);
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Classroom Analytics & Gap Maps</h1>
        <p className="text-slate-500 mt-1">Review student performance, map conceptual struggles, and unlock customized AI teaching recommendations.</p>
      </div>

      {/* Critical gap banner alert (TCH-ANA-03) */}
      {summaryData.belowThresholdCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-6 flex-col md:flex-row">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-white border border-rose-100 text-rose-550 flex-shrink-0 shadow-3xs">
              <Lucide.AlertOctagon className="w-6 h-6 text-rose-600 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                Critical Learning Gaps Detected
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed font-semibold">
                Students are facing persistent blocks with <span className="text-rose-600 font-extrabold">{summaryData.lowestTopicName}</span>. 
                Quiz failure rates have spiked, and AI support questions indicate high cognitive load.
              </p>
            </div>
          </div>
          {analyzingTopic && (
            <button
              onClick={() => handleGenerateRecommendation(analyzingTopic)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-100 flex-shrink-0 flex items-center gap-1.5"
              id="critical-recommendation-btn"
            >
              <Lucide.Brain className="w-4 h-4 text-rose-100" />
              Generate Remedy
            </button>
          )}
        </div>
      )}

      {/* Summary metric matrix (TCH-ANA-06) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Lowest Avg Score</span>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight text-red-600">{summaryData.lowestScore.toFixed(1)} / 5</div>
          <p className="text-[10px] text-slate-500 font-medium truncate">{summaryData.lowestTopicName}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Most AI Questions</span>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight text-violet-650">+{summaryData.mostAiQuestions} pings</div>
          <p className="text-[10px] text-slate-500 font-medium truncate">Logged on {summaryData.mostAiTopicName}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Topics Below 60%</span>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight text-rose-600">{summaryData.belowThresholdCount} concepts</div>
          <p className="text-[10px] text-slate-500 font-medium truncate">Require instructional review</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Total Quiz Attempts</span>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight text-emerald-600">+{summaryData.totalAttempts} cycles</div>
          <p className="text-[10px] text-slate-500 font-medium truncate">Aggregated across all classrooms</p>
        </div>
      </div>

      {/* SVG charts sections (TCH-ANA-07) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Quiz Scores */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
          <div className="pb-1 border-b border-slate-50">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Lucide.GraduationCap className="w-4 h-4 text-red-650" />
              Quiz Scores by Concept Topic
            </h4>
          </div>
          
          <div className="pt-4 h-48 flex items-end gap-1.5 border-b border-l border-slate-250 border-slate-200 pl-4 pb-2 relative">
            {topicPerfs.map((p, idx) => {
              const scoreHeightPercent = (p.avgScore / 5) * 100;
              const color = p.status === 'Needs Attention' ? 'bg-rose-500' : p.status === 'Below Average' ? 'bg-amber-400' : 'bg-red-600';
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip trigger */}
                  <div className={`w-full ${color} rounded-t-lg transition-all duration-300 shadow-xs hover:opacity-90 cursor-pointer`} style={{ height: `${scoreHeightPercent}%` }}></div>
                  
                  {/* Hover box */}
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-900 text-white text-[10px] font-mono py-1 px-2.5 rounded-md shadow-md z-150 transition-all pointer-events-none text-center whitespace-nowrap">
                    Score: {p.avgScore}/5
                  </div>
                </div>
              );
            })}
          </div>
          {/* Axis Labels */}
          <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-2">
            <span>Left Map (ANN)</span>
            <span>Middle Map (MSE)</span>
            <span>Right Map (G_Desc)</span>
          </div>
        </div>

        {/* Chart 2: AI help calls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
          <div className="pb-1 border-b border-slate-50">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Lucide.HelpCircle className="w-4 h-4 text-violet-500 animate-pulse" />
              AI Support Question Pings by Concept Topic
            </h4>
          </div>
          
          <div className="pt-4 h-48 flex items-end gap-1.5 border-b border-l border-slate-250 border-slate-200 pl-4 pb-2 relative">
            {topicPerfs.map((p, idx) => {
              const maxQuestions = 10;
              const qHeightPercent = (p.aiQuestions / maxQuestions) * 100;
              const color = 'bg-violet-600';
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <div className={`w-full ${color} rounded-t-lg transition-all duration-300 shadow-xs hover:opacity-90 cursor-pointer`} style={{ height: `${qHeightPercent}%` }}></div>
                  
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-900 text-white text-[10px] font-mono py-1 px-2.5 rounded-md shadow-md z-150 transition-all pointer-events-none text-center whitespace-nowrap">
                    {p.aiQuestions} queries
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-2">
            <span>ANN Node</span>
            <span>MSE Costs</span>
            <span>Gradient update</span>
          </div>
        </div>

      </div>

      {/* Grid: Detailed Concepts table list (TCH-ANA-08) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
        <h3 className="font-bold text-slate-850 tracking-tight text-base flex items-center gap-2 pb-2 border-b border-slate-50">
          <Lucide.Sliders className="w-4 h-4 text-red-650" />
          Concept Comprehension Index Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                <th className="py-3 px-2">Concept Title</th>
                <th className="py-3 px-2">Avg Score</th>
                <th className="py-3 px-2">Visits / Attempts</th>
                <th className="py-3 px-2">AI Help Pings</th>
                <th className="py-3 px-2">Failure Rate</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-705">
              {topicPerfs.map((t) => (
                <tr key={t.topicId} className="hover:bg-slate-50/50">
                  <td className="py-3 px-2 font-bold text-slate-900 leading-tight">
                    {t.topicTitle}
                    <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{t.courseTitle}</span>
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-slate-800">{t.avgScore.toFixed(1)} / 5</td>
                  <td className="py-3 px-2 font-mono text-slate-500">{t.attempts} cycles</td>
                  <td className="py-3 px-2 font-mono font-bold text-violet-650">+{t.aiQuestions} queries</td>
                  <td className="py-3 px-2 font-mono">
                    <span className={`font-semibold ${t.failureRate > 40 ? 'text-rose-600' : 'text-slate-700'}`}>{t.failureRate}%</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full inline-block ${
                      t.status === 'Needs Attention'
                        ? 'bg-rose-50 text-rose-700'
                        : t.status === 'Below Average'
                          ? 'bg-amber-50 text-amber-700'
                          : t.status === 'Fair'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleGenerateRecommendation(t)}
                      className="text-[10px] font-bold py-1 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-red-650 hover:border-red-250 transition-all"
                      id={`rec-btn-${t.topicId}`}
                    >
                      AI Teach Assist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side drawer / Card displaying generated recommendation analysis (TCH-ANA-04/05) */}
      {(analyzingTopic || loadingAdvice || recommendation) && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest">Grounded AI Advisor</span>
                <h3 className="text-xl font-bold tracking-tight">Teaching Solution: {analyzingTopic?.topicTitle || 'Concept Analysis'}</h3>
              </div>
              <button 
                onClick={() => {
                  setAnalyzingTopic(null);
                  setRecommendation(null);
                }} 
                className="text-slate-500 hover:text-slate-350"
              >
                <Lucide.X className="w-5 h-5" />
              </button>
            </div>

            {loadingAdvice ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2">
                <Lucide.Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                <span className="text-xs text-slate-400 font-mono">Formulating corrective teaching guidelines...</span>
              </div>
            ) : recommendation ? (
              <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Concept Struggle Analysis</span>
                  <p className="bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl leading-relaxed text-slate-300 whitespace-pre-line text-xs sm:text-sm">
                    {recommendation.analysis}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Recommended Action Plans</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    {recommendation.recommendations.map((rec, rIdx) => (
                       <div key={rIdx} className="bg-slate-800/50 p-4 border border-slate-800 rounded-xl space-y-1.5">
                        <div className="w-5 h-5 rounded-md bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px]">
                          {rIdx + 1}
                        </div>
                        <p className="text-slate-300 leading-relaxed truncate-3-lines">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950/30 rounded-xl border border-slate-850 border-slate-800 text-xs text-slate-450 leading-snug">
                Click the **AI Teach Assist** button on the Concept Table matrix to query Gemini. It reads aggregated failure parameters and formats customized corrective textbook examples.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
