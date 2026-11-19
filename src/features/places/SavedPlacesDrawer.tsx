import { useState } from 'react';
import { describeWeather } from '../../api/weatherCodes';
import { useWeatherForPlaces } from '../../hooks';
import { formatCoordinates } from '../../lib/coordinates';
import { usePlacesStore, useSettingsStore } from '../../schemas';
import type { Place } from '../../types';
import { formatTemperature } from '../../units/units';
import styles from './SavedPlacesDrawer.module.css';

interface SavedPlacesDrawerProps {
  onSelect: (place: Place) => void;
  isWeatherPanelOpen: boolean;

}

export function SavedPlacesDrawer({
  onSelect,
  isWeatherPanelOpen,
}: SavedPlacesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { places, removePlace } = usePlacesStore();
  const { units } = useSettingsStore();
  const { data: weatherByPlace } = useWeatherForPlaces(places);

  if (places.length === 0) {
    return null;
  }

  return (
    <aside
  className={`${styles.root} ${
    isWeatherPanelOpen ? styles.panelOpen : ''
  }`}
>
      <button
        className={styles.toggle}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span aria-hidden="true">★</span>
        <span>
          {places.length} saved {places.length === 1 ? 'place' : 'places'}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          {isOpen ? '⌄' : '⌃'}
        </span>
      </button>

      {isOpen && (
        <div className={styles.drawer}>
          <div className={styles.heading}>
            <div>
              <p className={styles.eyebrow}>Your atlas</p>
              <strong>Saved places</strong>
            </div>

            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close saved places"
            >
              ×
            </button>
          </div>

          {places.map((place) => {
            const weather = weatherByPlace?.[place.id];
            const description =
              weather &&
              describeWeather(
                weather.current.weatherCode,
                weather.current.isDay,
              );

            const locationDetails =
              [place.admin1, place.country].filter(Boolean).join(', ') ||
              formatCoordinates(place.coordinates);

            return (
              <div className={styles.item} key={place.id}>
                <button
                  className={styles.placeButton}
                  onClick={() => {
                    onSelect(place);
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.weatherIcon}>
                    {description?.icon ?? '⋯'}
                  </span>

                  <span className={styles.placeName}>
                    <strong>{place.name}</strong>
                    <small>{locationDetails}</small>
                  </span>

                  <span className={styles.temperature}>
                    {weather
                      ? formatTemperature(weather.current.temperature, units)
                      : '…'}
                  </span>
                </button>

                <button
                  className={styles.removeButton}
                  onClick={() => removePlace(place.id)}
                  aria-label={`Remove ${place.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}