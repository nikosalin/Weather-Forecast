import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchPlaces } from '../api/openMeteo';

function useDebouncedValue(value: string, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function usePlaceSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query.trim());

  return useQuery({
    queryKey: ['place-search', debouncedQuery],
    queryFn: ({ signal }) => searchPlaces(debouncedQuery, signal),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}