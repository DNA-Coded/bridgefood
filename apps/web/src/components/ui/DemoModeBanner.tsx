import React from 'react';
import { useUserStore } from '../../stores/userStore';

interface DemoModeBannerProps {
  onNavigate: (path: string) => void;
}

const ROLE_ROUTES: Record<string, string> = {
  DONOR: '/donor/dashboard',
  RECEIVER: '/receiver/dashboard',
  ADMIN: '/admin',
};

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ onNavigate }) => {
  const { demoRole, switchDemoRole } = useUserStore();

  const handleSwitch = (role: 'DONOR' | 'RECEIVER' | 'ADMIN') => {
    switchDemoRole(role);
    onNavigate(ROLE_ROUTES[role]);
  };

  return (
    <div className="w-full border-b border-[#2f3133] bg-[#121416] py-1.5 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 sm:flex-row sm:items-center">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#e2e2e5]">
          Reference workspace <span className="text-[#c39b62]">/ {demoRole}</span>
        </div>
        <div className="flex items-center gap-0 bg-[#2f3133] p-0.5 rounded-sm">
          {(['DONOR', 'RECEIVER', 'ADMIN'] as const).map((role) => (
            <button
              key={role}
              onClick={() => handleSwitch(role)}
              className={`rounded-sm px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${
                demoRole === role
                  ? 'bg-[#c39b62] text-white'
                  : 'bg-[#2f3133] text-[#e2e2e5] hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
