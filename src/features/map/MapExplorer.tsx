import { useEffect, type ReactNode } from 'react';
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { describeWeather } from '../../api/weatherCodes';
import { useWeatherForPlaces } from '../../hooks';
import { createPlaceFromCoordinates } from '../../lib/coordinates';
import { usePlacesStore } from '../../schemas';
import type { Coordinates, Place } from '../../types';
import styles from './MapExplorer.module.css';

const WORLD_CENTER: [number, number] = [22, 8];

const WORLD_BOUNDS: [[number, number], [number, number]] = [
  [-85, -180],
  [85, 180],
];

interface MapExplorerProps {
  selectedPlace: Place | null;
  mapTarget: Coordinates | null;
  onPlaceSelect: (place: Place, shouldFlyTo?: boolean) => void;
  children?: ReactNode;
}

function FlyToLocation({ target }: { target: Coordinates | null }) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;

    map.flyTo([target.latitude, target.longitude], 7, {
      duration: 1.2,
    });
  }, [map, target]);

  return null;
}

function MapClickHandler({
  onPick,
}: {
  onPick: (place: Place) => void;
}) {
  useMapEvents({
    click(event) {
      onPick(
        createPlaceFromCoordinates({
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        }),
      );
    },
  });

  return null;
}

function SavedPlaceMarkers({
  onSelect,
}: {
  onSelect: (place: Place) => void;
}) {
  const { places } = usePlacesStore();
  const { data: weatherByPlace } = useWeatherForPlaces(places);

  return places.map((place) => {
    const weather = weatherByPlace?.[place.id];
    const description =
      weather &&
      describeWeather(weather.current.weatherCode, weather.current.isDay);

    return (
      <CircleMarker
        key={place.id}
        center={[place.coordinates.latitude, place.coordinates.longitude]}
        radius={11}
        pathOptions={{
          color: '#ffffff',
          weight: 3,
          fillColor: '#2563eb',
          fillOpacity: 1,
        }}
        eventHandlers={{
          click: () => onSelect(place),
        }}
      >
        <Tooltip direction="top" offset={[0, -9]} opacity={1}>
          {description?.icon ?? '📍'} {place.name}
        </Tooltip>
      </CircleMarker>
    );
  });
}

function SelectedMarker({ place }: { place: Place }) {
  return (
    <CircleMarker
      center={[place.coordinates.latitude, place.coordinates.longitude]}
      radius={8}
      pathOptions={{
        color: '#0f172a',
        weight: 3,
        fillColor: '#fbbf24',
        fillOpacity: 1,
      }}
    />
  );
}

export function MapExplorer({
  selectedPlace,
  mapTarget,
  onPlaceSelect,
  children,
}: MapExplorerProps) {
  const { places } = usePlacesStore();

  return (
    <section className={styles.layout} id="map">
      <MapContainer
        center={WORLD_CENTER}
        zoom={2}
        minZoom={2}
        maxZoom={9}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={1}
        scrollWheelZoom
        className={styles.map}
        inertia={false}
worldCopyJump={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            bounds={WORLD_BOUNDS}
          noWrap
        />

        <FlyToLocation target={mapTarget} />

        <MapClickHandler
          onPick={(place) => onPlaceSelect(place, false)}
        />

        <SavedPlaceMarkers
          onSelect={(place) => onPlaceSelect(place, false)}
        />

        {selectedPlace && <SelectedMarker place={selectedPlace} />}
      </MapContainer>

      <div className={styles.intro}>
        <p className={styles.eyebrow}>Explore the world</p>
        <p className={styles.introText}>
          Click a point to see the live conditions.
        </p>

        {places.length > 0 && (
          <span className={styles.savedCount}>
            {places.length} saved {places.length === 1 ? 'place' : 'places'}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}