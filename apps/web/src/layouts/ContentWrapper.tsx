import React from 'react';

export const ContentWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};
