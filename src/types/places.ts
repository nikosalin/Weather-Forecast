import type { Place } from '../types';

export interface PlaceSearchProps {
  onSelect: (place: Place) => void;
}

export interface SavedPlacesDrawerProps {
  onSelect: (place: Place) => void;
  isWeatherPanelOpen: boolean;
}
