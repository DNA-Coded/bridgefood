import React from 'react';
import { useAiStore } from '../../stores/aiStore';
import { AIDecisionTimeline } from './AIDecisionTimeline';

export const LiveAIActivityPanel: React.FC = () => {
  const { liveActivity, lastAnalysisTime } = useAiStore();

  const doneCount = liveActivity.filter((s) => s.status === 'done').length;
  const hasActivity = liveActivity.some((s) => s.status !== 'pending');
  const isComplete = doneCount === liveActivity.length;
  const isRunning = liveActivity.some((s) => s.status === 'running');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm">⚡</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Gemma Activity</span>
        </div>
        {isRunning && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Processing
          </span>
        )}
        {isComplete && hasActivity && (
          <span className="text-[10px] font-bold text-primary">
            ✓ Analysis complete
          </span>
        )}
        {!hasActivity && (
          <span className="text-[10px] text-slate-400">Waiting for upload</span>
        )}
      </div>

      {/* Timeline */}
      <div className="px-4 py-3">
        {!hasActivity ? (
          <div className="space-y-2 py-2">
            {liveActivity.map((step) => (
              <div key={step.id} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                <span className="text-[11px] text-slate-400">{step.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <AIDecisionTimeline steps={liveActivity} compact />
        )}
      </div>

      {/* Footer: last run time */}
      {lastAnalysisTime && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <p className="text-[10px] text-slate-400">
            Last run:{' '}
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {new Date(lastAnalysisTime).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
