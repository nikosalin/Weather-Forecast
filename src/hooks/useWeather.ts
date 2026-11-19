import {
  keepPreviousData,
  skipToken,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { fetchWeather } from '../api/openMeteo';
import type { Coordinates, Place, WeatherSnapshot } from '../types';
import { normalizeCoordinates } from '../lib/coordinates';

/** Weather models update roughly hourly, so 10 minutes is a safe freshness window. */
const STALE_TIME = 10 * 60 * 1000;
const GC_TIME = 30 * 60 * 1000;

export const weatherKeys = {
  all: ['weather'] as const,
  location: ({ latitude, longitude }: Coordinates) =>
    [...weatherKeys.all, 'location', latitude, longitude] as const,
  batch: (locations: readonly Coordinates[]) =>
    [
      ...weatherKeys.all,
      'batch',
      ...locations.map((l) => `${l.latitude},${l.longitude}`),
    ] as const,
};

/** Weather for a single location (e.g. the map popup). */
export function useWeather(coordinates: Coordinates | null) {
  const target = coordinates ? normalizeCoordinates(coordinates) : null;

  return useQuery({
    queryKey: target ? weatherKeys.location(target) : weatherKeys.all,
    queryFn: target
      ? async ({ signal }) => {
          const [snapshot] = await fetchWeather([target], signal);
          if (!snapshot) throw new Error('No weather data returned');
          return snapshot;
        }
      : skipToken,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

/**
 * Weather for all saved places, keyed by place id.
 *
 * API-friendly by design:
 *  - one HTTP request covers every place that is not already cached,
 *  - results also seed the per-location cache used by `useWeather`,
 *  - adding or removing a place never refetches the others.
 */
export function useWeatherForPlaces(places: readonly Place[]) {
  const queryClient = useQueryClient();
  const locations = places.map((place) => normalizeCoordinates(place.coordinates));

  return useQuery({
    queryKey: weatherKeys.batch(locations),
    queryFn: places.length
      ? ({ signal }) => loadPlaces(queryClient, places, locations, signal)
      : skipToken,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

async function loadPlaces(
  queryClient: QueryClient,
  places: readonly Place[],
  locations: readonly Coordinates[],
  signal: AbortSignal,
): Promise<Record<string, WeatherSnapshot>> {
  const result: Record<string, WeatherSnapshot> = {};
  const missing: { place: Place; location: Coordinates }[] = [];

  places.forEach((place, index) => {
    const location = locations[index];
    const cached = readFresh(queryClient, location);
    if (cached) result[place.id] = cached;
    else missing.push({ place, location });
  });

  if (missing.length > 0) {
    const snapshots = await fetchWeather(
      missing.map((m) => m.location),
      signal,
    );

    missing.forEach(({ place, location }, index) => {
      const snapshot = snapshots[index];
      if (!snapshot) return;
      result[place.id] = snapshot;
      queryClient.setQueryData(weatherKeys.location(location), snapshot);
    });
  }

  return result;
}

function readFresh(
  queryClient: QueryClient,
  location: Coordinates,
): WeatherSnapshot | undefined {
  const state = queryClient.getQueryState<WeatherSnapshot>(
    weatherKeys.location(location),
  );
  const isFresh =
    state?.data !== undefined &&
    Date.now() - state.dataUpdatedAt < STALE_TIME;
  return isFresh ? state.data : undefined;
}