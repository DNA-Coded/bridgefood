import React from 'react';
import { ArrowRight, Building2, CheckCircle2, HeartHandshake, ShieldCheck, Truck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const steps = [
    'Restaurant uploads surplus',
    'Gemma analyzes suitability',
    'NGOs are notified',
    'Appeal received',
    'Pickup completed',
    'Impact recorded',
  ];

  const impactStats = [
    { value: '12,458', label: 'Meals saved' },
    { value: '320', label: 'Active partners' },
    { value: '22 min', label: 'Median match time' },
  ];

  return (
    <div className="space-y-12 pb-8 overflow-x-hidden">
      <section className="grid gap-0 overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 p-6 md:p-8">
          <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Humanitarian logistics platform
          </span>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Turn surplus food into meals.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
              Connect donors, verified NGOs, and relief teams in a single operational chain that keeps food moving before it expires.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => onNavigate('/role-selection')} size="lg">
              Donate Food <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => onNavigate('/organizations/discover')} variant="outline" size="lg">
              Find NGOs
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Verified partners</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Dispatch-ready pickups</span>
            <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-primary" /> Impact records</span>
          </div>
        </div>

        <div className="border-t border-border bg-surface-container-low p-6 md:p-8 lg:border-l lg:border-t-0">
          <div className="flex h-full min-h-[320px] flex-col justify-between gap-6 rounded-md border border-border bg-background p-5">
            <div className="relative h-40 overflow-hidden rounded-md border border-border bg-surface-container-highest">
              <div className="absolute inset-0 bg-[url('/hero-bg.webp')] bg-cover bg-center opacity-25" />
              <div className="absolute bottom-3 left-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                System Online
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {impactStats.map((stat) => (
                <div key={stat.label} className="rounded-md border border-border bg-card p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface-container-low">
        <div className="border-b border-border px-6 py-4 md:px-8">
          <h2 className="text-xl font-bold tracking-tight">Operational Workflow</h2>
          <p className="mt-1 text-sm text-muted-foreground">A clear rescue chain from donation intake to verified community impact.</p>
        </div>
        <div className="grid gap-0 md:grid-cols-5">
          {steps.map((step, idx) => (
            <div key={step} className="border-b border-border px-5 py-6 md:border-r md:last:border-r-0 md:border-b-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-sm font-bold text-primary">
                {idx + 1}
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{step}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {idx === 0 && 'Log the surplus source and capture the inventory.'}
                {idx === 1 && 'Assess freshness, shelf life, and safety constraints.'}
                {idx === 2 && 'Notify compatible partners in the network.'}
                {idx === 3 && 'Capture the appeal and lock the pickup owner.'}
                {idx === 4 && 'Dispatch the pickup and confirm handoff.'}
                {idx === 5 && 'Record the final impact in the operations log.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <span className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            Gemma Analysis Complete
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Intelligence stays in the background.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Gemma estimates meals, freshness, shelf life, storage needs, urgency, and suitable NGO types while the team keeps operating the rescue workflow.
          </p>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Saffron Garden', '312 meals collected within 34 minutes for two community kitchens.'],
            ['Metro Food Bank', 'Cold storage capacity matched with bakery surplus across three branches.'],
          ].map(([name, text]) => (
            <Card key={name} className="p-6">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-base font-bold">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Verified NGO Network</h2>
            <p className="mt-1 text-sm text-muted-foreground">Real-time availability of active distribution points.</p>
          </div>
          <button className="text-sm font-semibold text-primary hover:underline">View All Partners</button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Restaurants', 'Hotels', 'Caterers', 'Food Banks', 'NGOs', 'Relief Agencies'].map((org) => (
            <div key={org} className="rounded-md border border-border bg-surface-container-low p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" /> {org}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Verified partner in the rescue network.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
