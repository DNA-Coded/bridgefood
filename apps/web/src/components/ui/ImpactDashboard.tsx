import React from 'react';
import { Building2, CheckCircle2, Clock, HeartHandshake, Package, Scale, Truck, Users } from 'lucide-react';
import { Card } from './Card';

export interface ImpactMetrics {
  mealsSaved: number;
  foodRescuedKg: number;
  co2PreventedKg: number;
  peopleServed: number;
  activeDonations: number;
  completedDonations: number;
  pendingAppeals: number;
  organizationsHelped: number;
  isOfflineDemo?: boolean;
}

interface ImpactDashboardProps {
  metrics: ImpactMetrics;
  variant?: 'full' | 'compact';
}

const DEMO_METRICS: ImpactMetrics = {
  mealsSaved: 14820,
  foodRescuedKg: 8400,
  co2PreventedKg: 4200,
  peopleServed: 3705,
  activeDonations: 12,
  completedDonations: 287,
  pendingAppeals: 7,
  organizationsHelped: 38,
  isOfflineDemo: true,
};

const MetricCard: React.FC<{
  label: string;
  value: number;
  unit?: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = ({ label, value, unit, Icon }) => (
  <Card className="p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-2xl font-bold leading-none tabular-nums text-foreground">
          {value.toLocaleString()}
          {unit && <span className="ml-1 text-xs font-bold text-muted-foreground">{unit}</span>}
        </p>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      </div>
      <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-primary">
        <Icon className="h-4 w-4" />
      </span>
    </div>
  </Card>
);

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ metrics, variant = 'full' }) => {
  const cards = [
    { label: 'Meals redirected', value: metrics.mealsSaved, Icon: HeartHandshake },
    { label: 'Food rescued', value: metrics.foodRescuedKg, unit: 'kg', Icon: Scale },
    { label: 'People served', value: metrics.peopleServed, Icon: Users },
    { label: 'Active listings', value: metrics.activeDonations, Icon: Package },
    { label: 'Completed pickups', value: metrics.completedDonations, Icon: CheckCircle2 },
    { label: 'Pending appeals', value: metrics.pendingAppeals, Icon: Clock },
    { label: 'Organizations helped', value: metrics.organizationsHelped, Icon: Building2 },
    { label: 'Dispatch records', value: metrics.activeDonations + metrics.completedDonations, Icon: Truck },
  ];

  const visibleCards = variant === 'compact' ? cards.slice(0, 4) : cards;

  return (
    <div className="space-y-3">
      {metrics.isOfflineDemo && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          Reference data shown while the operations API is unavailable.
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleCards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
};

export { DEMO_METRICS };
