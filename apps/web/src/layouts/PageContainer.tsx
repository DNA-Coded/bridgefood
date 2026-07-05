import React from 'react';

export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`mx-auto flex-1 w-full max-w-[1440px] px-4 py-6 md:px-8 md:py-8 ${className}`}>
      {children}
    </div>
  );
};
