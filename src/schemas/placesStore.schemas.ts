import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import type { Place } from '../types';

export const MAX_PLACES = 12;

const persistedSchema = z.object({
  places: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      admin1: z.string().optional(),
      country: z.string().optional(),
      coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    }),
  ),
});

interface PlacesState {
  places: Place[];
  /** Returns false when the place already exists or the limit is reached. */
  addPlace: (place: Place) => boolean;
  removePlace: (id: string) => void;
  clearPlaces: () => void;
}

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set, get) => ({
      places: [],

      addPlace: (place) => {
        const { places } = get();
        const isDuplicate = places.some((p) => p.id === place.id);
        if (isDuplicate || places.length >= MAX_PLACES) return false;
        set({ places: [...places, place] });
        return true;
      },

      removePlace: (id) =>
        set((state) => ({ places: state.places.filter((p) => p.id !== id) })),

      clearPlaces: () => set({ places: [] }),
    }),
    {
      name: 'weather-atlas:places',
      version: 1,
      partialize: ({ places }) => ({ places }),
      // Never trust storage: fall back to an empty list if it was tampered with.
      merge: (persisted, current) => {
        const parsed = persistedSchema.safeParse(persisted);
        return parsed.success ? { ...current, places: parsed.data.places } : current;
      },
    },
  ),
);