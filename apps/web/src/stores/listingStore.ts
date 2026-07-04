import { create } from 'zustand';
import { FoodListing } from '@foodbridge/types';

interface ListingState {
  listings: FoodListing[];
  setListings: (listings: FoodListing[]) => void;
  addListing: (listing: FoodListing) => void;
}

export const useListingStore = create<ListingState>((set) => ({
  listings: [],
  setListings: (listings) => set({ listings }),
  addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
}));
