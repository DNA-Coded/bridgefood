import { mockDelay } from './client';
import { User } from '@foodbridge/types';

export const usersApi = {
  getProfile: async (id: string): Promise<User> => {
    await mockDelay(300);
    return {
      id,
      email: 'user@example.com',
      name: 'Sarah Jenkins',
      role: 'RECEIVER',
      phone: '+15550199',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};
