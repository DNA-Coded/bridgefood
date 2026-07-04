import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Bell, CalendarClock, ClipboardList, PackagePlus, Search, ShieldCheck, Boxes, MapPinned, History, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DemoModeBanner } from '../components/ui/DemoModeBanner';
import { ImpactDashboard, ImpactMetrics, DEMO_METRICS } from '../components/ui/ImpactDashboard';
import { apiClient } from '../api/client';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

interface FoodListing {
  id: string;
  title: string;
  category: string;
  state: string;
  created_at: string;
  quantity?: number;
  unit?: string;
}

const STATE_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING_ALERTS: { label: 'Pending alerts', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  ACTIVE: { label: 'Active', color: 'bg-primary/10 text-primary border-primary/20' },
  ACCEPTED: { label: 'Accepted', color: 'bg-primary/10 text-primary border-primary/20' },
  LOCKED: { label: 'Pickup locked', color: 'bg-secondary/10 text-secondary border-secondary/20' },
  COMPLETED: { label: 'Completed', color: 'bg-success/10 text-success border-success/20' },
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-lg border border-border bg-card p-4">
    <div className="flex justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
      <div className="h-7 w-20 rounded-md bg-muted" />
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ImpactMetrics>(DEMO_METRICS);
  const [isOffline, setIsOffline] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<FoodListing[]>('/api/v1/food');
      setListings(data);

      const completed = data.filter((listing) => listing.state === 'COMPLETED');
      const active = data.filter((listing) => listing.state !== 'COMPLETED');
      const totalKg = data.reduce((sum, listing) => sum + (listing.quantity || 0), 0);

      setMetrics({
        mealsSaved: Math.round(totalKg * 2.5),
        foodRescuedKg: totalKg,
        co2PreventedKg: Math.round(totalKg * 0.5),
        peopleServed: Math.round(totalKg * 0.625),
        activeDonations: active.length,
        completedDonations: completed.length,
        pendingAppeals: data.filter((listing) => listing.state === 'PENDING_ALERTS').length,
        organizationsHelped: completed.length,
        isOfflineDemo: false,
      });
      setIsOffline(false);
    } catch {
      setIsOffline(true);
      setMetrics(DEMO_METRICS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const activeListings = listings.filter((listing) => listing.state !== 'COMPLETED');
  const completedListings = listings.filter((listing) => listing.state === 'COMPLETED');

  return (
    <div className="space-y-8 text-foreground">
      <div className="-mx-4 -mt-4 md:-mx-6 md:-mt-6">
        <DemoModeBanner onNavigate={onNavigate} />
      </div>

      <section className="rounded-lg border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              Donor operations
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Manage surplus food through a clear rescue workflow.</h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Keep current listings, pickup windows, appeals, and impact records organized without changing the underlying workflow.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => onNavigate('/donate/new')} className="shrink-0 text-sm">
              <PackagePlus className="h-4 w-4" /> New Food Listing
            </Button>
            <Button onClick={() => onNavigate('/organizations/discover')} variant="outline" className="shrink-0 text-sm">
              Find NGO <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Operations Snapshot</h2>
          <span className="text-[10px] font-semibold text-muted-foreground">High-signal metrics first</span>
        </div>
        <ImpactDashboard metrics={metrics} variant="full" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-0">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-muted-foreground">Large Action Cards</h2>
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            <button onClick={() => onNavigate('/donate/new')} className="group min-h-44 border-b border-border p-6 text-left transition-colors hover:bg-muted sm:col-span-2 md:min-h-52">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-primary/10 text-primary">
                      <Boxes className="h-5 w-5" />
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Donate Food</h3>
                    <p className="max-w-md text-sm leading-6 text-muted-foreground">Schedule a new surplus collection and start the rescue chain.</p>
                  </div>
                  <span className="hidden text-4xl text-primary/20 transition-transform group-hover:translate-x-1 md:block">→</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Create listing</span>
              </div>
            </button>

            {[
              { title: 'Track Donation', desc: 'Live delivery status', icon: MapPinned, path: '/donor/dashboard' },
              { title: 'Find NGO', desc: 'Nearby partners', icon: Search, path: '/organizations/discover' },
              { title: 'View History', desc: 'Past 12 months', icon: History, path: '/donor/dashboard' },
              { title: 'Certificates', desc: 'Tax documents', icon: FileText, path: '/profile' },
            ].map(({ title, desc, icon: Icon, path }) => (
              <button key={title} onClick={() => onNavigate(path)} className="min-h-44 border-b border-r border-border p-6 text-left transition-colors hover:bg-muted last:border-r-0 md:min-h-44">
                <div className="flex h-full flex-col justify-between">
                  <Icon className="h-7 w-7 text-primary" />
                  <div>
                    <h3 className="text-base font-bold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-muted-foreground">Live Impact</h3>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-md border border-border bg-surface-container-lowest p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Meals Served</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">14,209</p>
                <div className="mt-3 h-1.5 bg-muted"><div className="h-full w-[72%] bg-primary" /></div>
              </div>
              <div className="rounded-md border border-border bg-surface-container-lowest p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">CO2 Saved (KG)</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">3,142</p>
              </div>
              <div className="rounded-md border border-border bg-surface-container-lowest p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Waste Prevented</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">8.4k</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-muted-foreground">Recent Activity</h3>
              <History className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 space-y-3">
              {[
                ['Delivered', 'Batch #8291 delivered to City Soup Kitchen.', '14:20 PM'],
                ['Pickup Scheduled', "Logistics partner 'GreenMove' assigned for Batch #8295.", '11:05 AM'],
                ['NGO Matched', "Hope Foundation accepted donation request #8295.", '09:45 AM'],
                ['Donation Created', 'New donation entry created for 140kg perishable goods.', '08:12 AM'],
              ].map(([title, desc, time]) => (
                <div key={title} className="flex gap-3 rounded-md border border-border bg-surface-container-lowest p-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">•</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                      <span className="text-[10px] font-medium text-muted-foreground">{time}</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">
            Current Listings
            {!loading && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                {activeListings.length}
              </span>
            )}
          </h2>
          {isOffline && <span className="text-[10px] font-semibold text-amber-800">Reference data</span>}
        </div>

        {loading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : activeListings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card py-14 text-center">
            <ClipboardList className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 text-sm font-semibold">No current listings</p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
              Create a food listing to begin assessment, recipient notification, and pickup coordination.
            </p>
            <Button onClick={() => onNavigate('/donate/new')} className="mt-5 text-xs">
              Create First Listing
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="grid grid-cols-[1.8fr_0.8fr_0.8fr_0.8fr_auto] gap-4 border-b border-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <span>Food</span>
              <span>Status</span>
              <span>Quantity</span>
              <span>Created</span>
              <span>Actions</span>
            </div>
            {activeListings.map((listing) => {
              const stateCfg = STATE_CONFIG[listing.state] ?? STATE_CONFIG.PENDING_ALERTS;
              return (
                <div key={listing.id} className="grid grid-cols-1 gap-3 border-b border-border px-4 py-4 last:border-b-0 transition-colors hover:bg-muted/30 sm:grid-cols-[1.8fr_0.8fr_0.8fr_0.8fr_auto] sm:items-center">
                  <div>
                    <p className="text-sm font-bold">{listing.title}</p>
                    <p className="mt-1 text-[11px] capitalize text-muted-foreground">{listing.category}</p>
                  </div>
                  <span className={`w-fit rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${stateCfg.color}`}>
                    {stateCfg.label}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {listing.quantity ? `${listing.quantity} ${listing.unit || 'kg'}` : 'TBD'}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(listing.created_at).toLocaleDateString()}</span>
                  <Button onClick={() => onNavigate(`/donations/${listing.id}`)} variant="outline" className="h-8 px-3 text-xs">
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && completedListings.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-bold">Completed Pickups</h3>
            <div className="mt-3 space-y-2">
              {completedListings.slice(0, 3).map((listing) => (
                <div key={listing.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-container-lowest px-3 py-2">
                  <span className="truncate text-xs font-semibold">{listing.title}</span>
                  <Button onClick={() => onNavigate(`/donations/${listing.id}`)} variant="ghost" className="h-7 px-2 text-[11px]">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="space-y-3 p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Quick Actions</h3>
          <div className="grid gap-2">
            <Button onClick={() => onNavigate('/donate/new')} className="h-11 justify-start text-xs">
              <PackagePlus className="h-4 w-4" /> Create Food Listing
            </Button>
            <Button onClick={() => onNavigate('/organizations/discover')} variant="outline" className="h-11 justify-start text-xs">
              <Search className="h-4 w-4" /> Discover Nearby NGOs
            </Button>
            <Button onClick={() => onNavigate('/requests')} variant="outline" className="h-11 justify-start text-xs">
              <Bell className="h-4 w-4" /> View Inbound Appeals
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Upcoming Pickups</h3>
              <CalendarClock className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-3 text-xs text-muted-foreground">
              <p className="rounded-md border border-border bg-surface-container-lowest p-3">No pickup windows are scheduled yet.</p>
              <p>Accepted appeals will appear here with pickup deadlines and contact notes.</p>
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Recent Activity</h3>
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-3 text-xs text-muted-foreground">
              <p>Food assessment service ready.</p>
              <p>Recipient notification queue standing by.</p>
              <p>Appeal review workspace available.</p>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold">Gemma Status</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Assessment support is available for freshness, shelf life, storage advice, and recipient recommendations.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
