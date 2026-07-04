import React, { useMemo } from 'react';
import { ActivityStep } from '../../stores/aiStore';

interface AIDecisionTimelineProps {
  steps: ActivityStep[];
  compact?: boolean;
}

const STEP_ICONS: Record<string, string> = {
  upload:   '📸',
  vision:   '🔍',
  identify: '🍱',
  quantity: '⚖️',
  shelf:    '📅',
  urgency:  '🚨',
  search:   '📍',
  rank:     '📊',
  impact:   '🌱',
  email:    '📧',
};

const StatusDot: React.FC<{ status: ActivityStep['status'] }> = ({ status }) => {
  if (status === 'done') {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/30">
        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (status === 'running') {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 ring-2 ring-amber-400/40">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 ring-2 ring-destructive/20">
        <svg className="h-3 w-3 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-border">
      <span className="h-2 w-2 rounded-full bg-muted-foreground" />
    </span>
  );
};

function formatDuration(ms: number | null): string {
  if (ms === null) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export const AIDecisionTimeline: React.FC<AIDecisionTimelineProps> = ({
  steps,
  compact = false,
}) => {
  const doneCount = useMemo(() => steps.filter((s) => s.status === 'done').length, [steps]);
  const totalCount = steps.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="space-y-3">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Gemma Reasoning Pipeline
          </span>
        </div>
        <span className="text-[10px] font-bold text-primary tabular-nums">
          {doneCount}/{totalCount} steps
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timeline steps */}
      <div className="relative space-y-0">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const icon = STEP_ICONS[step.id] ?? '⚙️';
          const isActive = step.status !== 'pending';

          return (
            <div key={step.id} className="flex gap-3">
              {/* Left: dot + connector line */}
              <div className="flex flex-col items-center">
                <StatusDot status={step.status} />
                {!isLast && (
                  <div
                    className={`w-px flex-1 my-1 transition-colors duration-500 ${
                      step.status === 'done'
                        ? 'bg-primary/30'
                        : 'bg-border'
                    }`}
                    style={{ minHeight: compact ? '12px' : '20px' }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div className={`flex-1 pb-${compact ? '2' : '3'} min-w-0`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {!compact && (
                      <span className="text-base leading-none shrink-0">{icon}</span>
                    )}
                    <span
                      className={`text-xs font-semibold leading-snug truncate ${
                        step.status === 'done'
                          ? 'text-foreground'
                          : step.status === 'running'
                          ? 'text-warning'
                          : step.status === 'error'
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {step.durationMs !== null && (
                    <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                      {formatDuration(step.durationMs)}
                    </span>
                  )}
                </div>

                {/* Metadata row: timestamp + confidence */}
                {!compact && isActive && (
                  <div className="flex items-center gap-3 mt-0.5">
                    {step.timestamp && (
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(step.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    )}
                    {step.confidence !== undefined && step.status === 'done' && (
                      <span className="text-[10px] font-semibold text-primary/80">
                        {Math.round(step.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
