import React from 'react';
import { Spinner } from '../components/ui/Spinner';

export const LoadingLayout: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading secure coordination data...</p>
    </div>
  );
};
