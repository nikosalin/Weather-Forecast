import { PlaceSearch } from '../../features/places/PlaceSearch';
import type { AppHeaderProps } from '../../types';
import styles from './AppHeader.module.css';

export function AppHeader({
  units,
  theme,
  onPlaceSelect,
  onUnitsToggle,
  onThemeCycle,
  onCurrentLocation,
}: AppHeaderProps) {
  const themeIcon = {
    light: '☀',
    dark: '☾',
    system: '◐',
  }[theme];

  return (
    <header className={styles.root}>
      <a className={styles.brand} href="#map" aria-label="Weather Atlas home">
        <span className={styles.brandMark}>◒</span>
        <span className={styles.brandLabel}>Weather Atlas</span>
      </a>

      <PlaceSearch onSelect={onPlaceSelect} />

      <button
        className={styles.locationButton}
        onClick={onCurrentLocation}
        title="Use my location"
      >
        <span aria-hidden="true">◎</span>
        <span className={styles.locationLabel}>My location</span>
      </button>

      <div className={styles.actions}>
        <button className={styles.textButton} onClick={onUnitsToggle}>
          °{units === 'metric' ? 'C' : 'F'}
        </button>

        <button
          className={styles.textButton}
          onClick={onThemeCycle}
          title={`Theme: ${theme}`}
          aria-label={`Change theme. Current setting: ${theme}`}
        >
          <span className={styles.themeIcon} aria-hidden="true">
            {themeIcon}
          </span>
          <span className={styles.themeLabel}>Theme: {theme}</span>
        </button>
      </div>
    </header>
  );
}
