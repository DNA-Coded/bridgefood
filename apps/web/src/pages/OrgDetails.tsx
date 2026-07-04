import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { orgApi, OrgProfile } from '../api/organizations';
import { CompatibilityBadge, RequestDonationDialog } from '../components/ui/OrgComponents';
import { useNotificationStore } from '../stores/notificationStore';

export const OrgDetails: React.FC<{ orgId: string; onBack: () => void }> = ({ orgId, onBack }) => {
  const [org, setOrg] = useState<OrgProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const { addToast } = useNotificationStore();

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const data = await orgApi.getNearbyOrgs();
        const match = data.find(o => o.id === orgId);
        if (match) {
          setOrg(match);
        } else {
          addToast('Organization not found.', 'error');
          onBack();
        }
      } catch (err) {
        addToast('Failed to fetch details.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="animate-pulse text-sm text-slate-400">Loading profile specifications...</p>
      </div>
    );
  }

  if (!org) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation header */}
      <button onClick={onBack} className="text-xs text-primary font-bold hover:underline mb-2 block">
        ← Back to Discovery matches
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 aspect-[3/1] flex flex-col justify-end p-6">
        <img src={org.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="relative z-10 flex gap-4 items-end">
          <div className="h-16 w-16 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-3xl shrink-0">
            {org.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{org.name}</h1>
              {org.isVerified && <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Verified</span>}
            </div>
            <p className="text-xs text-slate-400 mt-1 capitalize">{org.orgType.toLowerCase().replace('_', ' ')} Representative</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Core Profile */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">{org.description}</p>
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Accepted food categories</span>
                <div className="flex gap-1.5 flex-wrap">
                  {org.acceptedCategories.map((c) => (
                    <span key={c} className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-xs font-semibold capitalize">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Dietary restrictions supported</span>
                <div className="flex gap-1.5 flex-wrap">
                  {org.dietaryRestrictions.map((d) => (
                    <span key={d} className="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI recommendations */}
          <Card className="bg-teal-950/10 border-teal-900/20 p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-primary uppercase tracking-wide">Gemma Match Reasoning</span>
              <CompatibilityBadge score={org.compatibilityScore} />
            </div>
            <p className="text-xs text-slate-400 italic">"{org.recommendationReason}"</p>
          </Card>
        </div>

        {/* Operating & Contact details */}
        <div className="space-y-6">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block">Representative</span>
                <span className="font-semibold text-slate-200">{org.contactPerson}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone</span>
                <span className="font-semibold text-slate-200">{org.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email</span>
                <span className="font-semibold text-slate-200">{org.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Address Location</span>
                <span className="font-semibold text-slate-200">{org.address}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Operating Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-350">
              <div>
                <span className="text-slate-400 block">Operating Hours</span>
                <span className="font-semibold text-slate-200">{org.operatingHours}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Active Status</span>
                <span className="font-semibold text-slate-200">{org.lastActive}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Pickup Response</span>
                <span className="font-semibold text-slate-200">{org.pickupAvailability}</span>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => setIsRequestOpen(true)}
            variant="primary"
            className="w-full"
          >
            Confirm & Request Pickup
          </Button>
        </div>
      </div>

      <RequestDonationDialog
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        org={org}
        onConfirm={(_msg) => {
          setIsRequestOpen(false);
          addToast(`Pickup request sent to ${org.name}.`, 'success');
        }}
      />
    </div>
  );
};
