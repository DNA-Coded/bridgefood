import React from 'react';

export const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <section className={`py-4 md:py-6 border-b border-border last:border-b-0 ${className}`}>
      {children}
    </section>
  );
};
