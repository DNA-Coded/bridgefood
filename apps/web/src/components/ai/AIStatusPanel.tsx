import React, { useEffect, useCallback } from 'react';
import { useAiStore, ServiceStatus } from '../../stores/aiStore';

const MODEL_NAME = 'Gemma 4 (google/gemma-3-4b-it)';
const HEALTH_URL = 'http://127.0.0.1:8000/health';
const REFRESH_INTERVAL_MS = 30_000;

const StatusDot: React.FC<{ status: ServiceStatus; label: string }> = ({ status, label }) => {
  const cfg = {
    online:   { dot: 'bg-emerald-500',               text: 'text-slate-700 dark:text-slate-200', suffix: 'Online' },
    degraded: { dot: 'bg-amber-500 animate-pulse',   text: 'text-amber-700 dark:text-amber-400', suffix: 'Degraded' },
    offline:  { dot: 'bg-red-500',                   text: 'text-red-700 dark:text-red-400',     suffix: 'Offline' },
    checking: { dot: 'bg-slate-400 animate-pulse',   text: 'text-slate-400',                     suffix: 'Checking…' },
  }[status];

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full shrink-0 ${cfg.dot}`} />
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${cfg.text}`}>{cfg.suffix}</span>
    </div>
  );
};

function formatRelativeTime(iso: string | null): string {
  if (!iso) return 'Never';
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

export const AIStatusPanel: React.FC = () => {
  const { systemStatus, lastAnalysisTime, avgResponseTimeMs, setSystemStatus } = useAiStore();

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        setSystemStatus({
          gemma: 'online',
          mongodb: 'online',
          backend: 'online',
          email: data.email_ready === false ? 'degraded' : 'online',
          lastChecked: new Date().toISOString(),
        });
      } else {
        setSystemStatus({
          gemma: 'degraded',
          mongodb: 'degraded',
          backend: 'degraded',
          email: 'degraded',
          lastChecked: new Date().toISOString(),
        });
      }
    } catch {
      setSystemStatus({
        gemma: 'offline',
        mongodb: 'offline',
        backend: 'offline',
        email: 'offline',
        lastChecked: new Date().toISOString(),
      });
    }
  }, [setSystemStatus]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const avgSec = (avgResponseTimeMs / 1000).toFixed(1);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <span className="text-xs font-bold text-foreground">AI System Status</span>
        </div>
        <button
          onClick={checkHealth}
          className="text-[10px] font-semibold text-primary hover:underline"
          aria-label="Refresh status"
        >
          Refresh
        </button>
      </div>

      {/* Status indicators */}
      <div className="divide-y divide-border px-4 py-2">
        <StatusDot status={systemStatus.gemma}   label="Gemma" />
        <StatusDot status={systemStatus.mongodb}  label="MongoDB" />
        <StatusDot status={systemStatus.backend}  label="Backend API" />
        <StatusDot status={systemStatus.email}    label="Email Service" />
      </div>

      {/* Metadata */}
      <div className="space-y-2 border-t border-border bg-muted/30 px-4 py-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Model</span>
          <span className="text-[10px] font-bold text-foreground">{MODEL_NAME.split(' ').slice(0, 2).join(' ')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Avg Response</span>
          <span className="text-[10px] font-bold text-foreground tabular-nums">{avgSec} s</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Last Analysis</span>
          <span className="text-[10px] font-bold text-foreground tabular-nums">
            {formatRelativeTime(lastAnalysisTime)}
          </span>
        </div>
        {systemStatus.lastChecked && (
          <div className="flex justify-between items-center pt-0.5">
            <span className="text-[10px] text-muted-foreground">Last ping</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {formatRelativeTime(systemStatus.lastChecked)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
