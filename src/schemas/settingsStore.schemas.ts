import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import type { ThemePreference, UnitSystem } from '../types';

const persistedSchema = z.object({
  units: z.enum(['metric', 'imperial']),
  theme: z.enum(['light', 'dark', 'system']),
});

interface SettingsState {
  units: UnitSystem;
  theme: ThemePreference;
  setUnits: (units: UnitSystem) => void;
  setTheme: (theme: ThemePreference) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      units: 'metric',
      theme: 'system',
      setUnits: (units) => set({ units }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      // The key is also read by the inline script in index.html (no theme flash).
      name: 'weather-atlas:settings',
      version: 1,
      partialize: ({ units, theme }) => ({ units, theme }),
      merge: (persisted, current) => {
        const parsed = persistedSchema.safeParse(persisted);
        return parsed.success ? { ...current, ...parsed.data } : current;
      },
    },
  ),
);