import { apiClient } from './client';

export const donationsApi = {
  createListing: async (payload: any): Promise<any> => {
    return apiClient.post<any>('/api/v1/food', payload);
  },
  getListing: async (id: string): Promise<any> => {
    return apiClient.get<any>(`/api/v1/food/${id}`);
  },
  listListings: async (): Promise<any[]> => {
    return apiClient.get<any[]>('/api/v1/food');
  },
  createAppeal: async (payload: { listing_id: string; message: string }): Promise<any> => {
    return apiClient.post<any>('/api/v1/donations/appeals', payload);
  },
  listAppeals: async (listingId?: string): Promise<any[]> => {
    const url = listingId ? `/api/v1/donations/appeals?listing_id=${listingId}` : '/api/v1/donations/appeals';
    return apiClient.get<any[]>(url);
  },
  acceptAppeal: async (id: string): Promise<any> => {
    return apiClient.post<any>(`/api/v1/donations/appeals/${id}/accept`, {});
  },
  completeDonation: async (id: string): Promise<any> => {
    return apiClient.post<any>(`/api/v1/donations/${id}/complete`, {});
  }
};

