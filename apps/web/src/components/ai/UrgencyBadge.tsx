import React from 'react';
import { Badge } from '../ui/Badge';

export type UrgencyLevel = 'NORMAL' | 'URGENT' | 'HIGH';

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel }> = ({ urgency }) => {
  const mapping = {
    NORMAL: { text: 'Normal Urgency', variant: 'primary' as const },
    URGENT: { text: 'Urgent Pickup', variant: 'warning' as const },
    HIGH: { text: 'Immediate Hand-off Required', variant: 'destructive' as const }
  };

  const choice = mapping[urgency] || mapping.NORMAL;

  return (
    <Badge variant={choice.variant}>
      {choice.text}
    </Badge>
  );
};
