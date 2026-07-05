import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, HeartHandshake, ShieldCheck, Mail, Lock, Landmark } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface RoleSelectionProps {
  onNavigate: (path: string) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<'donor' | 'receiver' | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    {
      roleType: 'donor' as const,
      title: 'Food Donor',
      description: 'Restaurants, hotels, caterers, supermarkets, bakeries, warehouses, and event teams listing clean surplus food for pickup.',
      action: 'Enter Donor Operations',
      path: '/donor/dashboard',
      icon: Building2,
    },
    {
      roleType: 'receiver' as const,
      title: 'Receiving Organization',
      description: 'NGOs, food banks, community kitchens, shelters, and relief agencies ready to appeal for available donations.',
      action: 'Enter Receiver Workspace',
      path: '/receiver/dashboard',
      icon: HeartHandshake,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'donor') {
      onNavigate('/donor/dashboard');
    } else if (selectedRole === 'receiver') {
      onNavigate('/receiver/dashboard');
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  if (selectedRole) {
    const isDonor = selectedRole === 'donor';
    return (
      <div className="flex flex-1 items-center justify-center py-10 md:py-16">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-3 w-3" /> {isDonor ? 'Donor Operations Portal' : 'NGO Operations Portal'}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              {mode === 'signin'
                ? `Sign In as a ${isDonor ? 'Donor' : 'Receiver'}`
                : `Sign Up as a ${isDonor ? 'Donor' : 'Receiver'}`}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              {mode === 'signin'
                ? 'Enter your operational credentials to access your workspace.'
                : 'Register your organization to join the food rescue network.'}
            </p>
          </div>

          {/* Card containing Form */}
          <Card className="p-6 md:p-8 border-primary/20 shadow-lg relative overflow-hidden group">
            {/* Top orange active accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-warning" />

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Landmark className="h-3.5 w-3.5" /> {isDonor ? 'Organization / Business Name' : 'NGO / Shelter Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={isDonor ? 'e.g., Saffron Garden' : 'e.g., Hope Community Kitchen'}
                    className="w-full h-10 px-4 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="w-full h-10 px-4 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-4 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full h-10 text-xs font-bold uppercase tracking-wider">
                  {mode === 'signin' ? 'Sign In & Enter Operations' : 'Register & Join Network'}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-warning transition-colors font-bold uppercase tracking-wider text-[10px]"
              >
                {mode === 'signin'
                  ? `Need an account? Sign Up`
                  : `Already registered? Sign In`}
              </button>
            </div>
          </Card>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => {
                setSelectedRole(null);
                setMode('signin');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-warning transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Back to workspace selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center py-10 md:py-16">
      <div className="w-full max-w-5xl space-y-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
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
              <Card key={role.title} className="flex min-h-[300px] flex-col justify-between p-7 transition hover:border-primary/30 hover:shadow-md relative overflow-hidden group">
                {/* Top orange line highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-warning transition-colors duration-300" />
                
                <div className="space-y-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold">{role.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <Button onClick={() => {
                  setSelectedRole(role.roleType);
                  setMode('signin');
                }} className="mt-8 w-full">
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
