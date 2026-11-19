import type { UnitSystem } from '../types';

/**
 * Weather data is stored in metric (°C, km/h, mm). These helpers convert
 * at the presentation edge only.
 */

const KMH_PER_MPH = 1.609344;
const MM_PER_INCH = 25.4;

export const celsiusToFahrenheit = (celsius: number): number =>
  (celsius * 9) / 5 + 32;

export function formatTemperature(celsius: number, units: UnitSystem): string {
  const value = units === 'metric' ? celsius : celsiusToFahrenheit(celsius);
  return `${Math.round(value)}°${units === 'metric' ? 'C' : 'F'}`;
}

export function formatWindSpeed(kmh: number, units: UnitSystem): string {
  return units === 'metric'
    ? `${Math.round(kmh)} km/h`
    : `${Math.round(kmh / KMH_PER_MPH)} mph`;
}

export function formatPrecipitation(mm: number, units: UnitSystem): string {
  return units === 'metric'
    ? `${mm.toFixed(1)} mm`
    : `${(mm / MM_PER_INCH).toFixed(2)} in`;
}
