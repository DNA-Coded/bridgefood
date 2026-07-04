import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DemoModeBanner } from '../components/ui/DemoModeBanner';
import { ImpactDashboard, ImpactMetrics, DEMO_METRICS } from '../components/ui/ImpactDashboard';
import { AIStatusPanel } from '../components/ai/AIStatusPanel';
import { apiClient } from '../api/client';
import { Search, Sparkles } from 'lucide-react';

interface ReceiverDashboardProps {
  onNavigate: (path: string) => void;
}

interface LiveListing {
  id: string;
  title: string;
  category: string;
  state: string;
  quantity: number;
  unit: string;
  created_at: string;
  best_before: string;
  urgency_level?: string;
  description?: string;
  pickup_address?: string;
  contact_person?: string;
}

const URGENCY_CONFIG: Record<string, { badge: 'destructive' | 'warning' | 'primary' | 'outline'; label: string }> = {
  CRITICAL: { badge: 'warning', label: 'Critical' },
  HIGH:     { badge: 'warning', label: 'High Priority' },
  NORMAL:   { badge: 'primary',     label: 'Normal' },
  LOW:      { badge: 'outline',     label: 'Low Priority' },
};

// Rich demo listings for offline fallback
const DEMO_LISTINGS: LiveListing[] = [
  {
    id: 'list_demo_1',
    title: 'Warm Vegetable Saffron Rice & Chickpea Curry',
    category: 'cooked',
    state: 'PENDING_ALERTS',
    quantity: 15, unit: 'kg',
    created_at: new Date(Date.now() - 3600_000).toISOString(),
    best_before: new Date(Date.now() + 10800_000).toISOString(),
    urgency_level: 'HIGH',
    description: 'Cooked buffet meal. Suggest hot-case transport. Safe for immediate distribution. Freshly prepared 1 hour ago from organic produce.',
    pickup_address: '14A, Park Street, Kolkata',
    contact_person: 'Saffron Garden Restaurant',
  },
  {
    id: 'list_demo_2',
    title: 'Fresh Artisanal Sourdough & Croissants',
    category: 'bakery',
    state: 'ACTIVE',
    quantity: 8, unit: 'kg',
    created_at: new Date(Date.now() - 7200_000).toISOString(),
    best_before: new Date(Date.now() + 86400_000).toISOString(),
    urgency_level: 'NORMAL',
    description: 'Ambient bread, vegan-friendly. High volume carbohydrate energy. Excellent for shelters serving breakfast.',
    pickup_address: '22, Camac Street, Kolkata',
    contact_person: 'Main St Artisanal Bakery',
  },
  {
    id: 'list_demo_3',
    title: 'Halal Chicken Biryani Catering Trays',
    category: 'cooked',
    state: 'PENDING_ALERTS',
    quantity: 22, unit: 'kg',
    created_at: new Date(Date.now() - 1800_000).toISOString(),
    best_before: new Date(Date.now() + 7200_000).toISOString(),
    urgency_level: 'HIGH',
    description: 'Warm protein content. Halal certified. High density dietary match for large shelters.',
    pickup_address: '88, Rashbehari Avenue, Kolkata',
    contact_person: 'Royal Spice Caterers',
  },
];

const ListingRow: React.FC<{
  listing: LiveListing;
  onView: () => void;
  onAppeal: () => void;
}> = ({ listing, onView, onAppeal }) => {
  const urgencyKey = (listing.urgency_level ?? 'NORMAL').toUpperCase();
  const urgencyCfg = URGENCY_CONFIG[urgencyKey] ?? URGENCY_CONFIG['NORMAL'];
  const hoursLeft = listing.best_before
    ? Math.max(0, Math.round((new Date(listing.best_before).getTime() - Date.now()) / 3600_000))
    : null;

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[1.7fr_0.7fr_0.8fr_0.7fr_auto] md:items-center">
      <div>
        <p className="text-sm font-semibold text-foreground leading-snug">{listing.title}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{listing.contact_person ?? 'Donor'} · {listing.category}</p>
        {listing.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{listing.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{listing.quantity} {listing.unit}</span>
        <span>Quantity</span>
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{listing.pickup_address ?? 'Nearby'}</span>
        <span>Location</span>
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span className={`font-semibold ${hoursLeft !== null && hoursLeft <= 3 ? 'text-destructive' : 'text-foreground'}`}>
          {hoursLeft !== null ? `${hoursLeft}h remaining` : 'TBD'}
        </span>
        <span>Expiry</span>
      </div>

      <div className="flex flex-col gap-2 md:items-end">
        <Badge variant={urgencyCfg.badge} className="w-fit text-[9px] font-bold uppercase tracking-[0.22em]">
          {urgencyCfg.label}
        </Badge>
        <div className="flex gap-2">
          <Button onClick={onAppeal} className="h-9 px-3 text-xs">
            Appeal Package
          </Button>
          <Button onClick={onView} variant="secondary" className="h-9 px-3 text-xs">
            Full Report
          </Button>
        </div>
      </div>
    </div>
  );
};

const FilterPill: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 ${
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'bg-card border border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground'
    }`}
  >
    {label}
  </button>
);

export const ReceiverDashboard: React.FC<ReceiverDashboardProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [listings, setListings] = useState<LiveListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [metrics, setMetrics] = useState<ImpactMetrics>(DEMO_METRICS);


  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<LiveListing[]>('/api/v1/food');
      const available = data.filter((l) => l.state === 'PENDING_ALERTS' || l.state === 'ACTIVE');
      setListings(available);
      setIsOffline(false);

      const totalKg = available.reduce((sum, l) => sum + (l.quantity || 0), 0);
      setMetrics({
        mealsSaved: Math.round(totalKg * 2.5),
        foodRescuedKg: totalKg,
        co2PreventedKg: Math.round(totalKg * 0.5),
        peopleServed: Math.round(totalKg * 0.625),
        activeDonations: available.length,
        completedDonations: data.filter((l) => l.state === 'COMPLETED').length,
        pendingAppeals: 0,
        organizationsHelped: data.filter((l) => l.state === 'COMPLETED').length,
        isOfflineDemo: false,
      });
    } catch {
      setListings(DEMO_LISTINGS);
      setIsOffline(true);
      setMetrics(DEMO_METRICS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase()) &&
          !(item.contact_person ?? '').toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (urgencyFilter !== 'all' && (item.urgency_level ?? 'NORMAL') !== urgencyFilter) return false;
      return true;
    });
  }, [listings, search, categoryFilter, urgencyFilter]);

  const handleAppeal = (listing: LiveListing) => {
    onNavigate(`/donations/${listing.id}`);
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(listings.map((l) => l.category)));
    return unique;
  }, [listings]);

  return (
    <div className="space-y-0">
      {/* Demo banner */}
      <div className="-mx-6 -mt-8 mb-6">
        <DemoModeBanner onNavigate={onNavigate} />
      </div>

      <div className="space-y-8">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Receiver dashboard
              </span>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Find the right surplus food before it expires.</h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Search active listings, read the AI summary, and move quickly on the highest priority rescue opportunities.
              </p>
            </div>
            {isOffline && (
              <span className="w-fit rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-800">
                Offline demo mode
              </span>
            )}
          </div>
        </Card>

        {/* Impact metrics */}
        <ImpactDashboard metrics={metrics} variant="compact" />

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="space-y-5 lg:col-span-8">
            {/* Search + filters */}
            <div className="space-y-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food, donors, locations…"
                className="w-full h-10 px-4 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              />

              <div className="flex flex-wrap gap-2">
                <FilterPill label="All Categories" active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')} />
                {categories.map((c) => (
                  <FilterPill key={c} label={c.charAt(0).toUpperCase() + c.slice(1)} active={categoryFilter === c} onClick={() => setCategoryFilter(c)} />
                ))}
                <span className="w-px h-5 bg-border self-center" />
                <FilterPill label="All Priority" active={urgencyFilter === 'all'} onClick={() => setUrgencyFilter('all')} />
                <FilterPill label="High" active={urgencyFilter === 'HIGH'} onClick={() => setUrgencyFilter('HIGH')} />
                <FilterPill label="Normal" active={urgencyFilter === 'NORMAL'} onClick={() => setUrgencyFilter('NORMAL')} />
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-foreground">
                  Available Listings
                  {!loading && (
                    <span className="ml-2 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {filtered.length}
                    </span>
                  )}
                </h2>
              </div>

              {loading ? (
                <div className="grid gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-8 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border py-12 text-center space-y-2 bg-card">
                  <Search className="mx-auto h-8 w-8 text-primary" />
                  <p className="text-sm font-semibold text-foreground">No listings match your filters</p>
                  <p className="text-xs text-muted-foreground">Try clearing the category or urgency filter.</p>
                  <Button
                    variant="ghost"
                    className="text-xs mt-2"
                    onClick={() => { setSearch(''); setCategoryFilter('all'); setUrgencyFilter('all'); }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <div className="grid grid-cols-[1.7fr_0.7fr_0.8fr_0.7fr_auto] gap-4 border-b border-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                    <span>Food</span>
                    <span>Qty</span>
                    <span>Location</span>
                    <span>Expiry</span>
                    <span>Action</span>
                  </div>
                  {filtered.map((item) => (
                    <ListingRow
                      key={item.id}
                      listing={item}
                      onView={() => onNavigate(`/donations/${item.id}`)}
                      onAppeal={() => handleAppeal(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <AIStatusPanel />

            <Card className="space-y-3 p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Button onClick={() => onNavigate('/organizations/discover')} className="justify-start text-xs h-9">
                  Explore Organizations
                </Button>
                <Button onClick={() => onNavigate('/requests')} variant="outline" className="justify-start text-xs h-9">
                  My Active Appeals
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
