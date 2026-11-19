import type { Coordinates, Place } from '../types';

/** ~1 km precision: plenty for weather, and keeps cache keys stable. */
const PRECISION = 2;

const round = (value: number): number => Number(value.toFixed(PRECISION));

/**
 * Leaflet reports longitudes beyond ±180 when the user pans across the
 * antimeridian (the world repeats horizontally). Wrap them back into range.
 */
export const wrapLongitude = (longitude: number): number =>
  ((((longitude + 180) % 360) + 360) % 360) - 180;

const clampLatitude = (latitude: number): number =>
  Math.min(90, Math.max(-90, latitude));

export function normalizeCoordinates({
  latitude,
  longitude,
}: Coordinates): Coordinates {
  return {
    latitude: round(clampLatitude(latitude)),
    longitude: round(wrapLongitude(longitude)),
  };
}

export function formatCoordinates({
  latitude,
  longitude,
}: Coordinates): string {
  const ns = latitude >= 0 ? 'N' : 'S';
  const ew = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(2)}°${ns}, ${Math.abs(longitude).toFixed(2)}°${ew}`;
}

/** Build a Place from a raw map click or geolocation fix. */
export function createPlaceFromCoordinates(
  raw: Coordinates,
  name?: string,
): Place {
  const coordinates = normalizeCoordinates(raw);
  return {
    id: `${coordinates.latitude},${coordinates.longitude}`,
    name: name ?? formatCoordinates(coordinates),
    coordinates,
  };
}
