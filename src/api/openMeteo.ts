import type { Coordinates, Place, WeatherSnapshot } from '../types';
import { getJson } from '../http';
import {
  forecastResponseSchema,
  geocodingResponseSchema,
  type ForecastItem,
  type GeocodingResult,
} from '../schemas';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'is_day',
] as const;

const HOURLY_FIELDS = [
  'temperature_2m',
  'weather_code',
  'precipitation_probability',
  'is_day',
] as const;

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
] as const;

/**
 * Fetch weather for several locations in ONE request (Open-Meteo supports
 * comma-separated coordinates). Results come back in input order.
 *
 * Data is always requested in metric units; unit switching is done client-side
 * so toggling °C/°F never triggers a refetch.
 */
export async function fetchWeather(
  locations: readonly Coordinates[],
  signal?: AbortSignal,
): Promise<WeatherSnapshot[]> {
  if (locations.length === 0) return [];

  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', locations.map((l) => l.latitude).join(','));
  url.searchParams.set(
    'longitude',
    locations.map((l) => l.longitude).join(','),
  );
  url.searchParams.set('current', CURRENT_FIELDS.join(','));
  url.searchParams.set('hourly', HOURLY_FIELDS.join(','));
  url.searchParams.set('forecast_hours', '24');
  url.searchParams.set('daily', DAILY_FIELDS.join(','));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  const data = await getJson(url, forecastResponseSchema, signal);
  const items = Array.isArray(data) ? data : [data];

  return items.map(toSnapshot);
}

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<Place[]> {
  const name = query.trim();
  if (name.length < 2) return [];

  const url = new URL(GEOCODING_URL);
  url.searchParams.set('name', name);
  url.searchParams.set('count', '8');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const data = await getJson(url, geocodingResponseSchema, signal);
  return (data.results ?? []).map(toPlace);
}

function toSnapshot(item: ForecastItem): WeatherSnapshot {
  const { current, hourly, daily } = item;

  return {
    timezone: item.timezone,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
    },
    hourly: hourly.time.map((time, i) => ({
      time,
      temperature: hourly.temperature_2m[i],
      weatherCode: hourly.weather_code[i],
      precipitationProbability: hourly.precipitation_probability[i],
      isDay: hourly.is_day[i] === 1,
    })),
    daily: daily.time.map((date, i) => ({
      date,
      weatherCode: daily.weather_code[i],
      temperatureMax: daily.temperature_2m_max[i],
      temperatureMin: daily.temperature_2m_min[i],
      precipitationProbability: daily.precipitation_probability_max[i],
    })),
  };
}

function toPlace(result: GeocodingResult): Place {
  return {
    id: String(result.id),
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    coordinates: {
      latitude: result.latitude,
      longitude: result.longitude,
    },
  };
}
