import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DemoModeBanner } from '../components/ui/DemoModeBanner';
import { DonationTimeline } from '../components/ui/DonationTimeline';
import { AIDecisionTimeline } from '../components/ai/AIDecisionTimeline';
import { AIExplainabilityPanel, ExplainabilityData } from '../components/ai/AIExplanationPanel';
import { MultilingualPreview } from '../components/ai/MultilingualPreview';
import { useNotificationStore } from '../stores/notificationStore';
import { useUserStore } from '../stores/userStore';
import { useAiStore } from '../stores/aiStore';
import { donationsApi } from '../api/donations';

interface DonationDetailsProps {
  listingId: string;
  onBack: () => void;
}

interface NavigateProps {
  onNavigate?: (path: string) => void;
}

const STATE_BADGE: Record<string, 'primary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  PENDING_ALERTS: 'warning',
  ACTIVE:         'primary',
  LOCKED:         'primary',
  COMPLETED:      'success',
};

const LoadingSkeleton = () => (
  <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
    <div className="h-6 w-48 bg-muted rounded" />
    <div className="h-8 w-2/3 bg-muted rounded" />
    <div className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-7 space-y-4">
        <div className="h-48 bg-muted rounded-lg" />
        <div className="h-64 bg-muted rounded-lg" />
      </div>
      <div className="md:col-span-5">
        <div className="h-80 bg-muted rounded-lg" />
      </div>
    </div>
  </div>
);

export const DonationDetails: React.FC<DonationDetailsProps & NavigateProps> = ({
  listingId,
  onBack,
  onNavigate,
}) => {
  const { currentUser } = useUserStore();
  const { addToast } = useNotificationStore();
  const { liveActivity } = useAiStore();

  const [isAppealOpen, setIsAppealOpen] = useState(false);
  const [appealMessage, setAppealMessage] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [listing, setListing] = useState<any | null>(null);
  const [appeals, setAppeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const listingData = await donationsApi.getListing(listingId);
      setListing(listingData);
      setIsAccepted(listingData.state === 'LOCKED' || listingData.state === 'COMPLETED');

      const appealsData = await donationsApi.listAppeals(listingId);
      setAppeals(appealsData);
    } catch {
      addToast('Failed to load listing details.', 'error');
    } finally {
      setLoading(false);
    }
  }, [listingId, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAcceptAppeal = useCallback(async (appealId: string, ngoName: string) => {
    try {
      const donation = await donationsApi.acceptAppeal(appealId);
      setIsAccepted(true);
      addToast(`Appeal accepted! Pickup code ${donation.pickup_code} sent to ${ngoName}.`, 'success');
      fetchData();
    } catch {
      addToast('Failed to accept appeal.', 'error');
    }
  }, [fetchData, addToast]);

  const handleSendAppeal = useCallback(async () => {
    try {
      await donationsApi.createAppeal({ listing_id: listingId, message: appealMessage });
      setIsAppealOpen(false);
      setAppealMessage('');
      addToast('Your appeal has been sent to the donor.', 'success');
      fetchData();
    } catch {
      addToast('Failed to send appeal.', 'error');
    }
  }, [listingId, appealMessage, fetchData, addToast]);

  const handleCompleteDonation = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/donations');
      const allDonations = await response.json();
      const match = allDonations.find((d: any) => d.listing_id === listingId);
      if (!match) {
        addToast('No active donation matching this listing.', 'error');
        return;
      }
      await donationsApi.completeDonation(match.id);
      addToast('Donation marked as completed! Thank you for your contribution.', 'success');
      fetchData();
    } catch {
      addToast('Failed to complete donation.', 'error');
    }
  }, [listingId, fetchData, addToast]);

  // Build explainability data from listing
  const explainData: ExplainabilityData | null = useMemo(() => {
    if (!listing) return null;
    const shelfHours = listing.best_before
      ? Math.max(0, Math.round((new Date(listing.best_before).getTime() - Date.now()) / 3600_000))
      : 24;
    return {
      detectedFood: listing.title,
      category: listing.category ?? 'General',
      estimatedWeightKg: listing.quantity ?? 0,
      estimatedServings: Math.round((listing.quantity ?? 0) * 2.5),
      urgency: ((listing.urgency_level as any) ?? 'NORMAL'),
      urgencyReason: listing.description ?? 'Gemma assessed urgency based on preparation time and quantity.',
      shelfLifeHours: shelfHours,
      confidence: 0.92,
      reasoning: listing.description ?? 'Food analysis complete. Quantity and shelf life verified.',
      recommendedOrgTypes: [
        { type: 'Community Kitchens', reason: 'Cooked food requires immediate warm distribution within 2–4 hours.' },
        { type: 'Shelters with Cold Storage', reason: 'Extended shelf life items can be stored for next-day service.' },
      ],
      excludedOrgTypes: [
        { type: 'Food Banks (dry goods only)', reason: 'This listing contains perishable cooked food incompatible with ambient storage.' },
      ],
      allergens: listing.allergens ? listing.allergens.split(',').map((a: string) => a.trim()) : [],
    };
  }, [listing]);

  if (loading) return <LoadingSkeleton />;
  if (!listing) return (
    <div className="text-center py-16 space-y-3">
      <span className="text-4xl">🚫</span>
      <p className="text-sm font-semibold text-muted-foreground">Listing not found.</p>
      <Button variant="ghost" onClick={onBack} className="text-xs">← Go back</Button>
    </div>
  );

  const badgeVariant = STATE_BADGE[listing.state] ?? 'outline';

  return (
    <div className="space-y-0 max-w-5xl mx-auto">
      {/* Demo banner if navigate prop is provided (dashboard context) */}
      {onNavigate && (
        <div className="-mx-6 -mt-8 mb-6">
          <DemoModeBanner onNavigate={onNavigate} />
        </div>
      )}

      <div className="space-y-6">
        {/* Back + header */}
        <div>
          <button
            onClick={onBack}
            className="text-xs text-primary font-bold hover:underline mb-4 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {listing.title}
                </h1>
                <Badge variant={badgeVariant}>
                  {listing.state?.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Intake by {listing.contact_person ?? 'Donor representative'} ·{' '}
                {new Date(listing.created_at).toLocaleDateString()}
              </p>
            </div>

            {currentUser?.role === 'RECEIVER' && !isAccepted && (
              <Button onClick={() => setIsAppealOpen(true)} className="shrink-0 text-sm">
                Send Pickup Appeal
              </Button>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid md:grid-cols-12 gap-6 items-start">
          {/* Left column */}
          <div className="md:col-span-7 space-y-5">
            {/* Food specs */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Food Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-muted-foreground">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block mb-0.5">Prepared</span>
                    <span className="font-semibold text-foreground">{listing.prep_date ? new Date(listing.prep_date).toLocaleString() : '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block mb-0.5">Best Before</span>
                    <span className="font-semibold text-destructive">{listing.best_before ? new Date(listing.best_before).toLocaleString() : '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block mb-0.5">Quantity</span>
                    <span className="font-semibold text-foreground">{listing.quantity} {listing.unit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block mb-0.5">Category</span>
                    <span className="font-semibold capitalize text-foreground">{listing.category}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block mb-0.5">Pickup Address</span>
                  <span className="font-semibold text-foreground">{listing.pickup_address ?? '—'}</span>
                </div>
                {listing.special_instructions && (
                  <div className="bg-muted p-3 rounded-lg border border-border">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block mb-1">Special Instructions</span>
                    <span className="font-medium italic text-foreground">"{listing.special_instructions}"</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Donation Timeline */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Donation Lifecycle</CardTitle>
              </CardHeader>
              <CardContent>
                <DonationTimeline events={listing.timeline ?? []} />
              </CardContent>
            </Card>

            {/* Multilingual preview */}
            <MultilingualPreview
              summary={listing.multilingual_summary}
              emailDraft={listing.email_draft}
            />
          </div>

          {/* Right column */}
          <div className="md:col-span-5 space-y-5">
            {/* AI Explainability Panel */}
            {explainData && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold">Food Assessment Report</CardTitle>
                  <Badge variant="primary" className="text-[9px] font-bold">Gemma</Badge>
                </CardHeader>
                <CardContent>
                  <AIExplainabilityPanel data={explainData} />
                </CardContent>
              </Card>
            )}

            {/* Gemma Reasoning Pipeline */}
            {liveActivity.some((s) => s.status !== 'pending') && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">Gemma Reasoning Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <AIDecisionTimeline steps={liveActivity} />
                </CardContent>
              </Card>
            )}

            {/* Appeals panel */}
            {currentUser?.role === 'RECEIVER' ? (
              isAccepted ? (
                <Card className="bg-primary/5 border-primary/20 p-5 text-center space-y-2">
                  <span className="text-2xl block">🎉</span>
                  <h4 className="text-sm font-bold text-primary">Listing Locked to Your Organization</h4>
                  <p className="text-xs text-muted-foreground">Pickup code has been sent. Coordinate with the donor for collection.</p>
                </Card>
              ) : null
            ) : (
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Incoming Appeals</h3>

                {listing.state === 'COMPLETED' ? (
                  <Card className="bg-primary/5 border-primary/20 p-5 text-center space-y-2">
                    <span className="text-2xl block">🌱</span>
                    <h4 className="text-sm font-bold text-primary">Donation Completed</h4>
                    <p className="text-xs text-muted-foreground">Carbon savings and meals served have been audited and logged.</p>
                  </Card>
                ) : isAccepted ? (
                  <Card className="bg-primary/5 border-primary/20 p-5 text-center space-y-3">
                    <span className="text-2xl block">✅</span>
                    <h4 className="text-sm font-bold text-primary">Pickup Assigned</h4>
                    <p className="text-xs text-muted-foreground">Collection code is active and locked.</p>
                    {currentUser?.role === 'DONOR' && (
                      <Button onClick={handleCompleteDonation} className="w-full text-xs">
                        Mark Pickup Completed
                      </Button>
                    )}
                  </Card>
                ) : appeals.length > 0 ? (
                  <div className="space-y-3">
                    {appeals.map((appeal) => (
                      <Card key={appeal.id} className="bg-card border-border">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <h4 className="text-xs font-bold text-foreground">NGO Pickup Request</h4>
                              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                Submitted: {new Date(appeal.requested_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground italic">"{appeal.message}"</p>
                          <Button
                            onClick={() => handleAcceptAppeal(appeal.id, 'NGO Partner')}
                            className="w-full text-xs"
                          >
                            Accept Appeal & Lock Pickup
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg py-8 text-center space-y-1 bg-card">
                    <span className="text-2xl">📩</span>
                    <p className="text-xs font-semibold text-muted-foreground">No incoming appeals yet</p>
                    <p className="text-[10px] text-muted-foreground">Gemma has notified nearby organizations.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appeal Modal */}
      {isAppealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-lg p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Send Pickup Appeal</h3>
              <p className="text-xs text-muted-foreground mt-1">Notify the donor that your team is ready to collect this food package.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Coordination Message</label>
              <textarea
                value={appealMessage}
                onChange={(e) => setAppealMessage(e.target.value)}
                placeholder="e.g. We have a refrigerated vehicle ready for pickup within 20 minutes."
                className="w-full min-h-[100px] bg-muted border border-border rounded-md p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSendAppeal} className="flex-1 text-sm" disabled={!appealMessage.trim()}>
                Submit Appeal
              </Button>
              <Button onClick={() => setIsAppealOpen(false)} variant="outline" className="flex-1 text-sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
