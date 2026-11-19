import { describeWeather } from '../../api/weatherCodes';
import { useWeather } from '../../hooks';
import { formatCoordinates } from '../../lib/coordinates';
import { usePlacesStore, useSettingsStore } from '../../schemas';
import type { Place } from '../../types';
import { DailyForecast } from './DailyForecast';
2.
import {
  formatPrecipitation,
  formatTemperature,
  formatWindSpeed,
} from '../../units/units';
import styles from './WeatherPanel.module.css';

interface WeatherPanelProps {
  place: Place;
  onClose: () => void;
}

export function WeatherPanel({ place, onClose }: WeatherPanelProps) {
  const { units } = useSettingsStore();
  const { places, addPlace, removePlace } = usePlacesStore();

  const savedPlace = places.find((item) => item.id === place.id);
  const { data, isPending, error } = useWeather(place.coordinates);

  const weather =
    data && describeWeather(data.current.weatherCode, data.current.isDay);

  const locationDetails =
    [place.admin1, place.country].filter(Boolean).join(', ') ||
    formatCoordinates(place.coordinates);

  return (
    <aside className={styles.root} aria-label="Selected location weather">
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close weather panel"
      >
        ×
      </button>

      <p className={styles.eyebrow}>Selected location</p>
      <h1 className={styles.title}>{place.name}</h1>
      <p className={styles.coordinates}>{locationDetails}</p>

      {isPending && <p className={styles.status}>Loading forecast…</p>}

      {error && (
        <p className={`${styles.status} ${styles.error}`}>
          Weather data could not be loaded.
        </p>
      )}

      {data && weather && (
        <>
          <div className={styles.currentWeather}>
            <span className={styles.icon} aria-hidden="true">
              {weather.icon}
            </span>

            <div>
              <p className={styles.temperature}>
                {formatTemperature(data.current.temperature, units)}
              </p>
              <p className={styles.condition}>{weather.label}</p>
            </div>
          </div>

          <dl className={styles.details}>
            <div>
              <dt>Feels like</dt>
              <dd>
                {formatTemperature(data.current.apparentTemperature, units)}
              </dd>
            </div>
            <div>
              <dt>Wind</dt>
              <dd>{formatWindSpeed(data.current.windSpeed, units)}</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{data.current.humidity}%</dd>
            </div>
            <div>
              <dt>Rain</dt>
              <dd>
                {formatPrecipitation(data.current.precipitation, units)}
              </dd>
            </div>
          </dl>

          <DailyForecast forecast={data.daily} units={units} />
        </>
      )}

      <button
        className={`${styles.saveButton} ${savedPlace ? styles.saved : ''}`}
        onClick={() => {
          if (savedPlace) {
            removePlace(place.id);
          } else {
            addPlace(place);
          }
        }}
      >
        {savedPlace ? '✓ Saved to your atlas' : '+ Save to your atlas'}
      </button>
    </aside>
  );
}