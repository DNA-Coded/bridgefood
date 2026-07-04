import { mockDelay } from './client';

export interface OrgProfile {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  orgType: 'NGO' | 'FOOD_BANK' | 'SHELTER' | 'ANIMAL_SHELTER';
  isVerified: boolean;
  description: string;
  acceptedCategories: string[]; // e.g. ["cooked", "packaged", "raw"]
  dietaryRestrictions: string[]; // e.g. ["VEGETARIAN", "HALAL", "VEGAN", "JAIN"]
  operatingHours: string;
  pickupAvailability: string;
  distanceKm: number;
  travelTimeMin: number;
  capacityLevel: number; // 0-100% storage remaining
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  coordinates: { lat: number; lng: number };
  languages: string[];
  rating: number;
  completedDonations: number;
  lastActive: string;
  compatibilityScore: number; // calculated by mock Gemma analysis
  recommendationReason: string;
}

export const orgApi = {
  getNearbyOrgs: async (): Promise<OrgProfile[]> => {
    await mockDelay(600);
    return [
      {
        id: 'org_001',
        name: 'Helping Hands Community Shelter',
        logo: '🤝',
        coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60',
        orgType: 'SHELTER',
        isVerified: true,
        description: 'Providing daily meals and temporary housing support to local families in transition.',
        acceptedCategories: ['cooked', 'packaged'],
        dietaryRestrictions: ['VEGETARIAN', 'HALAL', 'VEGAN'],
        operatingHours: '08:00 AM - 10:00 PM',
        pickupAvailability: 'Available for immediate pickup today',
        distanceKm: 1.4,
        travelTimeMin: 6,
        capacityLevel: 85,
        contactPerson: 'Sarah Jenkins',
        phone: '+1 555-0199',
        email: 'coordination@helpinghands.org',
        address: '456 Mission St, San Francisco, CA 94105',
        coordinates: { lat: 37.7790, lng: -122.4100 },
        languages: ['English', 'Spanish'],
        rating: 4.9,
        completedDonations: 342,
        lastActive: '5 mins ago',
        compatibilityScore: 96,
        recommendationReason: 'Highly compatible. Accepts cooked warm-dishes. Located only 1.4km away with high refrigeration capacity.'
      },
      {
        id: 'org_002',
        name: 'Bay Area Food Bank Depot',
        logo: '🌾',
        coverImage: 'https://images.unsplash.com/photo-1599059813005-11265ba4b2ea?w=800&auto=format&fit=crop&q=60',
        orgType: 'FOOD_BANK',
        isVerified: true,
        description: 'Large distribution warehouse supplying dry goods and produce to neighborhood kitchens.',
        acceptedCategories: ['packaged', 'raw'],
        dietaryRestrictions: ['VEGETARIAN', 'VEGAN', 'JAIN'],
        operatingHours: '09:00 AM - 06:00 PM',
        pickupAvailability: 'Schedule pickup window 2 hours in advance',
        distanceKm: 3.2,
        travelTimeMin: 12,
        capacityLevel: 40,
        contactPerson: 'Marcus Vance',
        phone: '+1 555-0240',
        email: 'intake@bayareafoodbank.org',
        address: '900 Harrison St, San Francisco, CA 94107',
        coordinates: { lat: 37.7710, lng: -122.4020 },
        languages: ['English', 'Spanish', 'Cantonese'],
        rating: 4.7,
        completedDonations: 1208,
        lastActive: '30 mins ago',
        compatibilityScore: 78,
        recommendationReason: 'Good match for raw pantry ingredients. Low current storage capacity remaining.'
      },
      {
        id: 'org_003',
        name: 'Paws & Whiskers Rescue',
        logo: '🐾',
        coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=60',
        orgType: 'ANIMAL_SHELTER',
        isVerified: true,
        description: 'Caring shelter for abandoned animals, dogs, and cats in need of appropriate meal supplements.',
        acceptedCategories: ['raw', 'cooked'],
        dietaryRestrictions: ['MEAT_ONLY'],
        operatingHours: '08:00 AM - 08:00 PM',
        pickupAvailability: 'Volunteer dispatch ready within 1 hour',
        distanceKm: 2.1,
        travelTimeMin: 8,
        capacityLevel: 95,
        contactPerson: 'Elena Rostova',
        phone: '+1 555-0899',
        email: 'donations@pawswhiskers.org',
        address: '150 Folsom St, San Francisco, CA 94105',
        coordinates: { lat: 37.7850, lng: -122.3960 },
        languages: ['English', 'Russian'],
        rating: 4.8,
        completedDonations: 88,
        lastActive: '2 hours ago',
        compatibilityScore: 64,
        recommendationReason: 'Only matches raw ingredients or non-veg components suitable for animal feed.'
      }
    ];
  }
};
