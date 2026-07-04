import React from 'react';

export const FormMessage: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  if (!children) return null;
  return (
    <p className={`text-xs font-medium text-destructive ${className}`}>
      {children}
    </p>
  );
};
