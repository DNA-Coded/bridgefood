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

  return (
    <div className="space-y-16 pb-8 overflow-x-hidden">
      <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 overflow-hidden bg-cover bg-center min-h-[500px] flex items-center justify-center p-8 md:p-16" style={{ backgroundImage: "url('/hero-bg.webp')" }}>
        <div className="absolute inset-0 bg-[#121416]/40 backdrop-blur-[0.5px]"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-7">
          <span className="inline-flex items-center rounded-sm border border-[#c39b62]/40 bg-[#121416]/85 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c39b62]">
            Humanitarian logistics platform
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Food Should Feed People. Not Landfills.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#e2e2e5] md:text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-semibold">
              FoodBridge helps restaurants, hotels, caterers, supermarkets, NGOs, and relief agencies move surplus food quickly, safely, and accountably.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row justify-center w-full max-w-md">
            <Button onClick={() => onNavigate('/role-selection')} size="lg" className="w-full sm:w-auto bg-[#c39b62] text-white hover:bg-[#b38b52] font-bold">
              Start Coordination <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={() => onNavigate('/organizations/discover')} variant="outline" size="lg" className="w-full sm:w-auto border-white/40 bg-[#121416]/60 text-white hover:bg-white/20 hover:text-white font-bold">
              View NGO Network
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-[#e2e2e5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#c39b62]" /> Verified partners</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-[#c39b62]" /> Dispatch-ready pickups</span>
            <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-[#c39b62]" /> Impact records</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ['14,820', 'Meals redirected'],
          ['8,400 kg', 'Food rescued'],
          ['150+', 'Recipient organizations'],
          ['22 min', 'Median pickup match'],
        ].map(([metric, label]) => (
          <Card key={label} className="p-5">
            <p className="text-3xl font-extrabold text-primary">{metric}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight">How FoodBridge Works</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A clear operational chain for food rescue teams, from intake to verified community impact.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-6">
          {steps.map((step, idx) => (
            <Card key={step} className="p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-extrabold text-primary">
                {idx + 1}
              </span>
              <p className="mt-4 text-sm font-bold leading-snug">{step}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            Gemma Analysis Complete
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Intelligence that stays in the background.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Gemma helps estimate meals, freshness, shelf life, storage needs, urgency, and suitable NGO types. FoodBridge remains the product your teams operate.
          </p>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Saffron Garden', '312 meals collected within 34 minutes for two community kitchens.'],
            ['Metro Food Bank', 'Cold storage capacity matched with bakery surplus across three branches.'],
          ].map(([name, text]) => (
            <Card key={name} className="p-6">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-extrabold">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-extrabold">Built for partners who move fast when food is ready.</h2>
            <p className="mt-1 text-sm text-muted-foreground">Restaurants, caterers, food banks, shelters, kitchens, and relief agencies on one accountable network.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
            {['Restaurants', 'Hotels', 'Caterers', 'Food Banks', 'NGOs', 'Relief Agencies'].map((org) => (
              <span key={org} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5">
                <Building2 className="h-3.5 w-3.5" /> {org}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
