import type { Place, ThemePreference, UnitSystem } from '../types';

export interface AppHeaderProps {
  units: UnitSystem;
  theme: ThemePreference;
  onPlaceSelect: (place: Place) => void;
  onUnitsToggle: () => void;
  onThemeCycle: () => void;
  onCurrentLocation: () => void;
}