import React from 'react';

export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`container flex-1 p-6 md:p-8 max-w-5xl mx-auto space-y-6 ${className}`}>
      {children}
    </div>
  );
};
