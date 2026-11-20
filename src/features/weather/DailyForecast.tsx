import { describeWeather } from '../../api/weatherCodes';
import type { DailyForecastProps } from '../../types';

import { formatTemperature } from '../../units/units';
import styles from './DailyForecast.module.css';

function formatDay(date: string, index: number): string {
  if (index === 0) {
    return 'Today';
  }

  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

export function DailyForecast({ forecast, units }: DailyForecastProps) {
  return (
    <section className={styles.root} aria-label="Five day forecast">
      <h2 className={styles.title}>5-day forecast</h2>

      <div className={styles.days}>
        {forecast.slice(0, 5).map((day, index) => {
          const weather = describeWeather(day.weatherCode);

          return (
            <article className={styles.day} key={day.date}>
              <p className={styles.dayName}>{formatDay(day.date, index)}</p>

              <span className={styles.icon} aria-label={weather.label}>
                {weather.icon}
              </span>

              <p className={styles.temperatureRange}>
                <span>{formatTemperature(day.temperatureMax, units)}</span>
                <span>{formatTemperature(day.temperatureMin, units)}</span>
              </p>

              <p className={styles.rain}>
                💧 {day.precipitationProbability ?? '—'}%
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
