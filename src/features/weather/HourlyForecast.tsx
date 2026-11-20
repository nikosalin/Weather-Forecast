import { describeWeather } from '../../api/weatherCodes';
import type {
  HourlyForecast as HourlyForecastType,
  UnitSystem,
} from '../../types';
import { formatTemperature } from '../../units/units';
import styles from './HourlyForecast.module.css';

interface HourlyForecastProps {
  forecast: HourlyForecastType[];
  units: UnitSystem;
}

function formatHour(time: string, index: number): string {
  if (index === 0) {
    return 'Now';
  }

  return time.slice(11, 16);
}

export function HourlyForecast({ forecast, units }: HourlyForecastProps) {
  return (
    <section className={styles.root} aria-label="Hourly forecast">
      <h2 className={styles.title}>Next hours</h2>

      <div className={styles.scrollArea}>
        {forecast.slice(0, 8).map((hour, index) => {
          const weather = describeWeather(hour.weatherCode, hour.isDay);

          return (
            <article className={styles.hour} key={hour.time}>
              <p className={styles.time}>{formatHour(hour.time, index)}</p>

              <span className={styles.icon} aria-label={weather.label}>
                {weather.icon}
              </span>

              <strong className={styles.temperature}>
                {formatTemperature(hour.temperature, units)}
              </strong>

              <span className={styles.rain}>
                💧 {hour.precipitationProbability ?? '—'}%
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
