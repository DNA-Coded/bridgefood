import React, { useEffect, useState } from 'react';
import { useOrganizationStore } from '../stores/organizationStore';
import { orgApi, OrgProfile } from '../api/organizations';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  CompatibilityBadge,
  CapacityIndicator,
  RequestDonationDialog
} from '../components/ui/OrgComponents';
import { useNotificationStore } from '../stores/notificationStore';

export const OrgDiscover: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const {
    filteredOrganizations,
    filters,
    sortBy,
    setOrganizations,
    updateFilters,
    setSortBy,
    resetFilters
  } = useOrganizationStore();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrgForRequest, setSelectedOrgForRequest] = useState<OrgProfile | null>(null);

  const { addToast } = useNotificationStore();

  useEffect(() => {
    const fetchOrgs = async () => {
      setIsLoading(true);
      try {
        const data = await orgApi.getNearbyOrgs();
        setOrganizations(data);
      } catch (err) {
        addToast('Failed to load recipient listings.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const handleRequestConfirm = (_msg: string) => {
    setSelectedOrgForRequest(null);
    addToast(`Pickup request dispatched successfully to ${selectedOrgForRequest?.name}.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">NGO Discovery</h1>
        <p className="text-sm text-muted-foreground">Ranked recipient organizations for safe, timely food pickup.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Sidebar Filters */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-base font-bold">Search & Filter Settings</CardTitle>
            </CardHeader>

            {/* Query */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Keyword Search</label>
              <Input
                value={filters.searchQuery}
                onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                placeholder="Search shelter name..."
                className="h-9 text-xs"
              />
            </div>

            {/* Proximity Distance */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Maximum Radius</span>
                <span>{filters.distanceMax} km</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                value={filters.distanceMax}
                onChange={(e) => updateFilters({ distanceMax: parseInt(e.target.value) })}
                className="w-full h-1 rounded-lg bg-muted accent-primary"
              />
            </div>

            {/* Diet Options */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-bold text-muted-foreground block mb-1">Dietary Compliance</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={filters.vegetarian}
                    onChange={(e) => updateFilters({ vegetarian: e.target.checked })}
                    className="rounded border-slate-800 text-primary focus:ring-primary"
                  />
                  Vegetarian
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={filters.halal}
                    onChange={(e) => updateFilters({ halal: e.target.checked })}
                    className="rounded border-slate-800 text-primary focus:ring-primary"
                  />
                  Halal Compliance
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={filters.vegan}
                    onChange={(e) => updateFilters({ vegan: e.target.checked })}
                    className="rounded border-slate-800 text-primary focus:ring-primary"
                  />
                  Vegan Options
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={filters.jain}
                    onChange={(e) => updateFilters({ jain: e.target.checked })}
                    className="rounded border-slate-800 text-primary focus:ring-primary"
                  />
                  Jain Friendly
                </label>
              </div>
            </div>

            {/* Verified nodes */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground font-semibold">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => updateFilters({ verifiedOnly: e.target.checked })}
                  className="rounded border-slate-800 text-primary focus:ring-primary"
                />
                Verified Agencies Only
              </label>
            </div>

            <Button
              onClick={resetFilters}
              variant="outline"
              className="w-full text-xs h-9 mt-2"
            >
              Reset Filters
            </Button>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-extrabold">Matching Criteria</h3>
            <div className="mt-4 space-y-3 text-xs text-muted-foreground">
              <p><strong className="text-foreground">Capacity:</strong> current storage availability and serving volume.</p>
              <p><strong className="text-foreground">Pickup time:</strong> estimated travel window for perishable food.</p>
              <p><strong className="text-foreground">Verification:</strong> registered recipient profile and operating hours.</p>
            </div>
          </Card>
        </div>

        {/* Right column: Matches Listing */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-border">
            <span className="text-xs font-semibold text-muted-foreground">Found {filteredOrganizations.length} matching organizations</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-card border border-border rounded px-2 py-1 text-foreground"
              >
                <option value="compatibility">Intelligent Match</option>
                <option value="distance">Travel Distance</option>
                <option value="rating">Rating Level</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-card border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg bg-card text-muted-foreground">
              <p className="text-sm font-semibold">No matches found</p>
              <p className="text-xs text-muted-foreground mt-1">Try expanding your search radius or disabling diet filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrganizations.map((org) => (
                <Card key={org.id} className="hover:border-primary/30 transition-all duration-200">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-5">
                    {/* Symbol */}
                    <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center text-3xl shrink-0">
                      {org.logo}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-foreground">{org.name}</h3>
                            {org.isVerified && (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{org.description}</p>
                        </div>
                        <CompatibilityBadge score={org.compatibilityScore} />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px] text-muted-foreground">
                        <div>Distance: <span className="font-semibold text-foreground">{org.distanceKm} km</span></div>
                        <div>Pickup Time: <span className="font-semibold text-foreground">{org.travelTimeMin} mins</span></div>
                        <div>Verification: <span className="font-semibold text-foreground">{org.rating} / 5.0</span></div>
                      </div>

                      <CapacityIndicator level={org.capacityLevel} />

                      {/* Gemma Recommendation reasoning */}
                      <div className="bg-muted border border-border p-3 rounded-md text-xs text-muted-foreground">
                        <span className="font-bold text-[10px] text-primary uppercase block not-italic mb-1">Gemma Matching Rationale</span>
                        {org.recommendationReason}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => setSelectedOrgForRequest(org)}
                          variant="primary"
                          className="text-xs h-9"
                        >
                          Request Pickup
                        </Button>
                        <Button
                          onClick={() => onNavigate(`/organizations/${org.id}`)}
                          variant="outline"
                          className="text-xs h-9"
                        >
                          View Profile Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog Modal */}
      <RequestDonationDialog
        isOpen={selectedOrgForRequest !== null}
        onClose={() => setSelectedOrgForRequest(null)}
        org={selectedOrgForRequest}
        onConfirm={handleRequestConfirm}
      />
    </div>
  );
};
