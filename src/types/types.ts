/**
 * Domain types. These are what the UI works with; the raw Open-Meteo
 * response shapes live in `api/schemas.ts` and never leak past `api/`.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Place {
  /** Stable key: geocoding id for searched places, "lat,lon" for map picks. */
  id: string;
  name: string;
  admin1?: string;
  country?: string;
  coordinates: Coordinates;
}

export interface CurrentWeather {
  time: string;
  /** Always °C; converted for display in `lib/units.ts`. */
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  /** mm */
  precipitation: number;
  /** km/h */
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecast {
  /** ISO date (YYYY-MM-DD) in the place's local timezone. */
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  /** 0-100, null when the model has no value. */
  precipitationProbability: number | null;
}

export interface WeatherSnapshot {
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast[];
}

export type UnitSystem = 'metric' | 'imperial';
export type ThemePreference = 'light' | 'dark' | 'system';