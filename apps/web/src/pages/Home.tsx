import React from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Truck,
  Upload,
  Cpu,
  Bell,
  FileText,
  LineChart
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const steps = [
    { label: 'Restaurant uploads surplus', icon: Upload, desc: 'Log the surplus source and capture the inventory.' },
    { label: 'Gemma analyzes suitability', icon: Cpu, desc: 'Assess freshness, shelf life, and safety constraints.' },
    { label: 'NGOs are notified', icon: Bell, desc: 'Notify compatible partners in the network.' },
    { label: 'Appeal received', icon: FileText, desc: 'Capture the appeal and lock the pickup owner.' },
    { label: 'Pickup completed', icon: Truck, desc: 'Dispatch the pickup and confirm handoff.' },
    { label: 'Impact recorded', icon: LineChart, desc: 'Record the final impact in the operations log.' },
  ];

  const metrics = [
    { value: '12,458', label: 'Meals Saved', isGreen: true },
    { value: '8,240 kg', label: 'Food Rescued', isGreen: false },
    { value: '142', label: 'NGOs Connected', isGreen: true },
    { value: '3,150', label: 'Families Served', isGreen: false },
  ];

  return (
    <div className="space-y-12 pb-8 overflow-x-hidden">
      {/* Redesigned Hero Section with Cover Background & Centered Text */}
      <section className="relative overflow-hidden rounded-xl bg-cover bg-center min-h-[500px] flex items-center justify-center p-8 md:p-16 border border-border" style={{ backgroundImage: "url('/hero-bg.webp')" }}>
        <div className="absolute inset-0 bg-[#121416]/40 backdrop-blur-[0.5px]"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-7">
          <span className="inline-flex items-center rounded-sm border border-[#c39b62]/40 bg-[#121416]/85 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c39b62]">
            Humanitarian logistics platform
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Turn surplus food <br />
              into <span className="text-[#c39b62]">community impact</span>.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#e2e2e5] md:text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-semibold">
              Connect donors, verified NGOs, and logistics teams in a single operational chain that keeps food moving before it expires.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row justify-center w-full max-w-md">
            <Button onClick={() => onNavigate('/role-selection')} size="lg" className="w-full sm:w-auto bg-[#c39b62] text-white hover:bg-[#b38b52] font-bold">
              Donate Food <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={() => onNavigate('/organizations/discover')} variant="outline" size="lg" className="w-full sm:w-auto border-white/40 bg-[#121416]/60 text-white hover:bg-white/20 hover:text-white font-bold">
              Find NGOs
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-[#e2e2e5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#c39b62]" /> Verified partners</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-[#c39b62]" /> Dispatch-ready pickups</span>
            <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-[#c39b62]" /> Impact records</span>
          </div>
        </div>
      </section>

      {/* Metrics Cards: Alternating Green and Orange */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {metrics.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-6 text-center shadow-sm transition-transform hover:scale-[1.01] ${
              stat.isGreen
                ? 'border-primary/20 bg-primary/[0.04] text-primary'
                : 'border-warning/20 bg-warning/[0.04] text-warning'
            }`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-[0.2em] ${
                stat.isGreen ? 'text-primary' : 'text-warning'
              }`}
            >
              {stat.label}
            </p>
            <p
              className={`mt-3 text-3xl font-extrabold tracking-tight md:text-4xl ${
                stat.isGreen ? 'text-primary' : 'text-warning'
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Workflow Section with Green step indicators & Orange connecting progress line */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/40 px-6 py-5 md:px-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Operational Rescue Workflow</h2>
          <p className="mt-1 text-sm text-muted-foreground">A clear rescue chain from donation intake to verified community impact.</p>
        </div>
        <div className="relative px-6 py-8 md:px-8">
          {/* Orange Connecting Line (desktop view) */}
          <div className="absolute top-[68px] left-12 right-12 h-0.5 bg-warning hidden md:block" />

          <div className="grid gap-6 md:grid-cols-6 relative z-10">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={step.label} className="flex flex-col items-center text-center group">
                  {/* Green step indicator */}
                  <div className="h-12 w-12 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-110">
                    {idx + 1}
                  </div>
                  {/* Green Icon */}
                  <div className="mt-4 p-2 rounded-full bg-primary/10 border border-primary/25">
                    <StepIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-3 text-xs font-bold text-foreground tracking-tight leading-tight">{step.label}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground max-w-[150px]">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section: Orange prominently used for metrics and Green supporting labels */}
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-8 border-primary/20 bg-primary/[0.02] flex flex-col justify-between">
          <div>
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              ✓ Gemma Intelligence Engaged
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Automation in the background.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Gemma estimates meals, freshness, shelf life, storage constraints, urgency, and suitable NGO types while the team keeps operating the rescue workflow.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Learn more about logistics matching</span>
            <button
              onClick={() => onNavigate('/about')}
              className="text-xs font-bold text-primary hover:text-warning transition-colors flex items-center gap-1"
            >
              System Specs <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              name: 'Saffron Garden',
              text: '312 meals collected within 34 minutes for two community kitchens.',
              metric: '312 Meals Saved'
            },
            {
              name: 'Metro Food Bank',
              text: 'Cold storage capacity matched with bakery surplus across three branches.',
              metric: '180 kg Preserved'
            },
          ].map((item) => (
            <Card key={item.name} className="p-6 border-border flex flex-col justify-between hover:border-primary/30 transition-colors">
              <div>
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-base font-bold text-foreground">{item.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Impact Record</span>
                <span className="text-xs font-bold text-warning">{item.metric}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Verified NGO Network */}
      <section className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Verified NGO Network</h2>
            <p className="mt-1 text-sm text-muted-foreground">Real-time availability of active distribution points.</p>
          </div>
          <button
            onClick={() => onNavigate('/organizations/discover')}
            className="text-sm font-semibold text-primary hover:text-warning transition-colors"
          >
            View All Partners
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {['Community Kitchens', 'Shelter Hubs', 'Food Banks', 'Emergency Response', 'NGOs', 'Relief Agencies'].map((org) => (
            <div
              key={org}
              onClick={() => onNavigate('/organizations/discover')}
              className="group relative rounded-lg border border-border bg-muted/40 p-5 transition-all duration-300 hover:border-primary hover:shadow-md cursor-pointer overflow-hidden"
            >
              {/* Orange active state bar at the top, visible on hover/active */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-warning transition-colors duration-300" />
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{org}</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Verified partner in the rescue network.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
