import { mockDelay } from './client';
import { Organization } from '@foodbridge/types';

export const orgApi = {
  getNearbyOrgs: async (lat: number, lng: number, _radiusMeters: number): Promise<Organization[]> => {
    await mockDelay(600);
    return [
      {
        id: 'org_mock001',
        userId: 'usr_receiver001',
        name: 'Helping Hands Shelter',
        category: 'SHELTER',
        location: { type: 'Point', coordinates: [lng, lat] },
        address: { street: '123 Rescue Way', city: 'San Francisco', zip: '94103' },
        dietaryPreferences: ['VEGETARIAN', 'HALAL'],
        isApproved: true
      },
      {
        id: 'org_mock002',
        userId: 'usr_receiver002',
        name: 'Paws & Whiskers Sanctuary',
        category: 'ANIMAL_SHELTER',
        location: { type: 'Point', coordinates: [lng + 0.002, lat - 0.003] },
        address: { street: '789 Shelter Dr', city: 'San Francisco', zip: '94107' },
        dietaryPreferences: ['MEAT_ONLY'],
        isApproved: true
      }
    ];
  }
};
