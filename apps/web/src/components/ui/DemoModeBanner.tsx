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
    <div className="w-full border-b border-border bg-surface-container-low py-2">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-2 px-4 md:px-8 sm:flex-row sm:items-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Reference workspace <span className="text-primary">/ {demoRole}</span>
        </div>
        <div className="flex items-center gap-0 rounded-md border border-border bg-card p-0.5">
          {(['DONOR', 'RECEIVER', 'ADMIN'] as const).map((role) => (
            <button
              key={role}
              onClick={() => handleSwitch(role)}
              className={`rounded-sm px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] transition-colors ${
                demoRole === role
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
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
