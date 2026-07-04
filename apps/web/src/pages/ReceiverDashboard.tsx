import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DemoModeBanner } from '../components/ui/DemoModeBanner';
import { ImpactDashboard, ImpactMetrics, DEMO_METRICS } from '../components/ui/ImpactDashboard';
import { AIStatusPanel } from '../components/ai/AIStatusPanel';
import { apiClient } from '../api/client';

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
  CRITICAL: { badge: 'destructive', label: 'Critical' },
  HIGH:     { badge: 'destructive', label: 'High Priority' },
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

const ListingCard: React.FC<{
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
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col hover:border-primary/20 hover:shadow-sm transition-all duration-200">
      <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {listing.title}
            </h4>
            <span className="text-[10px] text-primary font-bold uppercase tracking-wide block mt-1">
              🏪 {listing.contact_person ?? 'Donor'}
            </span>
          </div>
          <Badge variant={urgencyCfg.badge} className="text-[9px] font-bold tracking-wide uppercase shrink-0">
            {urgencyCfg.label}
          </Badge>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-500">
          <div>📦 <span className="font-semibold text-slate-700 dark:text-slate-300">{listing.quantity} {listing.unit}</span></div>
          <div>📂 <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{listing.category}</span></div>
          {listing.pickup_address && (
            <div className="col-span-2">📍 <span className="font-semibold text-slate-700 dark:text-slate-300">{listing.pickup_address}</span></div>
          )}
          {hoursLeft !== null && (
            <div className={`col-span-2 font-semibold ${hoursLeft <= 3 ? 'text-destructive' : 'text-slate-600 dark:text-slate-300'}`}>
              ⏱ {hoursLeft}h remaining
            </div>
          )}
        </div>

        {/* Gemma summary */}
        {listing.description && (
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-lg p-3 flex-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide block mb-1 not-italic">
              🤖 Gemma Summary
            </span>
            <p className="text-[11px] italic text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
              "{listing.description}"
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button onClick={onAppeal} className="flex-1 text-xs py-1.5 h-9">
            Appeal Package
          </Button>
          <Button onClick={onView} variant="outline" className="flex-1 text-xs py-1.5 h-9 border-slate-200 dark:border-slate-700">
            Full Report
          </Button>
        </div>
      </CardContent>
    </Card>
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
        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/30 hover:text-primary'
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Receiver Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Discover and appeal for surplus food listings active in your transit radius.
            </p>
          </div>
          {isOffline && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-full">
              ⚠️ Offline Demo Mode
            </span>
          )}
        </div>

        {/* Impact metrics */}
        <ImpactDashboard metrics={metrics} variant="compact" />

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left: listings */}
          <div className="lg:col-span-8 space-y-5">
            {/* Search + filters */}
            <div className="space-y-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food, donors, locations…"
                className="w-full h-10 px-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />

              <div className="flex flex-wrap gap-2">
                <FilterPill label="All Categories" active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')} />
                {categories.map((c) => (
                  <FilterPill key={c} label={c.charAt(0).toUpperCase() + c.slice(1)} active={categoryFilter === c} onClick={() => setCategoryFilter(c)} />
                ))}
                <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 self-center" />
                <FilterPill label="All Priority" active={urgencyFilter === 'all'} onClick={() => setUrgencyFilter('all')} />
                <FilterPill label="🚨 High" active={urgencyFilter === 'HIGH'} onClick={() => setUrgencyFilter('HIGH')} />
                <FilterPill label="Normal" active={urgencyFilter === 'NORMAL'} onClick={() => setUrgencyFilter('NORMAL')} />
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Available Listings
                  {!loading && (
                    <span className="ml-2 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {filtered.length}
                    </span>
                  )}
                </h2>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 animate-pulse space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                      <div className="h-16 bg-slate-50 dark:bg-slate-800 rounded" />
                      <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl py-12 text-center space-y-2">
                  <span className="text-3xl">🔍</span>
                  <p className="text-sm font-semibold text-slate-500">No listings match your filters</p>
                  <p className="text-xs text-slate-400">Try clearing the category or urgency filter.</p>
                  <Button
                    variant="ghost"
                    className="text-xs mt-2"
                    onClick={() => { setSearch(''); setCategoryFilter('all'); setUrgencyFilter('all'); }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered.map((item) => (
                    <ListingCard
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

          {/* Right sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <AIStatusPanel />

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Button onClick={() => onNavigate('/organizations/discover')} className="text-xs justify-start h-9">
                  🗺️ Explore Organizations
                </Button>
                <Button onClick={() => onNavigate('/requests')} variant="outline" className="text-xs justify-start h-9 border-slate-200 dark:border-slate-700">
                  📋 My Active Appeals
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
