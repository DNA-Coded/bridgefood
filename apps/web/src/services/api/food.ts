import { mockDelay } from './client';
import { GemmaAnalysis } from '@foodbridge/types';

export const foodApi = {
  analyzeListing: async (description: string, _imageFile?: File): Promise<GemmaAnalysis> => {
    await mockDelay(1000);
    return {
      id: `ana_${Math.random().toString(36).substring(7)}`,
      rawInputText: description,
      extractedData: {
        itemName: 'S saffron Veg Rice & Lentil Curry',
        quantityKg: 12.0,
        urgency: 'URGENT',
        allergens: ['dairy'],
        categories: ['cooked', 'warm-dish']
      },
      toolCalls: [
        {
          toolName: 'NearbyNgoSearch',
          args: { latitude: 37.7749, longitude: -122.4194 },
          result: { count: 3 },
          executedAt: new Date().toISOString()
        }
      ],
      safetyFlagged: false,
      executionDurationMs: 410
    };
  }
};
