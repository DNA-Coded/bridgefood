import { create } from 'zustand';
import { OrgProfile } from '../api/organizations';

interface FilterState {
  searchQuery: string;
  category: string; // "all", "cooked", "packaged", "raw"
  distanceMax: number; // e.g. 5km
  vegetarian: boolean;
  halal: boolean;
  vegan: boolean;
  jain: boolean;
  minCapacity: number;
  verifiedOnly: boolean;
}

interface OrgStore {
  organizations: OrgProfile[];
  filteredOrganizations: OrgProfile[];
  selectedOrg: OrgProfile | null;
  filters: FilterState;
  sortBy: 'compatibility' | 'distance' | 'rating';
  setOrganizations: (orgs: OrgProfile[]) => void;
  setSelectedOrg: (org: OrgProfile | null) => void;
  updateFilters: (updated: Partial<FilterState>) => void;
  setSortBy: (sort: 'compatibility' | 'distance' | 'rating') => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  distanceMax: 10,
  vegetarian: false,
  halal: false,
  vegan: false,
  jain: false,
  minCapacity: 0,
  verifiedOnly: false
};

export const useOrganizationStore = create<OrgStore>((set, get) => ({
  organizations: [],
  filteredOrganizations: [],
  selectedOrg: null,
  filters: INITIAL_FILTERS,
  sortBy: 'compatibility',
  
  setOrganizations: (orgs) => set({ organizations: orgs, filteredOrganizations: orgs }),
  setSelectedOrg: (org) => set({ selectedOrg: org }),
  
  updateFilters: (updated) => {
    set((state) => ({ filters: { ...state.filters, ...updated } }));
    get().applyFilters();
  },
  
  setSortBy: (sort) => {
    set({ sortBy: sort });
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: INITIAL_FILTERS });
    get().applyFilters();
  },

  applyFilters: () => {
    const { organizations, filters, sortBy } = get();
    let result = [...organizations];

    // Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(o => o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter(o => o.acceptedCategories.includes(filters.category));
    }

    // Distance
    result = result.filter(o => o.distanceKm <= filters.distanceMax);

    // Dietary Restrictions
    if (filters.vegetarian) result = result.filter(o => o.dietaryRestrictions.includes('VEGETARIAN'));
    if (filters.halal) result = result.filter(o => o.dietaryRestrictions.includes('HALAL'));
    if (filters.vegan) result = result.filter(o => o.dietaryRestrictions.includes('VEGAN'));
    if (filters.jain) result = result.filter(o => o.dietaryRestrictions.includes('JAIN'));

    // Capacity
    result = result.filter(o => o.capacityLevel >= filters.minCapacity);

    // Verified
    if (filters.verifiedOnly) {
      result = result.filter(o => o.isVerified);
    }

    // Sorting
    if (sortBy === 'compatibility') {
      result.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    } else if (sortBy === 'distance') {
      result.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    set({ filteredOrganizations: result });
  }
}));
