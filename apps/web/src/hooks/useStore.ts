import { create } from 'zustand';
import { User, FoodListing, Organization, GemmaAnalysis } from '@foodbridge/types';

// User Store
interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    id: 'usr_mock123',
    email: 'contact@helpinghands.org',
    name: 'Sarah Jenkins',
    role: 'RECEIVER',
    phone: '+15550199',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  setCurrentUser: (user) => set({ currentUser: user }),
}));

// Food Listings Store
interface ListingState {
  listings: FoodListing[];
  setListings: (listings: FoodListing[]) => void;
  addListing: (listing: FoodListing) => void;
}

export const useListingStore = create<ListingState>((set) => ({
  listings: [
    {
      id: 'list_mock001',
      donorId: 'usr_mockdonor',
      rawDescription: 'Large catering trays of saffron vegetable rice and chickpea curry. Kept in temperature-controlled bags.',
      imageUrl: '',
      analysisId: 'ana_mock001',
      location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      pickupWindow: {
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      },
      state: 'ACTIVE',
      createdAt: new Date().toISOString(),
    }
  ],
  setListings: (listings) => set({ listings }),
  addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
}));

// Organizations Store
interface OrgState {
  organizations: Organization[];
  setOrganizations: (organizations: Organization[]) => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  organizations: [
    {
      id: 'org_mock001',
      userId: 'usr_mock123',
      name: 'Helping Hands Shelter',
      category: 'SHELTER',
      location: { type: 'Point', coordinates: [-122.4100, 37.7790] },
      address: { street: '456 Mission St', city: 'San Francisco', zip: '94105' },
      dietaryPreferences: ['VEGETARIAN', 'HALAL'],
      isApproved: true
    }
  ],
  setOrganizations: (organizations) => set({ organizations }),
}));

// Gemma assessment store
interface AnalysisState {
  analyses: Record<string, GemmaAnalysis>;
  addAnalysis: (analysisId: string, analysis: GemmaAnalysis) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analyses: {
    'ana_mock001': {
      id: 'ana_mock001',
      listingId: 'list_mock001',
      rawInputText: 'Large catering trays of saffron vegetable rice and chickpea curry.',
      extractedData: {
        itemName: 'Saffron Vegetable Rice & Chickpea Curry',
        quantityKg: 24.5,
        urgency: 'HIGH',
        allergens: ['gluten'],
        categories: ['cooked', 'warm-dish']
      },
      toolCalls: [],
      safetyFlagged: false,
      executionDurationMs: 340
    }
  },
  addAnalysis: (analysisId, analysis) => set((state) => ({
    analyses: { ...state.analyses, [analysisId]: analysis }
  })),
}));

// App Notifications Store
interface NotificationState {
  toasts: Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>;
  addToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  addToast: (message, type) => set((state) => {
    const id = Math.random().toString(36).substring(7);
    return { toasts: [...state.toasts, { id, message, type }] };
  }),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
}));
