import React from 'react';

export const NotFound: React.FC<{ onRouteChange?: (route: string) => void }> = ({ onRouteChange }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <p className="text-xl font-semibold">Page Not Found</p>
      <p className="text-slate-400 max-w-sm">The coordination page you are looking for does not exist or has expired.</p>
      {onRouteChange && (
        <button
          onClick={() => onRouteChange('/')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          Return Home
        </button>
      )}
    </div>
  );
};
