export type UserRole = 'DONOR' | 'RECEIVER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrgCategory = 'NGO' | 'FOOD_BANK' | 'SHELTER' | 'ANIMAL_SHELTER';

export interface Organization {
  id: string;
  userId: string;
  name: string;
  category: OrgCategory;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: {
    street: string;
    city: string;
    zip: string;
  };
  dietaryPreferences: string[];
  isApproved: boolean;
}

export type ListingState = 'PENDING' | 'ACTIVE' | 'REQUESTED' | 'ACCEPTED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';

export interface TimelineEvent {
  type: string;
  description: string;
  timestamp: string;
}

export interface FoodListing {
  id: string;
  donorId: string;
  rawDescription: string;
  imageUrl?: string;
  analysisId: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  pickupWindow: {
    startTime: string;
    endTime: string;
  };
  state: ListingState;
  timeline?: TimelineEvent[];
  createdAt: string;
}


export interface GemmaAnalysis {
  id: string;
  listingId?: string;
  rawInputText: string;
  extractedData: {
    itemName: string;
    quantityKg: number;
    urgency: 'NORMAL' | 'URGENT' | 'HIGH';
    allergens: string[];
    categories: string[];
  };
  toolCalls: Array<{
    toolName: string;
    args: Record<string, any>;
    result: Record<string, any>;
    executedAt: string;
  }>;
  safetyFlagged: boolean;
  executionDurationMs: number;
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface DonationRequest {
  id: string;
  listingId: string;
  receiverId: string;
  message: string;
  status: RequestStatus;
  requestedAt: string;
}

export interface Donation {
  id: string;
  listingId: string;
  acceptedRequestId: string;
  pickupCode: string;
  completedAt: string;
  impact: {
    co2SavedKg: number;
    mealsServed: number;
  };
}

export type NotificationType = 'EMAIL' | 'SMS' | 'PUSH';
export type NotificationStatus = 'SENT' | 'FAILED' | 'READ';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  status: NotificationStatus;
  sentAt: string;
}
