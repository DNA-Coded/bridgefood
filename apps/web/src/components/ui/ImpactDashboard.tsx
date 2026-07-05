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
  isGreen: boolean;
}> = ({ label, value, unit, Icon, isGreen }) => (
  <Card
    className={`p-4 border transition-transform hover:scale-[1.01] ${
      isGreen
        ? 'border-primary/20 bg-primary/[0.03]'
        : 'border-warning/20 bg-warning/[0.03]'
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p
          className={`text-2xl font-bold leading-none tabular-nums ${
            isGreen ? 'text-primary' : 'text-warning'
          }`}
        >
          {value.toLocaleString()}
          {unit && (
            <span
              className={`ml-1 text-xs font-bold ${
                isGreen ? 'text-primary/70' : 'text-warning/70'
              }`}
            >
              {unit}
            </span>
          )}
        </p>
        <p
          className={`mt-2 text-[10px] font-bold uppercase tracking-[0.22em] ${
            isGreen ? 'text-primary' : 'text-warning'
          }`}
        >
          {label}
        </p>
      </div>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-md border ${
          isGreen
            ? 'bg-primary/10 border-primary/25 text-primary'
            : 'bg-warning/10 border-warning/25 text-warning'
        }`}
      >
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
        <div className="rounded-md border border-warning/20 bg-warning/[0.04] px-3 py-2 text-xs font-semibold text-warning">
          Reference data shown while the operations API is unavailable.
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleCards.map((card, idx) => (
          <MetricCard key={card.label} {...card} isGreen={idx % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

export { DEMO_METRICS };
