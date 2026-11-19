import { useState } from 'react';
import {
  useApplyTheme,
} from './hooks';
import { createPlaceFromCoordinates, } from './lib/coordinates';
import { useSettingsStore } from './schemas';
import type { Coordinates, Place  } from './types';
import { WeatherPanel } from './features/weather/WeatherPanel';
import { MapExplorer } from './features/map/MapExplorer';
import { SavedPlacesDrawer } from './features/places/SavedPlacesDrawer';
import { AppHeader } from './features/header/AppHeader';

import './App.css';


const NEXT_THEME = { light: 'dark', dark: 'system', system: 'light' } as const;


export default function App() {
  useApplyTheme();

  const { units, theme, setUnits, setTheme } = useSettingsStore();
const [selected, setSelected] = useState<Place | null>(null);
const [mapTarget, setMapTarget] = useState<Coordinates | null>(null);
const [locationError, setLocationError] = useState<string | null>(null);
function handlePlaceSelect(place: Place) {
  setSelected(place);
  setMapTarget(place.coordinates);
}

function handleMyLocation() {
  if (!navigator.geolocation) {
    setLocationError('Your browser does not support location services.');
    return;
  }

  setLocationError(null);

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const place = createPlaceFromCoordinates(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        'Your location',
      );

      setSelected(place);
      setMapTarget(place.coordinates);
    },
    () => {
      setLocationError(
        'We could not access your location. Check your browser permission and try again.',
      );
    },
    {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 5 * 60 * 1000,
    },
  );
}
  return (
    <main className="app-shell">
 <AppHeader
  units={units}
  theme={theme}
  onPlaceSelect={handlePlaceSelect}
  onUnitsToggle={() =>
    setUnits(units === 'metric' ? 'imperial' : 'metric')
  }
  onThemeCycle={() => setTheme(NEXT_THEME[theme])}
  onCurrentLocation={handleMyLocation}
/>
<MapExplorer
  selectedPlace={selected}
  mapTarget={mapTarget}
  onPlaceSelect={(place, shouldFlyTo = true) => {
    setSelected(place);

    if (shouldFlyTo) {
      setMapTarget(place.coordinates);
    }
  }}
>
  {locationError && (
    <p className="location-error" role="alert">
      {locationError}
    </p>
  )}
<SavedPlacesDrawer
  onSelect={handlePlaceSelect}
  isWeatherPanelOpen={selected !== null}
/>
  {selected && (
    <WeatherPanel
      place={selected}
      onClose={() => setSelected(null)}
    />
  )}
</MapExplorer>

    </main>
  );
}