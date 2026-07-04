import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none';
  
  const variants = {
    primary: 'border-primary/20 bg-primary/10 text-primary',
    secondary: 'border-secondary/20 bg-secondary/10 text-secondary',
    success: 'border-success/20 bg-success/10 text-success',
    warning: 'border-transparent bg-warning text-warning-foreground',
    destructive: 'border-destructive/20 bg-destructive/10 text-destructive',
    outline: 'text-foreground border-border',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
