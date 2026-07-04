import { create } from 'zustand';
import { GemmaAnalysis } from '@foodbridge/types';

export type ServiceStatus = 'online' | 'degraded' | 'offline' | 'checking';

export interface SystemStatus {
  gemma: ServiceStatus;
  mongodb: ServiceStatus;
  backend: ServiceStatus;
  email: ServiceStatus;
  lastChecked: string | null;
}

export interface ActivityStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
  timestamp: string | null;
  durationMs: number | null;
  confidence?: number;
}

interface AiState {
  analyses: Record<string, GemmaAnalysis>;
  lastAnalysisTime: string | null;
  avgResponseTimeMs: number;
  responseSamples: number[];
  systemStatus: SystemStatus;
  liveActivity: ActivityStep[];

  addAnalysis: (analysisId: string, analysis: GemmaAnalysis) => void;
  setLastAnalysisTime: (time: string) => void;
  recordResponseTime: (ms: number) => void;
  setSystemStatus: (status: Partial<SystemStatus>) => void;
  setLiveActivity: (steps: ActivityStep[]) => void;
  updateActivityStep: (id: string, updates: Partial<ActivityStep>) => void;
  resetActivity: () => void;
}

const DEFAULT_ACTIVITY: ActivityStep[] = [
  { id: 'upload',     label: 'Food images received',       status: 'pending', timestamp: null, durationMs: null },
  { id: 'vision',     label: 'Images processed by Gemma',  status: 'pending', timestamp: null, durationMs: null },
  { id: 'identify',   label: 'Food identified',             status: 'pending', timestamp: null, durationMs: null, confidence: undefined },
  { id: 'quantity',   label: 'Quantity estimated',          status: 'pending', timestamp: null, durationMs: null, confidence: undefined },
  { id: 'shelf',      label: 'Shelf life estimated',        status: 'pending', timestamp: null, durationMs: null },
  { id: 'urgency',    label: 'Urgency calculated',          status: 'pending', timestamp: null, durationMs: null },
  { id: 'search',     label: 'Nearby organizations searched', status: 'pending', timestamp: null, durationMs: null },
  { id: 'rank',       label: 'Organizations ranked',        status: 'pending', timestamp: null, durationMs: null },
  { id: 'impact',     label: 'Impact estimated',            status: 'pending', timestamp: null, durationMs: null },
  { id: 'email',      label: 'Email draft generated',       status: 'pending', timestamp: null, durationMs: null },
];

export const useAiStore = create<AiState>((set) => ({
  analyses: {},
  lastAnalysisTime: null,
  avgResponseTimeMs: 1800,
  responseSamples: [],
  systemStatus: {
    gemma: 'checking',
    mongodb: 'checking',
    backend: 'checking',
    email: 'checking',
    lastChecked: null,
  },
  liveActivity: DEFAULT_ACTIVITY.map((s) => ({ ...s })),

  addAnalysis: (analysisId, analysis) =>
    set((state) => ({
      analyses: { ...state.analyses, [analysisId]: analysis },
    })),

  setLastAnalysisTime: (time) => set({ lastAnalysisTime: time }),

  recordResponseTime: (ms) =>
    set((state) => {
      const samples = [...state.responseSamples.slice(-9), ms];
      const avg = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
      return { responseSamples: samples, avgResponseTimeMs: avg };
    }),

  setSystemStatus: (status) =>
    set((state) => ({
      systemStatus: { ...state.systemStatus, ...status },
    })),

  setLiveActivity: (steps) => set({ liveActivity: steps }),

  updateActivityStep: (id, updates) =>
    set((state) => ({
      liveActivity: state.liveActivity.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    })),

  resetActivity: () =>
    set({ liveActivity: DEFAULT_ACTIVITY.map((s) => ({ ...s })) }),
}));
