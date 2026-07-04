import React from 'react';

export const FormField: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-2 w-full ${className}`}>
      {children}
    </div>
  );
};
