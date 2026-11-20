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