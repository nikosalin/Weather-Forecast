# Weather Atlas

An interactive weather exploration app for discovering weather conditions around the world.

Users can search for locations, explore a world map, view current conditions and a five-day forecast, use their current location, and save places to build a personal weather atlas.

## Features

- Search cities and places using the Open-Meteo Geocoding API
- Explore locations by clicking on an interactive world map
- View current weather: temperature, feels-like temperature, wind, humidity, and precipitation
- View a five-day forecast with high/low temperatures and precipitation probability
- Use browser geolocation to view local weather
- Save and remove locations; saved places persist across page refreshes
- Weather markers for saved places on the map
- Metric and imperial units
- Light, dark, and system theme preferences
- Responsive desktop and mobile layouts

## Installation and setup

### Prerequisites

- Node.js 20 or newer
- npm

### Run locally

```bash
git clone <your-repository-url>
cd weather-atlas
npm install
npm run dev
```

## Implementation choices

- React, TypeScript and Vite
- React Leaflet and Leaflet for the interactive map
- OpenStreetMap for map tiles
- TanStack Query for caching, cancellation and request state
- Zustand with local-storage persistence for settings and saved places
- Zod for API response and persisted-state validation
- CSS Modules and CSS variables for feature-scoped styling and theming

Weather requests are cached for ten minutes. Saved-place weather uses Open-Meteo batch requests, and unit conversion happens client-side to avoid unnecessary refetches.

## Incomplete requirements

No explicit assignment requirements were intentionally skipped.

Production-level enhancements outside the scope of this submission:

- No automated test suite
- Map-clicked locations display coordinates rather than a reverse-geocoded nearby place name
- Public OpenStreetMap tiles should be replaced with a production tile provider for higher traffic

## Next steps

- Add unit and integration tests
- Add reverse geocoding for map clicks
- Improve keyboard navigation in search results
- Add hourly forecasts
- Add CI checks for linting, type checking and production builds

## Additional notes

The application uses public Open-Meteo APIs directly from the browser, so no environment variables are required.

The browser's location permission is required for the “My location” feature.
