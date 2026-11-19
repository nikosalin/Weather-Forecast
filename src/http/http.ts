import type { z } from 'zod';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Fetch JSON and validate it against a zod schema. */
export async function getJson<S extends z.ZodTypeAny>(
  url: URL,
  schema: S,
  signal?: AbortSignal,
): Promise<z.infer<S>> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new HttpError(
      response.status,
      response.status === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : `Request failed with status ${response.status}`,
    );
  }

  return schema.parse(await response.json());
}