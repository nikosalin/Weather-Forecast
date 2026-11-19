import { z } from 'zod';

/**
 * Runtime validation for the Open-Meteo responses we consume.
 * We validate at the boundary so the rest of the app can trust its types.
 */

const currentSchema = z.object({
  time: z.string(),
  temperature_2m: z.number(),
  apparent_temperature: z.number(),
  relative_humidity_2m: z.number(),
  precipitation: z.number(),
  weather_code: z.number(),
  wind_speed_10m: z.number(),
  is_day: z.number(),
});

const dailySchema = z.object({
  time: z.array(z.string()),
  weather_code: z.array(z.number()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  precipitation_probability_max: z.array(z.number().nullable()),
});

const forecastItemSchema = z.object({
  timezone: z.string(),
  current: currentSchema,
  daily: dailySchema,
});

/** Open-Meteo returns an object for one location and an array for several. */
export const forecastResponseSchema = z.union([
  forecastItemSchema,
  z.array(forecastItemSchema),
]);

export type ForecastItem = z.infer<typeof forecastItemSchema>;

const geocodingResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
  admin1: z.string().optional(),
});

/** `results` is omitted entirely by the API when nothing matches. */
export const geocodingResponseSchema = z.object({
  results: z.array(geocodingResultSchema).optional(),
});

export type GeocodingResult = z.infer<typeof geocodingResultSchema>;
