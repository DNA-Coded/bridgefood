import { create } from 'zustand';
import { User } from '@foodbridge/types';

type DemoRole = 'DONOR' | 'RECEIVER' | 'ADMIN';

const DEMO_USERS: Record<DemoRole, User> = {
  DONOR: {
    id: 'usr_donor_demo',
    email: 'rajesh.kumar@saffronrestaurant.in',
    name: 'Rajesh Kumar',
    role: 'DONOR',
    phone: '+91 98765 43210',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  RECEIVER: {
    id: 'usr_recv_demo',
    email: 'coordinator@helpinghands.org',
    name: 'Sarah Jenkins',
    role: 'RECEIVER',
    phone: '+1 555 019 9234',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  ADMIN: {
    id: 'usr_admin_demo',
    email: 'admin@foodbridge.ai',
    name: 'Admin Console',
    role: 'ADMIN' as any,
    phone: '',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

interface UserState {
  currentUser: User | null;
  demoRole: DemoRole;
  isDemoMode: boolean;
  setCurrentUser: (user: User | null) => void;
  switchDemoRole: (role: DemoRole) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: DEMO_USERS['DONOR'],
  demoRole: 'DONOR',
  isDemoMode: true,
  setCurrentUser: (user) => set({ currentUser: user }),
  switchDemoRole: (role: DemoRole) =>
    set({ demoRole: role, currentUser: DEMO_USERS[role] }),
}));
