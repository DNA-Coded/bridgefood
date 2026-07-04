import React from 'react';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div className={`animate-pulse rounded bg-muted-foreground/20 ${className}`} {...props} />
  );
};
