import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CalendarClock, ClipboardList, PackagePlus, Search, ShieldCheck } from 'lucide-react';
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
  <div className="animate-pulse rounded-lg border border-border bg-card p-5">
    <div className="flex justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
      <div className="h-7 w-20 rounded-full bg-muted" />
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

      const completed = data.filter((l) => l.state === 'COMPLETED');
      const active = data.filter((l) => !['COMPLETED'].includes(l.state));
      const totalKg = data.reduce((sum, l) => sum + (l.quantity || 0), 0);

      setMetrics({
        mealsSaved: Math.round(totalKg * 2.5),
        foodRescuedKg: totalKg,
        co2PreventedKg: Math.round(totalKg * 0.5),
        peopleServed: Math.round(totalKg * 0.625),
        activeDonations: active.length,
        completedDonations: completed.length,
        pendingAppeals: data.filter((l) => l.state === 'PENDING_ALERTS').length,
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

  const activeListings = listings.filter((l) => l.state !== 'COMPLETED');
  const completedListings = listings.filter((l) => l.state === 'COMPLETED');

  return (
    <div className="space-y-8 text-foreground">
      <div className="-mx-6 -mt-8">
        <DemoModeBanner onNavigate={onNavigate} />
      </div>

      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Donor Operations</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage food listings, pickup windows, appeals, and dispatch readiness.
            </p>
          </div>
          <Button onClick={() => onNavigate('/donate/new')} className="shrink-0 text-sm">
            <PackagePlus className="h-4 w-4" /> New Food Listing
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Operations Snapshot</h2>
        <ImpactDashboard metrics={metrics} variant="full" />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-8">
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
              <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_auto] gap-4 border-b border-border px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Food</span>
                <span>Status</span>
                <span>Quantity</span>
                <span>Created</span>
                <span>Actions</span>
              </div>
              {activeListings.map((listing) => {
                const stateCfg = STATE_CONFIG[listing.state] ?? STATE_CONFIG.PENDING_ALERTS;
                return (
                  <div key={listing.id} className="grid grid-cols-1 gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_auto] sm:items-center">
                    <div>
                      <p className="text-sm font-bold">{listing.title}</p>
                      <p className="mt-1 text-[11px] capitalize text-muted-foreground">{listing.category}</p>
                    </div>
                    <span className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${stateCfg.color}`}>
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
                  <div key={listing.id} className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2">
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

        <aside className="space-y-4 lg:col-span-4">
          <Card className="space-y-3 p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Button onClick={() => onNavigate('/donate/new')} className="h-9 justify-start text-xs">
                <PackagePlus className="h-4 w-4" /> Create Food Listing
              </Button>
              <Button onClick={() => onNavigate('/organizations/discover')} variant="outline" className="h-9 justify-start text-xs">
                <Search className="h-4 w-4" /> Discover Nearby NGOs
              </Button>
              <Button onClick={() => onNavigate('/requests')} variant="outline" className="h-9 justify-start text-xs">
                <Bell className="h-4 w-4" /> View Inbound Appeals
              </Button>
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Upcoming Pickups</h3>
              <CalendarClock className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-3 text-xs text-muted-foreground">
              <p className="rounded-md bg-muted p-3">No pickup windows are scheduled yet.</p>
              <p>Accepted appeals will appear here with pickup deadlines and contact notes.</p>
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</h3>
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
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
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
        </aside>
      </div>
    </div>
  );
};
