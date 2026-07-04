import { apiClient } from './client';

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  recipient: string;
  status: string;
  delivery_status: string;
  created_at: string;
  read_at?: string;
}

export const notificationsApi = {
  listNotifications: async (recipient?: string): Promise<NotificationResponse[]> => {
    const url = recipient ? `/api/v1/notifications?recipient=${recipient}` : '/api/v1/notifications';
    return apiClient.get<NotificationResponse[]>(url);
  },
  markAsRead: async (id: string): Promise<NotificationResponse> => {
    return apiClient.post<NotificationResponse>(`/api/v1/notifications/${id}/read`, {});
  }
};
