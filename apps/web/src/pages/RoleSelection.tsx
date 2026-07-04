import React from 'react';
import { ArrowRight, Building2, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface RoleSelectionProps {
  onNavigate: (path: string) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onNavigate }) => {
  const roles = [
    {
      title: 'Food Donor',
      description: 'Restaurants, hotels, caterers, supermarkets, bakeries, warehouses, and event teams listing clean surplus food for pickup.',
      action: 'Enter Donor Operations',
      path: '/donor/dashboard',
      icon: Building2,
    },
    {
      title: 'Receiving Organization',
      description: 'NGOs, food banks, community kitchens, shelters, and relief agencies ready to appeal for available donations.',
      action: 'Enter Receiver Workspace',
      path: '/receiver/dashboard',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="flex flex-1 items-center justify-center py-10 md:py-16">
      <div className="w-full max-w-5xl space-y-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
            <ShieldCheck className="h-3.5 w-3.5" /> Enterprise onboarding
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">Choose your FoodBridge workspace</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Select the operational role that matches your organization. Routes, records, and coordination tools stay tailored to your responsibilities.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card key={role.title} className="flex min-h-[300px] flex-col justify-between p-7 transition hover:border-primary/30 hover:shadow-md">
                <div className="space-y-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold">{role.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <Button onClick={() => onNavigate(role.path)} className="mt-8 w-full">
                  {role.action} <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
