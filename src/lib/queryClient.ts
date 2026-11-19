import { QueryClient } from '@tanstack/react-query';
import { HttpError } from '../http';

/**
 * Open-Meteo's free tier is rate limited, so we are conservative:
 * no refetch on window focus, and no retries on client errors (incl. 429).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) =>
        !(error instanceof HttpError && error.status < 500) && failureCount < 2,
    },
  },
});
