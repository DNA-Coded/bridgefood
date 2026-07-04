import { mockDelay } from './client';
import { FoodListing, DonationRequest } from '@foodbridge/types';

export const donationApi = {
  createListing: async (listing: Omit<FoodListing, 'id' | 'createdAt' | 'state'>): Promise<FoodListing> => {
    await mockDelay(800);
    return {
      ...listing,
      id: `list_${Math.random().toString(36).substring(7)}`,
      state: 'PENDING',
      createdAt: new Date().toISOString()
    };
  },
  
  getListingDetails: async (id: string): Promise<FoodListing> => {
    await mockDelay(300);
    return {
      id,
      donorId: 'usr_mockdonor',
      rawDescription: 'Mocked Food Listing Details',
      imageUrl: '',
      analysisId: 'ana_mock001',
      location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      pickupWindow: {
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      },
      state: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
  },

  requestPickup: async (listingId: string, message: string): Promise<DonationRequest> => {
    await mockDelay(700);
    return {
      id: `req_${Math.random().toString(36).substring(7)}`,
      listingId,
      receiverId: 'usr_mockreceiver',
      message,
      status: 'PENDING',
      requestedAt: new Date().toISOString()
    };
  }
};
