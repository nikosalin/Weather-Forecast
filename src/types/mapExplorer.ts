import type { ReactNode } from 'react';
import type { Coordinates, Place } from '../types';

export interface MapExplorerProps {
  selectedPlace: Place | null;
  mapTarget: Coordinates | null;
  onPlaceSelect: (place: Place, shouldFlyTo?: boolean) => void;
  children?: ReactNode;
}
