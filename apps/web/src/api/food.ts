import { apiClient } from './client';

export interface AnalysisParams {
  description: string;
  category?: string;
  declared_quantity?: number;
  declared_unit?: string;
  best_before?: string;
  city?: string;
  listing_id?: string;
  latitude?: number;
  longitude?: number;
  images?: File[];
}

export const foodApi = {
  analyzeListing: async (params: AnalysisParams): Promise<any> => {
    const formData = new FormData();
    formData.append('description', params.description);
    if (params.category) formData.append('category', params.category);
    if (params.declared_quantity !== undefined) {
      formData.append('declared_quantity', String(params.declared_quantity));
    }
    if (params.declared_unit) formData.append('declared_unit', params.declared_unit);
    if (params.best_before) formData.append('best_before', params.best_before);
    if (params.city) formData.append('city', params.city);
    if (params.listing_id) formData.append('listing_id', params.listing_id);
    if (params.latitude !== undefined) formData.append('latitude', String(params.latitude));
    if (params.longitude !== undefined) formData.append('longitude', String(params.longitude));

    if (params.images) {
      params.images.forEach((img) => {
        formData.append('images', img);
      });
    }

    return apiClient.post<any>('/api/v1/analysis', formData);
  }
};

