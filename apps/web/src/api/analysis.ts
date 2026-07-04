import { mockDelay } from './client';
import { GemmaAnalysis } from '@foodbridge/types';

export const analysisApi = {
  getAnalysisLogs: async (): Promise<GemmaAnalysis[]> => {
    await mockDelay(300);
    return [];
  }
};
