import { mockDelay } from './client';
import { GemmaAnalysis } from '@foodbridge/types';

export const analysisApi = {
  getAnalysisLogs: async (): Promise<GemmaAnalysis[]> => {
    await mockDelay(500);
    return [
      {
        id: 'ana_mock001',
        rawInputText: 'Large saffron veggie rice trays.',
        extractedData: {
          itemName: 'Saffron Veggie Rice',
          quantityKg: 20.0,
          urgency: 'HIGH',
          allergens: [],
          categories: ['cooked']
        },
        toolCalls: [],
        safetyFlagged: false,
        executionDurationMs: 290
      }
    ];
  }
};
