export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ToastAlert {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
