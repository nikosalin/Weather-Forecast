import type {
  DailyForecast as DailyForecastType,
  Place,
  UnitSystem,
} from '../types';

export interface DailyForecastProps {
  forecast: DailyForecastType[];
  units: UnitSystem;
}

export interface WeatherPanelProps {
  place: Place;
  onClose: () => void;
}

export interface HourlyForecast {
  /** Local ISO datetime, e.g. 2026-11-20T14:00 */
  time: string;
  /** Always °C; converted for display in the UI. */
  temperature: number;
  weatherCode: number;
  /** 0-100, null when unavailable. */
  precipitationProbability: number | null;
  isDay: boolean;
}