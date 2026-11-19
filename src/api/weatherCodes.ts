export interface WeatherDescription {
  label: string;
  icon: string;
}

interface WeatherCodeEntry {
  label: string;
  day: string;
  night: string;
}

const entry = (label: string, day: string, night = day): WeatherCodeEntry => ({
  label,
  day,
  night,
});

/** WMO weather interpretation codes used by Open-Meteo. */
const WEATHER_CODES: Readonly<Record<number, WeatherCodeEntry>> = {
  0: entry('Clear sky', '☀️', '🌙'),
  1: entry('Mainly clear', '🌤️', '🌙'),
  2: entry('Partly cloudy', '⛅', '☁️'),
  3: entry('Overcast', '☁️'),
  45: entry('Fog', '🌫️'),
  48: entry('Rime fog', '🌫️'),
  51: entry('Light drizzle', '🌦️', '🌧️'),
  53: entry('Drizzle', '🌦️', '🌧️'),
  55: entry('Dense drizzle', '🌧️'),
  56: entry('Freezing drizzle', '🌧️'),
  57: entry('Dense freezing drizzle', '🌧️'),
  61: entry('Light rain', '🌦️', '🌧️'),
  63: entry('Rain', '🌧️'),
  65: entry('Heavy rain', '🌧️'),
  66: entry('Freezing rain', '🌧️'),
  67: entry('Heavy freezing rain', '🌧️'),
  71: entry('Light snow', '🌨️'),
  73: entry('Snow', '❄️'),
  75: entry('Heavy snow', '❄️'),
  77: entry('Snow grains', '❄️'),
  80: entry('Light rain showers', '🌦️', '🌧️'),
  81: entry('Rain showers', '🌧️'),
  82: entry('Violent rain showers', '⛈️'),
  85: entry('Light snow showers', '🌨️'),
  86: entry('Heavy snow showers', '🌨️'),
  95: entry('Thunderstorm', '⛈️'),
  96: entry('Thunderstorm with hail', '⛈️'),
  99: entry('Severe thunderstorm with hail', '⛈️'),
};

const UNKNOWN: WeatherDescription = { label: 'Unknown', icon: '❔' };

export function describeWeather(
  code: number,
  isDay = true,
): WeatherDescription {
  const match = WEATHER_CODES[code];
  if (!match) return UNKNOWN;
  return { label: match.label, icon: isDay ? match.day : match.night };
}