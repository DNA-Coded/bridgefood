import React from 'react';

export interface TimelineEvent {
  type: string;
  description: string;
  timestamp: string;
  status?: 'done' | 'current' | 'pending';
}

interface DonationTimelineProps {
  events: TimelineEvent[];
  compact?: boolean;
}

const MILESTONE_ICONS: Record<string, string> = {
  'LISTING_CREATED':         '🌱',
  'GEMMA_ANALYSIS':          '🤖',
  'ORGANIZATIONS_RECOMMENDED': '📋',
  'EMAILS_SENT':             '📧',
  'APPEAL_RECEIVED':         '📩',
  'APPEAL_ACCEPTED':         '✅',
  'PICKUP_SCHEDULED':        '🚗',
  'DONATION_COMPLETED':      '🎉',
};

function guessIcon(type: string): string {
  const key = type.toUpperCase().replace(/\s+/g, '_');
  return MILESTONE_ICONS[key] ?? '📌';
}

function guessStatus(event: TimelineEvent, idx: number, allEvents: TimelineEvent[]): 'done' | 'current' | 'pending' {
  if (event.status) return event.status;
  // If it has a timestamp it's done
  if (event.timestamp) return 'done';
  // If the previous event was done and this one isn't, it's current
  if (idx > 0 && allEvents[idx - 1].timestamp) return 'current';
  return 'pending';
}

export const DonationTimeline: React.FC<DonationTimelineProps> = ({ events, compact = false }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 text-xs">
        No timeline events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative">
      {events.map((event, idx) => {
        const status = guessStatus(event, idx, events);
        const icon = guessIcon(event.type);
        const isLast = idx === events.length - 1;

        return (
          <div key={idx} className="flex gap-4">
            {/* Left: icon + connector */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                  status === 'done'
                    ? 'bg-primary/10 border-primary/30'
                    : status === 'current'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400/50 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className={status === 'pending' ? 'opacity-30' : ''}>{icon}</span>
              </div>
              {!isLast && (
                <div
                  className={`w-px flex-1 my-1 ${
                    status === 'done'
                      ? 'bg-primary/25'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  style={{ minHeight: compact ? '16px' : '24px' }}
                />
              )}
            </div>

            {/* Right: content */}
            <div className={`flex-1 ${isLast ? 'pb-0' : compact ? 'pb-2' : 'pb-4'}`}>
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-xs font-bold leading-snug ${
                    status === 'done'
                      ? 'text-slate-800 dark:text-slate-200'
                      : status === 'current'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {event.type.replace(/_/g, ' ')}
                </p>
                {event.timestamp && (
                  <span className="text-[10px] text-slate-400 shrink-0 tabular-nums whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
              {!compact && event.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
